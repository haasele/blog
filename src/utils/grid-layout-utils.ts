/**
 * Grid layout utilities
 * Server-side layout calculations used by MainGridLayout
 */
import type { SiteConfig } from "../types/config";
import type { widgetManager } from "./widget-manager";

/**
 * Banner image configuration
 */
export interface BannerImages {
	desktop: string | string[];
	mobile: string | string[];
}

/**
 * Layout configuration interface
 */
export interface GridLayoutConfig {
	siteConfig: SiteConfig;
	widgetManager: typeof widgetManager;
}

/**
 * Sidebar presence configuration
 */
export interface SidebarPresence {
	hasLeftSidebarComponents: boolean;
	hasRightSidebarComponents: boolean;
	hasMobileDrawerComponents: boolean;
	hasTabletLeftSidebarComponents: boolean;
}

/**
 * Grid layout calculation result
 */
export interface GridLayoutResult {
	gridCols: string;
	sidebarClass: string;
	rightSidebarClass: string;
	mainContentClass: string;
	sidebarPresence: SidebarPresence;
	mobileShowSidebar: boolean;
	tabletShowSidebar: boolean;
	desktopShowSidebar: boolean;
	desktopShowLeftSidebar: boolean;
	desktopShowRightSidebar: boolean;
	tabletShowLeftSidebar: boolean;
	tabletShowRightSidebar: boolean;
	tabletAnySidebar: boolean;
	initialRightSidebarHidden: boolean;
	desktopMainPos: string;
}

/**
 * Determine which sidebar widgets are present
 */
export function getSidebarPresence(wm: typeof widgetManager): SidebarPresence {
	const hasLeftSidebarComponents =
		wm.getComponentsByPosition("top", "left", "desktop").length > 0 ||
		wm.getComponentsByPosition("sticky", "left", "desktop").length > 0;

	const hasRightSidebarComponents =
		wm.getComponentsByPosition("top", "right", "desktop").length > 0 ||
		wm.getComponentsByPosition("sticky", "right", "desktop").length > 0;

	const hasMobileDrawerComponents =
		wm.getComponentsByPosition("top", "drawer", "mobile").length > 0 ||
		wm.getComponentsByPosition("sticky", "drawer", "mobile").length > 0;

	const hasTabletLeftSidebarComponents =
		wm.getComponentsByPosition("top", "left", "tablet").length > 0 ||
		wm.getComponentsByPosition("sticky", "left", "tablet").length > 0;

	return {
		hasLeftSidebarComponents,
		hasRightSidebarComponents,
		hasMobileDrawerComponents,
		hasTabletLeftSidebarComponents,
	};
}

/**
 * Calculate grid layout
 */
