// Icon loading utilities
// Provides a reliable Iconify icon loading solution

interface IconifyLoadOptions {
	timeout?: number;
	retryCount?: number;
	retryDelay?: number;
}

class IconLoader {
	private static instance: IconLoader;
	private isLoaded = false;
	private isLoading = false;
	private loadPromise: Promise<void> | null = null;
	private observers = new Set<() => void>();

	private constructor() {}

	static getInstance(): IconLoader {
		if (!IconLoader.instance) {
			IconLoader.instance = new IconLoader();
		}
		return IconLoader.instance;
	}

	/**
	 * Load the Iconify icon library
	 */
	async loadIconify(options: IconifyLoadOptions = {}): Promise<void> {
		const { timeout = 10000, retryCount = 3, retryDelay = 1000 } = options;

		// Return immediately if already loaded
		if (this.isLoaded) {
			return Promise.resolve();
		}

		// Return the in-flight promise if a load is already in progress
		if (this.isLoading && this.loadPromise) {
			return this.loadPromise;
		}

		this.isLoading = true;
		this.loadPromise = this.loadWithRetry(timeout, retryCount, retryDelay);

		try {
			await this.loadPromise;
			this.isLoaded = true;
			this.notifyObservers();
		} catch (error) {
			console.error("Failed to load Iconify after all retries:", error);
			throw error;
		} finally {
			this.isLoading = false;
		}
	}

	/**
	 * Load with retry logic
	 */
	private async loadWithRetry(
		timeout: number,
		retryCount: number,
		retryDelay: number,
	): Promise<void> {
		for (let attempt = 1; attempt <= retryCount; attempt++) {
			try {
				await this.loadScript(timeout);
				return;
			} catch (error) {
				console.warn(`Iconify load attempt ${attempt} failed:`, error);

				if (attempt === retryCount) {
					throw new Error(
						`Failed to load Iconify after ${retryCount} attempts`,
					);
				}

				// Wait before retrying
				await new Promise((resolve) => setTimeout(resolve, retryDelay));
			}
		}
	}

	/**
	 * Load the script
	 */
	private loadScript(timeout: number): Promise<void> {
		return new Promise((resolve, reject) => {
			// Check whether the script already exists
			const existingScript = document.querySelector(
				'script[src*="iconify-icon"]',
			);
			if (existingScript) {
				// Check whether Iconify is already available
				if (this.isIconifyReady()) {
					resolve();
					return;
				}
			}

			const script = document.createElement("script");
			script.src =
				"https://code.iconify.design/iconify-icon/3-latest/iconify-icon.min.js";
			script.async = true;
			script.defer = true;

			const timeoutId = setTimeout(() => {
				script.remove();
				reject(new Error("Iconify script load timeout"));
			}, timeout);

			script.onload = () => {
				clearTimeout(timeoutId);
				// Wait for Iconify to finish initializing
				this.waitForIconifyReady().then(resolve).catch(reject);
			};

			script.onerror = () => {
				clearTimeout(timeoutId);
				script.remove();
				reject(new Error("Failed to load Iconify script"));
			};

			document.head.appendChild(script);
		});
	}

	/**
	 * Wait until Iconify is fully ready
	 */
	private waitForIconifyReady(maxWait = 5000): Promise<void> {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			const checkReady = () => {
				if (this.isIconifyReady()) {
					resolve();
					return;
				}

				if (Date.now() - startTime > maxWait) {
					reject(new Error("Iconify initialization timeout"));
					return;
				}

				setTimeout(checkReady, 100);
			};

			checkReady();
		});
	}

	/**
	 * Check whether Iconify is ready
	 */
	private isIconifyReady(): boolean {
		return (
			typeof window !== "undefined" &&
			"customElements" in window &&
			customElements.get("iconify-icon") !== undefined
		);
	}

	/**
	 * Add a load-complete observer
	 */
	onLoad(callback: () => void): void {
		if (this.isLoaded) {
			callback();
		} else {
			this.observers.add(callback);
		}
	}

	/**
	 * Remove an observer
	 */
	offLoad(callback: () => void): void {
		this.observers.delete(callback);
	}

	/**
	 * Notify all observers
	 */
	private notifyObservers(): void {
		this.observers.forEach((callback) => {
			try {
				callback();
			} catch (error) {
				console.error("Error in icon load observer:", error);
			}
		});
		this.observers.clear();
	}

	/**
	 * Get load state
	 */
	getLoadState(): { isLoaded: boolean; isLoading: boolean } {
		return {
			isLoaded: this.isLoaded,
			isLoading: this.isLoading,
		};
	}

	/**
	 * Preload specific icons
	 */
	async preloadIcons(icons: string[]): Promise<void> {
		if (!this.isLoaded) {
			await this.loadIconify();
		}

		// Wait for icons to load
		return new Promise((resolve) => {
			let loadedCount = 0;
			const totalIcons = icons.length;

			if (totalIcons === 0) {
				resolve();
				return;
			}

			const checkComplete = () => {
				loadedCount++;
				if (loadedCount >= totalIcons) {
					resolve();
				}
			};

			// Create temporary icon elements to trigger loading
			icons.forEach((icon) => {
				const tempIcon = document.createElement("iconify-icon");
				tempIcon.setAttribute("icon", icon);
				tempIcon.style.display = "none";
				tempIcon.onload = checkComplete;
				tempIcon.onerror = checkComplete; // Continue even if loading fails
				document.body.appendChild(tempIcon);

				// Clean up temporary elements
				setTimeout(() => {
					if (tempIcon.parentNode) {
						tempIcon.parentNode.removeChild(tempIcon);
					}
				}, 1000);
			});

			// Apply timeout
			setTimeout(() => {
				resolve();
			}, 5000);
		});
	}
}

// Export singleton instance
export const iconLoader = IconLoader.getInstance();

// Export convenience functions
export const loadIconify = (options?: IconifyLoadOptions) =>
	iconLoader.loadIconify(options);
export const preloadIcons = (icons: string[]) => iconLoader.preloadIcons(icons);
export const onIconsReady = (callback: () => void) =>
	iconLoader.onLoad(callback);
