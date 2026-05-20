import { sidebarLayoutConfig } from "../config";
import type {
	SidebarLayoutConfig,
	WidgetComponentConfig,
	WidgetComponentType,
} from "../types/config";

/**
 * Widget component map - maps widget types to component import paths
 */
export const WIDGET_COMPONENT_MAP = {
	profile: "../components/widgets/profile/Profile.astro",
	announcement: "../components/widgets/announcement/Announcement.astro",
	categories: "../components/widgets/categories/Categories.astro",
	tags: "../components/widgets/tags/Tags.astro",
	toc: "../components/widgets/toc/TOC.astro",
	"card-toc": "../components/widgets/card-toc/CardTOC.astro",
	"music-player": "../components/widgets/music-player/MusicPlayer.svelte",
	"music-sidebar":
		"../components/widgets/music-sidebar/MusicSidebarWidget.astro",
	pio: "../components/widget/Pio.astro",
	"site-stats": "../components/widgets/site-stats/SiteStats.astro",
	calendar: "../components/widgets/calendar/Calendar.astro",
	custom: null,
} as const;

/**
 * Widget manager
 * Handles dynamic loading, ordering, and rendering of sidebar widgets
 */
export class WidgetManager {
	private config: SidebarLayoutConfig;

	constructor(config: SidebarLayoutConfig = sidebarLayoutConfig) {
		this.config = config;
	}

	/**
	 * Get configuration
	 */
	getConfig(): SidebarLayoutConfig {
		return this.config;
	}

	/**
	 * Get widgets by position
	 * @param position Widget position: 'top' | 'sticky'
	 * @param sidebar Sidebar position (optional): 'left' | 'right' | 'drawer'
	 * @param deviceType Device type (optional): 'mobile' | 'tablet' | 'desktop'
	 */
	getComponentsByPosition(
		position: "top" | "sticky",
		sidebar: "left" | "right" | "drawer" = "left",
		deviceType: "mobile" | "tablet" | "desktop" = "desktop",
	): WidgetComponentConfig[] {
		let activeSidebar = sidebar;

		// Mobile: drawer only; do not merge left and right sidebars
		if (deviceType === "mobile") {
			activeSidebar = "drawer";
		}
		// Tablet: keep left widgets when configured; otherwise move right widgets to the left
		else if (deviceType === "tablet") {
			if (sidebar === "right") {
				return [];
			}
			if (sidebar === "left") {
				activeSidebar =
					this.config.components.left.length > 0 ? "left" : "right";
			}
		}

		const componentTypes = this.config.components[activeSidebar] || [];

		return componentTypes
			.map((type) => {
				const prop = this.config.properties.find(
					(p) => p.type === type,
				);
				if (prop && prop.position === position) {
					return prop;
				}
				// Fall back to a basic config when properties are missing and position is the default top
				if (!prop && position === "top") {
					return { type, position: "top" } as WidgetComponentConfig;
				}
				return null;
			})
			.filter(Boolean) as WidgetComponentConfig[];
	}

	/**
	 * Get animation delay for a widget
	 * @param component Widget configuration
	 * @param index Widget index in the list
	 */
	getAnimationDelay(component: WidgetComponentConfig, index: number): number {
		if (component.animationDelay !== undefined) {
			return component.animationDelay;
		}

		if (this.config.defaultAnimation.enable) {
			return (
				this.config.defaultAnimation.baseDelay +
				index * this.config.defaultAnimation.increment
			);
		}

		return 0;
	}

	/**
	 * Get CSS class names for a widget
	 * @param component Widget configuration
	 * @param index Widget index in the list
	 */
	getComponentClass(
		component: WidgetComponentConfig,
		_index: number,
	): string {
		const classes: string[] = [];

		// Base class names
		if (component.class) {
			classes.push(component.class);
		}

		// Responsive hide classes
		if (component.responsive?.hidden) {
			component.responsive.hidden.forEach((device) => {
				switch (device) {
					case "mobile":
						classes.push("hidden", "md:block");
						break;
					case "tablet":
						classes.push("md:hidden", "lg:block");
						break;
					case "desktop":
						classes.push("lg:hidden");
						break;
				}
			});
		}

		return classes.join(" ");
	}