export function calculateGridLayout(
	config: GridLayoutConfig,
): GridLayoutResult {
	const { siteConfig, widgetManager: wm } = config;
	const presence = getSidebarPresence(wm);

	const {
		hasLeftSidebarComponents,
		hasRightSidebarComponents,
		hasMobileDrawerComponents,
		hasTabletLeftSidebarComponents,
	} = presence;

	// Check whether sidebars are enabled and adjust the grid dynamically
	const mobileShowSidebar = hasMobileDrawerComponents;
	const tabletShowSidebar = hasTabletLeftSidebarComponents;
	const desktopShowSidebar =
		hasLeftSidebarComponents || hasRightSidebarComponents;

	// Final desktop sidebar visibility (based on configured widgets)
	const desktopShowLeftSidebar = hasLeftSidebarComponents;
	const desktopShowRightSidebar = hasRightSidebarComponents;

	// Final tablet sidebar visibility
	const tabletShowLeftSidebar = hasTabletLeftSidebarComponents;
	// Tablet has no separate right sidebar; moved-right widgets appear via tabletShowLeftSidebar
	const tabletShowRightSidebar = false;
	const tabletAnySidebar = tabletShowLeftSidebar;

	// In grid mode, hide the right sidebar initially
	const defaultPostListLayout =
		siteConfig.postListLayout?.defaultMode || "list";
	const initialRightSidebarHidden = defaultPostListLayout === "grid";

	// Dynamic grid column classes based on sidebar mode and widget presence
	let desktopGridCols = "lg:grid-cols-1";
	if (desktopShowLeftSidebar && desktopShowRightSidebar) {
		desktopGridCols = "lg:grid-cols-[17.5rem_1fr_17.5rem]";
	} else if (desktopShowLeftSidebar) {
		desktopGridCols = "lg:grid-cols-[17.5rem_1fr]";
	} else if (desktopShowRightSidebar) {
		desktopGridCols = "lg:grid-cols-[1fr_17.5rem]";
	}

	const gridCols = `
		${mobileShowSidebar ? "grid-cols-1" : "grid-cols-1"}
		${tabletAnySidebar ? "md:grid-cols-[17.5rem_1fr]" : "md:grid-cols-1"}
		${desktopGridCols}
	`
		.trim()
		.replace(/\s+/g, " ");

	// Left sidebar container classes
	const sidebarClass = `
		onload-animation
		${mobileShowSidebar && hasMobileDrawerComponents ? "block" : "hidden"}
		${tabletShowLeftSidebar ? "md:block md:mb-4 md:max-w-[17.5rem]" : "md:hidden"}
		${desktopShowLeftSidebar ? "lg:block lg:mb-4 lg:row-start-1 lg:row-end-2 lg:max-w-[17.5rem] lg:col-start-1 lg:col-end-2" : "lg:hidden"}
	`
		.trim()
		.replace(/\s+/g, " ");

	// Right sidebar container classes
	const rightSidebarClass = `
		onload-animation
		hidden
		${tabletShowRightSidebar ? "md:block md:mb-4 md:max-w-[17.5rem]" : "md:hidden"}
		${desktopShowRightSidebar ? `lg:block lg:self-start lg:h-fit lg:mb-4 lg:max-w-[17.5rem] ${desktopShowLeftSidebar ? "lg:col-start-3 lg:col-end-4" : "lg:col-start-2 lg:col-end-3"} lg:col-span-1` : "lg:hidden"}
		${initialRightSidebarHidden ? "hidden-in-grid-mode" : ""}
	`
		.trim()
		.replace(/\s+/g, " ");

	// Main content classes adjusted by sidebar mode
	let desktopMainPos = "lg:col-span-1";
	if (desktopShowLeftSidebar && desktopShowRightSidebar) {
		desktopMainPos = "lg:col-start-2 lg:col-end-3";
	} else if (desktopShowLeftSidebar) {
		desktopMainPos = "lg:col-start-2 lg:col-end-3";
	} else if (desktopShowRightSidebar) {
		desktopMainPos = "lg:col-start-1 lg:col-end-2";
	}

	const mainContentClass = `
		transition-swup-fade overflow-hidden w-full
		col-span-1 row-start-1 row-end-2
		${tabletAnySidebar ? "md:col-start-2 md:col-end-3" : "md:col-start-1 md:col-end-2"}
		${desktopShowSidebar ? desktopMainPos : "lg:col-span-1"}
	`
		.trim()
		.replace(/\s+/g, " ");

	return {
		gridCols,
		sidebarClass,
		rightSidebarClass,
		mainContentClass,
		sidebarPresence: presence,
		mobileShowSidebar,
		tabletShowSidebar,
		desktopShowSidebar,
		desktopShowLeftSidebar,
		desktopShowRightSidebar,
		tabletShowLeftSidebar,
		tabletShowRightSidebar,
		tabletAnySidebar,
		initialRightSidebarHidden,
		desktopMainPos,
	};
}

/**
 * Resolve banner images
 */
export async function getBannerImages(
	siteConfig: SiteConfig,
): Promise<BannerImages> {
	let bannerSrc = siteConfig.banner.src;

	// Fetch images from the API when enabled
	if (siteConfig.banner.imageApi?.enable && siteConfig.banner.imageApi?.url) {
		try {
			const response = await fetch(siteConfig.banner.imageApi.url);
			const text = await response.text();
			const apiImages = text.split("\n").filter((line) => line.trim());

			if (apiImages.length > 0) {
				bannerSrc = apiImages;
			}
		} catch (error) {
			console.warn("Failed to fetch images from API:", error);
		}
	}

	if (
		typeof bannerSrc === "object" &&
		bannerSrc !== null &&
		!Array.isArray(bannerSrc) &&
		("desktop" in bannerSrc || "mobile" in bannerSrc)
	) {
		const srcObj = bannerSrc as {
			desktop?: string | string[];
			mobile?: string | string[];
		};
		return {
			desktop: srcObj.desktop || srcObj.mobile || "",
			mobile: srcObj.mobile || srcObj.desktop || "",
		};
	}
	// String or string array values apply to both desktop and mobile
	return {
		desktop: bannerSrc as string | string[],
		mobile: bannerSrc as string | string[],
	};
}

/**
 * Check whether transparency should be enabled
 */
export function shouldEnableTransparency(
	defaultWallpaperMode: string,
): boolean {
	return defaultWallpaperMode === "fullscreen";
}

/**
 * Get transparency CSS class name
 */
export function getTransparencyClass(shouldEnable: boolean): string {
	return shouldEnable ? "wallpaper-transparent" : "";
}

/**
 * Calculate main content top offset
 */
export function getMainPanelTop(
	defaultWallpaperMode: string,
	bannerHeightVh: number,
): string {
	return defaultWallpaperMode === "banner" ? `${bannerHeightVh}vh` : "5.5rem";
}
