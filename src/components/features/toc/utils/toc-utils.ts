/**
 * Shared TOC utilities
 */

import type { HeadingData, TOCConfig, TOCItem } from "../types/toc";
import { getKatakanaBadge } from "./japanese-katakana";

/**
 * Extract heading data from DOM
 * @param containerSelector - Container selector
 * @returns Heading data array
 */
export function extractHeadings(
	containerSelector = "#post-container",
): HeadingData[] {
	const container = document.querySelector(containerSelector);
	if (!container) {
		return [];
	}

	const headings = container.querySelectorAll(
		"h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]",
	);
	return Array.from(headings).map((h) => ({
		id: h.id,
		text: (h.textContent || "").replace(/#+\s*$/, ""),
		level: parseInt(h.tagName[1]),
	}));
}

/**
 * Compute minimum heading level
 * @param headings - Heading data array
 * @returns Minimum level
 */
export function getMinLevel(headings: HeadingData[]): number {
	if (headings.length === 0) {
		return 1;
	}
	return Math.min(...headings.map((h) => h.level));
}

/**
 * Filter headings and build TOC entries
 * @param headings - Heading data array
 * @param config - TOC config
 * @returns TOC entry array
 */
export function generateTOCItems(
	headings: HeadingData[],
	config: TOCConfig,
): TOCItem[] {
	if (headings.length === 0) {
		return [];
	}

	const minLevel = getMinLevel(headings);
	const maxDepth = config.depth;

	let h1Count = 0;

	return headings
		.filter((h) => h.level < minLevel + maxDepth)
		.map((h) => {
			const depth = h.level - minLevel;
			let badge: string | undefined;

			if (h.level === minLevel) {
				badge = getKatakanaBadge(h1Count, config.useJapaneseBadge);
				h1Count++;
			}

			return {
				id: h.id,
				text: h.text,
				level: h.level,
				depth,
				badge,
			};
		});
}

/**
 * Scroll to heading
 * @param id - Heading id
 * @param offset - Top offset (navbar)
 */
export function scrollToHeading(id: string, offset = 80): void {
	const element = document.getElementById(id);
	if (!element) {
		return;
	}

	const targetTop =
		element.getBoundingClientRect().top + window.scrollY - offset;
	window.scrollTo({
		top: targetTop,
		behavior: "smooth",
	});
}

/**
 * Create heading visibility observer
 * @param onActiveChange - Active heading callback
 * @param options - Observer options
 * @returns IntersectionObserver instance
 */
export function createHeadingObserver(
	onActiveChange: (id: string) => void,
	options: { rootMargin?: string; threshold?: number } = {},
): IntersectionObserver {
	const { rootMargin = "-80px 0px -80% 0px", threshold = 0 } = options;

	return new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting && entry.target.id) {
					onActiveChange(entry.target.id);
				}
			});
		},
		{ rootMargin, threshold },
	);
}

/**
 * Get TOC config from global settings
 * @returns TOC config
 */
export function getTOCConfig(): TOCConfig {
	const siteConfig = window.siteConfig || {};
	return {
		enable: siteConfig.toc?.enable ?? true,
		mode: siteConfig.toc?.mode ?? "sidebar",
		depth: siteConfig.toc?.depth ?? 3,
		useJapaneseBadge: siteConfig.toc?.useJapaneseBadge ?? false,
	};
}

/**
 * Compute reading progress
 * @returns Progress 0–1
 */
export function calculateReadingProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * Debounce
 * @param fn - Function to debounce
 * @param delay - Delay in ms
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}
