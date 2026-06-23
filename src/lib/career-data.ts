// Single source of truth for career facts (dates, roles, the impact timeline).
//
// Consumed by Career.tsx (résumé view), CareerImpactTimeline.tsx (journey view),
// and chatbot/knowledge/career.ts (RAG knowledge). A future date or metric edit
// happens HERE, once — the three surfaces derive from it. Metric claims are
// pre-verified employment facts; gated portfolio metrics live behind
// docs/NUMBER_VERIFICATION.md.

/** Canonical date ranges. Edit a date once, every surface follows. */
export const CAREER_DATES = {
  openToOpportunities: "June 2026 — Present",
  apple: "2009 — 2015",
  schoolOfRock: "Apr 2015 — Jan 2022",
  outdoorCap: "2022 — 2023",
  north40: "2023 — 2024",
  httDirector: "Oct 2024 — Jan 2026",
  httOps: "Jan 2026 — June 2026",
  httCombined: "2024 — 2026",
} as const;

// ---------------------------------------------------------------------------
// Résumé view (Career.tsx) — most recent first.
// Mirrors Tyler-Granlund-Master-Resume exactly (consistency = ATS/recruiter
// trust signal). Update both together.
// ---------------------------------------------------------------------------
export interface CareerRole {
  company: string;
  role: string;
  dates: string;
  summary: string;
  outcomes: string[];
}

export const careerRoles: CareerRole[] = [
  {
    company: "Open to Opportunities",
    role: "IT Operations & Systems Engineer",
    dates: CAREER_DATES.openToOpportunities,
    summary:
      "Available for full-time roles, consulting engagements, and collaborations. Looking for positions in IT leadership, systems engineering, AI/ML engineering, forward-deployed engineering, and digital transformation. Based in Bella Vista, Arkansas. Remote or on-site as needed.",
    outcomes: [
      "Tailored resume variants: AI PM, FDE, Master Resume",
      "Open to IT leadership, systems engineering, AI/ML roles",
      "Available for consulting and fractional engagements",
      "Remote-first, on-site travel as needed",
    ],
  },
  {
    company: "Head to Toe Brands (Riverside PE)",
    role: "IT Operations & Systems Engineer",
    dates: CAREER_DATES.httOps,
    summary:
      "Embedded with non-technical operators to build supervised multi-agent systems. Developed production software across a five-brand, 200+ location franchise portfolio. Discovery to scoping to architecture, with the security, evals, and CI/CD to back it. Used Code Puppy to build Control Tower, Knowledge Fabric, and Estate Trace.",
    outcomes: [
      "Multi-agent systems developed for production",
      "Human-in-the-loop guardrails & eval harnesses",
      "Zero-secret, OIDC-based automation",
      "Built with Code Puppy multi-agent system",
    ],
  },
  {
    company: "Head to Toe Brands (Riverside PE)",
    role: "IT Director",
    dates: CAREER_DATES.httDirector,
    summary:
      "Led enterprise IT for a Riverside private equity-backed multi-brand franchise group. Portfolio: The Lash Lounge (~130 units), Bishops Cuts and Color (~40 units), Frenchies Modern Nail Care (24 units), and Delta Crown Hair Extensions. 200+ locations total. Built the identity governance ecosystem. A master database federating across five brands and Microsoft tenants with role-based access tied to location, brand, and job function. Onboarding reduced from days to minutes.",
    outcomes: [
      "200+ locations across 5 brands (Riverside PE portfolio)",
      "Identity governance ecosystem. Master database across all tenants",
      "Built support center. Cut resolution time 40%",
      "Zero-trust security & access governance rollout",
      "Developed onboarding framework: days → minutes. Left before full rollout; open-sourcing for community benefit",
    ],
  },
  {
    company: "Outdoor Cap Company",
    role: "IT Product Manager I to II — Digital Experience",
    dates: CAREER_DATES.outdoorCap,
    summary:
      "Built the Compass B2B wholesale online ordering platform. The company's biggest technical undertaking. I was the designated project lead that orchestrated the agile SDLC lifecycle. I left right as the final high-fidelity mockup was approved and it went into development. It launched that same year exactly as our team spec'd it. Coordinated with global supply chain: factories in Bangladesh, China, Vietnam, and Sri Lanka. Warehouses in Bentonville AR, Rancho Cucamonga CA, Dallas TX, and Zanesville OH. Integrated Magento / Adobe Commerce with ERP, 3D product customization, and account dashboards. First-ever Adobe Commerce customer advocate, sharing the framework and full agile SDLC lifecycle best practices with a global audience.",
    outcomes: [
      "Built Compass B2B ordering platform",
      "Coordinated global supply chain across 4 countries",
      "Reduced B2B order friction with 3D tooling",
      "Shipped self-service account dashboards",
      "First Adobe Commerce customer advocate, sharing agile SDLC best practices globally",
    ],
  },
  {
    company: "School of Rock",
    role: "IT Manager to Senior IT Manager",
    dates: CAREER_DATES.schoolOfRock,
    summary:
      "Joined at ~145 locations in 8 countries. Left at ~300+ locations across 14 countries. I was the primary IT support pillar for every master franchise rollout. Analyzed requirements, adapted systems, built merchant processing integrations through NMI gateways connected to Pike 13, and trained owners and managers. Built Okta identity federation, Google Workspace governance, and custom local solutions for scheduling, invoicing, and payment identity across every new market.",
    outcomes: [
      "~145 → ~300+ locations, 8 → 14 countries",
      "Global SSO rollout. 300+ schools via Okta",
      "Merchant processing integrations (NMI + Pike 13)",
      "Privacy & compliance program (COPPA/FERPA/GDPR)",
      "Franchise support model & enablement at scale",
    ],
  },
];

