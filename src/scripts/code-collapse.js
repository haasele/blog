class CodeBlockCollapser {
	constructor() {
		this.processedBlocks = new WeakSet();
		this.observer = null;
		this.isThemeChanging = false;
		this.debug = false; // Set to true to enable debug logging
		this.init();
	}

	log(...args) {
		if (this.debug) {
			console.log("[CodeBlockCollapser]", ...args);
		}
	}

	init() {
		this.log("Initializing...");
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", () => {
				this.log("DOMContentLoaded - setting up code blocks");
				this.setupCodeBlocks();
			});
		} else {
			this.log("Document already loaded - setting up code blocks");
			this.setupCodeBlocks();
		}
		this.observePageChanges();
		this.setupThemeChangeListener();
		this.setupThemeOptimizerSync();
	}

	setupThemeOptimizerSync() {
		// Sync with theme optimizer for consistent code block hide/show behavior
		this.syncWithThemeOptimizer();

		// Listen for theme optimizer ready event
		document.addEventListener("themeOptimizerReady", () => {
			this.log("Theme optimizer ready, syncing code block behavior");
			this.syncWithThemeOptimizer();
		});

		// Listen for page transition to keep in sync
		document.addEventListener("swup:pageView", () => {
			// Delayed sync so theme optimizer finishes code blocks first
			setTimeout(() => {
				this.syncWithThemeOptimizer();
			}, 150);
		});
	}

	syncWithThemeOptimizer() {
		// Check if theme optimizer exists
		if (window.themeOptimizer) {
			// Get current theme optimizer settings
			const shouldHideDuringTransition =
				window.themeOptimizer.hideCodeBlocksDuringTransition;

			// Apply same settings to code blocks
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				if (shouldHideDuringTransition) {
					block.classList.add("hide-during-transition");
				} else {
					block.classList.remove("hide-during-transition");
				}
			});

			this.log(
				`Synced with theme optimizer: hide code blocks during transition = ${shouldHideDuringTransition}`,
			);
		} else {
			// If theme optimizer missing, apply default behavior
			const codeBlocks = document.querySelectorAll(".expressive-code");
			codeBlocks.forEach((block) => {
				block.classList.add("hide-during-transition");
			});

			this.log("Theme optimizer not available, applied default behavior");
		}
	}

	setupThemeChangeListener() {
		// Listen for theme switch; pause observer and optimize during transition
		const themeObserver = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === "attributes" &&
					(mutation.attributeName === "class" ||
						mutation.attributeName === "data-theme")
				) {
					const isTransitioning =
						document.documentElement.classList.contains(
							"is-theme-transitioning",
						);

					if (isTransitioning && !this.isThemeChanging) {
						this.isThemeChanging = true;

						// Disconnect observer to avoid unnecessary checks during theme switch
						if (this.observer) {
							this.observer.disconnect();
						}

						// Performance: temporarily disable code block animations and transitions
						document
							.querySelectorAll(".expressive-code")
							.forEach((block) => {
								block.style.transition = "none";
							});
					} else if (!isTransitioning && this.isThemeChanging) {
						this.isThemeChanging = false;

						// Wait for theme switch to finish before restoring
						requestAnimationFrame(() => {
							// Restore code block transition effects
							document
								.querySelectorAll(".expressive-code")
								.forEach((block) => {
									block.style.transition = "";
								});

							// Reconnect observer
							setTimeout(() => {
								this.observePageChanges();
							}, 50);
						});
					}
					break;
				}
			}
		});

		themeObserver.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ["class", "data-theme"],
		});
	}

	setupCodeBlocks() {
		requestAnimationFrame(() => {
			const codeBlocks = document.querySelectorAll(".expressive-code");
			this.log(`Found ${codeBlocks.length} code blocks to process`);

			codeBlocks.forEach((codeBlock, index) => {
				if (!this.processedBlocks.has(codeBlock)) {
					this.log(`Enhancing code block ${index + 1}`);
					this.enhanceCodeBlock(codeBlock);
					this.processedBlocks.add(codeBlock);
				} else {
					this.log(`Code block ${index + 1} already processed`);
				}
			});
		});
	}

	enhanceCodeBlock(codeBlock) {
		const frame = codeBlock.querySelector(".frame");
		if (!frame) {
			this.log("No frame found in code block, skipping");
			return;
		}

		if (frame.classList.contains("has-title")) {
			this.log("Code block has title, skipping collapse feature");
			return;
		}

		this.log("Adding collapse feature to code block");
		codeBlock.classList.add("collapsible", "expanded");

		const toggleBtn = this.createToggleButton();
		frame.appendChild(toggleBtn);

		this.bindToggleEvents(codeBlock, toggleBtn);
	}

	createToggleButton() {
		const button = document.createElement("button");
		button.className = "collapse-toggle-btn";
		button.type = "button";
		button.setAttribute("aria-label", "Collapse or expand code block");

		button.innerHTML = `
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <g fill="none">
          <path d="M24 0v24H0V0zM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z"></path>
          <path fill="currentColor" d="m12 16.172l-4.95-4.95a1 1 0 1 0-1.414 1.414l5.657 5.657a1 1 0 0 0 1.414 0l5.657-5.657a1 1 0 0 0-1.414-1.414z"></path>
        </g>
      </svg>
    `;

		return button;
	}

	bindToggleEvents(codeBlock, button) {
		button.addEventListener("click", (e) => {
			e.preventDefault();
			e.stopPropagation();
			this.toggleCollapse(codeBlock);
		});

		button.addEventListener("keydown", (e) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				this.toggleCollapse(codeBlock);
			}
		});
	}

	toggleCollapse(codeBlock) {
		const isCollapsed = codeBlock.classList.contains("collapsed");

		requestAnimationFrame(() => {
			if (isCollapsed) {
				codeBlock.classList.remove("collapsed");
				codeBlock.classList.add("expanded");
			} else {
				codeBlock.classList.remove("expanded");
				codeBlock.classList.add("collapsed");
			}
		});

		const event = new CustomEvent("codeBlockToggle", {
			detail: { collapsed: !isCollapsed, element: codeBlock },
		});
		document.dispatchEvent(event);
	}

	observePageChanges() {
		// Do not reconnect during theme switch
		if (this.isThemeChanging) {
			return;
		}

		// Disconnect existing observer
		if (this.observer) {
			this.observer.disconnect();
		}

		let debounceTimer = null;

		this.observer = new MutationObserver((mutations) => {
			// Ignore all mutations during theme switch
			if (this.isThemeChanging) {
				return;
			}

			let shouldReinit = false;

			// Outer loop: iterate all mutations
			for (const mutation of mutations) {
				if (
					mutation.type === "childList" &&
					mutation.addedNodes.length > 0
				) {
					// Inner loop: iterate added nodes
					for (const node of mutation.addedNodes) {
						// Only check element nodes (nodeType 1)
						if (node.nodeType === Node.ELEMENT_NODE) {
							if (
								node.classList.contains("expressive-code") ||
								(node.getElementsByClassName &&
									node.getElementsByClassName(
										"expressive-code",
									).length > 0)
							) {
								shouldReinit = true;
								break;
							}
						}
					}
				}
				if (shouldReinit) {
					break;
				}
			}

			if (shouldReinit) {
				clearTimeout(debounceTimer);
				debounceTimer = setTimeout(() => this.setupCodeBlocks(), 30);
			}
		});

		this.observer.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	destroy() {
		if (this.observer) {
			this.observer.disconnect();
			this.observer = null;
		}
		this.processedBlocks = new WeakSet();
	}

	// Public API methods
	collapseAll() {
		const allBlocks = document.querySelectorAll(
			".expressive-code.expanded",
		);
		allBlocks.forEach((block) => {
			this.toggleCollapse(block);
		});
	}

	expandAll() {
		const allBlocks = document.querySelectorAll(
			".expressive-code.collapsed",
		);
		allBlocks.forEach((block) => {
			this.toggleCollapse(block);
		});
	}
}

