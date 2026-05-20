/**
 * Widget rendering utilities
 * Provides shared logic for sidebar widget rendering
 */
import type { MarkdownHeading } from "astro";

import type { WidgetConfig } from "./types/widget";
import { widgetManager } from "./widget-manager";

/**
 * Widget render result
 */
export interface RenderResult {
	Component: unknown;
	props: Record<string, unknown>;
}

/**
 * Get widget class and style attributes
 * @param component Widget configuration
 * @param index Widget index
 * @returns Object containing class and style
 */
export function getComponentStyles(
	component: WidgetConfig,
	index: number,
): { class: string; style: string } {
	const componentClass = widgetManager.getComponentClass(component, index);
	const componentStyle = widgetManager.getComponentStyle(component, index);
	return {
		class: componentClass,
		style: componentStyle,
	};
}

/**
 * Assemble widget props
 * @param component Widget configuration
 * @param index Widget index
 * @param headings Optional Markdown headings (for TOC widgets)
 * @returns Assembled props object
 */
export function buildComponentProps(
	component: WidgetConfig,
	index: number,
	headings?: MarkdownHeading[],
): Record<string, unknown> {
	const { class: componentClass, style: componentStyle } = getComponentStyles(
		component,
		index,
	);

	const props: Record<string, unknown> = {
		class: componentClass,
		style: componentStyle,
		...component.customProps,
	};

	// TOC widgets require headings to be passed in
	if (
		(component.type === "toc" || component.type === "card-toc") &&
		headings
	) {
		props.headings = headings;
	}

	return props;
}

/**
 * Get device type
 * @param width Window width
 * @param breakpoints Breakpoint configuration
 * @returns Device type
 */
export function getDeviceType(
	width: number,
	breakpoints: { mobile: number; tablet: number },
): "mobile" | "tablet" | "desktop" {
	if (width < breakpoints.mobile) {
		return "mobile";
	}
	if (width < breakpoints.tablet) {
		return "tablet";
	}
	return "desktop";
}
