# File Organization Architecture Guidelines

## Overview

This document defines the file organization architecture for the Mizuki project, ensuring a clear, modular, and maintainable code structure.

## Core Principles

### 1. Layer by Function

Directories should be organized by function and responsibility, not by technology type.

**❌ Incorrect Example**:
```
src/
├── astro/              # Grouped by .astro files
├── svelte/            # Grouped by .svelte files
└── typescript/         # Grouped by .ts files
```

**✅ Correct Example**:
```
src/
├── components/         # Grouped by UI function
├── utils/              # Grouped by utility function
├── types/              # Grouped by type definitions
└── layouts/            # Grouped by layout function
```

### 2. Separation of Concerns

Each directory should have a clearly defined scope, avoiding overlapping responsibilities.

**❌ Incorrect Example**:
```
src/
├── components/
│   ├── widgets/      # Widget components
│   └── misc/        # Miscellaneous components (unclear responsibility)
└── helpers/            # Utility functions
    └── widget/      # Widget utilities (duplicate responsibility)
```

**✅ Correct Example**:
```
src/
├── components/
│   ├── atoms/        # Atomic UI components
│   ├── molecules/     # Molecular UI components
│   ├── organisms/     # Organism UI components
│   ├── widgets/       # Sidebar widgets
│   └── features/      # Feature components
└── utils/              # Utility functions (unified definition)
```

### 3. Flat Structure

Avoid excessive nesting depth; keep the structure flat.

**❌ Incorrect Example**:
```
src/components/widgets/sidebar/primary/left/
```

**✅ Correct Example**:
```
src/components/widgets/
```

### 4. Consistency

Use unified naming and organization patterns.

**Example**:
- All component directories include `atoms/`, `molecules/`, `organisms/`
- All complex components include `hooks/`, `types.ts`
- All utility functions are categorized by function

## Directory Structure Guidelines

### Complete Directory Tree

