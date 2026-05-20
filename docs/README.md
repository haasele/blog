# Mizuki Documentation Index

Welcome to the Mizuki documentation!

## 📚 Documentation List

### Core Documentation

- **[../README.md](../README.md)** - Main project documentation
  - Quick start
  - Features
  - Basic configuration
  - FAQ

### Content Separation

- **[CONTENT_SEPARATION.md](./CONTENT_SEPARATION.md)** - Complete content separation guide ⭐
  - ENABLE_CONTENT_SYNC toggle
  - Environment variable configuration
  - Private repository setup
  - Mode switching guide
  - Troubleshooting

- **[CONTENT_REPOSITORY.md](./CONTENT_REPOSITORY.md)** - Content repository structure guide
  - Recommended directory structure
  - File organization
  - Content writing conventions
  - Image management tips

- **[MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md)** - Content migration guide
  - Migrating from single repo to separation mode
  - Detailed migration steps
  - Testing and verification

### Deployment

- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Complete deployment guide ⭐
  - Platform deployment (GitHub Pages / Vercel / Netlify / Cloudflare Pages)
  - Auto-build triggers when content repo updates
  - Private repository authentication
  - Troubleshooting

- **[AUTO_BUILD_TRIGGER.md](./AUTO_BUILD_TRIGGER.md)** - Auto-build trigger quick reference 🆕
  - 5-step quick setup to fix content updates not triggering deployment

## 🚀 Quick Lookup

### I'm new and want to get started quickly
→ Read the [main README](../README.md)

### I want to deploy my blog
→ Read the [deployment guide](./DEPLOYMENT.md)

### I want to use content separation
→ Read the [content separation guide](./CONTENT_SEPARATION.md)

### I want to migrate from single repo to separation mode
→ Read the [migration guide](./MIGRATION_GUIDE.md)

### I want to configure a private content repository
→ Read [content separation guide - private repository setup](./CONTENT_SEPARATION.md#-private-repository-configuration)

### I'm having deployment issues
→ Read [deployment guide - troubleshooting](./DEPLOYMENT.md#-troubleshooting)

### I'm getting content sync errors
→ Read [content separation guide - troubleshooting](./CONTENT_SEPARATION.md#-troubleshooting)

### Content repo updates don't trigger site redeployment 🆕
→ Read [auto-build trigger quick reference](./AUTO_BUILD_TRIGGER.md)

## 📖 Documentation Structure

```
docs/
├── README.md                    # This file - index and navigation
├── CONTENT_SEPARATION.md        # Content separation core guide
├── CONTENT_REPOSITORY.md        # Content repository structure
├── MIGRATION_GUIDE.md           # Migration guide
├── DEPLOYMENT.md                # Complete deployment guide
├── AUTO_BUILD_TRIGGER.md        # Auto-build trigger quick reference
└── image/                       # Documentation images
```

## 🎯 Recommended Reading Order

### New Users

1. [Main README](../README.md) - Learn the basics
2. [Deployment guide](./DEPLOYMENT.md) - Choose a platform and deploy
3. (Optional) [Content separation guide](./CONTENT_SEPARATION.md) - Advanced feature

### Advanced Users

- Go directly to the topic you need
- Use quick lookup to find solutions

## 🤝 Need Help?

- Check [GitHub Issues](https://github.com/LyraVoid/Mizuki/issues)
- Read troubleshooting sections in the relevant docs
- Run `pnpm run check-env` to verify configuration

Happy blogging! 🎉
