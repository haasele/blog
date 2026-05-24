import type {
	AnnouncementConfig,
	CommentConfig,
	ExpressiveCodeConfig,
	FooterConfig,
	FullscreenWallpaperConfig,
	LicenseConfig,
	MusicPlayerConfig,
	NavBarConfig,
	PermalinkConfig,
	ProfileConfig,
	RandomPostsConfig,
	RelatedPostsConfig,
	SakuraConfig,
	ShareConfig,
	SidebarLayoutConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

// Omit i18n import to avoid circular dependency

// Site language
const SITE_LANG = "en"; // Language code, e.g. 'en', 'zh_CN', 'ja', etc.
export const siteConfig: SiteConfig = {
	title: "haasele",
	subtitle: "haasele's Blog",
	siteURL: "https://blog.haasele.dev/", // Replace with your site URL (trailing slash required)
	siteStartDate: "2026-05-20", // Site launch date for uptime calculation in site stats

	lang: SITE_LANG,

	themeColor: {
		hue: 140, // Default theme hue (0-360). e.g. red: 0, cyan: 200, teal: 250, pink: 345
		fixed: false, // Hide theme color picker from visitors
	},

	// Feature page toggles (disable unused pages to improve SEO; remove navbar links when off)
	featurePages: {
		movie: true, // Movie page toggle
		diary: true, // Diary page toggle
		friends: true, // Friends page toggle
		projects: true, // Projects page toggle
		skills: true, // Skills page toggle
		timeline: true, // Timeline page toggle
		albums: true, // Albums page toggle
		devices: true, // Devices page toggle
	},

	// Navbar title config
	navbarTitle: {
		// Display mode: "text-icon" shows icon + text, "logo" shows logo only
		mode: "text-icon",
		// Navbar title text
		text: "</haasele>",
		// Navbar title icon path, defaults to public/assets/home/home.webp
		icon: "assets/home/home.webp",
		// Site logo image path
		logo: "assets/home/default-logo.webp",
	},

	// Page auto-scaling config
	pageScaling: {
		enable: true, // Enable auto-scaling
		targetWidth: 2000, // Target width; scaling starts below this value
	},

	bangumi: {
		userId: "your-bangumi-id", // Set your Bangumi user ID here, e.g. "sai" for testing
		fetchOnDev: false, // Fetch Bangumi data in dev (default false); run pnpm build first to generate JSON
	},

	bilibili: {
		vmid: "your-bilibili-vmid", // Set your Bilibili user ID (uid) here, e.g. "1129280784"
		fetchOnDev: false, // Fetch Bilibili data in dev (default false)
		coverMirror: "", // Cover image mirror (optional), e.g. "https://images.weserv.nl/?url="
		useWebp: true, // Use WebP format (default true)

		// Bilibili watch progress config (optional; read carefully if needed):
		// 1. Local dev: set BILI_SESSDATA=your_SESSDATA in .env
		// 2. Remote build: add BILI_SESSDATA in GitHub repo Settings -> Secrets
		// Note: SESSDATA is an account credential; never hard-code it.
		// Security: if SESSDATA is leaked, open Bilibili mobile app -> Me -> Settings -> Security & Privacy -> Login devices -> Sign out all devices
	},

	movie: {
		mode: "local", // Movie page mode: "bangumi" uses Bangumi API, "local" uses local config, "bilibili" uses Bilibili API
	},

	// Memos API URL for diary page; leave empty to use static data
	diaryApiUrl: "",

	// Post list layout config
	postListLayout: {
		// Default layout: "list" (single column) or "grid" (two columns)
		// Note: "grid" is unavailable when sidebar layout uses "both" (dual sidebars)
		defaultMode: "list",
		// Allow users to switch layout
		allowSwitch: true,
		// Category bar on post list page
		categoryBar: {
			enable: true, // Show category bar on post list page
		},
	},

	// Tag style config
	tagStyle: {
		// true = hover highlight style, false = outlined always-on style
		useNewStyle: false,
	},

	// Wallpaper mode config
	wallpaperMode: {
		// Default mode: banner = top banner, fullscreen = full-screen wallpaper, none = no wallpaper
		defaultMode: "banner",
		// Layout mode switch visibility (default: "desktop")
		// "off" = hidden
		// "mobile" = mobile only
		// "desktop" = desktop only
		// "both" = all devices
		showModeSwitchOnMobile: "desktop",
	},

	banner: {
		// Single image or array; carousel auto-enables when length > 1
		src: {
			desktop: [
				"/assets/desktop-banner/1.webp",
				"/assets/desktop-banner/2.webp",
				"/assets/desktop-banner/3.webp",
				"/assets/desktop-banner/4.webp",
			], // Desktop banner images
			mobile: [
				"/assets/mobile-banner/1.webp",
				"/assets/mobile-banner/2.webp",
				"/assets/mobile-banner/3.webp",
				"/assets/mobile-banner/4.webp",
			], // Mobile banner images
		}, // Local banner images

		position: "center", // Same as object-position; only 'top', 'center', 'bottom'. Default: 'center'

		carousel: {
			enable: true, // true = carousel for multiple images; false = random single image from array
			interval: 3, // Carousel interval in seconds
		},

		waves: {
			enable: true, // Enable wave effect (performance-heavy)
			performanceMode: false, // Performance mode: simpler animation (~40% faster)
			mobileDisable: false, // Disable on mobile
		},

		// PicFlow API support (smart image API)
		imageApi: {
			enable: false, // Enable image API
			url: "http://domain.com/api_v2.php?format=text&count=4", // API URL; returns one image URL per line
		},
		// PicFlow API Text format requires format=text
		// Project: https://github.com/matsuzaka-yuki/PicFlow-API
		// Host your own API instance

		homeText: {
			enable: true, // Show custom text on homepage
			title: "Home", // Homepage banner title

			subtitle: [
				"Nothing special here,don't expect anything",
				"'Be Yourself' , Miles Morales",
				"'You made those words up.', Soldier Boy",
			],
			typewriter: {
				enable: true, // Enable typewriter effect for subtitle

				speed: 50, // Typing speed (ms)
				deleteSpeed: 25, // Delete speed (ms)
				pauseTime: 10000, // Pause after full text (ms)
			},
		},

		credit: {
			enable: false, // Show banner image credit text

			text: "Images", // Credit text to display
			url: "", // (Optional) URL to original artwork or artist page
		},

		navbar: {
			transparentMode: "semifull", // Navbar: "semi" = frosted glass, "full" = lighter glass over banner, "semifull" = stronger glass after scroll
		},
	},
	toc: {
		enable: true, // Master toggle for table of contents
		mobileTop: true, // Mobile top TOC button
		desktopSidebar: true, // Desktop right sidebar TOC
		floating: true, // Floating TOC button
		depth: 3, // TOC depth (1-6); 1 = h1 only, 2 = h1 + h2, etc.
		useJapaneseBadge: true, // Use Japanese kana badges (あいうえお...) instead of numbers (1, 2, 3...)
	},
	showCoverInContent: true, // Show post cover on article page
	generateOgImages: false, // Generate OpenGraph images (slow to render; avoid enabling during local dev)
	favicon: [
		// {
		// 	src: "/favicon/favicon.ico", // Icon file path
		// 	theme: "light", // Optional theme: 'light' | 'dark'
		// 	sizes: "32x32", // Optional icon size
		// },
	],

	// Font config
	font: {
		// Custom fonts must be imported in src/styles/main.css
		// Font subsetting supports TTF only; visible in production, not in dev (browser default shown)
		asciiFont: {
			// Latin font — highest priority
			// When set as Latin font, only ASCII subset is kept regardless of font coverage
			fontFamily: "ZenMaruGothic-Medium",
			fontWeight: "400",
			localFonts: ["ZenMaruGothic-Medium.ttf"],
			enableCompress: true, // Enable font subsetting to reduce file size
		},
		cjkFont: {
			// CJK fallback font
			fontFamily: "萝莉体 第二版",
			fontWeight: "500",
			localFonts: ["loli.ttf"],
			enableCompress: true, // Enable font subsetting to reduce file size
		},
	},
	showLastModified: true, // Toggle "Last modified" card
	pageProgressBar: {
		enable: true, // Enable top page progress bar
		height: 3, // Progress bar height in px
		duration: 6000, // Animation duration in ms
	},

	thirdPartyAnalytics: {
		enable: false, // Enable third-party analytics (Microsoft Clarity); may affect Lighthouse scores
		clarityId: "", // Clarity project ID
	},
};
export const fullscreenWallpaperConfig: FullscreenWallpaperConfig = {
	src: {
		desktop: [
			"/assets/desktop-banner/1.webp",
			"/assets/desktop-banner/2.webp",
			"/assets/desktop-banner/3.webp",
			"/assets/desktop-banner/4.webp",
		], // Desktop banner images
		mobile: [
			"/assets/mobile-banner/1.webp",
			"/assets/mobile-banner/2.webp",
			"/assets/mobile-banner/3.webp",
			"/assets/mobile-banner/4.webp",
		], // Mobile banner images
	}, // Local banner images
	position: "center", // Wallpaper position, same as object-position
	carousel: {
		enable: true, // Enable carousel
		interval: 5, // Carousel interval in seconds
	},
	zIndex: -1, // Z-index; keeps wallpaper in background layer
	opacity: 0.8, // Wallpaper opacity
	blur: 1, // Background blur amount
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		// Custom navbar links with multi-level menu support
		{
			name: "Links",
			url: "/links/",
			icon: "material-symbols:link",
			children: [
				{
					name: "GitHub",
					url: "https://github.com/haasele",
					external: true,
					icon: "fa7-brands:github",
				},
				{
					name: "instagram",
					url: "https://instagram.com/motiviert.linksradikal",
					external: true,
					icon: "fa7-brands:instagram",
				},
				{
					name: "LinkedIn",
					url: "https://linkedin.com/leonhaase",
					external: true,
					icon: "mdi:linkedin",
				},
			],
		},
		{
			name: "Me",
			url: "/content/",
			icon: "material-symbols:person",
			children: [
				{
					name: "Movies",
					url: "/movies/",
					icon: "material-symbols:movie",
				},
				{
					name: "Diary",
					url: "/diary/",
					icon: "material-symbols:book",
				},
				{
					name: "Gallery",
					url: "/albums/",
					icon: "material-symbols:photo-library",
				},
				{
					name: "Tech",
					url: "/devices/",
					icon: "material-symbols:devices",
					external: false,
				},
			],
		},
		{
			name: "About",
			url: "/content/",
			icon: "material-symbols:info",
			children: [
				{
					name: "About",
					url: "/about/",
					icon: "material-symbols:person",
				},
				{
					name: "Tech-Stack",
					url: "/stack/",
					icon: "material-symbols:group",
				},
			],
		},
		{
			name: "Others",
			url: "#",
			icon: "material-symbols:more-horiz",
			children: [
				{
					name: "Projects",
					url: "/projects/",
					icon: "material-symbols:work",
				},
				{
					name: "Skills",
					url: "/skills/",
					icon: "material-symbols:psychology",
				},
				{
					name: "Timeline",
					url: "/timeline/",
					icon: "material-symbols:timeline",
				},
			],
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.jpg", // Relative to /src; paths starting with '/' are relative to /public
	name: "Leon☭",
	bio: "🌱 Stolzer Veganer, denn da lachen die Kälber",
	typewriter: {
		enable: true, // Enable typewriter effect for bio
		speed: 80, // Typing speed (ms)
	},
	links: [
		{
			name: "instagram",
			icon: "fa7-brands:instagram",
			url: "https://instagram.com/motiviert.linksradikalisiert",
		},
		{
			name: "GitHub",
			icon: "mdi:git",
			url: "https://github.com/haasele",
		},
		{
			name: "X",
			icon: "fa7-brands:twitter",
			url: "https://x.com/haasele",
		},
		{
			name: "LinkedIn",
			icon: "fa7-brands:linkedin",
			url: "https://codeberg.org",
		},
		{
			name: "Discord",
			icon: "fa7-brands:discord",
			url: "https://discord.gg/",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

// Permalink config
export const permalinkConfig: PermalinkConfig = {
	enable: false, // Enable global permalink; when off, filenames are used as URLs
	/**
	 * Permalink format template
	 * Supported placeholders:
	 * - %year% : 4-digit year (2024)
	 * - %monthnum% : 2-digit month (01-12)
	 * - %day% : 2-digit day (01-31)
	 * - %hour% : 2-digit hour (00-23)
	 * - %minute% : 2-digit minute (00-59)
	 * - %second% : 2-digit second (00-59)
	 * - %post_id% : Post index by publish date (oldest = 1)
	 * - %postname% : Post filename (slug, usually lowercase)
	 * - %raw_postname% : Original filename (case preserved)
	 * - %category% : Category name ("uncategorized" if none)
	 *
	 * Examples:
	 * - "%year%-%monthnum%-%postname%" => "/2024-12-my-post/"
	 * - "%post_id%-%postname%" => "/42-my-post/"
	 * - "%category%-%postname%" => "/tech-my-post/"
	 * - "%year%/%monthnum%/%day%/%postname%" => "/2024/12/01/my-post/"
	 *
	 * Note: Use "/" for nested paths.
	 */
	format: "%postname%", // Default: filename
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// Note: Some styles (e.g. background color) are overridden in astro.config.mjs
	// Use a dark theme; this blog theme only supports dark backgrounds
	theme: "github-dark",
	// Hide code blocks during theme switch to avoid jank
	hideDuringThemeTransition: true,
};

export const commentConfig: CommentConfig = {
	enable: false, // Enable comments; when false, comment UI is hidden on posts
	system: "twikoo", // Comment system: "twikoo" | "giscus"
	twikoo: {
		envId: "https://twikoo.vercel.app",
		lang: SITE_LANG,
	},
	giscus: {
		repo: "your-github-username/your-repo-name",
		repoId: "your-repo-id",
		category: "Announcements",
		categoryId: "your-category-id",
		mapping: "pathname",
		strict: "0",
		reactionsEnabled: "1",
		emitMetadata: "0",
		inputPosition: "top",
		theme: "preferred_color_scheme",
		lang: SITE_LANG,
		loading: "lazy",
	},
};

export const shareConfig: ShareConfig = {
	enable: true, // Enable share button
};

export const announcementConfig: AnnouncementConfig = {
	title: "", // Announcement title; empty uses i18n Key.announcement
	content: "New Post every Sunday!", // Announcement body
	closable: true, // Allow users to dismiss announcement
	link: {
		enable: true, // Enable link
		text: "Learn More", // Link text
		url: "/about/", // Link URL
		external: false, // Internal link
	},
};

export const musicPlayerConfig: MusicPlayerConfig = {
	enable: true, // Enable music player
	showFloatingPlayer: true, // Show floating player UI
	floatingEntryMode: "fab", // Floating entry: "default" = standalone player, "fab" = integrated FAB group
	mode: "local", // Player mode: "local" or "meting"
	meting_api:
		"https://meting.mysqil.com/api?server=:server&type=:type&id=:id&auth=:auth&r=:r", // Meting API URL
	id: "14164869977", // Playlist ID
	server: "netease", // Music source; common values: netease, tencent, kugou, xiami, baidu (depends on API)
	type: "playlist", // Playlist type
};

export const footerConfig: FooterConfig = {
	enable: false, // Enable custom footer HTML injection
	customHtml: "", // Custom footer HTML, e.g. ICP filing info; leave empty by default
	// Or edit FooterConfig.html directly for filing numbers and other custom content
	// If customHtml is set, it takes precedence; otherwise FooterConfig.html is used
	// FooterConfig.html may be deprecated in a future version
};

/**
 * Sidebar layout config
 * Controls sidebar component visibility, order, animation, and responsive behavior
 * sidebar: left or right. Mobile typically hides right sidebar; if set to right, use layout.position "both"
 */
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	// Sidebar component property list
	properties: [
		{
			// Component type: profile
			type: "profile",
			// Position: "top" = fixed at top
			position: "top",
			// CSS class for styling and animation
			class: "onload-animation",
			// Animation delay (ms) for staggered entrance
			animationDelay: 0,
		},
		{
			// Component type: announcement
			type: "announcement",
			// Position: "top" = fixed at top
			position: "top",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 50,
		},
		{
			// Component type: sidebar music player
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		{
			// Component type: categories
			type: "categories",
			// Position: "sticky" = scrolls with content
			position: "sticky",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 150,
			// Responsive options
			responsive: {
				// Collapse when category count exceeds threshold
				collapseThreshold: 5,
			},
		},
		{
			// Component type: tags
			type: "tags",
			// Position: "sticky"
			position: "top",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 250,
			// Responsive options
			responsive: {
				// Collapse when tag count exceeds threshold
				collapseThreshold: 20,
			},
		},
		{
			// Component type: card TOC
			type: "card-toc",
			// Position
			position: "sticky",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 200,
		},
		{
			// Component type: site stats
			type: "site-stats",
			// Position
			position: "top",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 200,
		},
		{
			// Component type: calendar (hidden on mobile)
			type: "calendar",
			// Position
			position: "top",
			// CSS class
			class: "onload-animation",
			// Animation delay
			animationDelay: 250,
		},
	],

	// Sidebar component layout
	components: {
		left: ["profile", "announcement", "tags", "card-toc"],
		right: ["site-stats", "calendar", "categories", "music-sidebar"],
		drawer: [
			"profile",
			"announcement",
			"music-sidebar",
			"categories",
			"tags",
		],
	},

	// Default animation config
	defaultAnimation: {
		// Enable default animation
		enable: true,
		// Base delay (ms)
		baseDelay: 0,
		// Incremental delay (ms) per component
		increment: 50,
	},

	// Responsive layout config
	responsive: {
		// Breakpoints (px)
		breakpoints: {
			// Mobile: width < 768px
			mobile: 768,
			// Tablet: width < 1280px
			tablet: 1280,
			// Desktop: width >= 1280px
			desktop: 1280,
		},
	},
};

export const sakuraConfig: SakuraConfig = {
	enable: false, // Sakura effect disabled by default
	sakuraNum: 21, // Number of petals
	limitTimes: -1, // Boundary bounce limit; -1 = infinite
	size: {
		min: 0.5, // Minimum size multiplier
		max: 1.1, // Maximum size multiplier
	},
	opacity: {
		min: 0.3, // Minimum opacity
		max: 0.9, // Maximum opacity
	},
	speed: {
		horizontal: {
			min: -1.7, // Min horizontal speed
			max: -1.2, // Max horizontal speed
		},
		vertical: {
			min: 1.5, // Min vertical speed
			max: 2.2, // Max vertical speed
		},
		rotation: 0.03, // Rotation speed
		fadeSpeed: 0.03, // Fade speed; should not exceed min opacity
	},
	zIndex: 100, // Z-index for petal layer
};

// Related posts config
export const relatedPostsConfig: RelatedPostsConfig = {
	enable: true,
	maxCount: 5,
};

// Random posts config
export const randomPostsConfig: RandomPostsConfig = {
	enable: true,
	maxCount: 5,
};

// Unified widget config export
export const widgetConfigs = {
	profile: profileConfig,
	announcement: announcementConfig,
	music: musicPlayerConfig,
	layout: sidebarLayoutConfig,
	sakura: sakuraConfig,
	fullscreenWallpaper: fullscreenWallpaperConfig,
	share: shareConfig,
	relatedPosts: relatedPostsConfig,
	randomPosts: randomPostsConfig,
} as const;

// umamiConfig moved to astro.config.mjs; add analytics script manually in Layout.astro <head>
