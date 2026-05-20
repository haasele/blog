# Component Split Guide

## Overview

This document provides detailed component splitting methods and best practices to help you identify components that need splitting and refactor them effectively.

## Identifying Components That Need Splitting

### Split Signal Checklist

Consider splitting when a component shows the following signals:

#### 1. Excessive code size

- ❌ Total component lines > 500
- ❌ Style code > 200 lines
- ❌ Script code > 150 lines

**Example**:
```
MusicPlayer.svelte - 934 lines ❌ Must split
Calendar.astro - 527 lines ❌ Needs splitting
Navbar.astro - 294 lines ⚠️ Consider splitting
Footer.astro - 159 lines ✅ Good
```

#### 2. Too many responsibilities

The component handles multiple unrelated features:

**❌ Incorrect example**:
```astro
---
// ❌ One component responsible for:
// 1. Search
// 2. Navigation menu
// 3. Theme switching
// 4. Sidebar
// 5. User authentication
---

<SearchAndNavAndThemeAndSidebarAndAuth.astro />
```

**✅ Correct example**:
```astro
<SearchModule.astro />
<NavbarMenu.astro />
<ThemeToggle.astro />
<Sidebar.astro />
<AuthModule.astro />
```

#### 3. High state complexity

- More than 10 state variables
- State nesting deeper than 3 levels
- State update logic scattered across the component

**❌ Incorrect example**:
```typescript
// ❌ 15+ reactive variables, hard to maintain
let isPlaying = $state(false)
let currentSong = $state(null)
let playlist = $state([])
let volume = $state(0.8)
let isMuted = $state(false)
let isExpanded = $state(false)
let showPlaylist = $state(false)
let currentTime = $state(0)
let duration = $state(0)
let isRepeat = $state(false)
let isShuffle = $state(false)
let showMiniPlayer = $state(true)
let audioRef = $state(null)
// ...
```

#### 4. Excessive DOM manipulation

- Many `document.getElementById` or `querySelector` calls
- Complex event listener binding
- Dynamic element creation/removal

**❌ Incorrect example**:
```javascript
// ❌ 20+ DOM operations
const button1 = document.getElementById('btn1')
const button2 = document.getElementById('btn2')
// ... 20 similar operations
```

#### 5. Too many dependencies

- Imports 10+ external dependencies
- Imports multiple large third-party libraries

**❌ Incorrect example**:
```astro
---
// ❌ Imports 12 dependencies
import QRCode from 'qrcode'
import PDF from 'pdf-lib'
import XLSX from 'xlsx'
import Chart from 'chart.js'
// ...
```

### Split Evaluation Tool

Use the following evaluation matrix to decide whether to split:

| Criterion | Weight | Score (1-5) | Weighted score |
|--------|------|-----------|----------|
| Line count | 25% | | |
| Number of responsibilities | 30% | | |
| State complexity | 20% | | |
| DOM operation count | 15% | | |
| Dependency count | 10% | | |
| **Total** | **100%** | | |

**Split decision**:
- Total score > 3.5: Must split
- Total score 2.5–3.5: Split recommended
- Total score < 2.5: No split for now

## Split Principles

### 1. Single Responsibility Principle (SRP)

Each component after splitting should have one clear responsibility.

**Example: MusicPlayer before splitting**

```svelte
// ❌ MusicPlayer.svelte (934 lines)
// Responsibilities:
// 1. Audio playback control
// 2. Playlist management
// 3. Progress bar display and control
// 4. Volume control
// 5. Mini player UI
// 6. Expanded player UI
// 7. Playlist UI
```

**After splitting**

