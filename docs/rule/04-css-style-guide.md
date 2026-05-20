# CSS Style Guide

## Overview

This document defines the CSS style guidelines for the Mizuki project, ensuring consistency, maintainability, and performance.

## Core Principles

### Avoid `!important` by Default

The project **should avoid using `!important` in CSS** for the following reasons:

1. **Breaks style precedence**: `!important` overrides CSS's natural cascade rules
2. **Hard to maintain**: Once `!important` is used, future changes often require more `!important`
3. **Conflicts with the theme system**: `!important` can cause unexpected style conflicts
4. **Incompatible with Tailwind CSS**: Tailwind's utility classes rely on normal CSS precedence; `!important` undermines this design
5. **Difficult to debug**: `!important` makes style debugging much harder

## Exceptions Where `!important` Is Allowed

### Twikoo Comment Section Styles

Using `!important` is **allowed** in the `src/styles/twikoo.css` file.

**Rationale**:
1. **Third-party dynamic injection**: Twikoo is a third-party comment system; its styles are injected into the page via JavaScript
2. **High selector specificity**: Twikoo's internal styles use high selector specificity that regular CSS cannot override
3. **Good isolation**: The Twikoo stylesheet is separate; `!important` only affects the comment section and does not impact other components
4. **No alternative**: Because Twikoo's style injection timing and method cannot be controlled, `!important` is the only reliable override
5. **CSS-in-JS library**: Twikoo uses a component library whose inline styles are difficult to override with regular CSS

**Example**:
```css
/* ✅ Allowed: Override Twikoo default styles in twikoo.css */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
}

.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
}

.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
}
```

### Other Special Cases (Requires Approval)

If you encounter the following special cases, team approval is required before using `!important`:

1. **Necessary overrides for third-party libraries** (e.g., Twikoo, Chart.js)
2. **Framework-level bug fixes** (temporary solution only; follow-up required)
3. **Known browser bugs** (temporary solution only; add a comment)

**Approval Process**:
1. Explain in the Pull Request why `!important` is needed
2. Document attempts at alternative approaches
3. Obtain approval from at least one core developer

## Recommended Approaches

### 1. Increase Selector Specificity

Override styles with more specific selectors instead of using `!important`.

**❌ Incorrect Example**:
```css
.album-card {
  background-color: white !important;
  color: black !important;
}

.dark .album-card {
  background-color: black !important;
}
```

**✅ Correct Example**:
```css
/* Override styles by increasing selector specificity */
.album-card.card-base {
  background-color: white;
  color: black;
}

.dark .album-card.card-base {
  background-color: black;
}

/* Or use a more specific selector */
.card-base.album-card {
  background-color: white;
}
```

### 2. Use CSS Variables

Use CSS variables instead of hardcoded values so they can be changed globally.

**❌ Incorrect Example**:
```css
.button {
  background-color: #3b82f6 !important;
  color: #ffffff !important;
}
```

**✅ Correct Example**:
```css
:root {
  --primary: #3b82f6;
  --text-color: #ffffff;
}

.button {
  background-color: var(--primary);
  color: var(--text-color);
}
```

### 3. Leverage Tailwind Precedence

Tailwind CSS utility classes are applied in order; later classes override earlier ones.

**❌ Incorrect Example**:
```css
<div class="!bg-white !text-black">
  Content
</div>
```

**✅ Correct Example**:
```astro
---
// Tailwind classes apply in order; no !important needed
---

<div class="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

### 4. Use Scoped Styles

Astro scoped styles automatically provide selector isolation.

**❌ Incorrect Example**:
```astro
---
---

<div class="card">
  Content
</div>

<style>
  /* Using :global affects the entire page */
  :global(.card) {
    background: white !important;
  }
</style>
```

**✅ Correct Example**:
```astro
---
---

<div class="card card-base">
  Content
</div>

<style>
  /* Scoped styles are automatically isolated; no :global needed */
  .card {
    background: var(--card-bg);
    color: var(--text-color);
  }
</style>
```

### 5. Use Composed Classes

Achieve complex styles by combining multiple Tailwind classes.

**❌ Incorrect Example**:
```css
<style>
  .custom-button {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    padding: 0.5rem 1rem !important;
    border-radius: 0.5rem !important;
    font-weight: 600 !important;
    transition: all 0.2s !important;
  }
</style>
```

**✅ Correct Example**:
```astro
---
---

<button class="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-all duration-200">
  Button
</button>
```

## Special Case Handling

### Overriding Third-Party Library Styles

#### Twikoo Comment Section (Allows `!important`) ✅

**File Location**: `src/styles/twikoo.css`

```css
/* ✅ Allowed: Twikoo stylesheet */
.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
}

