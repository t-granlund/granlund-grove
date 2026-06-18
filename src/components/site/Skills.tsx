import { SectionLabel } from "./SectionLabel";

// Grouped the way systems are built (mirrors the master resume's SKILLS
// section). Leads with orchestration, ends with the evals/delivery discipline.
const groups = [
  {
    label: "AI & Agent Systems",
    items: [
      "Multi-agent orchestration",
      "Tool / function calling",
      "RAG + knowledge graphs",
      "Evaluation harnesses & judge gates",
      "Human-in-the-loop approvals",
      "Local-first LLMs (Ollama, Whisper)",
      "Prompt engineering",
    ],
  },
  {
    label: "Languages & Frameworks",
    items: [
      "Python (FastAPI, Pydantic)",
      "TypeScript / Node.js",
      "React",
      "SvelteKit",
      "HTMX",
      "SQL / DAX",
      "PowerShell / Bash",
    ],
  },
  {
    label: "Cloud & Identity",
    items: [
      "Azure (App Service, Functions, Key Vault)",
      "AWS (Lambda, ECS Fargate, Athena)",
      "Entra ID multi-tenant",
      "Microsoft Graph",
      "OIDC workload identity (zero secrets)",
      "Bicep / Terraform",
    ],
  },
  {
    label: "Data & BI",
    items: [
      "Power BI / Fabric (Direct Lake)",
      "Snowflake",
      "PostgreSQL",
      "SQL Server",
      "ETL pipeline design",
      "Row-level security",
    ],
  },
  {
    label: "Quality & Delivery",
    items: [
      "GitHub Actions CI/CD",
      "Playwright E2E",
      "pytest / Vitest",
      "WCAG 2.2 AA (axe-core)",
      "STRIDE threat modeling",
      "FinOps / cost governance",
    ],
  },
  {
    label: "Platform Integrations",
    items: [
      "Freshdesk",
      "Monday.com",
      "HubSpot",
      "FranConnect",
      "Mindbody / Zenoti",
      "BigCommerce / Shopify",
      "Ramp",
      "GitHub Enterprise",
    ],
  },
];

export function Skills() {
  return (
    <section id="skills" className="relative py-32 lg:py-40 bg-spruce-deep/40">
      <div className="topo-divider absolute top-0 inset-x-0" />
      <div className="topo-divider absolute bottom-0 inset-x-0" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <SectionLabel index="03" chapter="The Tools">
            Capabilities
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
            What I bring to <em className="not-italic text-cedar">the grove.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-2xl">
            Not a tool dump. Grouped the way the systems are actually built. Every skill here has
            shipped real work, from multi-tenant platforms to open-source releases.
          </p>
        </div>

        <div className="mt-16 grid lg:grid-cols-3 gap-6">
          {groups.map((g) => (
            <div
              key={g.label}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 lift"
            >
              <div
                aria-hidden
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.12),transparent_60%)]"
              />
              <div className="relative">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl text-cedar">{g.label}</h3>
                  <span className="font-mono text-xs text-muted-foreground">
                    {String(g.items.length).padStart(2, "0")}
                  </span>
                </div>
                <div className="mt-6 h-px bg-gradient-to-r from-cedar/40 to-transparent" />
                <ul className="mt-6 flex flex-wrap gap-2">
                  {g.items.map((i) => (
                    <li
                      key={i}
                      className="text-sm px-3 py-1.5 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.4)] text-stone/90 hover:border-cedar/50 hover:text-foreground transition-colors"
                    >
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