```
MusicPlayer/
├── MusicPlayer.svelte           # Responsibility: composition layer, coordinates subcomponents
├── MiniPlayer.svelte          # Responsibility: mini player UI
├── ExpandedPlayer.svelte      # Responsibility: expanded player UI
├── PlaylistPanel.svelte        # Responsibility: playlist UI
├── controls/
│   ├── PlayControls.svelte    # Responsibility: playback control buttons
│   ├── ProgressBar.svelte     # Responsibility: progress bar
│   └── VolumeControl.svelte  # Responsibility: volume control
└── hooks/
    ├── useAudio.ts           # Responsibility: audio playback logic
    ├── usePlaylist.ts        # Responsibility: playlist management
    └── useVolume.ts         # Responsibility: volume control logic
```

### 2. Interface Segregation Principle (ISP)

Components should depend only on the interfaces they need, not on unrelated interfaces.

**Example: Calendar component**

```astro
---
// ❌ Wrong: Calendar depends directly on all features
import { getAllPosts } from '../utils/blog'
import { calculateDates } from '../utils/calendar'
import { formatTime } from '../utils/date'
import { handleNav } from '../utils/navigation'
import { handleDrag } from '../utils/drag'
// ... 10+ dependencies
---

// ✅ Correct: extract a hook
import { useCalendar } from '../hooks/useCalendar'

const { dates, currentMonth, handleMonthChange } = useCalendar()
```

### 3. Dependency Inversion Principle (DIP)

High-level modules should not depend on low-level modules; both should depend on abstractions.

**Example:**

```typescript
// ❌ Wrong: depends on concrete implementation
function renderPosts() {
  const posts = await getPostsFromDB()
  // ...
}

// ✅ Correct: depends on abstraction
interface PostRepository {
  getAll(): Promise<Post[]>
}

function renderPosts(repository: PostRepository) {
  const posts = await repository.getAll()
  // ...
}
```

## Split Methods

### Method 1: Split by feature

Suitable for components with clear responsibilities.

**Steps**:

1. **Identify feature modules**
   ```
   MusicPlayer feature modules:
   - Playback control (play/pause/prev/next)
   - Progress management (current time/duration/seek)
   - Volume management (volume/mute)
   - Playlist management (add/remove/reorder)
   - UI state management (mini/expanded/playlist)
   ```

2. **Create a subcomponent for each feature**
   ```
   controls/PlayControls.svelte
   controls/ProgressBar.svelte
   controls/VolumeControl.svelte
   ```

3. **Extract business logic into hooks**
   ```
   hooks/useAudio.ts
   hooks/usePlaylist.ts
   hooks/useVolume.ts
   ```

4. **Create a composition-layer component**
   ```astro
   // MusicPlayer.astro (composition layer)
   ---
   import PlayControls from './controls/PlayControls.svelte'
   import ProgressBar from './controls/ProgressBar.svelte'
   import VolumeControl from './controls/VolumeControl.svelte'
   ---

   <div class="music-player">
     <PlayControls />
     <ProgressBar />
     <VolumeControl />
   </div>
   ```

**Example: MusicPlayer split**

**Before splitting**:
```svelte
<script lang="ts">
// ❌ 934 lines, all logic mixed together
let isPlaying = $state(false)
let currentSong = $state(null)
let playlist = $state([])
let volume = $state(0.8)
// ... more state and logic

function togglePlay() {
  isPlaying = !isPlaying
  if (isPlaying) {
    audioRef.src = currentSong.url
    audioRef.play()
  } else {
    audioRef.pause()
  }
}

function handleProgressChange(time: number) {
  currentTime = time
  audioRef.currentTime = time
}

function handleVolumeChange(vol: number) {
  volume = vol
  audioRef.volume = vol
}

// ... more functions
</script>

<div class="music-player">
  <button on:click={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
  <input type="range" bind:value={currentTime} />
  <input type="range" bind:value={volume} />
  <!-- More UI -->
</div>

<style>
  /* 200+ lines of styles */
</style>
```

**After splitting**:

