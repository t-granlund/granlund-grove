# Granlund Grove — Content & Data Layer Research

**Researcher:** web-puppy-eb0212
**Date observed:** 2026-05-21 (system clock; user brief said "Nov 2025" but the workspace is actually mid-2026 — dates below reflect what the sources currently show)
**Project context:** `granlund-grove` — TanStack Start 1.167 + React 19.2 + Vite 7 + TailwindCSS 4 + Cloudflare Workers (`@cloudflare/vite-plugin` 1.25, `compatibility_date: 2025-09-24`, `nodejs_compat`), Zod 3, shadcn/ui, bun. SSR runs in **workerd** (not Node, not Pages).

---

## TL;DR Recommendations

| Layer | Pick | Why | Avoid |
|---|---|---|---|
| **MDX content** | **Velite** (build-time) or **Vite `import.meta.glob` + gray-matter + `@mdx-js/rollup`** | Zod-validated, runs at build, zero runtime CF Workers concern | ⚠️ `contentlayer2` (stale), `contentlayer` (archived), Payload (Node-only) |
| **Editorial CMS** (if needed) | **Decap CMS** (git-backed, free, 2026-04 active) or **Sanity Free** (hosted) | Git workflow ↔ your repo, or generous free tier hosted | Payload 3.x (cannot run on Workers), Hygraph free tier is limited & owned by 8base |
| **DB (light/transactional)** | **Cloudflare D1** (GA Apr 2024, read replicas **Public Beta** Apr 2025) | Free 5GB, 5M reads/d, native binding | Don't use D1 for blob storage |
| **DB (existing PG)** | **Hyperdrive** + Neon/Supabase | Pooled, low-latency from workers | N/A if you don't already have a PG |
| **Sessions / counters** | **KV** (eventual) or **SQLite-backed DO** (strong) | KV for cache; DO for strong-consistency state | DO key-value class is paid-only now |
| **Assets / large files** | **R2** (egress-free still true) | 10 GB free, no egress fees | Don't store assets in D1 |
| **Custom analytics** | **Workers Analytics Engine** | 100k writes/d, 10k queries/d free | 3-month retention only |

---

## Key Flags 🚩

1. **`contentlayer` (original) is dormant, NOT formally archived.** GitHub API confirms `archived: false`, but last commit was **2024-11-07** and last release was 2023. The community fork **`contentlayer2`** (timlrx) has **no commits since 2025-05-03** — ~6 months stale by Nov 2025 / ~1 year by May 2026. Treat both as effectively unmaintained. Last release `v0.5.8` (May 2025).
2. **Payload CMS 3.x cannot run on Cloudflare Workers.** It requires Next.js + Node runtime + Postgres/MongoDB + a persistent filesystem (or S3-compatible store). Confirmed from official deployment docs (no Workers/Pages-runtime mention). Use only if you spin up a separate Node host.
3. **Notion API** rate limits to **3 req/sec average per integration** with no SLA — fine for build-time sync, risky for runtime fan-out.
4. **Hygraph / Contentful** free tiers exist but are increasingly squeezed; Hygraph was acquired by 8base (2024) — re-evaluate ToS before committing.
5. **Durable Objects: SQLite-backed storage is the default for new DOs and is on the Free plan**, but the **key-value class is paid-only**. SQL-backed DO storage **billing begins Jan 7, 2026 (no earlier)** per official pricing docs.
6. **D1 Read Replication is still PUBLIC BETA** as of Nov 2025 (announced 2025-04-10). Replicas are auto-created, no extra cost, but require using the Sessions API (`env.DB.withSession(bookmark)`). Don't assume GA semantics.

---

## File map

- `README.md` — this file (executive summary)
- `sources.md` — sources, credibility tier, accessed date
- `analysis.md` — multi-dimensional analysis (security/cost/complexity/stability/perf/compat/maintenance)
- `recommendations.md` — project-specific picks + integration notes for TanStack Start on Workers
- `raw-findings/` — extracted facts per topic

See `recommendations.md` for the prescriptive path.
