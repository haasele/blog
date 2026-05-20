# Icon Usage Specification

## 1. Icon System Overview

This project uses the [Iconify](https://iconify.design/) ecosystem. There are **3 standard ways** to use icons depending on file type and runtime:

| # | Usage | Attribute | Import from | File type | Runtime |
|---|---------|--------|---------|-------------|---------|
| ① | `<Icon name="...">` | `name` | `astro-icon/components` | `.astro` static components/pages | Build time (SSR) |
| ② | `<Icon icon="...">` | `icon` | `@iconify/svelte` | `.svelte` client components | Client (CSR) |
| ③ | `<Icon icon="...">` | `icon` | Custom `@components/misc/Icon.astro` | `.astro` (needs loading state) | Build + client |

> **Do not use raw `<iconify-icon>` tags in application code.**

---

## 2. Detailed Usage

### 2.1 astro-icon (Preferred for `.astro`)

```astro
---
import { Icon } from "astro-icon/components";
---

<Icon name="material-symbols:arrow-back" class="text-base" />
<Icon name={dynamicIconName} class="text-xl" />
```

- **Attribute**: `name`
- **Library**: [`astro-icon`](package.json) v^1.1.5
- **Notes**: Astro integration, build-time optimization
- **Use for**: Icons in `.astro` pages and components

### 2.2 @iconify/svelte (Only choice for `.svelte`)

```svelte
<script lang="ts">
	import Icon from "@iconify/svelte";
</script>

<Icon icon="material-symbols:pause" class="text-xl" />
<Icon icon={dynamicIcon} class="text-lg" />
```

- **Attribute**: `icon`
- **Library**: [`@iconify/svelte`](package.json) v^5.2.1
- **Notes**: Official Iconify Svelte component, client-side rendering
- **Use for**: All `.svelte` components

### 2.3 Custom Icon Component (Enhanced Wrapper)

```astro
---
import Icon from "../../misc/Icon.astro";
---

<Icon icon="mdi:react" size="lg" color="#61DAFB" fallback="⚛" />
```

- **Attributes**: `icon`, `size`, `color`, `fallback`, `loading`
- **Implementation**: [`src/components/atoms/Icon/Icon.astro`](../../src/components/atoms/Icon/Icon.astro)
- **Wrapper**: [`src/components/misc/Icon.astro`](../../src/components/misc/Icon.astro)
- **Notes**: Loading state, fallback, size system, color control
- **Use for**: Loading states or fallback placeholders

---

## 3. Why `name` vs `icon`

This reflects two libraries' APIs — **not two attributes on one component**:

| Dimension | `astro-icon` (`name`) | `@iconify/svelte` / `iconify-icon` (`icon`) |
|------|---------------------|-------------------------------------------|
| **API standard** | Astro community integration | Iconify official API |
| **Design** | Similar to Astro Image naming | Iconify ecosystem convention |
| **Runtime** | Build time (SSR) | Browser (CSR) |
| **Performance** | Can inline SVG, fewer requests | CDN on-demand icon data |
| **Cross-framework** | Astro only | React/Vue/Svelte/Web Component |

---

## 4. Size Reference

Replace native `width`/`height` with CSS classes:

| Native | CSS classes | Tailwind equivalent |
|---------|------------|-------------|
| `width="10" height="10"` | `w-2.5 h-2.5 text-[0.625rem]` | Smallest (nodes, etc.) |
| `width="14" height="14"` | `w-3.5 h-3.5 text-xs` | Meta icons (date, location) |
| `width="16" height="16"` | `w-4 h-4 text-base` | Inline small (tags, buttons) |
| `width="20" height="20"` | `text-lg` | Card header icons |
| `width="48" height="48"` | `text-5xl` | Large placeholder |
| `width="64" height="64"` | `text-6xl` | Empty state placeholder |

> **Prefer Tailwind `text-*` or `w-* h-*` over native `width`/`height`.**

---

## 5. Decision Flow

```
Adding an icon in new code?
        │
        ├── .svelte file?
        │     └── Yes → import Icon from "@iconify/svelte"
        │            → <Icon icon="..." />
        │
        └── .astro file?
              ├── Need loading/fallback?
              │     └── Yes → import Icon from "@components/misc/Icon.astro"
              │            → <Icon icon="..." size="..." fallback="..." />
              │
              └── No → import { Icon } from "astro-icon/components"
                     → <Icon name="..." />
```

---

## 6. Common Mistakes and Fixes

### Mistake 1: Mixed attribute names (fixed)

```svelte
<!-- ❌ @iconify/svelte does not use name -->
import Icon from "@iconify/svelte";
<Icon name="material-symbols:xxx" />

<!-- ✅ Correct -->
import Icon from "@iconify/svelte";
<Icon icon="material-symbols:xxx" />
```

### Mistake 2: Raw iconify-icon tag (unified fix)

```astro
<!-- ❌ Deprecated: raw Web Component -->
<iconify-icon icon="material-symbols:xxx" width="16" height="16" />

<!-- ✅ Correct: astro-icon wrapper -->
import { Icon } from "astro-icon/components";
<Icon name="material-symbols:xxx" class="text-base w-4 h-4" />
```

### Mistake 3: Mixing approaches in one file

```astro
<!-- ❌ Avoid mixing -->
<Icon name="material-symbols:a" />       <!-- astro-icon -->
<iconify-icon icon="material-symbols:b" /> <!-- raw -->

<!-- ✅ Consistent -->
<Icon name="material-symbols:a" />
<Icon name="material-symbols:b" />
```

---

## 7. Icon Sets Used in Project

| Prefix | Description | Frequency |
|-----------|------|---------|
| `material-symbols:` | Google Material Symbols (primary) | ★★★★★ Highest |
| `fa7-solid:` / `fa7-regular:` | Font Awesome 7 | ★★☆☆☆ Low |
| `mdi:` | Material Design Icons | ★★☆☆☆ Low |
| `eos-icons:` | EOS Icons (loading, etc.) | ★☆☆☆☆ Rare |

> When adding icons, **prefer `material-symbols:`** for visual consistency.

---

## 8. Related Files

| File | Role |
|-----|------|
| [`src/components/atoms/Icon/Icon.astro`](../../src/components/atoms/Icon/Icon.astro) | Custom Icon core |
| [`src/components/atoms/Icon/types.ts`](../../src/components/atoms/Icon/types.ts) | Custom Icon Props types |
| [`src/components/misc/Icon.astro`](../../src/components/misc/Icon.astro) | Backward-compatible wrapper |
| [`src/components/misc/IconifyLoader.astro`](../../src/components/misc/IconifyLoader.astro) | Global Iconify loader |
| [`src/utils/icon-loader.ts`](../../src/utils/icon-loader.ts) | Iconify loader utility |
| [`package.json`](../../package.json) | Dependencies (astro-icon, @iconify/svelte) |
