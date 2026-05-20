/**
 * Swup manager main entry
 * Coordinates all submodules and provides unified page transition management
 */

import { widgetConfigs } from "../config";
import { initLinkPreloading } from "../utils/navigation-utils";
import { SWUP_SELECTORS } from "./core/swup-config";
import { SwupHooksManager } from "./core/swup-hooks";
import { setupSakuraOnDOMReady } from "./effects/sakura-effect";
import {
	destroyTransitionEffect,
	getTransitionEffect,
} from "./effects/transition-effect";
import type { BackToTopHandler } from "./handlers/back-to-top-handler";
import {
	getBackToTopHandler,
	initBackToTopHandler,
} from "./handlers/back-to-top-handler";
import type { FancyboxHandler } from "./handlers/fancybox-handler";
import {
	cleanupFancybox,
	getFancyboxHandler,
	initFancybox,
} from "./handlers/fancybox-handler";
import type { PanelHandler } from "./handlers/panel-handler";
import { getPanelHandler, initPanelHandler } from "./handlers/panel-handler";
import { checkKatex, initCustomScrollbar } from "./handlers/scroll-handler";

/**
 * Swup manager class
 * Unified management of all page transition features
 */
export class SwupManager {
	private hooksManager: SwupHooksManager | null = null;
	private fancyboxHandler: FancyboxHandler;
	private backToTopHandler: BackToTopHandler;
	private panelHandler: PanelHandler;

	private bannerEnabled: boolean;
	private initialized = false;

	constructor() {
		this.bannerEnabled = !!document.getElementById(
			SWUP_SELECTORS.bannerWrapper.slice(1),
		);

		// Initialize handlers
		this.fancyboxHandler = getFancyboxHandler();
		this.backToTopHandler = getBackToTopHandler(this.bannerEnabled);
		this.panelHandler = getPanelHandler();
	}

	/**
	 * Initialize Swup manager
	 */
	async init(): Promise<void> {
		if (this.initialized) {
			return;
		}

		const transitionEffect = getTransitionEffect();
		transitionEffect.applyConfig();

		await this.initPanelHandler();

		// Set up Sakura effect
		this.setupSakura();

		// Initialize Swup hooks
		this.initSwupHooks();

		// Initialize back to top handler
		initBackToTopHandler(this.bannerEnabled);

		// Initialize Banner
		this.initBanner();

		// Initialize link preloading
		this.initPreloading();

		this.initialized = true;
		console.log("SwupManager: initialized");
	}

	/**
	 * Initialize panel handler
	 */
	private async initPanelHandler(): Promise<void> {
		try {
			await initPanelHandler();
		} catch (error) {
			console.error("SwupManager: panel handler initialization failed", error);
		}
	}

	/**
	 * Set up Sakura effect
	 */
	private setupSakura(): void {
		setupSakuraOnDOMReady(widgetConfigs);
	}

	/**
	 * Initialize Swup hooks
	 */
	private initSwupHooks(): void {
		// Create hooks manager
		this.hooksManager = new SwupHooksManager(this.bannerEnabled, {
			showBanner: this.showBanner.bind(this),
			initFancybox: async () => {
				await initFancybox();
			},
			cleanupFancybox: () => {
				cleanupFancybox();
			},
			initCustomScrollbar: () => {
				initCustomScrollbar();
			},
			checkKatex: () => {
				checkKatex();
			},
		});

		// Register hooks if Swup is already ready
		if (window?.swup?.hooks) {
			initFancybox();
			checkKatex();
			this.hooksManager.registerHooks();
		} else {
			// Listen for Swup ready event
			document.addEventListener("swup:enable", () => {
				if (this.hooksManager) {
					this.hooksManager.registerHooks();
				}
			});

			// Listen for DOM load (ensure optimization components load on first paint)
			if (document.readyState === "loading") {
				document.addEventListener("DOMContentLoaded", async () => {
					await initFancybox();
					checkKatex();
				});
			} else {
				initFancybox();
				checkKatex();
			}
		}
	}

	/**
	 * Initialize Banner
	 */
	private initBanner(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", async () => {
				this.showBanner();
			});
		} else {
			this.showBanner();
		}
	}

	/**
	 * Initialize link preloading
	 */
	private initPreloading(): void {
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				initLinkPreloading();
			});
		} else {
			initLinkPreloading();
		}
	}

	/**
	 * Show Banner
	 * Carousel is initialized by inline script in Banner.astro (data-swup-ignore-script);
	 * this only handles fade-in for single-image mode.
	 */
	showBanner(): void {
		requestAnimationFrame(() => {
			// Handle single-image Banner (desktop)
			const banner = document.getElementById(
				SWUP_SELECTORS.banner.slice(1),
			);
			if (banner) {
				banner.classList.remove("opacity-0", "scale-105");
			}

			// Handle mobile single-image Banner
			const mobileBanner = document.querySelector(
				'.block.md\\:hidden[alt="Mobile banner image of the blog"]',
			);
			if (mobileBanner && !document.getElementById("banner-carousel")) {
				mobileBanner.classList.remove("opacity-0", "scale-105");
				mobileBanner.classList.add("opacity-100");
			}
		});
	}

	/**
	 * Destroy manager
	 */
	destroy(): void {
		this.hooksManager = null;
		this.fancyboxHandler.destroy();
		this.backToTopHandler.destroy();
		this.panelHandler.destroy();
		destroyTransitionEffect();
		this.initialized = false;
	}

	/**
	 * Get banner enabled state
	 */
	isBannerEnabled(): boolean {
		return this.bannerEnabled;
	}
}

// Create global instance
let globalSwupManager: SwupManager | null = null;

/**
 * Get global Swup manager instance
 */
export function getSwupManager(): SwupManager {
	if (!globalSwupManager) {
		globalSwupManager = new SwupManager();
	}
	return globalSwupManager;
}

/**
 * Initialize Swup manager (convenience function)
 */
export async function initSwupManager(): Promise<void> {
	const manager = getSwupManager();
	await manager.init();
}
