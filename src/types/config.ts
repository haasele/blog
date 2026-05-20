import type {
	DARK_MODE,
	LIGHT_MODE,
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
} from "../constants/constants";

export interface SiteConfig {
	title: string;
	subtitle: string;
	siteURL: string; // Site URL with trailing slash, e.g. https://mizuki.mysqil.com/
	keywords?: string[]; // Site keywords for <meta name="keywords">
	siteStartDate?: string; // Site start date (YYYY-MM-DD) for uptime calculation

	lang:
		| "en"
		| "zh_CN"
		| "zh_TW"
		| "ja"
		| "ko"
		| "es"
		| "th"
		| "vi"
		| "tr"
		| "id";

	themeColor: {
		hue: number;
		fixed: boolean;
	};

	// Feature page toggles
	featurePages: {
		movie: boolean; // Movie page toggle
		diary: boolean; // Diary page toggle
		friends: boolean; // Friends page toggle
		projects: boolean; // Projects page toggle
		skills: boolean; // Skills page toggle
		timeline: boolean; // Timeline page toggle
		albums: boolean; // Albums page toggle
		devices: boolean; // Devices page toggle
	};

	// Post list layout configuration
	postListLayout: {
		defaultMode: "list" | "grid"; // Default layout: list or grid
		allowSwitch: boolean; // Allow user to switch layout
		categoryBar?: {
			enable: boolean; // Show category bar on post list page
		};
	};

	// Navbar title configuration
	navbarTitle?: {
		mode?: "text-icon" | "logo"; // Display mode: "text-icon" = icon + text, "logo" = logo only
		text: string; // Navbar title text
		icon?: string; // Navbar title icon path
		logo?: string; // Site logo image path
	};

	// Page auto-scaling configuration
	pageScaling?: {
		enable: boolean; // Enable auto-scaling
		targetWidth?: number; // Target width; scale when viewport is narrower
	};

	// Font configuration
	font: {
		asciiFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
		cjkFont: {
			fontFamily: string;
			fontWeight: string | number;
			localFonts: string[];
			enableCompress: boolean;
		};
	};

	// Bangumi configuration
	bangumi?: {
		userId?: string; // Bangumi user ID
		fetchOnDev?: boolean;
	};

	// Bilibili configuration
	bilibili?: {
		vmid?: string; // Bilibili user ID (vmid)
		fetchOnDev?: boolean; // Fetch Bilibili data in development
		coverMirror?: string; // Cover image mirror (optional, default empty string)
		useWebp?: boolean; // Use WebP format (default true)
	};

	// Movie page configuration
	movie?: {
		mode?: "bangumi" | "local" | "bilibili"; // Movie page data source mode
	};

	// Diary page Memos API URL; client fetches dynamic data
	diaryApiUrl?: string;

	// Tag style configuration
	tagStyle?: {
		useNewStyle?: boolean; // New style (hover highlight) vs old style (persistent outline)
	};

	// Wallpaper mode configuration
	wallpaperMode: {
		defaultMode: "banner" | "fullscreen" | "none"; // Default: banner, fullscreen, or none
		showModeSwitchOnMobile?: "off" | "mobile" | "desktop" | "both"; // Layout switch button: off, mobile only, desktop only, or both
	};

	banner: {
		src:
			| string
			| string[]
			| {
					desktop?: string | string[];
					mobile?: string | string[];
			  }; // Single image, image array, or separate desktop/mobile images
		position?: "top" | "center" | "bottom";
		carousel?: {
			enable: boolean; // Enable carousel
			interval: number; // Carousel interval in seconds
		};
		waves?: {
			enable: boolean; // Enable wave effect
			performanceMode?: boolean; // Performance mode: reduced animation complexity
			mobileDisable?: boolean; // Disable on mobile
		};
		imageApi?: {
			enable: boolean; // Enable image API
			url: string; // API URL returning one image link per line
		};
		homeText?: {
			enable: boolean; // Show custom text on home page
			title?: string; // Main title
			subtitle?: string | string[]; // Subtitle; string or array of strings
			typewriter?: {
				enable: boolean; // Enable typewriter effect
				speed: number; // Typing speed in milliseconds
				deleteSpeed: number; // Delete speed in milliseconds
				pauseTime: number; // Pause after full display in milliseconds
			};
		};
		credit: {
			enable: boolean;
			text: string;
			url?: string;
		};
		navbar?: {
			transparentMode?: "semi" | "full" | "semifull"; // Navbar transparency mode
		};
	};
	toc: {
		enable: boolean; // Master switch; disables all TOC when false
		mobileTop: boolean; // Mobile top TOC button
		desktopSidebar: boolean; // Desktop right sidebar TOC
		floating: boolean; // Floating TOC button
		depth: 1 | 2 | 3;
		useJapaneseBadge?: boolean; // Use Japanese kana badges (あいうえお...) instead of numbers
	};
	showCoverInContent: boolean; // Show post cover on article content page
	generateOgImages: boolean;
	favicon: Favicon[];
	showLastModified: boolean; // Show "last modified" card
	pageProgressBar?: PageProgressBarConfig; // Top page progress bar configuration
	thirdPartyAnalytics?: ThirdPartyAnalyticsConfig; // Third-party analytics configuration
}