```
Mizuki/
├── src/                           # Source code directory
│   ├── components/              # Components directory
│   │   ├── atoms/            # Atomic components (basic UI elements)
│   │   │   ├── Button.astro
│   │   │   ├── Card.astro
│   │   │   ├── Input.astro
│   │   │   ├── Badge.astro
│   │   │   ├── Chip.astro
│   │   │   ├── Avatar.astro
│   │   │   ├── Icon.astro
│   │   │   ├── Modal.astro
│   │   │   └── Tabs.astro
│   │   │
│   │   ├── molecules/         # Molecular components (composed of atoms)
│   │   │   ├── SearchBar.astro
│   │   │   ├── Pagination.astro
│   │   │   ├── DropdownMenu.astro
│   │   │   ├── FormItem.astro
│   │   │   └── ChipCloud.astro
│   │   │
│   │   ├── organisms/         # Organism components (complex business components)
│   │   │   ├── Navbar.astro
│   │   │   ├── Sidebar.astro
│   │   │   ├── Footer.astro
│   │   │   ├── MusicPlayer/       # Subdirectory for complex components
│   │   │   │   ├── MusicPlayer.astro
│   │   │   │   ├── MiniPlayer.svelte
│   │   │   │   ├── ExpandedPlayer.svelte
│   │   │   │   ├── controls/
│   │   │   │   ├── hooks/
│   │   │   │   └── types.ts
│   │   │   ├── Calendar/          # Subdirectory for complex components
│   │   │   │   ├── Calendar.astro
│   │   │   │   ├── CalendarGrid.svelte
│   │   │   │   ├── CalendarHeader.svelte
│   │   │   │   ├── hooks/
│   │   │   │   └── utils/
│   │   │   └── TOC/
│   │   │
│   │   ├── widgets/           # Sidebar widgets
│   │   │   ├── Profile.astro
│   │   │   ├── Calendar.astro
│   │   │   ├── Categories.astro
│   │   │   ├── Tags.astro
│   │   │   ├── SiteStats.astro
│   │   │   ├── Announcement.astro
│   │   │   └── common/          # Shared widget components
│   │   │       ├── WidgetLayout.astro
│   │   │       └── WidgetHeader.astro
│   │   │
│   │   ├── features/          # Feature components
│   │   │   ├── comment/          # Comment feature
│   │   │   ├── search/           # Search feature
│   │   │   ├── protection/       # Password protection
│   │   │   └── media/            # Media-related
│   │   │
│   │   ├── layouts/          # Layout components
│   │   │   ├── MainLayout.astro
│   │   │   ├── PostLayout.astro
│   │   │   └── PageLayout.astro
│   │   │
│   │   └── misc/             # Miscellaneous components (to be reorganized)
│   │
│   ├── layouts/               # Page layouts
│   │   ├── Layout.astro
│   │   └── BlogPost.astro
│   │
│   ├── pages/                # Page routes
│   │   ├── index.astro
│   │   ├── posts/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── albums/
│   │   ├── friends/
│   │   ├── projects/
│   │   ├── skills/
│   │   └── api/
│   │
│   ├── utils/                # Utility functions
│   │   ├── content-utils.ts
│   │   ├── date-utils.ts
│   │   ├── url-utils.ts
│   │   ├── string-utils.ts
│   │   └── widgetManager.ts
│   │
│   ├── types/                # Type definitions
│   │   ├── config.ts
│   │   └── api.ts
│   │
│   ├── constants/            # Constants
│   │   ├── index.ts
│   │   ├── theme.ts
│   │   └── routes.ts
│   │
│   ├── assets/               # Static assets
│   │   ├── images/
│   │   │   ├── home/
│   │   │   └── icons/
│   │   ├── fonts/
│   │   └── styles/
│   │
│   ├── styles/               # Global styles
│   │   ├── global.css
│   │   ├── theme.css
│   │   └── components.css
│   │
│   ├── i18n/                # Internationalization
│   │   ├── i18nKey.ts
│   │   ├── translation.ts
│   │   └── languages/
│   │       ├── zh-CN.ts
│   │       ├── en.ts
│   │       └── ja.ts
│   │
│   ├── data/                # Data files
│   │   ├── friends.ts
│   │   └── projects.ts
│   │
│   ├── scripts/              # Script files
│   │   ├── build.ts
│   │   └── deploy.ts
│   │
│   ├── plugins/              # Astro plugins
│   │   └── expressive-code/
│   │
│   ├── config.ts             # Main configuration file
│   ├── content.config.ts    # Content collection configuration
│   ├── env.d.ts             # Environment type definitions
│   └── global.d.ts          # Global type definitions
│
├── public/                       # Public static files
│   ├── assets/              # Static assets
│   │   ├── images/
│   │   ├── fonts/
│   │   └── icons/
│   ├── favicon.ico
│   └── robots.txt
│
├── docs/                         # Project documentation
│   ├── README.md
│   ├── rule/               # Development guidelines
│   │   ├── README.md
│   │   ├── 01-component-architecture.md
│   │   ├── 02-component-split-guide.md
│   │   ├── 03-file-organization-architecture.md
│   │   └── IMPLEMENTATION_SUMMARY.md
│   └── image/              # Documentation images
│
├── demo/                         # Reference examples
│   └── Aruma/             # Aruma theme reference
│
├── scripts/                      # Build and deployment scripts
│   ├── build.sh
│   └── deploy.sh
│
├── .vscode/                      # VS Code configuration
│   └── settings.json
│
├── .github/                      # GitHub configuration
│   └── workflows/
│       └── ci.yml
│
├── astro.config.mjs             # Astro configuration
├── tailwind.config.cjs           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── svelte.config.js             # Svelte configuration
├── package.json                 # Dependency management
├── pnpm-lock.yaml              # Dependency lock file
├── pnpm-workspace.yaml        # PNPM workspace
├── .env.example                 # Environment variable example
├── .gitignore                   # Git ignore file
├── .prettierrc                 # Prettier configuration
├── .prettierignore              # Prettier ignore file
├── README.md                    # Project description
├── LICENSE                      # License
└── _frontmatter.json            # Frontmatter defaults
```

## Directory Responsibilities

### src/components/ - Components Directory

#### atoms/ - Atomic Components

**Responsibility**: Provide basic, indivisible UI elements.

**Characteristics**:
- Single responsibility
- No business logic
- Highly reusable
- Simple state (< 3 variables)

