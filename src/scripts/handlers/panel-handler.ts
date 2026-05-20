/**
 * Panel handler
 * Manages click-outside-to-close behavior for panels
 */

/**
 * Panel configuration interface
 */
interface PanelConfig {
	id: string;
	ignoreElements: string[];
}

/**
 * Panel handler class
 * Initializes click-outside-to-close for panels
 */
export class PanelHandler {
	private panels: PanelConfig[] = [
		{
			id: "display-setting",
			ignoreElements: ["display-setting", "display-settings-switch"],
		},
		{
			id: "nav-menu-panel",
			ignoreElements: ["nav-menu-panel", "nav-menu-switch"],
		},
		{
			id: "search-panel",
			ignoreElements: ["search-panel", "search-bar", "search-switch"],
		},
		{
			id: "mobile-toc-panel",
			ignoreElements: ["mobile-toc-panel", "mobile-toc-switch"],
		},
		{
			id: "wallpaper-mode-panel",
			ignoreElements: ["wallpaper-mode-panel", "wallpaper-mode-switch"],
		},
	];

	private panelManager: any = null;
	private boundClickHandlers = new Map<string, (event: MouseEvent) => void>();

	/**
	 * Initialize panel handler
	 */
	async init(): Promise<void> {
		try {
			// Dynamically import panel manager
			const module = await import("../../utils/panel-manager.js");
			this.panelManager = module.panelManager;

			// Set up click-outside-to-close for all panels
			this.panels.forEach((panel) => {
				this.setupClickOutsideToClose(panel);
			});

			console.log("PanelHandler: initialized");
			return Promise.resolve();
		} catch (error) {
			console.error("PanelHandler: initialization failed", error);
			return Promise.reject(error);
		}
	}

	/**
	 * Set up click-outside-to-close for a panel
	 */
	private setupClickOutsideToClose(panel: PanelConfig): void {
		const clickHandler = async (event: MouseEvent) => {
			const target = event.target;
			if (!(target instanceof Node)) {
				return;
			}

			// Check if an ignored element was clicked
			for (const ignoreId of panel.ignoreElements) {
				const ignoreElement = document.getElementById(ignoreId);
				if (
					ignoreElement === target ||
					ignoreElement?.contains(target)
				) {
					return;
				}
			}

			// Close panel
			if (this.panelManager) {
				await this.panelManager.closePanel(panel.id);
			}
		};

		// Store bound handler for later cleanup
		this.boundClickHandlers.set(panel.id, clickHandler);
		document.addEventListener("click", clickHandler);
	}

	/**
	 * Add custom panel configuration
	 */
	addPanel(panel: PanelConfig): void {
		this.panels.push(panel);
		if (this.panelManager) {
			this.setupClickOutsideToClose(panel);
		}
	}

	/**
	 * Remove panel configuration
	 */
	removePanel(panelId: string): void {
		// Remove event listener
		const handler = this.boundClickHandlers.get(panelId);
		if (handler) {
			document.removeEventListener("click", handler);
			this.boundClickHandlers.delete(panelId);
		}

		// Remove from configuration
		this.panels = this.panels.filter((p) => p.id !== panelId);
	}

	/**
	 * Destroy handler
	 */
	destroy(): void {
		// Remove all event listeners
		this.boundClickHandlers.forEach((handler) => {
			document.removeEventListener("click", handler);
		});
		this.boundClickHandlers.clear();
		this.panelManager = null;
	}

	/**
	 * Get panel manager instance
	 */
	getPanelManager(): any {
		return this.panelManager;
	}
}

// Create global instance
let globalPanelHandler: PanelHandler | null = null;

/**
 * Get global panel handler instance
 */
export function getPanelHandler(): PanelHandler {
	if (!globalPanelHandler) {
		globalPanelHandler = new PanelHandler();
	}
	return globalPanelHandler;
}

/**
 * Initialize panel handler (convenience function)
 */
export async function initPanelHandler(): Promise<void> {
	const handler = getPanelHandler();
	await handler.init();
}