export interface Favicon {
	src: string;
	theme?: "light" | "dark";
	sizes?: string;
}

export enum LinkPreset {
	Home = 0,
	Archive = 1,
	About = 2,
	Friends = 3,
	Movie = 4,
	Diary = 5,
	Albums = 6,
	Projects = 7,
	Skills = 8,
	Timeline = 9,
}

export interface NavBarLink {
	name: string;
	url: string;
	external?: boolean;
	icon?: string; // Menu item icon
	children?: (NavBarLink | LinkPreset)[]; // Submenu: NavBarLink or LinkPreset entries
}

export interface NavBarConfig {
	links: (NavBarLink | LinkPreset)[];
}

export interface ProfileConfig {
	avatar?: string;
	name: string;
	bio?: string;
	links: {
		name: string;
		url: string;
		icon: string;
	}[];
	typewriter?: {
		enable: boolean; // Enable typewriter effect
		speed?: number; // Typing speed in milliseconds
	};
}

export interface LicenseConfig {
	enable: boolean;
	name: string;
	url: string;
}

// Permalink configuration
export interface PermalinkConfig {
	enable: boolean; // Enable global permalink feature
	/**
	 * Permalink format template.
	 * Supported placeholders:
	 * - %year% : 4-digit year (2024)
	 * - %monthnum% : 2-digit month (01-12)
	 * - %day% : 2-digit day (01-31)
	 * - %hour% : 2-digit hour (00-23)
	 * - %minute% : 2-digit minute (00-59)
	 * - %second% : 2-digit second (00-59)
	 * - %post_id% : Post sequence number (ordered by publish date ascending)
	 * - %postname% : Post filename (slug)
	 * - %category% : Category name ("uncategorized" when none)
	 *
	 * Examples:
	 * - "%year%-%monthnum%-%postname%" => "2024-12-my-post"
	 * - "%post_id%-%postname%" => "42-my-post"
	 * - "%category%-%postname%" => "tech-my-post"
	 *
	 * Note: slashes "/" are not supported; all generated links are at the site root
	 */
	format: string;
}

// Comment configuration

export interface CommentConfig {
	enable: boolean; // Enable comments
	system?: "twikoo" | "giscus"; // Comment system
	twikoo?: TwikooConfig;
	giscus?: GiscusConfig;
}

export interface GiscusConfig {
	repo: string;
	repoId: string;
	category: string;
	categoryId: string;
	mapping: string;
	strict: string;
	reactionsEnabled: string;
	emitMetadata: string;
	inputPosition: string;
	theme: string;
	lang: string;
	loading: string;
}

interface TwikooConfig {
	envId: string;
	region?: string;
	lang?: string;
}

export type LIGHT_DARK_MODE = typeof LIGHT_MODE | typeof DARK_MODE;

export type WALLPAPER_MODE =
	| typeof WALLPAPER_BANNER
	| typeof WALLPAPER_FULLSCREEN
	| typeof WALLPAPER_NONE;

export interface BlogPostData {
	body: string;
	title: string;
	published: Date;
	description: string;
	tags: string[];
	draft?: boolean;
	image?: string;
	category?: string;
	pinned?: boolean;
	prevTitle?: string;
	prevSlug?: string;
	nextTitle?: string;
	nextSlug?: string;
}

export interface ExpressiveCodeConfig {
	theme: string;
	hideDuringThemeTransition?: boolean; // Hide code blocks during theme transition
}

export interface AnnouncementConfig {
	// enable removed; controlled via sidebarLayoutConfig
	title?: string; // Announcement title
	content: string; // Announcement content
	icon?: string; // Announcement icon
	type?: "info" | "warning" | "success" | "error"; // Announcement type
	closable?: boolean; // Whether the announcement can be closed
	link?: {
		enable: boolean; // Enable link
		text: string; // Link text
		url: string; // Link URL
		external?: boolean; // External link
	};
}

export interface MusicPlayerConfig {
	enable: boolean; // Enable music player
	showFloatingPlayer: boolean; // Show floating player UI
	floatingEntryMode?: "default" | "fab"; // Floating entry: standalone player or FAB group
	mode: "meting" | "local"; // Music player mode
	meting_api: string; // Meting API URL
	id: string; // Playlist ID
	server: string; // Music source server
	type: string; // Music type
}

