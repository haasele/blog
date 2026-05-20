/**
 * Animation utilities - inspired by the yukina theme animation system
 * Provides unified page transition and component animation management
 */

export interface AnimationConfig {
	duration?: number;
	delay?: number;
	easing?: string;
	direction?: "up" | "down" | "left" | "right";
}

export class AnimationManager {
	private static instance: AnimationManager;
	private isAnimating = false;
	private animationQueue: (() => void)[] = [];

	static getInstance(): AnimationManager {
		if (!AnimationManager.instance) {
			AnimationManager.instance = new AnimationManager();
		}
		return AnimationManager.instance;
	}

	/**
	 * Initialize the animation system
	 */
	init(): void {
		this.setupSwupIntegration();
		this.setupScrollAnimations();
		console.log("🎨 Animation Manager initialized");
	}

	/**
	 * Set up Swup integration
	 */
	private setupSwupIntegration(): void {
		if (typeof window !== "undefined" && (window as any).swup) {
			const swup = (window as any).swup;

			// Page leave animation
			swup.hooks.on("animation:out:start", () => {
				this.triggerPageLeaveAnimation();
			});

			// Page enter animation
			swup.hooks.on("animation:in:start", () => {
				this.triggerPageEnterAnimation();
			});

			// Reinitialize animations after content replacement
			swup.hooks.on("content:replace", () => {
				setTimeout(() => {
					this.initializePageAnimations();
				}, 50);
			});
		}
	}

	/**
	 * Trigger page leave animation
	 */
	private triggerPageLeaveAnimation(): void {
		this.isAnimating = true;
		document.documentElement.classList.add("is-leaving");

		// Mobile optimization: reduce animation delay to avoid flicker
		const isMobile = window.innerWidth <= 768;
		const delay = isMobile ? 10 : 30;

		// Apply leave animation classes to main elements
		const mainElements = document.querySelectorAll(".transition-leaving");
		mainElements.forEach((element, index) => {
			setTimeout(() => {
				element.classList.add("animate-leave");
			}, index * delay);
		});
	}

	/**
	 * Trigger page enter animation
	 */
	private triggerPageEnterAnimation(): void {
		document.documentElement.classList.remove("is-leaving");
		document.documentElement.classList.add("is-entering");

		// Remove leave animation classes
		const elements = document.querySelectorAll(".animate-leave");
		elements.forEach((element) => {
			element.classList.remove("animate-leave");
		});

		setTimeout(() => {
			document.documentElement.classList.remove("is-entering");
			this.isAnimating = false;
			this.processAnimationQueue();
		}, 300);
	}

	/**
	 * Initialize page animations
	 */
	private initializePageAnimations(): void {
		// Reapply load animations
		const animatedElements = document.querySelectorAll(".onload-animation");
		animatedElements.forEach((element, index) => {
			const htmlElement = element as HTMLElement;
			const delay =
				Number.parseInt(htmlElement.style.animationDelay, 10) ||
				index * 50;

			// Reset animation
			htmlElement.style.opacity = "0";
			htmlElement.style.transform = "translateY(1.5rem)";

			setTimeout(() => {
				htmlElement.style.transition =
					"opacity 320ms cubic-bezier(0.4, 0, 0.2, 1), transform 320ms cubic-bezier(0.4, 0, 0.2, 1)";
				htmlElement.style.opacity = "1";
				htmlElement.style.transform = "translateY(0)";
			}, delay);
		});

		// Reinitialize sidebar widgets
		this.initializeSidebarComponents();
	}

	/**
	 * Initialize sidebar widgets
	 */
	private initializeSidebarComponents(): void {
		// Find sidebar elements on the page
		const sidebar = document.getElementById("sidebar");
		if (sidebar) {
			// Dispatch a custom event to reinitialize the sidebar
			const event = new CustomEvent("sidebar:init");
			sidebar.dispatchEvent(event);
		}

		// Dispatch a global event to reinitialize all widgets
		const globalEvent = new CustomEvent("page:reinit");
		document.dispatchEvent(globalEvent);
	}

	/**
	 * Set up scroll animations
	 */
	private setupScrollAnimations(): void {
		if (typeof window === "undefined") {
			return;
		}

		const observerOptions = {
			root: null,
			rootMargin: "0px 0px -100px 0px",
			threshold: 0.1,
		};

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("in-view");
					observer.unobserve(entry.target);
				}
			});
		}, observerOptions);

		// Observe all scroll-animated elements
		const scrollElements = document.querySelectorAll(".animate-on-scroll");
		scrollElements.forEach((element) => {
			observer.observe(element);
		});
	}

	/**
	 * Queue an animation
	 */
	queueAnimation(callback: () => void): void {
		if (this.isAnimating) {
			this.animationQueue.push(callback);
		} else {
			callback();
		}
	}

	/**
	 * Process the animation queue
	 */
	private processAnimationQueue(): void {
		while (this.animationQueue.length > 0) {
			const callback = this.animationQueue.shift();
			if (callback) {
				callback();
			}
		}
	}

	/**
	 * Create a custom animation
	 */
	createAnimation(element: HTMLElement, config: AnimationConfig): void {
		const {
			duration = 300,
			delay = 0,
			easing = "cubic-bezier(0.4, 0, 0.2, 1)",
			direction = "up",
		} = config;

		const transforms = {
			up: "translateY(1.5rem)",
			down: "translateY(-1.5rem)",
			left: "translateX(1.5rem)",
			right: "translateX(-1.5rem)",
		};

		// Set initial state
		element.style.opacity = "0";
		element.style.transform = transforms[direction];
		element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

		setTimeout(() => {
			element.style.opacity = "1";
			element.style.transform = "translate(0)";
		}, delay);
	}

	// batchAnimate is deprecated, use staggerAnimations instead
	// batchAnimate(
	// 	elements: NodeListOf<Element> | Element[],
	// 	config: AnimationConfig & { stagger?: number } = {},
	// ): void {
	// 	const { stagger = 50, ...animationConfig } = config;
	//
	// 	elements.forEach((element, index) => {
	// 		this.createAnimation(element as HTMLElement, {
	// 			...animationConfig,
	// 			delay: (animationConfig.delay || 0) + index * stagger,
	// 		});
	// 	});
	// }

	/**
	 * Stagger animations across multiple elements
	 */
	staggerAnimations(
		elements: NodeListOf<Element> | HTMLElement[],
		config: AnimationConfig & { stagger?: number } = {},
	): void {
		const { stagger = 50, ...animationConfig } = config;

		elements.forEach((element: Element | HTMLElement, index: number) => {
			this.createAnimation(element as HTMLElement, {
				...animationConfig,
				delay: (animationConfig.delay || 0) + index * stagger,
			});
		});
	}

	/**
	 * Check whether an animation is in progress
	 */
	isCurrentlyAnimating(): boolean {
		return this.isAnimating;
	}
}

// Export singleton instance
export const animationManager = AnimationManager.getInstance();

// Auto-initialize
if (typeof window !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			animationManager.init();
		});
	} else {
		animationManager.init();
	}
}
