# Launch-Readiness Research — tylergranlund.com (early 2026)

> Research agent: `web-puppy-1f9925` · Date: 2026-06-11
> Project: Granlund Grove — TanStack Start SSR React, Cloudflare Workers, single
> long landing page (`/`) + `/privacy`. Contact via Resend (`/api/contact`),
> Cloudflare Web Analytics (cookieless), self-hosted variable WOFF2 fonts.

This is the **copy-paste-ready** executive summary. Deep analysis with all
source quotes is in [`analysis.md`](./analysis.md); credibility ratings in
[`sources.md`](./sources.md); project-specific action items in
[`recommendations.md`](./recommendations.md).

---

## TL;DR verdicts

| # | Area | Verdict |
|---|------|---------|
| 1 | Structured data | **Yes** — `Person` is correct; wrap in `ProfilePage` → `mainEntity` per Google's current (2025-12-10) guidance. Keep `@id` graph linking. Skip `BreadcrumbList` on a single page. |
| 2 | OG / X cards | Your set is ~70% there. **Add** `og:image:width/height`, `og:image:alt`, `og:site_name`, `og:locale`, `twitter:image:alt`. OG image must be **1200×630 (1.91:1)** — yours is currently 1920×1080. |
| 3 | Favicon / PWA | Modern minimal set = `favicon.ico` (48×48) + SVG icon + apple-touch-icon 180×180 + manifest (192/512) + `theme-color`. **`mask-icon` is dropped** in 2026. You're missing `.ico`, apple-touch-icon and manifest. |
| 4 | Performance | Use `<picture>` AVIF→WebP→JPEG. Hero `<img>` already correct (`fetchpriority=high`, `loading=eager`) — but **fix the width/height (1920×1080, not 1280)**. Preload self-hosted WOFF2 with `crossorigin`; `font-display: swap` is right for a resume site. |
| 5 | Privacy | **No cookie banner legally required** (Cloudflare Web Analytics is cookieless; Resend is triggered by user action). BUT your privacy page is **factually wrong** — it claims "no analytics" and "mailto only, no data to our server," while you run analytics + a server-side Resend processor. **Must rewrite before launch.** Honoring `Sec-GPC` IS sufficient for CCPA when you don't sell/share. |

---

## 1. Structured data — `ProfilePage` + `Person`

**Verdict:** `Person` is the right primary type, and Google's *"Profile page
(ProfilePage) structured data"* doc (updated **2025-12-10**) explicitly lists
**"An 'About Me' page on a blog site"** and **"An employee page on a company
website"** as valid `ProfilePage` use cases. Wrapping `Person` as
`ProfilePage.mainEntity` is the current recommended pattern.

**Important nuance:** Google's `ProfilePage` rich-result feature primarily
serves the **Discussions & Forums** experience. For a standalone resume site it
will not produce a visible "rich card," but it *does* help Google's entity
understanding and is the officially sanctioned wrapper. The Person properties
Google's `ProfilePage` doc actually consumes are a **short list**:
`name` (required), `alternateName`, `description`, `image`, `sameAs`,
`identifier`, plus interaction stats. Properties like `jobTitle`, `worksFor`,
`alumniOf`, `address`, `url`, `knowsAbout` are **valid schema.org `Person`
properties and good for general/Knowledge-Graph understanding, but are NOT part
of the `ProfilePage` rich-result spec** — keep them, just don't expect a rich
result from them.

**`BreadcrumbList`:** Not useful on a single-page site (no hierarchy to
express). Add it only on `/privacy` if you want, and even there it's optional.

**Pitfall — `@id` graph linking:** You currently emit two *separate* JSON-LD
blocks (`WebSite` + `Person`) using `@id: "#person"`. That works, but the
robust pattern is a **single `@graph`** with absolute-URL `@id`s so nodes
resolve unambiguously across pages. Use full URLs (`https://tylergranlund.com/#person`),
not bare fragments.