// ---------------------------------------------------------------------------
// Journey view (CareerImpactTimeline.tsx) — oldest first, with map + stats.
// Narrative + measurable highlights drawn only from pre-verified employment
// facts. Every chapter carries the same through-line: understand what people
// need, then remove the obstacles that make their day harder.
// ---------------------------------------------------------------------------
export interface SourceLink {
  label: string;
  url: string;
}

export interface ImpactStep {
  company: string;
  role: string;
  dates: string;
  start: string;
  end: string;
  locations: string[];
  stat: string;
  statLabel: string;
  story: string;
  achievements: string[];
  value: string;
  sources: SourceLink[];
}

export const careerTimeline: ImpactStep[] = [
  {
    company: "Apple",
    role: "Lead South Chicago Market Technical Facilitator",
    dates: CAREER_DATES.apple,
    start: "South Chicago market",
    end: "South Chicago market",
    locations: ["Chicago"],
    stat: "1",
    statLabel: "market — the root",
    story:
      "Where it started. I led Mac and Mobile technician training for the South Chicago market and ran the Genius Bar operations playbook day to day.",
    achievements: [
      "Built and taught the one-week promoted-staff course. Troubleshooting theory, Apple facilitation practices, and Genius Bar operations.",
      "Trained Mac and Mobile technicians across the South Chicago market.",
      "Mentored the next wave of technicians. Internal promotions and external hires alike.",
    ],
    value:
      "Learned the 1-to-many support philosophy that still drives how I build. Teach the room, not just the person.",
    sources: [{ label: "Apple Retail", url: "https://www.apple.com/retail/" }],
  },
  {
    company: "School of Rock",
    role: "IT Manager → Senior IT Manager",
    dates: CAREER_DATES.schoolOfRock,
    start: "~145 locations · 8 countries",
    end: "~300+ locations · 14 countries",
    locations: [
      "Glen Ellyn",
      "Milwaukee",
      "São Paulo",
      "Rio",
      "Santiago",
      "Lima",
      "Asunción",
      "Madrid",
      "Lisbon",
      "Blackrock",
      "Taichung",
      "Sydney",
      "Perth",
      "Cape Town",
    ],
    stat: "150+",
    statLabel: "locations helped open",
    story:
      "The primary IT support pillar for every master-franchise launch across LATAM, Europe, APAC, and Africa. For each new market I analyzed requirements, adapted systems, built what did not exist yet, and trained the owners and managers who would run it.",
    achievements: [
      "Built merchant-processing integrations that did not previously exist. Local banks to NMI transnational gateways to Pike 13, with revenue tracking leadership could trust.",
      "Rolled out global SSO and Google Workspace governance across 300+ schools via Okta.",
      "Stood up privacy and compliance for new markets. GDPR for the Ireland and Iberia launches, plus COPPA/FERPA posture.",
      "Built the Summerfest All-Stars video pipeline. Nine regional GoPro kits, capture-to-judging FTP workflow.",
    ],
    value:
      "Grew the footprint from ~145 locations in 8 countries to 300+ across 14. Every market opened on time because the technical obstacles were already cleared.",
    sources: [{ label: "School of Rock", url: "https://www.schoolofrock.com" }],
  },
  {
    company: "Outdoor Cap",
    role: "IT Product Manager I → II",
    dates: CAREER_DATES.outdoorCap,
    start: "Bentonville HQ",
    end: "Global supply chain",
    locations: ["Bentonville", "Dallas", "Rancho Cucamonga", "Zanesville"],
    stat: "4",
    statLabel: "countries in the supply chain",
    story:
      "Built Compass, the B2B wholesale online ordering platform. The company's largest technical undertaking. I was the designated project lead that orchestrated the agile SDLC lifecycle. I left right as the final high-fidelity mockup was approved and it went into development. It launched that same year exactly as our team spec'd it.",
    achievements: [
      "Integrated Magento / Adobe Commerce with ERP and 3D product customization, and shipped self-service account dashboards.",
      "Coordinated a global supply chain. Factories in Bangladesh, China, Vietnam, and Sri Lanka feeding four U.S. distribution centers.",
      "Became Adobe Commerce's first-ever customer advocate, sharing the framework and full agile SDLC lifecycle best practices with a global audience. The presentation lives in Adobe's Experience Center as a reference recording.",
      "Replaced a manual, rep-mediated ordering process with guided self-service built around how dealers actually order.",
    ],
    value:
      "Turned wholesale ordering from phone-and-spreadsheet friction into a platform dealers could run themselves.",
    sources: [
      { label: "Outdoor Cap Company", url: "https://www.outdoorcap.com" },
      {
        label: "Compass launch",
        url: "https://www.outdoorcap.com/blog/new-online-ordering-experience-compass-revolutionizes-ordering/?page=home",
      },
      {
        label: "Adobe Experience League",
        url: "https://experienceleague.adobe.com/en/docs/events/learn-from-your-peers-recordings/commerce/2024/agile-sdlc",
      },
    ],
  },
  {
    company: "North 40 / Smith & Rogue",
    role: "E-Commerce Operations Lead",
    dates: CAREER_DATES.north40,
    start: "Great Falls HQ",
    end: "Northwest footprint",
    locations: ["Great Falls"],
    stat: "14",
    statLabel: "stores across MT, ID, WA",
    story:
      "Owned e-commerce operations for North 40, Smith & Rogue, and sibling brands. Brought the storefront in-house.",
    achievements: [
      "Migrated 14 brick-and-mortar stores from a legacy managed backend to Adobe Commerce Cloud. Unraveled the gatekeeping mess of their existing web development contractor and helped the team own their own business decisions, architecture, and integrations. Moved them from Nexcess/Liquid Web hosting to a multi-year six-figure Adobe Commerce Cloud contract — they owned the backend and architecture, and managed hosting became cheaper and easier to run.",
      "Broke the agency dependency so the team could move at its own pace, not a vendor's.",
      "Managed hundreds of thousands of SKUs with weapons and state-specific compliance nuance.",
    ],
    value:
      "Gave a regional retailer direct control of its own storefront, and the agile SDLC to keep improving it.",
    sources: [
      { label: "North 40 Outfitters", url: "https://www.north40.com" },
      {
        label: "Adobe Commerce talk",
        url: "https://experienceleague.adobe.com/en/docs/events/learn-from-your-peers-recordings/commerce/2024/agile-sdlc",
      },
    ],
  },
  {
    company: "Head to Toe Brands",
    role: "IT Director → IT Ops & Systems Engineer",
    dates: CAREER_DATES.httCombined,
    start: "Glen Arbor HQ",
    end: "200+ locations · 5 brands",
    locations: ["Glen Arbor", "South Lake"],
    stat: "200+",
    statLabel: "locations · 5 brands · Riverside PE",
    story:
      "Enterprise IT for a Riverside private-equity-backed franchise group. Portfolio: The Lash Lounge (~130 units), Bishops (~40), Frenchies (24), and Delta Crown. Built and shipped supervised multi-agent systems to production alongside non-technical operators.",
    achievements: [
      "Built the identity-governance ecosystem. A master database federating identities across 5 brands and 5 Microsoft tenants. Access by location, brand, and role.",
      "Developed the identity onboarding framework that cut provisioning from days to minutes, with immediate and auditable offboarding. Left before full portfolio-wide rollout; open-sourcing the framework so other franchise operators can benefit.",
      "Stood up the support center. ~40% faster resolutions.",
      "Built Control Tower, Knowledge Fabric, and Estate Trace using Code Puppy. Developed the production pipeline with eval harnesses gating every release. Left before full portfolio-wide deployment; the architecture and guardrails are being open-sourced for the community.",
      "Zero-secret, OIDC-based automation across all five tenants.",
    ],
    value:
      "200+ locations running on systems that made the work less stressful. The whole point: create brand ambassadors by serving the people behind the counter.",
    sources: [{ label: "Head to Toe Brands", url: "https://www.headtotoebrands.com" }],
  },
];