1. **hooks/useAudio.ts**
```typescript
export function useAudio() {
  const isPlaying = $state(false)
  const currentTime = $state(0)
  const duration = $state(0)
  const audioRef = $state<HTMLAudioElement | null>(null)

  const togglePlay = () => {
    isPlaying = !isPlaying
    if (isPlaying) audioRef?.play()
    else audioRef?.pause()
  }

  const seek = (time: number) => {
    if (audioRef) audioRef.currentTime = time
  }

  return {
    isPlaying,
    currentTime,
    duration,
    audioRef,
    togglePlay,
    seek
  }
}
```

2. **controls/PlayControls.svelte**
```svelte
<script lang="ts">
  export let isPlaying: boolean
  export let onTogglePlay: () => void
  export let onPrev: () => void
  export let onNext: () => void
</script>

<div class="play-controls">
  <button on:click={onPrev}>
    <Icon name="material-symbols:skip-previous" />
  </button>
  <button on:click={onTogglePlay}>
    <Icon name={isPlaying ? 'material-symbols:pause' : 'material-symbols:play-arrow'} />
  </button>
  <button on:click={onNext}>
    <Icon name="material-symbols:skip-next" />
  </button>
</div>

<style>
  .play-controls {
    display: flex;
    gap: 8px;
  }
</style>
```

3. **controls/ProgressBar.svelte**
```svelte
<script lang="ts">
  export let currentTime: number
  export let duration: number
  export let onSeek: (time: number) => void
</script>

<div class="progress-container">
  <input
    type="range"
    min="0"
    max={duration}
    value={currentTime}
    on:input={(e) => onSeek(Number((e.target as HTMLInputElement).value))}
    class="progress-bar"
  />
  <span class="time">
    {formatTime(currentTime)} / {formatTime(duration)}
  </span>
</div>

<style>
  .progress-container {
    display: flex;
    align-items: center;
    gap: 8px;
  }
</style>
```

4. **MusicPlayer.astro (composition layer)**
```astro
---
import PlayControls from './controls/PlayControls.svelte'
import ProgressBar from './controls/ProgressBar.svelte'
import { useAudio } from './hooks/useAudio'

const audio = useAudio()
---

<div class="music-player">
  <PlayControls
    isPlaying={audio.isPlaying}
    onTogglePlay={audio.togglePlay}
    onPrev={() => {}}
    onNext={() => {}}
  />
  <ProgressBar
    currentTime={audio.currentTime}
    duration={audio.duration}
    onSeek={audio.seek}
  />
</div>
```

### Method 2: Split by UI hierarchy

Suitable for components with a clear UI hierarchy.

**Example: Calendar split**

**Before splitting**:
```astro
---
// ❌ Calendar.astro (527 lines)
// Includes:
// - Header navigation (month/year selectors)
// - Calendar grid (date rendering)
// - Post list (posts for selected date)
---

<div class="calendar">
  <header>
    <button>←</button>
    <select>2025</select>
    <select>March</select>
    <button>→</button>
  </header>

  <div class="grid">
    <!-- Calendar grid -->
  </div>

  <div class="posts">
    <!-- Post list -->
  </div>
</div>
```

**After splitting**:

```
Calendar/
├── Calendar.astro              # Composition layer (< 50 lines)
├── CalendarHeader.svelte      # Header navigation
├── CalendarGrid.svelte       # Calendar grid
├── PostList.astro           # Post list
├── utils/
│   └── calendarUtils.ts     # Date calculation logic
└── types.ts
```

1. **CalendarHeader.svelte**
```svelte
<script lang="ts">
  export let year: number
  export let month: number
  export let onPrevMonth: () => void
  export let onNextMonth: () => void
</script>

<header class="calendar-header">
  <button on:click={onPrevMonth}>
    <Icon name="material-symbols:chevron-left" />
  </button>
  <div class="title">{year} / {month + 1}</div>
  <button on:click={onNextMonth}>
    <Icon name="material-symbols:chevron-right" />
  </button>
</header>
```

