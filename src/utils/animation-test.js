// Animation test utility - validates yukina-style slide effects

export function testSlideAnimation() {
	console.log("Testing slide animation effects...");

	// Test main animation elements
	const mainElements = document.querySelectorAll(".transition-main");
	const animationElements = document.querySelectorAll(".onload-animation");

	console.log(`Found ${mainElements.length} main transition elements`);
	console.log(`Found ${animationElements.length} onload animation elements`);

	// Check CSS animation properties
	mainElements.forEach((el, index) => {
		const styles = window.getComputedStyle(el);
		console.log(`Element ${index}:`, {
			transition: styles.transition,
			transform: styles.transform,
			opacity: styles.opacity,
		});
	});

	return {
		mainElements: mainElements.length,
		animationElements: animationElements.length,
		status: "Animation test completed",
	};
}

// Simulate page transition animation
export function simulatePageTransition() {
	const body = document.body;
	const html = document.documentElement;

	// Add leaving state
	html.classList.add("is-animating", "is-leaving");

	setTimeout(() => {
		// Remove leaving state and add entering state
		html.classList.remove("is-leaving");

		setTimeout(() => {
			// Finish animation
			html.classList.remove("is-animating");
			console.log("Page transition simulation completed");
		}, 300);
	}, 300);
}

// Test functions available in the console
if (typeof window !== "undefined") {
	window.testSlideAnimation = testSlideAnimation;
	window.simulatePageTransition = simulatePageTransition;
}
