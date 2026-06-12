# Multi-Dimensional Analysis

Project context: `granlund-grove` — TanStack Start 1.167 + React 19.2 + Vite 7 + TailwindCSS 4 + shadcn/ui + Zod 3, deployed to **Cloudflare Workers** via `@cloudflare/vite-plugin` (`compatibility_date: 2025-09-24`, `nodejs_compat` enabled). SSR runs in **workerd**, not Node.

---

## Content Layer

### Velite

| Dimension | Assessment |
|---|---|
| **Security** | Build-time tool. No runtime surface in production. Reads files from disk during `vite build` only. Lowest risk. |
| **Cost** | $0. MIT OSS. No SaaS dependency. |
| **Complexity** | Low. Define Zod schemas in `velite.config.ts`, run `velite` (or its Vite plugin). Output is generated TS/JSON in `./.velite/`. Learning curve ~1 hour for someone who already knows Zod. |
| **Stability** | 776★, push 2026-05-16. Pre-1.0 (latest `v0.3.x`) — minor breakage possible across versions. Pin exact version. |
| **Optimization** | Pre-computed at build = zero runtime cost in the Worker. Bundles only what you import (tree-shake-friendly). |
| **Compatibility** | ✅ Vite-native. ✅ Works with TanStack Start (consumes generated data as a normal ES module). ✅ Workers-safe (build-time only). ✅ Zod 3.x supported (Zod 4 support tracked in issues). |
| **Maintenance** | Single maintainer (`zce`). 32 open issues, 41 forks. Moderate bus factor — **the main risk**. |

### Contentlayer / contentlayer2

| Dimension | Assessment |
|---|---|
| **Stability** | ❌ Both effectively abandoned. contentlayer2 last push 2025-05-03 (~6 mo stale at Nov 2025). |
| **Compatibility** | Was Next.js-centric; can be hacked into Vite but with friction. |
| **Verdict** | **Avoid for new projects.** |

### Fumadocs MDX

| Dimension | Assessment |
|---|---|
| **Compatibility** | Next.js-coupled (`fumadocs-mdx` uses Next conventions). Possible but awkward in TanStack Start. |
| **Verdict** | Skip unless you switch to Next.js. |

### Raw MDX (`@mdx-js/rollup` + gray-matter + `import.meta.glob`)

| Dimension | Assessment |
|---|---|
| **Complexity** | Higher — you wire up frontmatter parsing, glob discovery, and validation yourself. ~50–100 LOC. |
| **Stability** | Highest. Built on stable primitives. No third-party data layer to fall behind. |
| **Verdict** | Reasonable fallback if Velite goes stale. |

---

## Editorial CMS (only if non-dev editors need to write)

### Decap CMS (git-based, OSS)

| Dimension | Assessment |
|---|---|
| **Security** | Auth via GitHub/GitLab OAuth. No content stored outside your repo. The admin SPA is just JS served by your origin. |
| **Cost** | $0. Self-hosted. |
| **Complexity** | Low–moderate. Single `config.yml`. OAuth proxy can be a tiny Worker (e.g., `decap-server`). |
| **Stability** | 19k★, push 2026-05-20. Active. |
| **Workers fit** | ✅ Admin SPA served from Worker. OAuth proxy fits in a Worker. Content flows into your Velite build via git commits → CI. |
| **Limitations** | Editor UX is dated vs Sanity/Tina. No real-time multi-user collab. No visual editing. |

### Sanity (hosted SaaS)

| Dimension | Assessment |
|---|---|
| **Security** | SOC 2 vendor; access controls per dataset. Content lives in Sanity's infra. |
| **Cost** | **Free 2026 tier:** 20 seats / 10k docs / 1M CDN req / 250k API req / 100 GB bandwidth / mo. Growth: $15/seat/mo. |
| **Complexity** | Studio config in TS (Schema as code, Zod-ish via `defineType`). Moderate learning curve. Separate studio app. |
| **Stability** | Mature commercial vendor (since 2017). |
| **Workers fit** | ✅ Fetch from `cdn.sanity.io` GROQ endpoint. Content lake is hosted. |
| **Limitations** | Vendor lock-in. Free tier is generous but watch bandwidth if media-heavy. |

### TinaCMS

| Dimension | Assessment |
|---|---|
| **Cost** | Self-host: $0 software + Node host cost. TinaCloud: free tier exists, paid for teams. |
| **Complexity** | High for self-host (GraphQL server + DB + auth). Low for TinaCloud. |
| **Workers fit** | ❌ Self-hosted backend needs Node + DB (not Workers-runtime). TinaCloud is fine as an external API. |

### Payload CMS 3.x

