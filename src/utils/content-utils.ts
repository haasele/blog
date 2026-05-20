import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import { initPostIdMap } from "@utils/permalink-utils";
import { getCategoryUrl, getPostUrl } from "@utils/url-utils";
import { type CollectionEntry, getCollection } from "astro:content";

// // Retrieve posts and sort them by publication date
async function getRawSortedPosts() {
	const allBlogPosts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const sorted = allBlogPosts.sort((a, b) => {
		// Sort pinned posts first
		if (a.data.pinned && !b.data.pinned) {
			return -1;
		}
		if (!a.data.pinned && b.data.pinned) {
			return 1;
		}

		// When pinned status matches, sort by priority (lower values first)
		if (a.data.pinned && b.data.pinned) {
			const priorityA = a.data.priority;
			const priorityB = b.data.priority;
			if (priorityA !== undefined && priorityB !== undefined) {
				if (priorityA !== priorityB) {
					return priorityA - priorityB;
				}
			} else if (priorityA !== undefined) {
				return -1;
			} else if (priorityB !== undefined) {
				return 1;
			}
		}

		// Otherwise sort by publish date
		const dateA = new Date(a.data.published);
		const dateB = new Date(b.data.published);
		return dateA > dateB ? -1 : 1;
	});
	return sorted;
}

export async function getSortedPosts() {
	const sorted = await getRawSortedPosts();

	for (let i = 1; i < sorted.length; i++) {
		sorted[i].data.nextSlug = sorted[i - 1].id;
		sorted[i].data.nextTitle = sorted[i - 1].data.title;
	}
	for (let i = 0; i < sorted.length - 1; i++) {
		sorted[i].data.prevSlug = sorted[i + 1].id;
		sorted[i].data.prevTitle = sorted[i + 1].data.title;
	}

	return sorted;
}
export interface PostForList {
	id: string;
	data: CollectionEntry<"posts">["data"];
	url?: string; // Precomputed post URL
}
export async function getSortedPostsList(): Promise<PostForList[]> {
	const sortedFullPosts = await getRawSortedPosts();

	// Initialize post ID mapping for permalink support
	initPostIdMap(sortedFullPosts);

	// delete post.body and precompute URLs
	const sortedPostsList = sortedFullPosts.map((post) => ({
		id: post.id,
		data: post.data,
		url: getPostUrl(post),
	}));

	return sortedPostsList;
}
export interface Tag {
	name: string;
	count: number;
}

export async function getTagList(): Promise<Tag[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	const countMap: Record<string, number> = {};
	allBlogPosts.forEach((post: { data: { tags: string[] } }) => {
		post.data.tags.forEach((tag: string) => {
			if (!countMap[tag]) {
				countMap[tag] = 0;
			}
			countMap[tag]++;
		});
	});

	// sort tags
	const keys: string[] = Object.keys(countMap).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	return keys.map((key) => ({ name: key, count: countMap[key] }));
}

export interface Category {
	name: string;
	count: number;
	url: string;
}

export async function getCategoryList(): Promise<Category[]> {
	const allBlogPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});
	const count: Record<string, number> = {};
	allBlogPosts.forEach((post: { data: { category: string | null } }) => {
		if (!post.data.category) {
			const ucKey = i18n(I18nKey.uncategorized);
			count[ucKey] = count[ucKey] ? count[ucKey] + 1 : 1;
			return;
		}

		const categoryName =
			typeof post.data.category === "string"
				? post.data.category.trim()
				: String(post.data.category).trim();

		count[categoryName] = count[categoryName] ? count[categoryName] + 1 : 1;
	});

	const lst = Object.keys(count).sort((a, b) => {
		return a.toLowerCase().localeCompare(b.toLowerCase());
	});

	const ret: Category[] = [];
	for (const c of lst) {
		ret.push({
			name: c,
			count: count[c],
			url: getCategoryUrl(c),
		});
	}
	return ret;
}

/**
 * Tokenize a title with mixed Chinese and English text
 *
 * - Prefer Intl.Segmenter when the runtime supports it
 * - Fall back to simple regex-based tokenization in environments without Segmenter
 *   (such as some Node runtimes) to avoid build errors
 * - Filter punctuation and whitespace; lowercase English tokens
 */
