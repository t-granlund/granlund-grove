// TenantFleet Ecosystem — comprehensive landing page
// Seven open-source repos for multi-tenant Microsoft Entra ID governance

import { SectionLabel } from "./SectionLabel";
import { EcosystemDiagram } from "./diagrams/EcosystemDiagram";
import { RepoCard } from "./RepoCard";
import { WorkflowDiagram } from "./diagrams/WorkflowDiagram";

export type Repo = {
  name: string;
  tagline: string;
  description: string;
  pillar: "mind" | "body" | "spirit";
  metrics: { value: string; label: string }[];
  stack: string[];
  github: string;
  pages: string;
  features: string[];
};

export const repos: Repo[] = [
  {
    name: "TenantFleet",
    tagline: "Mother ship — the complete governance framework",
    description:
      "The root repository. User lifecycle automation, OIDC zero-secret auth, Entra Graph client, Terraform tenant modules, and pre-commit security hooks. Everything needed to govern a multi-brand Microsoft estate.",
    pillar: "mind",
    metrics: [
      { value: "7", label: "repos in ecosystem" },
      { value: "104", label: "source files" },
      { value: "0", label: "secrets required" },
    ],
    stack: ["Python", "PowerShell", "Terraform", "Graph API", "OIDC"],
    github: "https://github.com/t-granlund/tenantfleet",
    pages: "https://t-granlund.github.io/tenantfleet/",
    features: [
      "User lifecycle engine (onboard/offboard/reprovision)",
      "Zero-secret OIDC authentication package",
      "Async Entra Graph API client",
      "Terraform tenant provisioning module",
      "Pre-commit security hooks (UUID/email/tenant guards)",
      "GitHub Actions CI pipeline",
    ],
  },
  {
    name: "HubForge",
    tagline: "Deploy dashboards, not infrastructure",
    description:
      "Azure Static Web Apps + Entra ID + SharePoint deployment templates. Seven reference architecture docs, six React design system components, and a step-by-step scaffolding playbook. Production-grade dashboards in ten minutes.",
    pillar: "mind",
    metrics: [
      { value: "7", label: "reference docs" },
      { value: "6", label: "React components" },
      { value: "10m", label: "first deploy" },
    ],
    stack: ["React", "TypeScript", "Azure SWA", "Entra ID", "SharePoint"],
    github: "https://github.com/t-granlund/hubforge",
    pages: "https://t-granlund.github.io/hubforge/",
    features: [
      "Complete architecture playbook (7 docs)",
      "Zero-config Entra ID authentication",
      "Persona-based RBAC middleware",
      "Design system components (StatCard, Alert, Tabs, etc.)",
      "SharePoint Graph API integration",
      "Testing strategy (unit, integration, E2E)",
    ],
  },
  {
    name: "EntraGroups",
    tagline: "Groups that govern. Access that scales.",
    description:
      "Automated group lifecycle engine for Microsoft Entra ID. Smart group creation, persona-based RBAC, dynamic membership rules, and audit logging across multiple tenants.",
    pillar: "body",
    metrics: [
      { value: "4", label: "personas modeled" },
      { value: "0", label: "secrets in config" },
      { value: "∞", label: "group scale" },
    ],
    stack: ["TypeScript", "Azure Functions", "Cosmos DB", "Graph API"],
    github: "https://github.com/t-granlund/entragroups",
    pages: "https://t-granlund.github.io/entragroups/",
    features: [
      "Smart group creation with templates",
      "Persona-based RBAC (Admin/Editor/Viewer)",
      "Dynamic membership rules",
      "Audit logging across tenants",
      "TenantFleet ecosystem integration",
      "SharePoint sync for group-based access",
    ],
  },
  {
    name: "TenantForge",
    tagline: "Provision tenants. Not config drift.",
    description:
      "Terraform modules for tenant provisioning and OIDC setup. Flat module composition with object variables. One module, any tenant. Independent state isolation and cost tagging per brand.",
    pillar: "mind",
    metrics: [
      { value: "5+", label: "Terraform modules" },
      { value: "20", label: "federated creds max" },
      { value: "0", label: "client secrets" },
    ],
    stack: ["Terraform", "Python", "Azure", "OIDC", "GitHub Actions"],
    github: "https://github.com/t-granlund/tenantforge",
    pages: "https://t-granlund.github.io/tenantforge/",
    features: [
      "Modular Terraform composition",
      "OIDC federation setup",
      "Multi-tenant app registration",
      "Environment matrix (dev/staging/prod)",
      "State isolation per tenant",
      "Cost tagging per brand",
    ],
  },
  {
    name: "DNSGuard",
    tagline: "Your domains. Your reputation. Your shield.",
    description:
      "DNS management + DMARC monitoring + domain security scoring. Tracks SPF, DKIM, DMARC, SSL health, and domain expiry across a multi-brand portfolio. Feeds into PE reporting and compliance dashboards.",
    pillar: "spirit",
    metrics: [
      { value: "4", label: "protocols monitored" },
      { value: "<1%", label: "false positive rate" },
      { value: "24h", label: "alert latency" },
    ],
    stack: ["Next.js", "Python", "Prisma", "DNS", "DMARC"],
    github: "https://github.com/t-granlund/dnsguard",
    pages: "https://t-granlund.github.io/dnsguard/",
    features: [
      "DMARC monitoring and reporting",
      "DNS health checks",
      "Domain expiry tracking",
      "Email security scoring",
      "Threat intelligence feeds",
      "PE/compliance reporting",
    ],
  },
  {
    name: "RampGuard",
    tagline: "Spend smarter. Audit cleaner.",
    description:
      "Finance compliance + federated credential management. Receipt ingestion, policy enforcement, budget alerts, and compliance snapshots. Multi-tenant cost allocation with full audit trails.",
    pillar: "mind",
    metrics: [
      { value: "∞", label: "receipts processed" },
      { value: "100%", label: "compliance checks" },
      { value: "5", label: "integration count" },
    ],
    stack: ["Python", "Pydantic", "Playwright", "TypeScript"],
    github: "https://github.com/t-granlund/rampguard",
    pages: "https://t-granlund.github.io/rampguard/",
    features: [
      "Receipt ingestion pipeline",
      "Policy enforcement engine",
      "Budget alert system",
      "Compliance snapshots",
      "Multi-tenant cost allocation",
      "Full audit trail",
    ],
  },
  {
    name: "SharePointAgent",
    tagline: "Documents found. Teams notified.",
    description:
      "SharePoint document indexing + Teams notification bridge. Crawls sites, indexes documents, surfaces search results, and pushes alerts to Teams channels. Permission-aware and brand-scoped.",
    pillar: "body",
    metrics: [
      { value: "∞", label: "sites indexed" },
      { value: "∞", label: "documents processed" },
      { value: "∞", label: "Teams channels" },
    ],
    stack: ["Python", "Microsoft Graph", "Teams API", "TypeScript"],
    github: "https://github.com/t-granlund/sharepoint-agent",
    pages: "https://t-granlund.github.io/sharepoint-agent/",
    features: [
      "Site enumeration and indexing",
      "Document search and retrieval",
      "Teams channel notifications",
      "Permission audit and reporting",
      "Lifecycle management",
      "Graph API integration",
    ],
  },
];

