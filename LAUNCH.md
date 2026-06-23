# Launch Runbook -- tylergranlund.com

The site is **live** at tylergranlund.com. This runbook documents the one-time
setup steps that were needed. Worker name: **`granlund-grove`** (config:
`wrangler.jsonc`).

> See **`LAUNCH_PUNCHLIST.md`** for the full architect-reviewed (Solutions +
> Experience) punch-list. The code-side P0/P1 items there are DONE; the
> dashboard steps below are what remain.

Track readiness any time with:

```bash
python3 scripts/judge.py --skip-live   # repo-only, currently 20/26
python3 scripts/judge.py               # live (run AFTER deploy) -- the real gate
```

---

## 0. One-time: authenticate (THE blocker)

```bash
npx wrangler login        # opens a browser; approve the OAuth grant
npx wrangler whoami       # should now show your account/email
```

> Headless/CI alternative: set `CLOUDFLARE_API_TOKEN` (Workers Scripts: Edit)
> instead of `wrangler login`.

## 1. Final local gate

```bash
npm run test:all          # typecheck + vitest (42) + e2e/a11y (75)
npm run format:check && npm run lint
```

## 2. Contact email delivery (DONE -- live since 2026-06-18)

Resend is configured and live. The contact form POSTs to `/api/contact` and
emails deliver via Resend. If reconfiguring:

1. Resend account with `tylergranlund.com` domain verified (DKIM/SPF).
2. `FROM` in `src/lib/contact.ts` matches a verified sender.
3. Worker secret: `npx wrangler secret put RESEND_API_KEY --name granlund-grove`

Cloudflare Email Routing is also enabled: `hello@tylergranlund.com` and all
`@tylergranlund.com` addresses forward to `tygranlund@icloud.com`.

## 3. Number gate (judge G3.2 -- do this BEFORE going public)

Open `docs/NUMBER_VERIFICATION.md`, confirm/correct every metric (these feed
the Hero, Prologue, and the six case studies), then set the status line to
`VERIFIED`. Nothing with an unverified number should ship.

## 4. Deploy

```bash
npm run deploy            # build + wrangler deploy (dist/server/wrangler.json)
```

## 4b. Edge security + canonical host (architect-recommended)

Dashboard toggles, all free, do once:

- **SSL/TLS -> Edge Certificates: Always Use HTTPS = ON**, Min TLS = 1.2,
  Automatic HTTPS Rewrites = ON. (HSTS is set in-code; do NOT also enable the
  dashboard HSTS toggle -- it duplicates the header.)
- **Rules -> Redirect Rules:** `www.tylergranlund.com` -> `https://tylergranlund.com`
  - path, 301. Apex is canonical (matches the in-code `<link rel=canonical>`).
- **DNS -> add DMARC:** `_dmarc` TXT
  `v=DMARC1; p=none; rua=mailto:hello@tylergranlund.com` so contact-form mail
  isn't junked / your domain can't be spoofed. (Resend setup gives SPF+DKIM.)
- **Speed -> Optimization:** Polish = Lossy + WebP; Brotli ON.
- **Caching -> Cache Rules:** `/assets/*` and `/img/*` immutable long max-age; `/resume/*`
  ~1 day. Do NOT set `no-transform` on the document (breaks analytics injection).
- **Contact abuse (optional):** native Workers rate-limit binding on
  `/api/contact` (5/min/IP) -- add only if you want it; honeypot already screens bots.

## 5. DNS / custom domains (judge G2.3 / G2.4)

In the Cloudflare dashboard: **Workers & Pages -> `granlund-grove` -> Settings
-> Domains & Routes -> Add Custom Domain**. Add both:

- `tylergranlund.com`
- `www.tylergranlund.com`

Cloudflare provisions the certs and the proxied DNS records automatically.
(`sitemap.xml` + `robots.txt` are already in `public/` and will be live.)

## 6. Cloudflare Web Analytics (judge G6.2)

**Dashboard -> Analytics & Logs -> Web Analytics -> Add a site ->
tylergranlund.com**, automatic mode. No code change needed. (The judge greps
source so G6.2 stays "red" even though analytics is live -- that's a judge
blind spot, not a gap.)

## 7. Post-deploy verification (the real gate)

```bash
python3 scripts/judge.py             # live checks; expect all P0 GREEN -> READY
curl -sI https://tylergranlund.com | head -1          # expect 200
curl -s  https://tylergranlund.com/sitemap.xml | head -3
```

Spot-check by hand: hero loads, case studies render, all three resume PDFs
download, contact form sends (or opens mailto), Lighthouse pass
(`npm run lhci`).

## 8. Performance (Cloudflare-side, post-deploy)

Lighthouse local results (against `wrangler dev`, no CDN): **a11y / SEO /
best-practices all pass**; CLS 0.011 and TBT 0ms are excellent. Performance
scores ~0.67-0.79 locally, dominated by LCP/FCP (~3.9s) -- which is raw image
bytes over an uncompressed local connection, not an app problem. The hero image
is already `loading="eager" fetchPriority="high"` and all fonts use
`font-display: swap`.

Most of that recovers at the edge. After deploy, in the Cloudflare dashboard:

- **Speed -> Optimization -> Image Optimization: Polish = Lossy + WebP** --
  optimizes all `/assets/*.jpg` automatically (no source changes, no quality
  risk). This is the right fix for the heavy hero/section photos
  (1920x1080 JPGs, ~260-450 KB each).
- **Brotli** compression on (default).
- **Tiered Cache** + a Cache Rule for `/assets/*` and `/resume/*` (immutable,
  long max-age) -- the build already fingerprints asset filenames.

### Local perf gate

`npm run lhci` now works (`lighthouserc.json` added): a11y/SEO are hard
assertions (>=0.95 / >=0.90), performance is a warning budget. Run it against
a local production build:

```bash
npm run build
npx wrangler dev --config dist/server/wrangler.json --port 4173 &
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npm run lhci
```

> `.lighthouseci/` is regenerable report output -- add it to `.gitignore`.

---

## Rollback

```bash
npx wrangler deployments list --name granlund-grove
npx wrangler rollback --name granlund-grove          # to the previous version
```

## Still gated on Tyler (summary)

| Step                    | Why it needs you                 |
| ----------------------- | -------------------------------- |
| `wrangler login`        | your Cloudflare credentials      |
| DNS custom domains      | your Cloudflare zone             |
| `RESEND_API_KEY` secret | your Resend account              |
| Number gate `VERIFIED`  | only you can confirm the figures |
| Web Analytics toggle    | your Cloudflare dashboard        |

## Resolved since last revision

- **Positioning reconciled** -- title/meta/OG/Twitter/JSON-LD + About/Prologue
  prose now lead with **"IT Operations & Systems Engineer"** and keep
  **"former Director of IT"** as seniority proof (Tyler's call). The stale
  "Director of IT & Digital Transformation / Head to Toe Brands" strings are gone.
- **Security-header bug fixed** -- CSP/HSTS/Permissions-Policy now ship on the
  SSR document via `src/lib/security-headers.ts` (was static-asset-only).
- **Privacy policy corrected** to describe the real Resend contact flow +
  cookieless analytics disclosure.
- **Branded OG card**, favicon/PWA set, font preload, print stylesheet,
  security.txt, static sitemap lastmod, true hero dimensions -- all shipped.
- **Regenerate brand assets** any time with `node scripts/generate-assets.mjs`.
