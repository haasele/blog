/**
 * Swup hooks module
 * Handles hook events during page transitions
 */

import { pathsEqual, url } from "../../utils/url-utils";
import type { FancyboxHandler } from "../handlers/fancybox-handler";
import type { ScrollHandler } from "../handlers/scroll-handler";
import {
	ANIMATION_CONFIG,
	BANNER_HEIGHT,
	SWUP_SELECTORS,
	THEME_CONFIG,
} from "./swup-config";

// Hook handler interface
export interface SwupHookHandlers {
	fancyboxHandler?: FancyboxHandler;
	scrollHandler?: ScrollHandler;
	showBanner?: () => void;
	initFancybox?: () => void;
	cleanupFancybox?: () => void;
	initCustomScrollbar?: () => void;
	checkKatex?: () => void;
}

// Visit object type
interface VisitObject {
	to: {
		url: string;
	};
}

/**
 * Swup hooks manager
 * Registers and manages all Swup page transition hooks
 */
export class SwupHooksManager {
	private bannerEnabled: boolean;
	private handlers: SwupHookHandlers;

	private cachedElements: Map<string, Element | null> = new Map();

	constructor(bannerEnabled: boolean, handlers: SwupHookHandlers = {}) {
		this.bannerEnabled = bannerEnabled;
		this.handlers = handlers;
	}

	private getCachedElement(selector: string): Element | null {
		if (!this.cachedElements.has(selector)) {
			const id = selector.startsWith("#") ? selector.slice(1) : selector;
			if (selector.startsWith("#")) {
				this.cachedElements.set(selector, document.getElementById(id));
			} else {
				this.cachedElements.set(
					selector,
					document.querySelector(selector),
				);
			}
		}
		return this.cachedElements.get(selector) ?? null;
	}

	private clearCache(): void {
		this.cachedElements.clear();
	}

	/**
	 * Register all Swup hooks
	 */
	registerHooks(): void {
		if (!window.swup) {
			return;
		}
		this.registerLinkClickHook();
		this.registerContentReplaceHook();
		this.registerVisitStartHook();
		this.registerPageViewHook();
		this.registerVisitEndHook();
	}

	/**
	 * link:click hook
	 * Handle initial state on link click
	 */
	private registerLinkClickHook(): void {
		window.swup!.hooks.on("link:click", () => {
			// Remove first page load delay
			document.documentElement.style.setProperty(
				"--content-delay",
				"0ms",
			);

			// Handle navbar hide
			if (this.bannerEnabled) {
				this.handleNavbarHideOnLinkClick();
			}
		});
	}

	/**
	 * content:replace hook
	 * Handle initialization after content replacement
	 */
	private registerContentReplaceHook(): void {
		window.swup!.hooks.on("content:replace", () => {
			this.clearCache();

			// Initialize images, formulas, scrollbars, and TOC on new page
			this.handlers.initFancybox?.();
			this.handlers.checkKatex?.();
			this.handlers.initCustomScrollbar?.();

			// Handle TOC reinitialization
			this.handleTOCReinit();

			// Reinitialize semifull mode scroll detection
			this.reinitSemifullScrollDetection();
		});
	}

	/**
	 * visit:start hook
	 * Handle state when page visit starts
	 */
	private registerVisitStartHook(): void {
		window.swup!.hooks.on("visit:start", ((...args: unknown[]) => {
			const visit = args[0] as VisitObject;
			// Clean up Fancybox from previous page
			this.handlers.cleanupFancybox?.();

			// Handle page state
			const isHomePage = pathsEqual(visit.to.url, url("/"));
			this.handleBodyClass(isHomePage);
			this.handleBannerTextVisibility(isHomePage);
			this.handleNavbarState(isHomePage);
			this.handleMobileBannerVisibility(isHomePage);

			// Extend page height to prevent scroll animation jump
			this.extendPageHeight(false);

			// Hide TOC
			this.hideTOC();
		}) as (...args: unknown[]) => void);
	}

