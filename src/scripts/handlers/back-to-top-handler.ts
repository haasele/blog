/**
 * Back to top handler
 * Manages back-to-top button and scroll listeners
 */

import {
	SCROLL_CONFIG,
	SWUP_SELECTORS,
} from "../core/swup-config";
import { ScrollHandler } from "./scroll-handler";

/**
 * Back to top handler class
 * Handles back-to-top button visibility and scroll position listening
 */
export class BackToTopHandler {
	private backToTopBtn: HTMLElement | null = null;
	private toc: HTMLElement | null = null;
	private navbar: HTMLElement | null = null;
	private bannerEnabled: boolean;
	private scrollHandler: () => void;

	constructor(bannerEnabled: boolean) {
		this.bannerEnabled = bannerEnabled;
		this.scrollHandler = ScrollHandler.throttle(
			this.handleScroll.bind(this),
			SCROLL_CONFIG.throttleInterval,
		);
	}

	/**
	 * Initialize back to top handler
	 */
	init(): void {
		this.cacheElements();
		this.bindEvents();
	}

	/**
	 * Cache DOM elements
	 */
	private cacheElements(): void {
		this.backToTopBtn = document.getElementById(
			SWUP_SELECTORS.backToTopBtn.slice(1),
		);
		this.toc = document.getElementById(SWUP_SELECTORS.tocWrapper.slice(1));
		this.navbar = document.getElementById(
			SWUP_SELECTORS.navbarWrapper.slice(1),
		);
	}

	/**
	 * Bind event listeners
	 */
	private bindEvents(): void {
		// Use passive listeners for better scroll performance
		window.addEventListener("scroll", this.scrollHandler, {
			passive: true,
		});
		window.addEventListener("resize", this.handleResize.bind(this), {
			passive: true,
		});
	}

	/**
	 * Handle scroll events
	 */
	private handleScroll(): void {
		const scrollTop = document.documentElement.scrollTop;
		const bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100);

		// Calculate back-to-top button show threshold
		const showBackToTopThreshold = this.calculateShowThreshold(scrollTop);

		// Batch DOM operations
		requestAnimationFrame(() => {
			this.updateBackToTopButton(scrollTop, showBackToTopThreshold);
			this.updateTOCVisibility(scrollTop, bannerHeight);
			this.updateNavbarVisibility(scrollTop);
		});
	}

	/**
	 * Calculate back-to-top button show threshold
	 */
	private calculateShowThreshold(scrollTop: number): number {
		const contentWrapper = document.getElementById(
			SWUP_SELECTORS.contentWrapper.slice(1),
		);
		let threshold =
			window.innerHeight * (BANNER_HEIGHT / 100) +
			SCROLL_CONFIG.backToTopOffset;

		if (contentWrapper) {
			const rect = contentWrapper.getBoundingClientRect();
			const absoluteTop = rect.top + scrollTop;
			threshold = absoluteTop + window.innerHeight / 4;
		}

		return threshold;
	}

	/**
	 * Update back-to-top button visibility
	 */
	private updateBackToTopButton(scrollTop: number, threshold: number): void {
		if (!this.backToTopBtn) {
			return;
		}

		if (scrollTop > threshold) {
			this.backToTopBtn.classList.remove("hide");
		} else {
			this.backToTopBtn.classList.add("hide");
		}
	}

	/**
	 * Update TOC visibility
	 */
	private updateTOCVisibility(scrollTop: number, bannerHeight: number): void {
		if (!this.bannerEnabled || !this.toc) {
			return;
		}

		const isBannerMode = document.body.classList.contains("enable-banner");

		if (isBannerMode) {
			if (scrollTop > bannerHeight) {
				this.toc.classList.remove("toc-hide");
			} else {
				this.toc.classList.add("toc-hide");
			}
		} else {
			// Always show TOC in Fullscreen or None mode
			this.toc.classList.remove("toc-hide");
		}
	}

	/**
	 * Update Navbar visibility
	 * Fixed floating navbar stays visible while scrolling.
	 */
	private updateNavbarVisibility(_scrollTop: number): void {
		if (!this.navbar) {
			return;
		}

		this.navbar.classList.remove("navbar-hidden");
	}

	/**
	 * Handle window resize
	 */
	private handleResize(): void {
		// Calculate --banner-height-extend
		// Must be a multiple of 4 to avoid blurry text
		let offset = Math.floor(
			window.innerHeight * (30 / 100), // BANNER_HEIGHT_EXTEND
		);
		offset = offset - (offset % 4);
		document.documentElement.style.setProperty(
			"--banner-height-extend",
			`${offset}px`,
		);
	}

	/**
	 * Destroy handler
	 */
	destroy(): void {
		window.removeEventListener("scroll", this.scrollHandler);
		window.removeEventListener("resize", this.handleResize.bind(this));
		this.backToTopBtn = null;
		this.toc = null;
		this.navbar = null;
	}

	/**
	 * Update banner enabled state
	 */
	setBannerEnabled(enabled: boolean): void {
		this.bannerEnabled = enabled;
	}
}

// Create global instance
let globalBackToTopHandler: BackToTopHandler | null = null;

/**
 * Get global back to top handler instance
 */
export function getBackToTopHandler(bannerEnabled: boolean): BackToTopHandler {
	if (!globalBackToTopHandler) {
		globalBackToTopHandler = new BackToTopHandler(bannerEnabled);
	}
	return globalBackToTopHandler;
}

/**
 * Initialize back to top handler (convenience function)
 */
export function initBackToTopHandler(bannerEnabled: boolean): void {
	const handler = getBackToTopHandler(bannerEnabled);
	handler.init();
}
