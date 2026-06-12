# Project-Specific Recommendations — tylergranlund.com

Mapped to the actual codebase (TanStack Start SSR, files cited). Ordered by
priority. P0 = launch blocker.

## P0 — Launch blockers

### P0.1  Rewrite `src/routes/privacy.tsx` to match reality (LEGAL)
The current policy is **factually false** and is itself a transparency
violation. It claims:
- *"no analytics trackers"* → but `LAUNCH.md` §6 provisions **Cloudflare Web Analytics**.
- *"contact form opens your local email client… No data is transmitted to our server"* → but `src/routes/api/contact.ts` → `src/lib/contact.ts` POSTs name/email/message to **`https://api.resend.com/emails`** server-side (mailto is only the *fallback* when `RESEND_API_KEY` is unset).

**Must add/replace sections:**
- **Analytics:** "We use Cloudflare Web Analytics, a privacy-first, cookieless analytics tool that collects aggregate page metrics without cookies, localStorage, or fingerprinting."
- **Contact form:** "When you submit the contact form, your name, email, and message are sent to our server and delivered to us via **Resend** (Resend, Inc.), a third-party email processor acting on our behalf. We use this data solely to respond to you; it is never sold or used for marketing. See Resend's privacy policy: https://resend.com/legal/privacy-policy."
- Keep the **GPC** section (accurate). Keep **Cloudflare hosting** section.
- Remove the absolute "no data is transmitted to our server" sentence.

### P0.2  Regenerate `public/og-cover.jpg` at 1200×630
Currently **1920×1080 (1.78:1)** — wrong OG ratio → cropped/letterboxed/small on
LinkedIn, Slack, iMessage. Re-export at **1200×630 (1.91:1)**, keep < 1 MB.

### P0.3  Reconcile JSON-LD / SEO title with current positioning
Per `LAUNCH.md` "Known content note": `src/routes/index.tsx` still says
"Director of IT & Digital Transformation Leader" / "Head to Toe Brands" while the
resume/Career section now leads with "IT Operations & Systems Engineer" / "HTT
Brands." Pick one and make `og:title`, `<title>`, `description`, and `Person.jobTitle`/`worksFor` consistent.

## P1 — Strongly recommended before launch

### P1.1  Complete the Open Graph / Twitter meta in `src/routes/index.tsx`
Add to the `head().meta` array:
```ts
{ property: "og:image:width",  content: "1200" },
{ property: "og:image:height", content: "630" },
{ property: "og:image:alt",    content: "Tyler Granlund — misty spruce grove with the Granlund wordmark." },
{ property: "og:site_name",    content: "Tyler Granlund" },
{ property: "og:locale",       content: "en_US" },
{ name: "twitter:image:alt",   content: "Tyler Granlund — misty spruce grove with the Granlund wordmark." },
```
You can **drop** `twitter:title`/`twitter:description`/`twitter:image` (X reads
`og:*`); keep `twitter:card`. Optional: change `og:type` to `profile`.

### P1.2  Upgrade JSON-LD to a single `@graph` with `ProfilePage`
Replace the two separate `websiteJsonLd` + `personJsonLd` blocks with the single
`@graph` (WebSite + ProfilePage + Person) from `README.md` §1. Use absolute-URL
`@id`s (`https://tylergranlund.com/#person`). Add `dateModified`. Swap
`Person.image` from the OG cover to a **real 1:1 portrait** (Google ignores/penalizes
non-representative images).

### P1.3  Add the missing favicon/PWA files to `public/`
You have only `favicon.svg` + `theme-color`. Add:
- `favicon.ico` (48×48 multi-res)
- `apple-touch-icon.png` (180×180, **opaque** bg — iOS blackens transparency)
- `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`
- `site.webmanifest` (see README §3)

Then in `src/routes/__root.tsx` `head().links` add:
```ts
{ rel: "icon", href: "/favicon.ico", sizes: "48x48" },
{ rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
{ rel: "manifest", href: "/site.webmanifest" },
```
**Do NOT add `mask-icon`** — deprecated in 2026. Fastest path: feed `favicon.svg`
to realfavicongenerator.net and commit the package.
> CSP note: your `_headers` `img-src 'self' data: blob:` already allows these
> same-origin icons. The manifest needs no CSP change (same-origin).

### P1.4  Fix the Hero image dimensions (CLS)
`src/components/site/Hero.tsx` declares `width={1920} height={1280}` but
`src/assets/hero-spruce.jpg` is **1920×1080**. Change to `height={1080}` to
reserve the correct box (prevents layout shift + vertical squish). The
`loading="eager" fetchpriority="high" decoding="async"` attributes are already
correct — **keep them, no preload needed** (it's a parser-discoverable `<img>`).

## P2 — Performance polish (post-launch friendly)

### P2.1  Modern image formats
- Quick win, zero code: enable **Cloudflare Polish = Lossy + WebP** (already in `LAUNCH.md` §8) for `/assets/*.jpg`.
- Better: generate AVIF+WebP and use `<picture>` (README §4) for the hero and the heaviest section images (`clearing.jpg` 446 KB, `trail.jpg` 355 KB, `house.jpg` 274 KB). AVIF→WebP→JPEG order.
- Add `width`/`height` (or `aspect-ratio`) to every `<img>` in section components.

### P2.2  Preload above-the-fold fonts
In `src/routes/__root.tsx` `head().links`, before the stylesheet, add (only the
fonts used in the hero/LCP — likely Fraunces display + Inter body; NOT JetBrains
Mono unless above the fold):
```ts
{ rel: "preload", href: "/fonts/fraunces-latin-variable.woff2", as: "font", type: "font/woff2", crossOrigin: "anonymous" },
{ rel: "preload", href: "/fonts/inter-latin-variable.woff2",    as: "font", type: "font/woff2", crossOrigin: "anonymous" },
```
`crossOrigin` is **mandatory** — omitting it double-downloads the font. Your CSP
`font-src 'self'` already permits these. Keep `font-display: swap` (right call
for a text-forward resume; `optional` risks never showing your brand font).
Optional CLS nicety: add a `size-adjust`-tuned fallback `@font-face`.

## P3 — Nice-to-have
- `BreadcrumbList`: skip on `/` (single page). Optional on `/privacy`.
- Add `og:title`/`og:description`/canonical to `/privacy` (currently only title+description) for cleaner shares.
- Consider `twitter:site`/`creator` only if Tyler has an active X handle.

---

## Quick verification checklist (post-deploy)
- [ ] Google **Rich Results Test** on `/` → ProfilePage/Person valid, no errors.
- [ ] **LinkedIn Post Inspector** on `https://tylergranlund.com/` → large 1200×630 card, correct title/desc.
- [ ] Paste URL into **Slack** + **iMessage** → unfurls with image + alt.
- [ ] `curl -I https://tylergranlund.com/favicon.ico` → 200.
- [ ] DevTools → Network: hero image priority = **High**; fonts fetched once (no double download).
- [ ] Lighthouse: CLS ~0 (hero box correct), SEO/best-practices pass.
- [ ] Privacy page mentions **Cloudflare Web Analytics** + **Resend** and matches actual behavior.
