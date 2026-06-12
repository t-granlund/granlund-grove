# Sources & Credibility Assessment

All sources accessed 2026-06-11 by `web-puppy-1f9925`. Reliability tier per the
research methodology (Tier 1 = official/primary; Tier 2 = established vendor/expert).

## Area 1 — Structured data
| Source | URL | Tier | Currency | Notes |
|--------|-----|------|----------|-------|
| Google Search Central — "Profile page (ProfilePage) structured data" | https://developers.google.com/search/docs/appearance/structured-data/profile-page | **1** | **Last updated 2025-12-10** | Primary, authoritative. Confirms `ProfilePage.mainEntity` pattern, "About Me"/"employee page" as valid use cases, required `name`, recommended Person props, image guidance (1:1/4:3/16:9, min 50K px), `@id` linking example in Technical Guidelines. |
| schema.org/Person, /ProfilePage | https://schema.org/ProfilePage | **1** | Living vocab | Full property definitions for props Google doesn't enumerate (jobTitle, worksFor, alumniOf, knowsAbout). |

## Area 2 — Open Graph + X/Twitter
| Source | URL | Tier | Currency | Notes |
|--------|-----|------|----------|-------|
| The Open Graph protocol (ogp.me) | https://ogp.me/ | **1** | Canonical spec | Required 4 (`og:title/type/image/url`); structured image props (`og:image:width/height/alt/type/secure_url`); rule "if og:image then og:image:alt"; `profile` + `website` types; `og:locale` default en_US. |
| RealFaviconGenerator live `<head>` (their own 2026 markup) | https://realfavicongenerator.net/ | **2** | © 2026, live-scraped | Cross-reference for current OG/Twitter card markup: emits `og:image:width=1200`, `og:image:height=630`, `twitter:card=summary_large_image`, `twitter:site`, `twitter:image:width=1200`, `twitter:image:height=628`. |

> X/Twitter Cards: official docs are now **unmaintained/deprecated**; the
> widely-reported 2025/2026 behavior is that X reads **Open Graph** as the
> primary source and uses `twitter:*` only as override/fallback, with
> `twitter:card` still needed to trigger `summary_large_image`. Treated as Tier-2
> community/vendor consensus, not a single primary doc. LinkedIn image spec
> (1200×627, 1.91:1, <5 MB, ~7-day cache, Post Inspector refresh) is LinkedIn's
> documented behavior — Tier 2.

## Area 3 — Favicon / PWA
| Source | URL | Tier | Currency | Notes |
|--------|-----|------|----------|-------|
| RealFaviconGenerator (homepage + blog, live markup) | https://realfavicongenerator.net/ | **2 (de-facto reference)** | © 2026 | Their *own* production `<head>` is the modern baseline: `favicon.ico` (48×48) + SVG `icon` (`sizes=any`) + 96px PNG + `apple-touch-icon` 180×180 + `manifest` + `apple-mobile-web-app-title`. **No `mask-icon`, no `browserconfig.xml`** — confirms Safari pinned-tab mask is dropped in 2026. |
| MDN — Web app manifest / `<link rel>` types | https://developer.mozilla.org/ | **1** | Living | Manifest icon sizes (192/512), `theme-color`, `apple-touch-icon` semantics. |

## Area 4 — Performance
| Source | URL | Tier | Currency | Notes |
|--------|-----|------|----------|-------|
| web.dev — "Optimize resource loading with the Fetch Priority API" | https://web.dev/articles/fetch-priority | **1** (Google/Chrome) | Maintained | In-viewport images start Low and are boosted only after layout; `fetchpriority="high"` starts them High; first 5 large images get Medium auto; **preload required only for CSS-background LCP images**; preload is for parser-undiscoverable resources (fonts, background images). |
| web.dev — "Choose the right image format" | https://web.dev/articles/choose-the-right-image-format | **1** | Maintained | "WebP and AVIF… should be used where possible"; AVIF best compression; use modern format + JPEG/PNG fallback; photos → JPEG/lossy-WebP/AVIF. |
| web.dev — font best practices (preload + crossorigin, font-display) | https://web.dev/ | **1** | Maintained | Self-hosted WOFF2 preload must include `crossorigin` (anonymous CORS mode) or it double-downloads; `font-display: swap` vs `optional` tradeoffs. |

## Area 5 — Privacy / legal
| Source | URL | Tier | Currency | Notes |
|--------|-----|------|----------|-------|
| Cloudflare — Web Analytics product page | https://www.cloudflare.com/web-analytics/ | **1** (vendor primary) | Live 2026 | Exact quote: "does not use any client-side state, such as cookies or localStorage… We also don't 'fingerprint' individuals…" — basis for "no consent banner." |
| Cloudflare Web Analytics docs | https://developers.cloudflare.com/web-analytics/ | **1** | Updated 2026-04-16 | "without compromising user privacy." |
| CCPA/CPRA — Cal. Civ. Code §1798.135 + CPRA Regs §7025 (GPC) | https://oag.ca.gov/privacy/ccpa | **1** (statute/regulator) | Current | Businesses must honor opt-out preference signals (Global Privacy Control). Honoring `Sec-GPC` satisfies opt-out of sale/share; if none sold/shared, fully compliant. |
| GDPR / ePrivacy Directive Art. 5(3) | https://gdpr.eu/ | **1** | Current | Consent is triggered by storing/accessing data on the device; cookieless analytics + user-initiated form submission do not require a consent banner (disclosure still required). |
| Resend — privacy policy / DPA / sub-processors | https://resend.com/legal | **1** (processor primary) | Current | Confirms Resend acts as processor; cite in your policy for sub-processor disclosure. |

## Cross-referencing notes
- OG image 1200×630 / 1.91:1 corroborated by **both** ogp.me structured-property
  conventions and RealFaviconGenerator's live `og:image:width/height=1200/630`.
- `mask-icon` deprecation corroborated by RealFaviconGenerator's omission of it
  from their own current package (they were the historical champion of it).
- Cookieless-analytics legal position corroborated by Cloudflare's explicit
  product statement + GDPR/ePrivacy trigger definition.
