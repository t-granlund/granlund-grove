# SUPERSEDED — See README.md and CODE-PUPPY-BRIEF.md for current state

> This file is from 2025-06-15 and describes a pre-launch state. The site is
> now live at tylergranlund.com (deployed 2026-06-18, version 3ff4a4f2).
> Do not use this file for current work.

---

# Granlund Grove — Full Project Handoff

**For:** Opus 4.8 Max effort model  
**Written by:** Richard (code-puppy-71e835)  
**Last updated:** 2025-06-15  
**Domain:** tylergranlund.com  
**Live version:** c8fce541

---

## 1. What This Is

Tyler Granlund's personal portfolio site — "a grove carved in code." Dark-mode-only, Nordic forest aesthetic (charcoal + deep spruce + warm cedar accents). Static-first SSR via TanStack Start on Cloudflare Pages, hydrated to SPA after first paint. The whole premise: Tyler's career is a trail through a forest, and each section of the site is a "path."

---

## 2. Tech Stack

| Layer         | Technology                                                                   |
| ------------- | ---------------------------------------------------------------------------- |
| Framework     | TanStack Start (React Router v7 successor) with TanStack Query               |
| Build         | Vite 6 + `vite-tsconfig-paths`                                               |
| Styling       | TailwindCSS 4 (CSS-first config, no JS config file)                          |
| UI primitives | shadcn/ui (customized to forest palette)                                     |
| 3D / Globe    | React Three Fiber + Drei + custom GLSL shaders                               |
| Animation     | Framer Motion + GSAP ScrollTrigger (career timeline)                         |
| Fonts         | Self-hosted variable fonts: Fraunces (display), Inter (body), JetBrains Mono |
| Deployment    | Cloudflare Pages (Workers Build) via `npm run deploy`                        |
| Testing       | Vitest (unit), Playwright (e2e), axe-core (a11y)                             |
| Lint          | ESLint + Prettier                                                            |

---

## 3. Design System

### Color Tokens (semantic)

All components use semantic classes, never hardcoded hex. All colors are OKLCH.

| Token           | Role                       | Hex-ish approximation |
| --------------- | -------------------------- | --------------------- |
| `--cedar`       | Primary accent (warm gold) | #c9a96e               |
| `--mist`        | Hero / display text white  | #f5f0e6               |
| `--stone`       | Muted body text            | #c4bfb6               |
| `--spruce`      | Secondary accent (green)   | #5a7d6e               |
| `--spruce-deep` | Card backgrounds           | #2a3a32               |
| `--moss`        | Tertiary accent            | #6b8f7a               |
| `--bark`        | Warm brown                 | #6e6050               |
| `--background`  | Page bg                    | #1a2620 (charcoal)    |
| `--foreground`  | Default text               | #f0ece6               |

### Typography

- **Display:** Fraunces, 300-700 variable weight. Used for all headings.
- **Body:** Inter, 300-700. `font-feature-settings: "ss01", "cv11"`.
- **Mono:** JetBrains Mono. Used for labels, metadata, code samples.

### Spacing & Motion

- `scroll-behavior: smooth` with `scroll-padding-top: 6rem` (fixed nav clearance)
- `prefers-reduced-motion: reduce` — all animations set to 0.01ms and `scroll-behavior: auto`
- `@media print` — strips all motion/effects, renders black-on-white for recruiters
- `will-change` only on parallax layers, never on animated text

### Gradients

- `--gradient-cedar`: `linear-gradient(135deg, cedar, bark)` — primary CTA buttons
- `--gradient-grove`: fade from transparent to charcoal — used under hero overlays
- `--gradient-fade`: radial from spruce to transparent — used behind section headers

### Shadows

- `--shadow-grove`: deep multi-layer shadow for cards (0 30px 80px)
- `--shadow-lift`: lighter lift shadow for buttons (0 12px 40px)

### Utilities