export function EcosystemPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, oklch(0.32 0.045 158 / 0.35), transparent), radial-gradient(ellipse 60% 40% at 80% 60%, oklch(0.78 0.12 55 / 0.12), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="max-w-4xl">
            <SectionLabel index="TF" chapter="Open Source">
              Ecosystem
            </SectionLabel>
            <h1 className="mt-6 font-display text-5xl sm:text-6xl lg:text-7xl leading-[1.05] font-light text-balance">
              TenantFleet <em className="not-italic text-cedar">ecosystem.</em>
            </h1>
            <p className="mt-6 text-xl text-stone/90 max-w-3xl leading-relaxed">
              Seven open-source repositories for multi-tenant Microsoft Entra ID governance. Built
              for MSPs, PE firms, and multi-brand portfolios that need identity lifecycle,
              infrastructure automation, domain security, and compliance — without vendor lock-in.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="https://github.com/t-granlund"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-cedar/90 px-6 py-3 text-sm font-medium text-spruce-deep hover:bg-cedar transition-colors"
              >
                View on GitHub <span aria-hidden="true">&#8599;</span>
              </a>
              <a
                href="/work"
                className="inline-flex items-center gap-2 text-sm text-cedar hover:text-mist transition-colors"
              >
                Back to case studies <span aria-hidden="true">&#8592;</span>
              </a>
            </div>
          </div>

          {/* Ecosystem metrics */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { value: "7", label: "Open-source repos" },
              { value: "104", label: "Source files" },
              { value: "0", label: "Secrets required" },
              { value: "MIT", label: "License" },
            ].map((m) => (
              <div
                key={m.label}
                className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-sm"
              >
                <div className="font-display text-4xl font-light text-mist">{m.value}</div>
                <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar/90">
                  {m.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Diagram ── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <SectionLabel index="02" chapter="Architecture">
              How it fits together
            </SectionLabel>
            <p className="mt-4 text-stone/80 max-w-2xl">
              Three pillars — Mind (governance), Body (people), Spirit (security) — with seven repos
              that share a common design system, zero-secret auth, and GitHub Pages deployment.
            </p>
          </div>
          <div className="mt-10 rounded-3xl border border-border bg-card/40 p-8 lg:p-12 overflow-x-auto">
            <EcosystemDiagram />
          </div>
        </div>
      </section>

      {/* ── Repo Grid ── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <SectionLabel index="03" chapter="The Repos">
              Each system, explained
            </SectionLabel>
            <p className="mt-4 text-stone/80 max-w-2xl">
              Every repository is self-contained, MIT-licensed, and deployable to GitHub Pages in
              under a minute. Click any card to visit its live site.
            </p>
          </div>
          <div className="mt-10 grid lg:grid-cols-2 gap-6">
            {repos.map((repo) => (
              <RepoCard key={repo.name} repo={repo} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Workflow ── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <SectionLabel index="04" chapter="Workflow">
              How it works in practice
            </SectionLabel>
            <p className="mt-4 text-stone/80 max-w-2xl">
              From tenant provisioning to user offboarding, the ecosystem covers the full identity
              lifecycle across a multi-brand portfolio.
            </p>
          </div>
          <div className="mt-10 rounded-3xl border border-border bg-card/40 p-8 lg:p-12 overflow-x-auto">
            <WorkflowDiagram />
          </div>
        </div>
      </section>

      {/* ── Value Prop ── */}
      <section className="relative py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <SectionLabel index="05" chapter="Why This Matters">
              Value to organizations
            </SectionLabel>
          </div>
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "For MSPs",
                body: "Manage multiple client tenants from a single control plane. Onboard new clients with Terraform modules, not manual clicks. Govern identity, cost, and compliance without building from scratch.",
              },
              {
                title: "For PE Firms",
                body: "Portfolio companies each get their own tenant, but you maintain oversight. Dashboards show cost, security posture, and identity health across the entire portfolio.",
              },
              {
                title: "For Multi-Brand Orgs",
                body: "Each brand operates independently but shares governance standards. Staff move between brands with automatic access provisioning. Offboarding is immediate and auditable.",
              },
              {
                title: "Zero Secrets",
                body: "Every repo uses OIDC federated credentials. No client secrets, no API keys in repos, no credential rotation nightmares. GitHub Actions authenticates directly to Azure.",
              },
              {
                title: "Open Source",
                body: "MIT license. Fork what you need, ignore what you don't. No vendor lock-in. No per-seat pricing. The codebase is yours to adapt, extend, and commercialize.",
              },
              {
                title: "Agent-Built",
                body: "Every system was built with AI agent supervision — automated testing, judge gates, and security auditing. The same discipline that scales to Walmart's 4,000+ users.",
              },
            ].map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card/60 p-8 lift">
                <h3 className="font-display text-xl text-mist">{v.title}</h3>
                <p className="mt-3 text-sm text-stone/80 leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative py-20">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 50% 40% at 50% 50%, oklch(0.78 0.12 55 / 0.10), transparent)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-display text-4xl sm:text-5xl text-mist">
            Start with one repo. Add the rest when you need them.
          </h2>
          <p className="mt-4 text-stone/80 max-w-2xl mx-auto">
            The TenantFleet ecosystem is designed as independent polyrepos. Pick the tool that
            solves your immediate problem. The shared design system and auth patterns make
            integration natural.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://github.com/t-granlund/tenantfleet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-cedar/90 px-6 py-3 text-sm font-medium text-spruce-deep hover:bg-cedar transition-colors"
            >
              Start with TenantFleet <span aria-hidden="true">&#8599;</span>
            </a>
            <a
              href="https://t-granlund.github.io/tenantfleet/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-6 py-3 text-sm text-stone hover:text-mist transition-colors"
            >
              View live site <span aria-hidden="true">&#8599;</span>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