const codeBlockCollapser = new CodeBlockCollapser();

window.CodeBlockCollapser = CodeBlockCollapser;
window.codeBlockCollapser = codeBlockCollapser;

// Function to set up Swup hooks
function setupSwupHooks() {
	if (window.swup) {
		codeBlockCollapser.log("Setting up Swup hooks");

		// Listen for page:view event
		window.swup.hooks.on("page:view", () => {
			codeBlockCollapser.log(
				"Swup page:view event - reinitializing code blocks",
			);
			// Reset processedBlocks after page transition so new page code blocks are processed
			codeBlockCollapser.processedBlocks = new WeakSet();
			setTimeout(() => {
				codeBlockCollapser.setupCodeBlocks();
			}, 100);
		});

		// Listen for content:replace event (fires earlier)
		window.swup.hooks.on("content:replace", () => {
			codeBlockCollapser.log(
				"Swup content:replace event - preparing for reinitialization",
			);
			// Reset on content replace to avoid skipping due to cache
			codeBlockCollapser.processedBlocks = new WeakSet();
			setTimeout(() => {
				codeBlockCollapser.setupCodeBlocks();
			}, 50);
		});

		return true;
	}
	return false;
}

// Try to set up Swup hooks immediately
if (!setupSwupHooks()) {
	// If Swup is not initialized yet, wait for it to load
	codeBlockCollapser.log("Swup not ready, waiting for initialization");

	// Listen for swup:enable event
	document.addEventListener("swup:enable", () => {
		codeBlockCollapser.log("Swup enabled, setting up hooks");
		setupSwupHooks();
	});

	// Additional delayed retry to ensure Swup is captured
	const retryInterval = setInterval(() => {
		if (setupSwupHooks()) {
			codeBlockCollapser.log("Swup hooks set up successfully via retry");
			clearInterval(retryInterval);
		}
	}, 100);

	// Retry up to 20 times (2 seconds)
	setTimeout(() => {
		clearInterval(retryInterval);
	}, 2000);
}
