// Knowledge base for the portfolio chatbot
// Extracted from all site content. Each chunk has metadata for retrieval scoring.

export interface KnowledgeChunk {
  id: string;
  text: string;
  topics: string[];
  source: string;
  priority: number; // 1-10, higher = more important
}

export const knowledgeBase: KnowledgeChunk[] = [
  // ── Bio & Background ──
  {
    id: "bio-name",
    text: "Tyler Granlund is an IT Operations & Systems Engineer based in Bella Vista, Arkansas. He was formerly an IT Director.",
    topics: ["bio", "name", "location", "role", "title"],
    source: "About",
    priority: 10,
  },
  {
    id: "bio-philosophy",
    text: "Tyler's philosophy: support people, remove technological obstacles so their day-to-day is more fulfilling, create brand ambassadors by making work less stressful. Technology should serve people, not the other way around.",
    topics: ["philosophy", "approach", "values", "people", "support"],
    source: "About",
    priority: 9,
  },
  {
    id: "bio-span",
    text: "Background spans franchise technology, B2B wholesale e-commerce, B2C brick-and-mortar e-commerce, agile product management, Microsoft cloud environments, data and BI modernization, and cross-functional transformation.",
    topics: ["background", "experience", "domains", "industries"],
    source: "About",
    priority: 8,
  },
  {
    id: "bio-beyond",
    text: "Beyond the day job, Tyler builds enterprise dashboards, AI-powered tools, open-source agents, desktop applications, and accessible websites for local businesses.",
    topics: ["side projects", "open source", "ai", "agents", "tools"],
    source: "About",
    priority: 7,
  },

  // ── Contact ──
  {
    id: "contact-email",
    text: "You can reach Tyler directly at hello@tylergranlund.com.",
    topics: ["contact", "email", "reach", "message", "hello"],
    source: "Contact",
    priority: 10,
  },
  {
    id: "contact-location",
    text: "Tyler is based in Bella Vista, Arkansas, and works remotely or on-site as needed.",
    topics: ["location", "remote", "bella vista", "arkansas"],
    source: "Contact",
    priority: 8,
  },
  {
    id: "contact-hiring",
    text: "Tyler is open to full-time roles, consulting engagements, and collaborations. He has tailored resume variants for AI PM and FDE (Forward Deployed Engineer) positions, plus a master resume.",
    topics: ["hiring", "job", "role", "consulting", "resume", "available", "open"],
    source: "Contact",
    priority: 10,
  },

  // ── Career: Apple ──
  {
    id: "career-apple",
    text: "At Apple (2009-2015), Tyler was Lead South Chicago Market Technical Facilitator. He led Mac and Mobile technician training and ran Genius Bar operations. He built and taught a one-week promoted-staff course covering troubleshooting theory, Apple facilitation practices, and Genius Bar operations. He mentored the next wave of technicians.",
    topics: ["apple", "genius bar", "training", "retail", "mac", "mobile", "early career"],
    source: "Career",
    priority: 7,
  },

  // ── Career: School of Rock ──
  {
    id: "career-sor",
    text: "At School of Rock (Apr 2015 - Jan 2022), Tyler was IT Manager to Senior IT Manager. He joined at ~145 locations in 8 countries and left at ~300+ locations across 14 countries. He was the primary IT support pillar for every master franchise rollout across LATAM, Europe, APAC, and Africa.",
    topics: [
      "school of rock",
      "franchise",
      "it manager",
      "global",
      "expansion",
      "master franchise",
    ],
    source: "Career",
    priority: 9,
  },
  {
    id: "career-sor-achievements",
    text: "At School of Rock, Tyler built merchant-processing integrations through NMI gateways to Pike 13, rolled out global SSO and Google Workspace governance across 300+ schools via Okta, stood up privacy and compliance (GDPR, COPPA, FERPA), and built the Summerfest All-Stars video pipeline with GoPro kits and FTP workflows.",
    topics: ["school of rock", "okta", "sso", "nmi", "pike 13", "gdpr", "compliance", "video"],
    source: "Career",
    priority: 8,
  },

  // ── Career: Outdoor Cap ──
  {
    id: "career-outdoor",
    text: "At Outdoor Cap Company (2022-2023), Tyler was IT Product Manager I to II for Digital Experience. He built the Compass B2B wholesale online ordering platform, the company's biggest technical undertaking. He coordinated with global supply chain across factories in Bangladesh, China, Vietnam, and Sri Lanka, with warehouses in Bentonville AR, Rancho Cucamonga CA, Dallas TX, and Zanesville OH.",
    topics: [
      "outdoor cap",
      "b2b",
      "compass",
      "magento",
      "adobe commerce",
      "supply chain",
      "product manager",
    ],
    source: "Career",
    priority: 8,
  },
  {
    id: "career-outdoor-adobe",
    text: "At Outdoor Cap, Tyler integrated Magento/Adobe Commerce with ERP, 3D product customization, and account dashboards. He was the first-ever Adobe Commerce customer advocate presenting to enterprise customers.",
    topics: ["outdoor cap", "adobe commerce", "magento", "erp", "3d", "customer advocate"],
    source: "Career",
    priority: 7,
  },

  // ── Career: Head to Toe Brands ──
  {
    id: "career-htt",
    text: "At Head to Toe Brands (Riverside PE), Tyler was IT Director (Oct 2024 - Jan 2026) and is now IT Operations & Systems Engineer (Jan 2026 - Present). The portfolio includes The Lash Lounge (~130 units), Bishops Cuts and Color (~40 units), Frenchies Modern Nail Care (24 units), and Delta Crown Hair Extensions — 200+ locations total.",
    topics: [
      "head to toe",
      "riverside",
      "pe",
      "it director",
      "lash lounge",
      "bishops",
      "frenchies",
      "delta crown",
    ],
    source: "Career",
    priority: 10,
  },
  {
    id: "career-htt-current",
    text: "Currently at Head to Toe Brands, Tyler ships production software across a five-brand, 200+ location franchise portfolio. He builds Control Tower, Knowledge Fabric, and Estate Trace using Code Puppy (a supervised multi-agent system). He uses human-in-the-loop guardrails, evaluation harnesses, zero-secret OIDC-based automation, and won the President's Innovation Award.",
    topics: [
      "head to toe",
      "control tower",
      "knowledge fabric",
      "estate trace",
      "code puppy",
      "agents",
      "current",
    ],
    source: "Career",
    priority: 10,
  },
  {
    id: "career-htt-identity",
    text: "As IT Director at Head to Toe Brands, Tyler built the identity governance ecosystem — a master database federating across five brands and Microsoft tenants with role-based access tied to location, brand, and job function. Onboarding was reduced from days to minutes. Offboarding is immediate and auditable.",
    topics: [
      "head to toe",
      "identity",
      "governance",
      "entra id",
      "onboarding",
      "offboarding",
      "access",
    ],
    source: "Career",
    priority: 9,
  },

  // ── Skills ──
  {
    id: "skills-ai",
    text: "AI & Agent Systems: multi-agent orchestration, tool/function calling, RAG + knowledge graphs, evaluation harnesses & judge gates, human-in-the-loop approvals, local-first LLMs (Ollama, Whisper), prompt engineering.",
    topics: ["ai", "agents", "rag", "ollama", "orchestration", "llm", "evaluation", "skills"],
    source: "Skills",
    priority: 9,
  },
  {
    id: "skills-languages",
    text: "Languages & Frameworks: Python (FastAPI, Pydantic), TypeScript/Node.js, React, SvelteKit, HTMX, SQL/DAX, PowerShell/Bash.",
    topics: ["python", "typescript", "react", "svelte", "fastapi", "htmx", "languages", "stack"],
    source: "Skills",
    priority: 8,
  },
  {
    id: "skills-cloud",
    text: "Cloud & Identity: Azure (App Service, Functions, Key Vault), AWS (Lambda, ECS Fargate, Athena), Entra ID multi-tenant, Microsoft Graph, OIDC workload identity (zero secrets), Bicep/Terraform.",
    topics: ["azure", "aws", "entra id", "terraform", "oidc", "cloud", "identity", "microsoft"],
    source: "Skills",
    priority: 8,
  },
  {
    id: "skills-data",
    text: "Data & BI: Power BI/Fabric (Direct Lake), Snowflake, PostgreSQL, SQL Server, ETL pipeline design, row-level security.",
    topics: ["power bi", "snowflake", "postgresql", "etl", "data", "bi", "sql"],
    source: "Skills",
    priority: 7,
  },
  {
    id: "skills-quality",
    text: "Quality & Delivery: GitHub Actions CI/CD, Playwright E2E, pytest/Vitest, WCAG 2.2 AA (axe-core), STRIDE threat modeling, FinOps/cost governance.",
    topics: ["testing", "ci/cd", "playwright", "accessibility", "security", "finops", "quality"],
    source: "Skills",
    priority: 8,
  },
  {
    id: "skills-integrations",
    text: "Platform Integrations: Freshdesk, Monday.com, HubSpot, FranConnect, Mindbody/Zenoti, BigCommerce/Shopify, Ramp, GitHub Enterprise.",
    topics: ["integrations", "freshdesk", "hubspot", "shopify", "platforms", "crm"],
    source: "Skills",
    priority: 6,
  },

  // ── Projects: Control Tower ──
  {
    id: "project-ct",
    text: "Control Tower is a multi-tenant governance platform for cost, identity, and compliance across the whole estate. Built with Python/FastAPI + HTMX + PostgreSQL on the Azure SDK. Every release is gated by 7,386 automated tests and a 48/48 automated judge score. v2.5.0 is in production, all five tenants syncing live. Tyler chose server-rendered HTMX over a SPA to keep the attack surface small and auditable.",
    topics: [
      "control tower",
      "governance",
      "fastapi",
      "htmx",
      "postgresql",
      "azure",
      "testing",
      "judge",
    ],
    source: "Work",
    priority: 10,
  },

  // ── Projects: Knowledge Fabric ──
  {
    id: "project-kf",
    text: "Knowledge Fabric is an identity-aware RAG system that provides answers from 100K+ support tickets, scoped to who's asking. Built with a multi-agent ingestion pipeline using SQLite + FTS5 memory and Entra identity as the grounding layer. 1,523 verified humans across a 15-slot attribute schema. Phase 1 closed at 52/52 QA checks. Phase 2 is in build.",
    topics: ["knowledge fabric", "rag", "sqlite", "fts5", "entra", "agents", "support"],
    source: "Work",
    priority: 9,
  },

  // ── Projects: Estate Trace ──
  {
    id: "project-et",
    text: "Estate Trace answers 'what do we run and what does it cost' across 41 repos, 11 subscriptions, and ~196 Azure resources. It uses live read-only pulls against version control, identity, cloud cost management, invoices, and licensing APIs feeding a DuckDB warehouse. 12/12 verification checks gate every refresh. It drives executive financial decisions.",
    topics: ["estate trace", "cost", "duckdb", "azure", "finops", "executive", "resources"],
    source: "Work",
    priority: 9,
  },

  // ── Projects: Zero-secret ──
  {
    id: "project-zs",
    text: "Zero-secret automation provides full lifecycle automation (onboarding, offboarding, leave-of-absence) across five tenants without storing a single credential. Uses GitHub Actions with workload identity federation per tenant, driven from project management and CSV inputs. Every run leaves an audit trail with least-privilege permissions.",
    topics: [
      "zero secret",
      "oidc",
      "github actions",
      "federation",
      "lifecycle",
      "automation",
      "security",
    ],
    source: "Work",
    priority: 9,
  },

  // ── Projects: Mysa Mail ──
  {
    id: "project-mysa",
    text: "Mysa Mail is a local-first AI email agent that asks before it acts. Built with FastAPI + SvelteKit, 5,700+ LOC backend, 5 classifiers, and approval workflows before any destructive write. Uses local Ollama by default with cloud opt-in. WCAG 2.2 AA throughout. Shipped and in daily use.",
    topics: ["mysa mail", "email", "ollama", "sveltekit", "fastapi", "local", "ai", "personal"],
    source: "Work",
    priority: 7,
  },

  // ── Projects: TenantFleet Ecosystem ──
  {
    id: "project-eco",
    text: "The TenantFleet Ecosystem is seven open-source repositories for multi-tenant Microsoft Entra ID governance. Built for MSPs, PE firms, and multi-brand portfolios. All MIT-licensed and deployable to GitHub Pages. The seven repos are: TenantFleet (root framework), HubForge (SWA templates), EntraGroups (group lifecycle), TenantForge (Terraform provisioning), DNSGuard (domain security), RampGuard (finance compliance), and SharePointAgent (document indexing).",
    topics: ["tenantfleet", "ecosystem", "open source", "mit", "entra id", "governance", "repos"],
    source: "Work/Ecosystem",
    priority: 9,
  },

  // ── Ventures ──
  {
    id: "venture-spruce",
    text: "Spruce Grove Media was a creative production studio Tyler founded and ran. He handled producing, post-editing, sound design, and color grading. In collaboration with Benton Drones, he produced first-person-view single-take films of local businesses and towns. He also cut weddings, events, and local shops.",
    topics: ["spruce grove", "media", "video", "production", "fpv", "drone", "creative"],
    source: "Ventures",
    priority: 6,
  },
  {
    id: "venture-space-goose",
    text: "For Bentonville Brewing Company's 'Space Goose' release, Tyler wrote, animated, and scored a short cartoon film — a product release told as a cartoon. It was just for the fun of it, but it shows how good creative doesn't always need a drone or a deadline.",
    topics: ["bentonville brewing", "space goose", "animation", "cartoon", "film", "creative"],
    source: "Ventures",
    priority: 6,
  },
  {
    id: "venture-zipline",
    text: "Benton Drones and Tyler were brought in with Zipline to capture survey data for the Walmart drone-delivery pilot. Tyler worked as a data-capture analyst, running rigs that recorded LiDAR, infrared, and high-resolution camera data, then validating datasets for Zipline's V2 delivery platform.",
    topics: ["zipline", "walmart", "drone", "lidar", "infrared", "data capture", "pilot"],
    source: "Ventures",
    priority: 7,
  },

  // ── Code Puppy ──
  {
    id: "code-puppy",
    text: "Code Puppy is the supervised multi-agent system Tyler uses to build production software. It won the President's Innovation Award at Head to Toe Brands. The system uses planner, programmer, code-reviewer, and security-auditor agents with human-in-the-loop approvals before any destructive write. Every release is gated by automated tests and judge scores.",
    topics: ["code puppy", "agent", "ai", "multi-agent", "award", "innovation", "how he builds"],
    source: "Work",
    priority: 9,
  },

  // ── Education & Certifications (implied) ──
  {
    id: "edu-implied",
    text: "Tyler's background includes Apple Retail training operations, franchise IT at scale, Adobe Commerce advocacy, PE-backed multi-brand governance, and multi-agent AI systems engineering. His learning has been primarily experiential — building real systems that serve real users.",
    topics: ["education", "background", "training", "learning", "experience"],
    source: "About",
    priority: 5,
  },

  // ── Greetings / fallback context ──
  {
    id: "greeting-help",
    text: "Tyler is happy to answer questions about his work, background, skills, projects, or potential collaborations. For anything else, or to discuss a specific role, you can reach him at hello@tylergranlund.com.",
    topics: ["help", "hello", "hi", "hey", "what can you do", "who are you"],
    source: "Meta",
    priority: 10,
  },
  {
    id: "greeting-role",
    text: "Tyler is currently an IT Operations & Systems Engineer at Head to Toe Brands (Riverside PE). He is open to full-time roles, consulting, and collaborations in IT leadership, systems engineering, AI/ML engineering, or forward-deployed engineering.",
    topics: ["job", "hiring", "role", "position", "looking", "available", "open to work"],
    source: "Meta",
    priority: 10,
  },
  {
    id: "greeting-interview",
    text: "If you're a recruiter or hiring manager, Tyler has tailored resume variants for AI PM and FDE positions, plus a master resume. You can view and download them at tylergranlund.com/resume. His preferred contact is hello@tylergranlund.com.",
    topics: ["recruiter", "hiring manager", "interview", "resume", "cv", "opportunity"],
    source: "Meta",
    priority: 10,
  },
];

