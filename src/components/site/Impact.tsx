import { SectionLabel } from "./SectionLabel";

const cards = [
  {
    title: "Digital Transformation",
    body: "Reimagining legacy operations into modern, integrated, agile-driven ecosystems that scale with the business — across 200+ franchise locations.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <circle cx="16" cy="16" r="13" />
        <path d="M16 3v26M3 16h26M6 6l20 20M26 6L6 26" opacity="0.5" />
      </svg>
    ),
  },
  {
    title: "Franchise Technology Operations",
    body: "Building global IT systems that empower franchise networks — consistent, supportable, and built to scale across hundreds of locations.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <circle cx="16" cy="16" r="3" />
        <circle cx="6" cy="6" r="2" />
        <circle cx="26" cy="6" r="2" />
        <circle cx="6" cy="26" r="2" />
        <circle cx="26" cy="26" r="2" />
        <path d="M16 16l-10-10M16 16l10-10M16 16l-10 10M16 16l10 10" />
      </svg>
    ),
  },
  {
    title: "E-Commerce & Product Strategy",
    body: "Adobe Commerce, Magento, B2B platforms, 3D customization, and frictionless customer journeys — shipped across 500+ B2B accounts.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M4 8h24l-2 16H6L4 8z" />
        <path d="M11 8a5 5 0 0110 0" />
      </svg>
    ),
  },
  {
    title: "BI, Data & Cloud Infrastructure",
    body: "Microsoft 365, Azure, Power BI, and Fabric environments designed for clarity, governance, and decision velocity — scaled org-wide.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M4 24h6v-8H4zM13 24h6V10h-6zM22 24h6V4h-6z" />
      </svg>
    ),
  },
  {
    title: "Support Center & Workflow Design",
    body: "Modernized support operations using Freshdesk, Monday.com, and SharePoint — 40% faster resolutions, fewer escalations.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M6 8h20v14H18l-5 5v-5H6z" />
        <path d="M11 13h10M11 17h7" />
      </svg>
    ),
  },
  {
    title: "Security, Access & Governance",
    body: "Identity, access, data privacy, and compliance — Okta, Azure AD, and policy frameworks that hold up under audit across franchise networks.",
    icon: (
      <svg
        viewBox="0 0 32 32"
        className="h-7 w-7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      >
        <path d="M16 4l11 4v8c0 7-5 11-11 12-6-1-11-5-11-12V8l11-4z" />
        <path d="M11 16l4 4 7-7" />
      </svg>
    ),
  },
];

export function Impact() {
  return (
    <section id="impact" className="relative py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <SectionLabel index="02" chapter="The Clearing">
            Impact
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
            Where I create <em className="not-italic text-cedar">impact.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-2xl">
            Six places where strategy, systems, and people meet — and where I do my best work.
          </p>
        </div>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c, i) => (
            <article
              key={c.title}
              className="group relative rounded-2xl border border-border bg-card p-8 lift overflow-hidden"
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.18),transparent_60%)]" />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <span className="text-cedar" aria-hidden="true">
                    {c.icon}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
                    0{i + 1}
                  </span>
                </div>
                <h3 className="mt-8 font-display text-xl text-foreground">{c.title}</h3>
                <p className="mt-3 text-sm text-stone/90 leading-relaxed">{c.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
