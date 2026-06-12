# GitHub Repo Snapshot — 2026-05-21

Source: GitHub REST API `/repos/{owner}/{repo}` (Tier 1 — primary).

## Velite — `zce/velite`

| Field | Value |
|---|---|
| Stars | **776** |
| Forks | 41 |
| Open issues | 32 |
| Last push | **2026-05-16** |
| Last updated | 2026-05-19 |
| Created | 2023-10-26 |
| Default branch | `main` |
| License | MIT |
| Archived | **false** |
| Description | "Turns Markdown / MDX, YAML, JSON, or others into app's data layer with Zod schema." |
| Topics | content, contentlayer, datalayer, esbuild, headless-cms, markdown, mdx, typescript, velite, zod |
| Homepage | http://velite.js.org |

**Verdict:** Actively maintained. As of **Nov 2025**, releases `v0.2.4` (May 2025) was the latest published; `v0.3.x` shipped Dec 2025. Now (May 2026) push within last 5 days. Zod schema validation native. Build-time only — **runs in Node during `vite build`, ships static JSON/JS to the Worker → zero Workers-runtime concern.**

## Contentlayer (original) — `contentlayerdev/contentlayer`

| Field | Value |
|---|---|
| Stars | **3,541** |
| Forks | 230 |
| Open issues | 196 |
| Last push | **2024-11-07** |
| Archived | **false** ⚠️ (commonly miscited as archived) |
| Last release | `v0.3.4` — Feb 2023 |

**Verdict:** Dormant. ~1 year of inactivity by Nov 2025, ~18 months by May 2026. Repo is **open but unmaintained**. Don't use for new projects.

## Contentlayer2 (fork) — `timlrx/contentlayer2`

| Field | Value |
|---|---|
| Stars | **419** |
| Forks | 34 |
| Open issues | 25 |
| Last push | **2025-05-03** |
| Archived | false |
| License | MIT |
| Last release | `v0.5.8` — 2025-05-03 |

**Verdict:** Was a sensible bridge in 2024; **~6 months stale by Nov 2025, ~1 year by May 2026**. Fork is also effectively abandoned. Migrate to Velite or roll-your-own.

## Decap CMS — `decaporg/decap-cms`

| Field | Value |
|---|---|
| Stars | **19,070** |
| Forks | 3,117 |
| Open issues | 590 |
| Last push | **2026-05-20** |
| Archived | false |
| Default branch | `main` |
| License | MIT |
| Homepage | https://decapcms.org |

**Verdict:** **Actively maintained** (commit yesterday relative to this snapshot). Successor to Netlify CMS. Git-based — content is committed back to your repo as Markdown/JSON. Works fine with Workers because the CMS is just a static SPA + git provider OAuth; **no Node runtime required on your side**.

## TinaCMS — `tinacms/tinacms`

| Field | Value |
|---|---|
| Stars | **13,346** |
| Forks | 706 |
| Open issues | 398 |
| Last push | **2026-05-21** (today) |
| Archived | false |
| License | **Apache-2.0** |
| Homepage | https://tina.io |

**Verdict:** Very actively maintained. **Self-host requirement:** the TinaCloud backend (GraphQL API + auth) is the SaaS offering; self-hosted Tina requires running their `@tinacms/datalayer` GraphQL server (Node) on a host you control. **Not Workers-runtime-compatible for the backend**, though the frontend editor SPA is fine. For Workers-only deployments, prefer Decap (git-only) or use TinaCloud's hosted backend.