// Topic synonyms for better matching
export const topicSynonyms: Record<string, string[]> = {
  bio: ["tyler", "who", "about", "person", "himself", "background"],
  name: ["tyler", "granlund", "who is"],
  role: ["job", "work", "position", "title", "what does he do"],
  contact: ["email", "reach", "message", "get in touch", "talk", "connect"],
  hiring: ["hire", "job", "role", "position", "available", "open", "opportunity", "recruiting"],
  apple: ["apple", "genius", "retail", "mac", "iphone"],
  "school of rock": ["school of rock", "sor", "music", "franchise", "okta"],
  "outdoor cap": ["outdoor cap", "compass", "b2b", "wholesale", "magento"],
  "head to toe": [
    "head to toe",
    "riverside",
    "lash lounge",
    "bishops",
    "frenchies",
    "delta crown",
    "current",
    "pe",
  ],
  ai: ["ai", "artificial intelligence", "machine learning", "ml", "llm", "agent", "agents"],
  rag: ["rag", "retrieval", "knowledge", "fabric"],
  ollama: ["ollama", "local", "local-first", "local llm"],
  python: ["python", "fastapi", "pydantic"],
  typescript: ["typescript", "ts", "javascript", "js"],
  react: ["react", "frontend", "front-end", "ui"],
  azure: ["azure", "microsoft", "cloud", "entra", "graph"],
  aws: ["aws", "amazon", "lambda", "ecs"],
  terraform: ["terraform", "infrastructure", "iac", "bicep"],
  "control tower": ["control tower", "governance", "dashboard", "platform"],
  "estate trace": ["estate trace", "cost", "finops", "resources", "duckdb"],
  "code puppy": ["code puppy", "agent system", "multi-agent", "how he builds"],
  tenantfleet: [
    "tenantfleet",
    "ecosystem",
    "repos",
    "github",
    "open source",
    "mit",
    "multi-tenant",
  ],
  "zero secret": ["zero secret", "oidc", "federation", "secrets", "credential"],
  mysa: ["mysa", "mail", "email", "personal project"],
  skills: ["skills", "tech stack", "technologies", "tools", "capabilities", "what does he know"],
  ventures: ["spruce grove", "media", "video", "drone", "creative"],
  resume: ["resume", "cv", "download", "pdf"],
  location: ["where", "based", "arkansas", "bella vista", "remote"],
};