.tk-content {
  color: var(--text-color) !important;
  font-size: 1rem !important;
}

.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
}

.tk-loading-spinner {
  border-color: var(--primary) transparent transparent transparent !important;
}

/* Other Twikoo-related styles... */
```

#### Other Third-Party Libraries (Requires Approval)

**❌ Incorrect Example**:
```css
/* Using !important without approval */
.external-library-element {
  color: red !important;
}
```

**✅ Correct Example**:
```css
/* Try other methods first */
.external-library-container .external-library-element {
  /* Method 1: Increase selector specificity */
  color: red;
}

/* Method 2: Use a more specific selector */
.widget-container .external-library-element {
  color: red;
}

/* Method 3: Add an explanatory comment */
/*
 * TODO: Temporary solution; needs coordination with library maintainers
 * Issue: #123
 */
.external-library-element {
  color: red !important; /* Requires approval, PR #123 */
}
```

### Inline Style Precedence

Inline styles have higher precedence than external stylesheets; use them carefully.

**❌ Incorrect Example**:
```astro
---
<div style="background-color: white !important; padding: 1rem !important;">
  Content
</div>
```

**✅ Correct Example**:
```astro
---
<!-- Use Tailwind classes or a custom class -->
<div class="bg-white p-4 custom-card">
  Content
</div>

<style>
  .custom-card {
    background-color: var(--card-bg);
    padding: 1rem;
  }
</style>
```

### Dynamic Styles

Use CSS variables or style bindings instead of directly manipulating `style` in JavaScript.

**❌ Incorrect Example**:
```javascript
element.style.setProperty('background-color', 'white', 'important');
```

**✅ Correct Example**:
```typescript
// Use CSS variables
document.documentElement.style.setProperty('--dynamic-color', dynamicValue);
```

```css
:root {
  --dynamic-color: #3b82f6;
}

.dynamic-element {
  background-color: var(--dynamic-color);
}
```

## Tailwind CSS `!important` Usage

### Tailwind v4 `!` Prefix

Tailwind CSS v4 provides the `!` prefix to add `!important`:

**⚠️ Use with caution**: Only use the `!` prefix when absolutely necessary.

**❌ Incorrect Example**:
```astro
---
<!-- Using ! prefix without approval -->
<div class="!bg-white !text-black">
  Content
</div>
```

**✅ Correct Example**:
```astro
---
<!-- Use normal Tailwind classes -->
<div class="bg-white dark:bg-black text-black dark:text-white">
  Content
</div>
```

**Use Case**: Only when you must override third-party inline styles.

```astro
---
<!-- Only use when no other override method works -->
<div class="!bg-white" style="/* Needs to override third-party styles */">
  Content
</div>
```

## CSS Precedence Rules

### Selector Precedence (High to Low)

1. **Inline styles (`style="..."`)**: Highest precedence
2. **`!important`**: Forces highest precedence
3. **ID selectors (`#id`)**
4. **Class selectors (`.class`)**
5. **Attribute selectors (`[attr]`)**
6. **Pseudo-class selectors (`:hover`, `:active`, etc.)**
7. **Pseudo-element selectors (`::before`, `::after`, etc.)**
8. **Element selectors (`div`, `span`, etc.)**: Lowest precedence

### Specificity Rules

```css
/* Precedence 1: ID selector */
#unique-element {
  color: red;
}

/* Precedence 2: Class selector + pseudo-class */
.button:hover {
  color: blue;
}

/* Precedence 3: Class selector */
.button {
  color: green;
}

/* Precedence 4: Element selector */
div {
  color: black;
}
```

### Specificity Calculation

```css
/* Specificity: 1 ID, 0 classes, 0 attributes = 100 points */
#header .nav-link {
  color: blue;
}

/* Specificity: 0 IDs, 1 class, 1 attribute = 11 points */
.nav-link.active {
  color: green; /* Higher precedence */
}

/* Specificity: 0 IDs, 2 classes = 20 points */
.card .header .title {
  color: red; /* Highest precedence */
}
```

## Dark Theme Styles

### Use CSS Variables

Use CSS variables for theme switching; avoid `!important`.

**❌ Incorrect Example**:
```css
/* Using !important to force overrides */
.dark .card {
  background-color: black !important;
  color: white !important;
}
```

**✅ Correct Example**:
```css
:root {
  --card-bg: white;
  --text-color: black;
}

.dark {
  --card-bg: #1f2937;
  --text-color: #f3f4f6;
}

.card {
  background-color: var(--card-bg);
  color: var(--text-color);
}
```

### Dark Theme Selectors

