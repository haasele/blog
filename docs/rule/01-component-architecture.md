# Component Architecture Design Specification

## Overview

This document defines the component architecture design principles and best practices for the Mizuki project, aimed at improving code maintainability, reusability, and performance.

## Core Principles

### 1. Layered Architecture Principle

Follow **Atomic Design** to organize components into four layers:

```
atoms → molecules → organisms → pages
```

#### 1.1 Atoms

**Definition**: The most basic, indivisible building blocks of the UI.

**Characteristics**:
- Single responsibility, simple functionality
- No business logic
- Highly reusable
- Do not depend on other components

**Example**:
```typescript
// Button.astro
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
}

const { variant = 'primary', size = 'md', disabled = false, icon } = Astro.props
---

<button class={`btn btn-${variant} btn-${size} ${disabled ? 'disabled' : ''}`}>
  {icon && <Icon name={icon} />}
  <slot />
</button>

<style>
  .btn {
    /* Base button styles */
  }
  .btn-primary {
    /* Primary button styles */
  }
  .btn-secondary {
    /* Secondary button styles */
  }
</style>
```

**Atom component inventory**:
- `Button.astro` - Button
- `Card.astro` - Card container
- `Input.astro` - Input field
- `Badge.astro` - Badge
- `Chip.astro` - Chip tag
- `Icon.astro` - Icon
- `Avatar.astro` - Avatar

#### 1.2 Molecules

**Definition**: Small functional components composed of multiple atoms with a single responsibility.

**Characteristics**:
- Composed of 2–5 atom components
- Simple interaction logic
- Still highly reusable
- Encapsulate specific UI patterns

**Example**:
```astro
---
// SearchBar.astro
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'

interface Props {
  placeholder?: string
  onSearch?: (query: string) => void
}

const { placeholder = 'Search...', onSearch } = Astro.props
---

<div class="search-bar">
  <Input {placeholder} id="search-input" />
  <Button variant="primary" size="md" icon="material-symbols:search">
    Search
  </Button>
</div>

<script>
  const input = document.getElementById('search-input')
  const button = document.querySelector('.search-bar button')

  const handleSearch = () => {
    const query = input?.value || ''
    if (onSearch) {
      onSearch(query)
    }
  }

  button?.addEventListener('click', handleSearch)
  input?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSearch()
  })
</script>
```

**Molecule component inventory**:
- `SearchBar.astro` - Search bar
- `Pagination.astro` - Pagination
- `DropdownMenu.astro` - Dropdown menu
- `FormItem.astro` - Form item
- `ChipCloud.astro` - Tag cloud

#### 1.3 Organisms

**Definition**: Complex business components composed of multiple molecules and atoms.

**Characteristics**:
- Contain complex business logic
- May have multiple child components
- Dedicated to specific pages or features
- May need to be split into subdirectories

**Example**:
```
Navbar.astro
├── NavbarSearch.svelte (molecule)
├── NavbarMenu.svelte (molecule)
├── LayoutSwitchButton.svelte (molecule)
└── LightDarkSwitch.svelte (atom)
```

**Organism component inventory**:
- `Navbar.astro` - Navigation bar
- `Sidebar.astro` - Sidebar
- `MusicPlayer.svelte` - Music player
- `Footer.astro` - Footer
- `TOC.astro` - Table of contents

#### 1.4 Widgets

**Definition**: Small sidebar feature modules, between molecules and organisms in complexity.

**Characteristics**:
- Relatively independent feature modules
- Configurable display position
- Unified UI style
- Use shared container components

**Example**:
```astro
---
// widget/Profile.astro
import WidgetLayout from './common/WidgetLayout.astro'
import Avatar from '../atoms/Avatar.astro'
---

<WidgetLayout name="Profile">
  <Avatar src="/avatar.png" />
  <div class="profile-info">
    <h3>Mizuki</h3>
    <p>Frontend developer</p>
  </div>
</WidgetLayout>
```

**Widget component inventory**:
- `Profile.astro` - Profile
- `Calendar.astro` - Calendar
- `Categories.astro` - Categories
- `Tags.astro` - Tags
- `SiteStats.astro` - Site statistics
- `Announcement.astro` - Announcement

## Component Directory Structure

### Recommended Directory Organization

