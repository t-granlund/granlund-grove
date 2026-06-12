# CMS Options — Status & Workers Fit (Nov 2025)

## Sanity (hosted SaaS)

Source: https://www.sanity.io/pricing (visited 2026-05-21).

### Free plan ($0 forever)
- **20 user seats**
- **10,000 documents**
- **1,000,000 API CDN requests / month**
- **250,000 uncached API requests / month**
- **100 GB bandwidth / month**
- 2 public datasets (or private)
- Unlimited content types and locales
- Hosted real-time content database
- Live previews, visual editing tools
- Content Agent / Agent Context / Compute and Agent Actions

### Growth plan ($15 per seat / month)
- 50 user seats; 25k docs; same 1M CDN/250k API/100GB bandwidth
- Adds: scheduled drafts, comments & tasks, AI Assist, pay-as-you-go overages

### Workers fit
✅ **Excellent** — Sanity is fully hosted. Workers just fetches via REST/GraphQL/CDN URL. No infra on your side.

---

## Decap CMS (git-based, OSS)

Source: GitHub `decaporg/decap-cms` (visited 2026-05-21).

- 19,070★, 3,117 forks, last push **2026-05-20** — **actively maintained**.
- Static SPA editor that commits Markdown/JSON back to your Git repo via GitHub/GitLab/Gitea OAuth.
- **Maintenance status 2025:** Active (despite earlier 2023–2024 concerns post-Netlify-divestiture, the community continued with regular releases).
- No backend required on your side.

### Workers fit
✅ **Excellent** — the admin SPA is just static HTML/JS served from your Worker (or Pages). The OAuth proxy can be a tiny Worker or use Netlify Identity / Decap's `decap-server`. Content lives in your repo and is consumed by your Velite/MDX build.

---

## TinaCMS (git-based + visual editing)

Source: GitHub `tinacms/tinacms` (visited 2026-05-21).

- 13,346★, 706 forks, last push **2026-05-21** — **very active**.
- Apache-2.0 licensed.
- Two flavors:
  - **TinaCloud (SaaS):** managed GraphQL + auth backend. Free tier exists; paid tiers for larger teams.
  - **Self-hosted:** you run `@tinacms/datalayer` (GraphQL server, Node) + your own auth (e.g., Clerk/Auth.js) + a database for indexes (MongoDB/Postgres).

### Self-host requirements
- A **Node.js host** (Vercel, Fly, Railway, AWS, container, etc.) for the GraphQL layer.
- A database for the content index (often Mongo or Postgres).
- Auth provider integration.

### Workers fit
- Frontend editor SPA: ✅ fine on Workers.
- Self-hosted backend: ❌ **NOT runnable on Workers** (needs Node + persistent DB).
- TinaCloud backend: ✅ Workers can consume it as an external API.

**Bottom line:** Choose Decap if you want pure-git-on-Workers. Choose Tina only if you need visual editing AND can tolerate either TinaCloud (SaaS) or a separate Node host for the backend.

---

## Payload CMS 3.x

Source: https://payloadcms.com/docs/production/deployment (visited 2026-05-21).

> "Payload runs fully in Next.js, so the Next.js build process is used for building Payload."
>
> "Payload can be used with any Postgres database or MongoDB-compatible database…"
>
> Lists deployment targets: **Vercel, Netlify, SST, DigitalOcean, AWS** — **no Cloudflare Workers**.
>
> Official Dockerfile uses `node:24-alpine`.

### Requirements
- **Next.js + Node.js runtime** (server, not edge).
- **Postgres or MongoDB** (or Mongo-compatible like DocumentDB/CosmosDB).
- Persistent filesystem OR S3-compatible storage adapter for uploads.

### Workers fit
❌ **Cannot run on Cloudflare Workers.**
- Workers/workerd ≠ Node.js. Payload's admin server + collections + access control rely on Node APIs, long-lived sockets to DB, and the Next.js Node adapter (not `@cloudflare/next-on-pages` edge runtime).
- D1 is not a supported DB adapter.

### Options
- Run Payload separately on Fly.io, Railway, a small VPS, or an AWS Fargate task; have your Workers site fetch its REST/GraphQL API. Reasonable, but it adds a second runtime to operate (Postgres + Node container) — defeats the simplicity of a Workers-only stack.

---

## Contentlayer / Contentlayer2

Source: GitHub APIs (visited 2026-05-21).

| | contentlayer (orig) | contentlayer2 (fork) |
|---|---|---|
| Owner | `contentlayerdev` | `timlrx` |
| Archived | **false** (commonly misreported) | false |
| Last push | **2024-11-07** | **2025-05-03** |
| Last release | v0.3.4 (Feb 2023) | v0.5.8 (May 2025) |
| Stars | 3,541 | 419 |
| Verdict | Dormant — abandoned in practice | Stale ~6mo at Nov 2025; abandoned in practice |

**Neither is viable for a 2025+ green-field build.** Even contentlayer2 (the active fork) hasn't seen commits in ~6 months as of Nov 2025. The author's focus shifted; the Next.js ecosystem has largely moved to **Fumadocs MDX, Velite, or Next.js's own MDX integration**.

For a TanStack Start / Vite project: **Velite is the direct replacement** (same Zod-schema-on-MDX model, but Vite-native and actively maintained).
