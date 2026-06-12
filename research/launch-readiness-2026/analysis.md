# Multi-Dimensional Analysis

Each launch-readiness area assessed through the security / cost / complexity /
stability / compatibility / maintenance lenses, with verbatim source evidence.

---

## 1. Structured data (ProfilePage + Person)

**Source evidence (Google Search Central, updated 2025-12-10):**
- "Valid use cases: … An 'About Me' page on a blog site … An employee page on a company website."
- Required: `mainEntity` (Person or Organization) — "otherwise, default to `Person`."
- Person required: `name` (or `alternateName` as fallback). Recommended: `alternateName`, `description`, `identifier`, `image`, `sameAs`, interaction stats.
- Image guidance: crawlable/indexable, representative, supported format, "minimum of 50K pixels when multiplying width and height," ratios 16×9, 4×3, 1×1.
- Technical Guidelines show `@id` cross-linking (`"@id": "#main-author"` referenced from `author`).

| Lens | Assessment |
|------|------------|
| Security | Inert JSON-LD; no attack surface. Don't leak private data (home address precision — locality/region is fine, omit street). |
| Cost | Zero. Static markup. |
| Complexity | Low. One `@graph` block. ProfilePage wrapper is a 6-line addition. |
| Stability | High — `Person`/`ProfilePage` are stable schema.org core; Google doc actively maintained (Dec 2025). |
| Compatibility | Universal. SSR emits it server-side (already done via `dangerouslySetInnerHTML`). |
| Maintenance | Update `dateModified` on content changes; keep `jobTitle`/`worksFor` in sync with on-page copy (currently drifted — see P0.3). |

