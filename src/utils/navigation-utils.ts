/**
 * Navigation utilities
 * Provides unified page navigation with Swup client-side transitions
 */

/**
 * Navigate to a page
 * @param url Target page URL
 * @param options Navigation options
 */
export function navigateToPage(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	// Validate URL
	if (!url || typeof url !== "string") {
		console.warn("navigateToPage: Invalid URL provided");
		return;
	}

	// External links open in a new tab
	if (
		url.startsWith("http://") ||
		url.startsWith("https://") ||
		url.startsWith("//")
	) {
		window.open(url, "_blank");
		return;
	}

	// Anchor links scroll to the target element
	if (url.startsWith("#")) {
		const element = document.getElementById(url.slice(1));
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
		return;
	}

	// Use Swup when available
	if (typeof window !== "undefined" && (window as any).swup) {
		try {
			// Client-side navigation via Swup
			if (options?.replace) {
				(window as any).swup.navigate(url, { history: false });
			} else {
				(window as any).swup.navigate(url);
			}
		} catch (error) {
			console.error("Swup navigation failed:", error);
			// Fall back to full page navigation
			fallbackNavigation(url, options);
		}
	} else {
		// Fallback when Swup is unavailable
		fallbackNavigation(url, options);
	}
}

/**
 * Fallback navigation
 * Uses a full page load when Swup is unavailable
 */
function fallbackNavigation(
	url: string,
	options?: {
		replace?: boolean;
		force?: boolean;
	},
): void {
	if (options?.replace) {
		window.location.replace(url);
	} else {
		window.location.href = url;
	}
}

/**
 * Check whether Swup is ready
 */
export function isSwupReady(): boolean {
	return typeof window !== "undefined" && !!(window as any).swup;
}

/**
 * Wait for Swup to become ready
 * @param timeout Timeout in milliseconds
 */
export function waitForSwup(timeout = 5000): Promise<boolean> {
	return new Promise((resolve) => {
		if (isSwupReady()) {
			resolve(true);
			return;
		}

		let timeoutId: NodeJS.Timeout;

		const checkSwup = () => {
			if (isSwupReady()) {
				clearTimeout(timeoutId);
				document.removeEventListener("swup:enable", checkSwup);
				resolve(true);
			}
		};

		// Listen for Swup enable event
		document.addEventListener("swup:enable", checkSwup);

		// Apply timeout
		timeoutId = setTimeout(() => {
			document.removeEventListener("swup:enable", checkSwup);
			resolve(false);
		}, timeout);
	});
}

/**
 * Preload a page
 * @param url Page URL to preload
 */
export function preloadPage(url: string): void {
	if (!url || typeof url !== "string") {
		return;
	}

	// Use Swup preload when available
	if (isSwupReady() && (window as any).swup.preload) {
		try {
			(window as any).swup.preload(url);
		} catch (error) {
			console.warn("Failed to preload page:", error);
		}
	}
}

/**
 * Check whether a link is same-origin
 */
function isSameOrigin(url: string): boolean {
	try {
		const parsed = new URL(url, window.location.origin);
		return parsed.origin === window.location.origin;
	} catch {
		return false;
	}
}

/**
 * Check whether the connection is slow
 */
function isSlowConnection(): boolean {
	const conn = (navigator as any).connection;
	if (!conn) {
		return false;
	}
	return conn.effectiveType === "2g" || conn.effectiveType === "slow-2g";
}

/**
 * Initialize link preloading
 * Uses IntersectionObserver to preload links as they enter the viewport
 */
export function initLinkPreloading(): void {
	// Skip preloading when Swup is unavailable or the connection is slow
	if (!isSwupReady() || isSlowConnection()) {
		return;
	}

	// Respect reduced-motion preference
	if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
		return;
	}

	// Track preloaded URLs to avoid duplicates
	const preloadedUrls = new Set<string>();

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const link = entry.target as HTMLAnchorElement;
					const href = link.href;

					// Validate link, same-origin, not already preloaded, and not current page
					if (
						href &&
						isSameOrigin(href) &&
						!preloadedUrls.has(href) &&
						href !== window.location.href &&
						!href.includes("#")
					) {
						preloadedUrls.add(href);

						// Preload during idle time
						if ("requestIdleCallback" in window) {
							requestIdleCallback(() => preloadPage(href), {
								timeout: 2000,
							});
						} else {
							setTimeout(() => preloadPage(href), 100);
						}
					}
				}
			});
		},
		{
			rootMargin: "200px",
		},
	);

	// Observe all internal links
	const observeLinks = () => {
		document
			.querySelectorAll('a[href^="/"], a[href^="./"], a[href^="../"]')
			.forEach((link) => {
				observer.observe(link);
			});
	};

	// Initial observation
	observeLinks();

	// Re-observe after page transitions (Swup replaces main content)
	const mainContainer = document.querySelector("main");
	if (mainContainer) {
		const mutationObserver = new MutationObserver(() => {
			observeLinks();
		});
		mutationObserver.observe(mainContainer, {
			childList: true,
			subtree: true,
		});
	}
}

/**
 * Get the current page path
 */
export function getCurrentPath(): string {
	return typeof window !== "undefined" ? window.location.pathname : "";
}

/**
 * Check whether the current page is the home page
 */
export function isHomePage(): boolean {
	const path = getCurrentPath();
	return path === "/" || path === "";
}

/**
 * Check whether the current page is a post page
 */
export function isPostPage(): boolean {
	const path = getCurrentPath();
	return path.startsWith("/posts/");
}

/**
 * Check whether two paths are equal
 */
export function pathsEqual(path1: string, path2: string): boolean {
	// Normalize paths (remove trailing slash)
	const normalize = (path: string) => {
		return path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;
	};

	return normalize(path1) === normalize(path2);
}
