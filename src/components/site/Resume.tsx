import { careerTimeline } from "@/lib/career-data";

// Single-page resume. One honest page — who Tyler is, what he does, what he
// shipped. Facts come from career-data.ts (the site's single source of truth,
// mirrored with the PDFs in public/resume/). Copy rule, per Tyler's own
// instruction: pure, honest, and true. Titles are exactly the titles held.
// The multi-agent systems are described as what they are — orchestrated
// systems he designed, directed, and shipped — not personal code fluency.

const DOWNLOADS = [
  { label: "Master resume", href: "/resume/Tyler-Granlund-Master-Resume.pdf" },
  { label: "AI-PM variant", href: "/resume/Tyler-Granlund-Resume-AI-PM.pdf" },
  { label: "FDE variant", href: "/resume/Tyler-Granlund-Resume-FDE.pdf" },
];

const CAPABILITIES = [
  "Turning messy, cross-functional operations into systems that ship",
  "Identity, security & lifecycle governance across multi-tenant orgs",
  "Franchise & multi-location technology rollouts — global scale",
  "Supervised multi-agent orchestration with human approval gates",
  "Teaching non-technical operators to own their own tools",
];

const CHAPTERS: Record<string, { bullets: string[] }> = {
  Apple: {
    bullets: [
      "Built and taught the promoted-staff technical course for the South Chicago market",
      "Trained and mentored Mac and Mobile technicians market-wide",
    ],
  },
  "School of Rock": {
    bullets: [
      "~145 → 300+ locations, 8 → 14 countries — every market opened on time",
      "Adapted Zendesk into the global help desk and lead-management pipeline for the franchise network",
      "Merchant-processing integrations (NMI + Pike 13), Okta SSO, privacy posture (COPPA/FERPA/GDPR)",
      "COVID pivot: in-person lessons moved fully remote, with self-serve make-up booking",
    ],
  },
  "Outdoor Cap": {
    bullets: [
      "Project lead for Compass, the B2B wholesale ordering platform — launched exactly as spec'd",
      "Global supply-chain coordination across 4 countries, 4 U.S. distribution centers",
      "Adobe Commerce's first customer advocate — agile SDLC talk in Adobe's Experience League",
    ],
  },
  "North 40 / Smith & Rogue": {
    bullets: [
      "Brought e-commerce in-house: 14 stores migrated to Adobe Commerce Cloud",
      "Removed agency dependency — the team owns its architecture and decisions",
    ],
  },
  "Head to Toe Brands": {
    bullets: [
      "Identity-governance ecosystem across 5 brands, 5 Microsoft tenants — days → minutes onboarding",
      "Support center built from zero; ~40% faster resolutions",
      "Designed and directed production multi-agent systems (Control Tower, Knowledge Fabric, Estate Trace) with eval gates — being open-sourced",
    ],
  },
};

export function Resume() {
  // careerTimeline is oldest → newest; a resume reads newest first.
  const roles = [...careerTimeline].reverse();

  return (
    <section id="resume" className="relative py-16">
      <div className="mx-auto max-w-4xl px-6">
        {/* ——— Header ——— */}
        <header className="border-b border-border pb-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-3">
            Resume · One page, no inflation
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-light text-balance">
            Tyler Granlund
          </h1>
          <p className="mt-4 text-lg text-stone/90 leading-relaxed max-w-2xl">
            Product and operations builder for multi-location businesses. I find the obstacles that
            make people's work harder than it should be, and I remove them — with systems that are
            honest about what they do and who they serve.
          </p>
          <p className="mt-4 font-mono text-xs text-stone/60">
            Bella Vista, Arkansas ·{" "}
            <a href="mailto:hello@tylergranlund.com" className="text-cedar hover:underline">
              hello@tylergranlund.com
            </a>{" "}
            · Remote or on-site
          </p>
        </header>

        {/* ——— Honesty note — the Resume-Rework commitment, stated plainly ——— */}
        <aside className="mt-8 rounded-xl border border-cedar/30 bg-[oklch(0.22_0.03_158/0.4)] p-5">
          <p className="text-sm text-stone/85 leading-relaxed">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar block mb-2">
              A note on honesty
            </span>
            Titles below are the titles held — nothing borrowed, nothing inflated. The multi-agent
            systems in my recent work are orchestrated systems: I designed the architecture,
            directed the agents, and gated every release. That distinction matters to me, and it
            should matter to anyone reading a resume in 2026. The architecture and guardrails are
            being open-sourced so the proof stands on its own.
          </p>
        </aside>

        {/* ——— Capabilities ——— */}
        <div className="mt-10">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-4">
            What I do best
          </h2>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-2">
            {CAPABILITIES.map((c) => (
              <li key={c} className="text-sm text-stone/85 flex gap-2">
                <span className="text-cedar shrink-0" aria-hidden="true">
                  ·
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* ——— Experience ——— */}
        <div className="mt-12">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-2">
            Where I've done it
          </h2>
          <div className="divide-y divide-border">
            {roles.map((r) => (
              <article key={r.company} className="py-6 first:pt-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="font-display text-xl text-foreground">
                    {r.company}{" "}
                    <span className="text-stone/70 text-base font-light">— {r.role}</span>
                  </h3>
                  <span className="font-mono text-xs text-stone/60">{r.dates}</span>
                </div>
                <ul className="mt-3 space-y-1.5">
                  {(CHAPTERS[r.company]?.bullets ?? []).map((b) => (
                    <li key={b} className="text-sm text-stone/80 flex gap-2 leading-relaxed">
                      <span className="text-cedar shrink-0" aria-hidden="true">
                        ·
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>

        {/* ——— Now ——— */}
        <div className="mt-10 rounded-xl border border-border bg-card p-6">
          <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-3">
            What I'm doing now
          </h2>
          <p className="text-sm text-stone/85 leading-relaxed">
            Building Spruce Grove — a community-rooted, agent-orchestrated system that gives small
            businesses the technology leverage usually reserved for enterprises. Live work includes
            a shipped lead-capture platform for a drone-services operator (fully documented, handed
            off, and self-iterable by the owner), and a website build for a local barbershop that
            had none. Progress is public, daily, and dated.
          </p>
        </div>

        {/* ——— Downloads ——— */}
        <div className="mt-10 flex flex-wrap items-center gap-3">
          {DOWNLOADS.map((d, i) => (
            <a
              key={d.label}
              href={d.href}
              download
              className={
                i === 0
                  ? "inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-cedar)] px-6 py-3 text-primary-foreground text-sm font-medium shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300"
                  : "inline-flex items-center gap-2 rounded-full border border-border bg-[oklch(0.22_0.014_155/0.5)] px-5 py-2.5 text-sm text-foreground hover:border-cedar transition-all duration-300"
              }
            >
              {d.label}
              <span aria-hidden="true">&#8595;</span>
            </a>
          ))}
          <a
            href="https://www.linkedin.com/in/tylergranlund"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:border-cedar transition-all duration-300"
          >
            LinkedIn <span aria-hidden="true">&#8599;</span>
          </a>
          <a
            href="https://github.com/t-granlund"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm text-foreground hover:border-cedar transition-all duration-300"
          >
            GitHub <span aria-hidden="true">&#8599;</span>
          </a>
        </div>

        <p className="mt-6 text-xs text-stone/55">
          Details, sources, and the long-form trail live at{" "}
          <a href="/career" className="text-cedar hover:underline">
            /career
          </a>
          . The PDFs mirror this page — kept in sync on purpose.
        </p>
      </div>
    </section>
  );
}
