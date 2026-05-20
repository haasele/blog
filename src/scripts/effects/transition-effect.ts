/**
 * Transition effect controller
 * Manages page transition animation configuration and behavior
 */

import { TRANSITION_CONFIG, type TransitionConfig } from "../core/swup-config";

export class TransitionEffect {
	private config: TransitionConfig;
	private root: HTMLElement;

	constructor(config?: Partial<TransitionConfig>) {
		this.config = { ...TRANSITION_CONFIG, ...config };
		this.root = document.documentElement;
	}

	/**
	 * Apply transition config to CSS variables
	 */
	applyConfig(): void {
		const { duration, easing, easingOut, translateDistance, staggerDelay } =
			this.config;

		this.root.style.setProperty("--transition-duration", `${duration}ms`);
		this.root.style.setProperty("--transition-easing", easing);
		this.root.style.setProperty("--transition-easing-out", easingOut);
		this.root.style.setProperty(
			"--transition-translate",
			translateDistance,
		);
		this.root.style.setProperty(
			"--transition-stagger",
			`${staggerDelay}ms`,
		);
	}

	/**
	 * Reset to default configuration
	 */
	reset(): void {
		this.config = { ...TRANSITION_CONFIG };
		this.applyConfig();
	}

	/**
	 * Dynamically adjust animation duration
	 */
	setDuration(duration: number): void {
		this.config.duration = duration;
		this.root.style.setProperty("--transition-duration", `${duration}ms`);
	}

	/**
	 * Dynamically adjust translate distance
	 */
	setTranslateDistance(distance: string): void {
		this.config.translateDistance = distance;
		this.root.style.setProperty("--transition-translate", distance);
	}

	/**
	 * Get current configuration
	 */
	getConfig(): TransitionConfig {
		return { ...this.config };
	}

	/**
	 * Destroy instance
	 */
	destroy(): void {
		this.reset();
	}
}

let transitionEffectInstance: TransitionEffect | null = null;

export function getTransitionEffect(
	config?: Partial<TransitionConfig>,
): TransitionEffect {
	if (!transitionEffectInstance) {
		transitionEffectInstance = new TransitionEffect(config);
	}
	return transitionEffectInstance;
}

export function destroyTransitionEffect(): void {
	if (transitionEffectInstance) {
		transitionEffectInstance.destroy();
		transitionEffectInstance = null;
	}
}
