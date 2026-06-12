# Recommendations — Granlund Grove (Nov 2025)

Project: TanStack Start 1.167 + React 19.2 + Vite 7 + Tailwind 4 + Cloudflare Workers (workerd, `nodejs_compat`). SSR in Workers; **no Node host, no Pages/Functions, no Next.js**.

---

## 1. Content layer (MDX / structured content)

**Pick: Velite** — with raw `@mdx-js/rollup` as the documented fallback.

### Why
- Zod-schema-validated content fits your existing Zod 3.x stack like a glove.
- Runs at `vite build` only → ships pure JSON/TS to the Worker → **zero Workers-runtime risk**.
- Actively maintained (push within the last week as of May 2026).
- Contentlayer (orig) is dormant; contentlayer2 is stale ~6 mo as of Nov 2025. Don't bet on either.

### Action items
1. `bun add -D velite` and `bun add gray-matter` (if mixing manual frontmatter anywhere).
2. Create `velite.config.ts` with collections (e.g., `posts`, `projects`) — Zod schemas.
3. Add Velite to the Vite pipeline via its Vite plugin OR a `prebuild` script.
4. Import generated content as `import { posts } from "@/.velite"` in route loaders.
5. **Pin exact version** in `package.json` (no caret) until 1.0.
6. Document the **raw MDX fallback** in `docs/content-layer.md` so a future maintainer can swap if Velite stalls.

### Fallback (low priority, document only)
- `@mdx-js/rollup` + `gray-matter` + `import.meta.glob('/content/**/*.mdx', { eager: true })` + a hand-written Zod parse step. ~80 LOC, zero third-party data layer. Use only if Velite stalls.

---

## 2. Editorial CMS (only if needed)

**For now: don't add one.** Author content as MDX files in the repo, push via PR.

**If a non-dev editor needs UI later:**
- **First choice — Decap CMS.** Git-based, OSS, active (push 2026-05-20), runs as a static SPA from your Worker. Content lands in the repo and is consumed by Velite. Zero new runtime to operate.
- **Second choice — Sanity Free.** If you want richer editing UX and real-time collaboration. Free tier (20 seats / 10k docs / 1M CDN req / 250k API req / 100GB bw) is more than enough. Trade-off: vendor lock-in and runtime fetch from `cdn.sanity.io`.
- **Skip — TinaCMS self-host** (needs Node backend + DB) and **Payload 3.x** (Next.js + Postgres/Mongo + Node runtime; **incompatible with Workers**).

---

## 3. Database / storage primitives

| Use case | Choice | Notes |
|---|---|---|
| Contact form submissions | **D1** (+ Resend email) | See §4. 50/mo is a rounding error against the free tier. |
| Per-visitor lightweight session state | **KV** if you have it; otherwise skip and use signed cookies. | Eventual consistency is fine for sessions. |
| Strong-consistency state (rate limits, counters per IP, real-time) | **Durable Object (SQLite)** | Storage billing starts 2026-01-07 — until then it's free. Free plan eligible. |
| Static assets, og-images, PDFs | **R2** | Egress free. 10 GB/mo free. Bind to Worker via R2 binding. |
| Custom event analytics (pageviews, conversion) | **Workers Analytics Engine** | Free 100k writes/d, 10k queries/d. Currently not billed. 3-mo retention. |
| External Postgres (if any later) | **Hyperdrive** + Neon/Supabase | Don't migrate D1 → Postgres unless you really need Postgres-only features. |

**Do NOT use D1 for:** large blobs, binary assets, full-text search of big corpora.
**Do NOT use KV for:** anything you need to query/list non-trivially, or anything needing read-your-writes.

---

## 4. Contact form — final answer

**Recommended: Resend + D1 (one route, one table, ~30 LOC).**

### Schema
```sql
CREATE TABLE contact_submissions (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  name         TEXT NOT NULL,
  email        TEXT NOT NULL,
  subject      TEXT,
  message      TEXT NOT NULL,
  ip_hash      TEXT,         -- sha256(ip + daily salt), for GDPR-safe rate-limiting
  user_agent   TEXT,
  email_sent_at TEXT
);
CREATE INDEX idx_contact_submitted_at ON contact_submissions(submitted_at DESC);
```

