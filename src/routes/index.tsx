import { createFileRoute, Link } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Picture } from "@/components/site/Picture";
import { TreeMark } from "@/components/site/TreeMark";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tyler Granlund — IT Operations & Systems Engineer" },
      {
        name: "description",
        content:
          "Tyler Granlund is an IT operations & systems engineer in Bella Vista, Arkansas — building resilient systems for people, brands, and what comes next.",
      },
      { property: "og:title", content: "Tyler Granlund — IT Operations & Systems Engineer" },
      {
        property: "og:description",
        content:
          "IT operations & systems engineer building resilient systems for people, brands, and what comes next — Bella Vista, Arkansas.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/" },
      { property: "og:site_name", content: "Tyler Granlund" },
      { property: "og:locale", content: "en_US" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      {
        property: "og:image:alt",
        content: "Tyler Granlund — IT Operations & Systems Engineer, on a misty spruce grove.",
      },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:image:alt",
        content: "Tyler Granlund — IT Operations & Systems Engineer, on a misty spruce grove.",
      },
    ],
    links: [
      { rel: "canonical", href: "https://tylergranlund.com/" },
      { rel: "me", href: "https://www.linkedin.com/in/tylergranlund" },
      { rel: "me", href: "https://github.com/t-granlund" },
    ],
  }),
  component: Landing,
});

// Single linked @graph: WebSite -> ProfilePage -> Person. Strings MUST match the
// on-page Career positioning.
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": "https://tylergranlund.com/#website",
      url: "https://tylergranlund.com/",
      name: "Tyler Granlund",
      inLanguage: "en-US",
      publisher: { "@id": "https://tylergranlund.com/#person" },
    },
    {
      "@type": "ProfilePage",
      "@id": "https://tylergranlund.com/#profilepage",
      url: "https://tylergranlund.com/",
      name: "Tyler Granlund — IT Operations & Systems Engineer",
      isPartOf: { "@id": "https://tylergranlund.com/#website" },
      about: { "@id": "https://tylergranlund.com/#person" },
      mainEntity: { "@id": "https://tylergranlund.com/#person" },
    },
    {
      "@type": "Person",
      "@id": "https://tylergranlund.com/#person",
      name: "Tyler Granlund",
      jobTitle: "IT Operations & Systems Engineer",
      url: "https://tylergranlund.com/",
      email: "hello@tylergranlund.com",
      image: "https://tylergranlund.com/og-cover.jpg",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Bella Vista",
        addressRegion: "AR",
        addressCountry: "US",
      },
      sameAs: ["https://www.linkedin.com/in/tylergranlund", "https://github.com/t-granlund"],
      knowsAbout: [
        "IT Operations",
        "Systems Engineering",
        "Multi-Agent Systems",
        "CI/CD",
        "Cloud Infrastructure",
        "Microsoft 365",
        "Azure",
        "Power BI",
        "Microsoft Fabric",
        "Information Security",
        "Zero Trust Security",
        "Digital Transformation",
      ],
      worksFor: {
        "@type": "Organization",
        name: "Multi-Brand Franchise Group",
      },
    },
  ],
};

const destinations = [
  {
    to: "/about",
    index: "01",
    title: "About",
    blurb: "Roots, philosophy, and the stack I build with.",
  },
  {
    to: "/career",
    index: "02",
    title: "Career",
    blurb: "The path through the grove — roles, scope, and the outcomes that mark each turn.",
  },
  {
    to: "/work",
    index: "03",
    title: "Work",
    blurb: "Six flagship case studies — problem, architecture, oversight, outcome.",
  },
  {
    to: "/ventures",
    index: "04",
    title: "Ventures",
    blurb: "Beyond the systems — Spruce Grove Media films and field data capture.",
  },
  {
    to: "/resume",
    index: "05",
    title: "Resume",
    blurb: "The growth rings — a downloadable record, with tailored variants.",
  },
  {
    to: "/contact",
    index: "06",
    title: "Contact",
    blurb: "Step into the clearing. Send a note — I read everything.",
  },
] as const;