**Included Files**:
- `Button.astro` - Button
- `Card.astro` - Card container
- `Input.astro` - Input field
- `Badge.astro` - Badge
- `Chip.astro` - Chip tag
- `Avatar.astro` - Avatar
- `Icon.astro` - Icon
- `Modal.astro` - Modal dialog
- `Tabs.astro` - Tabs

**Usage Example**:
```astro
---
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'
---

<form>
  <Input name="username" placeholder="Username" />
  <Button variant="primary">Submit</Button>
</form>
```

#### molecules/ - Molecular Components

**Responsibility**: Small functional components composed of multiple atomic components.

**Characteristics**:
- Contains 2–5 atomic components
- Has simple interaction logic
- Remains highly reusable

**Included Files**:
- `SearchBar.astro` - Search bar (Input + Button)
- `Pagination.astro` - Pagination (multiple Buttons)
- `DropdownMenu.astro` - Dropdown menu (Button + Card)
- `FormItem.astro` - Form item (Label + Input + Error)
- `ChipCloud.astro` - Tag cloud (multiple Chips)

**Usage Example**:
```astro
---
import SearchBar from '../molecules/SearchBar.astro'
---

<SearchBar
  placeholder="Search posts..."
  onSearch={(query) => navigate(`/search?q=${query}`)}
/>
```

#### organisms/ - Organism Components

**Responsibility**: Complex business components composed of multiple molecular and atomic components.

**Characteristics**:
- Contains complex business logic
- May have multiple subcomponents
- Designed for specific pages or features
- May need to be split into subdirectories

**Included Files**:
- `Navbar.astro` - Navigation bar
- `Sidebar.astro` - Sidebar
- `Footer.astro` - Footer
- `MusicPlayer/` - Music player (complex component)
- `Calendar/` - Calendar (complex component)
- `TOC/` - Table of contents

**Subdirectory Structure for Complex Components**:
```
MusicPlayer/
├── MusicPlayer.astro        # Main container (composition layer)
├── MiniPlayer.svelte        # Mini player UI
├── ExpandedPlayer.svelte    # Expanded player UI
├── PlaylistPanel.svelte      # Playlist UI
├── controls/               # Control components
│   ├── PlayControls.svelte
│   ├── ProgressBar.svelte
│   └── VolumeControl.svelte
├── hooks/                 # Related hooks
│   ├── useAudio.ts
│   ├── usePlaylist.ts
│   └── useVolume.ts
├── types.ts               # Type definitions
└── utils/                 # Utility functions
```

#### widgets/ - Sidebar Widgets

**Responsibility**: Small functional modules for the sidebar.

**Characteristics**:
- Relatively independent functional modules
- Configurable display position
- Unified UI style
- Uses shared container components

**Included Files**:
- `Profile.astro` - Profile
- `Calendar.astro` - Calendar
- `Categories.astro` - Categories
- `Tags.astro` - Tags
- `SiteStats.astro` - Site statistics
- `Announcement.astro` - Announcement
- `common/` - Shared widget components
  - `WidgetLayout.astro` - Shared widget container
  - `WidgetHeader.astro` - Shared widget header

**Usage Example**:
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="Categories" icon="material-symbols:category">
  <ChipCloud items={categories} hrefPrefix="/category/" />
</WidgetLayout>
```

#### features/ - Feature Components

**Responsibility**: Component collections for specific features.

**Subdirectories**:
- `comment/` - Comment-related
  - `Twikoo.astro`
  - `index.astro`
- `search/` - Search-related
  - `Search.svelte`
  - `SearchModal.astro`
- `protection/` - Password protection
  - `PasswordProtection.astro`
  - `EncryptionService.ts`
- `media/` - Media-related
  - `MusicPlayer.svelte`
  - `ImageGallery.astro`

#### layouts/ - Layout Components

**Responsibility**: Page-level layout components.

**Included Files**:
- `MainLayout.astro` - Main layout
- `PostLayout.astro` - Post layout
- `PageLayout.astro` - Page layout

#### misc/ - Miscellaneous Components

**Responsibility**: Temporary components that do not fit the categories above.

**Note**: This directory holds components pending reorganization and should be gradually migrated to appropriate categories.

**Included Files**:
- `AnimationTest.astro`
- `FullscreenWallpaper.astro`
- `ImageWrapper.astro`
- `Markdown.astro`
- `SharePoster.svelte`

**Migration Targets**:
- `AnimationTest.astro` → Delete or move to `organisms/`
- `FullscreenWallpaper.astro` → `features/media/`
- `ImageWrapper.astro` → `atoms/`
- `Markdown.astro` → `organisms/` or `features/media/`
- `SharePoster.svelte` → `features/media/`

### src/layouts/ - Page Layouts

**Responsibility**: Define the overall structure of pages.

**Included Files**:
- `Layout.astro` - Main layout (shared by all pages)
- `BlogPost.astro` - Post page layout

**Usage Example**:
```astro
---
import MainLayout from '../layouts/Layout.astro'
---

