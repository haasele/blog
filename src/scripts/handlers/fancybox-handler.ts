/**
 * Fancybox handler
 * Manages image lightbox initialization and cleanup
 */

import {
	FANCYBOX_SELECTORS,
	getDefaultFancyboxConfig,
} from "../core/swup-config";

// Fancybox module type
type FancyboxType = any;

/**
 * Fancybox handler class
 * Handles on-demand loading and management of image lightbox
 */
export class FancyboxHandler {
	private Fancybox: FancyboxType | null = null;
	private boundSelectors: string[] = [];
	private initialized = false;

	/**
	 * Initialize Fancybox
	 * Loads Fancybox module and styles on demand
	 */
	async init(): Promise<void> {
		const hasImages = this.checkForImages();

		if (!hasImages) {
			return;
		}

		// Load Fancybox module on demand
		if (!this.Fancybox) {
			await this.loadFancybox();
		}

		// Avoid duplicate initialization
		if (this.boundSelectors.length > 0) {
			return;
		}

		this.bindImageSelectors();
		this.initialized = true;
	}

	/**
	 * Check if page has images that need Fancybox
	 */
	private checkForImages(): boolean {
		return (
			document.querySelector(FANCYBOX_SELECTORS.albumImages) !== null ||
			document.querySelector(FANCYBOX_SELECTORS.albumLinks) !== null ||
			document.querySelector(FANCYBOX_SELECTORS.singleFancybox) !== null
		);
	}

	/**
	 * Load Fancybox module and styles
	 */
	private async loadFancybox(): Promise<void> {
		const mod = await import("@fancyapps/ui");
		this.Fancybox = mod.Fancybox;
		await import("@fancyapps/ui/dist/fancybox/fancybox.css");
	}

	/**
	 * Bind image selectors
	 */
	private bindImageSelectors(): void {
		if (!this.Fancybox) {
			return;
		}

		const commonConfig = getDefaultFancyboxConfig();

		// Bind album/post images
		this.Fancybox.bind(FANCYBOX_SELECTORS.albumImages, {
			...commonConfig,
			groupAll: true,
			Carousel: {
				transition: "slide",
				preload: 2,
			},
		});
		this.boundSelectors.push(FANCYBOX_SELECTORS.albumImages);

		// Bind album links
		this.Fancybox.bind(FANCYBOX_SELECTORS.albumLinks, {
			...commonConfig,
			source: (el: any) => {
				return el.getAttribute("data-src") || el.getAttribute("href");
			},
		});
		this.boundSelectors.push(FANCYBOX_SELECTORS.albumLinks);

		// Bind standalone fancybox images
		this.Fancybox.bind(FANCYBOX_SELECTORS.singleFancybox, commonConfig);
		this.boundSelectors.push(FANCYBOX_SELECTORS.singleFancybox);
	}

	/**
	 * Clean up Fancybox bindings
	 * Call before page transition
	 */
	cleanup(): void {
		if (!this.Fancybox) {
			return;
		}

		this.boundSelectors.forEach((selector) => {
			this.Fancybox.unbind(selector);
		});
		this.boundSelectors = [];
	}

	/**
	 * Fully destroy Fancybox
	 */
	destroy(): void {
		this.cleanup();
		this.Fancybox = null;
		this.initialized = false;
	}

	/**
	 * Get initialization status
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * Get list of bound selectors
	 */
	getBoundSelectors(): string[] {
		return [...this.boundSelectors];
	}
}

// Create global instance
let globalFancyboxHandler: FancyboxHandler | null = null;

/**
 * Get global Fancybox handler instance
 */
export function getFancyboxHandler(): FancyboxHandler {
	if (!globalFancyboxHandler) {
		globalFancyboxHandler = new FancyboxHandler();
	}
	return globalFancyboxHandler;
}

/**
 * Initialize Fancybox (convenience function)
 */
export async function initFancybox(): Promise<void> {
	const handler = getFancyboxHandler();
	await handler.init();
}

/**
 * Clean up Fancybox (convenience function)
 */
export function cleanupFancybox(): void {
	if (globalFancyboxHandler) {
		globalFancyboxHandler.cleanup();
	}
}