```css
/* ✅ Correct: Use dark theme class name */
.dark .card {
  background-color: var(--card-bg-dark);
}

/* Or in an Astro component */
<style>
  :global(.dark) .card {
    background-color: var(--card-bg-dark);
  }
</style>
```

## Component Style Best Practices

### 1. Scoped Styles

Astro components use scoped styles by default; no extra wrapper is needed.

**✅ Correct Example**:
```astro
---
---

<div class="my-component">
  Content
</div>

<style>
  .my-component {
    /* Styles apply only to this component */
    padding: 1rem;
  }
</style>
```

### 2. Global Styles (Use Sparingly)

Only use `:global()` when global impact is truly required.

**❌ Incorrect Example**:
```astro
---
<style>
  /* Affects all instances of .my-class */
  :global(.my-class) {
    background: white !important;
  }
</style>
```

**✅ Correct Example**:
```css
/* Define in global stylesheet */
.src/styles/global.css {
  .global-utility {
    /* Styles that truly need to be global */
    display: flex;
  }
}
```

### 3. Prefer CSS Variables

Prefer CSS variables over hardcoded values.

**❌ Incorrect Example**:
```css
.button {
  background-color: #3b82f6;
  padding: 8px 16px;
  border-radius: 4px;
}
```

**✅ Correct Example**:
```css
:root {
  --primary: #3b82f6;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --radius-md: 4px;
}

.button {
  background-color: var(--primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
}
```

### 4. Mixing Tailwind and Custom Styles

```astro
---
---

<!-- Tailwind handles layout and spacing -->
<div class="flex flex-col gap-4 p-6">
  <!-- Custom styles handle component-specific behavior -->
  <div class="custom-card">
    Content
  </div>
</div>

<style>
  .custom-card {
    /* Component-specific styles */
    background-color: var(--card-bg);
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
</style>
```

## Checklist

Before submitting code, ensure:

### CSS-Related
- [ ] No `!important` in regular business CSS files
- [ ] No `!important` in `<style>` tags (except Twikoo components)
- [ ] No `!` prefix in Tailwind classes (unless well justified)
- [ ] CSS variables are used instead of hardcoded values
- [ ] Scoped styles are used instead of global styles
- [ ] Style precedence is reasonable and easy to understand and maintain

### Twikoo Styles
- [ ] Twikoo-related styles exist only in `src/styles/twikoo.css`
- [ ] `!important` is used to override Twikoo default styles
- [ ] Necessary comments explain why overrides are needed

### Theme Styles
- [ ] CSS variables are used for theme switching
- [ ] Dark theme uses correct class names or variables
- [ ] No `!important` forcing theme style overrides

### Performance
- [ ] Unnecessary duplicate styles are avoided
- [ ] Tailwind utility classes are used instead of custom CSS
- [ ] Excessive selector nesting is avoided

## Alternative Priority Order

When you need to override styles, try these approaches in order:

### 1. Use Tailwind Utility Classes (Preferred)

```astro
---
<div class="bg-white p-4 rounded-lg shadow-md">
  Content
</div>
```

### 2. Increase Selector Specificity (Second Choice)

```css
.card-base.album-card {
  background-color: white;
}
```

### 3. Use CSS Variables (Third Choice)

```css
:root {
  --album-bg: white;
}

.album-card {
  background-color: var(--album-bg);
}
```

### 4. Use Scoped Styles (Fallback)

```css
/* Inside a component */
.my-component .element {
  background-color: white;
}
```

### 5. Use Global Styles (Special Case)

```css
/* In global stylesheet */
.src/styles/global.css {
  .special-case {
    background-color: white;
  }
}
```

### 6. Use `!important` (Last Resort)

**Allowed only in these cases**:
- Twikoo comment section styles
- Third-party library overrides approved by the team

## FAQ and Solutions

### Q1: What if styles don't apply?

**A**: Troubleshoot in this order:

1. **Check selector specificity**: Prefer more specific selectors
2. **Check style load order**: Later styles override earlier ones
3. **Check scope**: Confirm styles are in the correct scope
4. **Check CSS variables**: Confirm variables are defined correctly
5. **Check Tailwind configuration**: Confirm Tailwind is configured correctly

### Q2: How do I override Tailwind default styles?

**A**: Use Tailwind utility classes or custom styles, not `!important`.

```astro
---
<!-- ✅ Correct: Use Tailwind classes -->
<div class="text-lg font-semibold text-gray-900">
  Title
</div>

<!-- ❌ Incorrect: Use !important -->
<div class="!text-lg !font-semibold">
  Title
</div>
```

### Q3: What if third-party library styles conflict?

**A**: Handle in this priority order:

1. **Increase selector specificity**
2. **Use more specific selectors**
3. **Wrap components to isolate styles**
4. **Last resort**: Use `!important` (requires approval)

