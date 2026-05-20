/**
 * useTocScroll - TOC scroll sync hook
 * Scroll listeners, progress, etc.
 */

/**
 * Reading progress (0-1)
 */
export function calculateReadingProgress(): number {
	const scrollTop = window.scrollY || document.documentElement.scrollTop;
	const docHeight =
		document.documentElement.scrollHeight -
		document.documentElement.clientHeight;
	return docHeight > 0 ? scrollTop / docHeight : 0;
}

/**
 * Update progress ring stroke-dashoffset
 */
export function updateProgressRing(
	circle: SVGCircleElement,
	progress: number,
): void {
	const radius = circle.r.baseVal.value;
	const circumference = radius * 2 * Math.PI;
	const offset = Math.max(
		0,
		Math.min(circumference, circumference - progress * circumference),
	);
	circle.style.strokeDashoffset = offset.toString();
}

/**
 * Scroll handler with passive option
 */
export function createScrollHandler(
	callback: () => void,
	options: AddEventListenerOptions = {},
): (event: Event) => void {
	const handler = (_event: Event) => {
		callback();
	};

	if (typeof window !== "undefined") {
		window.addEventListener("scroll", handler, {
			passive: true,
			...options,
		});
	}

	return handler;
}

/**
 * Scroll active item into TOC container view
 */
export function scrollActiveIntoView(
	container: HTMLElement,
	activeElements: HTMLElement[],
	tocHeight: number,
): void {
	if (activeElements.length === 0 || !container) {
		return;
	}

	const topmost = activeElements[0];
	const bottommost = activeElements[activeElements.length - 1];

	const visibleHeight =
		bottommost.getBoundingClientRect().bottom -
		topmost.getBoundingClientRect().top;

	let top: number;
	if (visibleHeight < 0.9 * tocHeight) {
		top = topmost.offsetTop - 32;
	} else {
		top = bottommost.offsetTop - tocHeight * 0.8;
	}

	container.scrollTo({ top, left: 0, behavior: "smooth" });
}

/**
 * Active indicator position
 */
export function calculateActiveIndicatorPosition(
	container: HTMLElement,
	minEntry: HTMLElement,
	maxEntry: HTMLElement,
): { top: number; height: number } {
	const containerRect = container.getBoundingClientRect();
	const minRect = minEntry.getBoundingClientRect();
	const maxRect = maxEntry.getBoundingClientRect();

	const top = minRect.top - containerRect.top + container.scrollTop;
	const height = maxRect.bottom - minRect.top;

	return { top, height };
}

/**
 * Debounce
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * Throttle
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
	fn: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle = false;
	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}
