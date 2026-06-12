import { createFileRoute, Link } from "@tanstack/react-router";
import { TreeMark } from "@/components/site/TreeMark";

export const Route = createFileRoute("/colophon")({
  head: () => ({
    meta: [
      { title: "Colophon — Tyler Granlund" },
      {
        name: "description",
        content:
          "How tylergranlund.com is built — stack, typography, accessibility, privacy, and hosting.",
      },
      { name: "robots", content: "noindex, follow" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/colophon" }],
  }),
  component: ColophonPage,
});

type Entry = { label: string; value: string; note?: string };

const sections: { heading: string; entries: Entry[] }[] = [
  {
    heading: "Framework & language",
    entries: [
      { label: "TanStack Start", value: "React 19 + file-based routing", note: "SSR via Vinxi" },
      { label: "TypeScript", value: "Strict mode, no suppressions" },
      { label: "Tailwind CSS v4", value: "CSS-first config, no tailwind.config.js" },
      { label: "Radix UI", value: "Accessible primitives for interactive components" },
    ],
  },
  {
    heading: "Quality gates",
    entries: [
      { label: "Vitest", value: "Unit + component tests", note: "28 passing" },
      { label: "Playwright", value: "End-to-end + visual regression" },
      { label: "axe-core", value: "Accessibility audit on every e2e run", note: "30 passing" },
      { label: "TypeScript", value: "Type-checked in CI before deploy" },
    ],
  },
  {
    heading: "Typography",
    entries: [
      { label: "Fraunces", value: "Display / serif — variable, self-hosted", note: "No CDN" },
      { label: "Inter", value: "Body / sans-serif — variable, self-hosted" },
      { label: "JetBrains Mono", value: "Mono / kicker labels — variable, self-hosted" },
    ],
  },
  {
    heading: "Performance",
    entries: [
      { label: "Images", value: "AVIF + WebP + JPEG srcset, per-breakpoint widths" },
      { label: "Fonts", value: "Self-hosted WOFF2, font-display: swap, preloaded" },
      { label: "No CDN JS", value: "Zero third-party scripts — no analytics, no trackers" },
      { label: "Compression", value: "Brotli via Cloudflare Workers" },
    ],
  },
  {
    heading: "Accessibility",
    entries: [
      { label: "WCAG 2.2 AA", value: "Target standard — validated by axe-core in CI" },
      { label: "Skip link", value: "Jump to main content on every page" },
      {
        label: "Focus styles",
        value: "Cedar ring, 2px offset — visible on all interactive elements",
      },
      { label: "Reduced motion", value: "All animations respect prefers-reduced-motion" },
    ],
  },
  {
    heading: "Privacy",
    entries: [
      { label: "No cookies", value: "Zero tracking cookies or persistent identifiers" },
      { label: "No third-party requests", value: "All assets self-hosted — nothing phoned home" },
      {
        label: "Contact form",
        value: "Submitted via Workers function — no data stored client-side",
      },
      {
        label: "Cloudflare Web Analytics",
        value: "Cookie-free edge analytics (no personal data)",
        note: "When enabled",
      },
    ],
  },
  {
    heading: "Hosting & deploy",
    entries: [
      { label: "Cloudflare Workers", value: "Edge SSR — global, sub-50ms TTFB" },
      { label: "Wrangler", value: "Deploy pipeline via wrangler deploy" },
      { label: "Security headers", value: "CSP, HSTS, X-Frame-Options, Referrer-Policy" },
      { label: "DMARC / security.txt", value: "Email authentication + responsible disclosure" },
    ],
  },
  {
    heading: "Design",
    entries: [
      { label: "Palette", value: "Nordic forest dark — near-black spruce, warm cedar, stone/mist" },
      { label: "Design system", value: "All tokens in styles.css via @theme inline" },
      { label: "OG image", value: "Playwright + Sharp — generated at build time, not at runtime" },
      {
        label: "Architecture diagrams",
        value: "Inline SVG, CSS custom properties, no external deps",
      },
    ],
  },
];

function ColophonPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-background)]" tabIndex={-1}>
      <div className="mx-auto max-w-3xl px-6 py-32">
        <Link
          to="/"
          className="inline-flex items-center gap-2.5 mb-16 hover:opacity-80 transition-opacity"
        >
          <TreeMark className="h-7 w-7 text-cedar" />
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Tyler Granlund
          </span>
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl font-light text-balance">
          How the grove <em className="not-italic text-cedar">was built.</em>
        </h1>
        <p className="mt-6 text-stone/80 leading-relaxed max-w-xl">
          The decisions behind tylergranlund.com — stack, typography, performance, accessibility,
          privacy, and hosting. Boring in the best way.
        </p>

        <div className="mt-16 space-y-14">
          {sections.map((s) => (
            <section key={s.heading} aria-labelledby={`col-${s.heading.replace(/\s+/g, "-")}`}>
              <h2
                id={`col-${s.heading.replace(/\s+/g, "-")}`}
                className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-5"
              >
                {s.heading}
              </h2>
              <dl className="divide-y divide-border">
                {s.entries.map((e) => (
                  <div key={e.label} className="grid sm:grid-cols-[14rem_1fr] gap-1 sm:gap-6 py-4">
                    <dt className="text-sm font-medium text-foreground">{e.label}</dt>
                    <dd className="text-sm text-stone/80">
                      {e.value}
                      {e.note && (
                        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.15em] text-cedar/70">
                          {e.note}
                        </span>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>

        <div className="mt-20 pt-8 border-t border-border flex flex-wrap gap-6 text-xs text-stone/50 font-mono">
          <span>EST. MMXXVI</span>
          <span>BELLA VISTA, ARKANSAS</span>
          <Link to="/" className="hover:text-cedar transition-colors">
            tylergranlund.com
          </Link>
        </div>
      </div>
    </main>
  );
}
