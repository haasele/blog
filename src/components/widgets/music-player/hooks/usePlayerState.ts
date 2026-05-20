import { ERROR_DISPLAY_DURATION } from "../constants";

export interface PlayerUIState {
	isExpanded: boolean;
	isHidden: boolean;
	showPlaylist: boolean;
	errorMessage: string;
	showError: boolean;
}

export function createPlayerUIState(): PlayerUIState {
	return {
		isExpanded: false,
		isHidden: false,
		showPlaylist: false,
		// Error toast state
		errorMessage: "",
		showError: false,
	};
}

/**
 * Toggle expanded: show player and close playlist
 */
export function toggleExpandedUI(state: PlayerUIState) {
	state.isExpanded = !state.isExpanded;
	if (state.isExpanded) {
		state.showPlaylist = false;
		state.isHidden = false;
	}
}

/**
 * Toggle hidden: collapse player and close playlist
 */
export function toggleHiddenUI(state: PlayerUIState) {
	state.isHidden = !state.isHidden;
	if (state.isHidden) {
		state.isExpanded = false;
		state.showPlaylist = false;
	}
}

/**
 * Toggle playlist panel visibility
 */
export function togglePlaylistUI(state: PlayerUIState) {
	state.showPlaylist = !state.showPlaylist;
}

/**
 * Show error toast and auto-hide after a fixed delay
 */
export function showErrorMessageUI(state: PlayerUIState, message: string) {
	state.errorMessage = message;
	state.showError = true;
	setTimeout(() => {
		state.showError = false;
	}, ERROR_DISPLAY_DURATION);
}

export function hideErrorUI(state: PlayerUIState) {
	state.showError = false;
}
