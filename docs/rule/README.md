# Mizuki Development Guidelines

This directory contains Mizuki development guidelines for component development and code refactoring.

## Guideline Index

### 1. [Component Architecture](./01-component-architecture.md)

**Description**: Defines Mizuki's component layering, naming conventions, and code organization.

**Key points**:
- Component layers (atoms/molecules/organisms)
- File naming and organization
- Single-responsibility principle
- Component reuse patterns

### 2. [Component Split Guide](./02-component-split-guide.md)

**Description**: How to identify components that need splitting, and splitting methods and best practices.

**Key points**:
- Criteria for splitting components
- Large component split examples
- Split steps and verification
- Common split mistakes to avoid

### 3. [File Organization Architecture](./03-file-organization-architecture.md)

**Description**: Project file organization: directory structure, naming, and modularity.

**Key points**:
- Complete directory tree
- Directory responsibilities
- File naming conventions
- Modular organization
- Dependency management

### 4. [CSS Style Guide](./04-css-style-guide.md)

**Description**: CSS conventions; avoid `!important` (Twikoo excepted).

**Key points**:
- Avoid `!important` (except Twikoo)
- CSS variables and Tailwind utilities
- Higher selector specificity instead of `!important`
- Twikoo stylesheet conventions
- Dark theme implementation

### 5. [Atom Component Usage](./05-atom-component-usage.md)

**Description**: Prefer existing atom components; create new ones when none fit.

**Key points**:
- Prefer existing `atoms/` and `misc/` components
- Extract component when UI repeats 2+ times
- When to create new components
- Component layering
- Common scenarios and decision flow

### 6. [Sidebar Widget Development](./06-sidebar-widget-dev.md)

**Description**: Sidebar widget integration to avoid "configured but not visible" issues.

**Key points**:
- 3 required steps for sidebar widgets
- Declare type in `WidgetComponentType`
- Configure layout in `sidebarLayoutConfig`
- **Register in all sidebar renderer `componentMap`s** (easy to miss)
- Troubleshooting

## Code Review Checklist

Before submitting code, ensure:

- [ ] Components follow layering (atoms/molecules/organisms)
- [ ] File names use PascalCase
- [ ] Component size is reasonable (< 500 lines)
- [ ] Complex components split into subcomponents
- [ ] **Existing atom components used first (`atoms/`, `misc/`)**
- [ ] **Repeated UI (2+ times) extracted into components**
- [ ] Shared components and hooks used; no duplication
- [ ] Single, clear component responsibility
- [ ] Styles use atoms or unified style system
- [ ] TypeScript Props interfaces defined
- [ ] Formatting passes (`pnpm run format`)
- [ ] Lint passes (`pnpm run lint`)
- [ ] No `!important` (Twikoo excepted)
- [ ] Tailwind utilities or CSS variables used
- [ ] Dark theme via CSS variables
- [ ] **Sidebar widgets registered in all relevant `componentMap`s**
- [ ] **Sidebar type declared in `WidgetComponentType`**
- [ ] **Sidebar configured in `sidebarLayoutConfig.components`**

## References

- [Aruma Component Architecture](../../demo/Aruma/docs/rule/05-component-architecture.md)
- [Astro Component Best Practices](https://docs.astro.build/en/core-concepts/astro-components/)
- [Component-Driven Development](https://componentdriven.org/)

## Related Documentation

- [../README.md](../README.md) - Documentation index
- [../DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [../CONTENT_SEPARATION.md](../CONTENT_SEPARATION.md) - Content separation guide

---

**Last updated**: 2026-03-21  
**Maintainer**: Mizuki development team
