# Granlund Grove — CI/CD, Testing, OG Images, RSS

**Project context:** TanStack Start + React 19.2 on Cloudflare Workers (`@cloudflare/vite-plugin`, `wrangler.jsonc`, `main: src/server.ts`, `nodejs_compat`). Solo dev. Bun lockfile but `npm` also present. No CI currently.

**Research date:** queries run against npm registry / GitHub / Cloudflare docs on **20 May 2026** (system clock). All version + date data below reflects that snapshot. _(User request said "Nov 2025"; npm timestamps confirm the actual current date is later — flagged where relevant.)_

---

## TL;DR matrix

| # | Topic | Current version | Released | Verdict for this project |
|---|---|---|---|---|
| 1 | `cloudflare/wrangler-action` | **v4.0.0** (default Wrangler v4) | 12 May 2025 | Use `@v3` tag (still maintained alias) or `@v4`. **No OIDC** — API token only. |
| 2 | Workers preview URLs per PR | Native via **Workers Builds** + `wrangler versions upload` | Feature GA, last doc update Apr 2026 | Use Workers Builds (Git integration) — no GH Action needed for previews. Pages-style branch alias URLs work via `--preview-alias`. |
| 3 | `@lhci/cli` | **0.15.1** | 25 Jun 2025 | Stable, maintained. Budgets below. |
| 4 | `@playwright/test` | **1.60.0** | 20 May 2026 | Works fine with React 19 (browser-level — React version irrelevant). Avoid `@playwright/experimental-ct-react` for CT. |
| 5 | Visual regression (solo dev) | **Playwright `toHaveScreenshot`** | bundled | Free, local, zero infra. See §5. |
| 6 | `axe-core` / `@axe-core/playwright` | **4.11.4** / **4.11.3** | 23 Apr 2026 / 13 Apr 2026 | WCAG 2.2 A & AA rules present (target-size, focus-not-obscured-min, etc.). |
| 7 | `vitest` + `@testing-library/react` | **4.1.7** + **16.3.2** | 20 May 2026 / 19 Jan 2026 | Fully React 19 compatible. RTL 16 peer = `react: ^18 \|\| ^19`. |
| 8 | `msw` | **2.14.6** | 11 May 2026 | First-class Vitest support via `setupServer` in setup file. |
| 9 | Satori on Workers — wrapper choice | **`@cf-wasm/og` 0.3.8** | 3 May 2026 | Pick this. `workers-og` is stale (0.0.27, Jun 2025). `@vercel/og` does not work on Workers. |
| 10 | Font loading for Satori in Workers | Pattern below | n/a | Bundle TTF/OTF as Wrangler asset OR fetch+cache; **WOFF2 not supported** by Satori. |
| 11 | `feed` npm | **5.2.1** | 19 Apr 2026 | Maintained again (revived May 2025 after 4yr dormancy). Single dep `xml-js`. Worth using over hand-rolled. |
| 12 | JSON Feed 1.1 | Spec frozen 7 Aug 2020 | — | Modest adoption (Daring Fireball, micro.blog). Publish alongside RSS — trivial extra cost. |

---

## Headline recommendations for Granlund Grove

1. **CI/CD:** Skip wrangler-action entirely — use Cloudflare's native **Workers Builds** (Git integration). It auto-deploys `main` and creates per-PR preview URLs via `wrangler versions upload`. Use GitHub Actions only for `lint`, `vitest`, `playwright`, `axe`, `lhci` — i.e. **quality gates**, not deploys.
2. **Testing stack:** `vitest@4` + `@testing-library/react@16` + `msw@2` for unit/component; `@playwright/test@1.60` + `@axe-core/playwright@4.11` for E2E + a11y. Use Playwright's built-in `toHaveScreenshot` for visual regression — free, in-repo, no SaaS.
3. **Lighthouse CI:** Add `lhci autorun` as a separate workflow against the Workers preview URL; assert budgets (see `analysis.md`).
4. **OG images:** Use `@cf-wasm/og` (active monorepo `fineshopdesign/cf-wasm`). Bundle one TTF font as a Worker module asset.
5. **RSS/Atom/JSON Feed:** Use `feed@5` — emits all three formats from one definition. Single 9.5kB dep tree. Cheaper than hand-rolling correct dates/escaping.

---

## Files

- `analysis.md` — per-topic detail with version evidence, gotchas, code sketches, Lighthouse budgets for content sites
- `sources.md` — source list with credibility tier
- `recommendations.md` — prioritised, project-contextual action items with exact `package.json` deltas and GH Actions snippets
- `raw-findings/versions.json` — machine-readable version snapshot
- `raw-findings/workers-preview-urls.md` — extracted Cloudflare doc on preview URL mechanics
