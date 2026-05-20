# Atom Component Usage Guidelines

## Overview

This document requires preferring existing atom components when developing, and creating new atom components when none fit.

## Core Principle

### Golden Rule

> **Before writing new UI code, check for reusable atom components. If none exist, create one.**

```
❌ Wrong: Duplicate UI structure inline in components
✅ Right: Use existing atoms or create new atom components
```

## Component Layering

The project uses Atomic Design:

```
atoms/          → Atoms (indivisible)
├── Badge/      → Badges, numbers
├── Button/     → Buttons
├── Chip/       → Tags, categories
├── Icon/       → Icons
├── Image/      → Images
├── Link/       → Links
├── Loader/     → Loaders
└── ...

features/      → Feature components (compose atoms)
├── posts/      → Post-related
├── projects/   → Project-related
└── ...

organisms/     → Organisms (compose features)
├── navigation/ → Navigation
└── footer/     → Footer

widgets/       → Widgets (standalone units)
├── sidebar/    → Sidebar
├── profile/    → Profile
└── ...

misc/          → Misc (shared containers)
├── ListContainer/ → List container
└── ListDivider/   → List divider
```

## Existing Atom Component Inventory

### atoms/

| Component | Path | Purpose |
|------|------|------|
| `Badge` | `atoms/Badge/` | Number/count badges |
| `Button` | `atoms/Button/` | Buttons (multiple variants) |
| `Chip` | `atoms/Chip/` | Tags, category labels |
| `Icon` | `atoms/Icon/` | Icon rendering |
| `Image` | `atoms/Image/` | Images (lazy load, loading state) |
| `Link` | `atoms/Link/` | Links (with icons, etc.) |
| `Loader` | `atoms/Loader/` | Loading animation |
| `tag-chip` | `atoms/tag-chip/` | Post tags |

### misc/

| Component | Path | Purpose |
|------|------|------|
| `ListContainer` | `misc/ListContainer/` | Card container (title + icon + badge) |
| `ListDivider` | `misc/ListDivider/` | List divider |
| `CardBase` | Global styles | Base card styles |

## Decision Flow

```
Writing new UI?
       │
       ▼
┌──────────────────────┐
│ Reusable atom exists?│
└──────────────────────┘
       │
   Yes │  No
   ▼   ▼
Use    Consider creating
existing  new component
atom      │
          ▼
   ┌──────────────────┐
   │ Reusable in 2+   │
   │ places?          │
   └──────────────────┘
       │
   Yes │  No
   ▼   ▼
Create  Implement inline
atom    but mark for refactor
        │
        ▼
    Open Issue
```

## Practice Guide

### Scenario 1: Display a Number

```astro
<!-- ❌ Wrong: Hard-coded styles -->
<div class="w-6 h-6 rounded-md bg-enter-btn text-primary flex items-center justify-center">
    {index + 1}
</div>

<!-- ✅ Correct: Badge component -->
<Badge variant="number">{index + 1}</Badge>
```

### Scenario 2: Category Tag

```astro
<!-- ❌ Wrong: Hard-coded styles -->
<span class="px-1.5 py-0.5 rounded bg-btn-regular-bg text-btn-content">
    {category}
</span>

<!-- ✅ Correct: Chip component -->
<Chip>{category}</Chip>
```

### Scenario 3: Card Container (Title + Icon + Content)

```astro
<!-- ❌ Wrong: Duplicate card header -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed">
        <Icon name="material-symbols:article" class="text-xl text-primary" />
        <span class="font-bold">Title</span>
        <span class="ml-auto text-xs px-2 py-0.5 rounded-full bg-btn-bg">Label</span>
    </div>
    <!-- content -->
</div>

<!-- ✅ Correct: ListContainer -->
<ListContainer title="Title" icon="material-symbols:article" badge="Label">
    <!-- content -->
</ListContainer>
```

### Scenario 4: List Divider

```astro
<!-- ❌ Wrong: Duplicate divider -->
<div class="border-b border-dashed border-line-divider"></div>

<!-- ✅ Correct: ListDivider -->
<ListDivider />
```

