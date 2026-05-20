# Performance Monitoring Guide

This document explains how to configure and use performance monitoring tools in the project.

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Lighthouse CI Configuration](#lighthouse-ci-configuration)
- [Performance Baseline Management](#performance-baseline-management)
- [GitHub Actions Integration](#github-actions-integration)
- [FAQ](#faq)

---

## Overview

The project integrates the following performance monitoring tools:

| Tool | Purpose |
|------|------|
| Lighthouse CI | Automated performance testing |
| Web Vitals | Runtime performance monitoring |
| Performance Observer | Custom metric collection |

### Performance Targets

| Metric | Target | Description |
|------|--------|------|
| Performance Score | ≥ 0.85 | Lighthouse performance score |
| FCP | ≤ 2000ms | First Contentful Paint |
| LCP | ≤ 4000ms | Largest Contentful Paint |
| TTI | ≤ 5000ms | Time to Interactive |
| CLS | ≤ 0.1 | Cumulative Layout Shift |

---

## Quick Start

### 1. Run Performance Tests

```bash
# Build the project
pnpm build

# Run Lighthouse CI (starts preview server automatically)
pnpm lhci autorun
```

### 2. View Performance Reports

Results are saved in `.lighthouseci/`:

```bash
# View detailed JSON reports
cat .lighthouseci/lhr-*.json

# View current performance metrics
node scripts/performance-baseline.js
```

### 3. Update Performance Baseline

On first use, establish a performance baseline:

```bash
node scripts/performance-baseline.js --update
```

---

## Lighthouse CI Configuration

### Configuration File

Main config: `lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "numberOfRuns": 3,
      "url": [
        "http://localhost:4321/",
        "http://localhost:4321/about/",
        "http://localhost:4321/movie/"
      ]
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.85 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }]
      }
    }
  }
}
```

### Configuration Options

| Option | Description |
|------|------|
| `numberOfRuns` | Number of runs; results are averaged |
| `url` | Page URLs to test |
| `minScore` | Minimum score threshold |
| `maxNumericValue` | Maximum numeric threshold (milliseconds) |

---

## Performance Baseline Management

### Baseline File

Baseline is stored in `performance-baseline.json`:

```json
{
  "baseline": {
    "homepage": {
      "url": "http://localhost:4321/",
      "metrics": {
        "performance": 0.85,
        "first-contentful-paint": 1800,
        "largest-contentful-paint": 3500
      }
    }
  },
  "thresholds": {
    "regressionPercent": 10
  }
}
```

### Management Commands

```bash
# View current metrics (without updating baseline)
node scripts/performance-baseline.js

# Update performance baseline
node scripts/performance-baseline.js --update

# Check for performance regression
node scripts/performance-check.js
```

### Regression Detection

An alert is raised when metrics drop more than 10%:

```
⚠️  Performance regressions detected!
  ❌ first-contentful-paint
     Current: 2500.00ms
     Baseline: 1800.00ms
     Change: +38.9%
```

---

## GitHub Actions Integration

### Automatic Runs

Lighthouse CI runs automatically on push:

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [push, pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - run: pnpm install
      - run: pnpm build
      - uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: "./lighthouserc.json"
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### Check Results

CI includes:

- ✅ Astro Check (type checking)
- ✅ ESLint (code style)
- ✅ Build (build test)
- ⚠️ Lighthouse (performance test)

---

## FAQ

### Q: What if Lighthouse tests fail?

1. Check network connectivity
2. Confirm port 4321 is not in use
3. View detailed errors:

```bash
npx lhci autorun --verbose
```

### Q: How do I exclude certain checks?

Edit `lighthouserc.json` and set unwanted metrics to `"off"`:

```json
"uses-optimized-images": "off",
"uses-webp-images": "off"
```

### Q: How do I add new test pages?

Edit `lighthouserc.json` and add URLs to the `url` array:

```json
"url": [
  "http://localhost:4321/",
  "http://localhost:4321/about/",
  "http://localhost:4321/movie/",
  "http://localhost:4321/new-page/"  // New page
]
```

### Q: What if performance varies a lot?

1. Increase run count:

```json
"numberOfRuns": 5
```

2. Use median instead of average
3. Set looser thresholds

### Q: What if LHCI Server is not configured?

Locally, reports are saved to `.lighthouseci/` and tests still run. In GitHub Actions you may see:

```
Error: Must provide token for LHCI target
```

For full features, configure [LHCI Server](https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/server.md).

---

## Related Resources

- [Lighthouse CI Documentation](https://github.com/GoogleChrome/lighthouse-ci)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse Performance Scoring](https://developer.chrome.com/docs/lighthouse/performance/performance-scoring/)
