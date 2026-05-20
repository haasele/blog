/**
 * Sakura effect module
 * Manages sakura falling effect initialization
 */

import type { SakuraConfig } from "../../types/config";
import { initSakura } from "../../utils/sakura-manager";

/**
 * Sakura effect handler class
 * Handles sakura falling effect initialization and state management
 */
export class SakuraEffectHandler {
	private initialized = false;
	private config: SakuraConfig | null = null;

	/**
	 * Initialize Sakura effect
	 */
	init(widgetConfigs: any): void {
		const sakuraConfig = widgetConfigs?.sakura;
		if (!sakuraConfig || !sakuraConfig.enable) {
			return;
		}

		// Avoid duplicate initialization
		if ((window as any).sakuraInitialized) {
			return;
		}

		this.config = sakuraConfig;
		initSakura(sakuraConfig);
		this.initialized = true;
		(window as any).sakuraInitialized = true;
	}

	/**
	 * Check if already initialized
	 */
	isInitialized(): boolean {
		return this.initialized;
	}

	/**
	 * Get configuration
	 */
	getConfig(): SakuraConfig | null {
		return this.config;
	}
}

// Create global instance
let globalSakuraEffectHandler: SakuraEffectHandler | null = null;

/**
 * Get global Sakura effect handler instance
 */
export function getSakuraEffectHandler(): SakuraEffectHandler {
	if (!globalSakuraEffectHandler) {
		globalSakuraEffectHandler = new SakuraEffectHandler();
	}
	return globalSakuraEffectHandler;
}

/**
 * Initialize Sakura effect (convenience function)
 */
export function setupSakura(widgetConfigs: any): void {
	const handler = getSakuraEffectHandler();
	handler.init(widgetConfigs);
}

/**
 * Set up DOM listener for Sakura effect initialization
 */
export function setupSakuraOnDOMReady(widgetConfigs: any): void {
	const handler = getSakuraEffectHandler();

	const init = () => {
		handler.init(widgetConfigs);
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
}