2. **CalendarGrid.svelte**
```svelte
<script lang="ts">
  export let dates: Date[]
  export let selectedDate: Date | null
  export let onSelectDate: (date: Date) => void
</script>

<div class="calendar-grid">
  {#each dates as date}
    <div
      class="date-cell"
      class:selected={isSameDay(date, selectedDate)}
      on:click={() => onSelectDate(date)}
    >
      {date.getDate()}
    </div>
  {/each}
</div>
```

3. **Calendar.astro (composition layer)**
```astro
---
import CalendarHeader from './CalendarHeader.svelte'
import CalendarGrid from './CalendarGrid.svelte'
import PostList from './PostList.astro'
import { useCalendar } from './hooks/useCalendar'

const calendar = useCalendar()
---

<div class="calendar">
  <CalendarHeader
    year={calendar.year}
    month={calendar.month}
    onPrevMonth={calendar.prevMonth}
    onNextMonth={calendar.nextMonth}
  />
  <CalendarGrid
    dates={calendar.dates}
    selectedDate={calendar.selectedDate}
    onSelectDate={calendar.selectDate}
  />
  <PostList posts={calendar.posts} />
</div>
```

### Method 3: Split by concern

Suitable for components with complex logic.

**Concerns**:
- Data fetching
- Data processing
- UI rendering
- Event handling
- Styling

**Example: PasswordProtection split**

**Before splitting**:
```astro
---
// ❌ PasswordProtection.astro (648 lines)
// Mixed concerns:
// - Encryption/decryption logic
// - UI form
// - Dynamic script execution
// - Error handling
---

<script>
  // Encryption logic
  function encrypt(text: string, key: string): string {
    // 100+ lines of encryption code
  }

  // Decryption logic
  function decrypt(encrypted: string, key: string): string {
    // 100+ lines of decryption code
  }

  // UI logic
  let password = ''
  let error = ''
  // ... more UI state
</script>

<form>
  <input type="password" bind:value={password} />
  <button on:click={handleSubmit}>Unlock</button>
</form>

<style>
  /* Form styles */
</style>
```

**After splitting**:

```
features/protection/
├── PasswordProtection.astro  # UI layer (< 200 lines)
├── PasswordForm.astro       # Form component (< 100 lines)
├── EncryptionService.ts      # Encryption/decryption service (< 200 lines)
└── types.ts                # Type definitions
```

1. **EncryptionService.ts**
```typescript
export class EncryptionService {
  private readonly algorithm = 'AES-GCM'
  private readonly saltLength = 16

  async encrypt(text: string, key: string): Promise<string> {
    const salt = crypto.getRandomValues(new Uint8Array(this.saltLength))
    const keyMaterial = await this.deriveKey(key, salt)
    const iv = crypto.getRandomValues(new Uint8Array(12))

    const encrypted = await crypto.subtle.encrypt(
      { name: this.algorithm, iv },
      keyMaterial,
      new TextEncoder().encode(text)
    )

    return this.combineResults(salt, iv, encrypted)
  }

  async decrypt(encrypted: string, key: string): Promise<string> {
    const { salt, iv, data } = this.splitResults(encrypted)
    const keyMaterial = await this.deriveKey(key, salt)

    const decrypted = await crypto.subtle.decrypt(
      { name: this.algorithm, iv },
      keyMaterial,
      data
    )

    return new TextDecoder().decode(decrypted)
  }

  private async deriveKey(key: string, salt: Uint8Array) {
    return await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(key),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    )
  }

  // ... more helper methods
}
```

2. **PasswordForm.astro**
```astro
---
import Button from '../atoms/Button.astro'
import Input from '../atoms/Input.astro'

interface Props {
  error?: string
  loading?: boolean
  onSubmit?: (password: string) => void
}

const { error = '', loading = false, onSubmit } = Astro.props
---

<form id="password-form">
  <Input
    type="password"
    name="password"
    placeholder="Enter password"
    disabled={loading}
  />
  {error && <p class="error">{error}</p>}
  <Button
    variant="primary"
    disabled={loading}
    type="submit"
  >
    {loading ? 'Unlocking...' : 'Unlock'}
  </Button>
</form>

<script>
  const form = document.getElementById('password-form')
  form?.addEventListener('submit', (e) => {
    e.preventDefault()
    const password = (form.querySelector('input[name="password"]') as HTMLInputElement).value
    if (onSubmit) onSubmit(password)
  })
</script>

<style>
  .error {
    color: var(--error-color);
    font-size: 0.875rem;
    margin-top: 0.5rem;
  }
</style>
```