```
src/components/
├── atoms/                    # Atom components
│   ├── Button.astro
│   ├── Card.astro
│   ├── Input.astro
│   ├── Badge.astro
│   ├── Chip.astro
│   └── Icon.astro
│
├── molecules/                # Molecule components
│   ├── SearchBar.astro
│   ├── Pagination.astro
│   ├── DropdownMenu.astro
│   └── ChipCloud.astro
│
├── organisms/                # Organism components
│   ├── Navbar.astro
│   ├── Sidebar.astro
│   ├── MusicPlayer.svelte   # Complex components may include subdirectories
│   │   ├── MusicPlayer.svelte
│   │   ├── MiniPlayer.svelte
│   │   ├── ExpandedPlayer.svelte
│   │   ├── controls/
│   │   │   ├── PlayControls.svelte
│   │   │   ├── ProgressBar.svelte
│   │   │   └── VolumeControl.svelte
│   │   ├── hooks/
│   │   │   ├── useAudio.ts
│   │   │   └── usePlaylist.ts
│   │   └── types.ts
│   ├── Footer.astro
│   └── TOC.astro
│
├── widgets/                   # Sidebar widgets
│   ├── Profile.astro
│   ├── Calendar.astro
│   ├── Categories.astro
│   ├── Tags.astro
│   ├── SiteStats.astro
│   └── common/              # Shared widget components
│       ├── WidgetLayout.astro
│       └── WidgetHeader.astro
│
├── features/                  # Feature components
│   ├── comment/
│   ├── search/
│   └── protection/
│
├── layouts/                   # Page layouts
│   ├── MainLayout.astro
│   └── PostLayout.astro
│
└── utils/                     # Utilities and hooks
    ├── widgetManager.ts
    └── useCalendar.ts
```

### Subdirectory Organization for Complex Components

When a component needs to be split into multiple subcomponents, organize it as follows:

```
ComponentName/
├── ComponentName.astro/svelte  # Main component (composition layer)
├── SubComponent1.astro/svelte  # Subcomponent
├── SubComponent2.astro/svelte  # Subcomponent
├── hooks/                      # Related hooks
│   ├── useFeature1.ts
│   └── useFeature2.ts
├── types.ts                    # Type definitions
└── utils/                      # Utility functions
    └── helper.ts
```

## Naming Conventions

### File Naming

#### Astro components
- Use PascalCase
- Examples: `Button.astro`, `SearchBar.astro`, `Navbar.astro`

#### Svelte components
- Use PascalCase
- Examples: `MusicPlayer.svelte`, `LayoutSwitchButton.svelte`

#### Feature module components
- Use feature name + `Module` suffix
- Examples: `SearchModule.astro`, `QRCodeModule.astro`

#### Container components
- Use feature name + `Container` suffix
- Examples: `SidebarContainer.astro`, `WidgetContainer.astro`

#### Hooks
- Use `use` prefix
- Examples: `useCalendar.ts`, `useMusicPlayer.ts`, `useTOC.ts`

#### Utility functions
- Use camelCase
- Examples: `formatDate.ts`, `calculatePagination.ts`

### In-Component Naming

#### Props interface
```typescript
interface Props {
  title?: string
  description?: string
  items?: Array<Item>
  onAction?: (value: any) => void
}
```

#### Event handlers
```typescript
const handleClick = () => {}
const handleSubmit = () => {}
const handleScroll = () => {}
```

#### Reactive variables
```typescript
let isOpen = false
let count = 0
let items = []
```

## Component Responsibility Principles

### Single Responsibility Principle (SRP)

Each component should have one clear responsibility.

**✅ Correct example**:
```astro
---
// Button.astro - Only responsible for button rendering and basic interaction
interface Props {
  variant: 'primary' | 'secondary'
  children: any
}
const { variant } = Astro.props
---

<button class={`btn-${variant}`}>
  <slot />
</button>
```

**❌ Incorrect example**:
```astro
---
// ❌ Wrong: one component handles search, navigation, and theme switching
// SearchNavbarTheme.astro (500+ lines)
const handleSearch = () => {}
const toggleNavbar = () => {}
const toggleTheme = () => {}
---
<div>
  <input id="search" />
  <nav>...</nav>
  <button id="theme-toggle">...</button>
</div>

<style>
  /* Search, navigation, and theme styles mixed together */
</style>

<script>
  // Search, navigation, and theme logic mixed together
</script>
```

### Controlling Component Granularity

| Complexity | Lines | Responsibilities | State count | Suitable component types |
|--------|------|--------|--------|-------------|
| ⭐ Simple | < 100 | 1 | < 3 | Atoms, simple molecules |
| ⭐⭐ Medium | 100-200 | 1-2 | 3-5 | Molecules, simple organisms |
| ⭐⭐⭐ Moderate | 200-300 | 2-3 | 5-10 | Organisms |
| ⭐⭐⭐⭐ High | 300-500 | 3-4 | 10-15 | Complex organisms (split recommended) |
| ⭐⭐⭐⭐⭐ Very high | > 500 | > 4 | > 15 | **Must split** |