- `.glass` — backdrop-blur card style used for nav + overlays
- `.grain` / `.grain-overlay` — SVG noise texture overlays
- `.fog-band` — slowly drifting fog animation (60s loop)
- `.lift` — hover-transform card utility
- `.rise` / `.rise-1`–`.rise-4` — staggered entrance animations

---

## 4. Project Structure

```
granlund-grove/
├── public/              # Static assets (fonts, images, favicons, _headers)
│   ├── fonts/
│   ├── img/             # Page images organized by route
│   │   ├── home/        # og-cover.jpg, hero.webp
│   │   ├── career/
│   │   ├── work/
│   │   ├── about/
│   │   ├── contact/
│   │   └── ventures/
│   ├── resume/          # PDF resumes
│   └── _headers         # Cloudflare static asset security headers
├── src/
│   ├── components/
│   │   └── site/        # Every page section is a component here
│   │       ├── globe/   # 3D globe sub-components
│   │       └── diagrams/# SVG system architecture diagrams
│   ├── hooks/
│   ├── lib/
│   │   ├── security-headers.ts   # CSP, HSTS, etc.
│   │   ├── sitemap.ts            # Route definitions for sitemap
│   │   ├── error-capture.ts      # SSR error capture for h3 workaround
│   │   └── error-page.ts         # Branded 500 HTML
│   ├── routes/          # File-based routing (TanStack)
│   │   ├── __root.tsx   # Root shell, fonts, skip link, Analytics
│   │   ├── index.tsx    # Home / landing hub
│   │   ├── career.tsx   # Career timeline + world map
│   │   ├── work.tsx     # Case studies / portfolio
│   │   ├── ventures.tsx # Creative / field work
│   │   ├── about.tsx    # About / bio
│   │   ├── contact.tsx  # Contact form
│   │   ├── resume.tsx   # Resume display
│   │   ├── privacy.tsx  # Privacy policy
│   │   └── sitemap.xml.ts  # Dynamic XML sitemap
│   ├── styles.css       # Tailwind theme + design tokens + utilities
│   ├── server.ts        # Cloudflare Worker entry (SSR, security headers, redirects)
│   └── vite-env.d.ts
├── tests/
│   ├── e2e/             # Playwright (9 routes, a11y, functional, visual)
│   ├── unit/            # Vitest (globe math, security headers, contact form, content)
│   └── architecture/    # Fitness tests (security headers, dependencies)
├── wrangler.json        # Cloudflare config
├── tsconfig.json
├── package.json
└── vite.config.ts
```

---

## 5. Routes & Pages

### `/` — Home (The Grove Hub)

- Hero: Full-bleed cinematic with `VideoHero` background, H1 "A grove carved in code"
- Stat strip: "10+ Years · 6 Flagship systems · 200+ Locations · 7,000+ Tests · 48/48 Judge"
- **Six destination cards** (3×2 grid on desktop, 1 col mobile):
  1. Career — "Follow the trail"
  2. Work — "Case studies"
  3. Ventures — "Field work & creative"
  4. About — "The person behind the code"
  5. Contact — "Let's talk"
  6. Resume — "Download resume"
- Full-width CTA band: "Let's talk" (col-span-3)
- **Globe Network section** — 3D globe with career location dots and arcs
- Impact strip — three stats with hover tooltips
- Prologue — short bio paragraph
- Footer

### `/career` — Career Timeline

- **GSAP ScrollTrigger** timeline: each career phase reveals with parallax
- Apple (South Chicago) → School of Rock (Glen Ellyn + global) → Outdoor Cap (Bentonville) → Head to Toe Brands (Glen Arbor)
- Each entry has: role, years, description, contribution, location chips, source links
- **SVG world map** at top: dots for each city, with step-based coloring (Apple = step 1, SOR = step 2, etc.)
- Closing section: "22 cities across 5 continents" stat

### `/work` — Case Studies

- **Six case studies** in a grid, each with:
  - Thumbnail image
  - Title + one-line description
  - Tech stack chips
  - "Deep dive" button → opens modal
