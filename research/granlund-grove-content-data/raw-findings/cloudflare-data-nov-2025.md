# Cloudflare Data Platform — Status as of Nov 2025

Source: `developers.cloudflare.com` (Tier 1 — primary, version-controlled docs).

## D1 (SQLite at the edge)

- **GA:** 2024-04-01 (Workers Birthday Week 2024). Confirmed in release notes.
- **Read Replication:** 🚩 **PUBLIC BETA** since 2025-04-10. **NOT GA as of Nov 2025.**
  - Auto-created replicas (one per supported region), active/inactive by traffic.
  - **No extra cost** for replicas — you pay same `rows_read` / `rows_written` rates.
  - Requires **Sessions API**: `env.DB.withSession(bookmark)` for sequential consistency.
- **Auto-retry of read-only queries:** added 2025-09-11 (up to 2 retries; SELECT/EXPLAIN/WITH only).
- **Jurisdictions** (data localization): added 2025-11-05.
- **Free tier limits (enforced from 2025-02-10):**
  - **5 million rows read / day**
  - **100,000 rows written / day**
  - **5 GB total storage** (across all DBs on the account)
  - 10 databases / account, 500 MB / DB
- **Paid tier (Workers Paid $5/mo min):** 25 B rows read/mo included + $0.001/M, 50 M writes/mo + $1.00/M, 5 GB storage + $0.75/GB-mo. 1 TB max per account (raised from 250 GB on 2025-07-01).
- **Egress / bandwidth:** **none** ("no data transfer or throughput charges for data accessed from D1").
- **Replication billing:** no extra cost.

## Durable Objects (SQLite-backed)

- **SQLite storage backend** is recommended for all new DO classes and is **available on the Workers Free plan**.
- **Key-value storage backend** is **Paid-plan only** (and now legacy for new DOs).
- **SQLite storage billing target:** **January 7, 2026 (no earlier)** per official pricing page. Usage before that date is not charged.
- **Free plan SQLite limits:**
  - 5 M rows read / day, 100k rows written / day (mirrors D1)
  - 5 GB total stored SQL data
- **Free plan compute:** 100k requests / day, **13,000 GB-s / day** duration.
- **Hibernation:** WebSocket Hibernation API avoids duration charges when idle.

## R2 (object storage)

- **Egress to internet: FREE** ✅ (still true as of Nov 2025 / docs last updated Apr 2026).
- **Free tier (Standard storage, monthly):**
  - **10 GB-month** storage
  - **1 million** Class A operations (writes/list)
  - **10 million** Class B operations (reads/head)
- **Paid:** $0.015/GB-mo standard, $4.50/M Class A, $0.36/M Class B.
- **Infrequent Access storage class** (separate): $0.01/GB-mo + $0.01/GB retrieval, no free tier, 30-day minimum.

## Workers Analytics Engine

- **Free plan:** **100,000 data points written / day**, **10,000 read queries / day**.
- **Paid plan:** 10 M writes/mo included (+$0.25/M), 1 M queries/mo (+$1.00/M).
- **Billing status (Nov 2025):** **Not currently billed** — pricing is published in advance, billing "in the coming months".
- **Retention:** 3 months (per limits doc).
- **Schema:** 20 blobs + 20 doubles + 1 index per `writeDataPoint`. 250 data points per Worker invocation.

## KV (referenced for contact-form analysis)

- Free: 100k reads/d, 1k writes/d, 1k deletes/d, 1k list ops/d, 1 GB storage.
- Eventual consistency (≤60s globally).
- Max value: 25 MiB. Max key: 512 B.

## Hyperdrive (Postgres pooling — referenced)

- Active, GA. Connection pooling + edge query cache for Postgres/MySQL.
- Useful only if you bring an external Postgres (Neon, Supabase, etc.).