export interface FooterConfig {
	enable: boolean; // Enable footer HTML injection
	customHtml?: string; // Custom HTML (e.g. ICP filing number)
}

// Widget component type definitions
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "card-toc" // Card-style TOC component
	| "music-player"
	| "music-sidebar"
	| "pio" // Live2D mascot component
	| "site-stats" // Site statistics component
	| "calendar" // Calendar component
	| "custom";

export interface WidgetComponentConfig {
	type: WidgetComponentType; // Component type
	position: "top" | "sticky"; // Position: top fixed area or sticky area
	class?: string; // Custom CSS class
	style?: string; // Custom inline style
	animationDelay?: number; // Animation delay in milliseconds
	responsive?: {
		hidden?: ("mobile" | "tablet" | "desktop")[]; // Hide on specified breakpoints
		collapseThreshold?: number; // Collapse threshold
	};
	customProps?: Record<string, any>; // Custom props for component extensions
}

export interface SidebarLayoutConfig {
	properties: WidgetComponentConfig[]; // Component configuration list
	components: {
		left: WidgetComponentType[];
		right: WidgetComponentType[];
		drawer: WidgetComponentType[];
	};
	defaultAnimation: {
		enable: boolean; // Enable default animation
		baseDelay: number; // Base delay in milliseconds
		increment: number; // Per-component delay increment in milliseconds
	};
	responsive: {
		breakpoints: {
			mobile: number; // Mobile breakpoint (px)
			tablet: number; // Tablet breakpoint (px)
			desktop: number; // Desktop breakpoint (px)
		};
	};
}

export interface SakuraConfig {
	enable: boolean; // Enable sakura effect
	sakuraNum: number; // Sakura count (default 21)
	limitTimes: number; // Boundary limit count; -1 = infinite loop
	size: {
		min: number; // Minimum size multiplier
		max: number; // Maximum size multiplier
	};
	opacity: {
		min: number; // Minimum opacity
		max: number; // Maximum opacity
	};
	speed: {
		horizontal: {
			min: number; // Minimum horizontal speed
			max: number; // Maximum horizontal speed
		};
		vertical: {
			min: number; // Minimum vertical speed
			max: number; // Maximum vertical speed
		};
		rotation: number; // Rotation speed
		fadeSpeed: number; // Fade-out speed
	};
	zIndex: number; // z-index for layering
}

export interface FullscreenWallpaperConfig {
	src:
		| string
		| string[]
		| {
				desktop?: string | string[];
				mobile?: string | string[];
		  }; // Single image, image array, or separate desktop/mobile images
	position?: "top" | "center" | "bottom"; // Wallpaper position (object-position)
	carousel?: {
		enable: boolean; // Enable carousel
		interval: number; // Carousel interval in seconds
	};
	zIndex?: number; // z-index for layering
	opacity?: number; // Wallpaper opacity (0-1)
	blur?: number; // Background blur in px
}

/**
 * Pio live mascot configuration
 */
export interface PioConfig {
	enable: boolean; // Enable live mascot
	models?: string[]; // Model file paths
	position?: "left" | "right"; // Mascot position
	width?: number; // Mascot width
	height?: number; // Mascot height
	mode?: "static" | "fixed" | "draggable"; // Display mode
	hiddenOnMobile?: boolean; // Hide on mobile devices
	dialog?: {
		welcome?: string | string[]; // Welcome messages
		touch?: string | string[]; // Touch hints
		home?: string; // Home page hint
		skin?: [string, string]; // Outfit change hints [before, after]
		close?: string; // Close hint
		link?: string; // About link
		custom?: {
			selector: string; // CSS selector
			type: "read" | "link"; // Interaction type
			text?: string; // Custom text
		}[];
	};
}

/**
 * Share component configuration
 */
export interface ShareConfig {
	enable: boolean; // Enable share feature
}

/**
 * Related posts component configuration
 */
export interface RelatedPostsConfig {
	enable: boolean; // Enable related posts
	maxCount: number; // Maximum related post count
}

/**
 * Random posts component configuration
 */
export interface RandomPostsConfig {
	enable: boolean; // Enable random posts
	maxCount: number; // Maximum random post count
}

/**
 * Top page progress bar configuration
 */
export interface PageProgressBarConfig {
	enable: boolean; // Enable top page progress bar
	height?: number; // Bar height (default 3px)
	duration?: number; // Animation duration (default 8000ms)
}

/**
 * Third-party analytics configuration (may affect Lighthouse scores)
 */
export interface ThirdPartyAnalyticsConfig {
	enable: boolean; // Enable third-party analytics (Microsoft Clarity); default off
	clarityId?: string; // Clarity project ID
}