<MainLayout title="Post Title">
  <article>
    <!-- Post content -->
  </article>
</MainLayout>
```

### src/pages/ - Page Routes

**Responsibility**: Define the routing structure for pages.

**Organization**:
- Group by feature (posts, albums, friends, etc.)
- Use dynamic routes such as `[slug]`
- Use the `api/` subdirectory for API routes

**Directory Structure**:
```
pages/
├── index.astro              # Home page
├── posts/                  # Post pages
│   ├── index.astro         # Post list
│   └── [slug].astro       # Post detail (dynamic route)
├── albums/                 # Album pages
│   ├── index.astro         # Album list
│   └── [id].astro          # Album detail
├── friends/                # Friends page
│   └── index.astro
├── projects/               # Projects page
│   └── index.astro
├── skills/                 # Skills page
│   └── index.astro
├── api/                    # API routes
│   ├── search.ts
│   └── sitemap.xml.ts
└── [...slug].astro          # 404 page
```

### src/utils/ - Utility Functions

**Responsibility**: Provide reusable utility functions.

**Included Files**:
- `content-utils.ts` - Content-related utilities
- `date-utils.ts` - Date-related utilities
- `url-utils.ts` - URL-related utilities
- `string-utils.ts` - String-related utilities
- `widgetManager.ts` - Widget manager

**Naming Conventions**:
- Categorize by function (content, date, url, etc.)
- Use the `*-utils.ts` suffix
- Use namespaces on export to avoid conflicts

**Example**:
```typescript
// content-utils.ts
export async function getCategories() { }
export async function getTags() { }
export async function getPosts() { }

// Usage
import { getCategories, getTags, getPosts } from '@/utils/content-utils'
```

### src/types/ - Type Definitions

**Responsibility**: Centralize TypeScript type definitions.

**Included Files**:
- `config.ts` - Configuration types
- `api.ts` - API types
- `components.ts` - Component props types (optional)

**Example**:
```typescript
// types/config.ts
export interface SiteConfig {
  title: string
  subtitle: string
  siteURL: string
  themeColor: ThemeColorConfig
  // ...
}

export interface ThemeColorConfig {
  hue: number
  fixed: boolean
}
```

### src/constants/ - Constants

**Responsibility**: Centralize constant definitions.

**Included Files**:
- `index.ts` - Main constant exports
- `theme.ts` - Theme-related constants
- `routes.ts` - Route constants

**Example**:
```typescript
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  POSTS: '/posts',
  ALBUMS: '/albums',
  FRIENDS: '/friends',
} as const

// Usage
import { ROUTES } from '@/constants/routes'
navigate(ROUTES.POSTS)
```

### src/assets/ - Static Assets

**Responsibility**: Store static assets used in source code.

**Subdirectories**:
- `images/` - Images
  - `home/` - Home page images
  - `icons/` - Icons
- `fonts/` - Font files
- `styles/` - Style files (e.g., global CSS)

**Note**: Assets are copied to the `public/` directory during build.

### src/styles/ - Global Styles

**Responsibility**: Define global styles and themes.

**Included Files**:
- `global.css` - Global styles
- `theme.css` - Theme styles
- `components.css` - Component styles (optional)

**Usage Example**:
```astro
---
import '../styles/global.css'
import '../styles/theme.css'
---

<html>
  <head>
    <link rel="stylesheet" href="/styles/theme.css" />
  </head>
</html>
```

### src/i18n/ - Internationalization

**Responsibility**: Manage multi-language support.

**Included Files**:
- `i18nKey.ts` - i18n key definitions
- `translation.ts` - i18n core functions
- `languages/` - Language files
  - `zh-CN.ts` - Simplified Chinese
  - `en.ts` - English
  - `ja.ts` - Japanese

**Usage Example**:
```typescript
import { i18n } from '@/i18n/translation'
import I18nKey from '@/i18n/i18nKey'

