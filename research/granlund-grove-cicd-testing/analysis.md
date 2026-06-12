# Multi-dimensional analysis

All dates verified via npm registry `time` field, GitHub Releases, or official docs on 20 May 2026.

---

## 1. `cloudflare/wrangler-action`

- **Latest:** `v4.0.0` (tag), released **12 May 2025**. Default Wrangler bumped to v4.
- **Authentication:** API token only — pass `apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}`. Global API key removed in v3.
- **OIDC: NOT SUPPORTED.** Cloudflare has no OIDC trust relationship for GitHub Actions deploys to Workers. There is a long-standing community request but no implementation as of the v4.0 release. You must use a long-lived API token stored as a GitHub secret. Mitigations:
  - Scope the token tightly: `Account → Workers Scripts:Edit` + `Account Settings:Read` + `User Details:Read` (and `Workers KV:Edit`, `R2:Edit` only if used). Avoid `Memberships:Read` unless multi-user.
  - Rotate quarterly. Set an expiry date on the token at creation.
  - Use GitHub **Environment** protection rules to require approval before the deploy job can read the secret.
- **`wranglerVersion` input** now accepts ranges/tags (`4`, `^4.0.0`, `4.x`, `latest`) since v3.15 (Apr 2025).

### Minimal recommended workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push: { branches: [main] }
permissions:
  contents: read
  deployments: write
jobs:
  deploy:
    environment: production    # gate via GitHub Environment
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run build
      - uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          wranglerVersion: "4"
          command: deploy
