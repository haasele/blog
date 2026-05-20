// Friends links page handler script
// Loaded as a global script; unaffected by Swup page transitions

(() => {
	console.log("[Friends Global] Script loaded");

	// Store state in global variables
	if (typeof window.friendsPageState === "undefined") {
		window.friendsPageState = {
			initialized: false,
			eventListeners: [],
			mutationObserver: null,
			copySuccessText: "Copied", // Default value; overridden by the page
		};
	}

	// Initialization
	function initFriendsPage() {
		console.log("[Friends Global] initFriendsPage called");

		var searchInput = document.getElementById("friend-search");
		var friendsGrid = document.getElementById("friends-grid");
		var noResults = document.getElementById("no-results");

		// Return early if required elements are missing
		if (!searchInput || !friendsGrid || !noResults) {
			return false;
		}

		var tagFilters = document.querySelectorAll(".filter-tag");
		var friendCards = document.querySelectorAll(".friend-card");
		var copyButtons = document.querySelectorAll(".copy-link-btn");

		console.log("[Friends Global] Found elements:", {
			cards: friendCards.length,
			filters: tagFilters.length,
			copyButtons: copyButtons.length,
		});

		// Read copy-success text from the page
		var copySuccessTextElement = document.getElementById(
			"friends-copy-success-text",
		);
		if (copySuccessTextElement) {
			window.friendsPageState.copySuccessText =
				copySuccessTextElement.textContent;
		}

		// Remove old event listeners
		if (window.friendsPageState.eventListeners.length > 0) {
			console.log(
				"[Friends Global] Cleaning",
				window.friendsPageState.eventListeners.length,
				"old listeners",
			);
			for (var i = 0; i < window.friendsPageState.eventListeners.length; i++) {
				var listener = window.friendsPageState.eventListeners[i];
				var element = listener[0];
				var type = listener[1];
				var handler = listener[2];
				if (element && element.removeEventListener) {
					element.removeEventListener(type, handler);
				}
			}
			window.friendsPageState.eventListeners = [];
		}

		var currentTag = "all";
		var searchTerm = "";

		// Filter friends
		function filterFriends() {
			var visibleCount = 0;
			for (var i = 0; i < friendCards.length; i++) {
				var card = friendCards[i];
				var title = (card.getAttribute("data-title") || "").toLowerCase();
				var desc = (card.getAttribute("data-desc") || "").toLowerCase();
				var tags = card.getAttribute("data-tags") || "";

				var matchesSearch =
					!searchTerm ||
					title.indexOf(searchTerm) >= 0 ||
					desc.indexOf(searchTerm) >= 0;
				var matchesTag =
					currentTag === "all" || tags.split(",").indexOf(currentTag) >= 0;

				if (matchesSearch && matchesTag) {
					card.style.display = "";
					visibleCount++;
				} else {
					card.style.display = "none";
				}
			}

			if (visibleCount === 0) {
				noResults.classList.remove("hidden");
				friendsGrid.classList.add("hidden");
			} else {
				noResults.classList.add("hidden");
				friendsGrid.classList.remove("hidden");
			}
		}

		// Search
		var searchHandler = (e) => {
			searchTerm = e.target.value.toLowerCase();
			filterFriends();
		};
		searchInput.addEventListener("input", searchHandler);
		window.friendsPageState.eventListeners.push([
			searchInput,
			"input",
			searchHandler,
		]);

		// Tag filter
		for (var i = 0; i < tagFilters.length; i++) {
			((button) => {
				var clickHandler = () => {
					// Update active state
					for (var j = 0; j < tagFilters.length; j++) {
						var btn = tagFilters[j];
						btn.classList.remove("active");
					}
					button.classList.add("active");

					currentTag = button.getAttribute("data-tag") || "all";
					filterFriends();
				};
				button.addEventListener("click", clickHandler);
				window.friendsPageState.eventListeners.push([
					button,
					"click",
					clickHandler,
				]);
			})(tagFilters[i]);
		}

		// Copy link
		for (var i = 0; i < copyButtons.length; i++) {
			((button) => {
				var clickHandler = () => {
					var url = button.getAttribute("data-url");
					if (!url) return;

					if (navigator.clipboard && navigator.clipboard.writeText) {
						navigator.clipboard
							.writeText(url)
							.then(() => {
								var originalHTML = button.innerHTML;
								button.innerHTML =
									'<div class="flex items-center gap-1"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg><span class="text-xs">' +
									window.friendsPageState.copySuccessText +
									"</span></div>";
								button.classList.add("text-green-500");
								setTimeout(() => {
									button.innerHTML = originalHTML;
									button.classList.remove("text-green-500");
								}, 2000);
							})
							.catch((err) => {
								console.error("[Friends Global] Copy failed:", err);
							});
					}
				};
				button.addEventListener("click", clickHandler);
				window.friendsPageState.eventListeners.push([
					button,
					"click",
					clickHandler,
				]);
			})(copyButtons[i]);
		}

		window.friendsPageState.initialized = true;
		console.log(
			"[Friends Global] ✅ Initialization complete with",
			window.friendsPageState.eventListeners.length,
			"listeners",
		);
		return true;
	}

	// Init with retries
	function tryInit(retries) {
		retries = retries || 0;
		if (initFriendsPage()) {
			console.log("[Friends Global] Init succeeded");
			return;
		}
		if (retries < 5) {
			setTimeout(() => {
				tryInit(retries + 1);
			}, 100);
		}
	}

	// MutationObserver for DOM changes
	function setupMutationObserver() {
		if (window.friendsPageState.mutationObserver) {
			window.friendsPageState.mutationObserver.disconnect();
		}

		window.friendsPageState.mutationObserver = new MutationObserver(
			(mutations) => {
				var shouldInit = false;
				for (var i = 0; i < mutations.length; i++) {
					var mutation = mutations[i];
					if (mutation.addedNodes && mutation.addedNodes.length > 0) {
						for (var j = 0; j < mutation.addedNodes.length; j++) {
							var node = mutation.addedNodes[j];
							if (node.nodeType === 1) {
								if (
									node.id === "friends-grid" ||
									node.id === "friend-search" ||
									(node.querySelector && node.querySelector("#friends-grid"))
								) {
									shouldInit = true;
									break;
								}
							}
						}
					}
					if (shouldInit) break;
				}

				if (shouldInit) {
					console.log("[Friends Global] DOM mutation detected");
					window.friendsPageState.initialized = false;
					setTimeout(() => {
						tryInit();
					}, 50);
				}
			},
		);

		window.friendsPageState.mutationObserver.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	// Init on page load
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			console.log("[Friends Global] DOMContentLoaded");
			tryInit();
		});
	} else {
		tryInit();
	}

	// Start MutationObserver
	setupMutationObserver();

	// Listen for page transition events
	var events = [
		"swup:contentReplaced",
		"swup:pageView",
		"astro:page-load",
		"astro:after-swap",
	];

	for (var i = 0; i < events.length; i++) {
		((eventName) => {
			document.addEventListener(eventName, () => {
				console.log("[Friends Global] Event:", eventName);
				window.friendsPageState.initialized = false;
				setTimeout(() => {
					tryInit();
				}, 100);
			});
		})(events[i]);
	}

	console.log("[Friends Global] All listeners registered");
})();
