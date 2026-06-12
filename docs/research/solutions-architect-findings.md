# Solutions Architect Findings — granlund-grove

**Author:** Solutions Architect 🏛️ (`solutions-architect-63fdc4`)
**Date:** 2025-11-15
**Status:** Proposed — pending Security Auditor co-sign on STRIDE sections, Experience Architect review of API contracts, Planning Agent ingestion
**Scope:** Backend, infrastructure, data, API governance, security, observability, CI/CD, testing strategy for Tyler Granlund's personal brand site (`tygranlund.com` — TanStack Start + React 19 on Cloudflare Workers).
**Research evidence:** `research/granlund-grove-content-data/`, `research/granlund-grove-security-ops/`, `research/granlund-grove-cicd-testing/` (web-puppy workspace)

> **Temporal note:** Research was conducted via web-puppy in Nov 2025. Some upstream package timestamps in the evidence files reflect npm registry snapshots that may run ahead of the reference date; version pins below are conservative floors. Re-validate at implementation time.

---

## 0. Executive Summary

Tyler's site is in good shape but is currently a **single hardcoded route**. To make it "best-in-class badass" without abandoning the solo-dev ergonomics, the architecture should evolve along eight axes — each documented as an ADR below. The throughline is:

> **Git-native content, Cloudflare-native runtime, free-tier-first ops, E2E-tested every feature.**

### Recommended stack additions (single shortlist — no menus)

| Category | Pick | Version floor | License | Cost |
|---|---|---|---|---|
| Content layer | **Velite** | `^0.2.4` | MIT | Free |
| Runtime DB | **Cloudflare D1** | wrangler `^4.36.0` | — | Free tier covers it |
| Object storage | **Cloudflare R2** | — | — | Free tier (10 GB) |
| Hot config / counters | **Cloudflare KV** | — | — | Free tier |
| Custom metrics | **Cloudflare Analytics Engine** | — | — | Free tier |
| Email send | **Resend** | `^4.x` | — | Free 3k/mo |
| Bot mitigation | **Cloudflare Turnstile** + `@marsidev/react-turnstile` | `^1.5.2` | MIT | Free unlimited |
| Rate limiting | **Workers Rate Limiting API** (native binding) | wrangler `^4.36.0` | — | Free |
| OG image generation | **`@cf-wasm/og`** | `^0.3.8` | MIT | Free |
| RSS / Atom / JSON Feed | **`feed`** | `^5.2.1` | MIT | Free |
| Analytics (privacy-first) | **Cloudflare Web Analytics** | — | — | Free |
| Error monitoring | **`@sentry/cloudflare`** + **`@sentry/vite-plugin`** | `^10.x` | BSD-3 | Free 5k errors/mo |
| RUM | **`web-vitals`** → Analytics Engine | `^5.2.0` | Apache-2.0 | Free |
| Uptime | **Better Stack** | — | — | Free (10 monitors, 30s) |
| Unit / component test | **Vitest** + **@testing-library/react** + **jsdom** | `^2.x` / `^16.x` | MIT | Free |
| API mocking | **MSW** v2 | `^2.x` | MIT | Free |
| E2E + visual + a11y | **Playwright** + **`@axe-core/playwright`** | `^1.49` / `^4.10` | Apache-2.0 | Free |
| Perf budgets | **`@lhci/cli`** | `^0.15.1` | Apache-2.0 | Free |
| API governance (deferred) | **vacuum** (Spectral-compatible, faster) | `^0.26.x` | MIT | Free |

**Total recurring cost: $0.** All paid tiers are optional growth paths.

### Migration sequencing (dependency-ordered)

```
Phase 1 (Foundations — no user-visible change)
  1. ADR-007 CI/CD pipeline + ADR-008 testing harness  ← gate everything that follows
  2. ADR-004 Security hardening (CSP nonce, security.txt, observability)
  3. ADR-005 Observability (Sentry, web-vitals, uptime)

Phase 2 (Content & data)
  4. ADR-001 Velite content layer + migrate hardcoded TSX → MDX
  5. ADR-002 D1 schema + planning DB (file-based)

Phase 3 (Surface area)
  6. ADR-003 API: contact form (Turnstile + rate limit + Resend + D1), OG images, RSS, search
  7. New routes: /writing/[slug], /case-studies/[slug], /now, /uses (consumed by Experience Architect)

Phase 4 (Polish)
  8. Visual regression baselines, LHCI budgets enforced in CI, Spectral/vacuum when first OpenAPI spec emerges
```

---

## ADR-001 — Content Layer: Velite (file-based MDX with Zod validation)

**Status:** Proposed

### Context and Problem Statement
The site currently embeds content (career history, projects, skills, impact metrics) directly in TSX components under `src/components/site/`. This is unsustainable as Tyler adds case studies, writing, "now" updates, and a project portfolio. We need a content layer that (a) preserves git-native editing for a technical author, (b) provides typed, validated content at build time, (c) runs cleanly on Cloudflare Workers, and (d) does not introduce a server-side runtime dependency on a database for read-mostly content.

### Decision Drivers
- **D1.** Author is a technical IT director who values dev ergonomics and version control.
- **D2.** Site is read-mostly; content changes are deliberate, not real-time.
- **D3.** Must work on Cloudflare Workers (no Node runtime).
- **D4.** Content needs typed schemas (career roles, projects, case studies, posts) to prevent drift.
- **D5.** Build-time generation preferred over runtime DB hits for cacheability and perf.
- **D6.** No additional vendor lock-in or recurring cost.

### Considered Options
1. **Velite** — Vite-native, MIT, actively maintained (last release within 6 months at time of research, Zod-native schemas, builds content into typed JSON at compile time → Workers-safe by design).
2. **Contentlayer / contentlayer2** — Original last released Feb 2023 and dormant; `contentlayer2` fork last push ~6 months stale. **Both rejected — abandoned.**
3. **Custom Vite `import.meta.glob` + gray-matter + `@mdx-js/rollup`** — Maximum control, ~50 LOC, but reinvents Velite's typed-schema layer and we'd own validation, slug generation, RSS feeds manually.
4. **Sanity (headless SaaS)** — Generous free tier (20 seats, 10k docs, 1M CDN req/mo), great DX for non-devs. But adds an external dependency, a separate auth surface, and a Studio app to host — over-engineered for a solo technical author who lives in git.
5. **Decap CMS (git-based UI)** — Actively maintained, free, OSS. Useful **on top of** Velite if Tyler later wants a browser editor for non-dev moments. Not chosen as the primary content layer because Velite is the source of truth.
6. **Payload CMS 3.x** — Requires Node runtime + Postgres/MongoDB. **Rejected — incompatible with Workers-only deployment.**
7. **Notion as CMS via API** — Requires runtime API calls (extra latency, brittle), unofficial markdown export semantics. **Rejected.**

### Decision Outcome
**Chosen: Velite.** It is the only option that satisfies all six drivers without introducing runtime or hosting dependencies. Content lives in `content/` as MDX, validated by Zod schemas in `velite.config.ts`, compiled to `.velite/` JSON imported by route loaders.

#### Consequences
- **Good:** Typed content at build time; zero runtime cost; git history = editorial history; works with TanStack Start route loaders; trivially testable; Velite generates slugs, reading time, excerpts.
- **Good:** Schema evolution is a TypeScript refactor — Velite fails the build on drift.
- **Bad:** Editing requires a git commit (acceptable for this persona; can add Decap later if needed).
- **Bad:** Content changes require redeploy (acceptable — Workers Builds redeploys in ~30s).
- **Neutral:** Adds ~one build step (~2-5s) and `.velite/` to `.gitignore`.

