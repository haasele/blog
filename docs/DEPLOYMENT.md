# Mizuki Deployment Guide

Deployment configuration for Mizuki on various platforms.

## Table of Contents

- [Pre-Deployment](#-pre-deployment)
- [GitHub Pages](#-github-pages)
- [Vercel](#-vercel)
- [Netlify](#-netlify)
- [Cloudflare Pages](#-cloudflare-pages)
- [Troubleshooting](#-troubleshooting)

---

## Pre-Deployment

### Basic Configuration

1. **Update site URL**

Edit `astro.config.mjs`:
```javascript
export default defineConfig({
  site: 'https://your-domain.com',  // Your domain
  // ...
});
```

2. **Environment variables** (optional)

For content separation:
- `ENABLE_CONTENT_SYNC=true`
- `CONTENT_REPO_URL=<your content repo URL>`
- `USE_SUBMODULE=true`

See [Content Separation Guide](./CONTENT_SEPARATION.md).

---

## GitHub Pages

### Automatic Deployment (Recommended)

GitHub Actions deploys on push to `main`.

#### Local Mode (Default)

**No configuration required**:

1. Push code to GitHub
2. Enable GitHub Pages in repository settings (Settings > Pages, branch `pages` / `root`)
3. Wait for Actions to finish

#### Content Separation Mode

**Setup**:

1. **Add repository Secrets**: `CONTENT_REPO_URL` = `https://github.com/your-username/Mizuki-Content.git`
2. **Edit `.github/workflows/deploy.yml`** — uncomment:
```yaml
- name: Build site
  run: pnpm run build
  env:
    ENABLE_CONTENT_SYNC: true
    CONTENT_REPO_URL: ${{ secrets.CONTENT_REPO_URL }}
    USE_SUBMODULE: true
```

3. **Private content repository**:
- Same account: uses `GITHUB_TOKEN` automatically
- Cross-account SSH: add `SSH_PRIVATE_KEY` secret and checkout with submodules
- Cross-account Token: use `PAT_TOKEN` in checkout and `CONTENT_REPO_URL`

### Workflows

| Workflow | Trigger | Purpose |
|--------|---------|------|
| `build.yml` | Push/PR to main | CI build check |
| `deploy.yml` | Push to main | Build and deploy to pages branch |
| `format.yml` | Push/PR | Format and quality checks |

---

## Vercel

1. Connect repository at [Vercel](https://vercel.com)
2. Framework: Astro, build: `pnpm build`, output: `dist`
3. **Content separation env vars**:

| Variable | Value |
|-------|---|
| `ENABLE_CONTENT_SYNC` | `true` |
| `CONTENT_REPO_URL` | Your content repo URL |
| `USE_SUBMODULE` | `false` (recommended on Vercel) |

> With `USE_SUBMODULE=true`, comment out `content/` in `.gitignore`.

Private repos: authorize Vercel or use token in `CONTENT_REPO_URL`.

---

## Netlify

1. Connect at [Netlify](https://www.netlify.com)
2. Build: `pnpm build`, publish: `dist`
3. Add content separation env vars (same as Vercel)
4. Private repo: add deploy key with repo access

Optional `netlify.toml` with `ENABLE_CONTENT_SYNC`, `CONTENT_REPO_URL`, `USE_SUBMODULE`.

---

## Cloudflare Pages

1. Connect Git in Cloudflare Dashboard
2. Build: `pnpm build`, output: `dist`
3. Env vars with `USE_SUBMODULE=false` (submodules not supported by default)

Or build command: `git submodule update --init && pnpm build`

---

## Auto-Sync Mechanism

```json
{
  "scripts": {
    "prebuild": "node scripts/sync-content.js || true"
  }
}
```

`prebuild` syncs when `ENABLE_CONTENT_SYNC=true`; failures fall back to local content.

---

## Troubleshooting

### "CONTENT_REPO_URL not set"
Enable separation only with `CONTENT_REPO_URL` set, or disable with `ENABLE_CONTENT_SYNC=false`.

### Private repo auth failed
Use SSH, PAT, or platform authorization.

### Submodule vs .gitignore
Comment out `content/` in `.gitignore`, or use `USE_SUBMODULE=false`. v1.1+ auto-fallback in `sync-content.js`.

### Build OK but stale content
Check sync in logs, env vars, clear cache.

### Vercel: `could not read Username for 'https://github.com'`
Add GitHub permissions, token URL, or standalone mode.

---

## Environment Variables Reference

| Variable | Required | Default | Description |
|-------|------|--------|------|
| `ENABLE_CONTENT_SYNC` | No | `false` | Enable content separation |
| `CONTENT_REPO_URL` | Conditional | - | Content repo URL |
| `USE_SUBMODULE` | No | `false` | Git Submodule mode |
| `CONTENT_DIR` | No | `./content` | Content directory |
| `INDEXNOW_KEY` | No | - | IndexNow API key |
| `INDEXNOW_HOST` | No | - | IndexNow host |
| `BILI_SESSDATA` | No | - | Bilibili watch progress |

---

## Recommended Setups

- **Personal blog**: Vercel/GitHub Pages, local mode, no env vars
- **Team**: Any platform, private content repo, SSH
- **Multi-site**: Public content repo, unified env vars

---

## Related Documentation

- [Content Separation Guide](./CONTENT_SEPARATION.md)
- [Migration Guide](./MIGRATION_GUIDE.md)
- [Content Repository Structure](./CONTENT_REPOSITORY.md)

---

## Content Repository Update Triggers Build

With separation, content repo updates do not trigger deploys by default.

| Approach | Platforms |
|------|----------|
| Repository Dispatch | All (recommended) |
| Webhook + Deploy Hook | Vercel, Netlify, CF Pages |
| Scheduled build | All (fallback) |

**Quick setup**: [AUTO_BUILD_TRIGGER.md](./AUTO_BUILD_TRIGGER.md)

### Repository Dispatch (Summary)

1. Create PAT with `repo` scope
2. Add `DISPATCH_TOKEN` to content repo
3. Content repo workflow: `peter-evans/repository-dispatch@v2` on push to `posts/**`, etc.
4. Code repo `deploy.yml`: add `repository_dispatch` type `content-updated`
5. Test push from content repo

### Recommended `on:` block

```yaml
on:
  push:
    branches: [main]
  repository_dispatch:
    types: [content-updated]
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:
```

See full webhook and scheduled build details in the original workflow examples in `.github/workflows/`.