**Copy-paste (single `@graph`, ProfilePage wrapper):**
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://tylergranlund.com/#website",
      "url": "https://tylergranlund.com/",
      "name": "Tyler Granlund — Spruce Grove",
      "publisher": { "@id": "https://tylergranlund.com/#person" }
    },
    {
      "@type": "ProfilePage",
      "@id": "https://tylergranlund.com/#profilepage",
      "url": "https://tylergranlund.com/",
      "dateModified": "2026-06-11T00:00:00-05:00",
      "isPartOf": { "@id": "https://tylergranlund.com/#website" },
      "mainEntity": { "@id": "https://tylergranlund.com/#person" }
    },
    {
      "@type": "Person",
      "@id": "https://tylergranlund.com/#person",
      "name": "Tyler Granlund",
      "jobTitle": "Director of IT & Digital Transformation Leader",
      "url": "https://tylergranlund.com/",
      "image": "https://tylergranlund.com/portrait-1x1.jpg",
      "description": "Technology and digital transformation leader in Bella Vista, Arkansas.",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bella Vista",
        "addressRegion": "AR",
        "addressCountry": "US"
      },
      "worksFor": { "@type": "Organization", "name": "Head to Toe Brands" },
      "knowsAbout": ["Digital Transformation", "Product Management", "Information Security"],
      "sameAs": [
        "https://www.linkedin.com/in/tylergranlund",
        "https://github.com/t-granlund"
      ]
    }
  ]
}
</script>
```
> Google `image` guidance: provide a **real portrait** (not the OG cover), ideally
> at 1:1, 4:3 and 16:9, min 50K px (w×h), crawlable/indexable. Don't reuse a
> generic placeholder.

---

## 2. Open Graph + X/Twitter cards

**OG image spec (consensus across OGP + platform docs):**
- **Dimensions: 1200×630 px**, aspect ratio **1.91:1**. (LinkedIn states 1200×627 / 1.91:1 — same target.)
- **Format:** JPEG or PNG. **Max file size:** keep **< 5 MB** (LinkedIn's hard cap; X ≤ 5 MB for `summary_large_image`). Aim < 1 MB for speed.
- ogp.me rule: **"If the page specifies an `og:image` it should specify `og:image:alt`."**
- LinkedIn **does cache** OG data (~7 days). To force a refresh after launch use the **LinkedIn Post Inspector** (`https://www.linkedin.com/post-inspector/`). Providing `og:image:width`/`og:image:height` lets LinkedIn render the large card on first scrape instead of falling back to a small thumbnail.

>  **Your `og-cover.jpg` is 1920×1080 (1.78:1) — wrong ratio.** Regenerate at
> **1200×630**. 16:9 gets cropped top/bottom or shown small on LinkedIn/Slack.

**Required vs nice-to-have:**

| Tag | Status | Notes |
|-----|--------|-------|
| `og:title` | **Required** | ogp.me core 4 |
| `og:type` | **Required** | `website` or `profile` (profile fits a personal page) |
| `og:url` | **Required** | canonical absolute URL |
| `og:image` | **Required** | absolute URL, 1200×630 |
| `og:image:width` / `:height` | Strongly recommended | `1200` / `630` — first-scrape large render on LinkedIn |
| `og:image:alt` | Recommended (ogp.me says "should") | accessibility + correctness |
| `og:description` | Recommended | 1–2 sentences |
| `og:site_name` | Recommended | "Tyler Granlund" |
| `og:locale` | Recommended | `en_US` (default, but be explicit) |
| `twitter:card` | **Required for X** | `summary_large_image` — the one `twitter:*` tag that still matters |
| `twitter:title` / `:description` / `:image` | Optional now | X falls back to `og:*` if absent; keep for control |
| `twitter:image:alt` | Recommended | a11y |
| `twitter:site` / `:creator` | Optional / low value | only if you have an active @handle; largely ignored now |

**2025/2026 change:** X (Twitter) no longer maintains the Cards docs and now
**reads Open Graph tags as the primary source**, using `twitter:*` only as
overrides/fallback. Practical guidance: **keep `twitter:card`** (needed to get
the big image), and you can **drop the duplicate `twitter:title/description/image`**
since X reads `og:*`. Slack and iMessage read **Open Graph only** (plus
`og:image:alt`). So a complete OG set + `twitter:card` covers LinkedIn, X,
Slack, and iMessage.

