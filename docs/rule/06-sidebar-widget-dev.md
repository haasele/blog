# Sidebar Widget Development Guide

> This guide standardizes sidebar widget integration to avoid "configured but not displayed on the page" gaps.

## Scope

- Adding or refactoring sidebar widgets (e.g. `music-sidebar`, custom stats widgets)
- Adjusting component layout in `sidebarLayoutConfig`
- Reusing the same widget in left sidebar, right sidebar, and drawer

---

## Integration: 3 Required Steps

### Step 1: Declare Component Type

File: `src/types/config.ts`

Add to `WidgetComponentType`:

```ts
export type WidgetComponentType =
	| "profile"
	| "announcement"
	| "categories"
	| "tags"
	| "toc"
	| "music-player"
	| "music-sidebar" // ✅ New type
	| "pio"
	| "site-stats"
	| "calendar"
	| "custom";
```

> **Rule**: Every sidebar widget must be declared in `WidgetComponentType` first. Without this, TypeScript fails and configuration has no effect.

---

### Step 2: Configure Layout in `sidebarLayoutConfig`

File: `src/config.ts`

Use `SidebarLayoutConfig.components` for placement and order:

```ts
export const sidebarLayoutConfig: SidebarLayoutConfig = {
	properties: [
		{
			type: "music-sidebar",
			position: "sticky",
			class: "onload-animation",
			animationDelay: 100,
		},
		// ... other components
	],
	components: {
		left: ["profile", "announcement", "categories", "tags"],
		right: ["site-stats", "calendar", "music-sidebar"], // Show on right sidebar
		drawer: [
			"profile",
			"announcement",
			"music-sidebar",
			"categories",
			"tags",
		],
	},
	// ...
};
```

> **Rule**:
> - `properties` defines existence, position (top / sticky), animation, etc.
> - `components.left / right / drawer` defines which widgets appear where and in what order

---

### Step 3: Register in All Sidebar Renderers (Easy to Forget)

Sidebar rendering uses a **manual `componentMap`**. Unregistered types are silently ignored.

Check these **3 locations**:

#### 3.1 Left Sidebar: `src/components/widgets/sidebar/SideBar.astro`

```ts
import { MusicSidebarWidget } from "../music-sidebar";

const componentMap: Record<string, unknown> = {
	profile: Profile,
	announcement: Announcement,
	categories: Categories,
	tags: Tags,
	toc: SidebarTOC,
	"music-player": MusicPlayer,
	"music-sidebar": MusicSidebarWidget, // ✅ Must register
	"site-stats": SiteStats,
	calendar: Calendar,
};
```

#### 3.2 Right Sidebar: `src/components/layout/RightSideBar.astro`

```ts
import { MusicSidebarWidget } from "@/components/widgets/music-sidebar";

const componentMap: Record<string, unknown> = {
	profile: Profile,
	announcement: Announcement,
	categories: Categories,
	tags: Tags,
	toc: SidebarTOC,
	"music-player": MusicPlayer,
	"music-sidebar": MusicSidebarWidget, // ✅ Must register (independent of left sidebar)
	"site-stats": SiteStats,
	calendar: Calendar,
};
```

#### 3.3 Drawer Sidebar: `src/components/widgets/sidebar/SideBar.astro`

Drawer shares `SideBar.astro` with the left sidebar; ensure Step 3.1 registration covers the drawer.

> **Common mistake**: Registering only in `SideBar.astro` but not `RightSideBar.astro`, so widgets in `sidebarLayoutConfig.components.right` never appear.

---

## Troubleshooting

### Q1: Widget configured but not visible

Check in order:

1. Is the type in `WidgetComponentType` in `src/types/config.ts`?
2. Is it listed in `sidebarLayoutConfig.components` for the correct sidebar?
3. Is it registered in that sidebar's `componentMap`?
4. Is that sidebar hidden by responsive layout at current viewport?
5. Does the widget have an `enable` flag that prevents rendering?

### Q2: Music player configuration

Options in `musicPlayerConfig`:

| Option | Type | Description |
|--------|------|------|
| `enable` | boolean | Initializes music core. If `false`, floating UI and sidebar both disabled |
| `showFloatingPlayer` | boolean | Shows floating player UI. If `false`, sidebar only |
| `mode` | "meting" \| "local" | Playlist data source |
| `meting_api` | string | Meting API URL |
| `id` | string | Playlist ID |
| `server` | string | Music source server |
| `type` | string | Playlist type |

**Scenarios**:
- `enable=true, showFloatingPlayer=true` — Full: floating UI and sidebar
- `enable=true, showFloatingPlayer=false` — Sidebar only, no floating UI
- `enable=false` — Core not initialized; floating UI and sidebar both off

**Note**: `music-sidebar` depends on `musicPlayerStore`; when `enable=false`, the sidebar widget cannot work.

### Q3: Visible on left sidebar but not right

Check `RightSideBar.astro`'s `componentMap`. Left sidebar registration does not apply to the right sidebar.

### Q4: SSR error `window is not defined`

**Cause**: Svelte component accesses `window` during SSR.

**Fix**: Use `client:only` in Astro:

```astro
<!-- ❌ Wrong: still SSR'd -->
<MyComponent client:idle />

<!-- ✅ Correct: browser only -->
<MyComponent client:only="svelte" />
```

### Q5: Independent state per sidebar instance

If the same widget in multiple sidebars needs separate state (e.g. playlist expand/collapse), keep state **inside the component**, not in shared global state.

---

## Code Review Checklist

- [ ] New type declared in `WidgetComponentType` (`src/types/config.ts`)
- [ ] Widget listed in `sidebarLayoutConfig.components` (`src/config.ts`)
- [ ] Registered in `SideBar.astro` (left + drawer) `componentMap`
- [ ] Registered in `RightSideBar.astro` `componentMap`
- [ ] Svelte components use correct `client:*` directive (avoid SSR `window` errors)
- [ ] Widget feature flags (`enable`, `showFloatingPlayer`, etc.) configured correctly

---

## Configuration Quick Reference

| File | Purpose | Required action |
|------|------|----------|
| `src/types/config.ts` | Type declaration | Add to `WidgetComponentType` |
| `src/config.ts` | Layout | Add to `sidebarLayoutConfig.components` |
| `src/components/widgets/sidebar/SideBar.astro` | Left sidebar render | Register in `componentMap` |
| `src/components/layout/RightSideBar.astro` | Right sidebar render | Register in `componentMap` (independent) |
