import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import type { CollectionEntry } from "astro:content";

import { permalinkConfig } from "../config";
import { generatePermalinkSlug } from "./permalink-utils";

/**
 * Remove file extensions (.md, .mdx, .markdown)
 * Converts Astro v5 Content Layer API ids into URL-friendly slugs
 */
export function removeFileExtension(id: string): string {
	return id.replace(/\.(md|mdx|markdown)$/i, "");
}

export function pathsEqual(path1: string, path2: string) {
	const normalizedPath1 = path1.replace(/^\/|\/$/g, "").toLowerCase();
	const normalizedPath2 = path2.replace(/^\/|\/$/g, "").toLowerCase();
	return normalizedPath1 === normalizedPath2;
}

function joinUrl(...parts: string[]): string {
	const joined = parts.join("/");
	return joined.replace(/\/+/g, "/");
}

export function getPostUrlBySlug(slug: string): string {
	// Remove file extension (e.g. .md, .mdx)
	const slugWithoutExt = removeFileExtension(slug);
	return url(`/posts/${slugWithoutExt}/`);
}

export function getPostUrlByAlias(alias: string): string {
	// Strip leading slashes and keep aliases under /posts/
	const cleanAlias = alias.replace(/^\/+/, "");
	return url(`/posts/${cleanAlias}/`);
}

export function getPostUrl(post: CollectionEntry<"posts">): string;
export function getPostUrl(post: {
	id: string;
	data: { alias?: string; permalink?: string };
}): string;
export function getPostUrl(post: any): string {
	// Prefer a custom post permalink when set (at site root)
	if (post.data.permalink) {
		const slug = post.data.permalink
			.replace(/^\/+/, "")
			.replace(/\/+$/, "");
		return url(`/${slug}/`);
	}

	// When global permalink is enabled, use the generated slug (at site root)
	if (permalinkConfig.enable) {
		const slug = generatePermalinkSlug(post);
		return url(`/${slug}/`);
	}

	// Use alias when present (under /posts/)
	if (post.data.alias) {
		return getPostUrlByAlias(post.data.alias);
	}

	// Otherwise use the default slug path
	return getPostUrlBySlug(post.id);
}

export function getTagUrl(tag: string): string {
	if (!tag) {
		return url("/archive/");
	}
	return url(`/archive/?tag=${encodeURIComponent(tag.trim())}`);
}

export function getCategoryUrl(category: string | null): string {
	if (
		!category ||
		category.trim() === "" ||
		category.trim().toLowerCase() ===
			i18n(I18nKey.uncategorized).toLowerCase()
	) {
		return url("/archive/?uncategorized=true");
	}
	return url(`/archive/?category=${encodeURIComponent(category.trim())}`);
}

export function getDir(path: string): string {
	// Remove file extension
	const pathWithoutExt = removeFileExtension(path);
	const lastSlashIndex = pathWithoutExt.lastIndexOf("/");
	if (lastSlashIndex < 0) {
		return "/";
	}
	return pathWithoutExt.substring(0, lastSlashIndex + 1);
}

export function getFileDirFromPath(filePath: string): string {
	return filePath.replace(/^src\//, "").replace(/\/[^/]+$/, "");
}

export function url(path: string) {
	return joinUrl("", import.meta.env.BASE_URL, path);
}
