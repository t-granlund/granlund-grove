import { SectionLabel } from "./SectionLabel";

// Mirrors Tyler-Granlund-Master-Resume exactly (consistency = ATS/recruiter
// trust signal). Update both together. Metric claims here are pre-verified
// employment facts; gated portfolio metrics live behind docs/NUMBER_VERIFICATION.md.
const roles = [
  {
    company: "Head to Toe Brands (Riverside PE)",
    role: "IT Operations & Systems Engineer",
    dates: "Jan 2026 — Present",
    summary:
      "Embedded with non-technical operators to run supervised multi-agent systems that ship production software across a five-brand, 200+ location franchise portfolio — discovery to scoping to production rollout, with the security, evals, and CI/CD to back it. Using Code Puppy to build Control Tower, Knowledge Fabric, and Estate Trace.",
    outcomes: [
      "Multi-agent systems shipped to production",
      "Human-in-the-loop guardrails & eval harnesses",
      "Zero-secret, OIDC-based automation",
      "Built with Code Puppy — President's Innovation Award-winning agent",
    ],
  },
  {
    company: "Head to Toe Brands (Riverside PE)",
    role: "IT Director",
    dates: "Oct 2024 — Jan 2026",
    summary:
      "Led enterprise IT for a Riverside private equity-backed multi-brand franchise group. Portfolio: The Lash Lounge (~130 units), Bishops Cuts and Color (~40 units), Frenchies Modern Nail Care (24 units), and Delta Crown Hair Extensions — 200+ locations total. Built the identity governance ecosystem: a master database federating across five brands and Microsoft tenants with role-based access tied to location, brand, and job function. Onboarding reduced from days to minutes.",
    outcomes: [
      "200+ locations across 5 brands (Riverside PE portfolio)",
      "Identity governance ecosystem — master database across all tenants",
      "Built support center — cut resolution time 40%",
      "Zero-trust security & access governance rollout",
      "Onboarding: days → minutes; offboarding: immediate & auditable",
    ],
  },
  {
    company: "Outdoor Cap Company",
    role: "IT Product Manager I to II — Digital Experience",
    dates: "2022 — 2023",
    summary:
      "Built the Compass B2B wholesale online ordering platform — the company's biggest technical undertaking. Coordinated with global supply chain: factories in Bangladesh, China, Vietnam, and Sri Lanka; warehouses in Bentonville AR, Rancho Cucamonga CA, Dallas TX, and Zanesville OH. Integrated Magento/Adobe Commerce with ERP, 3D product customization, and account dashboards. First-ever Adobe Commerce customer advocate presenting to enterprise customers.",
    outcomes: [
      "Built Compass B2B ordering platform",
      "Coordinated global supply chain across 4 countries",
      "Reduced B2B order friction with 3D tooling",
      "Shipped self-service account dashboards",
      "First Adobe Commerce customer advocate",
    ],
  },
  {
    company: "School of Rock",
    role: "IT Manager to Senior IT Manager",
    dates: "Apr 2015 — Jan 2022",
    summary:
      "Joined at ~145 locations in 8 countries. Left at ~300+ locations across 14 countries. I was the primary IT support pillar for every master franchise rollout — analyzing requirements, adapting systems, building merchant processing integrations through NMI gateways connected to Pike 13, and training owners and managers. Built Okta identity federation, Google Workspace governance, and custom local solutions for scheduling, invoicing, and payment identity across every new market.",
    outcomes: [
      "~145 → ~300+ locations, 8 → 14 countries",
      "Global SSO rollout — 300+ schools via Okta",
      "Merchant processing integrations (NMI + Pike 13)",
      "Privacy & compliance program (COPPA/FERPA/GDPR)",
      "Franchise support model & enablement at scale",
    ],
  },
];

export function Career() {
  return (
    <section id="career" className="relative py-28 lg:py-36 bg-spruce-deep/40">
      <div className="topo-divider absolute top-0 inset-x-0" />
      <div className="topo-divider absolute bottom-0 inset-x-0" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <SectionLabel index="02" chapter="The Record">
            Career
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
            The roles, <em className="not-italic text-cedar">in brief.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-2xl">
            The journey above is the story forward. This is the résumé view — most recent first, the
            scope and the outcomes that marked each turn.
          </p>
          <p className="mt-4 text-base text-stone/70 max-w-2xl">
            The thread never changed: understand what the customer needs, build the systems to
            support it, and remove the obstacles that make people&apos;s day-to-day harder.
          </p>
        </div>

        <ol className="mt-14 space-y-4">
          {roles.map((r) => (
            <li key={`${r.company}-${r.role}`}>
              <article className="group grid gap-4 rounded-2xl border border-border bg-card/70 p-6 lg:grid-cols-[210px_1fr] lg:gap-10 lg:p-8 lift">
                {/* left rail — when + where */}
                <div className="lg:border-r lg:border-border/60 lg:pr-6">
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-cedar">
                    {r.dates}
                  </div>
                  <div className="mt-2 font-display text-lg text-foreground leading-snug">
                    {r.company}
                  </div>
                </div>

                {/* right — role, summary, outcomes */}
                <div>
                  <h3 className="font-display text-xl lg:text-2xl text-foreground group-hover:text-cedar transition-colors">
                    {r.role}
                  </h3>
                  <p className="mt-3 text-sm lg:text-[15px] text-stone/85 leading-relaxed">
                    {r.summary}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {r.outcomes.map((o) => (
                      <li
                        key={o}
                        className="text-xs px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.4)] text-stone/90"
                      >
                        {o}
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
