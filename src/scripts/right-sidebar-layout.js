// Right sidebar layout manager
// Hides the right sidebar in grid layout mode

/**
 * Initialize page layout
 * @param {string} pageType - Page type (projects, skills, etc.)
 */
function initPageLayout(pageType) {
	// Get layout configuration
	const defaultPostListLayout =
		localStorage.getItem("postListLayout") || "list";

	// Hide right sidebar when default layout is grid mode
	if (defaultPostListLayout === "grid") {
		hideRightSidebar();
	} else {
		showRightSidebar();
	}

	// Listen for layout change events
	window.addEventListener("layoutChange", (event) => {
		const layout = event.detail.layout;
		if (layout === "grid") {
			hideRightSidebar();
		} else {
			showRightSidebar();
		}
	});

	// Listen for localStorage changes (cross-tab sync)
	window.addEventListener("storage", (event) => {
		if (event.key === "postListLayout") {
			if (event.newValue === "grid") {
				hideRightSidebar();
			} else {
				showRightSidebar();
			}
		}
	});

	// Listen for page navigation events
	document.addEventListener("astro:page-load", () => {
		setTimeout(() => {
			const currentLayout =
				localStorage.getItem("postListLayout") || "list";
			if (currentLayout === "grid") {
				hideRightSidebar();
			} else {
				showRightSidebar();
			}
		}, 100);
	});

	// Listen for Swup navigation events
	document.addEventListener("swup:contentReplaced", () => {
		setTimeout(() => {
			const currentLayout =
				localStorage.getItem("postListLayout") || "list";
			if (currentLayout === "grid") {
				hideRightSidebar();
			} else {
				showRightSidebar();
			}
		}, 100);
	});
}

/**
 * Hide the right sidebar
 */
function hideRightSidebar() {
	const rightSidebar = document.querySelector(".right-sidebar-container");
	if (rightSidebar) {
		// Add hide class
		rightSidebar.classList.add("hidden-in-grid-mode");

		// Set display to none for complete hiding
		rightSidebar.style.display = "none";

		// Adjust main grid layout
		const mainGrid = document.getElementById("main-grid");
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns = "17.5rem 1fr";
			mainGrid.setAttribute("data-layout-mode", "grid");
		}
	}
}

/**
 * Show the right sidebar
 */
function showRightSidebar() {
	const rightSidebar = document.querySelector(".right-sidebar-container");
	if (rightSidebar) {
		// Remove hide class
		rightSidebar.classList.remove("hidden-in-grid-mode");

		// Restore display
		rightSidebar.style.display = "";

		// Restore main grid layout
		const mainGrid = document.getElementById("main-grid");
		if (mainGrid) {
			mainGrid.style.gridTemplateColumns = "";
			mainGrid.setAttribute("data-layout-mode", "list");
		}
	}
}

// Initialize after page load
function initialize() {
	const pageType =
		document.documentElement.getAttribute("data-page-type") || "projects";
	initPageLayout(pageType);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initialize);
} else {
	initialize();
}

// Export functions for use by other scripts
if (typeof module !== "undefined" && module.exports) {
	module.exports = {
		initPageLayout,
		hideRightSidebar,
		showRightSidebar,
	};
}

// Also attach to window for direct use in the browser
if (typeof window !== "undefined") {
	window.rightSidebarLayout = {
		initPageLayout,
		hideRightSidebar,
		showRightSidebar,
	};
}
