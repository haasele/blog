# Mizuki Content Repository Structure

This document explains how to create and organize a Mizuki blog content repository.

## 📁 Recommended Directory Structure

```
Mizuki-Content/
├── posts/              # Blog posts
│   ├── post-1.md
│   ├── post-2.md
│   └── my-article/
│       ├── index.md
│       └── cover.jpg
├── spec/               # Special pages
│   ├── about.md
│   └── friends.md
├── data/               # Data files
│   ├── anime.ts
│   ├── projects.ts
│   ├── skills.ts
│   └── timeline.ts
├── images/             # Image assets
│   ├── albums/         # Album images
│   ├── diary/          # Diary images
│   └── posts/          # Post images
└── README.md
```

## 🚀 Quick Start

### 1. Create a New Content Repository

```bash
# Create new repository
mkdir Mizuki-Content
cd Mizuki-Content
git init

# Create basic directory structure
mkdir -p posts spec data images/albums images/diary images/posts

# Create README
echo "# Mizuki Blog Content" > README.md
```

### 2. Migrate Content from an Existing Mizuki Project

If you already have a Mizuki project, migrate content to the new repository:

```bash
# Run from Mizuki project root
cd /path/to/Mizuki

# Copy content to new repository
cp -r src/content/posts/* /path/to/Mizuki-Content/posts/
cp -r src/content/spec/* /path/to/Mizuki-Content/spec/
cp -r src/data/* /path/to/Mizuki-Content/data/
cp -r public/images/* /path/to/Mizuki-Content/images/
```

### 3. Commit to Git

```bash
cd /path/to/Mizuki-Content

git add .
git commit -m "Initial commit: Add blog content"

# Add remote and push
git remote add origin https://github.com/your-username/Mizuki-Content.git
git branch -M main
git push -u origin main
```

## 🔗 Connect to the Mizuki Code Repository

### Option 1: Git Submodule (Recommended)

In the Mizuki code repository:

```bash
cd /path/to/Mizuki

# Add content repository as submodule
git submodule add https://github.com/your-username/Mizuki-Content.git content

# Commit submodule configuration
git add .gitmodules content
git commit -m "Add content repository as submodule"
git push
```

Configure `.env`:

```bash
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
```

### Option 2: Standalone Repository Mode

Configure `.env`:

```bash
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
CONTENT_DIR=./content
USE_SUBMODULE=false
```

Then run sync:

```bash
pnpm run sync-content
```

## 📝 Content Writing Guide

### Post Frontmatter

Every post should include:

```yaml
---
title: Post Title
published: 2024-01-01
description: Post description
image: ./cover.jpg
tags: [tag1, tag2]
category: Category
draft: false
pinned: false
lang: en
---
```

### Directory Organization

- **Single-file posts**: Create `.md` files directly under `posts/`
- **Posts with images**: Create a folder with `index.md` and images together

Example:
```
posts/
├── simple-post.md                    # Simple post
└── complex-post/                     # Post with assets
    ├── index.md                      # Post content
    ├── cover.jpg                     # Cover image
    └── diagram.png                   # Inline image
```

## 🔄 Update Workflow

### Local Development

1. Edit files in the content repository
2. Commit and push changes
3. Sync in the code repository:
   ```bash
   cd /path/to/Mizuki
   pnpm run sync-content
   ```

### Using Submodule

```bash
# Update submodule
cd /path/to/Mizuki
git submodule update --remote --merge

# Or use sync script
pnpm run sync-content
```

### Auto-Sync on Deploy

Add to CI/CD configuration:

```yaml
- name: Sync Content
  run: pnpm run sync-content
  env:
    CONTENT_REPO_URL: ${{ secrets.CONTENT_REPO_URL }}
    USE_SUBMODULE: true
```

## 📦 Data File Reference

### anime.ts
Anime tracking data — list of shows you watch.

### projects.ts
Project showcase data.

### skills.ts
Skills / tech stack data.

### timeline.ts
Timeline of important events.

## 🎨 Image Management

### Directories

- `images/albums/`: Album page images
- `images/diary/`: Diary page images  
- `images/posts/`: Shared images referenced in posts

### Image References in Posts

```markdown
<!-- Relative path (recommended) -->
![Description](./image.jpg)

<!-- Public images directory -->
![Description](/images/posts/image.jpg)
```

## ⚠️ Notes

1. **Do not** include code files in the content repository
2. **Keep** directory structure aligned with the main repository
3. **Back up** important content regularly
4. **Use** Git LFS for large images (optional)

## 🔐 Private Content Repository

For private content repositories, configure access permissions. See:

- [Content Separation Guide - Private Repository](./CONTENT_SEPARATION.md#-private-repository-configuration)
- [Deployment Guide](./DEPLOYMENT.md) — private repo deployment per platform

### Quick Reference

**Local development**: SSH keys recommended
```bash
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
USE_SUBMODULE=true
```

**CI/CD deployment**: Platform-specific
- GitHub Actions: `GITHUB_TOKEN` (same account) or SSH key
- Vercel/Netlify: Authorize access or use a token

## 📚 References

- [Git Submodule Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Mizuki Documentation](https://docs.mizuki.mysqil.com/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)

---

💡 **Tip**: Test content sync locally before configuring automated deployment.
