<script lang="ts">
	import { DARK_MODE, DEFAULT_THEME, LIGHT_MODE } from "@constants/constants";
	import Icon from "@iconify/svelte";
	import { getStoredTheme, setTheme } from "@utils/setting-utils";
	import { onMount } from "svelte";

	import type { LIGHT_DARK_MODE } from "@/types/config.ts";

	const seq: LIGHT_DARK_MODE[] = [LIGHT_MODE, DARK_MODE];
	let mode: LIGHT_DARK_MODE = $state(DEFAULT_THEME);
	let isChanging = false;

	onMount(() => {
		mode = getStoredTheme();
	});

	function switchScheme(newMode: LIGHT_DARK_MODE) {
		// Prevent rapid repeated clicks
		if (isChanging) {
			return;
		}

		isChanging = true;
		mode = newMode;
		setTheme(newMode);

		// Reset after 50ms to throttle toggles
		setTimeout(() => {
			isChanging = false;
		}, 50);
	}

	function toggleScheme() {
		if (isChanging) {
			return;
		}

		let i = 0;
		for (; i < seq.length; i++) {
			if (seq[i] === mode) {
				break;
			}
		}
		switchScheme(seq[(i + 1) % seq.length]);
	}

	// Swup hooks to sync theme after navigation
	if (typeof window !== "undefined") {
		// Swup content replace
		const handleContentReplace = () => {
			// requestAnimationFrame to avoid render conflicts
			requestAnimationFrame(() => {
				const newMode = getStoredTheme();
				if (mode !== newMode) {
					mode = newMode;
				}
			});
		};

		// Whether Swup is loaded
		if ((window as any).swup && (window as any).swup.hooks) {
			(window as any).swup.hooks.on(
				"content:replace",
				handleContentReplace,
			);
		} else {
			document.addEventListener("swup:enable", () => {
				if ((window as any).swup && (window as any).swup.hooks) {
					(window as any).swup.hooks.on(
						"content:replace",
						handleContentReplace,
					);
				}
			});
		}

		// Sync once after initial load
		document.addEventListener("DOMContentLoaded", () => {
			requestAnimationFrame(() => {
				const newMode = getStoredTheme();
				if (mode !== newMode) {
					mode = newMode;
				}
			});
		});
	}
</script>

<button
	aria-label="Light/Dark Mode"
	class="relative btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 theme-switch-btn z-50"
	id="scheme-switch"
	onclick={toggleScheme}
	data-mode={mode}
>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== LIGHT_MODE}
		class:rotate-180={mode !== LIGHT_MODE}
	>
		<Icon
			icon="material-symbols:wb-sunny-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
	<div
		class="absolute transition-all duration-300 ease-in-out"
		class:opacity-0={mode !== DARK_MODE}
		class:rotate-180={mode !== DARK_MODE}
	>
		<Icon
			icon="material-symbols:dark-mode-outline-rounded"
			class="text-[1.25rem]"
		></Icon>
	</div>
</button>

<style>
	/* Instant theme switch button background */
	.theme-switch-btn::before {
		transition:
			transform 75ms ease-out,
			background-color 0ms !important;
	}
</style>