**Split warning signals**:
- ❌ Component exceeds 500 lines
- ❌ Has 4 or more independent feature modules
- ❌ Styles exceed 200 lines
- ❌ Script exceeds 150 lines
- ❌ Hard to understand and test

## Component Reuse Patterns

### 1. Composition Pattern

Use the Slot API for flexible composition:

```astro
---
// ContainerComponent.astro
---

<div class="container">
  <slot name="header" />
  <div class="content">
    <slot />
  </div>
  <slot name="footer" />
</div>

<style>
  .container { /* Container styles */ }
</style>
```

**Usage**:
```astro
---
import ContainerComponent from './ContainerComponent.astro'
---

<ContainerComponent>
  <div slot="header">Custom header</div>
  <div>Main content</div>
  <div slot="footer">Custom footer</div>
</ContainerComponent>
```

### 2. Container Component Pattern

Create shared container components to unify styles and behavior:

```astro
---
// widgets/common/WidgetLayout.astro
interface Props {
  name?: string
  isCollapsed?: boolean
  collapsedHeight?: string
}

const { name, isCollapsed, collapsedHeight } = Astro.props
---

<div class="widget-layout" data-collapsed={isCollapsed}>
  {name && <div class="widget-header">{name}</div>}
  <div class="widget-content">
    <slot />
  </div>
</div>

<style define:vars={{ collapsedHeight }}>
  .widget-layout[data-collapsed="true"] .widget-content {
    max-height: var(--collapsed-height);
    overflow: hidden;
  }
</style>
```

### 3. Utility Function Reuse

Extract shared logic into utility functions:

```typescript
// utils/calendarUtils.ts
export function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

// Use in components
import { getDaysInMonth, getFirstDayOfMonth } from '@/utils/calendarUtils'
```

### 4. Hook Reuse

Extract complex interaction logic into hooks:

```typescript
// hooks/useMusicPlayer.ts
import { writable, derived } from 'svelte/store'

export function useMusicPlayer() {
  const isPlaying = writable(false)
  const currentSong = writable(null)
  const volume = writable(0.8)

  const togglePlay = () => isPlaying.update(n => !n)
  const setVolume = (val: number) => volume.set(val)

  return {
    isPlaying,
    currentSong,
    volume,
    togglePlay,
    setVolume
  }
}

// Use in components
<script lang="ts">
  import { useMusicPlayer } from './hooks/useMusicPlayer'

  const player = useMusicPlayer()
  const { isPlaying, togglePlay } = player
</script>
```

## Inter-Component Communication

### Props (parent → child)

```astro
---
// Parent component
import ChildComponent from './ChildComponent.astro'
---

<ChildComponent
  title="Hello"
  count={42}
  onAction={() => console.log('Action triggered')}
/>
```

```astro
---
// Child component
interface Props {
  title: string
  count: number
  onAction?: () => void
}

const { title, count, onAction } = Astro.props
---

<div>
  <h1>{title}</h1>
  <p>Count: {count}</p>
  <button id="action-btn">Action</button>
</div>

<script>
  document.getElementById('action-btn')?.addEventListener('click', () => {
    if (onAction) onAction()
  })
</script>
```

### Event dispatch (child → parent)

```astro
---
// Child component
interface Props {
  onValueChange?: (value: string) => void
}

const { onValueChange } = Astro.props
---

<input id="input" />

<script>
  const input = document.getElementById('input')
  input?.addEventListener('input', (e) => {
    if (onValueChange) {
      onValueChange((e.target as HTMLInputElement).value)
    }
  })
</script>
```

### Global state management

For cross-component state, use global variables or a third-party library:

```typescript
// stores/themeStore.ts
import { writable } from 'svelte/store'

export const themeStore = writable({
  mode: 'light' as 'light' | 'dark',
  hue: 60
})
```

## Performance Optimization

### 1. Lazy loading

Use Astro hydration directives to load on demand:

```astro
<!-- Load immediately - required components -->
<Navbar client:load />

<!-- Load when visible - feature modules -->
<Calendar client:visible />

<!-- Load when idle - non-critical features -->
<MusicPlayer client:idle />

<!-- Never hydrate - static content -->
<Footer />
```

### 2. Dynamic imports

```javascript
// Defer loading heavy libraries
async function initQRCode() {
  const QRCode = await import('qrcode')
  QRCode.toCanvas(canvas, url, options)
}
```

