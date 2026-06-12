# Sources & Credibility Assessment

All URLs visited 2026-05-21 unless otherwise noted. Tier per Web-Puppy reliability hierarchy.

## Cloudflare (Tier 1 — official docs / primary)

| Source | URL | Last Updated (per page) | Notes |
|---|---|---|---|
| D1 platform release notes | https://developers.cloudflare.com/d1/platform/release-notes/ | Apr 21, 2026 | GA 2024-04-01; read replication **PUBLIC BETA** 2025-04-10 (NOT GA); jurisdictions 2025-11-05; storage max raised to 1TB paid 2025-07-01 |
| D1 platform limits | https://developers.cloudflare.com/d1/platform/limits/ | Apr 21, 2026 | 10 GB/DB, 50k DBs paid (10 free), 100k row reads/d free, 30s query timeout |
| D1 pricing | https://developers.cloudflare.com/d1/platform/pricing/ | Apr 21, 2026 | Free: 5GB total storage, 5M rows read/d, 100k rows written/d |
| KV limits | https://developers.cloudflare.com/kv/platform/limits/ | Apr 21, 2026 | 1k namespaces, 25 MB value, eventual consistency ≤60s |
| KV pricing | https://developers.cloudflare.com/kv/platform/pricing/ | Apr 21, 2026 | Free: 100k reads/d, 1k writes/d/list/delete, 1 GB storage |
| Durable Objects announcement | https://blog.cloudflare.com/sqlite-in-durable-objects/ | Apr 2024 / GA 2025 | SQLite-backed DOs |
| DO billing (SQLite) blog | https://blog.cloudflare.com/durable-objects-sqlite-now-billing/ | Nov 2025 | Billing for SQLite-backed DOs begins **Jan 7, 2026** |
| DO pricing | https://developers.cloudflare.com/durable-objects/platform/pricing/ | Apr 2026 | Free: 100k req/d, 13k GB-s/d, SQL: 5M rows read/d, 100k written/d, 5GB |
| R2 pricing | https://developers.cloudflare.com/r2/pricing/ | Apr 21, 2026 | **Egress is free**, 10 GB-mo + 1M Class A + 10M Class B/mo free |
| Hyperdrive overview | https://developers.cloudflare.com/hyperdrive/ | Apr 21, 2026 | Supports Postgres + MySQL; pooled connections, query cache |
| Analytics Engine pricing | https://developers.cloudflare.com/analytics/analytics-engine/pricing/ | Apr 23, 2026 | Free: 100k writes/d, 10k queries/d; **not currently billed** ("coming months") |
| Analytics Engine limits | https://developers.cloudflare.com/analytics/analytics-engine/limits/ | Apr 23, 2026 | 20 blobs/20 doubles/1 index per writeDataPoint; **3-month retention**; 250 data points/invocation |

## CMS / Content Layer (mixed tiers)

| Source | URL | Tier | Findings |
|---|---|---|---|
| contentlayer (original) | https://github.com/contentlayerdev/contentlayer | T1 (repo) | **NOT formally archived** (`archived: false` per GH API 2026-05-21), but dormant: last commit **2024-11-07**, last release Feb 2023. 3,541★. Treat as abandoned. |
| contentlayer2 (fork) | https://github.com/timlrx/contentlayer2 | T2 | Last release `v0.5.8` **2025-05-03**, last push **2025-05-03**. 419★, 25 open issues. ~6mo stale at Nov 2025, ~1yr by May 2026. **🚩 effectively unmaintained.** |
| Velite | https://github.com/zce/velite | T1 (repo) | 776★, last push **2026-05-16**; archived=false. Topics: zod, mdx, contentlayer, headless-cms. **Active**, Zod-native, build-time only → Workers-safe by design (no runtime CF concern). |
| Velite (root) | https://github.com/zce/velite | T1 | Tagline: "Turns Markdown / MDX, YAML, JSON, or others into app's data layer with Zod schema" |
| Fumadocs | https://github.com/fuma-nama/fumadocs | T1 | Next.js-focused docs framework; `fumadocs-mdx` is Next-coupled |
| Decap CMS | https://github.com/decaporg/decap-cms/releases | T1 | `decap-cms@3.12.2` **2026-04-17**; active; git-based |
| TinaCMS | https://github.com/tinacms/tinacms/releases | T1 | `tinacms@3.8.1` **2026-05-14**; active; git + visual editing |
| Payload deploy docs | https://payloadcms.com/docs/production/deployment | T1 | Confirms Next.js + Node + DB requirement; **no Workers/workerd support** |
| Payload releases | https://github.com/payloadcms/payload/releases | T1 | `v3.84.1` (May 2026); very active |
| Sanity pricing | https://www.sanity.io/pricing | T1 | Free 2026: 20 seats, 2 public datasets, 10k docs, 1M CDN req/mo, 250k API req/mo, 100GB assets/bandwidth |
| Notion API rate limits | https://developers.notion.com/reference/request-limits | T1 | "Average of three requests per second" per integration; 429 + Retry-After |

## Tier-1 Confidence Notes

- **Cloudflare docs**: primary source, version-controlled, dated. Highest confidence.
- **GitHub repos**: primary for release cadence; commit dates are authoritative.
- **Sanity pricing**: vendor-controlled, but pricing pages are subject to change without versioning — re-verify before commitment.
- **Notion API rate limit**: doc explicitly says "may change". Treat 3 rps as approximate.

## Not directly verified (caveat lector)

- **Hygraph free tier specifics**: not visited this session; widely reported as 1M API ops/mo, 500 GB asset traffic — verify at https://hygraph.com/pricing before relying.
- **Contentful free tier**: "Free Tier" (~5 users, 25k records, 2M API calls/mo last published) — verify at https://www.contentful.com/pricing/.
