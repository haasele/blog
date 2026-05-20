/**
 * Shared TOC types
 */

/**
 * TOC entry shape
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

/**
 * TOC config
 */
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

/**
 * Heading data from DOM
 */
export interface HeadingData {
	/** Heading id */
	id: string;
	/** Heading text */
	text: string;
	/** Heading level (1-6) */
	level: number;
}

/**
 * Base TOC component props
 */
export interface TOCBaseProps {
	/** Custom class name */
	class?: string;
}