const title = i18n(I18nKey.homePage)
```

### src/data/ - Data Files

**Responsibility**: Store static data files.

**Included Files**:
- `friends.ts` - Friends link data
- `projects.ts` - Project data
- `skills.ts` - Skills data

**Example**:
```typescript
// data/friends.ts
export interface Friend {
  name: string
  url: string
  avatar: string
  description: string
}

export const friends: Friend[] = [
  {
    name: 'Friend Name',
    url: 'https://example.com',
    avatar: '/assets/friends/avatar.png',
    description: 'Description'
  }
]
```

## File Naming Conventions

### Component Files

#### Astro Components

**Format**: `PascalCase.astro`

**Examples**:
- `Button.astro`
- `SearchBar.astro`
- `MusicPlayer.astro`

**Feature Module Suffixes**:
- `SearchModule.astro` - Search feature module
- `QRCodeModule.astro` - QR code feature module

**Container Component Suffixes**:
- `SidebarContainer.astro` - Sidebar container
- `WidgetContainer.astro` - Widget container

#### Svelte Components

**Format**: `PascalCase.svelte`

**Examples**:
- `MusicPlayer.svelte`
- `ChipCloud.svelte`
- `ProfileCard.svelte`

### Utility Function Files

**Format**: `[function]-utils.ts`

**Examples**:
- `content-utils.ts`
- `date-utils.ts`
- `url-utils.ts`
- `string-utils.ts`

### Type Definition Files

**Format**: `[topic].ts`

**Examples**:
- `config.ts` - Configuration types
- `api.ts` - API types
- `components.ts` - Component types

### Constant Files

**Format**: `[topic].ts`

**Examples**:
- `theme.ts` - Theme constants
- `routes.ts` - Route constants
- `api.ts` - API endpoint constants

### Page Files

#### Static Routes

**Format**: `[name].astro`

**Examples**:
- `index.astro` - Home page
- `about.astro` - About page
- `contact.astro` - Contact page

#### Dynamic Routes

**Format**: `[param].astro`

**Examples**:
- `[slug].astro` - Post detail
- `[id].astro` - Album detail

#### Catch-All Routes

**Format**: `[...catch-all].astro`

**Examples**:
- `[...slug].astro` - 404 page
- `[...path].astro` - Dynamic path matching

### Style Files

**Format**: `[topic].css`

**Examples**:
- `global.css` - Global styles
- `theme.css` - Theme styles
- `components.css` - Component styles

### Script Files

**Format**: `[function].[ext]`

**Examples**:
- `build.ts` - Build script
- `deploy.sh` - Deployment script
- `setup.ts` - Initialization script

### Documentation Files

**Format**: `[topic].md`

**Examples**:
- `README.md` - Project description
- `CONTRIBUTING.md` - Contributing guide
- `ARCHITECTURE.md` - Architecture documentation

### Configuration Files

**Format**: `[tool].config.[ext]`

**Examples**:
- `astro.config.mjs` - Astro configuration
- `tailwind.config.cjs` - Tailwind configuration
- `tsconfig.json` - TypeScript configuration

## Modular Organization Principles

### 1. Single Responsibility

Each module (file or directory) should have one clearly defined responsibility.

**Example**:

✅ **Correct**:
```typescript
// content-utils.ts - Only handles content-related utilities
export function getPosts() { }
export function getCategories() { }
export function getTags() { }
```

❌ **Incorrect**:
```typescript
// utils.ts - Too many responsibilities
export function getPosts() { }        // Content-related
export function formatDate() { }        // Date-related
export function buildUrl() { }          // URL-related
export function validateEmail() { }      // Validation-related
```

### 2. Group by Function

Related functionality should be organized in the same directory.

**Example**:

✅ **Correct**:
```
src/components/features/
├── comment/              # Comment feature
│   ├── Twikoo.astro
│   └── index.astro
├── search/               # Search feature
│   ├── Search.svelte
│   └── SearchModal.astro
└── protection/           # Protection feature
    ├── PasswordProtection.astro
    └── EncryptionService.ts