	/**
	 * page:view hook
	 * Handle page view display
	 */
	private registerPageViewHook(): void {
		window.swup!.hooks.on("page:view", () => {
			// Extend page height
			this.extendPageHeight(false);

			// Scroll to top of page
			window.scrollTo({
				top: 0,
				behavior: "instant",
			});

			// Sync theme state
			this.syncThemeState();

			// Dispatch page loaded event
			this.dispatchPageLoadedEvent();
		});
	}

	/**
	 * visit:end hook
	 * Handle cleanup when page visit ends
	 */
	private registerVisitEndHook(): void {
		window.swup!.hooks.on("visit:end", (() => {
			setTimeout(() => {
				// Hide height extend element
				this.extendPageHeight(true);

				// Show TOC
				this.showTOC();
			}, ANIMATION_CONFIG.heightExtendDelay);
		}) as (...args: unknown[]) => void);
	}

	// ==================== Private helper methods ====================

	/**
	 * Handle navbar hide on link click
	 */
	private handleNavbarHideOnLinkClick(): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbarWrapper);
		navbar?.classList.remove("navbar-hidden");
	}

	/**
	 * Handle TOC reinitialization
	 */
	private handleTOCReinit(): void {
		const tocWrapper = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		const isArticlePage = tocWrapper !== null;

		if (isArticlePage) {
			const tocElement = this.getCachedElement(
				SWUP_SELECTORS.tableOfContents,
			);
			const hasDesktopTOC =
				tocElement && typeof (tocElement as any).init === "function";
			const hasMobileTOC =
				typeof (window as any).mobileTOCInit === "function";

			if (hasDesktopTOC || hasMobileTOC) {
				setTimeout(() => {
					if (hasDesktopTOC) {
						(tocElement as any).init();
					}
					if (hasMobileTOC) {
						(window as any).mobileTOCInit();
					}
				}, ANIMATION_CONFIG.tocReadyDelay);
			}
		}
	}

	/**
	 * Reinitialize semifull mode scroll detection
	 */
	private reinitSemifullScrollDetection(): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbar);
		if (navbar) {
			const transparentMode = navbar.getAttribute(
				"data-transparent-mode",
			);
			if (transparentMode === "semifull") {
				if (
					typeof (window as any).initSemifullScrollDetection ===
					"function"
				) {
					(window as any).initSemifullScrollDetection();
				}
			}
		}
	}

	/**
	 * Handle body class
	 */
	private handleBodyClass(isHomePage: boolean): void {
		const bodyElement = this.getCachedElement("body");
		if (bodyElement) {
			if (isHomePage) {
				bodyElement.classList.add("lg:is-home");
			} else {
				bodyElement.classList.remove("lg:is-home");
			}
		}
	}

	/**
	 * Handle Banner text visibility
	 */
	private handleBannerTextVisibility(isHomePage: boolean): void {
		const bannerTextOverlay = this.getCachedElement(
			SWUP_SELECTORS.bannerTextOverlay,
		);
		if (bannerTextOverlay) {
			if (isHomePage) {
				bannerTextOverlay.classList.remove("hidden");
			} else {
				bannerTextOverlay.classList.add("hidden");
			}
		}
	}

	/**
	 * Handle Navbar state
	 */
	private handleNavbarState(isHomePage: boolean): void {
		const navbar = this.getCachedElement(SWUP_SELECTORS.navbar);
		if (navbar) {
			navbar.setAttribute("data-is-home", isHomePage.toString());

			// Reinitialize semifull mode scroll detection
			const transparentMode = navbar.getAttribute(
				"data-transparent-mode",
			);
			if (transparentMode === "semifull") {
				if (
					typeof (window as any).initSemifullScrollDetection ===
					"function"
				) {
					(window as any).initSemifullScrollDetection();
				}
			}
		}
	}

	/**
	 * Handle mobile Banner visibility
	 */
	private handleMobileBannerVisibility(isHomePage: boolean): void {
		const bannerWrapper = this.getCachedElement(
			SWUP_SELECTORS.bannerWrapper,
		);
		const mainContentWrapper = this.getCachedElement(
			".absolute.w-full.z-30",
		);

		if (bannerWrapper && mainContentWrapper) {
			if (isHomePage) {
				// Home page: delay removing hide class
				setTimeout(() => {
					bannerWrapper.classList.remove("mobile-hide-banner");
				}, ANIMATION_CONFIG.mobileBannerDelay);
				setTimeout(() => {
					mainContentWrapper.classList.remove(
						"mobile-main-no-banner",
					);
				}, ANIMATION_CONFIG.mobileContentDelay);
			} else {
				// Non-home page: hide in stages
				bannerWrapper.classList.add("mobile-hide-banner");
				setTimeout(() => {
					mainContentWrapper.classList.add("mobile-main-no-banner");
				}, ANIMATION_CONFIG.mobileBannerDelay);
			}
		}
	}

	/**
	 * Extend/hide page height
	 */
	private extendPageHeight(hide: boolean): void {
		const heightExtend = this.getCachedElement(
			SWUP_SELECTORS.pageHeightExtend,
		);
		if (!heightExtend) {
			return;
		}

		// Only enable height extension in Banner mode
		// In fullscreen/none mode content is often less than one screen; forcing height extension
		// causes scrollbar flash during page transition and horizontal layout jitter
		const isBannerMode = document.body.classList.contains("enable-banner");
		if (!isBannerMode) {
			return;
		}

		if (hide) {
			heightExtend.classList.add("hidden");
		} else {
			heightExtend.classList.remove("hidden");
		}
	}

	/**
	 * Hide TOC
	 */
	private hideTOC(): void {
		const toc = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		if (toc) {
			toc.classList.add("toc-not-ready");
		}
	}

	/**
	 * Show TOC
	 */
	private showTOC(): void {
		const toc = this.getCachedElement(SWUP_SELECTORS.tocWrapper);
		if (toc) {
			toc.classList.remove("toc-not-ready");
		}
	}

	/**
	 * Sync theme state
	 * Fix code block rendering when navigating from home to article page
	 */
	private syncThemeState(): void {
		const storedTheme =
			localStorage.getItem(THEME_CONFIG.themeStorageKey) ||
			THEME_CONFIG.lightMode;
		const isDark = storedTheme === THEME_CONFIG.darkMode;
		const expectedTheme = isDark
			? THEME_CONFIG.darkExpressiveTheme
			: THEME_CONFIG.lightExpressiveTheme;

		const currentTheme =
			document.documentElement.getAttribute("data-theme");
		const hasDarkClass =
			document.documentElement.classList.contains("dark");

		// If theme mismatch, use batched updates to reduce repaints
		if (currentTheme !== expectedTheme || hasDarkClass !== isDark) {
			requestAnimationFrame(() => {
				// Sync data-theme attribute
				if (currentTheme !== expectedTheme) {
					document.documentElement.setAttribute(
						"data-theme",
						expectedTheme,
					);
				}
				// Sync dark class
				if (hasDarkClass !== isDark) {
					if (isDark) {
						document.documentElement.classList.add("dark");
					} else {
						document.documentElement.classList.remove("dark");
					}
				}
			});
		}
	}

	/**
	 * Dispatch page loaded event
	 * Used to initialize comment system
	 */
	private dispatchPageLoadedEvent(): void {
		setTimeout(() => {
			if (
				document.getElementById("tcomment") ||
				document.getElementById("giscus-container")
			) {
				const pageLoadedEvent = new CustomEvent("mizuki:page:loaded", {
					detail: {
						path: window.location.pathname,
						timestamp: Date.now(),
					},
				});
				document.dispatchEvent(pageLoadedEvent);
				console.log(
					"Layout: dispatching mizuki:page:loaded event, path:",
					window.location.pathname,
				);
			}
		}, ANIMATION_CONFIG.commentInitDelay);
	}

	/**
	 * Update handlers
	 */
	updateHandlers(handlers: Partial<SwupHookHandlers>): void {
		this.handlers = { ...this.handlers, ...handlers };
	}
}
