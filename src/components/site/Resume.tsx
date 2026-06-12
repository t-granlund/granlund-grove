import { SectionLabel } from "./SectionLabel";

// Default download = master. Tailored variants for FDE / AI-PM screeners.
// PDFs live in public/resume/ — keep filenames in sync with these paths and
// with docs/NUMBER_VERIFICATION.md career rows. (judge G3.4 stays red until
// the three PDFs are present in public/resume/.)
const MASTER = "/resume/Tyler-Granlund-Master-Resume.pdf";
const variants = [
  { label: "AI-PM", href: "/resume/Tyler-Granlund-Resume-AI-PM.pdf" },
  { label: "FDE", href: "/resume/Tyler-Granlund-Resume-FDE.pdf" },
];

export function Resume() {
  return (
    <section id="resume" className="relative py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-card to-[oklch(0.22_0.03_158)] p-10 sm:p-16 relative overflow-hidden">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cedar/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-[oklch(0.45_0.06_155/0.15)] blur-3xl" />

          <div className="relative">
            <SectionLabel index="01" chapter="The Record">
              Resume
            </SectionLabel>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance max-w-2xl">
              The <em className="not-italic text-cedar">growth rings.</em>
            </h2>
            <p className="mt-6 text-lg text-stone/90 max-w-xl leading-relaxed">
              Every ring tells a year. Download the resume, or explore the living version of my work
              throughout this site.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <a
                href={MASTER}
                download
                className="inline-flex items-center gap-3 rounded-full bg-[image:var(--gradient-cedar)] px-8 py-4 text-primary-foreground font-medium shadow-[var(--shadow-lift)] hover:-translate-y-0.5 hover:brightness-110 transition-all duration-300"
              >
                Download resume
                <span aria-hidden="true">&#8595;</span>
              </a>

              <div className="inline-flex items-center gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone/60">
                  Tailored
                </span>
                {variants.map((v) => (
                  <a
                    key={v.label}
                    href={v.href}
                    download
                    className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-cedar bg-[oklch(0.22_0.014_155/0.5)] backdrop-blur px-5 py-2.5 text-sm text-foreground hover:bg-[oklch(0.30_0.03_158/0.5)] transition-all duration-300"
                  >
                    {v.label}
                    <span aria-hidden="true">&#8595;</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-4">
              <a
                href="https://www.linkedin.com/in/tylergranlund"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 rounded-full border border-border bg-[oklch(0.22_0.014_155/0.5)] backdrop-blur px-6 py-3 text-foreground hover:border-cedar hover:bg-[oklch(0.30_0.03_158/0.5)] transition-all duration-300"
              >
                View on LinkedIn
                <span aria-hidden="true">&#8599;</span>
              </a>
              <a
                href="https://github.com/t-granlund"
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-3 rounded-full border border-border bg-[oklch(0.22_0.014_155/0.5)] backdrop-blur px-6 py-3 text-foreground hover:border-cedar hover:bg-[oklch(0.30_0.03_158/0.5)] transition-all duration-300"
              >
                View on GitHub
                <span aria-hidden="true">&#8599;</span>
              </a>
            </div>

            <p className="mt-6 text-xs text-stone/55">
              Master is the full record; FDE and AI-PM are tailored for those screens.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