```

❌ **Incorrect**:
```
src/components/
├── Twikoo.astro          # Comment component
├── Search.svelte          # Search component
├── PasswordProtection.astro # Protection component
└── EncryptionService.ts   # Service
```

### 3. Avoid Circular Dependencies

Modules should avoid circular dependencies.

**Example**:

❌ **Incorrect**:
```typescript
// ModuleA.ts
import { something } from './ModuleB'

// ModuleB.ts
import { somethingElse } from './ModuleA'
```

✅ **Correct**:
```typescript
// ModuleA.ts
import { Shared } from './Shared'

// ModuleB.ts
import { Shared } from './Shared'
```

### 4. Clear Export Interfaces

Modules should provide clear export interfaces.

**Example**:

✅ **Correct**:
```typescript
// content-utils.ts
export interface Post {
  id: string
  title: string
  slug: string
}

export async function getPosts(): Promise<Post[]> { }
export async function getPost(id: string): Promise<Post> { }
```

✅ **Correct (default export)**:
```typescript
// widgetManager.ts
export default class WidgetManager { }
export { WidgetManager }
```

### 5. Namespace Organization

Avoid naming conflicts by using namespaces.

**Example**:

✅ **Correct**:
```typescript
// content-utils.ts
export const getPosts = () => { }

// date-utils.ts
export const formatDate = () => { }

// Usage
import { getPosts } from '@/utils/content-utils'
import { formatDate } from '@/utils/date-utils'
```

❌ **Incorrect**:
```typescript
// utils.ts
export const getPosts = () => { }        // Conflict
export const formatDate = () => { }      // Conflict
export const formatUrl = () => { }        // Conflict
```

## File Dependency Management

### 1. Use Absolute Path Imports

Prefer absolute path imports (using the `@` alias) for better maintainability.

**tsconfig.json Configuration**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@utils/*": ["./src/utils/*"],
      "@types/*": ["./src/types/*"],
      "@constants/*": ["./src/constants/*"]
    }
  }
}
```

**Usage Example**:
```astro
---
// ✅ Correct: Use absolute paths
import Button from '@components/atoms/Button.astro'
import { getPosts } from '@utils/content-utils'
import { ROUTES } from '@constants/routes'
---

// ❌ Incorrect: Use relative paths
import Button from '../../components/atoms/Button.astro'
import { getPosts } from '../utils/content-utils'
import { ROUTES } from '../constants/routes'
---
```

### 2. Import by Layer

Import in dependency order to avoid confusion.

**Import Order**:
1. External libraries
2. Internal libraries
3. Components
4. Utility functions
5. Types
6. Constants

**Example**:
```astro
---
// 1. External libraries
import { getCollection } from 'astro:content'
import { Icon } from 'astro-icon/components'

// 2. Internal libraries
import I18nKey from '@i18n/i18nKey'
import { i18n } from '@i18n/translation'

// 3. Components
import Button from '@components/atoms/Button.astro'
import Card from '@components/atoms/Card.astro'

// 4. Utility functions
import { getPosts } from '@utils/content-utils'
import { formatDate } from '@utils/date-utils'

// 5. Types
import type { Post } from '@types/config'

// 6. Constants
import { ROUTES } from '@constants/routes'
---
```

### 3. Avoid Deeply Nested Imports

Import paths should not be excessively deep.

**Example**:

❌ **Incorrect**:
```astro
---
import Button from '../../../components/atoms/Button.astro'
import { getPosts } from '../../utils/content-utils'
---
```

✅ **Correct**:
```astro
---
import Button from '@components/atoms/Button.astro'
import { getPosts } from '@utils/content-utils'
---
```

## File Organization for Complex Components

### Subdirectory Structure for Large Components

When a component exceeds 300 lines or contains multiple sub-features, create a subdirectory.

**Structure Template**:
```
ComponentName/
├── ComponentName.astro      # Main component (composition layer)
├── SubComponent1.svelte      # Subcomponent 1
├── SubComponent2.svelte      # Subcomponent 2
├── SubComponent3.svelte      # Subcomponent 3
├── controls/                 # Control components
│   ├── Control1.svelte
│   └── Control2.svelte
├── hooks/                   # Related hooks
│   ├── useFeature1.ts
│   ├── useFeature2.ts
│   └── useFeature3.ts
├── utils/                   # Utility functions
│   └── helper.ts
├── types.ts                 # Type definitions
└── README.md                # Component documentation (optional)
```

