# Sources & Credibility

All accessed **2025-11**. Tier 1 = primary/official, Tier 2 = established/maintained, Tier 3 = community.

## Cloudflare (Tier 1 — official docs, "Last updated" dates shown)

| URL | Last updated | Used for |
|---|---|---|
| https://developers.cloudflare.com/turnstile/plans/ | 2026-04-16 | Turnstile Free plan limits |
| https://developers.cloudflare.com/turnstile/concepts/widget/ | 2026-04-16 | Managed/Non-Interactive/Invisible modes |
| https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ | 2026-05-05 | siteverify flow, token lifetime, error codes |
| https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/ | — | Rate Limiting API (GA), wrangler config, locality |
| https://developers.cloudflare.com/waf/rate-limiting-rules/ | — | WAF rate-limit Free plan = 1 rule, Path-only, 10s window |
| https://developers.cloudflare.com/workers/observability/logs/workers-logs/ | — | `observability.enabled`, free 200k/day, 3-day retention |
| https://developers.cloudflare.com/logs/logpush/ | — | Logpush requires Enterprise; Workers Trace Events Logpush on Workers Paid |
| https://developers.cloudflare.com/web-analytics/ | — | Cookieless, all plans |
| https://developers.cloudflare.com/web-analytics/data-metrics/core-web-vitals/ | — | LCP/INP/CLS auto-collected, no client-state |
| https://developers.cloudflare.com/analytics/analytics-engine/pricing/ | 2026-04-23 | Workers Free: 100k writes/day, 10k reads/day |
| https://developers.cloudflare.com/analytics/analytics-engine/limits/ | 2026-04-23 | 3-month retention, 20 blobs / 20 doubles / 1 index |
| https://developers.cloudflare.com/workers/platform/limits/ | — | Free: 100k req/day, 10ms CPU, 3 MB worker |
| https://developers.cloudflare.com/kv/platform/pricing/ | — | KV Free: 100k reads / 1k writes / 1k list / 1 GB stored per day |
| https://developers.cloudflare.com/d1/platform/pricing/ | — | D1 Free: 5M rows read/day, 100k written/day, 5 GB total |

## Standards & specs (Tier 1)

| URL | Body | Used for |
|---|---|---|
| https://www.rfc-editor.org/rfc/rfc9116.txt | IETF (Foudil, Shafranovich) Apr 2022 | `security.txt` fields (Contact REQUIRED, Expires REQUIRED, < 1 year), location `/.well-known/security.txt`, signature recommended |
| https://web.dev/articles/strict-csp | Google (Lukas Weichselbaum), evergreen | Nonce-based strict CSP with `strict-dynamic`, `object-src 'none'`, `base-uri 'none'` |
| https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy | MDN | Permissions-Policy directives incl. `browsing-topics` |

## Vendor / package registries (Tier 1 — primary)

| URL | Captured | Used for |
|---|---|---|
| https://registry.npmjs.org/@marsidev/react-turnstile | 2025-11 | v1.5.2, MIT, published 2025-05-05 |
| https://registry.npmjs.org/@stoplight/spectral-cli | 2025-11 | v6.16.0 (newer than user-stated 6.15.0), Apache-2.0 |
| https://registry.npmjs.org/@redocly/cli | 2025-11 | v2.31.2, MIT |
| https://api.github.com/repos/daveshanley/vacuum/releases/latest | 2025-11 | v0.26.5 |
| https://registry.npmjs.org/web-vitals/latest | 2025-11 | v5.2.0, Apache-2.0 |
| https://raw.githubusercontent.com/GoogleChrome/web-vitals/main/CHANGELOG.md | 2025-11 | v5.x = INP attribution, FID removed, Baseline browser policy |
| https://registry.npmjs.org/@sentry/cloudflare/latest | 2025-11 | v10.53.1, MIT |

## Vendor pricing pages (Tier 2 — vendor self-report)

| URL | Captured | Used for |
|---|---|---|
| https://sentry.io/pricing/ | 2025-11 | Developer free = 5k errors/mo, 1 user, includes Tracing |
| https://uptimerobot.com/pricing/ | 2025-11 | Free: 50 monitors, 5-min interval, 1 status page, 3-month retention |
| https://betterstack.com/pricing | 2025-11 | Free: 10 monitors + heartbeats, 30s checks, 1 status page, 100k Sentry-equivalent exceptions |
| https://www.openstatus.dev/pricing | 2025-11 | Hobby (free): 1 monitor, 10-min interval, 1 status page (3 components) |
| https://plausible.io/#pricing | 2025-11 | Cloud: no free tier (30-day trial), starts $9/mo @ 10k pageviews; self-host AGPLv3 |
| https://docs.umami.is/docs/install | 2025-11 | Requires Node 18.18+ and PostgreSQL 12.14+ (NOT Workers-compatible) |
| https://fathom.eu / https://usefathom.com/pricing | (cross-ref) | Paid only — starts ~$15/mo; EU + US data residency options; no free tier |

## Community / supporting (Tier 2-3)

| URL | Tier | Used for |
|---|---|---|
| https://github.com/marsidev/react-turnstile | 2 | Confirms package is primary React wrapper (Cloudflare has no official React lib) |
| https://github.com/getsentry/sentry-javascript/tree/develop/packages/cloudflare | 2 | `@sentry/cloudflare` is the official SDK package path |
| https://github.com/daveshanley/vacuum | 2 | Spectral-compatible OAS linter in Go |

## Sources NOT relied on

- ❌ Stack Overflow answers older than 2024 (CSP, Tailwind landscape changed with v4)
- ❌ Generic "best 10 uptime monitors" blog roundups
- ❌ Personal Medium posts on Workers limits (use official pricing pages)
