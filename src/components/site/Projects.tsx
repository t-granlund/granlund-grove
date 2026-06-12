// Projects / case studies section.
// Each card is compact (kicker + name + metrics + teaser + "Explore" button).
// The full five-beat narrative, diagram, and any extras live inside CaseStudyModal.
// caseStudies is exported so tests can verify the data without opening modals.
/* eslint-disable react-refresh/only-export-components */

import type React from "react";
import { Picture } from "./Picture";
import { SectionLabel } from "./SectionLabel";
import { CaseStudyModal } from "./CaseStudyModal";
import { EstateTraceSnapshot } from "./EstateTraceSnapshot";
import { EstateTraceDeepDive } from "./EstateTraceDeepDive";
import { EstateTraceDiagram } from "./diagrams/EstateTraceDiagram";
import { ControlTowerDiagram } from "./diagrams/ControlTowerDiagram";
import { KnowledgeFabricDiagram } from "./diagrams/KnowledgeFabricDiagram";
import { ZeroSecretDiagram } from "./diagrams/ZeroSecretDiagram";
import { GroupManagementDiagram } from "./diagrams/GroupManagementDiagram";

export type Metric = { value: string; label: string };

export type CaseStudy = {
  name: string;
  kicker: string;
  tag: string;
  /** One-line hook for the modal header — distinct from the Problem beat. */
  teaser: string;
  metrics: Metric[];
  problem: string;
  architecture: string;
  oversight: string;
  outcome: string;
  reflection: string;
  stack: string[];
  link?: { href: string; label: string };
  note?: string;
  diagram?: React.ReactNode;
  /** Local image name (in public/img/) for the card header photo strip. */
  heroImage?: string;
  /** Visual rendered inside the card itself (e.g. a dashboard snapshot). */
  cardContent?: React.ReactNode;
  /** Extra sections rendered at the top of the modal, before the five beats. */
  modalExtras?: React.ReactNode;
};