3. **PasswordProtection.astro (UI layer)**
```astro
---
import PasswordForm from './PasswordForm.astro'
import { EncryptionService } from './EncryptionService'

const encryptionService = new EncryptionService()
let error = ''
let loading = false

async function handleSubmit(password: string) {
  loading = true
  try {
    const decrypted = await encryptionService.decrypt(encryptedContent, password)
    // Handle decrypted content
  } catch (e) {
    error = 'Incorrect password'
  } finally {
    loading = false
  }
}
---

<PasswordForm
  error={error}
  loading={loading}
  onSubmit={handleSubmit}
/>
```

### Method 4: Extract shared components

Suitable for components with similar patterns.

**Example: Widget component extraction**

**Before splitting**:
```astro
---
// widget/Profile.astro
---

<div class="widget card-base">
  <div class="widget-header">
    <Icon name="material-symbols:person" />
    <h3>Profile</h3>
  </div>
  <div class="widget-content">
    <!-- Content -->
  </div>
</div>

---

// widget/Categories.astro
---

<div class="widget card-base">
  <div class="widget-header">
    <Icon name="material-symbols:category" />
    <h3>Categories</h3>
  </div>
  <div class="widget-content">
    <!-- Content -->
  </div>
</div>
```

**After splitting**:

1. **widgets/common/WidgetLayout.astro**
```astro
---
import Icon from '../../atoms/Icon.astro'

interface Props {
  name?: string
  icon?: string
  isCollapsed?: boolean
  collapsedHeight?: string
  class?: string
}

const { name, icon, isCollapsed, collapsedHeight, class: className = '' } = Astro.props
---

<div class="widget-layout {className}" data-collapsed={isCollapsed}>
  {name && (
    <div class="widget-header">
      {icon && <Icon name={icon} />}
      <h3>{name}</h3>
    </div>
  )}
  <div class="widget-content">
    <slot />
  </div>
</div>

<style define:vars={{ collapsedHeight }}>
  .widget-layout[data-collapsed="true"] .widget-content {
    max-height: var(--collapsed-height);
    overflow: hidden;
  }

  .widget-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .widget-content {
    padding: 1rem;
  }
</style>
```

2. **widget/Profile.astro**
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import Avatar from '../../atoms/Avatar.astro'
---

<WidgetLayout name="Profile" icon="material-symbols:person">
  <Avatar src="/avatar.png" size="lg" />
  <div class="profile-info">
    <h4>Mizuki</h4>
    <p>Frontend developer</p>
  </div>
</WidgetLayout>
```

3. **widget/Categories.astro**
```astro
---
import WidgetLayout from './common/WidgetLayout.astro'
import ChipCloud from '../../molecules/ChipCloud.astro'

const categories = await getCategories()
---

<WidgetLayout name="Categories" icon="material-symbols:category">
  <ChipCloud items={categories} hrefPrefix="/category/" />