```

**But** — see §2: for a solo personal site you probably don't need this at all.

---

## 2. Workers preview URLs per PR — native?

**Yes, fully native since 2024.** Two mechanisms; both apply without any GitHub Action.

### Mechanism A: Versioned Preview URLs (auto)
Every `wrangler versions upload` (or `wrangler deploy`) creates a Worker version with a unique public URL:
`<VERSION_PREFIX>-<WORKER_NAME>.<SUBDOMAIN>.workers.dev`

- Enabled by default when `workers_dev = true`.
- Requires `wrangler ≥ 3.74.0` for the URL surfacing; we have wrangler in `@cloudflare/vite-plugin` v1.25 → ships wrangler v4.x.
- Toggle explicitly in `wrangler.jsonc`: `"preview_urls": true`.

### Mechanism B: Aliased Preview URLs (named, e.g. per branch)
```bash
wrangler versions upload --preview-alias staging
# → staging-granlund-grove.<sub>.workers.dev
```
- Requires `wrangler ≥ 4.21.0`.
- Alias must be lowercase, start with a letter; `alias + worker-name + dash ≤ 63 chars` (DNS label).
- Max 1000 aliases retained per Worker (LRU).

### Mechanism C: Workers Builds (Cloudflare Git integration)
This is the **best fit for a solo dev**. Connect the GitHub repo in the Cloudflare dashboard:
- Production branch commits → runs the **deploy command** (default `npx wrangler deploy`).
- Non-production branch commits → runs the **non-production branch deploy command** (default `npx wrangler versions upload`) → automatic preview URL on every PR.
- Build env: `CI=true`, `WORKERS_CI=1`, `WORKERS_CI_COMMIT_SHA`, `WORKERS_CI_BRANCH`.
- No secret management in GitHub for Cloudflare creds — Cloudflare's API token is managed inside their UI.

### vs Pages preview URLs
Cloudflare Pages historically generated `<commit-hash>.<project>.pages.dev` per push. Workers Builds gives feature parity now — same auto-preview-per-branch model — but URLs are on `*.workers.dev`. **Pages is in maintenance mode for new projects**; Workers + static assets is Cloudflare's recommended path going forward (and matches our `@cloudflare/vite-plugin` setup).

### Limitations (per current Cloudflare docs)
- No preview URLs for Workers that use Durable Objects.
- No preview URLs for Workers for Platforms user workers.
- Can't change the `workers.dev` subdomain.
- **No logs viewer for preview URLs** (Workers Logs, `wrangler tail`, Logpush all excluded for previews) — annoying for debugging.

### Access control
Preview URLs are public by default. To gate them: Worker → Settings → Domains & Routes → Preview URLs → **Enable Cloudflare Access**. Free Zero Trust tier covers up to 50 users.

---

## 3. Lighthouse CI

- **`@lhci/cli`:** `0.15.1`, released 25 Jun 2025. Project is in maintenance mode (Google) but stable; releases ~yearly. No 1.0 imminent.
- **Run in CI** against the Workers preview URL (output by Workers Builds or the `wrangler-action` `deployment-url` output).

### Recommended budgets for a content/portfolio site (mobile, 4G, throttled)
Based on Google Web.dev "good" thresholds and what's achievable for a Cloudflare-edge static-ish site:

```json
// lighthouserc.json
{
  "ci": {
    "collect": {
      "url": ["https://granlund-grove.workers.dev/", "https://granlund-grove.workers.dev/blog"],
      "numberOfRuns": 3,
      "settings": { "preset": "desktop" }
    },
    "assert": {
      "assertions": {
        "categories:performance":   ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1.0  }],
        "categories:best-practices":["error", { "minScore": 0.95 }],
        "categories:seo":           ["error", { "minScore": 1.0  }],

        "largest-contentful-paint":  ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift":   ["error", { "maxNumericValue": 0.1  }],
        "interaction-to-next-paint": ["error", { "maxNumericValue": 200  }],
        "total-blocking-time":       ["error", { "maxNumericValue": 200  }],
        "first-contentful-paint":    ["warn",  { "maxNumericValue": 1800 }],
        "speed-index":               ["warn",  { "maxNumericValue": 3400 }],

        "resource-summary:script:size":     ["error", { "maxNumericValue": 170000 }],
        "resource-summary:stylesheet:size": ["error", { "maxNumericValue":  50000 }],
        "resource-summary:image:size":      ["warn",  { "maxNumericValue": 500000 }],
        "resource-summary:font:size":       ["error", { "maxNumericValue": 100000 }],
        "resource-summary:total:size":      ["warn",  { "maxNumericValue": 900000 }],

        "uses-text-compression":  "error",
        "uses-long-cache-ttl":    "warn",
        "modern-image-formats":   "error",
        "unused-javascript":      ["warn", { "maxLength": 1 }]
      }
    },
    "upload": { "target": "temporary-public-storage" }
  }
}
```

Notes for TanStack Start specifically:
- **Initial JS budget 170 KB** is realistic but tight given `@tanstack/react-router` + `@tanstack/react-query` + React 19 + a couple of Radix primitives. Audit with `vite build && du -sh dist/_worker.js`. Code-split aggressively per route via Router's lazy.
- **Font budget 100 KB**: if you use 2 subset variable fonts (woff2), this is fine. Otherwise drop to a single self-hosted variable font with `font-display: swap` and unicode-range subsetting.
- INP 200ms is the new (March 2024) Core Web Vital replacing FID — assert it.

---

## 4. Playwright + React 19

- **`@playwright/test`:** `1.60.0`, released 20 May 2026.
- **React 19 support:** Playwright is browser-driver level — totally agnostic to React version. **Zero compatibility concern** for E2E.
- **Caveat:** the experimental component-testing runner `@playwright/experimental-ct-react` has historically lagged on React 19 type peers. It is **not recommended** for new setups in 2026 — most teams use Vitest browser mode or RTL for component tests, Playwright for E2E. Do not adopt CT.

---

## 5. Visual regression — honest recommendation for a solo dev

**Use Playwright `toHaveScreenshot`.** No SaaS. No new dep. No quotas.

| Option | Cost | Maintenance burden | Diff UI | Verdict |
|---|---|---|---|---|
| **Playwright `toHaveScreenshot`** | **$0** | Low — commit snapshots to repo; CI fails on diff | Generated HTML report (local + downloadable artifact) | ✅ **Pick this.** |
| **Lost Pixel** (OSS) | $0 self-host / paid platform | **HIGH risk — npm package last published 14 Nov 2024**, ~18 months stale. Looks unmaintained. | Good local CLI; platform UI on paid tier | ❌ Avoid. |
| **Chromatic** | Free tier = 5,000 snapshots/month then $149/mo | None — fully managed | Best-in-class | ❌ Overkill for solo personal site. Free tier exhausts quickly once you matrix viewports × themes. |

### Playwright visual regression pattern
```ts
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

