# Launch Punch-List — architect-reviewed (Solutions + Experience)

Synthesized from the Solutions Architect (infra/security) and Experience
Architect (UX/a11y/SEO) pressure-tests. `[code]` = I can do autonomously;
`[Tyler]` = needs your Cloudflare/Resend account or a personal-brand decision.

Decisions taken as defaults (override anytime):

- **Positioning** → reconcile everything to the on-page Career truth:
  **"IT Operations & Systems Engineer" / "HTT Brands"**.
- **Canonical host** → apex `tylergranlund.com`, `www → apex` 301.
- **Analytics** → enable Cloudflare Web Analytics (cookieless) per LAUNCH.md;
  privacy policy discloses it. (Skip it? Say so and I revert that paragraph.)

## P0 — launch blockers

- [x] `[code]` **Security headers reach the SSR pages.** CSP/HSTS/Permissions-Policy
      were in `public/_headers` (static-assets only) — moved into `server.ts` as the
      single source of truth (shared `src/lib/security-headers.ts`). + analytics beacon allowed.
- [x] `[code]` **Workers observability** enabled in `wrangler.jsonc`.
- [x] `[code]` **Header fitness test** so this can't silently regress.
- [x] `[code]` **Positioning reconcile** — title/meta/OG/Twitter/JSON-LD → IT Ops & Systems Engineer / HTT Brands.
- [x] `[code]` **Privacy policy truth** — Contact Form section now describes the real
      `/api/contact` → Resend flow; analytics disclosure added.
- [x] `[code]` **OG meta completeness** — og:image:width/height/alt, og:site_name, og:locale.
- [ ] `[Tyler]` **Branded 1200×630 OG share card** (current `og-cover.jpg` is the 1920×1080 hero). I can draft one — see note.
- [x] `[Tyler]` **Always Use HTTPS** ON (Cloudflare enforces HTTPS).

## P1 — launch week

- [x] `[code]` **Contact form a11y** — `role=status aria-live`, `aria-busy`, `autocomplete`.
- [x] `[code]` **Font preload** (Fraunces, the H1/LCP font) + correct hero intrinsic dims.
- [x] `[code]` **Favicon/PWA set** — manifest, apple-touch-icon, theme-color.
- [x] `[code]` **/privacy canonical + OG**.
- [x] `[code]` **Responsive images** `<picture>` AVIF/WebP + srcset/sizes — mobile hero 23.7KB vs 262KB (~91% smaller).
- [ ] `[Tyler]` **Native rate-limit binding** on `/api/contact` (still pending Cloudflare dashboard).
- [ ] `[Tyler]` **www→apex Redirect Rule** (works via wrangler config, but dashboard Redirect Rule not set), **Polish=Lossy+WebP**, **Cache Rules** `/assets/*` `/img/*` `/resume/*`.
- [ ] `[Tyler]` **DMARC record** `p=none` + Min TLS 1.2 + Auto HTTPS Rewrites (HTTPS already enforced).

## P2 — top-1% craft

- [x] `[code]` **`@graph` JSON-LD** (WebSite → ProfilePage → Person) + `rel=me` links.
- [ ] `[code]` **Print stylesheet** (`@media print`) — clean resume output.
- [ ] `[code]` **`/.well-known/security.txt`** (on-brand for IT/security).
- [ ] `[code]` **sitemap `lastmod`** build-time constant (currently `new Date()` per request).

## Explicitly NOT doing (YAGNI / enterprise theater)

Nonce CSP (until needed), Turnstile (until spam), edge-caching SSR HTML,
KV rate limiting, SRI on own chunks, COOP/COEP, light mode, prefers-reduced-data.