**Copy-paste (`/` head):**
```html
<meta property="og:type"        content="profile" />
<meta property="og:site_name"   content="Tyler Granlund" />
<meta property="og:locale"      content="en_US" />
<meta property="og:title"       content="Tyler Granlund — Spruce Grove" />
<meta property="og:description" content="Director of IT, product strategist, and systems thinker. Building resilient technology ecosystems rooted in clarity and craft." />
<meta property="og:url"         content="https://tylergranlund.com/" />
<meta property="og:image"       content="https://tylergranlund.com/og-cover.jpg" />
<meta property="og:image:width"  content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt"   content="Tyler Granlund — misty spruce grove with the Granlund wordmark." />
<meta name="twitter:card"        content="summary_large_image" />
<meta name="twitter:image:alt"   content="Tyler Granlund — misty spruce grove with the Granlund wordmark." />
```

---

## 3. Favicon / PWA / app identity — modern minimal set (2026)

**RealFaviconGenerator's own current production `<head>` (scraped 2026)** is the
canonical "modern baseline" and notably **omits `mask-icon`**:
```html
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
<link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
<link rel="manifest" href="/site.webmanifest" />
```
Plus in the manifest: 192×192 and 512×512 PNG icons, and a `theme-color`.

**Is `mask-icon` (Safari pinned-tab) still needed in 2026?** **No — deprecated.**
Safari dropped the pinned-tab monochrome mask requirement; modern Safari uses
the regular SVG/PNG icons. RealFaviconGenerator no longer emits `mask-icon` or
the old `browserconfig.xml`/MS-tile junk. Don't add it.

