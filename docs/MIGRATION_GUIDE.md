# Mizuki Content Migration Guide

This guide helps you migrate an existing Mizuki blog from single-repository mode to code/content separation.

> 💡 **Tip**: For new projects, read the [Content Separation Guide](./CONTENT_SEPARATION.md) first.

## 📋 Pre-Migration Checklist

- [ ] **Back up the entire project** (important!)
- [ ] Ensure all changes are committed to Git
- [ ] Decide which mode to use (Submodule recommended)
- [ ] Create a new content repository on GitHub/GitLab

## 🚀 Migration Steps

### Step 1: Create Content Repository

```bash
# Create and enter new directory
mkdir Mizuki-Content
cd Mizuki-Content

# Initialize Git
git init

# Create directory structure
mkdir -p posts spec data images/albums images/diary images/posts

# Create README
cat > README.md << 'EOF'
# Mizuki Blog Content

This repository holds all Mizuki blog content: posts, data, and images.

## Directory Structure

- `posts/` - Blog posts
- `spec/` - Special pages (about, friends, etc.)
- `data/` - Data files (anime, projects, skills, timeline)
- `images/` - Image assets

## Usage

This repository is linked to the Mizuki code repository via Git Submodule or standalone mode.

See: https://github.com/matsuzaka-yuki/Mizuki
EOF
```

### Step 2: Copy Content from Mizuki Project

```bash
# Set path variables
MIZUKI_PATH="/path/to/your/Mizuki"
CONTENT_PATH="/path/to/Mizuki-Content"

# Copy posts
cp -r "$MIZUKI_PATH/src/content/posts/"* "$CONTENT_PATH/posts/"

# Copy special pages
cp -r "$MIZUKI_PATH/src/content/spec/"* "$CONTENT_PATH/spec/"

# Copy data files
cp "$MIZUKI_PATH/src/data/anime.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "anime.ts not found"
cp "$MIZUKI_PATH/src/data/projects.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "projects.ts not found"
cp "$MIZUKI_PATH/src/data/skills.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "skills.ts not found"
cp "$MIZUKI_PATH/src/data/timeline.ts" "$CONTENT_PATH/data/" 2>/dev/null || echo "timeline.ts not found"

# Copy images
cp -r "$MIZUKI_PATH/public/images/albums/"* "$CONTENT_PATH/images/albums/" 2>/dev/null || echo "albums not found"
cp -r "$MIZUKI_PATH/public/images/diary/"* "$CONTENT_PATH/images/diary/" 2>/dev/null || echo "diary not found"

echo "✅ Content copy complete!"
```

### Step 3: Commit Content Repository

```bash
cd "$CONTENT_PATH"

git add .
git commit -m "Initial commit: Migrate content from Mizuki monorepo"

# Add remote (replace with your repository URL)
git remote add origin https://github.com/your-username/Mizuki-Content.git

git branch -M master
git push -u origin master

echo "✅ Content repository pushed!"
```

### Step 4: Configure Mizuki Code Repository

```bash
cd "$MIZUKI_PATH"

cp .env.example .env

cat > .env << 'EOF'
# Enable content separation
ENABLE_CONTENT_SYNC=true

# Content repository configuration
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
EOF

pnpm run sync-content

git add .env.example
git commit -m "Enable content separation"
git push
```

> 📖 See [Content Separation Guide](./CONTENT_SEPARATION.md) for more configuration options.

### Step 5: Clean Up Original Repository (Optional)

⚠️ **Warning**: Only after confirming migration succeeded!

```bash
cd "$MIZUKI_PATH"

# Backup original content
mkdir -p ../mizuki-content-backup
cp -r src/content/posts ../mizuki-content-backup/
cp -r src/content/spec ../mizuki-content-backup/
cp -r src/data ../mizuki-content-backup/
cp -r public/images ../mizuki-content-backup/

# Remove migrated content (keep directory structure)
rm -rf src/content/posts/*
rm -rf src/content/spec/*
rm -f src/data/anime.ts src/data/projects.ts src/data/skills.ts src/data/timeline.ts
rm -rf public/images/albums/* public/images/diary/*

touch src/content/posts/.gitkeep
touch src/content/spec/.gitkeep
touch public/images/albums/.gitkeep
touch public/images/diary/.gitkeep

git add .
git commit -m "Remove migrated content (now in separate repository)"
git push
```

## 🧪 Test Migration

### Local Test

```bash
cd "$MIZUKI_PATH"

pnpm run sync-content
pnpm dev

# Visit http://localhost:4321 and verify:
# - Posts display correctly
# - Images load
# - Special pages work
# - Data pages work (anime, projects, etc.)
```

### Build Test

```bash
pnpm build
pnpm preview
# Verify all features
```

## 🔄 Daily Workflow

### Update Content

```bash
# 1. Edit in content repository
cd "$CONTENT_PATH"
# Edit files...
git add .
git commit -m "Update content"
git push

# 2. Sync in code repository
cd "$MIZUKI_PATH"
pnpm run sync-content
```

### Using Submodule

```bash
cd "$MIZUKI_PATH"

git submodule update --remote --merge
# Or (recommended)
pnpm run sync-content

git add content
git commit -m "Update content submodule"
git push
```

## 🚀 Deployment Configuration

After migration, configure environment variables on your deployment platform:

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
USE_SUBMODULE=true
```

For detailed deployment (private repos, GitHub Actions, Vercel, etc.), see [Content Separation Guide - CI/CD](./CONTENT_SEPARATION.md#-cicd-deployment).

## ⚠️ FAQ

### Q: Sync script fails?

Check:
1. Network connectivity
2. Git credentials
3. `ENABLE_CONTENT_SYNC=true` is set
4. `CONTENT_REPO_URL` is correct
5. Sufficient disk space

Run `pnpm run check-env` to verify configuration.

### Q: Symlinks don't work on Windows?

Run as administrator, or the script falls back to copy mode.

### Q: How do I roll back to single-repo mode?

Set `ENABLE_CONTENT_SYNC=false` in `.env`, then copy content back from backup or the content repository.

### Q: Private repository authentication issues?

See [Content Separation Guide - Private Repository](./CONTENT_SEPARATION.md#-private-repository-configuration).

## 📚 References

- [Content Separation Guide](./CONTENT_SEPARATION.md)
- [Content Repository Structure](./CONTENT_REPOSITORY.md)
- [Git Submodule Documentation](https://git-scm.com/book/en/v2/Git-Tools-Submodules)

---

💡 **Tip**: Validate the full workflow in a test environment before production migration!