</WidgetLayout>
```

## Split Steps

### Complete split workflow

#### Step 1: Analysis and planning

1. **Evaluate the component**
   ```bash
   # View component line count
   wc -l src/components/ComplexComponent.astro

   # View component dependencies
   grep -r "import" src/components/ComplexComponent.astro
   ```

2. **Identify feature modules**
   - List all feature points
   - Identify repeated patterns
   - Mark independent feature modules

3. **Create a split plan**
   ```markdown
   ## Component split plan: ComplexComponent

   ### Goals
   - Split into 5 subcomponents
   - Reduce main component to < 100 lines
   - Extract 3 hooks

   ### Subcomponent list
   1. SubComponent1.astro - Feature description (estimated lines)
   2. SubComponent2.svelte - Feature description (estimated lines)
   3. ...

   ### Hook list
   1. useFeature1.ts - Feature description
   2. useFeature2.ts - Feature description
   ```

#### Step 2: Create directory structure

```bash
# Create subcomponent directories
mkdir -p src/components/ComplexComponent/controls
mkdir -p src/components/ComplexComponent/hooks
mkdir -p src/components/ComplexComponent/utils
```

#### Step 3: Extract logic into hooks

```typescript
// Extract state management and business logic
export function useFeature() {
  const state = $state(initialValue)

  const action = () => {
    // Logic
  }

  return { state, action }
}
```

#### Step 4: Create subcomponents

```astro
---
// Subcomponents focus on UI rendering
export let value: string
export let onChange: (value: string) => void
---

<input type="text" bind:value={value} on:input={(e) => onChange(e.target.value)} />
```

#### Step 5: Update the main component

```astro
---
import SubComponent1 from './SubComponent1.astro'
import SubComponent2 from './SubComponent2.svelte'
import { useFeature } from './hooks/useFeature'

const feature = useFeature()
---

<div class="main-component">
  <SubComponent1
    value={feature.value}
    onChange={feature.action}
  />
  <SubComponent2 />
</div>
```

#### Step 6: Update import paths

```bash
# Find all files using the original component
grep -r "ComplexComponent" src/pages src/layouts