**Minimal tasteful 2026 set:**
1. `favicon.ico` — legacy/desktop fallback, 48×48 (multi-res ok). *(You're missing this — some scrapers/old browsers still request `/favicon.ico`.)*
2. `favicon.svg` — single scalable icon (you have this ).
3. `apple-touch-icon.png` — **180×180**, opaque background (iOS fills transparency with black). *(Missing.)*
4. `site.webmanifest` — name, short_name, `theme-color`, `background_color`, icons **192** + **512** (add a `512` `purpose: "maskable"` if you want adaptive Android). *(Missing.)*
5. `<meta name="theme-color" content="#1a2620">` — you have this .

**Copy-paste `site.webmanifest`:**
```json
{
  "name": "Tyler Granlund",
  "short_name": "Granlund",
  "icons": [
    { "src": "/web-app-manifest-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/web-app-manifest-512x512.png", "sizes": "512x512", "type": "image/png" },
    { "src": "/web-app-manifest-512x512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ],
  "theme_color": "#1a2620",
  "background_color": "#1a2620",
  "display": "standalone"
}
```
> Easiest path: drop your `favicon.svg` into realfavicongenerator.net, download
> the package, commit to `public/`, and paste its 4 `<link>` tags.

---

## 4. Performance — images & fonts

**Responsive images (hero + section JPGs, ~260–450 KB):**
- web.dev: **WebP and AVIF "should be used where possible"; AVIF generally gives the best compression.** Priority order in 2026 = **AVIF → WebP → JPEG fallback** via `<picture>`.
- Provide `srcset` width descriptors + `sizes` so the browser picks the right resolution. For a full-bleed hero, `sizes="100vw"`.
- **Always set explicit `width`/`height`** (or `aspect-ratio`) to reserve space and prevent CLS.  Your `Hero.tsx` says `width={1920} height={1280}` but the file is **1920×1080** — fix to `height={1080}` (or the layout reserves a wrong-shape box → distortion + CLS).
- **`fetchpriority="high"`**: web.dev — in-viewport images start at *Low* priority and Chrome only boosts them after layout, adding delay; `fetchpriority="high"` makes the LCP image start High immediately. Your hero `<img>` already has `loading="eager" fetchpriority="high"`  — **correct, and no preload strictly needed** because it's a real `<img>` the parser discovers early.
- **Preload the LCP image** only if it's a **CSS `background-image`** (parser can't find it): `<link rel="preload" as="image" href="…" fetchpriority="high">`. Your hero is an `<img>`, so skip the preload (an SSR'd `<img>` in the markup is discovered immediately).

**Copy-paste `<picture>` for hero:**
```html
<picture>
  <source type="image/avif" srcset="/assets/hero-960.avif 960w, /assets/hero-1920.avif 1920w" sizes="100vw" />
  <source type="image/webp" srcset="/assets/hero-960.webp 960w, /assets/hero-1920.webp 1920w" sizes="100vw" />
  <img src="/assets/hero-1920.jpg" width="1920" height="1080" alt="Misty Nordic spruce grove at dawn"
       loading="eager" fetchpriority="high" decoding="async" class="h-full w-full object-cover" />
</picture>
```
> Cheaper alt that needs zero source changes (per your `LAUNCH.md`): enable
> **Cloudflare Polish = Lossy + WebP** at the edge — auto-optimizes `/assets/*.jpg`.
> Polish doesn't emit AVIF; for AVIF use `<picture>` or Cloudflare Image Resizing.

**Fonts (self-hosted variable WOFF2):**
- **Preload** the fonts actually used above the fold, **with `crossorigin`** (font fetches are always CORS/anonymous mode — omitting `crossorigin` causes a *double download*):
```html
<link rel="preload" href="/fonts/fraunces-latin-variable.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="/fonts/inter-latin-variable.woff2"    as="font" type="font/woff2" crossorigin />
```
- Only preload the 1–2 fonts in the LCP/hero. Don't preload JetBrains Mono if it's below the fold.
- **`font-display`:** for a resume/portfolio where the text *is* the content,
  **`swap` is the right choice** (text is instantly visible in a fallback, then
  swaps) — and your headline (often the LCP element) renders immediately.
  `optional` avoids layout shift entirely but may *never* show your brand font
  on slow first loads — too aggressive for a design-forward personal site.
  Pair `swap` with a tuned `size-adjust`/`ascent-override` fallback `@font-face`
  to minimize the swap shift if you want CLS perfection.

---

## 5. Privacy / legal

**Is a cookie consent banner legally required?** **No.**
- **Cloudflare Web Analytics is cookieless** — official wording: *"Cloudflare Web Analytics does not use any client-side state, such as cookies or localStorage, to collect usage metrics. We also don't 'fingerprint' individuals…"* Under **GDPR/ePrivacy**, consent banners are triggered by storing/accessing info on the device (cookies/localStorage/fingerprinting). No storage ⇒ **no ePrivacy consent banner needed**.
- **Resend** only processes data the user **voluntarily submits** by hitting Send on the contact form. That's lawful under GDPR Art. 6(1)(b)/(f) (you need to reply) — **no banner**, but you **must disclose it** (see below). No CCPA "sale."

>  **CRITICAL — your privacy page is currently false and must be rewritten
> before launch.** `src/routes/privacy.tsx` states *"no analytics trackers"* and
> *"The contact form opens your local email client… No data is transmitted to
> our server."* But the live stack runs **Cloudflare Web Analytics** and a
> **server-side Resend** call (`src/lib/contact.ts` → `api.resend.com`). Shipping
> a privacy policy that contradicts your actual processing is itself a
> GDPR/CCPA transparency violation. This is the single biggest launch blocker in
> this research.

**What the privacy policy MUST disclose about Resend (sub-processor / processor):**
- **Who:** "We use **Resend** (Resend, Inc.) as a third-party email processor to deliver and respond to contact-form submissions."
- **What data:** the name, email address, and message you submit.
- **Purpose & legal basis:** solely to receive and reply to your message (GDPR Art. 6(1)(b)/(f)); not used for marketing, not sold.
- **Retention & sub-processing:** Resend transmits/stores the email in transit; link to **Resend's privacy policy / DPA** and note Resend acts as a **processor** on your behalf (and may use its own sub-processors).
- **International transfer:** note US processing (SCCs/DPF as applicable) if EU visitors may contact you.
- Also **add Cloudflare Web Analytics** to the policy (cookieless analytics, aggregate, no cross-site tracking).

**Is honoring `Sec-GPC` sufficient for CCPA?** **Yes — when you don't sell or
share personal data.** CCPA/CPRA (Cal. Civ. Code §1798.135 + CPRA regs §7025)
require businesses to treat the **Global Privacy Control** signal as a valid
opt-out of sale/sharing. Since this site **doesn't sell or share** personal
information, honoring `Sec-GPC: 1` (as your `server.ts` already does) fully
satisfies the opt-out obligation. Keep the GPC clause — just make sure the rest
of the policy is accurate. (Note: as a personal, non-commercial site you likely
fall **below CCPA's applicability thresholds** entirely, but honoring GPC +
disclosing is best practice and costs nothing.)

---

See [`recommendations.md`](./recommendations.md) for the prioritized,
project-specific punch list.