	/**
	 * Get inline styles for a widget
	 * @param component Widget configuration
	 * @param index Widget index in the list
	 */
	getComponentStyle(component: WidgetComponentConfig, index: number): string {
		const styles: string[] = [];

		// Custom styles
		if (component.style) {
			styles.push(component.style);
		}

		// Animation delay styles
		const animationDelay = this.getAnimationDelay(component, index);
		if (animationDelay > 0) {
			styles.push(`animation-delay: ${animationDelay}ms`);
		}

		return styles.join("; ");
	}

	/**
	 * Check whether a widget should be collapsed
	 * @param component Widget configuration
	 * @param itemCount Number of content items in the widget
	 */
	isCollapsed(component: WidgetComponentConfig, itemCount: number): boolean {
		if (!component.responsive?.collapseThreshold) {
			return false;
		}
		return itemCount >= component.responsive.collapseThreshold;
	}

	/**
	 * Get the import path for a widget
	 * @param componentType Widget type
	 */
	getComponentPath(componentType: WidgetComponentType): string | null {
		return WIDGET_COMPONENT_MAP[componentType];
	}

	/**
	 * Check whether the sidebar should be shown for the current device
	 * @param deviceType Device type
	 */
	shouldShowSidebar(deviceType: "mobile" | "tablet" | "desktop"): boolean {
		if (deviceType === "mobile") {
			return this.config.components.drawer.length > 0;
		}
		if (deviceType === "tablet") {
			return (
				this.config.components.left.length > 0 ||
				this.config.components.right.length > 0
			);
		}
		// desktop
		return (
			this.config.components.left.length > 0 ||
			this.config.components.right.length > 0
		);
	}

	/**
	 * Get responsive breakpoint configuration
	 */
	getBreakpoints() {
		return this.config.responsive.breakpoints;
	}

	/**
	 * Update widget configuration
	 * @param newConfig New configuration
	 */
	updateConfig(newConfig: Partial<SidebarLayoutConfig>): void {
		this.config = { ...this.config, ...newConfig };
	}

	/**
	 * Add a widget to the layout
	 * @param type Widget type
	 * @param sidebar Sidebar position
	 */
	addComponentToLayout(
		type: WidgetComponentType,
		sidebar: "left" | "right" | "drawer" = "left",
	): void {
		if (!this.config.components[sidebar].includes(type)) {
			this.config.components[sidebar].push(type);
		}
	}

	/**
	 * Remove a widget from the layout
	 * @param type Widget type
	 */
	removeComponentFromLayout(type: WidgetComponentType): void {
		this.config.components.left = this.config.components.left.filter(
			(t) => t !== type,
		);
		this.config.components.right = this.config.components.right.filter(
			(t) => t !== type,
		);
		this.config.components.drawer = this.config.components.drawer.filter(
			(t) => t !== type,
		);
	}

	/**
	 * Check whether a widget should render in the sidebar
	 * @param componentType Widget type
	 */
	isSidebarComponent(componentType: WidgetComponentType): boolean {
		// Pio is a global widget and is not rendered in the sidebar
		return componentType !== "pio";
	}
}

/**
 * Default widget manager instance
 */
export const widgetManager = new WidgetManager();

/**
 * Utility: get widget configuration by type
 * @param componentType Widget type
 */
export function getComponentConfig(
	componentType: WidgetComponentType,
): WidgetComponentConfig | undefined {
	return widgetManager
		.getConfig()
		.properties.find((p) => p.type === componentType);
}

/**
 * Utility: check whether a widget type is enabled
 * @param componentType Widget type
 */
export function isComponentEnabled(
	componentType: WidgetComponentType,
): boolean {
	const config = widgetManager.getConfig().components;
	return (
		config.left.includes(componentType) ||
		config.right.includes(componentType) ||
		config.drawer.includes(componentType)
	);
}

/**
 * Utility: get all enabled widget types (left sidebar is primary)
 */
export function getEnabledComponentTypes(): WidgetComponentType[] {
	return widgetManager.getConfig().components.left;
}
