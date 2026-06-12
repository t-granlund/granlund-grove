import { SectionLabel } from "./SectionLabel";
import { TreeMark } from "./TreeMark";

// Mirrors Tyler-Granlund-Master-Resume exactly (consistency = ATS/recruiter
// trust signal). Update both together. Metric claims here are pre-verified
// employment facts; gated portfolio metrics live behind docs/NUMBER_VERIFICATION.md.
const roles = [
  {
    company: "Multi-Brand Franchise Group",
    role: "IT Operations & Systems Engineer",
    dates: "Jan 2026 — Present",
    summary:
      "Embedded with non-technical operators to run supervised multi-agent systems that ship production software across a five-brand, 200+ location franchise portfolio — discovery to scoping to production rollout, with the security, evals, and CI/CD to back it.",
    outcomes: [
      "Multi-agent systems shipped to production",
      "Human-in-the-loop guardrails & eval harnesses",
      "Zero-secret, OIDC-based automation",
    ],
  },
  {
    company: "Multi-Brand Franchise Group",
    role: "IT Director",
    dates: "Oct 2024 — Jan 2026",
    summary:
      "Led enterprise IT for a multi-brand franchise organization — Microsoft 365, Azure, Power BI/Fabric, support operations, security and access governance, vendor strategy, and cross-functional transformation across 200+ locations.",
    outcomes: [
      "Modernized tech ops across 200+ locations",
      "Built support center — cut resolution time 40%",
      "Scaled BI and cloud infrastructure org-wide",
      "Zero-trust security & access governance rollout",
    ],
  },
  {
    company: "Outdoor Cap Company",
    role: "IT Product Manager I to II — Digital Experience",
    dates: "2022 — 2023",
    summary:
      "Owned the digital experience portfolio: Adobe Commerce/Magento, B2B commerce, 3D product customization, account dashboards, and custom order forms — agile delivery from backlog to launch, partnering across sales, marketing, and operations.",
    outcomes: [
      "Reduced B2B order friction ~40% with 3D tooling",
      "Shipped self-service account dashboards",
      "Stood up agile product practice & SDLC discipline",
    ],
  },
  {
    company: "School of Rock",
    role: "IT Manager to Senior IT Manager",
    dates: "2015 — 2021",
    summary:
      "Global IT leadership for a franchise music education brand: Google Workspace and Okta integrations, data privacy and compliance, training and enablement, and franchise systems across 300+ schools.",
    outcomes: [
      "Global SSO rollout — 300+ schools via Okta",
      "Privacy & compliance program (COPPA/FERPA)",
      "Franchise support model & enablement at scale",
    ],
  },
];

export function Career() {
  return (
    <section id="career" className="relative py-32 lg:py-40 bg-spruce-deep/40">
      <div className="topo-divider absolute top-0 inset-x-0" />
      <div className="topo-divider absolute bottom-0 inset-x-0" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <SectionLabel index="01" chapter="The Path">
            Career
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
            The path through <em className="not-italic text-cedar">the grove.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-2xl">
            Every role added a layer — like rings of a spruce. Here&apos;s the trail so far, with
            the outcomes that mark each turn.
          </p>
        </div>

        <ol className="mt-20 relative">
          {/* central trail line */}
          <div
            aria-hidden
            className="absolute left-4 lg:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-cedar/60 via-cedar/20 to-transparent"
          />

          {roles.map((r, i) => {
            const left = i % 2 === 0;
            return (
              <li
                key={`${r.company}-${r.role}`}
                className={`relative grid lg:grid-cols-2 gap-8 mb-12 lg:mb-20 ${left ? "" : ""}`}
              >
                {/* node */}
                <div className="absolute left-4 lg:left-1/2 top-7 -translate-x-1/2 z-10">
                  <div className="h-3 w-3 rounded-full bg-cedar shadow-[0_0_0_4px_oklch(0.18_0.012_150),0_0_0_5px_oklch(0.68_0.12_55/0.4)]" />
                </div>

                <div
                  className={`pl-12 lg:pl-0 ${
                    left ? "lg:pr-16 lg:text-right" : "lg:col-start-2 lg:pl-16"
                  }`}
                >
                  <article className="group relative rounded-2xl border border-border bg-card p-7 lift">
                    <div className={`flex items-start gap-3 ${left ? "lg:flex-row-reverse" : ""}`}>
                      <TreeMark className="h-5 w-5 text-cedar shrink-0 mt-1" />
                      <div className={left ? "lg:text-right" : ""}>
                        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar">
                          {r.dates || "Previous"}
                        </div>
                        <h3 className="mt-1 font-display text-xl lg:text-2xl text-foreground">
                          {r.role}
                        </h3>
                        <div className="mt-1 text-sm text-muted-foreground">{r.company}</div>
                      </div>
                    </div>

                    <p className="mt-5 text-stone/90 leading-relaxed">{r.summary}</p>

                    <ul className={`mt-5 flex flex-wrap gap-2 ${left ? "lg:justify-end" : ""}`}>
                      {r.outcomes.map((o) => (
                        <li
                          key={o}
                          className="text-xs px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.4)] text-stone/90"
                        >
                          {o}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
