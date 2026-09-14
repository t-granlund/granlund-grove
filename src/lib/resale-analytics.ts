/**
 * Resale analytics — first-party, cookie-free event tracking + ops dashboard.
 *
 * Endpoints (wired in src/server.ts, before the app handler):
 *   POST /track       → record { kind: "view" | "contact", path, ref }
 *   GET  /resale/ops  → noindex dashboard: views/contacts by item, channel, day
 *
 * Storage: a Durable Object with its own SQLite database (free tier — no
 * account-level resource to create; deploys with the Worker). Singleton DO
 * named "global" holds every event row. Free-tier ceiling is ~100k DO
 * requests/day; a garage sale will not approach that.
 *
 * Privacy: no cookies, no IPs, no fingerprinting. The `?ref=` query param on
 * listing URLs (e.g. /resale/site/…?ref=craigslist) is how the dashboard
 * knows which posted channel is driving attention.
 *
 * The storefront pages carry a tiny inline beacon (navigator.sendBeacon to
 * /track) plus contact-click tracking on every mailto: link.
 */

/* ------------------------------------------------------------------ */
/* Minimal structural types (no @cloudflare/workers-types dependency)  */
/* ------------------------------------------------------------------ */

interface SqlCursor<T> {
  toArray(): Promise<T[]>;
}

interface SqlStorage {
  exec<T = Record<string, unknown>>(query: string, ...values: unknown[]): SqlCursor<T>;
}

interface DurableObjectStorageArea {
  sql: SqlStorage;
  get<T>(key: string): Promise<T | undefined>;
  put<T>(key: string, value: T): Promise<void>;
}

interface DurableObjectState {
  storage: DurableObjectStorageArea;
}

interface DurableObjectId {
  toString(): string;
}

interface DurableObjectNamespace {
  idFromName(name: string): DurableObjectId;
  get(id: DurableObjectId): { fetch(input: string, init?: RequestInit): Promise<Response> };
}

interface ResaleEnv {
  RESALE_ANALYTICS?: DurableObjectNamespace;
}

/* ------------------------------------------------------------------ */
/* Catalog — slug ↔ tracker-id mapping (ids match RESALE data.js)      */
/* ------------------------------------------------------------------ */

const SLUG_TO_ITEM: Record<string, string> = {
  "peloton-bike-plus": "peloton",
  "alienware-aw3423dwf": "alienware",
  "weber-spirit-ng": "weber-grill",
  "craftsman-mower": "craftsman-mower",
  "colamy-chair": "colamy-chair",
};

const ITEM_LABELS: Record<string, string> = {
  peloton: "Peloton Bike+ (bundle)",
  alienware: "Alienware AW3423DWF",
  "weber-grill": "Weber Spirit NG",
  "craftsman-mower": "Craftsman Mower",
  "colamy-chair": "Colamy Chair",
  macbook: "MacBook Air M3",
};

/* ------------------------------------------------------------------ */
/* Durable Object: event log + aggregates in its own SQLite DB         */
/* ------------------------------------------------------------------ */

interface EventRow {
  ts: number;
  kind: string;
  item: string | null;
  ref: string;
  path: string;
}

export class ResaleAnalytics {
  private state: DurableObjectState;