### Handler outline (TanStack Start server route)
```ts
import { Resend } from "resend"; // works under nodejs_compat
import { z } from "zod";

const Submission = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email().max(200),
  subject: z.string().max(200).optional(),
  message: z.string().min(1).max(5000),
});

export const POST = createServerFn(async ({ request, context }) => {
  const env = context.cloudflare.env; // D1 + Resend secret bindings
  const data = Submission.parse(await request.json());

  const { meta } = await env.DB.prepare(
    `INSERT INTO contact_submissions (name, email, subject, message, ip_hash, user_agent)
     VALUES (?, ?, ?, ?, ?, ?)`
  ).bind(
    data.name, data.email, data.subject ?? null, data.message,
    await hashIp(request.headers.get("cf-connecting-ip") ?? ""),
    request.headers.get("user-agent") ?? null
  ).run();

  // Fire-and-forget the email so the user sees a fast response
  context.cloudflare.ctx.waitUntil((async () => {
    const resend = new Resend(env.RESEND_API_KEY);
    await resend.emails.send({
      from: "site@granlundgrove.example",
      to: "ty@example.com",
      subject: `New contact: ${data.subject ?? "(no subject)"}`,
      text: `${data.name} <${data.email}>\n\n${data.message}`,
      reply_to: data.email,
    });
    await env.DB.prepare(
      `UPDATE contact_submissions SET email_sent_at = datetime('now') WHERE id = ?`
    ).bind(meta.last_row_id).run();
  })());

  return { ok: true };
});
```

### Hardening (do before launch)
1. **Cloudflare Turnstile** in front of the form — free, invisible, blocks 99% of bot spam.
2. **Daily rate limit per IP-hash** — 5/day from the same hash → 429. Trivial with a `WHERE submitted_at > date('now','-1 day')` count.
3. **Privacy notice** linking to a route that deletes a submitter's data on request.
4. **Honeypot field** (`<input name="company_website" hidden>`) — reject if non-empty.
5. **Set up a Wrangler scheduled task** to purge submissions older than e.g. 1 year, or move to R2 if you want archival.

### Why not "just Resend"?
You can — and at 5/mo it's defensible. But **adding D1 costs ~$0/mo and ~20 LOC** while giving you (a) a durable audit trail surviving email outages, (b) an easy admin list view at `/admin/contacts`, and (c) spam telemetry. The cost/benefit overwhelmingly favors adding D1.

---

## 5. Compatibility notes

- **`compatibility_date: 2025-09-24`** + `nodejs_compat` is fine for `resend` and most npm libs. Re-bump quarterly to pick up Node API coverage improvements.
- **Bun lockfile is fine in CI**, but Wrangler installs run on Node under the hood. Keep `bun.lock` and `package-lock.json` in sync (you already do).
- **D1 binding** in `wrangler.jsonc`:
  ```jsonc
  "d1_databases": [{
    "binding": "DB",
    "database_name": "granlund-grove",
    "database_id": "<uuid from wrangler d1 create>"
  }]
  ```
- **Secrets** (`RESEND_API_KEY`) via `wrangler secret put RESEND_API_KEY`, never in `wrangler.jsonc`.

---

## 6. Prioritized roadmap

1. **[Now]** Add Velite, migrate any `/content` MDX to it with Zod schemas.
2. **[Now]** Build the contact form on **D1 + Resend** as specified above. Add Turnstile.
3. **[Next 1–2 sprints]** If a non-dev editor needs to write, wire up **Decap CMS** as a static admin route + OAuth proxy Worker. Otherwise skip.
4. **[Later, optional]** Add **Workers Analytics Engine** for custom events (form submits, downloads, etc.).
5. **[Defer indefinitely]** Anything requiring Payload / Tina self-host / Postgres / a Node container.

---

## 7. Re-verify dates

| Topic | When to re-verify |
|---|---|
| D1 read-replication GA | Quarterly (still beta at Nov 2025) |
| Velite still actively maintained | Before each `^` upgrade |
| DO SQLite billing start (2026-01-07) | When DO storage is first used |
| Sanity free-tier quotas | Before adopting Sanity |
| Resend free-tier (3k email/mo) | Annually |