const routes = ['/', '/blog', '/projects'];
const themes = ['light', 'dark'] as const;

for (const route of routes) {
  for (const theme of themes) {
    test(`visual ${route} ${theme}`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);
      await page.waitForLoadState('networkidle');
      await expect(page).toHaveScreenshot(`${route.replaceAll('/', '_') || 'home'}-${theme}.png`, {
        fullPage: true,
        maxDiffPixelRatio: 0.01,
        animations: 'disabled',
        mask: [page.locator('[data-testid="dynamic-timestamp"]')],
      });
    });
  }
}
```

**Practical tips:**
- Snapshots are platform-specific — generate them in CI (Linux) only, not locally on macOS. Use `--update-snapshots` on a feature branch then commit.
- Pin browser version: `npx playwright install chromium` with the exact `@playwright/test` version.
- Mask anything time/random.
- Tag visual tests so they only run on demand or on `release/*` branches to keep PR CI fast.

---

## 6. `axe-core` / `@axe-core/playwright`

- **`axe-core`:** `4.11.4`, released 23 Apr 2026.
- **`@axe-core/playwright`:** `4.11.3`, released 13 Apr 2026.
- **WCAG 2.2 coverage:** Yes. The official `doc/rule-descriptions.md` has dedicated "WCAG 2.2 Level A & AA Rules" section. Rules added/updated for WCAG 2.2:
  - `target-size` (SC 2.5.8 — Target Size Minimum, 24×24 CSS px)
  - `focus-not-obscured-minimum` (SC 2.4.11)
  - Updates to focus-visible / focus-order behavior
  - Note: not every WCAG 2.2 SC is automatically testable. axe covers what's machine-checkable; for the rest (e.g. 3.2.6 Consistent Help) you still need manual review.
- Major change in 4.11.0 (Oct 2025): added RGAA tag mapping; deprecated `DqElement.fromFrame`; truncates very large `outerHTML` strings.

### Usage
```ts
// e2e/a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('a11y home', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});
```

---

## 7. Vitest + React 19 + Testing Library

- **`vitest`:** `4.1.7`, released 20 May 2026.
- **`@testing-library/react`:** `16.3.2`, released 19 Jan 2026.
  - Peer deps: `react: ^18.0.0 || ^19.0.0`, `react-dom: ^18.0.0 || ^19.0.0`, `@testing-library/dom: ^10.0.0`. **Full React 19 support.**
- Vitest 4 removed `happy-dom` as a recommendation in favor of `jsdom` 27 + `@vitest/browser` for real-DOM tests; either works.
- Use Vitest's **browser mode** (Playwright provider) if you want true-browser component tests instead of jsdom — replaces Playwright CT.

### Minimum config
```ts
// vite.config.ts already exports defineConfig from @lovable.dev/vite-tanstack-config.
// Add a separate vitest.config.ts:
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    globals: true,
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    coverage: { reporter: ['text', 'lcov'], thresholds: { lines: 80 } },
  },
});
```

```ts
// test/setup.ts
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';
afterEach(() => cleanup());
```

---

## 8. MSW v2 + Vitest

- **`msw`:** `2.14.6`, released 11 May 2026.
- **Vitest integration:** standard. Use `setupServer` in the Vitest setup file. No special adapter needed — MSW v2 works against the global `fetch`.

### Pattern
```ts
// test/setup.ts (extends the above)
import { setupServer } from 'msw/node';
import { beforeAll, afterAll, afterEach } from 'vitest';
import { handlers } from './msw-handlers';

const server = setupServer(...handlers);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```
```ts
// test/msw-handlers.ts
import { http, HttpResponse } from 'msw';
export const handlers = [
  http.get('/api/posts', () => HttpResponse.json([{ id: 1, title: 'Hello' }])),
];
```

- For **Vitest browser mode**, use `msw/browser` (`setupWorker`) instead.
- Watch out: MSW v2 requires `typescript ≥ 4.8`; ours is 5.8 ✅.

---

## 9. Satori on Cloudflare Workers — wrapper selection

| Wrapper | Current ver | Last release | Repo activity | Verdict |
|---|---|---|---|---|
| **`@cf-wasm/og`** (uses Satori + resvg internally) | **0.3.8** | **3 May 2026** | Active monorepo `fineshopdesign/cf-wasm` — 31 releases in last 18 months | ✅ **Use this.** |
| `@cf-wasm/satori` (just Satori → SVG, no PNG) | 0.3.6 | 3 May 2026 | Same active monorepo | Lower-level; pick if you only want SVG output. |
| `workers-og` (kvnang) | **0.0.27** | **12 Jun 2025** — ~11 months stale | Sparse — single maintainer, last commit mid-2025 | ⚠️ Working but stagnating. Falling behind upstream Satori (which is now 0.26). |
| `@vercel/og` | 0.11.1 | 18 May 2026 | Active but **Vercel-runtime only** | ❌ Does not run on Cloudflare Workers — WASM bundling differs. |

### Why `@cf-wasm/og`
- Combines Satori (HTML/CSS → SVG) **and** resvg-wasm (SVG → PNG) — `workers-og` does the same but `@cf-wasm/og` is on Satori 0.26+ and resvg 2.4+ while `workers-og` is pinned to older versions internally.
- Ships as separate WASM file → played nicely with `@cloudflare/vite-plugin`'s WASM handling.
- Tracks `@vercel/og`'s ImageResponse API.

### Sketch
```ts
// src/routes/og/$slug.tsx (or a route handler)
import { ImageResponse } from '@cf-wasm/og';
import interBold from '../../assets/Inter-Bold.ttf';
// ↑ binary import — see §10

export default async function handler({ params }: { params: { slug: string }}) {
  return new ImageResponse(
    <div style={{ display: 'flex', height: '100%', width: '100%', background: '#0b0f17',
                  color: 'white', fontFamily: 'Inter', padding: 64 }}>
      <h1 style={{ fontSize: 72 }}>{params.slug}</h1>
    </div>,
    {
      width: 1200, height: 630,
      fonts: [{ name: 'Inter', data: interBold, weight: 700, style: 'normal' }],
    },
  );
}
```

---

## 10. Font loading pattern for Satori in Workers

**Hard rule: Satori needs a TTF or OTF buffer. WOFF2 is NOT supported.**

Three patterns, ranked by trade-off:

### A) Bundle font as a Worker module asset (recommended for ≤1-2 fonts)
Wrangler can import binary files via `rules`:

```jsonc
// wrangler.jsonc
{
  "name": "granlund-grove",
  "compatibility_date": "2025-09-24",
  "compatibility_flags": ["nodejs_compat"],
  "main": "src/server.ts",
  "rules": [
    { "type": "Data", "globs": ["**/*.ttf", "**/*.otf"], "fallthrough": true }
  ]
}
```
```ts
import interBold from './assets/Inter-Bold.ttf'; // → ArrayBuffer
```
Pros: zero-latency, deterministic, no runtime fetch.
Cons: adds to Worker bundle size — count against 10MB compressed / 25MB uncompressed Worker size limit. **A subset Inter Bold is ~50KB; full Inter Variable is ~330KB → fine.**

### B) Fetch from Worker Static Assets (`[assets]` binding) at request time + module-level cache
```ts
// load on first invocation, cache in module scope (per-isolate)
let interBold: ArrayBuffer | null = null;
async function getFont(env: Env) {
  if (interBold) return interBold;
  const res = await env.ASSETS.fetch('https://placeholder/fonts/Inter-Bold.ttf');
  interBold = await res.arrayBuffer();
  return interBold;
}
```
Pros: keeps Worker bundle small; font deployed alongside other static assets.
Cons: cold isolate pays one extra fetch (sub-ms from same-pop); slightly more code.

### C) KV / R2 with edge cache (overkill for fonts that never change)
Don't bother — fonts are immutable, just bundle them.

### Subsetting tip
Use `glyphhanger` or `fonttools pyftsubset` to ship only Latin-Basic + Latin-Ext-A glyphs you actually render. Cuts Inter from 330KB to ~30KB.

### Emoji
If you render emoji you need Satori's emoji loader — pass `loadAdditionalAsset` and fetch Twemoji SVG sprites. `@cf-wasm/og` exposes the same hook as `@vercel/og`.

---

## 11. `feed` npm vs hand-rolled XML

- **`feed`:** `5.2.1`, released **19 Apr 2026**. Revived in May 2025 with v5.0 after dormancy 2021–2025. Maintainer responsive (jpmonette). Single runtime dep: `xml-js`.
- **Why use it over hand-rolling:**
  - Produces RSS 2.0, Atom 1.0, and JSON Feed 1.1 from one feed definition — three formats for the price of one.
  - Correctly handles XML escaping, namespaces (`atom:`, `dc:`, `content:`), and RFC-822 / RFC-3339 dates.
  - Tiny: `feed@5.2.1` + `xml-js@1.6.11` ≈ 30KB minified.
- **Why not:**
  - If you really only want RSS 2.0 and you're comfortable hand-writing 60 lines of XML with proper CDATA, hand-rolled is fine and zero-dep.
  - But on Cloudflare Workers the runtime cost is identical (sync XML construction) and the correctness savings dominate.

### Sketch
```ts
import { Feed } from 'feed';

export function buildFeeds(posts: Post[], baseUrl: string) {
  const feed = new Feed({
    title: 'Granlund Grove',
    description: 'Notes & writing by Ty Granlund',
    id: baseUrl,
    link: baseUrl,
    language: 'en',
    favicon: `${baseUrl}/favicon.ico`,
    copyright: `© ${new Date().getFullYear()} Ty Granlund`,
    feedLinks: {
      rss:  `${baseUrl}/rss.xml`,
      atom: `${baseUrl}/atom.xml`,
      json: `${baseUrl}/feed.json`,
    },
    author: { name: 'Ty Granlund', link: baseUrl },
  });
  for (const p of posts) {
    feed.addItem({
      title: p.title,
      id: `${baseUrl}/blog/${p.slug}`,
      link: `${baseUrl}/blog/${p.slug}`,
      description: p.summary,
      content: p.html,
      date: new Date(p.publishedAt),
    });
  }
  return { rss: feed.rss2(), atom: feed.atom1(), json: feed.json1() };
}
```

---

## 12. JSON Feed 1.1 adoption

- **Spec frozen:** v1.1 dated **7 Aug 2020**, no updates since. Stable.
- **Adoption:** modest. Notable publishers: Daring Fireball, micro.blog timeline (huge), Manton Reece, inessential, NetNewsWire — concentrated in the Apple/indie-web community. Most mainstream feed readers (Feedly, Inoreader, NetNewsWire, Reeder) accept JSON Feed.
- **Recommendation:** Publish JSON Feed alongside RSS/Atom — **zero extra cost** when using `feed` npm (literally one call). Discoverability:
  ```html
  <link rel="alternate" type="application/rss+xml"  href="/rss.xml"  title="RSS" />
  <link rel="alternate" type="application/atom+xml" href="/atom.xml" title="Atom" />
  <link rel="alternate" type="application/feed+json" href="/feed.json" title="JSON Feed" />
  ```
- **Don't publish JSON Feed ONLY** — most readers still default to RSS discovery and you'd lose subscribers.

---

## Cross-cutting concerns

### Security
- API tokens (Cloudflare) are unavoidable for any GitHub-Actions-driven deploy — mitigate via tight scopes, expiry, and GitHub Environment approvals.
- Workers Builds keeps the token inside Cloudflare's vault — strictly better than putting it in GH Secrets.
- Public preview URLs leak unreleased content. Gate with Cloudflare Access (free Zero Trust) for any non-public branch.
- `msw` in production: ensure the worker is only registered in test/dev — never ship `setupWorker` to a production bundle.

### Stability
- Stalest dep on this list: `workers-og` (11 months). Avoid.
- Most volatile: `@cf-wasm/og` (active, breaking changes possible — pin minor).
- Pin `@playwright/test` exactly; bumping minor changes auto-wait heuristics.

### Cost
- Workers Builds: free for connected repos on Workers Free plan.
- Lighthouse CI: free.
- Visual regression with Playwright: free.
- axe-core: MPL-2.0, free.
- All testing libraries: MIT/Apache, free.
- **Estimated additional infra cost: $0.**
