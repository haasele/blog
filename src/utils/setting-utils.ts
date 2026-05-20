import {
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	// WALLPAPER_BANNER,
} from "@constants/constants";

import { siteConfig } from "@/config";
import type { LIGHT_DARK_MODE, WALLPAPER_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	// config-carrier may be missing during Swup page transitions; use the default
	if (!configCarrier) {
		return Number.parseInt(fallback);
	}
	return Number.parseInt(configCarrier.dataset.hue || fallback);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// Read the full current theme state
	const currentIsDark = document.documentElement.classList.contains("dark");
	const currentTheme = document.documentElement.getAttribute("data-theme");

	// Compute the target theme state
	let targetIsDark = false; // Default initialization
	switch (theme) {
		case LIGHT_MODE:
			targetIsDark = false;
			break;
		case DARK_MODE:
			targetIsDark = true;
			break;
		default:
			// Default case: keep the current theme state
			targetIsDark = currentIsDark;
			break;
	}

	// Determine whether a theme change is actually needed:
	// 1. whether the dark class changes
	// 2. whether the Expressive Code theme needs updating
	const needsThemeChange = currentIsDark !== targetIsDark;
	const expectedTheme = targetIsDark ? "github-dark" : "github-light";
	const needsCodeThemeUpdate = currentTheme !== expectedTheme;

	// No-op when neither theme nor code theme needs updating
	if (!needsThemeChange && !needsCodeThemeUpdate) {
		return;
	}

	// Apply the theme change
	const performThemeChange = () => {
		// Apply theme class changes
		if (needsThemeChange) {
			if (targetIsDark) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}

		// Set the theme for Expressive Code based on current mode
		// Update data-theme only when needed to reduce repaints
		if (needsCodeThemeUpdate) {
			const expressiveTheme = targetIsDark
				? "github-dark"
				: "github-light";
			document.documentElement.setAttribute(
				"data-theme",
				expressiveTheme,
			);
		}
	};

	// Use View Transitions API when supported
	if (
		needsThemeChange &&
		document.startViewTransition &&
		!window.matchMedia("(prefers-reduced-motion: reduce)").matches
	) {
		// Mark that a View Transition is in progress
		document.documentElement.classList.add(
			"is-theme-transitioning",
			"use-view-transition",
		);

		// Smooth transition via View Transitions API
		const transition = document.startViewTransition(() => {
			performThemeChange();
		});

		// Remove marker classes after the transition completes
		transition.finished
			.then(() => {
				// Use a microtask so cleanup finishes before the next event loop turn
				queueMicrotask(() => {
					document.documentElement.classList.remove(
						"is-theme-transitioning",
						"use-view-transition",
					);
				});
			})
			.catch(() => {
				// Clean up even if the transition is interrupted
				document.documentElement.classList.remove(
					"is-theme-transitioning",
					"use-view-transition",
				);
			});
	} else {
		// Fallback when View Transitions API is unavailable or reduced motion is preferred
		// Add transition guard only when a theme change is needed
		if (needsThemeChange) {
			document.documentElement.classList.add("is-theme-transitioning");
		}

		performThemeChange();

		// Remove transition guard on the next frame
		if (needsThemeChange) {
			requestAnimationFrame(() => {
				document.documentElement.classList.remove(
					"is-theme-transitioning",
				);
			});
		}
	}
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	localStorage.setItem("theme", theme);
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}

export function getStoredWallpaperMode(): WALLPAPER_MODE {
	return (
		(localStorage.getItem("wallpaperMode") as WALLPAPER_MODE) ||
		siteConfig.wallpaperMode.defaultMode
	);
}

export function setWallpaperMode(mode: WALLPAPER_MODE): void {
	localStorage.setItem("wallpaperMode", mode);
	// Notify other components that wallpaper mode changed
	window.dispatchEvent(
		new CustomEvent("wallpaper-mode-change", { detail: { mode } }),
	);
}