### 3. Virtual scrolling

For long lists, use virtual scrolling:

```typescript
import { useVirtualList } from '@/hooks/useVirtualList'

const { list, containerProps, wrapperProps } = useVirtualList({
  items: largeList,
  itemHeight: 50
})
```

## TypeScript Usage Guidelines

### Props interface definition

```typescript
interface Props {
  // Required properties
  id: string

  // Optional properties
  title?: string
  count?: number

  // Union types
  variant?: 'primary' | 'secondary' | 'ghost'

  // Array types
  items?: Array<{
    id: string
    name: string
    slug: string
  }>

  // Event handlers
  onAction?: (value: any) => void

  // Custom class and style
  class?: string
  style?: string
}
```

### Default value handling

```typescript
const {
  title = 'Default title',
  count = 0,
  variant = 'primary',
  items = [],
  class: className = '',
  style = ''
} = Astro.props
```

## Styling Guidelines

### Use CSS variables

```css
:root {
  --primary-color: #3b82f6;
  --text-color: #1f2937;
  --bg-color: #ffffff;
}

.dark {
  --primary-color: #60a5fa;
  --text-color: #f3f4f6;
  --bg-color: #111827;
}
```

### Scoped styles

```astro
<style>
  .my-component {
    color: var(--text-color);
    background-color: var(--bg-color);
  }

  /* Avoid global selectors */
  /* :global(div) { ... } */
</style>
```

### Combining with Tailwind CSS

```astro
---
const className = Astro.props.class
---

<div class={`card-base ${className} p-4 rounded-lg shadow-md`}>
  <slot />
</div>

<style>
  .card-base {
    /* Component-specific styles */
  }
</style>
```

## Component Documentation

### Component header comments

```astro
---
/**
 * Button component
 *
 * @description Base button component supporting multiple variants and sizes
 *
 * @example
 * <Button variant="primary" size="md" icon="material-symbols:add">
 *   Click me
 * </Button>
 *
 * @props
 * - variant: 'primary' | 'secondary' | 'ghost' - Button variant, default 'primary'
 * - size: 'sm' | 'md' | 'lg' - Button size, default 'md'
 * - disabled: boolean - Whether disabled, default false
 * - icon: string - Icon name
 */

interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  icon?: string
}
---
```

## Code Review Checklist

Before submitting code, ensure:

- [ ] Components follow the layered architecture (atoms/molecules/organisms)
- [ ] File names follow naming conventions (PascalCase)
- [ ] Component line count is reasonable (< 500 lines)
- [ ] Props interfaces are defined with TypeScript
- [ ] Each component has a single, clear responsibility
- [ ] Complex logic is extracted into hooks or utility functions
- [ ] Styles use CSS variables
- [ ] Appropriate hydration directives are used
- [ ] Component documentation comments are added
- [ ] Code is formatted and passes lint checks

## Migration Guide

### Migrating existing components to the new architecture

1. **Identify component type**
   - Determine which layer the component belongs to (atoms/molecules/organisms)
   - Assess complexity and whether splitting is needed

2. **Move component files**
   - Move components to the appropriate directory
   - Update import paths

3. **Extract shared logic**
   - Move repeated logic into hooks or utility functions
   - Create shared container components

4. **Optimize and refactor**
   - Reduce component line count
   - Improve reusability
   - Add type definitions and documentation

### Example: Refactoring a widget component

**Before refactoring**:
```astro
// widget/Categories.astro (150 lines, includes styles and logic)
---
// Fetch category data
const categories = await getCategories()
---

<div class="categories-widget">
  <div class="widget-header">
    <Icon name="material-symbols:category" />
    <h3>Categories</h3>
  </div>
  <div class="widget-content">
    {categories.map(cat => (
      <a href={`/category/${cat.slug}`} class="category-link">
        {cat.name} ({cat.count})
      </a>
    ))}
  </div>
</div>

<style>
  .categories-widget { /* styles */ }
  .widget-header { /* styles */ }
  .widget-content { /* styles */ }
</style>
```

**After refactoring**:
```astro
// widget/Categories.astro (50 lines)
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="Categories">
  <ChipCloud
    items={categories}
    hrefPrefix="/category/"
  />
</WidgetLayout>
```

## Reference Resources

- [Aruma component architecture](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [Astro component best practices](https://docs.astro.build/en/core-concepts/astro-components/)
- [Atomic Design](https://atomicdesign.bradfrost.com/)
- [Component-driven development](https://componentdriven.org/)

---

**Last updated**: 2026-03-17
**Maintainer**: Mizuki development team