### Example: MusicPlayer

**Directory Structure**:
```
MusicPlayer/
├── MusicPlayer.astro          # Main container (< 50 lines)
├── MiniPlayer.svelte          # Mini player (~150 lines)
├── ExpandedPlayer.svelte      # Expanded player (~200 lines)
├── PlaylistPanel.svelte      # Playlist (~120 lines)
├── controls/                # Control components
│   ├── PlayControls.svelte    # Playback controls (~80 lines)
│   ├── ProgressBar.svelte     # Progress bar (~100 lines)
│   └── VolumeControl.svelte  # Volume control (~60 lines)
├── hooks/                  # Related hooks
│   ├── useAudio.ts           # Audio playback logic (~80 lines)
│   ├── usePlaylist.ts        # Playlist management (~90 lines)
│   └── useVolume.ts         # Volume control logic (~50 lines)
├── types.ts                # Type definitions (~40 lines)
└── README.md               # Component documentation
```

**Usage**:
```astro
---
import MusicPlayer from './MusicPlayer.astro'
---

<MusicPlayer client:visible />
```

### Example: Calendar

**Directory Structure**:
```
Calendar/
├── Calendar.astro            # Main container (< 50 lines)
├── CalendarHeader.svelte     # Header navigation (~80 lines)
├── CalendarGrid.svelte      # Calendar grid (~150 lines)
├── PostList.astro          # Post list (~100 lines)
├── hooks/                  # Related hooks
│   └── useCalendar.ts      # Calendar logic (~120 lines)
├── utils/                  # Utility functions
│   └── calendarUtils.ts    # Date calculations (~80 lines)
├── types.ts                # Type definitions (~40 lines)
└── README.md               # Component documentation
```

## Shared File Management

### 1. Index Files

Use `index.ts` as the public export interface.

**Example**:
```typescript
// components/atoms/index.ts
export { default as Button } from './Button.astro'
export { default as Card } from './Card.astro'
export { default as Input } from './Input.astro'

// Usage
import { Button, Card, Input } from '@components/atoms'
```

### 2. README Files

Add README files for complex directories.

**Example**:
```markdown
# MusicPlayer Component

Music player component with playlist, volume control, and progress management.

## Usage

```astro
<MusicPlayer
  playlist={playlist}
  autoplay={false}
/>
```

## Props

- `playlist`: Playlist
- `autoplay`: Whether to autoplay
```

### 3. Type Definition Files

Centralize type definitions for complex components.

**Example**:
```typescript
// MusicPlayer/types.ts
export interface Song {
  id: string
  title: string
  artist: string
  url: string
  duration: number
}

export interface Playlist {
  id: string
  name: string
  songs: Song[]
}

export interface MusicPlayerProps {
  playlist: Playlist
  autoplay?: boolean
}
```

## Comparison with Aruma

### File Organization Comparison

| Aspect | Mizuki | Aruma | Improvement Suggestions |
|------|--------|-------|----------|
| **Component Layering** | ✅ Implemented | ✅ Complete | Continue improving |
| **Directory Structure** | ⚠️ Disorganized | ✅ Clear | Reorganize directories |
| **Complex Components** | ⚠️ Single file | ✅ Subdirectories | Split oversized components |
| **Utility Functions** | ⚠️ Scattered | ✅ Unified | Consolidate utilities |
| **Type Definitions** | ⚠️ Scattered | ✅ Centralized | Unify type definitions |
| **Documentation** | ✅ Comprehensive | ✅ Comprehensive | Maintain advantage |

### Aruma Best Practices

1. **Clear Component Layering**
   ```
   components/
   ├── admin/              # Admin dashboard
   ├── cards/              # Card components
   ├── comment/            # Comment components
   ├── layouts/            # Layout components
   ├── svelte/             # Svelte components
   └── ui/                # UI components
   ```

2. **Subdirectories for Complex Components**
   ```
   MusicPlayer.svelte → 
   MusicPlayer/
   ├── MusicPlayer.svelte
   ├── controls/
   ├── hooks/
   └── types.ts
   ```

