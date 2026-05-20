/* ----

# Pio Plugin
# By: Dreamer-Paul
# Last Update: 2022.8.12

A JS plugin that supports swapping Live2D models.

Original code by Dreamer-Paul (奇趣保罗), licensed under GPL 2.0. Visit my blog: https://paugram.com

---- */

var Paul_Pio = function (prop) {
	const current = {
		idol: 0,
		timeout: undefined,
		menu: document.querySelector(".pio-container .pio-action"),
		canvas: document.getElementById("pio"),
		body: document.querySelector(".pio-container"),
		root: document.location.origin + "/",
	};

	// Utility functions
	const tools = {
		// Create element
		create: (tag, options) => {
			const el = document.createElement(tag);
			options.class && (el.className = options.class);

			return el;
		},
		// Random item
		rand: (arr) => {
			return arr[Math.floor(Math.random() * arr.length + 1) - 1];
		},
		// Whether on mobile
		isMobile: () => {
			let ua = window.navigator.userAgent.toLowerCase();
			ua = ua.indexOf("mobile") || ua.indexOf("android") || ua.indexOf("ios");

			return window.innerWidth < 500 || ua !== -1;
		},
	};

	const elements = {
		home: tools.create("span", { class: "pio-home" }),
		skin: tools.create("span", { class: "pio-skin" }),
		info: tools.create("span", { class: "pio-info" }),
		night: tools.create("span", { class: "pio-night" }),
		close: tools.create("span", { class: "pio-close" }),

		dialog: tools.create("div", { class: "pio-dialog" }),
		show: tools.create("div", { class: "pio-show" }),
	};

	current.body.appendChild(elements.dialog);
	current.body.appendChild(elements.show);

	/* - Methods */
	const modules = {
		// Change model
		idol: () => {
			current.idol < prop.model.length - 1
				? current.idol++
				: (current.idol = 0);

			return current.idol;
		},
		// Show dialog message
		message: (text, options = {}) => {
			const { dialog } = elements;

			if (text.constructor === Array) {
				dialog.innerText = tools.rand(text);
			} else if (text.constructor === String) {
				dialog[options.html ? "innerHTML" : "innerText"] = text;
			} else {
				dialog.innerText = "Something went wrong with the input X_X";
			}

			dialog.classList.add("active");

			current.timeout = clearTimeout(current.timeout) || undefined;
			current.timeout = setTimeout(() => {
				dialog.classList.remove("active");
			}, options.time || 3000);
		},
		// Destroy / hide
		destroy: () => {
			this.initHidden();
			localStorage.setItem("posterGirl", "0");
		},
	};

	this.destroy = modules.destroy;
	this.message = modules.message;

	/* - Actions */
	const action = {
		// Welcome
		welcome: () => {
			if (document.referrer && document.referrer.includes(current.root)) {
				const referrer = document.createElement("a");
				referrer.href = document.referrer;

				if (prop.content.referer) {
					modules.message(
						prop.content.referer.replace(/%t/, `“${referrer.hostname}”`),
					);
				} else {
					modules.message(`Welcome, friend from “${referrer.hostname}”!`);
				}
			} else if (prop.tips) {
				let text,
					hour = new Date().getHours();

				if (hour > 22 || hour <= 5) {
					text = "Still up? Get some sleep—you'll need it tomorrow!";
				} else if (hour > 5 && hour <= 8) {
					text = "Good morning!";
				} else if (hour > 8 && hour <= 11) {
					text = "Good morning! Take breaks and stretch—don't sit too long.";
				} else if (hour > 11 && hour <= 14) {
					text = "It's lunchtime—time for a break!";
				} else if (hour > 14 && hour <= 17) {
					text = "Afternoon slump? Did you hit your exercise goal today?";
				} else if (hour > 17 && hour <= 19) {
					text = "Good evening! Enjoy the sunset.";
				} else if (hour > 19 && hour <= 21) {
					text = "Good evening! How was your day?";
				} else if (hour > 21 && hour <= 23) {
					text = "It's getting late—get some rest. Good night!";
				} else {
					text = "Paul says: you should never see this message, haha";
				}

				modules.message(text);
			} else {
				modules.message(prop.content.welcome || "Welcome to the site!");
			}
		},
		// Touch
		touch: () => {
			current.canvas.onclick = () => {
				modules.message(
					prop.content.touch || [
						"What are you doing?",
						"Stop touching me or I'll call the police!",
						"HENTAI!",
						"Don't bully me like that!",
					],
				);
			};
		},
		// Right-side buttons
		buttons: () => {
			// Go home — Swup navigation without full reload
			elements.home.onclick = () => {
				// Check if Swup is available
				if (typeof window !== "undefined" && window.swup) {
					try {
						// Navigate via Swup without full reload
						window.swup.navigate("/");
					} catch (error) {
						console.error("Swup navigation failed:", error);
						// Fall back to full page navigation
						location.href = current.root;
					}
				} else {
					// Full page navigation when Swup is unavailable
					location.href = current.root;
				}
			};
			elements.home.onmouseover = () => {
				modules.message(prop.content.home || "Click here to go home!");
			};
			current.menu.appendChild(elements.home);

			// Change model
			if (prop.model && prop.model.length > 1) {
				elements.skin.onclick = () => {
					loadlive2d("pio", prop.model[modules.idol()]);

					prop.content.skin &&
						modules.message(prop.content.skin[1] || "Love the new outfit~");
				};
				elements.skin.onmouseover = () => {
					prop.content.skin &&
						modules.message(prop.content.skin[0] || "Want to see my new outfit?");
				};
				current.menu.appendChild(elements.skin);
			}

			// About
			elements.info.onclick = () => {
				window.open(
					prop.content.link ||
						"https://paugram.com/coding/add-poster-girl-with-plugin.html",
				);
			};
			elements.info.onmouseover = () => {
				modules.message("Want to learn more about me?");
			};
			current.menu.appendChild(elements.info);

			// Night mode
			if (prop.night) {
				elements.night.onclick = () => {
					typeof prop.night === "function" ? prop.night() : eval(prop.night);
				};
				elements.night.onmouseover = () => {
					modules.message("Click here at night to protect your eyes");
				};
				current.menu.appendChild(elements.night);
			}

			// Close mascot
			elements.close.onclick = () => {
				modules.destroy();
			};
			elements.close.onmouseover = () => {
				modules.message(prop.content.close || "QWQ See you next time~");
			};
			current.menu.appendChild(elements.close);
		},
		// Custom selectors
		custom: () => {
			prop.content.custom.forEach((item) => {
				const el = document.querySelectorAll(item.selector);

				if (!el.length) return;

				for (let i = 0; i < el.length; i++) {
					if (item.type === "read") {
						el[i].onmouseover = (ev) => {
							const text = ev.currentTarget.title || ev.currentTarget.innerText;
							modules.message("Want to read %t?".replace(/%t/, "“" + text + "”"));
						};
					} else if (item.type === "link") {
						el[i].onmouseover = (ev) => {
							const text = ev.currentTarget.title || ev.currentTarget.innerText;
							modules.message(
								"Want to learn about %t?".replace(/%t/, "“" + text + "”"),
							);
						};
					} else if (item.text) {
						el[i].onmouseover = () => {
							modules.message(t.text);
						};
					}
				}
			});
		},
	};

	/* - Startup */
	const begin = {
		static: () => {
			current.body.classList.add("static");
		},
		fixed: () => {
			action.touch();
			action.buttons();
		},
		draggable: () => {
			action.touch();
			action.buttons();

			const body = current.body;

			const location = {
				x: 0,
				y: 0,
			};

			const mousedown = (ev) => {
				const { offsetLeft, offsetTop } = ev.currentTarget;

				location.x = ev.clientX - offsetLeft;
				location.y = ev.clientY - offsetTop;

				document.addEventListener("mousemove", mousemove);
				document.addEventListener("mouseup", mouseup);
			};

			const mousemove = (ev) => {
				body.classList.add("active");
				body.classList.remove("right");

				body.style.left = ev.clientX - location.x + "px";
				body.style.top = ev.clientY - location.y + "px";
				body.style.bottom = "auto";
			};

			const mouseup = () => {
				body.classList.remove("active");
				document.removeEventListener("mousemove", mousemove);
			};

			body.onmousedown = mousedown;
		},
	};

	// Run init
	this.init = (noModel) => {
		// Show controls when visible and not on mobile
		if (!(prop.hidden && tools.isMobile())) {
			if (!noModel) {
				action.welcome();
				loadlive2d("pio", prop.model[0]);
			}

			switch (prop.mode) {
				case "static":
					begin.static();
					break;
				case "fixed":
					begin.fixed();
					break;
				case "draggable":
					begin.draggable();
					break;
			}

			prop.content.custom && action.custom();
		}
	};

	// Hidden state
	this.initHidden = () => {
		// Clear preset spacing
		if (prop.mode === "draggable") {
			current.body.style.top = null;
			current.body.style.left = null;
			current.body.style.bottom = null;
		}

		current.body.classList.add("pio-hidden");
		elements.dialog.classList.remove("active");

		elements.show.onclick = () => {
			current.body.classList.remove("pio-hidden");
			localStorage.setItem("posterGirl", "1");

			this.init();
		};
	};

	localStorage.getItem("posterGirl") === "0" ? this.initHidden() : this.init();
};

// Please retain copyright notice
if (window.console && window.console.log) {
	console.log(
		"%c Pio %c https://paugram.com ",
		"color: #fff; margin: 1em 0; padding: 5px 0; background: #673ab7;",
		"margin: 1em 0; padding: 5px 0; background: #efefef;",
	);
}