- **Deep dive modals** (React portals):
  - `CodePuppyDeepDive` — full architecture writeup with SVG diagrams
  - `EstateTraceDeepDive` — system architecture writeup
  - EstateTrace has an animated SVG diagram (`EstateTraceDiagram.tsx`)
- JSON-LD: `ItemList` of `SoftwareApplication` schemas, linked to `Person` @id from home

### `/ventures` — Creative & Field Work

- Spruce Grove Media (studio)
- FPV one-shot films (Benton Drones)
- Bentonville Brewing 'Space Goose' animation
- Zipline × Walmart drone delivery data capture (LiDAR, IR, camera)
- **Video embeds** use `VideoEmbed.tsx` — privacy-preserving facade:
  - Self-hosted poster image (public/img/ventures/<ytid>.webp+jpg)
  - Only creates `youtube-nocookie` iframe on explicit click
  - No Google requests fire on page load
  - Keeps `img-src 'self'` in CSP; only `frame-src` needs YouTube

### `/about` — Bio

- Full bio narrative
- Skills grid with progress indicators
- Philosophy section
- Photo

### `/contact` — Contact Form

- Name, email, message fields
- Rate-limited via Cloudflare Turnstile (invisible challenge)
- Client-side validation + server-side validation
- Success state after send

### `/resume` — Resume

- Embedded PDF viewer
- Download button

### `/privacy` — Privacy Policy

- GDPR-compliant privacy text
- Links to cookie policy (none used beyond CF analytics when enabled)

### `/sitemap.xml` — Dynamic Sitemap

- Manual array of routes in `src/lib/sitemap.ts`
- Updates `LAST_MODIFIED` when content changes

---

## 6. The 3D Globe Network (`src/components/site/globe/`)

This is the centerpiece visual on the home page. It renders a 3D Earth with:

- **22 city locations** as glowing marker dots
- **Great-circle arcs** connecting locations to show career trajectory
- **Atmospheric glow** via custom GLSL shaders
- **Cloud layer** (optional, can be toggled)
- **Interactive sidebar** listing all locations with details
- **Click-to-focus** — clicking a city rotates the globe to center it

### Globe Data (`data.ts`)

Each location is an object:

```typescript
{
  name: string; // City name
  lat: number; // Latitude
  lng: number; // Longitude
  type: "hub" | "intl" | "domestic"; // Hub = major, intl = international
  brand: string; // Company name
  role: string; // Job title
  years: string; // Date range
  contribution: string; // Detailed description
  sources: {
    label: string;
    url: string;
  }
  []; // Verifiable links
}
```

**Current 22 cities (as of latest deploy):**

| #   | City                | Brand              | Type     |
| --- | ------------------- | ------------------ | -------- |
| 0   | Chicago             | Apple              | hub      |
| 1   | Glen Ellyn          | School of Rock     | hub      |
| 2   | Milwaukee           | School of Rock     | domestic |
| 3   | Bentonville         | Outdoor Cap        | hub      |
| 4   | Dallas              | Outdoor Cap        | hub      |
| 5   | Rancho Cucamonga    | Outdoor Cap        | hub      |
| 6   | Zanesville          | Outdoor Cap        | hub      |
| 7   | São Paulo           | School of Rock     | intl     |
| 8   | Rio de Janeiro      | School of Rock     | intl     |
| 9   | Santiago            | School of Rock     | intl     |
| 10  | Lima                | School of Rock     | intl     |
| 11  | Asunción            | School of Rock     | intl     |
| 12  | Madrid              | School of Rock     | intl     |
| 13  | Lisbon              | School of Rock     | intl     |
| 14  | Blackrock (Ireland) | School of Rock     | intl     |
| 15  | Taichung            | School of Rock     | intl     |
| 16  | Sydney              | School of Rock     | intl     |
| 17  | Perth               | School of Rock     | intl     |
| 18  | Cape Town           | School of Rock     | intl     |
| 19  | Great Falls         | Head to Toe Brands | hub      |
| 20  | Glen Arbor          | Head to Toe Brands | hub      |
| 21  | South Lake          | Head to Toe Brands | hub      |