# Batch-update import paths
sed -i 's|import ComplexComponent from.*|import ComplexComponent from "@components/organisms/ComplexComponent/ComplexComponent.astro"|g' src/pages/*.astro
```

#### Step 7: Test and verify

```bash
# Run build to check for errors
pnpm run build

# Run dev server for manual testing
pnpm run dev

# Run lint
pnpm run lint

# Run type check
pnpm run typecheck
```

#### Step 8: Cleanup and optimization

```bash
# Remove old files
rm src/components/ComplexComponent.astro.backup

# Update documentation
# Add component split notes to CHANGELOG
```

## Pitfalls to Avoid When Splitting

### Pitfall 1: Over-splitting

**Problem**: Splitting too finely increases management cost.

**Example**:
```astro
---
// ❌ Over-split: each button is its own component
import PlayButton from './PlayButton.astro'
import PauseButton from './PauseButton.astro'
import PrevButton from './PrevButton.astro'
import NextButton from './NextButton.astro'
---

<div class="controls">
  <PrevButton />
  <PlayButton />
  <PauseButton />
  <NextButton />
</div>
```

**Fix**:
```svelte
---
// ✅ Reasonable split: one component handles playback controls
interface Props {
  isPlaying: boolean
  onTogglePlay: () => void
  onPrev: () => void
  onNext: () => void
}
---

<div class="controls">
  <button on:click={onPrev}>Prev</button>
  <button on:click={onTogglePlay}>
    {isPlaying ? 'Pause' : 'Play'}
  </button>
  <button on:click={onNext}>Next</button>
</div>
```

### Pitfall 2: Circular dependencies

**Problem**: Component A depends on B, and B depends on A.

**Example**:
```typescript
// ❌ Component A depends on B
import ComponentB from './ComponentB.astro'

// Component B depends on A
import ComponentA from './ComponentA.astro'
```

**Solution**:
```typescript
// ✅ Extract shared state to a store
import { sharedStore } from '../stores/shared'

// Component A uses the store
const { value } = sharedStore

// Component B also uses the store
const { value } = sharedStore
```

### Pitfall 3: Props drilling

**Problem**: Props are passed through layers; intermediate components do not need them.

**Example**:
```astro
---
// ❌ Ancestor component
<ComponentA value={value} />

// Intermediate component (does not need value)
<ComponentB value={value} />

// Grandchild uses value
<ComponentC value={value} />
```

**Solution**:
```typescript
// ✅ Use Context or a store
import { createContext } from './context'

// Provide context in ancestor
<Context.Provider value={{ value }}>
  <ComponentA />
</Context.Provider>

// Consume context in grandchild
const { value } = useContext(Context)
```

### Pitfall 4: Premature optimization

**Problem**: Splitting before requirements are clear.

**Solution**: Follow YAGNI (You Aren't Gonna Need It)

- Split only when truly needed
- Implement features first, then refactor
- Keep it simple; avoid over-engineering

## Practical Cases

### Case 1: Complete MusicPlayer split

**Background**:
- MusicPlayer.svelte: 934 lines
- Too many responsibilities: audio control, UI rendering, playlist management
- Complex state: 15+ reactive variables

**Split strategy**:
1. Split by UI hierarchy (MiniPlayer, ExpandedPlayer, PlaylistPanel)
2. Split by feature (playback controls, progress bar, volume control)
3. Extract business logic into hooks (useAudio, usePlaylist, useVolume)

**Split result**:
```
MusicPlayer.svelte: 50 lines (composition layer)
├── MiniPlayer.svelte: 150 lines
├── ExpandedPlayer.svelte: 200 lines
├── PlaylistPanel.svelte: 120 lines
├── controls/
│   ├── PlayControls.svelte: 80 lines
│   ├── ProgressBar.svelte: 100 lines
│   └── VolumeControl.svelte: 60 lines
└── hooks/
    ├── useAudio.ts: 80 lines
    ├── usePlaylist.ts: 90 lines
    └── useVolume.ts: 50 lines
```

**Benefits**:
- ✅ Main component reduced from 934 to 50 lines (-94%)
- ✅ Each subcomponent has a single responsibility, easier to understand and test
- ✅ Hooks are reusable
- ✅ Easier to maintain and extend

### Case 2: Complete Calendar split

**Background**:
- Calendar.astro: 527 lines
- Complex calendar algorithms
- Multiple view modes

**Split strategy**:
1. Extract date calculation logic to calendarUtils.ts
2. Split by UI hierarchy (Header, Grid, PostList)
3. Create useCalendar hook for state management

**Split result**:
```
Calendar.astro: 50 lines (composition layer)
├── CalendarHeader.svelte: 80 lines
├── CalendarGrid.svelte: 150 lines
├── PostList.astro: 100 lines
├── hooks/
│   └── useCalendar.ts: 120 lines
└── utils/
    └── calendarUtils.ts: 80 lines
```

**Benefits**:
- ✅ Main component reduced from 527 to 50 lines (-90%)
- ✅ Calendar algorithms isolated and easier to test
- ✅ UI and logic separated
- ✅ Reusable calendarUtils

### Case 3: TOC merge and split

**Background**:
- FloatingTOC.astro: 548 lines
- MobileTOC.svelte: 651 lines
- widget/TOC.astro: 379 lines
- Three components with overlapping functionality

**Split strategy**:
1. Extract shared logic to useTOC hook
2. Create a unified TOC component
3. Separate UI by device (DesktopTOC, MobileTOC)

**Split result**:
```
organisms/TOC/
├── TOC.astro: 50 lines (composition layer)
├── DesktopTOC.svelte: 200 lines
├── MobileTOC.svelte: 150 lines
└── hooks/
    └── useTOC.ts: 180 lines
```

**Benefits**:
- ✅ Eliminated duplicate code
- ✅ Unified TOC logic
- ✅ Easier to maintain
- ✅ Total lines reduced from 1578 to 580 (-63%)

## Post-Split Verification

### Functional verification

```bash
# Run dev server
pnpm run dev

# Manually test all features
# - Player play/pause/skip
# - Calendar navigation and selection
# - TOC navigation and scroll
```

### Performance verification

```bash
# Run Lighthouse
npx lighthouse http://localhost:4321 --view

# Check metrics
# - Performance
# - First Contentful Paint
# - Time to Interactive
```

### Code quality verification

```bash
# Run lint
pnpm run lint

# Run type check
pnpm run typecheck

# Run tests
pnpm run test
```

### Comparison verification

```bash
# Count lines before and after split
echo "Before split: 934 lines"
echo "After split: $(wc -l MusicPlayer/*.svelte | tail -1)"

# Count components
find . -name "*.svelte" -o -name "*.astro" | wc -l
```

## Documentation Updates

### Documents to update after splitting

1. **Component documentation**
   ```markdown
   ## MusicPlayer component

   ### Architecture
   - MusicPlayer.astro (composition layer)
   - MiniPlayer.svelte (mini player)
   - ExpandedPlayer.svelte (expanded player)
   - PlaylistPanel.svelte (playlist)

   ### Usage
   ```astro
   <MusicPlayer client:visible />
   ```

   ### Props
   - playlist: Playlist
   - autoplay: Whether to autoplay
   ```

2. **Migration guide**
   ```markdown
   ## Migrating from older versions

   ### Changes
   - MusicPlayer internal structure refactored
   - Public API unchanged; no changes required in usage code

   ### Notes
   - Ensure client:visible directive is used correctly
   ```

3. **CHANGELOG**
   ```markdown
   ## [2.0.0] - 2026-03-17

   ### Changed
   - Refactored MusicPlayer component architecture
   - Split Calendar component
   - Merged TOC-related components

   ### Performance
   - Reduced initial bundle size by 30%
   - Improved component render performance by 40%
   ```

## FAQ

### Q1: Does splitting affect performance?

**A**: No. In practice, after splitting:
- You can use directives like `client:visible` for on-demand loading
- Smaller components cache better
- Unnecessary re-renders are reduced

### Q2: How do components communicate after splitting?

**A**: Use:
- Props (parent → child)
- Event dispatch (child → parent)
- Global store (cross-component)
- Context API (deep component trees)

### Q3: When should I split, and when should I not?

**A**:

**Split when**:
- Component > 500 lines
- More than 3 responsibilities
- More than 10 state variables
- Hard to understand and test

**Do not split when**:
- Component < 200 lines
- Single responsibility
- Simple logic
- Easy to maintain

### Q4: How do I maintain backward compatibility after splitting?

**A**:
1. Keep the public API unchanged
2. Use default values
3. Provide a migration guide
4. Deprecate old APIs gradually

### Q5: How do I test components after splitting?

**A**:
1. **Unit tests**: Test individual components
   ```typescript
   test('MiniPlayer renders correctly', () => {
     const { getByRole } = render(MiniPlayer, { isPlaying: true })
     expect(getByRole('button')).toBeInTheDocument()
   })
   ```

2. **Integration tests**: Test component composition
   ```typescript
   test('MusicPlayer integrates sub-components', () => {
     const { getByText } = render(MusicPlayer, { playlist })
     expect(getByText('Play')).toBeInTheDocument()
   })
   ```

3. **E2E tests**: Test user flows
   ```typescript
   test('User can play music', async ({ page }) => {
     await page.goto('/')
     await page.click('[data-testid="play-button"]')
     await expect(page.locator('[data-testid="playing-indicator"]')).toBeVisible()
   })
   ```

## Summary

Component splitting is a key step in improving code quality. Remember:

✅ **Split principles**
- Single responsibility (SRP)
- Interface segregation (ISP)
- Dependency inversion (DIP)
- Keep it simple (KISS)

✅ **Split methods**
- Split by feature
- Split by UI hierarchy
- Split by concern
- Extract shared components

✅ **Avoid pitfalls**
- Over-splitting
- Circular dependencies
- Props drilling
- Premature optimization

✅ **Continuous improvement**
- Regularly evaluate components
- Refactor large components
- Keep documentation updated
- Share best practices

---

**Last updated**: 2026-03-17
**Maintainer**: Mizuki development team

## Reference Resources

- [Component architecture design specification](./01-component-architecture.md)
- [Aruma component split example](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [React component split guide](https://react.dev/learn/thinking-in-react)