### Sketched schema (`velite.config.ts`)
```ts
import { defineConfig, defineCollection, s } from 'velite'

const posts = defineCollection({
  name: 'Post',
  pattern: 'writing/**/*.mdx',
  schema: s.object({
    title: s.string().max(120),
    slug: s.slug('post'),
    date: s.isodate(),
    updated: s.isodate().optional(),
    excerpt: s.string().max(280),
    tags: s.array(s.string()).default([]),
    draft: s.boolean().default(false),
    readingTime: s.metadata(),
    toc: s.toc(),
    body: s.mdx(),
  }).transform((d) => ({ ...d, permalink: `/writing/${d.slug}` })),
})

const caseStudies = defineCollection({
  name: 'CaseStudy',
  pattern: 'case-studies/**/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.slug('case-study'),
    client: s.string(),
    role: s.string(),
    period: s.object({ start: s.isodate(), end: s.isodate().optional() }),
    summary: s.string().max(400),
    outcomes: s.array(s.object({ metric: s.string(), value: s.string() })),
    stack: s.array(s.string()),
    confidential: s.boolean().default(false),
    body: s.mdx(),
  }),
})

const projects = defineCollection({
  name: 'Project',
  pattern: 'projects/**/*.mdx',
  schema: s.object({
    title: s.string(),
    slug: s.slug('project'),
    status: s.enum(['active','shipped','archived']),
    summary: s.string().max(280),
    repo: s.string().url().optional(),
    url: s.string().url().optional(),
    stack: s.array(s.string()),
    body: s.mdx().optional(),
  }),
})

const career = defineCollection({
  name: 'Role',
  pattern: 'career/*.mdx',
  schema: s.object({
    company: s.string(),
    title: s.string(),
    start: s.isodate(),
    end: s.isodate().optional(),
    location: s.string(),
    highlights: s.array(s.string()),
    body: s.mdx().optional(),
  }),
})

const now = defineCollection({
  name: 'Now',
  pattern: 'now/*.mdx',
  single: false,
  schema: s.object({
    date: s.isodate(),
    body: s.mdx(),
  }),
})

export default defineConfig({
  root: 'content',
  output: { data: '.velite', clean: true },
  collections: { posts, caseStudies, projects, career, now },
})
```

### STRIDE Security Analysis — Content Layer
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Unauthorized author commits | GitHub branch protection (`main` requires PR + signed commits); only Tyler has write |
| **Tampering** | MDX injecting unsafe HTML/scripts at render | MDX compiled at build with `rehype-sanitize`; no `dangerouslySetInnerHTML` in custom components; CSP blocks inline scripts (see ADR-004) |
| **Repudiation** | Author denies a published claim | Git history (signed commits) + immutable build artifacts in Workers Versions API |
| **Info Disclosure** | Confidential case-study leakage | `confidential: true` flag short-circuits the page route → 404; lint rule in fitness function blocks deploy if any `confidential: true` doc lacks `redactionNotes` |
| **DoS** | Build pipeline poisoned by huge MDX file | Velite reads only `content/**`; CI caches `.velite/`; max-file-size lint check in pipeline |
| **Elevation** | MDX custom component executing arbitrary code | Custom MDX components allow-listed in `mdx-components.tsx`; no dynamic `import()` from MDX |

### Fitness Functions
```python
# tests/architecture/test_content_layer.py
"""ADR-001 fitness functions — enforce Velite content layer invariants."""
from pathlib import Path
import json, re

REPO = Path(__file__).resolve().parents[2]

def test_velite_config_exists_and_uses_zod_schemas():
    cfg = (REPO / "velite.config.ts").read_text()
    assert "defineCollection" in cfg
    assert "s.object" in cfg, "Velite Zod schemas required"

def test_no_hardcoded_content_in_components():
    """site/* components must not contain >200 chars of prose literal."""
    offenders = []
    for tsx in (REPO / "src/components/site").glob("*.tsx"):
        # heuristic: long runs of >200 chars in JSX text nodes flagged
        if re.search(r">[^<{}]{220,}<", tsx.read_text()):
            offenders.append(tsx.name)
    assert not offenders, f"Move prose to content/: {offenders}"

def test_confidential_case_studies_have_redaction_notes():
    for mdx in (REPO / "content/case-studies").glob("**/*.mdx"):
        text = mdx.read_text()
        if "confidential: true" in text:
            assert "redactionNotes:" in text, f"{mdx.name}: missing redactionNotes"

def test_velite_output_is_gitignored():
    gi = (REPO / ".gitignore").read_text()
    assert ".velite" in gi, ".velite/ must be in .gitignore"
```

### Research References
- `research/granlund-grove-content-data/analysis.md` — Velite/Contentlayer/Sanity/Payload/Decap evaluation
- `research/granlund-grove-content-data/raw-findings/cms-status.md` — maintenance status snapshot

---

## ADR-002 — Data Layer: D1 (runtime) + file-based planning DB + KV (config) + R2 (media)

**Status:** Proposed

### Context and Problem Statement
Two distinct data needs:
1. **Runtime data** — contact form submissions, aggregated page metrics, future newsletter subscribers.
2. **Planning data** ("BDS database" = Backlog Decision Store) — the source of truth the Planning Agent reads to track ADRs, backlog items, sprint state, decision outcomes.

These have orthogonal requirements: runtime data needs durable writes from Workers; planning data needs git-native, human-editable, agent-readable structure with no runtime dependency.

### Decision Drivers
- **D1.** Runtime data must be writable from Workers without external services.
- **D2.** Planning data must be inspectable in PRs and editable by both humans and agents.
- **D3.** Volumes are tiny (5-50 contact submissions/month, ~100 backlog items lifetime).
- **D4.** Free-tier-first.
- **D5.** Read latency for content lookups should not bottleneck SSR.

### Considered Options (runtime)
1. **D1 (SQLite)** — GA since 2024; free tier = **5M rows read / 100k rows written per day, 5 GB storage**. Read replicas in public beta. Native binding.
2. **KV** — Eventually consistent, no query/list affordance, 100k reads / 1k writes per day free. Wrong shape for tabular data with queries.
3. **Durable Objects (SQLite-backed)** — Default for new DO classes, free SQL limits mirror D1. Useful for strongly-consistent counters / sessions / rate-limit windows but **overkill for a contact form** at this volume.
4. **Hyperdrive + external Postgres** — Adds an external DB to manage. Unnecessary.

### Considered Options (planning DB)
1. **File-based MDX in `docs/planning/` with Zod-validated frontmatter (matched by Velite)** — Same toolchain as content; readable in PRs; agents read JSON output from `.velite/`.
2. **SQLite committed to repo** — Binary diffs are noisy; agents would need a DB client.
3. **JSON files in `docs/planning/`** — Loses MDX narrative; harder to write.
4. **External issue tracker (GitHub Projects, Linear)** — Outside the agent loop; harder for agents to reason about without API auth.

### Decision Outcome
**Runtime → D1** for tabular durable data, **KV** for hot config / feature flags / build markers, **R2** for media (case study images, future video thumbnails), **Analytics Engine** for high-cardinality custom metrics. **Durable Objects** reserved for the rate-limit window (see ADR-003) and a future "live presence" experiment if pursued.

**Planning → File-based MDX** in `docs/planning/{adrs,backlog,sprints,decisions}/` with Zod-validated frontmatter, surfaced to agents via Velite's `.velite/` JSON output.

#### Consequences
- **Good:** All four primitives ship in Workers natively; one mental model.
- **Good:** Planning DB lives in version control, reviewable in PRs; Planning Agent can read structured JSON.
- **Good:** D1 schema migrations are SQL files in `migrations/` — auditable.
- **Bad:** D1 read replicas are still beta — single-region writes acceptable at this scale; revisit at >1k writes/day.
- **Bad:** Analytics Engine SQL queries are write-once query-many; no UPDATE/DELETE. Acceptable for telemetry.
- **Neutral:** Storage billing for DO SQLite reportedly begins Jan 2026; we don't depend on DO storage for the MVP.

### Sketched schemas