export const caseStudies: CaseStudy[] = [
  {
    name: "Control Tower",
    kicker: "Multi-tenant governance platform",
    teaser: "One control plane for cost, identity, and compliance across the whole estate.",
    tag: "Production · v2.5.0",
    metrics: [
      { value: "7,386", label: "tests gating release" },
      { value: "48/48", label: "judge score" },
      { value: "5", label: "tenants live" },
    ],
    diagram: <ControlTowerDiagram />,
    // Aerial topo-overlay trail — systems mapping / oversight from above
    heroImage: "trail",
    problem:
      "Five Microsoft tenants, 200+ locations, and no unified view of cost, identity, compliance, or lifecycle evidence. Leadership couldn't answer basic governance questions across the estate.",
    architecture:
      "Python/FastAPI + HTMX + PostgreSQL on the Azure SDK (Cost Management, Resource Manager, Policy, Defender). Containerized to GHCR with OIDC-only auth — no stored secrets. I chose server-rendered HTMX over a SPA to keep the attack surface small and the system auditable.",
    oversight:
      "Built by a supervised agent fleet. Every release gated by 7,386 automated tests and a 48/48 automated judge score, with DR drills completed before promotion.",
    outcome: "v2.5.0 in production June 2026, all five tenants syncing live.",
    reflection:
      "I'd stand up the evaluation harness earlier. The judge caught regressions the test suite missed and quietly became the real release gate.",
    stack: ["Python", "FastAPI", "HTMX", "PostgreSQL", "Azure SDK", "Docker", "OIDC"],
  },
  {
    name: "Knowledge Fabric",
    kicker: "Identity-aware RAG",
    teaser: "Identity-aware answers from 100K+ support tickets — scoped to who's asking.",
    tag: "Phase 2 · In build",
    metrics: [
      { value: "52/52", label: "Phase 1 QA checks" },
      { value: "1,523", label: "identities grounded" },
      { value: "100K+", label: "tickets indexed" },
    ],
    diagram: <KnowledgeFabricDiagram />,
    // Misty spruce forest fading into fog — discovering knowledge through the haze
    heroImage: "mist",
    problem:
      "Support knowledge scattered across POS configs, SharePoint, and 100K+ helpdesk tickets. Answers had to respect brand and role boundaries — staff in one brand shouldn't surface another brand's playbook.",
    architecture:
      "A multi-agent ingestion pipeline with SQLite + FTS5 memory and Entra identity as the grounding layer — 1,523 verified humans across a 15-slot attribute schema. Identity is the filter, not an afterthought bolted on later.",
    oversight:
      "A planner agent orchestrating specialists — crawler, programmer, code-reviewer, security-auditor. Phase 1 closed at 52/52 QA checks.",
    outcome:
      "Phase 1 shipped; Phase 2 in build, with consumers planned for Teams, Outlook, and the helpdesk platform.",
    reflection:
      "Grounding on identity from day one paid off — retrofitting role boundaries into a RAG system after the fact is painful.",
    stack: ["Multi-agent", "RAG", "SQLite", "FTS5", "Entra ID", "Python"],
  },
  {
    name: "Estate Trace",
    kicker: "Cost governance the COO actually uses",
    teaser: "What do we run, and what does it cost? Answered across every cloud and repo.",
    tag: "Live · Drives exec decisions",
    metrics: [
      { value: "12/12", label: "verification checks" },
      { value: "196", label: "Azure resources" },
      { value: "41", label: "repos reconciled" },
    ],
    cardContent: <EstateTraceSnapshot />,
    modalExtras: <EstateTraceDeepDive />,
    diagram: <EstateTraceDiagram />,
    // God-rays illuminating the forest floor — bringing light to hidden costs
    heroImage: "clearing",
    problem:
      "Nobody could answer 'what do we run and what does it cost' across 41 repos, 11 subscriptions, ~196 Azure resources, plus reseller-billed licensing.",
    architecture:
      "Live read-only pulls against version control, identity, cloud cost management, invoices, and licensing APIs feed a DuckDB warehouse and a single canonical workbook — with 12/12 verification checks gating every refresh.",
    oversight:
      "Each pull is verified against the prior canonical snapshot; all 12/12 checks must pass before the workbook is published as source of truth.",
    outcome:
      "The full IT run-rate quantified — with a ~40% optimization path (a single over-provisioned capacity is ~54% of it) and 25 prioritized remediation actions. It drives executive financial decisions.",
    reflection:
      "The real value was the verification checks. Once people trusted the numbers, the workbook became the thing every cost conversation started from.",
    stack: ["Python", "DuckDB", "GitHub API", "MS Graph", "Azure Cost Mgmt"],
  },
  {
    name: "Zero-secret automation",
    kicker: "OIDC lifecycle across 5 tenants",
    teaser: "Full lifecycle automation across five tenants — without storing one credential.",
    tag: "Production",
    metrics: [
      { value: "5", label: "tenants federated" },
      { value: "0", label: "stored secrets" },
    ],
    diagram: <ZeroSecretDiagram />,
    // Clear alpine lake — transparent, nothing hidden (federated, zero-secret)
    heroImage: "lake",
    problem:
      "Lifecycle automation — onboarding, offboarding, leave-of-absence — across five tenants, without storing a single credential anywhere.",
    architecture:
      "GitHub Actions with workload identity federation per tenant, driven from project management and CSV inputs. Least privilege and federated trust by construction, zero long-lived secrets.",
    oversight:
      "Every run leaves an audit trail; permissions are scoped per-tenant and least-privilege — the security story FDE interviewers ask about.",
    outcome:
      "Lifecycle automation running across all five tenants with no stored secrets and full audit trails.",
    reflection:
      "Federated identity took longer to wire than secrets would have, but it removed an entire class of risk. Worth every hour.",
    stack: ["GitHub Actions", "Workload Identity Federation", "OIDC"],
  },
  {
    name: "Mysa Mail",
    kicker: "Local-first AI email agent (personal)",
    teaser: "A local-first email agent that asks before it acts.",
    tag: "Personal · Shipped",
    metrics: [
      { value: "5,700+", label: "LOC backend" },
      { value: "5", label: "classifiers" },
      { value: "AA", label: "WCAG 2.2" },
    ],
    // Private cabin at dusk, warm interior light — a personal, local-first project
    heroImage: "house",
    problem:
      "Email overwhelm — but running cloud AI over a personal inbox is a privacy non-starter. I wanted the same production discipline off the clock.",
    architecture:
      "FastAPI + SvelteKit, 5,700+ LOC backend, with 5 classifiers and approval workflows before any destructive write. Local Ollama by default, cloud opt-in. WCAG 2.2 AA throughout.",
    oversight:
      "Audit-trailed inference with explicit approval gates before destructive actions — the agent proposes, the human disposes.",
    outcome: "Shipped and in daily use, with local-first inference and an accessible UI.",
    reflection:
      "The approval-before-write pattern is the thing I now reach for in every agent I build.",
    stack: ["FastAPI", "SvelteKit", "Ollama", "SQLite", "WCAG 2.2 AA"],
    link: { href: "https://github.com/t-granlund/mysa-mail", label: "View on GitHub" },
  },
  {
    name: "Group Management Hub",
    kicker: "The production quality bar",
    teaser: "Group governance held to a strict, fully test-gated quality bar.",
    diagram: <GroupManagementDiagram />,
    tag: "Production",
    metrics: [
      { value: "7,984", label: "tests gating release" },
      { value: "334", label: "groups governed" },
      { value: "4", label: "tenants" },
    ],
    // Spruce branch with cone — a cluster / group of needles = group governance
    heroImage: "branch",
    problem:
      "Group and access sprawl across four tenants — 334 groups with no consistent governance or quality bar.",
    architecture:
      "The same supervised-agent discipline as Control Tower, held to a strict gate: 7,984 tests and WCAG AA across the UI.",
    oversight:
      "7,984 automated tests gating every release; accessibility validated to WCAG AA before promotion.",
    outcome:
      "Production across four tenants managing 334 groups — the exhibit for the quality bar I hold every system to.",
    reflection:
      "Boring, exhaustive testing is the unglamorous reason these systems can be agent-built and still trusted in production.",
    stack: ["Python", "FastAPI", "Azure", "WCAG AA"],
    note: "Code private — architecture summarized.",
  },
];

