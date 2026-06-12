# Recommendations — prioritised

Project-contextualised for **granlund-grove** (TanStack Start + React 19.2 + Vite 7 + Cloudflare Workers + Bun, solo dev).

## Tier 1 — Do first (high ROI, low effort)

### R1. Use Workers Builds, NOT GitHub Actions, for deploys
**Why:** Native, zero-secret-management, free PR preview URLs included.
**How:** Cloudflare Dashboard → Workers & Pages → `granlund-grove` → Settings → Builds → Connect repository. Set:
- Build command: `bun install && bun run build`
- Deploy command: `bunx wrangler deploy`
- Non-production branch deploy command: `bunx wrangler versions upload --preview-alias $WORKERS_CI_BRANCH`
- Production branch: `main`
- Non-production branch builds: **enabled**

After connect, every PR commit auto-creates `<branch>-granlund-grove.<sub>.workers.dev`.

### R2. Add quality-gates GitHub Actions workflow (no deploy)
**File:** `.github/workflows/ci.yml`
```yaml
name: CI
on:
  pull_request:
  push: { branches: [main] }
permissions: { contents: read }
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bun run typecheck   # add: "tsc --noEmit"
      - run: bun run test        # vitest run
      - run: bun run build
  e2e:
    runs-on: ubuntu-latest
    needs: quality
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx playwright install --with-deps chromium
      - run: bun run e2e         # playwright test
      - if: failure()
        uses: actions/upload-artifact@v4
        with: { name: playwright-report, path: playwright-report/ }
```

### R3. `package.json` deltas
Add devDependencies (versions pinned to current as of May 2026; floor on `^` for minor updates):

```jsonc
{
  "scripts": {
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "e2e": "playwright test",
    "e2e:update": "playwright test --update-snapshots",
    "lhci": "lhci autorun"
  },
  "devDependencies": {
    "vitest": "^4.1.7",
    "@vitest/coverage-v8": "^4.1.7",
    "jsdom": "^27.0.0",
    "@testing-library/react": "^16.3.2",
    "@testing-library/jest-dom": "^6.7.0",
    "@testing-library/user-event": "^14.6.1",
    "msw": "^2.14.6",
    "@playwright/test": "^1.60.0",
    "@axe-core/playwright": "^4.11.3",
    "axe-core": "^4.11.4",
    "@lhci/cli": "^0.15.1"
  }
}
```

Runtime deps to add for features:
```jsonc
{
  "dependencies": {
    "@cf-wasm/og": "^0.3.8",
    "feed": "^5.2.1"
  }
}
```

## Tier 2 — Do next sprint

### R4. Visual regression via Playwright `toHaveScreenshot`
Create `e2e/visual.spec.ts` per the snippet in `analysis.md` §5. Generate first snapshots from CI (Linux):
```bash
gh workflow run ci.yml -F update_snapshots=true   # add workflow_dispatch input
```
Commit the `e2e/__screenshots__/` directory.

### R5. Accessibility gate
`e2e/a11y.spec.ts` (snippet in §6). Make it fail-loud — `expect(violations).toEqual([])`. WCAG 2.2 AA tags enabled.

### R6. Lighthouse CI against the Workers preview URL
After Workers Builds posts a preview URL to the GitHub commit (it does this automatically as a Deployment), add a workflow that waits for the deployment and runs `lhci autorun` against it:
```yaml
# .github/workflows/lhci.yml
on:
  deployment_status:
jobs:
  lhci:
    if: github.event.deployment_status.state == 'success'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - env:
          LHCI_URL: ${{ github.event.deployment_status.target_url }}
        run: |
          jq --arg u "$LHCI_URL" '.ci.collect.url=[$u]' lighthouserc.json > tmp && mv tmp lighthouserc.json
          bunx @lhci/cli@0.15 autorun
```
Drop `lighthouserc.json` from `analysis.md` §3 at repo root.

## Tier 3 — Feature work

### R7. OG image route with `@cf-wasm/og`
Add a TanStack Start route `routes/og.$slug.tsx` returning `ImageResponse`. Bundle one font via Wrangler `rules` (`analysis.md` §10 pattern A).

### R8. Feeds endpoint with `feed@5`
Add three TanStack Start routes: `/rss.xml`, `/atom.xml`, `/feed.json`. All built from one shared `buildFeeds(posts)` function (`analysis.md` §11). Add `<link rel="alternate">` tags to root layout.

## Tier 4 — Defer / don't do

- ❌ **Don't adopt OIDC for Cloudflare deploys** — not supported. Stop looking.
- ❌ **Don't use Chromatic or Lost Pixel** for this site. Playwright snapshots cover the need at $0.
- ❌ **Don't use `@playwright/experimental-ct-react`** — use Vitest + RTL for components, Playwright for E2E.
- ❌ **Don't use `workers-og`** — stale; use `@cf-wasm/og`.
- ❌ **Don't publish JSON Feed only** — always alongside RSS/Atom.
- ❌ **Don't enable Durable Objects on the public Worker** — disables Preview URLs. If needed, isolate DO to a service-bound separate Worker.

## Open questions to revisit
1. When does Cloudflare add OIDC for GitHub Actions? Track: https://github.com/cloudflare/workers-sdk/issues (search "OIDC"). If/when shipped, swap API token auth in `wrangler-action`.
2. Will Lost Pixel be revived? If a 2026 release lands with a maintainer team, re-evaluate vs Playwright snapshots.
3. Workers Logs for preview URLs — currently absent. Watch the Cloudflare changelog; this is the main argument for keeping a GH Actions deploy with `wrangler tail` fallback locally.