**Net:** Adopt ProfilePage wrapper + single `@graph`. Don't expect a visible
rich result (that's a Discussions/Forums feature) — value is entity clarity.

---

## 2. Open Graph + X/Twitter cards

**Source evidence:**
- ogp.me: required `og:title`, `og:type`, `og:image`, `og:url`. Image structured props `og:image:width/height/alt/type/secure_url`. **"If the page specifies an og:image it should specify og:image:alt."** Default `og:locale` = `en_US`. `profile` and `website` are valid types.
- RealFaviconGenerator live markup (2026): `og:image:width=1200`, `og:image:height=630`, `twitter:card=summary_large_image`, `twitter:site`, `twitter:image:width=1200`, `twitter:image:height=628`.

| Lens | Assessment |
|------|------------|
| Security | None — meta tags. Use HTTPS absolute URLs (you do). |
| Cost | Zero markup; one-time image asset regen to 1200×630. |
| Complexity | Trivial — add 6 meta tags + resize one image. |
| Stability | OGP spec is frozen/canonical; LinkedIn/Slack/iMessage rely on it. X moving *toward* OG reduces future churn. |
| Compatibility | OG covers LinkedIn + Slack + iMessage + X. `twitter:card` is the only X-specific must-keep. |
| Maintenance | LinkedIn caches ~7 days → use Post Inspector after each share-image change. |

**Risk flagged:** current `og-cover.jpg` 1920×1080 renders wrong on 1.91:1
consumers. Missing `og:image:width/height` means LinkedIn may show a small
thumbnail on first scrape.

---

## 3. Favicon / PWA

**Source evidence:** RealFaviconGenerator's own 2026 `<head>`: `favicon.ico`
(48×48) + SVG `icon` (`sizes="any"`) + 96px PNG + `apple-touch-icon` 180×180 +
`manifest` (crossorigin) + `apple-mobile-web-app-title`. **No `mask-icon`, no
`browserconfig.xml`.**

| Lens | Assessment |
|------|------------|
| Security | Manifest + icons same-origin; CSP `img-src 'self'` already allows. No JS. |
| Cost | Zero ongoing. One-time icon generation. |
| Complexity | Low — generator produces the package; 3 `<link>` tags + manifest. |
| Stability | Very stable; `mask-icon`/MS-tile removal *reduces* surface. SVG favicon is broadly supported in 2026. |
| Compatibility | `.ico` covers legacy + scrapers hitting `/favicon.ico`; SVG covers modern; apple-touch covers iOS home screen; manifest covers Android/installability. |
| Maintenance | Set-and-forget. Re-run generator only on rebrand. |

**Gap:** project ships only `favicon.svg` — missing `.ico`, apple-touch-icon,
manifest. `theme-color` present.

---

## 4. Performance (images + fonts)

**Source evidence (web.dev):**
- Fetch Priority: "Images inside the viewport typically start at a Low priority. After the layout is complete, Chrome … boosts their priority. This usually adds a significant delay … an explicit `fetchpriority='high'` will be even better." "Preload is still required for early discovery of LCP images included as CSS backgrounds."
- Image formats: "WebP and AVIF will generally provide better compression than older formats, and should be used where possible. You can use WebP or AVIF … along with a JPEG or PNG image as a fallback." "photo … Use JPEG, lossy WebP, or AVIF."

| Lens | Assessment |
|------|------------|
| Security | Static assets; serve immutable/fingerprinted (build already fingerprints). |
| Cost | AVIF/WebP cut bytes → lower bandwidth. Cloudflare Polish free-tier path avoids build complexity. |
| Complexity | `<picture>` + multi-format export adds build steps; Polish is zero-code. Font preload is 2 lines. |
| Stability | `srcset`/`<picture>`/`fetchpriority`/`preload` all baseline-supported in 2026. |
| Compatibility | AVIF widely supported; `<picture>` guarantees JPEG fallback. `crossorigin` on font preload required for correct CORS. |
| Maintenance | Regenerate derivatives when art changes; keep `width`/`height` synced to real pixel dims (the hero mismatch is exactly this failure). |

**Findings:** Hero `<img>` already optimal for priority (eager + high). Real
bugs: (a) declared height 1280 vs actual 1080 → CLS; (b) heavy section JPGs
(446/355/274 KB) un-optimized; (c) fonts not preloaded. `font-display: swap`
correct for a text-forward resume (LCP headline visible instantly); `optional`
too aggressive (may never show brand font).

---

## 5. Privacy / legal

**Source evidence:**
- Cloudflare: "Cloudflare Web Analytics does not use any client-side state, such as cookies or localStorage, to collect usage metrics. We also don't 'fingerprint' individuals via their IP address, User Agent string, or any other data…"
- GDPR/ePrivacy Art. 5(3): consent is triggered by storing/accessing info on the device. No storage ⇒ no banner (disclosure still required).
- CCPA/CPRA §1798.135 + Regs §7025: businesses must honor opt-out preference signals (GPC). No sale/share ⇒ honoring `Sec-GPC` is sufficient.

| Lens | Assessment |
|------|------------|
| Security | `server.ts` already honors GPC + sets privacy headers. Resend key is a Worker secret (good). Honeypot anti-spam in `contact.ts` (good). |
| Cost | No CMP/consent vendor needed (cookieless). Resend free tier. Zero legal tooling cost. |
| Complexity | Low — it's a documentation/accuracy problem, not an engineering one. Rewrite one route file. |
| Stability | Cookieless posture is durable; avoids EU consent-banner churn entirely. |
| Compatibility | Works across jurisdictions (GDPR + CCPA) precisely because nothing is stored/sold. |
| Maintenance | Keep the policy synced with the stack. **Add a processor whenever you add a vendor** (Resend, Cloudflare already in scope). Update "Last updated" date. |

**Critical risk:** the shipped privacy policy contradicts the actual stack
(claims no analytics + mailto-only). Accurate disclosure of Cloudflare Web
Analytics + Resend (as a processor/sub-processor) is **mandatory** and is the
top launch blocker. Banner: **not required**. GPC: **sufficient** as-is.

---

## Priority synthesis
1. **P0:** privacy-policy rewrite (legal accuracy), OG image 1200×630, JSON-LD/positioning reconciliation.
2. **P1:** complete OG/Twitter meta, ProfilePage `@graph`, favicon/PWA set, hero width/height fix.
3. **P2:** AVIF/WebP (or Polish), font preload.
4. **P3:** breadcrumb on /privacy, per-share meta tweaks.