| Dimension | Assessment |
|---|---|
| **Workers fit** | ❌ **Incompatible with Workers.** Requires Next.js Node runtime + Postgres/Mongo + persistent FS or S3 adapter. Per official deploy docs. |
| **Verdict** | Only consider if you run a separate Node/Postgres host (Fly.io, Railway). For Workers-only stacks, **skip**. |

---

## Cloudflare Data Primitives

| Service | Status (Nov 2025) | Free tier | Best for |
|---|---|---|---|
| **D1** | GA (Apr 2024). Replicas in **Public Beta** (not GA). | 5 GB / 5 M reads-day / 100k writes-day | Relational, transactional data. Contact form, comments, light app DB. |
| **DO (SQLite)** | Generally usable; **storage billing starts Jan 7, 2026.** Free plan eligible. | 5 GB / 5 M reads-day / 100k writes-day | Strong consistency, per-entity state, WebSockets, locks, counters. |
| **KV** | GA, mature. Eventually consistent (≤60 s). | 1 GB / 100k reads-day / 1k writes-day | High-read cache, feature flags, session lookups by key. |
| **R2** | GA. **Egress free**. | 10 GB-mo / 1 M Class A / 10 M Class B | Images, PDFs, attachments, large media. |
| **Analytics Engine** | Beta; **not currently billed**. | 100k writes-day / 10k queries-day | Custom event analytics (page views, conversion funnels). 3-mo retention. |
| **Hyperdrive** | GA. | $0 — pay for the Worker that uses it. | Pooling + cache for existing external Postgres/MySQL. |

### Cross-cutting notes

- **Egress:** Both D1 and R2 are egress-free. KV likewise. This is a structural cost advantage vs AWS/GCP equivalents.
- **Consistency:** D1 = serializable on the writer leader (with replicas eventually consistent unless using Sessions API bookmarks). DO SQLite = strongly consistent within the object. KV = eventual (≤60 s). Choose accordingly.
- **Operational simplicity:** D1 + R2 + Workers is the **lowest-ops** combo on this stack — one `wrangler` config, one dashboard, one bill.

---

## Contact Form Persistence — 5 to 50 submissions/month

Ranking for **this exact scale**:

### 1. Email-only via Resend (recommended primary)

- **Resend free tier:** 3,000 emails / month, 100 / day, 1 domain. 50 submissions/mo = **0.05% of the free quota** — comfortable headroom.
- **Pros:** Zero storage, zero persistence concerns, no GDPR data-retention question to answer. Receipt = inbox. Easy to forward to a shared mailbox.
- **Cons:** No structured archive. If the email is lost, the submission is gone. No analytics. No spam log.
- **Verdict:** **Sufficient for 5–50 submissions/mo.**

### 2. Resend + D1 (recommended belt-and-braces)

- Insert one row per submission to D1, then fire Resend in the same handler (use `ctx.waitUntil()` for the email if you want to respond fast).
- At 50/mo: **50 row-writes/mo** vs free tier of 100,000/**day**. Storage ≪ 1 MB. Effectively free forever.
- **Pros:** Durable record. Easy to add an admin view (gated TanStack route). Spam analysis later. Survives email-provider outages.
- **Cons:** GDPR: now you have PII at rest — add a deletion route + privacy notice. One extra binding to manage.
- **Verdict:** **Best long-term**. Almost no cost or complexity over option 1.

### 3. KV

- **Not recommended.** KV has no query/list-by-non-key affordance for a submission archive. You'd have to invent a key scheme (`submission:{timestamp}:{uuid}`) and use `list({prefix})`, which costs list ops and pages poorly. Eventually consistent (you might not see a just-written submission for up to 60 s). Wrong tool.

### 4. Durable Object (SQLite)

- Overkill. Adds a tiny operational concept (one DO instance) for zero benefit at this scale. D1 already gives you cross-region replicas (beta) for free with a familiar SQL surface. Re-evaluate only if you later need per-form locking, rate-limiting state, or real-time admin streams.

### 5. R2

- Wrong primitive. Object storage. Only use to store uploaded attachments (CV, image) if your form has file uploads — and then the metadata still belongs in D1.

### Decision matrix

| Need | Pick |
|---|---|
| Just notify Ty, never store | **Resend only** |
| Notify Ty + durable archive + admin list view | **Resend + D1** ✅ |
| Notify Ty + attachments | **Resend + D1 (metadata) + R2 (file)** |
| 1000+/mo + spam-prone | Add Turnstile + rate-limit DO |

**Default recommendation:** **Resend + D1.** A single 4-column table (`id, submitted_at, payload_json, email_sent_at`) and one `INSERT`/`ctx.waitUntil(resend.emails.send(...))` in a TanStack Start server route.