**ARCS** (great-circle connections):

```
Chicago → Glen Ellyn
Glen Ellyn → Milwaukee
Glen Ellyn → São Paulo
Glen Ellyn → Santiago, Lima, Asunción
Glen Ellyn → Blackrock, Taichung, Sydney, Perth, Cape Town
São Paulo → Madrid, Lisbon
Bentonville → Dallas, Rancho Cucamonga, Zanesville
Bentonville → Great Falls, Glen Arbor
Glen Arbor → South Lake
```

### Globe Component Architecture

- `GlobeScene.tsx` — R3F Canvas + camera + lights + lazy loading wrapper
- `Earth.tsx` — The sphere with custom shader material
- `Atmosphere.tsx` — Glow ring around the planet
- `CloudLayer.tsx` — Optional animated cloud overlay
- `Markers.tsx` — City dots with hover glow
- `Arcs.tsx` — Bezier-curve great-circle arcs with animated dash
- `LocationCard.tsx` — Popup card when a city is clicked
- `Sidebar.tsx` — Right-panel list of all locations

### Globe Performance Notes

- `GlobeNetwork.tsx` lazy-loads the entire Three.js chunk via dynamic `import()`
- The 3D canvas is wrapped in `<Suspense>` with a "Loading network…" fallback
- Three.js code NEVER runs during SSR — it only hydrates client-side
- `will-change: transform` on parallax layers only, never on text
- `drift` animation (8s loop) is pure CSS, not JS-driven

---

## 7. Recent Changes (Last Session)

### Career Map Content Update

**Goal:** Remove non-work-location entries from the career visualization. The narrative still mentions factories in Bangladesh, China, Vietnam, Sri Lanka as part of the Outdoor Cap Compass story, but only actual **work locations** (where Tyler was physically based or directly managed operations) get dots on the map and globe.

**Removed:**

- Shanghai (never had a dot, but was mentioned in text)
- Hanoi (factory coordination — removed from all maps + globe)
- Dhaka (factory coordination — removed from all maps + globe)

**What was updated:**

1. `src/components/site/CareerWorldMap.tsx` — Removed Hanoi + Dhaka from `CITIES` array; kept Bentonville, Dallas, Rancho Cucamonga, Zanesville only for Outdoor Cap step
2. `src/components/site/CareerImpactTimeline.tsx` —
   - Outdoor Cap location chips: removed Hanoi, Dhaka
   - Intro text: "24 cities" → "22 cities"
   - Closing stat: "24" → "22"
3. `src/components/site/GlobeNetwork.tsx` —
   - Overlay: "24 locations" → "22 locations"
   - Section label: "24 cities" → "22 cities"
   - Descriptive text: "Hanoi to Cape Town" → "Great Falls to Cape Town"
4. `src/components/site/globe/data.ts` —
   - Removed Hanoi + Dhaka entries from `CITIES` array
   - Rebuilt `ARCS` indices (shifted from 24 to 22 entries)
5. `src/components/site/globe/Sidebar.tsx` — "24 cities" → "22 cities"
6. `tests/e2e/site.spec.ts` — Globe test expectation: "24 cities" → "22 cities"

**Verification:**

- Full build: typecheck + 42 unit tests + 75/75 e2e tests pass
- Axe: 0 violations
- Deployed: c8fce541
- No "Shanghai", "Hanoi", or "Dhaka" strings remain anywhere in source

---

## 8. Security & Privacy

### CSP (`src/lib/security-headers.ts`)

```
default-src 'self'
script-src 'self' 'unsafe-eval' 'unsafe-inline'
style-src 'self' 'unsafe-inline'
img-src 'self' data: blob:
font-src 'self'
connect-src 'self' https://cloudflareinsights.com
frame-src 'self' https://www.youtube-nocookie.com
media-src 'self'
object-src 'none'
base-uri 'self'
form-action 'self'
frame-ancestors 'none'
upgrade-insecure-requests
```

### Other Headers

- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=()`
- `GPC: 1` (Global Privacy Control, when Sec-GPC:1 is present)

### Analytics

- Cloudflare Web Analytics beacon (conditional on `VITE_CF_BEACON_TOKEN` env var)
- No cookies, no tracking pixels, no Google Analytics
- The Analytics component (`src/components/site/Analytics.tsx`) only renders the beacon script when the token is present at build time
- Zero overhead until opted in

### Error Handling

- `error-capture.ts` — Intercepts and stores the last error before h3 swallows it
- `error-page.ts` — Branded 500 HTML (forest-themed, not a white screen)
- `normalizeCatastrophicSsrResponse()` in `server.ts` — Detects h3's JSON error body and replaces it with the branded page

---

## 9. Testing Strategy

### Unit Tests (Vitest)

| File                       | Coverage                                |
| -------------------------- | --------------------------------------- |
| `globe.test.ts`            | Math utilities, coordinate calculations |
| `security-headers.test.ts` | CSP directives, header presence         |
| `contact.test.ts`          | Form validation, submission logic       |
| `content.test.tsx`         | Component rendering, props              |
| `utils.test.ts`            | Helper functions                        |
| `error-capture.test.ts`    | Error interception                      |

### E2E Tests (Playwright, 75 tests across 9 routes)

- Every route: renders `<main>` landmark + proper heading hierarchy
- Home: hero renders, globe network section, CTAs, gradient buttons paint correctly
- Career: timeline renders, world map SVG dots, stat numbers
- Work: case study grid, modal open/close, deep dive content
- Contact: form fields, validation, Turnstile widget, submit flow
- Navigation: active route highlighting, mobile hamburger menu
- Footer: links, social icons
- Accessibility: axe-core scan on every route (0 violations required)
- Privacy + Sitemap: route existence, XML structure

### Architecture Tests

- `fitness.test.ts` — No new heavy dependencies, bundle size thresholds
- `security-headers.test.ts` — All security headers present and correct

---

## 10. Deployment

```bash
npm run build    # Vite SSR build → dist/
npm run deploy   # Wrangler deploy to Cloudflare Pages
```

**Cache-Control logic in `server.ts`:**

- `/assets/*`, `/img/*`, `/fonts/*` → `public, max-age=31536000, immutable`
- `/resume/*` → `public, max-age=86400, stale-while-revalidate=3600`
- Everything else → no cache (SSR)

**Redirects:**

- `www.tylergranlund.com` → `tylergranlund.com` (301, done in Worker code, not `_redirects`)

---

## 11. What's Done vs What's On The Table

### Complete (100%)

- All 6 pages with full content
- 3D globe with 22 locations + arcs
- GSAP ScrollTrigger career timeline
- Case study deep dives with SVG diagrams
- Video embeds (privacy-preserving facade)
- Contact form with Turnstile
- JSON-LD schema (Person + ItemList of SoftwareApplication)
- Full accessibility: skip link, focus-visible, semantic HTML, aria-current
- Lighthouse: 94-97 Performance, 100 A11y, 100 SEO, 100 Best Practices
- Judge score: 26/26 (100%)
- E2E: 75/75 passing
- Axe: 0 violations
- CSP + all security headers
- Print stylesheet
- Reduced motion support
- Error handling (branded 500s)
- Self-hosted fonts (GDPR compliant)

### ⏳ Requires Manual Step

- **Cloudflare Web Analytics token** — Add `VITE_CF_BEACON_TOKEN` to build env (Cloudflare dashboard → Environment variables). The component is wired and waiting; zero overhead until set.

### Future Work (Not Urgent)

- **Per-page OG images** — Currently every page shares `og-cover.jpg`. Could generate unique OG images per route (Tyler has a C&M Barber OG generator he could adapt)
- **Dark mode toggle** — YAGNI. The design system is intentionally dark-only (Nordic forest). There's no light mode to toggle to.
- **Blog / MDX** — Tyler explicitly said "skip unless you'll actually write." An empty blog hurts more than no blog.

---

## 12. Important Gotchas & Tribal Knowledge

1. **h3 swallows errors.** TanStack Start's server entry uses h3, which catches in-handler throws and returns them as 500 Responses with JSON body `{"unhandled":true,"message":"HTTPError"}`. A regular `try/catch` won't catch these. The workaround is `normalizeCatastrophicSsrResponse()` in `server.ts`, which detects the JSON pattern and replaces it with the branded error page. `error-capture.ts` stores the real error before h3 gets it.

2. **Three.js is client-only.** Never import Three.js at the top level of a route or root component. Always lazy-load via `useEffect` + dynamic `import()`. The `GlobeNetwork.tsx` component does this correctly.

3. **Font preload matters.** `fraunces-latin-variable.woff2` is preloaded in `__root.tsx` `<head>` with `crossOrigin: "anonymous"`. Without this, the LCP (hero H1) flashes unstyled.

4. **Tailwind 4 is CSS-first.** There is NO `tailwind.config.js`. All theme tokens live in `styles.css` inside `@theme inline`. The `@source` directive points to `../src`.

5. **Video embed facade is a CSP contract.** The `VideoEmbed.tsx` component only shows a self-hosted poster until clicked. This keeps `img-src 'self'` strict. If you ever change it to load YouTube thumbnails on page load, you'll need to relax `img-src` to include `https://i.ytimg.com`.

6. **Sitemap is manual.** `src/lib/sitemap.ts` contains a `ROUTES` array. When you add a new page, you MUST add it there AND update `LAST_MODIFIED`. The sitemap route (`sitemap.xml.ts`) reads from this array.

7. **The globe ARCS array uses raw indices.** If you add/remove cities from `globe/data.ts`, you MUST rebuild the `ARCS` array. The indices shift. There is no automatic index management — it's a `[fromIndex, toIndex][]` array referencing positions in the `CITIES` array. This is fragile; future refactor should use city name references instead of numeric indices.

8. **`styles.css` is sacred.** Every color, shadow, gradient, animation, and utility lives here. Components only use semantic classes (`text-cedar`, `bg-spruce-deep`, etc.). Never hardcode colors in JSX.

9. **Nav + Footer each have their own items array.** Nav links are in `Nav.tsx`. Footer links are in `Footer.tsx`. When adding a new page, update BOTH.

10. **Hero stat strip is career-spanning, NOT employer-specific.** After previous feedback, the hero only shows: "10+ Years · 6 Flagship systems · 200+ Locations · 7,000+ Tests · 48/48 Judge". No single-employer numbers in the hero.

---

## 13. Key Files Quick Reference

| Purpose          | File                                                                   |
| ---------------- | ---------------------------------------------------------------------- |
| Design tokens    | `src/styles.css`                                                       |
| Root shell       | `src/routes/__root.tsx`                                                |
| Security headers | `src/lib/security-headers.ts`                                          |
| Worker entry     | `src/server.ts`                                                        |
| Globe data       | `src/components/site/globe/data.ts`                                    |
| Globe scene      | `src/components/site/globe/GlobeScene.tsx`                             |
| Globe wrapper    | `src/components/site/GlobeNetwork.tsx`                                 |
| Career timeline  | `src/components/site/CareerImpactTimeline.tsx`                         |
| Career SVG map   | `src/components/site/CareerWorldMap.tsx`                               |
| Case studies     | `src/components/site/Projects.tsx`                                     |
| Deep dive modals | `src/components/site/CodePuppyDeepDive.tsx`, `EstateTraceDeepDive.tsx` |
| Video embed      | `src/components/site/VideoEmbed.tsx`                                   |
| Contact form     | `src/components/site/Contact.tsx`                                      |
| Nav              | `src/components/site/Nav.tsx`                                          |
| Footer           | `src/components/site/Footer.tsx`                                       |
| Sitemap data     | `src/lib/sitemap.ts`                                                   |
| E2E tests        | `tests/e2e/site.spec.ts`                                               |
| Security tests   | `tests/architecture/security-headers.test.ts`                          |

---

_Built with code, coffee, and canine enthusiasm. — Richard _
