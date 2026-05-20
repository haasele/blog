/**
 * Unified floating panel manager
 * Ensures only one panel is open at a time and applies consistent animations
 */

type PanelId =
	| "mobile-toc-panel"
	| "display-setting"
	| "nav-menu-panel"
	| "search-panel"
	| "wallpaper-mode-panel";

class PanelManager {
	private activePanels = new Set<PanelId>();
	private panelStack: PanelId[] = [];
	private readonly duration = 100;

	/**
	 * Open a panel with animation
	 */
	private animateIn(panel: HTMLElement): Promise<void> {
		return new Promise((resolve) => {
			// Skip animation during theme transitions
			const isThemeTransitioning =
				document.documentElement.classList.contains(
					"is-theme-transitioning",
				);

			if (isThemeTransitioning) {
				// During theme transition, show the panel directly without pointer-events: none
				panel.classList.remove("float-panel-closed");
				panel.style.opacity = "1";
				panel.style.transform = "scale(1) translateY(0)";
				resolve();
				return;
			}

			panel.classList.remove("float-panel-closed");
			panel.style.opacity = "0";
			panel.style.transform = "scale(0.95) translateY(-10px)";
			panel.style.pointerEvents = "none";

			requestAnimationFrame(() => {
				panel.style.transition = `all ${this.duration}ms ease-out`;

				requestAnimationFrame(() => {
					panel.style.opacity = "1";
					panel.style.transform = "scale(1) translateY(0)";
					panel.style.pointerEvents = "auto";

					setTimeout(() => {
						panel.style.transition = "";
						resolve();
					}, this.duration);
				});
			});
		});
	}

	/**
	 * Close a panel with animation
	 */
	private animateOut(panel: HTMLElement): Promise<void> {
		return new Promise((resolve) => {
			// Check for an active theme transition
			const isThemeTransitioning =
				document.documentElement.classList.contains(
					"is-theme-transitioning",
				);

			if (isThemeTransitioning) {
				// During theme transition, close the panel directly without pointer-events: none
				panel.classList.add("float-panel-closed");
				panel.style.opacity = "";
				panel.style.transform = "";
				resolve();
				return;
			}

			panel.style.transition = `all ${this.duration}ms ease-out`;
			panel.style.pointerEvents = "none";
			panel.style.opacity = "0";
			panel.style.transform = "scale(0.95) translateY(-10px)";

			setTimeout(() => {
				panel.classList.add("float-panel-closed");
				panel.style.transition = "";
				panel.style.opacity = "";
				panel.style.transform = "";
				panel.style.pointerEvents = "";
				resolve();
			}, this.duration);
		});
	}

	/**
	 * Toggle a panel open or closed
	 * @param panelId Panel ID
	 * @param forceState Force a specific state (optional)
	 * @returns Final panel state (true: open, false: closed)
	 */
	async togglePanel(
		panelId: PanelId,
		forceState?: boolean,
	): Promise<boolean> {
		const panel = document.getElementById(panelId);
		if (!panel) {
			console.warn(`Panel ${panelId} not found`);
			return false;
		}

		const isClosed = panel.classList.contains("float-panel-closed");
		const shouldOpen = forceState !== undefined ? forceState : isClosed;

		if (shouldOpen) {
			await this.closeAllPanelsExcept(panelId);
			await this.animateIn(panel);
			this.activePanels.add(panelId);
			this.panelStack = this.panelStack.filter((id) => id !== panelId);
			this.panelStack.push(panelId);
			return true;
		}
		await this.closePanel(panelId);
		return false;
	}

	/**
	 * Close a specific panel
	 * @param panelId Panel ID
	 */
	async closePanel(panelId: PanelId): Promise<void> {
		const panel = document.getElementById(panelId);
		if (panel && !panel.classList.contains("float-panel-closed")) {
			await this.animateOut(panel);
			this.activePanels.delete(panelId);
			this.panelStack = this.panelStack.filter((id) => id !== panelId);
		}
	}

	/**
	 * Close all panels except the specified one
	 * @param exceptPanelId Panel ID to keep open
	 */
	async closeAllPanelsExcept(exceptPanelId?: PanelId): Promise<void> {
		const closingPromises = Array.from(this.activePanels)
			.filter((panelId) => panelId !== exceptPanelId)
			.map((panelId) => this.closePanel(panelId));

		await Promise.all(closingPromises);
	}
}

// Global panel manager instance
export const panelManager = new PanelManager();

// Expose the panel manager globally for use elsewhere
if (typeof window !== "undefined") {
	(window as any).panelManager = panelManager;
}

export default panelManager;
