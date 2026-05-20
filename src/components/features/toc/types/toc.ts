/**
 * Shared TOC types
 */

export interface TOCItem {
	/** Heading id (anchor) */
	id: string;
	/** Heading text */
	text: string;
	/** Heading level (1-6) */
	level: number;
	/** Relative depth (0 = top) */
	depth: number;
	/** Badge (number or Japanese) */
	badge?: string;
}

export interface TOCConfig {
	/** TOC enabled */
	enable: boolean;
	/** Display mode */
	mode: "float" | "sidebar";
	/** Heading depth (1-6) */
	depth: number;
	/** Japanese badges */
	useJapaneseBadge: boolean;
}

export interface HeadingData {
	/** Heading id */
	id: string;
	/** Heading text */
	text: string;
	/** Heading level (1-6) */
	level: number;
}

export interface TOCBaseProps {
	/** Custom class name */
	class?: string;
}

export interface TOCObserverOptions {
	/** Root margin */
	rootMargin?: string;
	/** Threshold */
	threshold?: number;
	/** Active heading change callback */
	onActiveChange?: (id: string) => void;
}

export interface TOCScrollOptions {
	/** Top offset (navbar) */
	offset?: number;
	/** Smooth scrolling */
	behavior?: ScrollBehavior;
}
