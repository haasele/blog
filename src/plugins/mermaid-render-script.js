(() => {
	// Singleton: check if already initialized
	if (window.mermaidInitialized) {
		// If already initialized, only ensure renderMermaidDiagrams is available
		if (typeof window.renderMermaidDiagrams !== "function") {
			window.renderMermaidDiagrams = renderMermaidDiagrams;
		}
		return;
	}

	window.mermaidInitialized = true;

	// Track current theme to avoid unnecessary re-renders
	let currentTheme = null;
	let isRendering = false; // Prevent concurrent rendering
	let retryCount = 0;
	const MAX_RETRIES = 3;
	const RETRY_DELAY = 1000; // 1 second
	let fullscreenOverlay = null;

	function injectFullscreenStyles() {
		if (document.getElementById("mermaid-fullscreen-style")) {
			return;
		}

		const style = document.createElement("style");
		style.id = "mermaid-fullscreen-style";
		style.textContent = `
		:where(.mermaid[data-mermaid-code]) { position: relative; }
		.mermaid-fullscreen-btn {
			position: absolute;
			top: 10px;
			right: 10px;
			height: 36px;
			width: 36px;
			display: inline-flex;
			align-items: center;
			justify-content: center;
			opacity: 0;
			transition: opacity 0.2s ease;
			z-index: 3;
		}
		.mermaid:hover .mermaid-fullscreen-btn,
		.mermaid:focus-within .mermaid-fullscreen-btn {
			opacity: 1;
		}
		.mermaid-fullscreen-overlay {
			position: fixed;
			inset: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: clamp(12px, 3vw, 28px);
			backdrop-filter: blur(6px);
			z-index: 9999;
			background: var(--mermaid-fs-backdrop, rgba(15, 23, 42, 0.9));
		}
		.mermaid-fullscreen-stage {
			position: relative;
			width: min(1200px, 96vw);
			max-height: 90vh;
			padding: clamp(12px, 2vw, 18px);
			background: var(--mermaid-fs-surface, #0f172a);
			border: 1px solid var(--mermaid-fs-border, rgba(255,255,255,0.08));
			border-radius: 16px;
			box-shadow: 0 20px 80px rgba(0, 0, 0, 0.35);
			overflow: hidden;
		}
		.mermaid-fullscreen-stage svg {
			width: 100%;
			height: auto;
			min-height: 320px;
		}
		.mermaid-fullscreen-close {
			position: absolute;
			top: 10px;
			right: 10px;
			z-index: 4;
		}
		.mermaid-fullscreen-overlay .mermaid-zoom-controls {
			position: absolute;
			left: 12px;
			bottom: 12px;
			display: flex;
			gap: 8px;
		}
		body.mermaid-fullscreen-open { overflow: hidden; }
		`;
		document.head.appendChild(style);
	}

	function getThemePalette() {
		const htmlElement = document.documentElement;
		const isDark = htmlElement.classList.contains("dark");
		const styles = getComputedStyle(htmlElement);
		const primary =
			styles.getPropertyValue("--primary")?.trim() ||
			(isDark ? "#7dd3fc" : "#2563eb");
		const surface =
			styles.getPropertyValue("--card-bg")?.trim() ||
			styles.getPropertyValue("--surface")?.trim() ||
			(isDark ? "#0b1220" : "#ffffff");
		const text =
			styles.getPropertyValue("--text-color")?.trim() ||
			styles.getPropertyValue("--foreground")?.trim() ||
			(isDark ? "#e5e7eb" : "#0f172a");
		const muted =
			styles.getPropertyValue("--muted")?.trim() ||
			styles.getPropertyValue("--muted-foreground")?.trim() ||
			(isDark ? "#1f2937" : "#e5e7eb");
		const backdrop = isDark
			? "rgba(8, 15, 30, 0.9)"
			: "rgba(255, 255, 255, 0.94)";

		return { isDark, primary, surface, text, muted, backdrop };
	}

	function closeFullscreen() {
		if (fullscreenOverlay) {
			fullscreenOverlay.remove();
			fullscreenOverlay = null;
			document.body.classList.remove("mermaid-fullscreen-open");
		}
	}

	function openFullscreen(svgElement) {
		const palette = getThemePalette();
		injectFullscreenStyles();

		closeFullscreen();

		const overlay = document.createElement("div");
		overlay.className = "mermaid-fullscreen-overlay";
		overlay.style.setProperty("--mermaid-fs-backdrop", palette.backdrop);
		overlay.style.setProperty("--mermaid-fs-surface", palette.surface);
		overlay.style.setProperty(
			"--mermaid-fs-border",
			palette.isDark ? "rgba(255,255,255,0.08)" : "rgba(15,23,42,0.08)",
		);

		const closeButton = document.createElement("button");
		closeButton.className =
			"mermaid-fullscreen-close btn-regular rounded-lg h-10 w-10";
		closeButton.title = "Exit fullscreen";
		closeButton.textContent = "✕";
		closeButton.addEventListener("click", closeFullscreen);

		const stage = document.createElement("div");
		stage.className = "mermaid-fullscreen-stage";

		const clonedSvg = svgElement.cloneNode(true);
		stage.appendChild(clonedSvg);
		overlay.appendChild(stage);
		overlay.appendChild(closeButton);

		overlay.addEventListener("click", (ev) => {
			if (ev.target === overlay) {
				closeFullscreen();
			}
		});

		const escHandler = (ev) => {
			if (ev.key === "Escape") {
				closeFullscreen();
			}
		};
		window.addEventListener("keydown", escHandler, { once: true });

		document.body.appendChild(overlay);
		document.body.classList.add("mermaid-fullscreen-open");
		fullscreenOverlay = overlay;

		// Add zoom controls for fullscreen diagram
		attachZoomControls(stage, clonedSvg);
	}

	function ensureFullscreenButton(element) {
		if (element.querySelector(".mermaid-fullscreen-btn")) {
			return;
		}
		const btn = document.createElement("button");
		btn.type = "button";
		btn.className = "mermaid-fullscreen-btn btn-regular rounded-lg h-9 w-9";
		btn.title = "View fullscreen";
		btn.setAttribute("aria-label", "View Mermaid diagram in fullscreen");
		btn.innerHTML = "⛶";
		btn.addEventListener("click", (ev) => {
			ev.stopPropagation();
			const svg = element.querySelector("svg");
			if (!svg) {
				return;
			}
			openFullscreen(svg);
		});
		element.appendChild(btn);
	}

	// Check if theme actually changed
	function hasThemeChanged() {
		const isDark = document.documentElement.classList.contains("dark");
		const newTheme = isDark ? "dark" : "default";

		if (currentTheme !== newTheme) {
			currentTheme = newTheme;
			return true;
		}
		return false;
	}

	// Wait for Mermaid library to load
	function waitForMermaid(timeout = 10000) {
		return new Promise((resolve, reject) => {
			const startTime = Date.now();

			function check() {
				if (
					window.mermaid &&
					typeof window.mermaid.initialize === "function"
				) {
					resolve(window.mermaid);
				} else if (Date.now() - startTime > timeout) {
					reject(
						new Error(
							"Mermaid library failed to load within timeout",
						),
					);
				} else {
					setTimeout(check, 100);
				}
			}

			check();
		});
	}

	// Store MutationObserver instance
	let themeObserver = null;

	// Clean up MutationObserver
	function cleanupMutationObserver() {
		if (themeObserver) {
			themeObserver.disconnect();
			themeObserver = null;
		}
	}

	// Set MutationObserver on html class attribute changes
	function setupMutationObserver() {
		cleanupMutationObserver();

		themeObserver = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				if (
					mutation.type === "attributes" &&
					mutation.attributeName === "class"
				) {
					// Check if dark class changed
					const target = mutation.target;
					const wasDark = mutation.oldValue
						? mutation.oldValue.includes("dark")
						: false;
					const isDark = target.classList.contains("dark");

					if (wasDark !== isDark) {
						if (hasThemeChanged()) {
							// Delayed render to avoid flicker during theme switch
							setTimeout(() => renderMermaidDiagrams(), 150);
						}
					}
				}
			});
		});

		// Start observing html class attribute changes
		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class"],
			attributeOldValue: true,
		});
	}

	// Zoom and pan
	function attachZoomControls(element, svgElement) {
		if (element.__zoomAttached) {
			return;
		}
		element.__zoomAttached = true;

		const wrapper = document.createElement("div");
		wrapper.className = "mermaid-zoom-wrapper";

		const svgParent = svgElement.parentNode;
		wrapper.appendChild(svgElement);
		svgParent.appendChild(wrapper);

		let scale = 1;
		let tx = 0;
		let ty = 0;
		const MIN_SCALE = 0.2;
		const MAX_SCALE = 6;

		function applyTransform() {
			wrapper.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
		}
		const controls = document.createElement("div");
		controls.className = "mermaid-zoom-controls";
		controls.innerHTML = `
			<button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="zoom-in" title="Zoom in">+</button>
			<button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="zoom-out" title="Zoom out">−</button>
			<button class="btn-regular rounded-lg h-10 w-10 active:scale-90" data-action="reset" title="Reset">⤾</button>
		`;
		element.appendChild(controls);

		controls.addEventListener("click", (ev) => {
			const action =
				ev.target.getAttribute && ev.target.getAttribute("data-action");
			if (!action) {
				return;
			}

			switch (action) {
				case "zoom-in":
					scale = Math.min(MAX_SCALE, +(scale * 1.2).toFixed(3));
					applyTransform();
					break;
				case "zoom-out":
					scale = Math.max(MIN_SCALE, +(scale / 1.2).toFixed(3));
					applyTransform();
					break;
				case "reset":
					scale = 1;
					tx = 0;
					ty = 0;
					applyTransform();
					break;
			}
		});

		let isPanning = false;
		let startX = 0;
		let startY = 0;
		let startTx = 0;
		let startTy = 0;

		wrapper.style.touchAction = "none";

		wrapper.addEventListener("pointerdown", (ev) => {
			if (ev.button !== 0) {
				return;
			} // Left button only
			isPanning = true;
			wrapper.setPointerCapture(ev.pointerId);
			startX = ev.clientX;
			startY = ev.clientY;
			startTx = tx;
			startTy = ty;
		});

		wrapper.addEventListener("pointermove", (ev) => {
			if (!isPanning) {
				return;
			}
			const dx = ev.clientX - startX;
			const dy = ev.clientY - startY;
			tx = startTx + dx / scale; // Adjust sensitivity based on current zoom
			ty = startTy + dy / scale;
			applyTransform();
		});

		wrapper.addEventListener("pointerup", (ev) => {
			isPanning = false;
			try {
				wrapper.releasePointerCapture(ev.pointerId);
			} catch (e) {}
		});

		wrapper.addEventListener("pointercancel", () => {
			isPanning = false;
		});

		// Mouse wheel zoom
		element.addEventListener(
			"wheel",
			(ev) => {
				ev.preventDefault();
				const delta = -ev.deltaY;
				const zoomFactor = delta > 0 ? 1.12 : 1 / 1.12;
				const prevScale = scale;
				scale = Math.min(
					MAX_SCALE,
					Math.max(MIN_SCALE, +(scale * zoomFactor).toFixed(3)),
				);

				const rect = wrapper.getBoundingClientRect();
				const cx = ev.clientX - rect.left;
				const cy = ev.clientY - rect.top;

				const worldX = cx / prevScale - tx;
				const worldY = cy / prevScale - ty;

				tx = cx / scale - worldX;
				ty = cy / scale - worldY;

				applyTransform();
			},
			{ passive: false },
		);

		// Double-click reset
		wrapper.addEventListener("dblclick", () => {
			scale = 1;
			tx = 0;
			ty = 0;
			applyTransform();
		});
		applyTransform();
		let resizeTimer = null;
		window.addEventListener("resize", () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				applyTransform();
			}, 200);
		});
	}

	// Set up other event listeners
	function setupEventListeners() {
		// Listen for page transition
		document.addEventListener("astro:page-load", () => {
			// Reinitialize theme state
			currentTheme = null;
			retryCount = 0; // Reset retry count
			if (hasThemeChanged()) {
				setTimeout(() => renderMermaidDiagrams(), 100);
			}
		});

		// Listen for visibility change; re-render when page becomes visible
		document.addEventListener("visibilitychange", () => {
			if (!document.hidden) {
				setTimeout(() => renderMermaidDiagrams(), 200);
			}
		});

		// Clean up before page transition
		document.addEventListener("astro:before-swap", cleanupMutationObserver);

		// Clean up fullscreen state before page transition
		document.addEventListener("astro:before-swap", closeFullscreen);

		// Re-setup Observer on Swup page transition
		document.addEventListener("astro:after-swap", () => {
			if (themeObserver === null) {
				setupMutationObserver();
			}
		});
	}

	async function initializeMermaid() {
		try {
			await waitForMermaid();

			// Initialize Mermaid config
			window.mermaid.initialize({
				startOnLoad: false,
				theme: "default",
				themeVariables: {
					fontFamily: "inherit",
					fontSize: "16px",
				},
				securityLevel: "loose",
				// Add error handling config
				errorLevel: "warn",
				logLevel: "error",
			});

			// Render all Mermaid diagrams
			await renderMermaidDiagrams();
		} catch (error) {
			console.error("Failed to initialize Mermaid:", error);
			// If init fails, try reload
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(() => initializeMermaid(), RETRY_DELAY * retryCount);
			}
		}
	}

	async function renderMermaidDiagrams() {
		// Prevent concurrent rendering
		if (isRendering) {
			return;
		}

		// Check if Mermaid is available
		if (!window.mermaid || typeof window.mermaid.render !== "function") {
			console.warn("Mermaid not available, skipping render");
			return;
		}

		isRendering = true;
		window.dispatchEvent(new CustomEvent("mermaid:render:start"));

		try {
			const mermaidElements = Array.from(
				document.querySelectorAll(".mermaid[data-mermaid-code]"),
			);

			if (mermaidElements.length === 0) {
				isRendering = false;
				window.dispatchEvent(
					new CustomEvent("mermaid:render:done", {
						detail: { count: 0 },
					}),
				);
				return;
			}

			// Delayed theme detection to ensure DOM is updated
			await new Promise((resolve) => setTimeout(resolve, 100));

			const htmlElement = document.documentElement;
			const isDark = htmlElement.classList.contains("dark");
			const theme = isDark ? "dark" : "default";

			// Update Mermaid theme (once only)
			window.mermaid.initialize({
				startOnLoad: false,
				theme: theme,
				themeVariables: {
					fontFamily: "inherit",
					fontSize: "16px",
					// Force apply theme variables
					primaryColor: isDark ? "#ffffff" : "#000000",
					primaryTextColor: isDark ? "#ffffff" : "#000000",
					primaryBorderColor: isDark ? "#ffffff" : "#000000",
					lineColor: isDark ? "#ffffff" : "#000000",
					secondaryColor: isDark ? "#333333" : "#f0f0f0",
					tertiaryColor: isDark ? "#555555" : "#e0e0e0",
				},
				securityLevel: "loose",
				errorLevel: "warn",
				logLevel: "error",
			});

			// Batch render to avoid blocking main thread
			const BATCH_SIZE = 3;
			let index = 0;

			async function renderBatch() {
				const batch = mermaidElements.slice(index, index + BATCH_SIZE);
				if (batch.length === 0) {
					return;
				}

				await Promise.all(
					batch.map(async (element, localIndex) => {
						const globalIndex = index + localIndex;
						let attempts = 0;
						const maxAttempts = 3;

						while (attempts < maxAttempts) {
							try {
								const code =
									element.getAttribute("data-mermaid-code");

								if (!code) {
									break;
								}

								// Show loading state
								element.innerHTML =
									'<div class="mermaid-loading">Rendering diagram...</div>';

								// Render diagram
								const { svg } = await window.mermaid.render(
									`mermaid-${Date.now()}-${globalIndex}-${attempts}`,
									code,
								);

								const parser = new DOMParser();
								const doc = parser.parseFromString(
									svg,
									"image/svg+xml",
								);
								const svgElement = doc.documentElement;

								element.innerHTML = "";
								element.__zoomAttached = false;
								element.appendChild(svgElement);

								// Add responsive support
								const insertedSvg =
									element.querySelector("svg");
								if (insertedSvg) {
									insertedSvg.setAttribute("width", "100%");
									insertedSvg.removeAttribute("height");
									insertedSvg.style.maxWidth = "100%";
									insertedSvg.style.height = "auto";
									//Todo Adjust as needed
									insertedSvg.style.minHeight = "300px";

									// Force apply styles
									if (isDark) {
										svgElement.style.filter =
											"brightness(0.9) contrast(1.1)";
									} else {
										svgElement.style.filter = "none";
									}
									attachZoomControls(element, insertedSvg);
									ensureFullscreenButton(element);
								}

								// Render succeeded; exit retry loop
								break;
							} catch (error) {
								attempts++;
								console.warn(
									`Mermaid rendering attempt ${attempts} failed for element ${globalIndex}:`,
									error,
								);

								if (attempts >= maxAttempts) {
									console.error(
										`Failed to render Mermaid diagram after ${maxAttempts} attempts:`,
										error,
									);
									element.innerHTML = `
										<div class="mermaid-error">
											<p>Failed to render diagram after ${maxAttempts} attempts.</p>
											<button onclick="location.reload()" style="margin-top: 8px; padding: 4px 8px; background: var(--primary); color: white; border: none; border-radius: 4px; cursor: pointer;">
												Retry Page
											</button>
										</div>
									`;
								} else {
									// Wait before retry
									await new Promise((resolve) =>
										setTimeout(resolve, 500 * attempts),
									);
								}
							}
						}
					}),
				);

				index += BATCH_SIZE;

				if (index < mermaidElements.length) {
					// Continue next batch on idle to avoid long main-thread block
					await new Promise((resolve) => {
						if ("requestIdleCallback" in window) {
							window.requestIdleCallback(() => resolve());
						} else {
							setTimeout(resolve, 50);
						}
					});
					return renderBatch();
				}
			}

			await renderBatch();
			retryCount = 0; // Reset retry count
			window.dispatchEvent(
				new CustomEvent("mermaid:render:done", {
					detail: { count: mermaidElements.length },
				}),
			);
		} catch (error) {
			console.error("Error in renderMermaidDiagrams:", error);
			window.dispatchEvent(new CustomEvent("mermaid:render:done"));

			// If render fails, try re-render
			if (retryCount < MAX_RETRIES) {
				retryCount++;
				setTimeout(
					() => renderMermaidDiagrams(),
					RETRY_DELAY * retryCount,
				);
			}
		} finally {
			isRendering = false;
		}
	}

	// Initialize theme state
	function initializeThemeState() {
		const isDark = document.documentElement.classList.contains("dark");
		currentTheme = isDark ? "dark" : "default";
	}

	// Load Mermaid library
	async function loadMermaid() {
		if (typeof window.mermaid !== "undefined") {
			return Promise.resolve();
		}

		return new Promise((resolve, reject) => {
			const script = document.createElement("script");
			script.src =
				"https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js";

			script.onload = () => {
				console.log("Mermaid library loaded successfully");
				resolve();
			};

			script.onerror = (error) => {
				console.error("Failed to load Mermaid library:", error);
				// Try fallback CDN
				const fallbackScript = document.createElement("script");
				fallbackScript.src =
					"https://unpkg.com/mermaid@11/dist/mermaid.min.js";

				fallbackScript.onload = () => {
					console.log("Mermaid library loaded from fallback CDN");
					resolve();
				};

				fallbackScript.onerror = () => {
					reject(
						new Error(
							"Failed to load Mermaid from both primary and fallback CDNs",
						),
					);
				};

				document.head.appendChild(fallbackScript);
			};

			document.head.appendChild(script);
		});
	}

	// Main init function
	async function initialize() {
		try {
			// Set up listeners
			setupMutationObserver();
			setupEventListeners();

			// Initialize theme state
			initializeThemeState();

			// Load and initialize Mermaid
			await loadMermaid();
			await initializeMermaid();

			// Expose renderMermaidDiagrams globally for post-decryption calls
			window.renderMermaidDiagrams = renderMermaidDiagrams;
		} catch (error) {
			console.error("Failed to initialize Mermaid system:", error);
		}
	}

	// Start initialization
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initialize);
	} else {
		initialize();
	}
})();
