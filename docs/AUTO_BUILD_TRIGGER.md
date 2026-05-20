# Auto-Build Trigger on Content Repo Updates - Quick Reference

## 🎯 Problem

After enabling content separation, content repository (Mizuki-Content) updates do not automatically trigger redeployment of the code repository (Mizuki).

## ✅ Solution (Recommended)

Use **Repository Dispatch** to automatically trigger builds when content updates — works on all deployment platforms.

---

## 📝 5-Step Quick Setup

### Step 1: Create a GitHub Token

Visit: https://github.com/settings/tokens

- Click **Generate new token (classic)**
- Note: `Mizuki Content Trigger`
- Scopes: check ✅ `repo`
- Generate and **copy the token** ⚠️ (shown only once)

### Step 2: Add Secret

In the **content repository** (Mizuki-Content):

Settings → Secrets and variables → Actions → New repository secret

- Name: `DISPATCH_TOKEN`
- Secret: paste the token from Step 1

### Step 3: Update Trigger Configuration

Edit `.github/workflows/trigger-build.yml` in the content repository.

Find line 27 and set your code repository:

```yaml
repository: your-username/Mizuki  # Change to yours
```

Example: `matsuzaka-yuki/Mizuki`

### Step 4: Update Code Repository Workflow

Edit `.github/workflows/deploy.yml` in the **code repository**.

Add under `on:`:

```yaml
on:
  push:
    branches:
      - main
  repository_dispatch:  # 👈 Add this
    types:
      - content-updated
  workflow_dispatch:
```

### Step 5: Test

Push once from the content repository:

```bash
git add .
git commit -m "test: trigger build"
git push
```

Verify:
1. Content repo Actions — confirm trigger workflow ran
2. Code repo Actions — confirm deployment was triggered

---

## 🔍 Troubleshooting

### Token Issues

**Error**: `Bad credentials`

**Fix**:
- Confirm the token was copied completely
- Confirm the token has `repo` scope
- Regenerate the token

### Repository Name Issues

**Error**: `Not Found`

**Fix**:
- Confirm format: `owner/repo` (slash-separated)
- Confirm spelling
- Example: `matsuzaka-yuki/Mizuki`

### Code Repository Not Triggered

**Check**:
- [ ] `.github/workflows/deploy.yml` includes `repository_dispatch`
- [ ] Event type is `content-updated`
- [ ] Actions are enabled on the code repository

---

## 📚 Detailed Documentation

Need more options? See:
- [Deployment guide - full details](./DEPLOYMENT.md#content-repository-update-triggers-build) - Webhook, scheduled builds, and other approaches
- [Content repository workflow guide](../Mizuki-Content/.github/workflows/README.md) - Workflow details

---

## 💡 Tips

After setup:
- ✅ Every content repo push automatically triggers deployment
- ✅ View trigger history on the Actions page
- ✅ Manual trigger supported (`workflow_dispatch`)

---

**Setup time**: ~5 minutes  
**Configure once, works long-term** ✨
