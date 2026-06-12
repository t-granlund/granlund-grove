# Cloudflare docs: Preview URLs (extracted)

Source: https://developers.cloudflare.com/workers/configuration/previews/ (last updated 11 May 2026)

## Two types

### Versioned Preview URLs
- Auto-generated for each new Worker version.
- Format: `<VERSION_PREFIX>-<WORKER_NAME>.<SUBDOMAIN>.workers.dev`
- Triggered by: `wrangler deploy`, `wrangler versions upload`, or dashboard edits.
- **Min wrangler: 3.74.0.**
- Only available for versions uploaded after 2024-09-25.

### Aliased Preview URLs
- Manual, persistent, readable alias.
- Format: `<ALIAS>-<WORKER_NAME>.<SUBDOMAIN>.workers.dev`
- Created via: `wrangler versions upload --preview-alias <name>`
- **Min wrangler: 4.21.0.**
- Rules:
  - Lowercase letters, numbers, dashes; must begin with a lowercase letter.
  - `alias + worker-name + 1 (dash)` ≤ 63 chars (DNS label limit).
  - 1000-most-recent retained per Worker (LRU eviction).

## Configuration

```jsonc
// wrangler.jsonc
{ "preview_urls": true }     // explicit enable
{ "preview_urls": false }    // explicit disable
```
Default: `preview_urls = workers_dev` (so enabled when `workers_dev = true`).
Min wrangler for the config key: 3.91.0.

## Access control
Workers → Settings → Domains & Routes → Preview URLs → **Enable Cloudflare Access**. Validate Access JWT in worker via `aud` claim + provided JWKS URL.

## Limitations
- ❌ Workers using Durable Objects.
- ❌ Workers for Platforms user workers (temporary).
- ❌ Custom subdomain (locked to `*.workers.dev`).
- ❌ No logs for preview URLs (Workers Logs, `wrangler tail`, Logpush all excluded).

---

# Cloudflare docs: Workers Builds — Configuration (extracted)

Source: https://developers.cloudflare.com/workers/ci-cd/builds/configuration/ (last updated 23 Apr 2026)

## Two-step model per push
1. **Build command** (optional): e.g. `npm run build`.
2. **Deploy command**:
   - Production branch: defaults to `npx wrangler deploy`.
   - **Non-production branch** ("preview"): defaults to `npx wrangler versions upload` → returns a versioned preview URL.

## Settings surface (Dashboard → Worker → Settings → Build)
| Setting | Default | Notes |
|---|---|---|
| Git branch | `main` | Production branch |
| Build command | (empty) | Optional |
| Deploy command | `npx wrangler deploy` | Customisable |
| Non-production branch deploy command | `npx wrangler versions upload` | Customisable, e.g. `--preview-alias $WORKERS_CI_BRANCH` |
| Root directory | repo root | Useful for monorepos |
| API token | auto-generated | Per-account, reused across builds; can supply your own |
| Build variables & secrets | none | Build-time only, not runtime |

## Default injected env vars
| Var | Value |
|---|---|
| `CI` | `true` |
| `WORKERS_CI` | `1` |
| `WORKERS_CI_BUILD_UUID` | UUID of build |
| `WORKERS_CI_COMMIT_SHA` | sha1 of commit |
| `WORKERS_CI_BRANCH` | branch name |

## Auto-config for new projects
If repo lacks a Wrangler config, autoconfig detects framework, opens a PR with the necessary `wrangler.jsonc` + adjustments. Preview deployment is generated for the PR.

## Caveats
- Currently does **not** honour `[build]` custom builds in the Wrangler config.
- API tokens: user tokens only (account-owned token support "coming soon" per docs).