**Example**:
```css
/* Priority 1: Wrapper isolation */
.my-wrapper .external-library-element {
  color: var(--text-color);
}

/* Priority 2: More specific selector */
div.widget-container .external-library-element {
  color: var(--text-color);
}

/* Priority 3: Temporary solution (requires approval) */
.external-library-element {
  color: var(--text-color) !important; /* Requires approval, Issue #123 */
}
```

### Q4: What if styles flash during theme switching?

**A**: Use CSS variables and transitions instead of forcing a refresh with `!important`.

```css
:root {
  --bg-color: white;
  --text-color: black;
}

.dark {
  --bg-color: #1f2937;
  --text-color: #f3f4f6;
}

.card {
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

## Twikoo Stylesheet Guidelines

### File Location

```
src/styles/
├── global.css           # Global styles
├── theme.css            # Theme styles
├── components.css       # Component styles
└── twikoo.css          # Twikoo styles (allows !important)
```

### Twikoo Style Examples

```css
/* src/styles/twikoo.css */
/* Twikoo comment section styles - !important allowed */

/* Container styles */
.tk-admin {
  background-color: var(--card-bg) !important;
  border-radius: 8px !important;
}

/* Button styles */
.tk-btn {
  color: var(--primary) !important;
  background-color: transparent !important;
  transition: all 0.2s ease !important;
}

.tk-btn:hover {
  color: var(--primary-hover) !important;
  background-color: var(--primary-bg-light) !important;
}

/* Input styles */
.tk-input {
  background-color: var(--input-bg) !important;
  border-color: var(--border-color) !important;
  color: var(--text-color) !important;
}

/* Submit button */
.tk-submit-btn {
  background-color: var(--primary) !important;
  color: white !important;
  font-weight: 600 !important;
}

/* Loading state */
.tk-loading {
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
}

.tk-loading-spinner {
  border-color: var(--primary) transparent transparent transparent !important;
}

/* Content area */
.tk-content {
  color: var(--text-color) !important;
  font-size: 1rem !important;
  line-height: 1.6 !important;
}

/* Link styles */
.tk-content a {
  color: var(--primary) !important;
  text-decoration: none !important;
}

.tk-content a:hover {
  text-decoration: underline !important;
}

/* Other Twikoo-related styles... */
```

### Twikoo Style Best Practices

1. **Centralized management**: All Twikoo styles live in `twikoo.css`
2. **Add comments**: Document the reason for each style override
3. **Use CSS variables**: Prefer project-defined CSS variables
4. **Stay consistent**: Use the same design tokens as other components
5. **Keep updated**: Adjust styles when Twikoo is updated

## Performance Optimization

### Avoid Overuse

**❌ Incorrect Example**:
```css
/* Excessive use of !important */
.button {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 8px 16px !important;
  border: none !important;
  border-radius: 4px !important;
  background-color: #3b82f6 !important;
  color: white !important;
  font-size: 1rem !important;
  font-weight: 600 !important;
  transition: all 0.2s !important;
  cursor: pointer !important;
}
```

**✅ Correct Example**:
```astro
---
<!-- Use Tailwind utility classes -->
<button class="flex items-center justify-center px-4 py-2 border-0 rounded-lg bg-[var(--primary)] text-white font-medium transition-all duration-200 cursor-pointer">
  Button
</button>
```

### Use CSS Variables for Performance

```css
:root {
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
}

/* Reuse variables multiple times */
.card {
  padding: var(--spacing-md);
}

.button {
  padding: var(--spacing-sm) var(--spacing-md);
}

.header {
  margin-bottom: var(--spacing-lg);
}
```

## Summary

### Core Principles

1. **Avoid `!important`**: Except for Twikoo components and approved cases
2. **Prefer Tailwind**: Use utility classes instead of custom CSS
3. **Use CSS variables**: Improve style maintainability
4. **Increase selector specificity**: Instead of using `!important`
5. **Use scoped styles**: Avoid global pollution
6. **Stay consistent**: Use unified design tokens

### Checklist

- [ ] No `!important` (except Twikoo)
- [ ] Tailwind utility classes are used
- [ ] CSS variables are used
- [ ] Style precedence is reasonable
- [ ] Theme styles are correct
- [ ] No excessive nesting

---

**Last Updated**: 2026-03-17
**Maintainers**: Mizuki Development Team

## References

- [Component Architecture Guidelines](./01-component-architecture.md)
- [File Organization Architecture Guidelines](./03-file-organization-architecture.md)
- [Aruma CSS Guidelines](../../demo/Aruma/docs/rule/02-no-important-css.md)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Specificity Calculator](https://specificity.keegan.st/)
