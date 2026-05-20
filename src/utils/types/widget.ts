import type { MarkdownHeading } from "astro";

import type {
	WidgetComponentConfig,
	WidgetComponentType,
} from "@/types/config";

/**
 * Widget component type
 */
export type WidgetType = WidgetComponentType;

/**
 * Widget component configuration
 */
export interface WidgetConfig extends WidgetComponentConfig {
	customProps?: Record<string, unknown>;
}

/**
 * Widget component map type
 */
export type WidgetComponentMap = Partial<Record<WidgetType, unknown>>;

/**
 * Widget render options
 */
export interface RenderComponentOptions {
	component: WidgetConfig;
	index: number;
	components: WidgetConfig[];
	headings?: MarkdownHeading[];
}

/**
 * Widget render result
 */
export interface RenderComponentResult {
	Component: unknown;
	props: Record<string, unknown>;
}

/**
 * Device type
 */
export type DeviceType = "mobile" | "tablet" | "desktop";

/**
 * Responsive sidebar configuration
 */
export interface ResponsiveSidebarConfig {
	breakpoints: {
		mobile: number;
		tablet: number;
	};
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
 * Sidebar manager interface
 */
export interface SidebarManagerInterface {
	init(): void;
	updateResponsiveDisplay(): void;
}

/**
 * Sidebar element ID type
 */
export type SidebarElementId = "sidebar" | "right-sidebar";

/**
 * Sidebar position
 */
export type SidebarPosition = "left" | "right" | "drawer";
