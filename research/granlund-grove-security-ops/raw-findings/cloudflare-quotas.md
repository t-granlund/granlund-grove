# Raw Cloudflare quota extracts (Nov 2025)

## Workers Free plan
Source: https://developers.cloudflare.com/workers/platform/limits/

- Requests: 100,000/day (Error 1027 on exceed, resets midnight UTC)
- CPU time: 10 ms
- Compressed bundle: 3 MB (free) / 10 MB (paid)

## KV pricing/limits
Source: https://developers.cloudflare.com/kv/platform/pricing/

| | Free | Paid |
|---|---|---|
| Reads | 100,000/day | 10M/mo + $0.50/M |
| Writes | 1,000/day | 1M/mo + $5/M |
| Deletes | 1,000/day | 1M/mo + $5/M |
| List | 1,000/day | 1M/mo + $5/M |
| Stored data | 1 GB | 1 GB + $0.50/GB-mo |

## D1
Source: https://developers.cloudflare.com/d1/platform/pricing/

| | Workers Free | Workers Paid |
|---|---|---|
| Rows read | 5 million/day | First 25B/mo + $0.001/M |
| Rows written | 100,000/day | First 50M/mo + $1/M |
| Storage | 5 GB total | 5 GB included + $0.75/GB-mo |

## Workers Logs (observability)
Source: https://developers.cloudflare.com/workers/observability/logs/workers-logs/

| | Logs/day or month | Retention |
|---|---|---|
| Workers Free | 200,000/day | 3 days |
| Workers Paid | 20M/mo + $0.60/M | 7 days |

- Max retention period: 7 days
- Account-wide hard ceiling: 5 billion logs/day → 1% head-sampling after

## Workers Analytics Engine
Source: https://developers.cloudflare.com/analytics/analytics-engine/

| Plan | Writes | Reads |
|---|---|---|
| Workers Free | 100,000/day | 10,000/day |
| Workers Paid | 10M/mo included | 1M/mo included |

- Retention: 3 months
- Per call: max 20 blobs + 20 doubles + 1 index
- Index ≤ 96 bytes; blobs payload ≤ 16 KB / data point
- Max 250 data points per Worker invocation
- **Currently no billing** (preview pricing)

## Logpush
Source: https://developers.cloudflare.com/logs/logpush/

> "Users without an Enterprise plan can still access Workers Trace Events Logpush by subscribing to the Workers Paid plan."

Translation:
- General Logpush (HTTP, firewall, etc.): **Enterprise only**
- Workers Trace Events Logpush: **Workers Paid ($5/mo)**
- **Not available on Workers Free.**

## Turnstile Free plan
Source: https://developers.cloudflare.com/turnstile/plans/

- Widgets: up to 20
- All widget types (Managed, Non-Interactive, Invisible): yes
- Challenges / verifications: **unlimited**
- Hostnames per widget: 10
- Analytics lookback: 7 days
- WCAG 2.2 AAA: yes
- Pre-clearance support: yes
- Ephemeral IDs: no (Enterprise)
- Offlabel: no (Enterprise)

## WAF Rate Limiting Rules per plan
Source: https://developers.cloudflare.com/waf/rate-limiting-rules/

| | Free | Pro | Business | Enterprise |
|---|---|---|---|---|
| Rules | 1 | 2 | 5 | 100+ |
| Match fields | Path only | Host, URI, Path, Full URI, Query | + more | + more |
| Counting period | 10s | up to 1 min | up to 1 h | up to 1 day |
| Mitigation timeout | 10s | up to 1 h | up to 1 day | up to 1 day |
| Counting char. | IP | IP | IP + NAT | + JA3/4 |
