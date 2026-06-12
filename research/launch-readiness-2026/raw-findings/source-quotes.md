# Verbatim source extracts (2026-06-11)

## Google — ProfilePage structured data (updated 2025-12-10)
> "ProfilePage markup is designed for any site where creators (either people or organizations) share first-hand perspectives."

Valid use cases:
> "A user profile page on a forum or social media site / An author page on a news site / An 'About Me' page on a blog site / An employee page on a company website"

Required:
> "mainEntity — Person or Organization … the primary focus of this page is information about this entity. Try to use the correct type … otherwise, default to Person."

Person required/recommended:
> "name (required) … We recommend using this field for real names (and alternateName for social media handles)."
> Recommended: agentInteractionStatistic, alternateName, description, identifier, image, interactionStatistic, sameAs.

Image:
> "we recommend providing multiple high-resolution images (minimum of 50K pixels when multiplying width and height) with the following aspect ratios: 16x9, 4x3, and 1x1."

Technical guideline `@id` example:
> `"mainEntity": { "@id": "#main-author", "@type": "Person", "name": "Marlo Smith" }` … `"author": { "@id": "#main-author" }`

## ogp.me — Open Graph protocol
> "The four required properties for every page are: og:title, og:type, og:image, og:url."
> "og:image:width — The number of pixels wide. og:image:height — The number of pixels high. og:image:alt — A description of what is in the image (not a caption). **If the page specifies an og:image it should specify og:image:alt.**"
> "og:locale — … Default is en_US."
> Types include `website` (default) and `profile` (profile:first_name, last_name, username, gender).

## RealFaviconGenerator — own live `<head>` (2026, scraped)
```html
<link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="48x48">
<link rel="icon" href="/icon0.svg" type="image/svg+xml" sizes="any">
<link rel="icon" href="/icon1.png" type="image/png" sizes="96x96">
<link rel="apple-touch-icon" href="/apple-icon.png" type="image/png" sizes="180x180">
<link rel="manifest" href="/manifest.json" crossorigin="use-credentials">
<meta name="apple-mobile-web-app-title" content="RealFavicon">
<!-- OG/Twitter on same page: -->
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@RealFavicon">
<meta name="twitter:image:width" content="1200">
<meta name="twitter:image:height" content="628">
```
NOTE: No `mask-icon` (Safari pinned tab), no `browserconfig.xml` — dropped in modern baseline.

## web.dev — Fetch Priority API
> "Images inside the viewport typically start at a Low priority. After the layout is complete, Chrome discovers that they're in the viewport and boosts their priority. This usually adds a significant delay to loading the critical images, like hero images. … the first five larger images are set to Medium priority by Chrome … but an explicit fetchpriority='high' will be even better."
> "Preload is still required for early discovery of LCP images included as CSS backgrounds. To boost your background images' priority, include fetchpriority='high' on the preload."
> "Developers should use preload for its intended purpose—to preload resources not detected by the parser (fonts, imports, background LCP images)."

## web.dev — Choose the right image format
> "WebP and AVIF will generally provide better compression than older formats, and should be used where possible. You can use WebP or AVIF images along with a JPEG or PNG image as a fallback."
> "Are you optimizing a photo, screenshot, or a similar image asset? Use JPEG, lossy WebP, or AVIF."

## Cloudflare — Web Analytics
> "Cloudflare Web Analytics does not use any client-side state, such as cookies or localStorage, to collect usage metrics. We also don't 'fingerprint' individuals via their IP address, User Agent string, or any other data for the purpose of displaying analytics."

## Project facts verified locally
- `public/og-cover.jpg`: JPEG **1920x1080** (1.78:1), 268,226 bytes. → must be 1200x630.
- `src/assets/hero-spruce.jpg`: JPEG **1920x1080**. But `Hero.tsx` declares `width={1920} height={1280}`. → mismatch, fix to 1080.
- `src/routes/privacy.tsx`: claims "no analytics trackers" and "No data is transmitted to our server" (mailto). Contradicts `src/lib/contact.ts` (POST to api.resend.com) + `LAUNCH.md` §6 (Cloudflare Web Analytics).
- `src/routes/__root.tsx`: has `theme-color #1a2620` + `favicon.svg`; missing favicon.ico, apple-touch-icon, manifest, font preloads.
- `src/routes/index.tsx`: OG set present but missing og:image:width/height, og:image:alt, og:site_name, og:locale, twitter:image:alt. JSON-LD = two separate blocks (WebSite + Person) with bare `#person` @id.