const moreBuilds = [
  {
    title: "360 Communicator",
    tag: "Shipped",
    body: "Cross-platform desktop app for franchise communication — Tauri + React + Vite. Unifies fragmented tooling for multi-unit operators.",
    tech: ["Tauri", "React", "Vite", "TypeScript"],
    href: "https://github.com/t-granlund/360-communicator",
  },
  {
    title: "Passkey Enable Azure",
    tag: "Enterprise",
    body: "Modernizing identity from passwords to FIDO2/passkeys across enterprise environments — security engineering meets user experience.",
    tech: ["Azure", "FIDO2", "Identity", "Security"],
    href: "",
  },
];

const passions = [
  { t: "Process Innovation", b: "Reframing how teams move from idea to ship." },
  { t: "Trails & Mountain Biking", b: "Northwest Arkansas singletrack as creative fuel." },
  { t: "Family, Community, Nature", b: "The grove that grounds everything else." },
];

export function Projects() {
  return (
    <section id="projects" className="relative py-32 lg:py-40 bg-spruce-deep/40">
      <div className="topo-divider absolute top-0 inset-x-0" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl">
          <SectionLabel index="01" chapter="The Work">
            Case Studies
          </SectionLabel>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl leading-[1.05] font-light text-balance">
            What I&apos;ve <em className="not-italic text-cedar">built.</em>
          </h2>
          <p className="mt-6 text-lg text-stone/90 max-w-2xl">
            Not a wall of logos — a few systems told in depth. Each one: the problem, the
            architecture and why, how agents were supervised and evaluated, and what I&apos;d do
            differently.
          </p>
        </div>

        {/* Case study cards — compact, full detail in modal */}
        <div className="mt-16 space-y-6">
          {caseStudies.map((c, i) => (
            <article
              key={c.name}
              className="group relative rounded-3xl border border-border bg-card/70 overflow-hidden lift"
            >
              {c.heroImage && (
                <div className="relative h-44 lg:h-52 overflow-hidden">
                  <Picture
                    name={c.heroImage}
                    widths={[768, 1280, 1920]}
                    sizes="(min-width: 1024px) 896px, 100vw"
                    width={1920}
                    height={620}
                    alt=""
                    decorative
                    className="block h-full w-full"
                    imgClassName="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                </div>
              )}

              <div className="p-8 lg:p-12">
                {/* Kicker + tag */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                    {c.kicker}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone/70 px-2.5 py-1 rounded-full border border-border">
                    {c.tag}
                  </span>
                </div>

                {/* Name */}
                <h3 className="mt-4 font-display text-3xl lg:text-4xl text-foreground">{c.name}</h3>

                {/* Metrics */}
                <div
                  className="mt-6 grid grid-cols-3 gap-x-6 gap-y-4 border-l-2 border-cedar/40 pl-5 sm:flex sm:flex-wrap sm:gap-x-10"
                  aria-label="Key metrics"
                >
                  {c.metrics.map((m) => (
                    <div key={m.label}>
                      <div className="font-display text-3xl lg:text-4xl font-light leading-none text-mist">
                        {m.value}
                      </div>
                      <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar/90">
                        {m.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Problem teaser */}
                <p className="mt-6 text-stone/75 leading-relaxed max-w-2xl">
                  {c.problem.length > 160
                    ? c.problem.slice(0, 160).trimEnd() + "\u2026"
                    : c.problem}
                </p>

                {/* In-card visual (e.g. dashboard snapshot for Estate Trace) */}
                {c.cardContent && <div className="mt-8">{c.cardContent}</div>}

                {/* Expand button — opens full modal */}
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <CaseStudyModal study={c} extraContent={c.modalExtras} />
                  {c.link && (
                    <a
                      href={c.link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex items-center gap-2 text-sm text-cedar hover:text-mist transition-colors"
                    >
                      {c.link.label} <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* More from the workshop */}
        <div className="mt-16">
          <h3 className="font-display text-2xl text-foreground">More from the workshop.</h3>
          <p className="mt-2 text-stone/80 max-w-2xl">
            Smaller trails — open-source tools and personal builds that carry the same discipline.
          </p>
          <div className="mt-8 grid sm:grid-cols-2 gap-5">
            {moreBuilds.map((p) => (
              <article
                key={p.title}
                className="group relative rounded-2xl border border-border bg-card/70 p-7 lift overflow-hidden"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.12),transparent_60%)]" />
                <div className="relative">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar">
                    {p.tag}
                  </span>
                  <h4 className="mt-4 font-display text-xl text-foreground">{p.title}</h4>
                  <p className="mt-3 text-sm text-stone/85 leading-relaxed">{p.body}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.3)] text-stone/85"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {p.href && (
                    <a
                      href={p.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-xs text-cedar hover:text-mist transition-colors"
                    >
                      View <span aria-hidden="true">&#8599;</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Personal passions */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          {passions.map((c) => (
            <div key={c.t} className="rounded-2xl border border-border bg-card/60 p-6 lift">
              <h4 className="font-display text-lg">{c.t}</h4>
              <p className="mt-2 text-sm text-stone/85">{c.b}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
