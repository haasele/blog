/**
 * Responsive sidebar manager
 * Provides shared logic for responsive sidebar display
 */
import type { SidebarElementId } from "./types/widget";
import { widgetManager } from "./widget-manager";
import { getDeviceType } from "./widget-renderer";

// Extended Window interface
interface WindowWithCustomProps extends Window {
	[key: string]: unknown;
}

/**
 * Sidebar display configuration
 */
export interface SidebarDisplayConfig {
	elementId: SidebarElementId;
	managerKey: string;
	breakpoints: { mobile: number; tablet: number };
	showConfig: {
		mobile: boolean;
		tablet: boolean;
		desktop: boolean;
	};
	hasComponents: {
		mobile: boolean;
		tablet: boolean;
	};
}

/**
 * Build sidebar display CSS properties
 * @param config Display configuration
 * @returns Computed CSS display properties
 */
function getSidebarDisplayProperty(
	config: SidebarDisplayConfig,
): Record<string, string> {
	const width = window.innerWidth;
	const deviceType = getDeviceType(width, config.breakpoints);

	let show = false;
	if (deviceType === "mobile") {
		show = config.showConfig.mobile && config.hasComponents.mobile;
	} else if (deviceType === "tablet") {
		show = config.showConfig.tablet && config.hasComponents.tablet;
	} else {
		show = config.showConfig.desktop && config.hasComponents.tablet;
	}

	return {
		[`--sidebar-${deviceType}-display`]: show ? "block" : "none",
	};
}

/**
 * Initialize the responsive sidebar manager
 * @param config Sidebar display configuration
 */
export function initSidebarManager(config: SidebarDisplayConfig): void {
	const managerKey = config.managerKey;
	const win = window as unknown as WindowWithCustomProps;

	// Avoid duplicate initialization
	if (win[managerKey]) {
		return;
	}
	win[managerKey] = true;

	/**
	 * Update sidebar display state
	 */
	function updateDisplay(): void {
		const sidebar = document.getElementById(config.elementId);
		if (!sidebar) {
			return;
		}

		const displayProps = getSidebarDisplayProperty(config);
		for (const [property, value] of Object.entries(displayProps)) {
			sidebar.style.setProperty(property, value);
		}
	}

	// Initialize display state
	updateDisplay();

	// Listen for window resize
	const resizeHandler = (): void => updateDisplay();
	const resizeKey = `${config.managerKey}ResizeHandler`;
	win[resizeKey] = resizeHandler;
	window.addEventListener("resize", resizeHandler);

	// Listen for Swup content replacement
	if (typeof window !== "undefined" && win.swup) {
		const swupHookKey = `${config.managerKey}SwupHooked`;
		if (!win[swupHookKey]) {
			win[swupHookKey] = true;
			win.swup.hooks.on("content:replace", () => {
				// Delay to ensure the DOM has updated
				setTimeout(() => {
					updateDisplay();
				}, 100);
			});
		}
	}
}

/**
 * Get display configuration for RightSideBar
 */
export function getRightSidebarDisplayConfig(): SidebarDisplayConfig {
	return {
		elementId: "right-sidebar",
		managerKey: "__mizukiRightSidebarManagerInitialized",
		breakpoints: widgetManager.getBreakpoints(),
		showConfig: {
			mobile: false,
			tablet: false,
			desktop: true,
		},
		hasComponents: {
			mobile: false,
			tablet: false,
		},
	};
}