3. **Unified Utility Functions**
   ```
   lib/
   ├── utils/
   └── types/
   ```

## Migration Guide

### Migrating from Current Structure to New Structure

#### Step 1: Create New Directories

```bash
# Create new layered directories
mkdir -p src/components/{atoms,molecules,organisms}
mkdir -p src/components/widgets/common
mkdir -p src/components/features/{comment,search,protection,media}
mkdir -p src/components/layouts
```

#### Step 2: Move Files

```bash
# Move atomic components
mv src/components/Button.astro src/components/atoms/
mv src/components/Card.astro src/components/atoms/
mv src/components/Input.astro src/components/atoms/

# Move widgets
mv src/components/widget/* src/components/widgets/
mv src/components/widget/common src/components/widgets/common

# Move feature components
mv src/components/comment src/components/features/
mv src/components/control src/components/molecules/
```

#### Step 3: Update Import Paths

```bash
# Find all imports
grep -r "from.*components" src/pages src/layouts

# Batch update paths
# Use an editor or script for bulk replacement
```

#### Step 4: Test

```bash
# Run build to check for errors
pnpm run build

# Run dev server for testing
pnpm run dev

# Run lint
pnpm run lint

# Run type check
pnpm run typecheck
```

### Refactoring Checklist

- [ ] Create new directory structure
- [ ] Move files to appropriate categories
- [ ] Update all import paths
- [ ] Rename files to match naming conventions
- [ ] Split oversized components
- [ ] Consolidate duplicate utility functions
- [ ] Unify type definitions
- [ ] Add README files
- [ ] Update documentation
- [ ] Run tests for verification

## Best Practices

### 1. Regular Maintenance

Regularly review and organize the file structure to keep it clear.

**Checklist**:
- Are there outdated files?
- Is there duplicate code?
- Are there directories with unclear responsibilities?
- Do large components need to be split?

### 2. Use Tools

Use tools to assist with file management.

**Recommended Tools**:
- **Directory tree**: `tree src/`
- **File search**: `find src/ -name "*.astro"`
- **Code statistics**: `wc -l src/components/*.astro`
- **Duplicate detection**: Use IDE plugins

### 3. Keep Documentation in Sync

Update documentation promptly after file structure changes.

**Update Content**:
- Directory structure diagrams
- Usage examples
- Migration guides

### 4. Code Review

Check file organization during code review.

**Review Points**:
- [ ] Files are in the correct directory
- [ ] Filenames follow naming conventions
- [ ] Import paths are correct
- [ ] No circular dependencies

## FAQ

### Q1: How should temporary files be handled?

**A**: Use a temporary directory or add TODO comments.

**Example**:
```typescript
// TODO: Migrate to atoms/
// TODO: Split into subcomponents
```

### Q2: When should a component be split into a subdirectory?

**A**: When the component meets these conditions:
- Component > 300 lines
- Has 3+ sub-features
- Requires multiple auxiliary files

### Q3: How should shared components be handled?

**A**: Use a shared directory or extract to a higher level.

**Example**:
```
src/components/
├── atoms/              # Shared atomic components
├── widgets/common/      # Shared widget components
└── organisms/          # Uses shared components
```

### Q4: How should files for similar features be named?

**A**: Use consistent prefixes or suffixes.

**Example**:
- `Calendar.astro` - Main component
- `CalendarHeader.svelte` - Header
- `CalendarGrid.svelte` - Grid
- `CalendarUtils.ts` - Utility functions

## Summary

A well-organized file architecture is key to project success:

✅ **Clear separation of concerns** - Each directory has a defined responsibility
✅ **Unified naming conventions** - Easy to understand and navigate
✅ **Sound dependency management** - Avoid circular dependencies
✅ **Modular organization** - Easy to maintain and extend

Following these guidelines helps:
1. Improve code readability
2. Reduce maintenance costs
3. Increase development efficiency
4. Lower the onboarding barrier for new contributors

---

**Last Updated**: 2026-03-17
**Maintainers**: Mizuki Development Team

## References

- [Component Architecture Guidelines](./01-component-architecture.md)
- [Component Split Guide](./02-component-split-guide.md)
- [Aruma File Organization](../../demo/Aruma/docs/)
- [Astro Project Structure](https://docs.astro.build/en/core-concepts/project-structure/)
