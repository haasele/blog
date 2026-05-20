/**
 * TOC exports
 *
 * Astro components re-exported via wrappers
 * Import Svelte MobileTOC from @components/MobileTOC.svelte
 */

// Components (compat wrappers)
export { default as FloatingTOC } from "./FloatingTOC.astro";
export { default as SidebarTOC } from "./SidebarTOC.astro";

// Subcomponents
export { default as TOCBadge } from "./components/TOCBadge.astro";
export { default as TOCItemComponent } from "./components/TOCItem.astro";
export { default as TOCProgressBar } from "./components/TOCProgressBar.astro";

// Types
export type {
	HeadingData,
	TOCBaseProps,
	TOCConfig,
	TOCItem,
	TOCObserverOptions,
	TOCScrollOptions,
} from "./types/toc";

// Utilities
export {
	calculateReadingProgress,
	createHeadingObserver,
	debounce,
	extractHeadings,
	generateTOCItems,
	getMinLevel,
	getTOCConfig,
	scrollToHeading,
} from "./utils/toc-utils";

// Hooks
export * from "./hooks/useFloatingTOC";

// Navigation hooks
export {
	createHeadingClickHandler,
	extractHeadingsFromDOM,
	getContainerSelector,
	getTOCConfig as getTocConfig,
	isPostPage,
	scrollToHeading as scrollToTocHeading,
} from "./hooks/useTocNavigation";

// Highlight hooks
export {
	calculateActiveHeadingRange,
	calculateFallbackActiveHeading,
	createHeadingVisibilityObserver,
	findActiveHeadingByObserver,
	findActiveHeadingIndex,
	isElementInViewport,
} from "./hooks/useTocHighlight";

// Scroll hooks
export {
	calculateActiveIndicatorPosition,
	createScrollHandler,
	debounce as debounceScroll,
	calculateReadingProgress as getReadingProgress,
	scrollActiveIntoView,
	throttle as throttleScroll,
	updateProgressRing,
} from "./hooks/useTocScroll";

// Calculator utilities
export {
	getKatakanaBadge,
	JAPANESE_KATAKANA,
	KATAKANA_COUNT,
} from "./utils/japanese-katakana";
export {
	getMinLevel as calcMinLevel,
	generateTOCItems as calcTOCItems,
	getBadgeClass,
	getBadgeText,
	getIndentClass,
	getTextClass,
	isInRange,
} from "./utils/toc-calculator";