function tokenizeTitle(title: string): Set<string> {
	const tokens = new Set<string>();

	// Intl.Segmenter may be unavailable at runtime (e.g. some Node environments)
	// Guard here to avoid SSR/build failures
	const hasSegmenter =
		typeof Intl !== "undefined" &&
		"Segmenter" in Intl &&
		typeof (Intl as any).Segmenter === "function";

	if (!hasSegmenter) {
		// Simple fallback: split on whitespace and punctuation
		const basicTokens = title
			.toLowerCase()
			.split(/[\s\p{P}]+/gu)
			.filter(Boolean);
		for (const t of basicTokens) {
			tokens.add(t);
		}
		return tokens;
	}

	// Use Intl.Segmenter for finer mixed Chinese/English tokenization
	const segmenter = new (Intl as any).Segmenter("zh", {
		granularity: "word",
	});
	for (const { segment, isWordLike } of segmenter.segment(title)) {
		if (!isWordLike) {
			continue;
		}
		tokens.add((segment as string).toLowerCase());
	}
	return tokens;
}

/**
 * Compute Jaccard similarity between two sets
 */
function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
	if (a.size === 0 && b.size === 0) {
		return 0;
	}
	let intersection = 0;
	for (const item of a) {
		if (b.has(item)) {
			intersection++;
		}
	}
	const union = a.size + b.size - intersection;
	return union === 0 ? 0 : intersection / union;
}

/**
 * Get related post recommendations
 * Scoring formula: totalScore = tagMatchScore + titleSimilarityScore + timeFreshnessScore + categoryBonus
 * - tagMatchScore (0-100): tag Jaccard similarity × 100
 * - titleSimilarityScore (0-100): title token Jaccard similarity × 100
 * - timeFreshnessScore (0-30): exponential decay with a 6-month half-life
 * - categoryBonus (0 or 10): +10 for matching category
 */
export async function getRelatedPosts(
	currentPost: CollectionEntry<"posts">,
	maxCount = 5,
): Promise<PostForList[]> {
	const allPosts = await getCollection<"posts">("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	// Exclude the current post and password-protected posts
	const candidates = allPosts.filter(
		(p) => p.id !== currentPost.id && !p.data.password,
	);

	const currentTags = new Set(currentPost.data.tags || []);
	const currentTokens = tokenizeTitle(currentPost.data.title);
	const currentCategory = currentPost.data.category || "";
	const now = Date.now();

	const scored = candidates.map((post) => {
		const postTags = new Set(post.data.tags || []);

		// tagMatchScore (0-100)
		const tagMatchScore = jaccardSimilarity(currentTags, postTags) * 100;

		// titleSimilarityScore (0-100)
		const postTokens = tokenizeTitle(post.data.title);
		const titleSimilarityScore =
			jaccardSimilarity(currentTokens, postTokens) * 100;

		// timeFreshnessScore (0-30): 6-month half-life
		const daysSincePublished =
			(now - new Date(post.data.published).getTime()) /
			(1000 * 60 * 60 * 24);
		const timeFreshnessScore =
			30 * Math.exp((-Math.LN2 * daysSincePublished) / 180);

		// categoryBonus (0 or 10)
		const postCategory = post.data.category || "";
		const categoryBonus =
			currentCategory && postCategory && currentCategory === postCategory
				? 10
				: 0;

		const totalScore =
			tagMatchScore +
			titleSimilarityScore +
			timeFreshnessScore +
			categoryBonus;

		return {
			post,
			totalScore,
			tagMatchScore,
			timeFreshnessScore,
			categoryBonus,
		};
	});

	// Sort by total score descending
	scored.sort((a, b) => b.totalScore - a.totalScore);

	// Prefer posts with tag matches first
	const withTagMatch = scored.filter((s) => s.tagMatchScore > 0);
	const withoutTagMatch = scored.filter((s) => s.tagMatchScore === 0);

	const result: PostForList[] = [];

	for (const s of withTagMatch) {
		if (result.length >= maxCount) {
			break;
		}
		result.push({ id: s.post.id, data: s.post.data });
	}

	// Fill remaining slots from candidates sorted by timeFreshnessScore + categoryBonus
	if (result.length < maxCount) {
		withoutTagMatch.sort(
			(a, b) =>
				b.timeFreshnessScore +
				b.categoryBonus -
				(a.timeFreshnessScore + a.categoryBonus),
		);
		for (const s of withoutTagMatch) {
			if (result.length >= maxCount) {
				break;
			}
			result.push({ id: s.post.id, data: s.post.data });
		}
	}

	return result;
}