  constructor(state: DurableObjectState, _env: unknown) {
    this.state = state;
    try {
      this.state.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS events (
          id   INTEGER PRIMARY KEY AUTOINCREMENT,
          ts   INTEGER NOT NULL,
          kind TEXT NOT NULL,
          item TEXT,
          ref  TEXT NOT NULL DEFAULT '',
          path TEXT NOT NULL DEFAULT ''
        );
        CREATE INDEX IF NOT EXISTS idx_events_item ON events(item, kind);
        CREATE INDEX IF NOT EXISTS idx_events_ts ON events(ts);
      `);
    } catch {
      /* table already exists on wake-ups — ignore */
    }
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname === "/track" && request.method === "POST") return await this.track(request);
      if (url.pathname === "/stats" && request.method === "GET") return await this.stats();
      return new Response("Not found", { status: 404 });
    } catch (error) {
      console.error("[resale-analytics] DO error:", error);
      return new Response("Internal error", { status: 500 });
    }
  }

  /** Validate + insert one event. Returns 204 regardless of duplicate junk. */
  private async track(request: Request): Promise<Response> {
    const length = Number(request.headers.get("content-length") ?? "0");
    if (length > 2048) return new Response("Payload too large", { status: 413 });

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return new Response("Bad JSON", { status: 400 });
    }

    const { kind, path, ref } = (body ?? {}) as Record<string, unknown>;
    if (kind !== "view" && kind !== "contact") {
      return new Response("Bad kind", { status: 400 });
    }
    const cleanPath = typeof path === "string" && path.startsWith("/") ? path.slice(0, 200) : "";
    if (!cleanPath.startsWith("/resale/")) {
      // Only the resale storefront is instrumented — ignore everything else.
      return new Response(null, { status: 204 });
    }
    const cleanRef =
      typeof ref === "string" ? ref.replace(/[^A-Za-z0-9_-]/g, "").slice(0, 40) : "";
    const item = SLUG_TO_ITEM[cleanPath.replace(/^\/resale\/site\//, "").replace(/\/$/, "")] ?? null;

    this.state.storage.sql.exec(
      "INSERT INTO events (ts, kind, item, ref, path) VALUES (?, ?, ?, ?, ?)",
      Date.now(),
      kind,
      item,
      cleanRef,
      cleanPath,
    );

    await this.pruneIfNeeded();
    return new Response(null, { status: 204 });
  }

  /** Every 500 writes, drop events older than 90 days. Small data, no drama. */
  private async pruneIfNeeded(): Promise<void> {
    const count = ((await this.state.storage.get<number>("writeCount")) ?? 0) + 1;
    await this.state.storage.put("writeCount", count);
    if (count % 500 !== 0) return;
    const cutoff = Date.now() - 90 * 24 * 60 * 60 * 1000;
    this.state.storage.sql.exec("DELETE FROM events WHERE ts < ?", cutoff);
  }

  /** Aggregates for the dashboard. */
  private async stats(): Promise<Response> {
    const day = Date.now() - 24 * 60 * 60 * 1000;
    const week = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const fortnight = Date.now() - 14 * 24 * 60 * 60 * 1000;

    const totals = await this.state.storage.sql
      .exec<{ kind: string; n: number }>(
        "SELECT kind, COUNT(*) AS n FROM events GROUP BY kind",
      )
      .toArray();

    const items = await this.state.storage.sql
      .exec<{
        item: string | null;
        views: number;
        contacts: number;
        views_24h: number;
        views_7d: number;
        last_ts: number | null;
      }>(
        `SELECT item,
                SUM(CASE WHEN kind = 'view'    THEN 1 ELSE 0 END) AS views,
                SUM(CASE WHEN kind = 'contact' THEN 1 ELSE 0 END) AS contacts,
                SUM(CASE WHEN kind = 'view'    AND ts > ? THEN 1 ELSE 0 END) AS views_24h,
                SUM(CASE WHEN kind = 'view'    AND ts > ? THEN 1 ELSE 0 END) AS views_7d,
                MAX(ts) AS last_ts
         FROM events GROUP BY item ORDER BY views DESC`,
        day,
        week,
      )
      .toArray();

    const refs = await this.state.storage.sql
      .exec<{ ref: string; views: number; contacts: number }>(
        `SELECT ref,
                SUM(CASE WHEN kind = 'view'    THEN 1 ELSE 0 END) AS views,
                SUM(CASE WHEN kind = 'contact' THEN 1 ELSE 0 END) AS contacts
         FROM events GROUP BY ref ORDER BY views DESC LIMIT 25`,
      )
      .toArray();

    const days = await this.state.storage.sql
      .exec<{ day: string; views: number; contacts: number }>(
        `SELECT date(ts / 1000, 'unixepoch') AS day,
                SUM(CASE WHEN kind = 'view'    THEN 1 ELSE 0 END) AS views,
                SUM(CASE WHEN kind = 'contact' THEN 1 ELSE 0 END) AS contacts
         FROM events WHERE ts > ? GROUP BY day ORDER BY day DESC`,
        fortnight,
      )
      .toArray();

    const first = await this.state.storage.sql
      .exec<{ first_ts: number | null }>("SELECT MIN(ts) AS first_ts FROM events")
      .toArray();

    return Response.json({
      totals: Object.fromEntries(totals.map((r) => [r.kind, r.n])),
      items,
      refs,
      days,
      firstTs: first[0]?.first_ts ?? null,
      generatedAt: Date.now(),
    });
  }
}

/* ------------------------------------------------------------------ */
/* Worker-side handlers (called from src/server.ts)                    */
/* ------------------------------------------------------------------ */

function stub(env: unknown): { fetch(input: string, init?: RequestInit): Promise<Response> } | null {
  const namespace = (env as ResaleEnv | null)?.RESALE_ANALYTICS;
  if (!namespace) return null;
  return namespace.get(namespace.idFromName("global"));
}

/** POST /track — forward the beacon payload to the DO. */
export async function handleResaleTrack(request: Request, env: unknown): Promise<Response> {
  const resale = stub(env);
  if (!resale) return new Response("Tracking not configured", { status: 503 });
  return resale.fetch("https://resale-analytics.internal/track", {
    method: "POST",
    body: request.body,
    headers: { "content-type": "application/json", "content-length": request.headers.get("content-length") ?? "" },
  });
}

/** GET /resale/ops — the single dashboard Tyler reads. */
export async function handleResaleOps(_request: Request, env: unknown): Promise<Response> {
  const resale = stub(env);
  let payload: StatsPayload | null = null;
  if (resale) {
    try {
      const response = await resale.fetch("https://resale-analytics.internal/stats");
      if (response.ok) payload = (await response.json()) as StatsPayload;
    } catch (error) {
      console.error("[resale-analytics] stats fetch failed:", error);
    }
  }

  const html = payload ? renderDashboard(payload) : renderNotConfigured();
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "no-store",
    },
  });
}

/* ------------------------------------------------------------------ */
/* Dashboard rendering                                                 */
/* ------------------------------------------------------------------ */

interface ItemRow {
  item: string | null;
  views: number;
  contacts: number;
  views_24h: number;
  views_7d: number;
  last_ts: number | null;
}
interface RefRow {
  ref: string;
  views: number;
  contacts: number;
}
interface DayRow {
  day: string;
  views: number;
  contacts: number;
}
interface StatsPayload {
  totals: Record<string, number>;
  items: ItemRow[];
  refs: RefRow[];
  days: DayRow[];
  firstTs: number | null;
  generatedAt: number;
}

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );

const when = (ts: number | null): string =>
  ts ? new Date(ts).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : "—";

function renderDashboard(p: StatsPayload): string {
  const views = p.totals.view ?? 0;
  const contacts = p.totals.contact ?? 0;
  const conversion = views > 0 ? ((contacts / views) * 100).toFixed(1) : "0.0";

  const itemRows = p.items
    .map((r) => {
      const label = r.item ? (ITEM_LABELS[r.item] ?? r.item) : "(storefront only)";
      const cvr = r.views > 0 ? ((r.contacts / r.views) * 100).toFixed(1) : "0.0";
      return `<tr>
        <td>${esc(label)}</td>
        <td class="num">${r.views_24h}</td>
        <td class="num">${r.views_7d}</td>
        <td class="num"><strong>${r.views}</strong></td>
        <td class="num contact">${r.contacts}</td>
        <td class="num">${cvr}%</td>
        <td class="muted">${when(r.last_ts)}</td>
      </tr>`;
    })
    .join("");

  const refRows = p.refs.length
    ? p.refs
        .map(
          (r) => `<tr>
        <td>${r.ref ? esc(r.ref) : '<span class="muted">(direct — no ?ref=)</span>'}</td>
        <td class="num"><strong>${r.views}</strong></td>
        <td class="num contact">${r.contacts}</td>
      </tr>`,
        )
        .join("")
    : `<tr><td colspan="3" class="muted">No channel data yet — post links with ?ref=craigslist, ?ref=nextdoor, etc.</td></tr>`;

  const dayRows = p.days
    .map(
      (d) => `<tr>
      <td>${esc(d.day)}</td>
      <td class="num">${d.views}</td>
      <td class="num contact">${d.contacts}</td>
    </tr>`,
    )
    .join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="robots" content="noindex, nofollow" />
  <meta http-equiv="refresh" content="60" />
  <title>Resale Ops · Granlund Grove</title>
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body { margin: 0; padding: 2rem; background: #101410; color: #e8ede6;
           font: 15px/1.5 ui-sans-serif, system-ui, sans-serif; }
    h1 { margin: 0 0 0.25rem; font-size: 1.4rem; }
    h2 { font-size: 0.95rem; text-transform: uppercase; letter-spacing: 0.08em;
         color: #9db89b; margin: 2rem 0 0.5rem; }
    .sub { color: #8a9484; font-size: 0.85rem; margin-bottom: 1.5rem; }
    .cards { display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
    .card { background: #1a211a; border: 1px solid #2a332a; border-radius: 10px;
            padding: 0.9rem 1.2rem; min-width: 130px; }
    .card .n { font-size: 1.7rem; font-weight: 700; }
    .card .l { color: #8a9484; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.06em; }
    table { border-collapse: collapse; width: 100%; max-width: 880px; background: #161c16;
            border: 1px solid #2a332a; border-radius: 10px; overflow: hidden; }
    th, td { padding: 0.55rem 0.9rem; text-align: left; border-bottom: 1px solid #232b23; }
    th { color: #9db89b; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    tr:last-child td { border-bottom: none; }
    .num { text-align: right; font-variant-numeric: tabular-nums; }
    .contact { color: #7fc97f; }
    .muted { color: #6d776b; font-size: 0.85rem; }
    footer { margin-top: 2.5rem; color: #6d776b; font-size: 0.8rem; }
  </style>
</head>
<body>
  <h1>Resale Ops Dashboard</h1>
  <p class="sub">
    Granlund Grove storefront · auto-refreshes every 60s ·
    tracking since ${when(p.firstTs)} · generated ${when(p.generatedAt)}
  </p>

  <div class="cards">
    <div class="card"><div class="n">${views}</div><div class="l">Listing views</div></div>
    <div class="card"><div class="n">${contacts}</div><div class="l">Contact clicks</div></div>
    <div class="card"><div class="n">${conversion}%</div><div class="l">View → contact</div></div>
  </div>

  <h2>By item</h2>
  <table>
    <tr><th>Item</th><th>24h</th><th>7d</th><th>All views</th><th>Contacts</th><th>CVR</th><th>Last activity</th></tr>
    ${itemRows || '<tr><td colspan="7" class="muted">No events yet.</td></tr>'}
  </table>

  <h2>By channel (?ref=)</h2>
  <table>
    <tr><th>Channel</th><th>Views</th><th>Contacts</th></tr>
    ${refRows}
  </table>

  <h2>Last 14 days</h2>
  <table>
    <tr><th>Day</th><th>Views</th><th>Contacts</th></tr>
    ${dayRows || '<tr><td colspan="3" class="muted">No events yet.</td></tr>'}
  </table>

  <footer>
    Add ?ref=&lt;channel&gt; to every listing link you post — e.g.
    <code>tylergranlund.com/resale/site/alienware-aw3423dwf?ref=craigslist</code>.
    Channels used so far: fb-marketplace · fb-group · craigslist · nextdoor · offerup · ebay · mercari · handout.
  </footer>
</body>
</html>`;
}

function renderNotConfigured(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="robots" content="noindex, nofollow" />
  <title>Resale Ops · not configured</title>
  <style>
    body { margin: 3rem; background: #101410; color: #e8ede6;
           font: 15px/1.6 ui-sans-serif, system-ui, sans-serif; }
    code { background: #1a211a; padding: 0.15rem 0.4rem; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Resale Ops — tracking binding missing</h1>
  <p>The <code>RESALE_ANALYTICS</code> Durable Object binding is not present in this
  deployment. Re-deploy with the current <code>wrangler.jsonc</code> (it defines the
  binding and the <code>v1</code> SQLite migration).</p>
</body>
</html>`;
}