#### D1 — `migrations/0001_init.sql`
```sql
-- Contact submissions (PII-bearing; minimize retention)
CREATE TABLE contact_submissions (
  id          TEXT PRIMARY KEY,            -- ulid
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  subject     TEXT,
  message     TEXT NOT NULL,
  ip_hash     TEXT NOT NULL,               -- SHA-256(ip + daily-salt), not raw IP
  ua_hash     TEXT NOT NULL,
  turnstile_ok INTEGER NOT NULL,           -- 0/1
  honeypot_ok  INTEGER NOT NULL,
  email_sent   INTEGER NOT NULL DEFAULT 0,
  resend_id    TEXT
);
CREATE INDEX idx_contact_created ON contact_submissions(created_at DESC);

-- Lightweight aggregated page metrics (NOT raw RUM; just counters)
CREATE TABLE page_metrics_daily (
  day         TEXT NOT NULL,               -- 'YYYY-MM-DD'
  path        TEXT NOT NULL,
  views       INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (day, path)
);

-- Content index (mirrors .velite/ for SQL-based search until we add a search index)
CREATE TABLE content_items (
  slug        TEXT PRIMARY KEY,
  kind        TEXT NOT NULL,               -- 'post' | 'case-study' | 'project'
  title       TEXT NOT NULL,
  excerpt     TEXT,
  tags_csv    TEXT,
  date        TEXT,
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_content_kind_date ON content_items(kind, date DESC);

-- Webhook event log (for inbound integrations later: e.g., GitHub stars, RSS pings)
CREATE TABLE webhook_events (
  id         TEXT PRIMARY KEY,
  source     TEXT NOT NULL,
  received_at TEXT NOT NULL DEFAULT (datetime('now')),
  signature_ok INTEGER NOT NULL,
  payload_sha256 TEXT NOT NULL,
  processed  INTEGER NOT NULL DEFAULT 0
);
```

#### Planning DB — `docs/planning/` structure
```
docs/planning/
├── adrs/               # one MDX per ADR (frontmatter: id, status, supersedes, ...)
├── backlog/            # one MDX per epic/story
├── sprints/            # one MDX per sprint with goals + outcomes
├── decisions/          # lightweight (non-ADR) decision log
└── schema/
    └── planning.velite.ts  # Zod schemas, imported by root velite.config.ts
```

Example backlog item frontmatter (Zod-enforced):
```yaml
---
id: BDS-014
title: "Migrate Career section to Velite content collection"
status: ready          # ready | in-progress | blocked | done | dropped
priority: P1
owner: husky
adr_refs: [ADR-001]
acceptance:
  - Career.tsx reads from .velite/Role
  - tests/e2e/career.spec.ts covers timeline render
estimate: M             # XS | S | M | L | XL
created: 2025-11-15
---
```

### STRIDE Security Analysis — Data Layer
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Forged submissions claiming to be from someone | Email field has no auth claim — we display it as user-supplied; admin views must show this caveat |
| **Tampering** | SQL injection via contact form | All D1 queries use parameterized `prepare().bind()`; no string concat; fitness function lint blocks raw string SQL |
| **Repudiation** | Submitter denies sending the message | `ip_hash`, `ua_hash`, `created_at` retained 90 days; honeypot + Turnstile result stored |
| **Info Disclosure** | Contact submissions leaking via misconfigured admin | No admin UI in MVP; access via `wrangler d1 execute` only; documented in `SECURITY.md` |
| **Info Disclosure** | Raw IPs stored = GDPR PII | IPs are **SHA-256 hashed with daily-rotating salt in KV** before insert — never persisted raw |
| **DoS** | Flooding D1 writes via contact form | Turnstile + rate-limit binding + honeypot (see ADR-003); D1 free tier (100k writes/day) is the ceiling but rate-limit clamps far below |
| **Elevation** | Admin token leak | Wrangler secrets (`wrangler secret put`) never in repo; D1 access uses bindings (no token in code) |

