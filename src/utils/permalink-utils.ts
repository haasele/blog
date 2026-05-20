import type { CollectionEntry } from "astro:content";

import { permalinkConfig } from "../config";
import { removeFileExtension } from "./url-utils";

// Post ID mapping cache (stores numeric IDs after sorting by publish date)
let postIdMap: Map<string, number> | null = null;

/**
 * Initialize the post ID mapping
 * Sorts by publish date ascending (earliest post id = 1); draft posts are excluded
 * @param posts All non-draft posts
 */
export function initPostIdMap(
	posts: CollectionEntry<"posts">[],
): Map<string, number> {
	if (postIdMap) {
		return postIdMap;
	}

	// Sort by publish date ascending (earliest first)
	const sortedPosts = [...posts].sort(
		(a, b) => a.data.published.getTime() - b.data.published.getTime(),
	);

	postIdMap = new Map();
	sortedPosts.forEach((post, index) => {
		// IDs start at 1
		postIdMap!.set(post.id, index + 1);
	});

	return postIdMap;
}

/**
 * Get the numeric ID for a post
 * @param postId The post's content collection id
 * @returns Post sequence number, or 0 if not initialized
 */
export function getPostNumericId(postId: string): number {
	if (!postIdMap) {
		// Return 0 on the client or when uninitialized; use default slug
		console.warn("Post ID map not initialized. Returning 0 for post_id.");
		return 0;
	}
	return postIdMap.get(postId) ?? 0;
}

/**
 * Clear the post ID mapping cache (for tests or re-initialization)
 */
export function clearPostIdMap(): void {
	postIdMap = null;
}

/**
 * Generate a permalink slug
 * Builds a URL slug from the configured format template and post data
 * @param post Post data
 * @returns Generated slug (without the /posts/ prefix)
 */
export function generatePermalinkSlug(post: CollectionEntry<"posts">): string {
	// Prefer a custom post permalink when set (not under /posts/)
	if (post.data.permalink) {
		// Strip leading and trailing slashes
		return post.data.permalink.replace(/^\/+/, "").replace(/\/+$/, "");
	}

	// When global permalink is disabled, use the default slug
	if (!permalinkConfig.enable) {
		// Use alias when present
		if (post.data.alias) {
			return post.data.alias.replace(/^\/+/, "").replace(/\/+$/, "");
		}
		// Otherwise use the file name
		return removeFileExtension(post.id);
	}

	// Use the global permalink format template
	const format = permalinkConfig.format;

	const published = post.data.published;
	const postname = removeFileExtension(post.id);

	let rawPostname = postname;
	// Use original file name preserving case from filePath if available
	if (post.filePath) {
		const parts = post.filePath.split("/");
		const filename = parts[parts.length - 1];
		if (filename) {
			rawPostname = removeFileExtension(filename);
		}
	}
	const category = post.data.category || "uncategorized";

	// Replace placeholders
	const slug = format
		.replace(/%year%/g, published.getFullYear().toString())
		.replace(
			/%monthnum%/g,
			(published.getMonth() + 1).toString().padStart(2, "0"),
		)
		.replace(/%day%/g, published.getDate().toString().padStart(2, "0"))
		.replace(/%hour%/g, published.getHours().toString().padStart(2, "0"))
		.replace(
			/%minute%/g,
			published.getMinutes().toString().padStart(2, "0"),
		)
		.replace(
			/%second%/g,
			published.getSeconds().toString().padStart(2, "0"),
		)
		.replace(/%post_id%/g, getPostNumericId(post.id).toString())
		.replace(/%postname%/g, postname)
		.replace(/%raw_postname%/g, rawPostname)
		.replace(/%category%/g, category);

	return slug;
}

/**
 * Check whether a post uses a custom permalink (at site root, not under /posts/)
 * @param post Post data
 */
export function hasCustomPermalink(
	post: CollectionEntry<"posts"> | { data: { permalink?: string } },
): boolean {
	return !!post.data.permalink;
}

/**
 * Get the full URL path for a post
 * @param post Post data
 * @returns URL path (e.g. /my-post/ or /custom-path/)
 */
export function getPermalinkPath(post: CollectionEntry<"posts">): string {
	const slug = generatePermalinkSlug(post);

	// All permalink-generated links live at the site root
	return `/${slug}/`;
}
