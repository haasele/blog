/**
 * Scroll handler
 * Manages page scroll features including custom scrollbars and scroll listeners
 */

/**
 * Scroll handler class
 * Handles custom scrollbar initialization and scroll event management
 */
export class ScrollHandler {
	private katexScrollbarStyleAdded = false;

	/**
	 * Initialize custom scrollbar
	 * Adds horizontal scroll support for KaTeX formulas
	 */
	initCustomScrollbar(): void {
		const katexElements = document.querySelectorAll(
			".katex-display:not([data-scrollbar-initialized])",
		) as NodeListOf<HTMLElement>;

		katexElements.forEach((element) => {
			if (!element.parentNode) {
				return;
			}

			const container = document.createElement("div");
			container.className = "katex-display-container";
			element.parentNode.insertBefore(container, element);
			container.appendChild(element);

			// Use CSS scrollbar
			container.style.cssText = `
				overflow-x: auto;
				scrollbar-width: thin;
				scrollbar-color: rgba(0,0,0,0.3) transparent;
			`;

			// Add webkit custom scrollbar styles (once only)
			this.addKatexScrollbarStyle();

			element.setAttribute("data-scrollbar-initialized", "true");
		});
	}

	/**
	 * Add KaTeX scrollbar styles (once only)
	 */
	private addKatexScrollbarStyle(): void {
		if (this.katexScrollbarStyleAdded) {
			return;
		}

		const style = document.createElement("style");
		style.textContent = `
			.katex-display-container::-webkit-scrollbar {
				height: 6px;
			}
			.katex-display-container::-webkit-scrollbar-track {
				background: transparent;
			}
			.katex-display-container::-webkit-scrollbar-thumb {
				background: rgba(0,0,0,0.3);
				border-radius: 3px;
			}
			.katex-display-container::-webkit-scrollbar-thumb:hover {
				background: rgba(0,0,0,0.5);
			}
		`;

		if (!document.head.querySelector("style[data-katex-scrollbar]")) {
			style.setAttribute("data-katex-scrollbar", "true");
			document.head.appendChild(style);
			this.katexScrollbarStyleAdded = true;
		}
	}

	/**
	 * Check and load KaTeX styles
	 */
	checkKatex(): void {
		if (document.querySelector(".katex")) {
			import("katex/dist/katex.css");
		}
	}

	/**
	 * Throttle function
	 * Limits function call frequency
	 */
	static throttle<T extends (...args: any[]) => any>(
		func: T,
		limit: number,
	): (...args: Parameters<T>) => void {
		let inThrottle = false;
		return function (this: any, ...args: Parameters<T>) {
			if (!inThrottle) {
				func.apply(this, args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	}
}

// Create global instance
let globalScrollHandler: ScrollHandler | null = null;

/**
 * Get global scroll handler instance
 */
export function getScrollHandler(): ScrollHandler {
	if (!globalScrollHandler) {
		globalScrollHandler = new ScrollHandler();
	}
	return globalScrollHandler;
}

/**
 * Initialize custom scrollbar (convenience function)
 */
export function initCustomScrollbar(): void {
	const handler = getScrollHandler();
	handler.initCustomScrollbar();
}

/**
 * Check KaTeX (convenience function)
 */
export function checkKatex(): void {
	const handler = getScrollHandler();
	handler.checkKatex();
}