### Fitness Functions
```python
# tests/architecture/test_data_layer.py
from pathlib import Path
import re

REPO = Path(__file__).resolve().parents[2]

def test_d1_binding_declared_in_wrangler():
    cfg = (REPO / "wrangler.jsonc").read_text()
    assert '"d1_databases"' in cfg or 'd1_databases' in cfg

def test_no_raw_sql_string_concatenation():
    """Enforce parameterized queries — no `'... ' + var + ' ...'` in SQL contexts."""
    bad = []
    for ts in (REPO / "src").rglob("*.ts"):
        body = ts.read_text()
        # Find `.exec(` or template strings with SELECT/INSERT/UPDATE/DELETE + ${
        if re.search(r"(SELECT|INSERT|UPDATE|DELETE)[^`'\"]*\$\{", body, re.IGNORECASE):
            bad.append(ts.relative_to(REPO).as_posix())
    assert not bad, f"Use prepare().bind() — raw SQL interpolation in: {bad}"

def test_ip_addresses_are_hashed_before_persist():
    """Search codebase for `submission.ip` or similar raw uses against D1 inserts."""
    forbidden = re.compile(r"(insert|INSERT).+ip(?!_hash)", re.IGNORECASE | re.DOTALL)
    for ts in (REPO / "src").rglob("*.ts"):
        assert not forbidden.search(ts.read_text()), f"Raw IP detected in {ts}"

def test_planning_dir_exists_with_schema():
    assert (REPO / "docs/planning/schema/planning.velite.ts").exists()
    assert (REPO / "docs/planning/adrs").exists()
    assert (REPO / "docs/planning/backlog").exists()
```

### Research References
- `research/granlund-grove-content-data/raw-findings/cloudflare-data-nov-2025.md`

---

## ADR-003 — API Design: TanStack Start server functions + native Rate Limiting + Turnstile + Resend

**Status:** Proposed

### Context and Problem Statement
The site needs server-side capabilities: contact form submission, RSS/Atom/JSON feed, on-the-fly OG image generation, search (later), optional webhook receivers. We must choose between REST routes, TanStack Start server functions (RPC-style), or a hybrid. We must also pick spam mitigation, rate limiting, and email delivery.

### Decision Drivers
- **D1.** Co-locate logic with consuming route where possible (server functions are TanStack's idiomatic pattern).
- **D2.** Public, machine-consumed endpoints (RSS, OG) must be cacheable HTTP GETs at stable URLs.
- **D3.** Bot mitigation on any state-mutating endpoint.
- **D4.** Per-route rate limits to defend against abuse without harming legit users.
- **D5.** No third-party API keys when a Cloudflare-native option exists.

### Considered Options (API style)
1. **All REST routes** under `src/routes/api/*.ts` — explicit, easy to lint/govern with Spectral/vacuum, but loses TanStack Start's type-safe RPC for in-app calls.
2. **All server functions** — Maximum DX for in-app calls, but external consumers (RSS readers, OG fetchers) need stable URLs anyway.
3. **Hybrid: server functions for in-app actions; route handlers for public/machine endpoints.** ← chosen

### Considered Options (bot mitigation)
1. **Cloudflare Turnstile** — Free unlimited, managed mode no user friction, official server-side verify endpoint. `@marsidev/react-turnstile` is the de facto React wrapper (MIT, maintained).
2. **hCaptcha** — Paid for enterprise features; CF-native option exists.
3. **Honeypot only** — Cheap but bypassable.

**Chosen:** Turnstile (managed) **+** honeypot field **+** rate limiting (defense in depth).

### Considered Options (rate limiting)
1. **Workers Rate Limiting API (native binding)** — GA in wrangler `^4.36.0`; period must be 10 or 60s; eventually consistent per Cloudflare colo. Sufficient for contact form.
2. **WAF rule** — Free plan = 1 rule only, path-based, 10s window. Too restrictive for multiple endpoints.
3. **DIY Durable Object counter** — More flexibility but more code; reserve for cases where the binding's 10/60s windows don't fit.

**Chosen:** Native Rate Limiting binding for HTTP endpoints; DO counter only if we hit a real limitation.

### Considered Options (email)
1. **Resend** — Free 3k/mo, simple API, good deliverability, Cloudflare-friendly. ← chosen
2. **MailChannels** — Was free for CF Workers; pricing/availability changed in 2024 — risk.
3. **Self-hosted SMTP** — Out of scope.

### Decision Outcome
**Hybrid API:**
- **Server functions** for actions invoked by the React app: `submitContact`, future `subscribeNewsletter`, `searchContent`.
- **Route handlers** (under `src/routes/api/*.ts` or top-level `src/routes/*.xml.ts`) for public/machine endpoints: `/rss.xml`, `/atom.xml`, `/feed.json`, `/og/[slug].png`, `/api/webhooks/[source]`, `/.well-known/security.txt`.

Every state-mutating endpoint runs through a shared middleware chain: `withRateLimit(name, limit)` → `withTurnstile()` → `withHoneypot()` → handler. Reuse via a tiny `defineSecureAction()` helper.

#### Consequences
- **Good:** In-app calls are typed end-to-end (TanStack Start server fn invariant); RSS/OG/webhooks have stable URLs for cache/CDN.
- **Good:** Bot mitigation is consistent across endpoints; one helper to test.
- **Good:** No third-party rate-limit service; binding is local to Workers runtime.
- **Bad:** Server function URLs are opaque (`/_serverFn/...`) — fine for in-app, unusable for external consumers (hence the hybrid).
- **Bad:** Rate limiting binding eventual consistency means an attacker hitting many colos could briefly exceed the limit. Acceptable for a personal site; combined with Turnstile this is non-trivial.

### Sketched endpoints

#### `wrangler.jsonc` additions
```jsonc
{
  // ...existing
  "observability": { "enabled": true },
  "d1_databases": [
    { "binding": "DB", "database_name": "granlund-grove", "database_id": "<set-after-create>" }
  ],
  "kv_namespaces": [
    { "binding": "KV", "id": "<set-after-create>" }
  ],
  "r2_buckets": [
    { "binding": "MEDIA", "bucket_name": "granlund-grove-media" }
  ],
  "analytics_engine_datasets": [
    { "binding": "ANALYTICS", "dataset": "site_events" }
  ],
  "unsafe": {
    "bindings": [
      { "name": "RL_CONTACT", "type": "ratelimit",
        "namespace_id": "100", "simple": { "limit": 5, "period": 60 } },
      { "name": "RL_OG", "type": "ratelimit",
        "namespace_id": "101", "simple": { "limit": 30, "period": 60 } }
    ]
  },
  "vars": {
    "RESEND_FROM": "hello@tygranlund.com",
    "CONTACT_TO": "tyler@tygranlund.com"
  }
  // secrets (NOT here): TURNSTILE_SECRET, RESEND_API_KEY, IP_HASH_SALT, SENTRY_DSN
}
```

#### Shared secure-action helper (sketch)
```ts
// src/server/secure-action.ts
import { json } from '@tanstack/react-start'
import { z } from 'zod'

export function defineSecureAction<S extends z.ZodTypeAny>(opts: {
  schema: S
  rateLimit: { binding: 'RL_CONTACT' | 'RL_OG'; keyFrom: 'ip' | 'user' }
  requireTurnstile?: boolean
  handler: (input: z.infer<S>, ctx: ActionCtx) => Promise<Response>
}) {
  return async (req: Request, env: Env) => {
    const ip = req.headers.get('cf-connecting-ip') ?? '0.0.0.0'
    const rl = await env[opts.rateLimit.binding].limit({ key: ip })
    if (!rl.success) return new Response('Too Many Requests', { status: 429 })

    const body = await req.json().catch(() => null)
    const parsed = opts.schema.safeParse(body)
    if (!parsed.success) return json({ error: 'invalid_input' }, { status: 400 })

    if (opts.requireTurnstile) {
      const ok = await verifyTurnstile(parsed.data.turnstileToken, ip, env)
      if (!ok) return json({ error: 'turnstile_failed' }, { status: 403 })
    }

    // honeypot: any non-empty `_hp` field => bot
    if (parsed.data._hp) return json({ ok: true }) // soft-fail (don't reveal)

    return opts.handler(parsed.data, { req, env, ip })
  }
}
```

#### Endpoint inventory
| Path | Method | Auth | Rate limit | Turnstile | Notes |
|---|---|---|---|---|---|
| `submitContact` (server fn) | POST | — | RL_CONTACT 5/60s | ✅ | Writes D1, sends via Resend |
| `searchContent` (server fn) | POST | — | RL_OG 30/60s | ❌ | Reads `.velite/` index |
| `/rss.xml` | GET | — | — | ❌ | Built from velite at deploy; served from cache |
| `/atom.xml` | GET | — | — | ❌ | Same source as RSS |
| `/feed.json` | GET | — | — | ❌ | JSON Feed 1.1 |
| `/og/[slug].png` | GET | — | RL_OG 30/60s | ❌ | `@cf-wasm/og`, cached 1 day |
| `/api/webhooks/[source]` | POST | HMAC sig | — | ❌ | Signature-verified; writes `webhook_events` |
| `/.well-known/security.txt` | GET | — | — | ❌ | Static text |

### Spectral / vacuum governance
We are **deferring formal API governance** until we publish an OpenAPI spec for external consumers (currently none exist — everything is either same-origin server functions or static feeds). **When that day comes, use vacuum** (Spectral-ruleset-compatible, MIT, Go binary, ~10× faster than Spectral CLI). Track this as `BDS-API-GOV` in the planning backlog.

### STRIDE Security Analysis — API Layer
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Forged webhook from "GitHub" | HMAC signature verification (`X-Hub-Signature-256`) against secret stored via `wrangler secret`; reject on mismatch; log to `webhook_events.signature_ok=0` |
| **Tampering** | Tampered Turnstile token | Server-side verify against `https://challenges.cloudflare.com/turnstile/v0/siteverify`; token single-use (Cloudflare enforces `timeout-or-duplicate`) |
| **Repudiation** | Submitter denies contact | D1 row + Resend message ID retained 90 days |
| **Info Disclosure** | Verbose error responses leak internals | All handlers return `{ error: 'code' }` enum-only; stack traces only in Sentry |
| **DoS** | Burst on contact form | Layered: Turnstile + Rate Limiting binding + honeypot + Workers free-tier cap (100k req/day) |
| **DoS** | OG endpoint as image-generation amplifier | Rate-limited (30/60s/IP), `Cache-Control: public, max-age=86400, immutable`, slugs validated against allow-list from velite |
| **Elevation** | Server function escaping to host | Workers V8 isolate boundary; no `eval`, no dynamic `import()` from untrusted input |

### Fitness Functions
```python
# tests/architecture/test_api_layer.py
from pathlib import Path
import json, re

REPO = Path(__file__).resolve().parents[2]

def test_wrangler_declares_rate_limit_bindings():
    cfg = (REPO / "wrangler.jsonc").read_text()
    assert '"ratelimit"' in cfg or "'ratelimit'" in cfg, "Rate limit binding required"
    assert "RL_CONTACT" in cfg

def test_secrets_not_in_repo():
    forbidden = ["RESEND_API_KEY=", "TURNSTILE_SECRET=", "SENTRY_DSN=https://"]
    for f in REPO.rglob("*.env*"):
        body = f.read_text()
        for s in forbidden:
            assert s not in body or "EXAMPLE" in f.name.upper(), f"Secret leaked in {f}"

def test_all_state_mutating_routes_use_secure_action():
    """Any handler under src/routes/api with POST must import defineSecureAction or verify signature."""
    api = REPO / "src/routes/api"
    if not api.exists(): return
    offenders = []
    for f in api.rglob("*.ts"):
        body = f.read_text()
        if re.search(r"method:\s*['\"]POST", body) or "export const POST" in body:
            if "defineSecureAction" not in body and "verifySignature" not in body:
                offenders.append(f.relative_to(REPO).as_posix())
    assert not offenders, f"Unprotected POST in: {offenders}"

def test_og_route_has_cache_control():
    og = REPO / "src/routes/og"
    if not og.exists(): return
    for f in og.rglob("*.ts"):
        body = f.read_text()
        assert "Cache-Control" in body and "max-age" in body, f"OG route missing cache: {f}"
```

### Research References
- `research/granlund-grove-security-ops/analysis.md` §1–§3 (Turnstile, rate limit, Spectral)

---

## ADR-004 — Security Hardening: nonce-based CSP, security.txt, observability, secrets

**Status:** Proposed

### Context and Problem Statement
The current `_headers` file has solid baseline headers but its CSP includes `'unsafe-inline'` in `script-src`, which effectively negates the script-XSS protection. We also lack a security.txt, modern Permissions-Policy denylist, error observability, and an explicit secret-management discipline.

### Decision Drivers
- **D1.** CSP must actually block injected scripts.
- **D2.** Permissions-Policy must deny privacy-invasive APIs by default (FLoC/Topics, etc.).
- **D3.** Operational visibility (errors, slow paths) without paid SaaS minimum.
- **D4.** A documented, reproducible secret-handling pattern.
- **D5.** Public security contact per RFC 9116.

### Considered Options
1. **Keep `_headers` static CSP** — Simple but cannot inject per-request nonces; forces `'unsafe-inline'`. Rejected.
2. **Move CSP generation into `src/server.ts`** (per-request) — Can inject `nonce-` for each response; combine with `'strict-dynamic'` per [web.dev/strict-csp]. ← chosen
3. **Use a third-party CSP middleware** — Overkill at our scale.

### Decision Outcome
- **CSP** is generated per-request in `src/server.ts` with a fresh nonce; `<script>` and `<style>` tags emitted by TanStack Start must propagate the nonce (use `Scripts nonce={nonce}` if supported, otherwise fall back to `'strict-dynamic'` allow). `style-src` retains `'unsafe-inline'` (Radix and `cmdk` inject runtime styles; Tailwind v4 has no nonce path — accept this tradeoff and document).
- **Permissions-Policy** denylist expanded with `browsing-topics=()`, `interest-cohort=()`, `attribution-reporting=()`, `private-state-token-issuance=()`, `private-state-token-redemption=()`, `unload=()`.
- **COOP/COEP/CORP** intentionally **not** set — we don't use SharedArrayBuffer; cross-origin isolation would break embeds we may add later (e.g., YouTube case-study clips).
- **SRI** intentionally not used — all assets are same-origin Vite chunks; SRI on a build-hashed self-hosted asset is no additional security.
- **security.txt** at `public/.well-known/security.txt` per RFC 9116, with `Contact:`, `Expires:` (1-year horizon), `Preferred-Languages: en`, and a `Canonical:` line.
- **Observability** enabled in `wrangler.jsonc` (`observability.enabled = true`) — 200k events/day free, 3-day retention. Sentry layered on top for stack traces & release tagging.
- **Secrets** managed via `wrangler secret put` only. Document required secrets in `SECURITY.md` + `.env.example` (no values). CI uses GitHub Environment secrets injected at deploy.

#### Consequences
- **Good:** CSP score moves from "broken" (unsafe-inline scripts) to "strong" (nonce + strict-dynamic).
- **Good:** Permissions-Policy denies privacy-invasive browser APIs we don't use.
- **Good:** Free observability covers incident triage.
- **Bad:** Nonce generation in SSR requires server-rendered HTML to be uncached per-request (acceptable — TanStack Start is SSR anyway).
- **Bad:** `style-src 'unsafe-inline'` remains — documented limitation of current React component ecosystem.

### Sketched `src/server.ts` CSP injection (pseudo-sketch — Husky implements)
```ts
// Per-request nonce; inject into Headers + into a context the React tree can read for <script nonce=>
function buildCsp(nonce: string) {
  return [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    `style-src 'self' 'unsafe-inline'`,                           // documented: Radix/cmdk runtime styles
    `font-src 'self'`,
    `img-src 'self' data: blob:`,
    `connect-src 'self' https://challenges.cloudflare.com https://*.sentry.io`,
    `frame-src https://challenges.cloudflare.com`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `base-uri 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join('; ')
}
```

### `public/.well-known/security.txt`
```
Contact: mailto:security@tygranlund.com
Expires: 2026-11-15T00:00:00.000Z
Preferred-Languages: en
Canonical: https://tygranlund.com/.well-known/security.txt
Policy: https://tygranlund.com/privacy
```

### STRIDE Security Analysis — Hardening
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Subdomain takeover / cert mismatch | HSTS preload (already set); explicit `Canonical:` in security.txt |
| **Tampering** | XSS via injected `<script>` | Nonce CSP with `'strict-dynamic'` — only nonce'd or nonce-chain-loaded scripts execute |
| **Repudiation** | Incident response without logs | Workers observability + Sentry with 90-day retention captures stack traces |
| **Info Disclosure** | Browsing-topics / FLoC sharing visitor cohort | Permissions-Policy denies; documented in privacy page |
| **Info Disclosure** | Secrets in repo / build artifacts | Wrangler secrets only; `gitleaks` (optional) in CI; `.env.example` contains keys-only |
| **DoS** | Worker crash loop leaking quota | Sentry alerts on error rate; release tags allow fast rollback via Workers Versions API |
| **Elevation** | Permissive iframe embed | `frame-ancestors 'none'` (already) + `X-Frame-Options: DENY` (already) |

### Fitness Functions
```python
# tests/architecture/test_security.py
from pathlib import Path
import re

REPO = Path(__file__).resolve().parents[2]

def test_security_txt_exists_with_required_fields():
    p = REPO / "public/.well-known/security.txt"
    assert p.exists(), "security.txt missing"
    body = p.read_text()
    assert re.search(r"^Contact:", body, re.MULTILINE)
    assert re.search(r"^Expires:", body, re.MULTILINE)

def test_csp_no_unsafe_inline_in_script_src():
    """CSP is generated in server.ts; static _headers must NOT include unsafe-inline in script-src."""
    headers = (REPO / "public/_headers").read_text()
    # script-src section must not contain unsafe-inline
    m = re.search(r"script-src([^;]+)", headers)
    if m:
        assert "'unsafe-inline'" not in m.group(1), "CSP script-src must drop 'unsafe-inline'"

def test_wrangler_has_observability_enabled():
    cfg = (REPO / "wrangler.jsonc").read_text()
    assert re.search(r'"observability"\s*:\s*\{\s*"enabled"\s*:\s*true', cfg), \
        "Enable observability in wrangler.jsonc"

def test_permissions_policy_denies_topics_and_interest_cohort():
    body = (REPO / "public/_headers").read_text()
    assert "browsing-topics=()" in body
    assert "interest-cohort=()" in body
```

### Co-sign requested
**Security Auditor** must review:
- CSP allow-list (Cloudflare Challenges, Sentry ingest domain)
- security.txt fields
- Nonce propagation in SSR — verify no React-rendered inline scripts escape the nonce path

### Research References
- `research/granlund-grove-security-ops/analysis.md` §4 (CSP), §5 (Permissions-Policy), §security.txt

---

## ADR-005 — Observability & Analytics: CF Web Analytics + Sentry + Analytics Engine RUM + Better Stack

**Status:** Proposed

### Context and Problem Statement
Tyler needs to know what's happening on the site without compromising visitor privacy and without paying for SaaS. Four observability dimensions: traffic analytics, error monitoring, Real User Monitoring (Core Web Vitals), and uptime.

### Decision Drivers
- **D1.** Privacy-first — cookieless, no PII, GDPR/CCPA defensible.
- **D2.** Free tier covers expected scale (single-digit thousands of visits/month).
- **D3.** Minimal client JS weight.
- **D4.** Alerts to email/Slack on real incidents.

### Decision Outcome
| Need | Pick | Why |
|---|---|---|
| Traffic analytics | **Cloudflare Web Analytics** | Free; cookieless; already includes LCP/INP/CLS; no DPA needed for processor since CF is the host |
| Error monitoring | **`@sentry/cloudflare` (official SDK)** + **`@sentry/vite-plugin`** for source maps | Free 5k errors/mo; stack traces; release tagging |
| RUM custom dims | **`web-vitals@^5.2.0` → Cloudflare Analytics Engine** | Free 100k writes/day; queryable via SQL API; 3-month retention |
| Uptime | **Better Stack** | Free: 10 monitors, 30s interval, 1 status page (beats UptimeRobot's 5-min) |

#### Consequences
- **Good:** End-to-end observability for $0.
- **Good:** Sentry release tagging lets us correlate a 5xx spike to a specific deployed version (and roll back via Workers Versions API).
- **Bad:** Sentry adds ~30 KB to the worker bundle (within the 3 MB limit but not free).
- **Bad:** Cloudflare Web Analytics has limited per-path drill-down compared to Plausible — accepted tradeoff for $0.

### Sketched RUM emit (client)
```ts
// src/lib/rum.ts
import { onLCP, onINP, onCLS, onTTFB, onFCP } from 'web-vitals'

const send = (metric: { name: string; value: number; id: string; rating: string }) => {
  navigator.sendBeacon('/api/rum', JSON.stringify({
    name: metric.name, value: metric.value, id: metric.id, rating: metric.rating,
    path: location.pathname, conn: (navigator as any).connection?.effectiveType ?? 'unknown',
  }))
}

onLCP(send); onINP(send); onCLS(send); onTTFB(send); onFCP(send)
```

```ts
// src/routes/api/rum.ts — receives beacon, writes Analytics Engine
export const POST = async (req: Request, env: Env) => {
  const m = await req.json()
  env.ANALYTICS.writeDataPoint({
    blobs: [m.name, m.path, m.rating, m.conn ?? ''],
    doubles: [m.value],
    indexes: [m.id],
  })
  return new Response(null, { status: 204 })
}
```

### STRIDE Security Analysis — Observability
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Forged RUM beacons inflating metrics | Cheap problem; rate-limit binding on `/api/rum`; ignore; no business impact |
| **Tampering** | Sentry DSN leak letting attacker inject events | DSN is public by design; tag releases; Sentry has spike protection |
| **Repudiation** | Lost error context | `release` tag + `git sha` injected at build via Sentry vite plugin |
| **Info Disclosure** | PII in Sentry breadcrumbs (user typed contact form) | Sentry `beforeSend` scrubs `email`, `message`, `name`, `phone` from breadcrumbs |
| **DoS** | RUM endpoint flooded | Rate-limit binding 30/60s/IP; Analytics Engine 100k writes/day cap is hard ceiling |
| **Elevation** | Sentry source-map exposure | Source maps uploaded to Sentry, NOT served publicly (Vite config sets `sourcemap: 'hidden'`) |

### Fitness Functions
```python
# tests/architecture/test_observability.py
from pathlib import Path
import re

REPO = Path(__file__).resolve().parents[2]

def test_sentry_dsn_loaded_from_env_not_hardcoded():
    for f in REPO.rglob("*.ts"):
        if "/node_modules/" in str(f) or "/.velite/" in str(f): continue
        body = f.read_text(errors="ignore")
        assert not re.search(r"https://[0-9a-f]+@o\d+\.ingest\.sentry\.io", body), \
            f"Hardcoded Sentry DSN in {f}"

def test_vite_config_hidden_sourcemaps():
    vc = (REPO / "vite.config.ts").read_text()
    if "sentry" in vc.lower():
        assert "hidden" in vc, "Use sourcemap: 'hidden' to avoid public source maps"

def test_rum_route_has_rate_limit():
    rum = REPO / "src/routes/api/rum.ts"
    if rum.exists():
        body = rum.read_text()
        assert "RL_" in body or "limit(" in body, "RUM route must be rate-limited"

def test_pii_scrubbed_from_sentry_breadcrumbs():
    sentry_init = list((REPO / "src").rglob("sentry*.ts"))
    if sentry_init:
        body = sentry_init[0].read_text()
        assert "beforeSend" in body, "Sentry must scrub PII via beforeSend"
```

### Research References
- `research/granlund-grove-security-ops/analysis.md` §5–§8

---

## ADR-006 — CI/CD: Workers Builds (deploy) + GitHub Actions (quality gates)

**Status:** Proposed

### Context and Problem Statement
Deploys are currently manual via `wrangler`. We need: per-PR preview URLs, gated promotion to production, fast rollback, and quality gates (lint/typecheck/test/lighthouse) that fail closed.

### Decision Drivers
- **D1.** Per-PR preview URLs (visual + functional review).
- **D2.** Fail-closed quality gates before any deploy.
- **D3.** Atomic rollback.
- **D4.** Minimal GitHub Actions secret surface.

### Considered Options
1. **`cloudflare/wrangler-action@v3`** invoked from GitHub Actions for everything (build + deploy). Forces us to store a CF API token in GH secrets.
2. **Cloudflare Workers Builds** (native Git integration) for build & deploy + per-PR preview URLs; GitHub Actions runs only quality gates and **does not deploy**. ← chosen
3. **Hybrid** — Workers Builds for prod, GH Actions for preview — duplication.

### Decision Outcome
- **Connect repo to Workers Builds.** Workers Builds handles `wrangler versions upload` on every non-default branch (auto preview URL `<version-prefix>-granlund-grove.workers.dev`) and `wrangler deploy` on `main`.
- **GitHub Actions runs quality gates only**: `lint → typecheck → vitest → playwright (chromium + webkit) → axe → lhci (against the Workers preview URL emitted by Workers Builds)`.
- **No CF API token in GitHub.** Reduces secret surface materially.
- **Rollback** via `wrangler versions rollback` (Workers Versions API is atomic — picks the previous immutable version).
- **Branch protection:** `main` requires PR, status checks green (lint, typecheck, unit, e2e, axe, lhci), 1 review (or admin override for solo dev with explicit annotation).

#### Consequences
- **Good:** Zero CF credentials in GitHub; preview URLs free.
- **Good:** Fast rollback (one command, no rebuild).
- **Bad:** Workers Builds preview URLs don't expose Workers Logs (per CF docs — Workers Builds limitation); use a "Preview Smoke" job in GH Actions that runs a Playwright sanity suite against the preview URL after Workers Builds reports success (via deploy webhook or polling).
- **Bad:** Two CI systems (Workers Builds + GH Actions). Mitigated by clear ownership: Workers Builds = artifact/deploy; GH Actions = test/gate.

### Sketched `.github/workflows/ci.yml`
```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bunx tsc --noEmit
      - run: bun run test            # vitest
      - run: bunx playwright install --with-deps chromium webkit
      - run: bun run test:e2e        # playwright (against `bun run preview` local server)
      - run: bun run test:a11y       # @axe-core/playwright sweeps
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: playwright-report, path: playwright-report/ }

  lighthouse:
    needs: quality
    if: github.event_name == 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Wait for Workers Builds preview URL
        id: preview
        run: |
          # Poll CF API for the preview URL associated with this PR's HEAD sha
          # (alternative: trigger lhci on push to PR branch via Workers Builds webhook → repository_dispatch)
          echo "url=https://${GITHUB_HEAD_REF//\//-}-granlund-grove.workers.dev" >> $GITHUB_OUTPUT
      - uses: treosh/lighthouse-ci-action@v12
        with:
          urls: ${{ steps.preview.outputs.url }}
          configPath: ./lighthouserc.json
          uploadArtifacts: true
```

### Sketched `lighthouserc.json` (budgets)
```json
{
  "ci": {
    "collect": { "numberOfRuns": 3, "settings": { "preset": "desktop" } },
    "assert": {
      "assertions": {
        "categories:performance":   ["error", { "minScore": 0.95 }],
        "categories:accessibility": ["error", { "minScore": 1.00 }],
        "categories:best-practices":["error", { "minScore": 1.00 }],
        "categories:seo":           ["error", { "minScore": 1.00 }],
        "largest-contentful-paint": ["error", { "maxNumericValue": 2500 }],
        "cumulative-layout-shift":  ["error", { "maxNumericValue": 0.10 }],
        "interaction-to-next-paint":["error", { "maxNumericValue": 200  }],
        "total-blocking-time":      ["error", { "maxNumericValue": 200  }],
        "resource-summary:script:size":     ["error", { "maxNumericValue": 175000 }],
        "resource-summary:stylesheet:size": ["error", { "maxNumericValue":  50000 }],
        "resource-summary:font:size":       ["error", { "maxNumericValue": 120000 }]
      }
    }
  }
}
```

### STRIDE Security Analysis — CI/CD
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Malicious PR triggers privileged workflow | `pull_request` (not `pull_request_target`); no secret access in PR runs; preview URL via Workers Builds (no GH secrets needed) |
| **Tampering** | Compromised dependency at build time | `bun install --frozen-lockfile`; Dependabot weekly; optional `bun audit` |
| **Repudiation** | Unknown who deployed | Workers Versions API records every version with git sha; Sentry release tags the same sha |
| **Info Disclosure** | Build logs leaking secrets | No secrets in GH Actions; CF secrets stay in Workers Secrets |
| **DoS** | Bot floods PRs to exhaust GH Actions minutes | GitHub `concurrency.cancel-in-progress: true` on PR; CODEOWNERS gates Workflow file edits |
| **Elevation** | Branch protection bypass | `main` requires PR + green checks; admin override requires written justification in PR body (audit trail) |

### Fitness Functions
```python
# tests/architecture/test_cicd.py
from pathlib import Path
import yaml, json

REPO = Path(__file__).resolve().parents[2]

def test_ci_workflow_exists_and_runs_quality_gates():
    wf = REPO / ".github/workflows/ci.yml"
    assert wf.exists(), "Missing .github/workflows/ci.yml"
    content = wf.read_text()
    for gate in ["lint", "tsc", "test", "playwright", "axe"]:
        assert gate in content, f"CI missing {gate}"

def test_lighthouse_budgets_exist():
    lh = REPO / "lighthouserc.json"
    assert lh.exists()
    cfg = json.loads(lh.read_text())
    a = cfg["ci"]["assert"]["assertions"]
    assert a["categories:performance"][1]["minScore"] >= 0.90
    assert a["largest-contentful-paint"][1]["maxNumericValue"] <= 2500
    assert a["cumulative-layout-shift"][1]["maxNumericValue"] <= 0.10

def test_no_cf_api_token_referenced_in_workflows():
    """We deploy via Workers Builds — GH Actions must NOT reference CF tokens."""
    wf_dir = REPO / ".github/workflows"
    if not wf_dir.exists(): return
    for wf in wf_dir.glob("*.yml"):
        body = wf.read_text()
        assert "CLOUDFLARE_API_TOKEN" not in body, f"Remove CF token from {wf}"
        assert "wrangler-action" not in body, f"Do not deploy via wrangler-action (use Workers Builds)"
```

### Research References
- `research/granlund-grove-cicd-testing/analysis.md` §1 (Workers Builds), §3 (LHCI budgets)

---

## ADR-007 — Testing Strategy: Vitest + Playwright + axe + LHCI, grown feature-by-feature

**Status:** Proposed

### Context and Problem Statement
Owner explicitly wants E2E testing built **alongside every feature**. We need a pyramid that's strict enough to enforce best-in-class but lean enough that a solo dev maintains it gladly. Visual regression, accessibility, and performance must be CI-gated.

### Decision Drivers
- **D1.** E2E coverage grows with the backlog (each `BDS-*` story closes with at least one new Playwright spec).
- **D2.** WCAG 2.2 AA compliance — verified automatically.
- **D3.** Cross-browser parity (Chromium + WebKit at minimum; Firefox optional).
- **D4.** Visual regression without paid SaaS.
- **D5.** Low flake rate — solo devs abandon flaky suites fast.

### Decision Outcome — the pyramid
| Layer | Tool | Scope | Run when |
|---|---|---|---|
| **Unit** | Vitest | `src/lib/`, `src/server/` pure functions, Zod schemas | Every commit |
| **Component** | Vitest + `@testing-library/react` + jsdom | UI components in `src/components/` (interaction, a11y attrs) | Every commit |
| **Integration** | Vitest + MSW v2 | Server functions with mocked D1/KV via miniflare bindings or MSW | Every commit |
| **E2E** | Playwright (Chromium + WebKit) | User journeys against `bun run preview` (or Workers preview URL) | Every PR |
| **Visual regression** | Playwright `toHaveScreenshot()` | Key viewports per route (mobile 390, tablet 768, desktop 1280) | Every PR; baselines in `tests/e2e/__screenshots__/` |
| **Accessibility** | `@axe-core/playwright` with WCAG 2.2 AA tags | Every E2E spec asserts no axe violations on key pages | Every PR |
| **Performance** | `@lhci/cli` against Workers preview URL | LCP/CLS/INP + bundle size budgets | Every PR |

### Visual regression — why **not** Lost Pixel / Chromatic
- **Lost Pixel** — last release stale (~18 months at the time of research); abandonment risk for a solo project.
- **Chromatic** — Storybook-coupled; free tier (5k snaps/mo) is generous but the paid tier ($149/mo) is overkill.
- **Playwright `toHaveScreenshot()`** — Free, in-repo, deterministic enough when locked to a single Linux/Chromium runner image in CI. Differences are diffed visually in the Playwright HTML report. Baselines tracked in git.

### Required E2E scenarios at launch (BDS backlog seeds)
| ID | Spec | Asserts |
|---|---|---|
| E2E-001 | `home.spec.ts` | Hero renders, nav reachable, skip-link works, axe passes |
| E2E-002 | `contact-happy.spec.ts` | Form submits with Turnstile stub, success toast, D1 row exists (via test API helper) |
| E2E-003 | `contact-spam.spec.ts` | Honeypot fill → soft success, no D1 row; rate-limit returns 429 on 6th submit |
| E2E-004 | `rss-and-feeds.spec.ts` | `/rss.xml`, `/atom.xml`, `/feed.json` parse, contain latest post |
| E2E-005 | `og-image.spec.ts` | `/og/<slug>.png` returns PNG, dimensions 1200×630, cache header present |
| E2E-006 | `case-study.spec.ts` | `/case-studies/<slug>` renders MDX, JSON-LD CreativeWork present |
| E2E-007 | `writing-index.spec.ts` | `/writing` lists posts sorted desc, drafts hidden in prod |
| E2E-008 | `a11y-sweep.spec.ts` | Every public route hit by axe with WCAG 2.2 AA tags, zero violations |
| E2E-009 | `404.spec.ts` | Unknown URL returns custom 404, semantically `<h1>` |
| E2E-010 | `visual-baselines.spec.ts` | `toHaveScreenshot()` at 3 viewports for every top-level route |

**Backlog rule (enforced via PR template):** every `BDS-*` story closes with one or more new Playwright specs referencing the BDS ID in the test title; CI checks this with a grep.

### Sketched Playwright config
```ts
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: [['html', { open: 'never' }], ['github']],
  use: {
    baseURL: process.env.PREVIEW_URL ?? 'http://127.0.0.1:4173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01 } },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'webkit',   use: devices['Desktop Safari'] },
    { name: 'mobile-chromium', use: devices['Pixel 7'] },
  ],
  webServer: process.env.PREVIEW_URL ? undefined : {
    command: 'bun run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI,
  },
})
```

### Sketched axe sweep (reused in every spec)
```ts
// tests/e2e/_axe.ts
import AxeBuilder from '@axe-core/playwright'
export async function expectNoA11yViolations(page) {
  const r = await new AxeBuilder({ page })
    .withTags(['wcag2a','wcag2aa','wcag21aa','wcag22aa'])
    .analyze()
  expect(r.violations, JSON.stringify(r.violations, null, 2)).toEqual([])
}
```

#### Consequences
- **Good:** Single tool family (Vitest + Playwright) covers unit → E2E.
- **Good:** Visual baselines tracked in repo — no vendor lock.
- **Good:** Axe sweeps inside Playwright = WCAG 2.2 AA enforced on real rendered DOM.
- **Bad:** Visual baselines are cross-OS sensitive — pin CI to a single Linux image and document local-vs-CI baseline regeneration in `CONTRIBUTING.md`.
- **Bad:** Playwright cold install in CI is ~1 min; cache via `actions/cache` keyed on Playwright version.

### STRIDE Security Analysis — Testing
| Threat | Vector | Mitigation |
|---|---|---|
| **Spoofing** | Test secrets in `.env.test` leaked | `.env.test` gitignored; test secrets are stubs |
| **Tampering** | Visual baselines silently updated | Baselines reviewed in PR diff; CODEOWNERS on `tests/e2e/__screenshots__/` |
| **Repudiation** | Flaky test passed/failed history lost | Playwright traces uploaded as artifacts, retained 14 days |
| **Info Disclosure** | E2E test stores real PII (e.g., real email) | Test fixtures use `@example.com` only; pre-commit hook blocks real-domain emails in `tests/` |
| **DoS** | E2E suite balloons runtime | CI shards Playwright across 2 workers; tag `@slow` for long tests; nightly full suite, PR runs critical subset |
| **Elevation** | Test runner with prod CF creds | Tests target preview URL (no prod credentials); D1 test data uses ephemeral DB |

### Fitness Functions
```python
# tests/architecture/test_testing_pyramid.py
from pathlib import Path
import re

REPO = Path(__file__).resolve().parents[2]

def test_playwright_config_exists():
    assert (REPO / "playwright.config.ts").exists()

def test_axe_helper_exists():
    assert (REPO / "tests/e2e/_axe.ts").exists() or \
           any("AxeBuilder" in f.read_text() for f in (REPO/"tests/e2e").glob("*.ts"))

def test_every_e2e_spec_references_bds_id():
    """Each *.spec.ts must mention at least one BDS-XXX or E2E-XXX id."""
    e2e = REPO / "tests/e2e"
    if not e2e.exists(): return
    bad = []
    for spec in e2e.glob("*.spec.ts"):
        body = spec.read_text()
        if not re.search(r"(BDS|E2E)-\d{3,}", body):
            bad.append(spec.name)
    assert not bad, f"Specs missing backlog/E2E id: {bad}"

def test_lhci_in_ci_workflow():
    wf = REPO / ".github/workflows/ci.yml"
    if wf.exists():
        assert "lighthouse" in wf.read_text().lower(), "LHCI must run in CI"

def test_visual_baselines_have_codeowner():
    co = REPO / ".github/CODEOWNERS"
    if co.exists():
        assert "tests/e2e/__screenshots__" in co.read_text(), "Lock visual baselines via CODEOWNERS"
```

### Research References
- `research/granlund-grove-cicd-testing/analysis.md` §4 (Playwright), §5 (visual regression), §6 (axe), §7 (Vitest+RTL+React 19), §8 (MSW)

---

## ADR-008 — Tech selection finalization & open questions

**Status:** Proposed

### Final stack additions (one-line each)

```
# Content
velite

# Runtime
@marsidev/react-turnstile resend

# Edge utilities
@cf-wasm/og feed web-vitals

# Observability
@sentry/cloudflare @sentry/vite-plugin

# Test
vitest @testing-library/react @testing-library/jest-dom jsdom @vitest/coverage-v8
msw
@playwright/test @axe-core/playwright
@lhci/cli

# Lint (optional, deferred)
# vacuum (Go binary, install via brew/asdf when OpenAPI spec exists)
```

### Cost estimate (steady state)
| Service | Free tier | Expected use | Margin |
|---|---|---|---|
| Cloudflare Workers | 100k req/day | <2k req/day | 50× |
| Cloudflare D1 | 5M reads + 100k writes /day, 5 GB | <100 writes/day | 1,000× |
| Cloudflare KV | 100k reads + 1k writes /day | <100/day | 10× |
| Cloudflare R2 | 10 GB | <2 GB media | 5× |
| Cloudflare Turnstile | unlimited | <500/day | ∞ |
| Cloudflare Analytics Engine | 100k writes + 10k queries /day | <10k beacons/day | 10× |
| Sentry | 5k errors/mo | <50/mo | 100× |
| Resend | 3k emails/mo | <50/mo | 60× |
| Better Stack | 10 monitors, 30s | 3-5 monitors | comfortable |
| **TOTAL** | — | — | **$0 / mo** |

First paid threshold likely: Sentry at >5k errors/mo ($26/mo) — only if a runaway bug ships. Aggressive `beforeSend` filter + release tagging mitigates.

### Open questions (for the owner / Experience Architect / Security Auditor)
1. **Domain for email send-from**: Resend requires a verified domain. Confirm `tygranlund.com` SPF/DKIM/DMARC plan.
2. **Newsletter** in scope for v1 or v2? Affects ADR-002 schema (`subscribers` table) and ADR-003 (`subscribeNewsletter` server fn).
3. **Confidential case studies** — what's the redaction policy? (Affects ADR-001 schema enforcement.)
4. **Search UX** — Cmd-K palette via `cmdk` (already a dep) feeding `searchContent` server fn over `.velite/` index — confirm with Experience Architect.
5. **Decap CMS later** — Yes/no for browser-based editing on top of Velite? (Not needed at launch.)

### Decision dependency graph
```
ADR-006 (CI/CD)  ──┐
ADR-007 (Testing) ─┼──→ ADR-001 (Content) ──→ ADR-003 (API) ──→ ADR-005 (Observability)
ADR-004 (Security)─┘                      ↗
                     ADR-002 (Data) ──────┘
```
Implementation must respect this DAG. ADR-006/007 land first (otherwise we can't gate changes); ADR-004 second (so all subsequent code inherits hardened headers); content/data/api roll out together.

### Co-sign requests
- **Security Auditor**: review STRIDE tables in ADR-001 through ADR-007; specifically ratify the `style-src 'unsafe-inline'` documented compromise in ADR-004, and the IP-hashing salt rotation policy in ADR-002.
- **Experience Architect**: review the API contract surface in ADR-003 (server function inputs/outputs) and the search/Cmd-K hook in §Open questions.
- **Planning Agent**: ingest §Migration sequencing into `docs/planning/backlog/` as BDS-001 through BDS-040 (one-to-one with sub-bullets where reasonable).
- **Husky / Code-puppy**: implementer — start with ADR-006 + ADR-007 scaffolding before any feature code.

---

## Appendix A — File tree the implementer should produce

```
granlund-grove/
├── content/                            # ← NEW (ADR-001)
│   ├── writing/
│   ├── case-studies/
│   ├── projects/
│   ├── career/
│   └── now/
├── docs/
│   ├── research/
│   │   └── solutions-architect-findings.md   # ← this file
│   └── planning/                       # ← NEW (ADR-002 planning DB)
│       ├── adrs/
│       ├── backlog/
│       ├── sprints/
│       ├── decisions/
│       └── schema/planning.velite.ts
├── migrations/                         # ← NEW (ADR-002)
│   └── 0001_init.sql
├── public/
│   ├── _headers                        # tightened (ADR-004)
│   └── .well-known/security.txt        # ← NEW (ADR-004)
├── src/
│   ├── server.ts                       # CSP nonce injection (ADR-004)
│   ├── server/
│   │   ├── secure-action.ts            # ← NEW (ADR-003)
│   │   ├── turnstile.ts
│   │   ├── resend.ts
│   │   └── d1.ts
│   ├── lib/
│   │   ├── rum.ts                      # ← NEW (ADR-005)
│   │   └── sentry.ts
│   └── routes/
│       ├── api/
│       │   ├── rum.ts
│       │   └── webhooks/[source].ts
│       ├── og/[slug][.]png.ts
│       ├── rss[.]xml.ts
│       ├── atom[.]xml.ts
│       ├── feed[.]json.ts
│       ├── writing/index.tsx
│       ├── writing/$slug.tsx
│       ├── case-studies/$slug.tsx
│       └── now.tsx
├── tests/
│   ├── architecture/                   # ← NEW pytest fitness functions
│   │   ├── test_content_layer.py
│   │   ├── test_data_layer.py
│   │   ├── test_api_layer.py
│   │   ├── test_security.py
│   │   ├── test_observability.py
│   │   ├── test_cicd.py
│   │   └── test_testing_pyramid.py
│   ├── unit/                           # vitest
│   ├── integration/                    # vitest + msw
│   └── e2e/                            # playwright
│       ├── _axe.ts
│       ├── home.spec.ts
│       └── __screenshots__/            # locked via CODEOWNERS
├── velite.config.ts                    # ← NEW
├── playwright.config.ts                # ← NEW
├── lighthouserc.json                   # ← NEW
├── vitest.config.ts                    # ← NEW
└── .github/
    ├── workflows/ci.yml                # quality gates only (ADR-006)
    ├── CODEOWNERS
    └── pull_request_template.md        # enforces BDS-id linkage
```

---

## Appendix B — How agents consume this report

- **Planning Agent**: read this file + `docs/planning/schema/planning.velite.ts`. Convert §Migration sequencing into individual `BDS-*` MDX files under `docs/planning/backlog/`.
- **Security Auditor**: review the eight STRIDE tables. Co-sign by appending a section "Security Auditor sign-off" to this file with date + caveats.
- **Experience Architect**: cross-reference the API contracts in ADR-003 and the route inventory in Appendix A. Produce a parallel UX findings doc for the frontend side.
- **Husky** (implementer): implement ADRs in dependency order; never skip a fitness function; every PR must reference an ADR + a BDS id.
- **Watchdog / qa-kitten**: execute the E2E specs in ADR-007 against every preview URL; report flake rates weekly.

---

*End of findings. — Solutions Architect 🏛️ (solutions-architect-63fdc4)*