function Landing() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Nav />

      <main id="main-content" className="relative" tabIndex={-1}>
        {/* Hero */}
        <section className="relative flex min-h-[88vh] items-center overflow-hidden">
          <div className="absolute inset-0">
            <Picture
              name="hero-spruce"
              widths={[768, 1280, 1920]}
              sizes="100vw"
              width={1920}
              height={1080}
              alt=""
              decorative
              eager
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </div>
          {/* atmosphere — calmer than the old one-pager hero */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,oklch(0.16_0.012_150/0.6)_0%,oklch(0.16_0.012_150/0.72)_55%,oklch(0.16_0.012_150)_100%)]" />
          <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(oklch(0.85_0.02_90/1)_1px,transparent_1px),linear-gradient(90deg,oklch(0.85_0.02_90/1)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
          <div className="absolute inset-0 pointer-events-none [box-shadow:inset_0_0_220px_60px_oklch(0.10_0.012_150/0.8)]" />

          <div className="relative mx-auto w-full max-w-7xl px-6 pt-28 pb-16">
            <div className="flex items-end justify-between gap-12">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2.5 rounded-full border border-cedar bg-[oklch(0.22_0.014_155/0.5)] backdrop-blur px-4 py-1.5 mb-8">
                  <TreeMark className="h-3.5 w-3.5 text-cedar" />
                  <span className="font-mono text-[11px] tracking-[0.18em] text-stone">
                    gran&middot;lund&nbsp;&nbsp;&middot;&nbsp;&nbsp;
                    <em className="not-italic text-cedar">sv.</em>
                    &nbsp;&nbsp;&middot;&nbsp;&nbsp;spruce grove
                  </span>
                </div>

                <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl leading-[1.02] font-light text-balance">
                  A grove of{" "}
                  <em className="not-italic font-normal text-cedar">resilient systems</em> — grown
                  for people, brands, and{" "}
                  <em className="italic font-light text-mist">what comes next.</em>
                </h1>

                <p className="mt-8 max-w-2xl text-lg sm:text-xl leading-relaxed text-stone/90">
                  I&apos;m <span className="text-foreground">Tyler Granlund</span> — an IT
                  operations &amp; systems engineer in Bella Vista, Arkansas. I run supervised
                  multi-agent systems that ship production software across{" "}
                  <span className="text-foreground">200+ locations</span>— with the security, evals,
                  and CI/CD to prove it.
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    to="/work"
                    className="group inline-flex items-center gap-3 rounded-full bg-[image:var(--gradient-cedar)] px-8 py-4 text-primary-foreground font-medium shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300"
                  >
                    Explore the work
                    <span aria-hidden className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </Link>
                  <Link
                    to="/resume"
                    className="inline-flex items-center gap-3 rounded-full border border-[oklch(0.55_0.06_70/0.4)] bg-[oklch(0.22_0.014_155/0.5)] backdrop-blur-md px-8 py-4 text-foreground hover:border-cedar hover:bg-[oklch(0.30_0.03_158/0.5)] transition-all duration-300"
                  >
                    View resume
                  </Link>
                </div>
              </div>

              {/* meta column — balances the empty right half on large screens */}
              <div className="hidden lg:flex flex-col items-end gap-5 pb-2 shrink-0">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-cedar/60 glow-soft" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-cedar" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone/75">
                    Open to opportunities
                  </span>
                </div>
                <div className="h-px w-16 self-end bg-gradient-to-l from-cedar/50 to-transparent" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone/55">
                  Bella Vista · Arkansas
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-stone/40">
                  Est. MMXXVI
                </span>
              </div>
            </div>
          </div>
          {/* scroll cue */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden flex-col items-center gap-2 sm:flex">
            <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-stone/45">
              Scroll
            </span>
            <span className="h-10 w-px bg-gradient-to-b from-cedar/60 to-transparent glow-soft" />
          </div>
        </section>

        {/* Proof band — verified, $-free numbers (bd dev-45b.1) */}

        {/* Hub — the five destinations */}
        <section className="relative py-24 lg:py-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
              <div className="max-w-xl">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cedar/80">
                  The grove · choose a trail
                </div>
                <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-light text-balance">
                  Six trails through the grove.
                </h2>
                <p className="mt-5 text-stone/85 leading-relaxed">
                  The numbers above are the short version. Each trail below is the long one — the
                  roles, the systems, and how they were built, supervised, and proven in production.
                </p>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-stone/50">
                Build calmly. Build for people. Build to last.
              </p>
            </div>

            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {destinations.map((d) => (
                <li key={d.to}>
                  <Link
                    to={d.to}
                    className="group flex h-full flex-col justify-between rounded-3xl border border-border bg-card/70 backdrop-blur p-8 lift hover:border-cedar transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cedar">
                        {d.index}
                      </span>
                      <TreeMark className="h-5 w-5 text-cedar/60 transition-transform duration-700 group-hover:rotate-[4deg]" />
                    </div>
                    <div className="mt-10">
                      <h3 className="font-display text-2xl text-foreground group-hover:text-cedar transition-colors">
                        {d.title}
                      </h3>
                      <p className="mt-3 text-stone/85 leading-relaxed">{d.blurb}</p>
                    </div>
                    <span
                      aria-hidden
                      className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground group-hover:text-cedar transition-colors"
                    >
                      Enter
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                </li>
              ))}

              {/* closing CTA — full-width band under the six trails, an endpoint for the hub */}
              <li className="sm:col-span-2 lg:col-span-3">
                <Link
                  to="/contact"
                  className="group flex h-full flex-col justify-between rounded-3xl border border-cedar/60 bg-[oklch(0.30_0.05_60/0.35)] p-8 lift hover:border-cedar"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-cedar">
                      Let&apos;s talk
                    </span>
                    <TreeMark className="h-5 w-5 text-cedar transition-transform duration-700 group-hover:rotate-[4deg]" />
                  </div>
                  <div className="mt-10">
                    <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-cedar">
                      Rather just talk?
                    </h3>
                    <p className="mt-3 leading-relaxed text-stone/85">
                      Skip the wander — tell me what you&apos;re building and where I fit.
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="mt-8 inline-flex items-center gap-2 text-sm text-cedar"
                  >
                    Start a conversation
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
