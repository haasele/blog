# Mizuki Content Separation Guide

This guide explains how to use content separation in Mizuki: basic setup, private repositories, CI/CD deployment, and more.

## 📖 Table of Contents

- [Quick Start](#-quick-start)
- [ENABLE_CONTENT_SYNC Toggle](#-enable_content_sync-toggle)
- [Configuration](#-configuration)
- [Private Repository](#-private-repository-configuration)
- [CI/CD Deployment](#-cicd-deployment)
- [Common Commands](#-common-commands)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Recommended for Beginners: Local Mode (Simplest)

**No configuration required** — start immediately:

```bash
# Clone the project
git clone https://github.com/LyraVoid/Mizuki.git
cd Mizuki

# Install dependencies
pnpm install

# Start development
pnpm dev
```

Content lives in `src/content/` and `public/images/` alongside code.

### Advanced: Enable Content Separation

To manage content independently (team collaboration, private content, separate version control):

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env to enable content separation
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# 3. Sync content
pnpm run sync-content

# 4. Start development
pnpm dev
```

---

## 🎛️ ENABLE_CONTENT_SYNC Toggle

### Overview

`ENABLE_CONTENT_SYNC` is a single switch that controls content separation.

| Value | Description | Use Case |
|---|---|---|
| `false` or unset | **Disable separation** (default) | Beginners, personal blogs, small sites |
| `true` | **Enable separation** | Teams, private content, many posts |

### Configuration Location

In `.env` at the project root:

```bash
# Disable separation (use local content)
ENABLE_CONTENT_SYNC=false

# Or enable separation (sync from remote)
ENABLE_CONTENT_SYNC=true
```

### Mode Comparison

#### Scenario 1: Local Mode (Recommended for Beginners)

**Characteristics**:
- ✅ No extra configuration
- ✅ Content and code in one repo
- ✅ Good for personal blogs and small projects

**Configuration**:
```bash
# .env (or omit .env entirely)
ENABLE_CONTENT_SYNC=false
```

**Workflow**:
```bash
# Edit posts under src/content/
pnpm dev

# Commit code and content together
git add .
git commit -m "Update content"
git push
```

#### Scenario 2: Separate Repository Mode

**Characteristics**:
- ✅ Content in its own repository
- ✅ Private content repository support
- ✅ Easier team collaboration
- ✅ Independent content versioning

**Configuration**:
```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

**Workflow**:
```bash
# Auto-sync before dev
pnpm dev

# Edit content in the separate repository
cd /path/to/Mizuki-Content
# Edit posts...
git add .
git commit -m "Update article"
git push
```

### Switching Modes

#### Local → Separate Repository

1. Create a content repository (see [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md))
2. Edit `.env`:
   ```bash
   ENABLE_CONTENT_SYNC=true
   CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
   ```
3. Sync: `pnpm run sync-content`

#### Separate Repository → Local

1. Edit `.env`:
   ```bash
   ENABLE_CONTENT_SYNC=false
   ```
2. Develop: `pnpm dev`

---

## ⚙️ Configuration

### Environment Variables

Configure in `.env`:

```bash
# ============================================
# Feature toggle
# ============================================

# Enable content separation
# false = local content (recommended for beginners)
# true = sync from remote repository
ENABLE_CONTENT_SYNC=false

# ============================================
# Content repository (required when ENABLE_CONTENT_SYNC=true)
# ============================================

# Content repository URL
# HTTPS or SSH
# Public: https://github.com/username/repo.git
# Private (SSH): git@github.com:username/repo.git
# Private (Token): https://TOKEN@github.com/username/repo.git
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git

# Content directory (default ./content — usually unchanged)
CONTENT_DIR=./content
```

### Examples

#### Example 1: Fully Local (Simplest)

```bash
# .env
ENABLE_CONTENT_SYNC=false
```

Or **omit `.env`** and use local content.

#### Example 2: Public Repository (HTTPS)

```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

#### Example 3: Private Repository (SSH)

```bash
# .env
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
```

---

## 🔄 Auto-Build Trigger (On Content Updates)

### Problem

With content separation, only code repository updates trigger deployment by default; content repository updates **do not**.

### Solution

**Repository Dispatch** is recommended — 5-step setup, works on all platforms.

See:
- **[Auto-Build Trigger Quick Reference](./AUTO_BUILD_TRIGGER.md)** ⭐
- **[Deployment Guide - Full Details](./DEPLOYMENT.md#content-repository-update-triggers-build)**
- **[Content Repository Workflow Guide](../Mizuki-Content/.github/workflows/README.md)**

---

## 🔐 Private Repository Configuration

Private content repositories are fully supported. SSH is recommended.

### Option A: SSH Keys (Recommended)

#### 1. Generate SSH Key

```bash
# Ed25519 recommended
ssh-keygen -t ed25519 -C "your_email@example.com"

# Or RSA
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

Default location: `~/.ssh/id_ed25519`.

#### 2. Add Public Key to Git Host

```bash
cat ~/.ssh/id_ed25519.pub

# Windows PowerShell
Get-Content ~/.ssh/id_ed25519.pub
```

**GitHub**: Settings → SSH and GPG keys → New SSH key  
**GitLab**: Preferences → SSH Keys → Add new key  
**Gitee**: Settings → SSH public keys → Add key

#### 3. Configure Mizuki

Use SSH URL in `.env`:

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=git@github.com:your-username/Mizuki-Content-Private.git
```

#### 4. Test Connection

```bash
ssh -T git@github.com
ssh -T git@gitlab.com
pnpm run sync-content
```

### Option B: HTTPS + Personal Access Token

#### 1. Generate Token

**GitHub**: Settings → Developer settings → Personal access tokens → Generate new token — scope: `repo`  
**GitLab**: Preferences → Access Tokens — scope: `read_repository`  
**Gitee**: Settings → Private tokens — scope: `projects` (read)

#### 2. Configure .env

```bash
ENABLE_CONTENT_SYNC=true
CONTENT_REPO_URL=https://YOUR_TOKEN@github.com/your-username/Mizuki-Content-Private.git
```

⚠️ **Security**:
- **Do not commit `.env` to Git!** (listed in `.gitignore`)
- Keep tokens secure; they grant repository access

---

## 🌐 CI/CD Deployment

### Quick Setup

All platforms use the same sync mechanism:
- ✅ `prebuild` runs before `pnpm build`
- ✅ Sync runs when `ENABLE_CONTENT_SYNC=true`
- ✅ Sync failure does not abort build; falls back to local content

**Configure environment variables only — no build command changes!**

### Environment Variables

| Variable | Value | Description |
|-------|---|------|
| `ENABLE_CONTENT_SYNC` | `true` | Enable content separation |
| `CONTENT_REPO_URL` | Repository URL | Content repository URL |

### Supported Platforms

- ✅ **GitHub Pages** — GitHub Actions
- ✅ **Vercel** — environment variables
- ✅ **Netlify** — environment variables
- ✅ **Cloudflare Pages** — environment variables

### Detailed Guides

See **[Deployment Guide](./DEPLOYMENT.md)** for:
- GitHub Pages auto-deploy
- Vercel, Netlify, Cloudflare Pages
- Private repository authentication
- Troubleshooting

---

## 📋 Common Commands

| Command | Description |
|------|------|
| `pnpm run init-content` | Interactive initialization wizard |
| `pnpm run sync-content` | Manually sync content repository |
| `pnpm run check-env` | Verify environment configuration |
| `pnpm dev` | Start dev server (auto-sync) |
| `pnpm build` | Build project (auto-sync) |

### Auto-Sync Timing

When `ENABLE_CONTENT_SYNC=true`, these commands sync automatically:

- `pnpm dev` — before development
- `pnpm build` — before build

Sync failure shows a warning and continues.

---

## 🔍 Troubleshooting

### Issue 1: "Content separation not enabled"

**Cause**: `ENABLE_CONTENT_SYNC` unset or `false`.

**Fix**:
```bash
cat .env
# Ensure:
ENABLE_CONTENT_SYNC=true
```

### Issue 2: "CONTENT_REPO_URL not set"

**Cause**: Separation enabled but no repository URL.

**Fix**:
```bash
CONTENT_REPO_URL=https://github.com/your-username/Mizuki-Content.git
```

### Issue 3: Private repository authentication failed

**SSH**:
```bash
ssh -T git@github.com
# Expected: Hi username! You've successfully authenticated...
```

If it fails, check SSH key, public key on GitHub, and `ssh-add -l`.

**HTTPS + Token**: Verify token, `repo` scope, and URL format `https://TOKEN@github.com/user/repo.git`.

### Issue 4: .env not applied

1. File at project root: `ls -la .env`
2. Format: `ENABLE_CONTENT_SYNC=true` (no spaces around `=`)
3. Permissions: `chmod 644 .env`
4. Run `pnpm run check-env`

### Issue 5: Content sync failed

```bash
pnpm run sync-content
ls -la content/
git clone https://github.com/your-username/Mizuki-Content.git content
```

### Issue 6: Content not synced on deploy

**Vercel/Netlify**: Verify env vars, build logs, token validity.  
**GitHub Actions**: Check workflow, Actions logs, Secrets.

---

## 💡 Best Practices

### Beginners

1. **Start with local mode** — no extra setup
2. **Separate when content stabilizes**
3. **Prefer SSH** over tokens for local dev

### Advanced

1. **Standalone repository mode** for clear versioning
2. **CI on content repo** — format checks, image optimization
3. **Branch strategy** — `main` for production, `develop` for preview

### Teams

1. **Shared env configuration**
2. **Private content repo** with access control
3. **Git hooks** — pre-commit checks for format and image size

---

## 📚 Related Documentation

- [Migration Guide](./MIGRATION_GUIDE.md)
- [Content Repository Structure](./CONTENT_REPOSITORY.md)
- [Main README](../README.md)

---

## 🤝 Need Help?

- [GitHub Issues](https://github.com/LyraVoid/Mizuki/issues)
- [Full documentation](../README.md)
- Run `pnpm run check-env`

Happy blogging! 🎉