### Scenario 5: Reusable List Item Layout

```astro
<!-- ❌ Wrong: Duplicate list item in multiple components -->
<div class="flex items-center gap-3 px-3 py-3">
    <div class="w-6 h-6">...</div>
    <div class="flex-1 min-w-0">
        <div class="font-bold">{title}</div>
        <div class="text-xs text-black/30">{date}</div>
    </div>
    <Icon name="chevron-right" />
</div>

<!-- ✅ Correct: PostListItem component -->
<PostListItem post={post} index={index} />
```

## When to Create a New Atom Component

| Criterion | Description |
|------|------|
| **Appears 2+ times** | Same UI structure in multiple files |
| **Single responsibility** | One job (badge, icon, etc.) |
| **Standalone** | No specific business logic |
| **Configurable** | Behavior/appearance via Props |

### Example: Creating Badge

If `Badge` did not exist but number badges appear in many places:

```astro
// src/components/atoms/Badge/Badge.astro
---
interface Props {
    variant?: "number" | "dot" | "count";
    size?: "sm" | "md" | "lg";
    children: any;
}

const { variant = "number", size = "md" } = Astro.props;

const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base"
};
---

<span class:list={[
    "shrink-0 rounded-md bg-(--enter-btn-bg) text-(--primary)",
    "flex items-center justify-center font-bold",
    sizeClasses[size]
]}>
    {variant === "number" && <slot />}
    {variant === "dot" && <span class="w-2 h-2 rounded-full bg-(--primary)" />}
    {variant === "count" && <slot />}
</span>
```

## FAQ

### Q1: Too many Props on an atom?

**A**: Use sensible defaults; expose only necessary Props.

```astro
<!-- ✅ Good defaults -->
<Badge>{count}</Badge>
<Badge variant="dot" />
<Badge variant="number" size="lg">{num}</Badge>
```

### Q2: Existing component style doesn't match?

**A**:
1. Add a variant via Props
2. Append styles via `class` prop if supported
3. Discuss extending or forking the component

### Q3: Unsure whether to create a component?

**A**: When in doubt, create one. Merge or remove later if unnecessary.

### Q4: Atom vs feature component?

**A**:
- **Atom**: Smallest UI unit (Button, Icon, Badge)
- **Feature**: Composes atoms for a feature (PostCard, UserProfile)

## Code Review Checklist

- [ ] Existing atom components used first?
- [ ] Repeated UI extractable into atoms?
- [ ] New components follow single responsibility?
- [ ] PascalCase naming?
- [ ] Exported from `index.ts`?

## Violation Examples

### Example 1: Hard-coded badge styles

```astro
<!-- ❌ Violation -->
---
const { index } = Astro.props;
---

<div class="w-6 h-6 rounded-md bg-(--enter-btn-bg) text-(--primary) flex items-center justify-center text-sm font-bold">
    {index + 1}
</div>

<!-- ✅ Fixed: Badge -->
import Badge from "@/components/atoms/Badge/Badge.astro";
<Badge>{index + 1}</Badge>
```

### Example 2: Duplicate card headers

```astro
<!-- ❌ WidgetA.astro -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed border-(--line-divider)">
        <Icon name="article" />
        <span class="font-bold">Title</span>
    </div>
    <!-- content -->
</div>

<!-- ❌ WidgetB.astro (same header) -->
<div class="card-base p-5">
    <div class="flex items-center gap-2 pb-3 border-b border-dashed border-(--line-divider)">
        <Icon name="category" />
        <span class="font-bold">Categories</span>
    </div>
    <!-- content -->
</div>

<!-- ✅ Fixed: ListContainer -->
<ListContainer title="Title" icon="article">
    <!-- content -->
</ListContainer>
```

## Related Documentation

- [Component Architecture](./01-component-architecture.md)
- [Component Split Guide](./02-component-split-guide.md)
- [File Organization](./03-file-organization-architecture.md)

---

**Last updated**: 2026-03-21  
**Maintainer**: Mizuki development team
