# Sources

All queried 20 May 2026 (system clock). Tier per README methodology.

| # | Source | URL | Tier | Currency |
|---|---|---|---|---|
| 1 | cloudflare/wrangler-action — Releases | https://github.com/cloudflare/wrangler-action/releases | T1 (official) | v4.0.0 tagged 12 May 2025 |
| 2 | cloudflare/wrangler-action — README | https://github.com/cloudflare/wrangler-action | T1 (official) | Synced to v4 (May 2025) |
| 3 | Cloudflare Workers docs — Preview URLs | https://developers.cloudflare.com/workers/configuration/previews/ | T1 (official) | Last updated 11 May 2026 |
| 4 | Cloudflare Workers docs — Builds | https://developers.cloudflare.com/workers/ci-cd/builds/ | T1 (official) | Last updated 23 Apr 2026 |
| 5 | Cloudflare Workers docs — Builds Configuration | https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ | T1 (official) | Last updated 23 Apr 2026 |
| 6 | npm registry — `@lhci/cli` | `npm view @lhci/cli` | T1 (primary metadata) | 0.15.1 on 25 Jun 2025 |
| 7 | npm registry — `@playwright/test` | `npm view @playwright/test` | T1 | 1.60.0 on 20 May 2026 |
| 8 | npm registry — `axe-core`, `@axe-core/playwright` | `npm view` | T1 | 4.11.4 / 4.11.3 in Apr 2026 |
| 9 | dequelabs/axe-core — rule-descriptions.md | https://raw.githubusercontent.com/dequelabs/axe-core/develop/doc/rule-descriptions.md | T1 (official) | Generated from current main |
| 10 | dequelabs/axe-core — CHANGELOG.md | https://raw.githubusercontent.com/dequelabs/axe-core/develop/CHANGELOG.md | T1 (official) | Through 4.11.4 (Apr 2026) |
| 11 | npm registry — `vitest`, `@testing-library/react` | `npm view` | T1 | 4.1.7 / 16.3.2 |
| 12 | `@testing-library/react` peerDependencies | `npm view` | T1 | Confirms `react: ^18 \|\| ^19` |
| 13 | npm registry — `msw` | `npm view msw` | T1 | 2.14.6 on 11 May 2026 |
| 14 | npm registry — `workers-og` | `npm view workers-og` | T1 | 0.0.27 on 12 Jun 2025 (stale) |
| 15 | kvnang/workers-og — README | https://github.com/kvnang/workers-og | T1 | Stale, last commit mid-2025 |
| 16 | npm registry — `@cf-wasm/satori`, `@cf-wasm/og` | `npm view` | T1 | 0.3.6 / 0.3.8, 3 May 2026 |
| 17 | fineshopdesign/cf-wasm — README | https://github.com/fineshopdesign/cf-wasm | T1 (active OSS) | Active 2024–2026 |
| 18 | npm registry — `@vercel/og` | `npm view @vercel/og` | T1 | 0.11.1 (irrelevant — not Workers-compat) |
| 19 | npm registry — `feed` | `npm view feed` | T1 | 5.2.1 on 19 Apr 2026 |
| 20 | jsonfeed.org — Version 1.1 spec | https://www.jsonfeed.org/version/1.1/ | T1 (primary spec) | 7 Aug 2020 (frozen) |
| 21 | npm registry — `lost-pixel` | `npm view lost-pixel` | T1 (metadata signal) | 3.22.0 on 14 Nov 2024 — ~18 months stale ⚠️ |
| 22 | Chromatic pricing (general knowledge, T3 — verify before commit) | https://www.chromatic.com/pricing | T2 (vendor) | Free tier widely known; verify quota at adoption time |
| 23 | Web.dev — Core Web Vitals thresholds (general knowledge) | https://web.dev/articles/vitals | T1 (Google) | INP became CWV 12 Mar 2024 |

## Credibility notes
- npm registry timestamps are authoritative for "when was this published". Used as primary version-of-truth.
- Cloudflare docs surface a "Last updated" footer per page — captured above for currency.
- GitHub release dates verified against signed tags (GPG `B5690EEEBB952194` for wrangler-action).
- **Cross-referenced**: wrangler-action latest is v4.0.0 — confirmed in both Releases UI and README "Wrangler v3 Support" note.
- **Bias flag**: vendor pages (Chromatic) are T2 — pricing/quota can change; reverify before commitment.
- **Stagnation flag**: `lost-pixel` and `workers-og` are flagged based on npm `time` field showing >6 months since last release.

## Not consulted (and why)
- Stack Overflow / personal blog posts — bypassed in favour of primary sources.
- Cloudflare community forum — used GitHub issues only when needed.
- OIDC for Cloudflare: no source consulted because the wrangler-action README explicitly enumerates authentication options and OIDC is not among them — absence is the evidence.
