import type { KnowledgeChunk } from "../knowledge";
import { CAREER_DATES } from "@/lib/career-data";

export const careerChunks: KnowledgeChunk[] = [
  {
    id: "career-apple",
    text:
      "At Apple (" +
      CAREER_DATES.apple +
      "), Tyler was Lead South Chicago Market Technical Facilitator. He led Mac and Mobile technician training and ran Genius Bar operations. He built and taught a one-week promoted-staff course covering troubleshooting theory, Apple facilitation practices, and Genius Bar operations. He mentored internal promotions and external hires alike. Learned the 1-to-many support philosophy that still drives how he builds: teach the room, not just the person.",
    topics: ["apple", "genius bar", "training", "retail", "mac", "mobile", "early career"],
    source: "Career",
    priority: 7,
  },
  {
    id: "career-sor",
    text:
      "At School of Rock (" +
      CAREER_DATES.schoolOfRock +
      "), Tyler was IT Manager to Senior IT Manager. He joined at ~145 locations in 8 countries and left at ~300+ locations across 14 countries. He was the primary IT support pillar for every master franchise rollout across LATAM, Europe, APAC, and Africa. For each new market he analyzed requirements, adapted systems, built what did not exist yet, and trained owners and managers.",
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
    text: "At School of Rock: Built merchant-processing integrations through NMI transnational gateways to Pike 13, with revenue tracking leadership could trust. Rolled out global SSO and Google Workspace governance across 300+ schools via Okta. Stood up privacy and compliance for new markets: GDPR for Ireland and Iberia launches, plus COPPA/FERPA posture. Built the Summerfest All-Stars video pipeline with nine regional GoPro kits and capture-to-judging FTP workflow.",
    topics: [
      "school of rock",
      "okta",
      "sso",
      "nmi",
      "pike 13",
      "gdpr",
      "compliance",
      "video",
      "franchise",
    ],
    source: "Career",
    priority: 8,
  },
  {
    id: "career-sor-operations",
    text: "At School of Rock, Tyler ran IT for both corporate-owned and franchised schools, domestic and international. He operated the help desk for 50+ corporate-owned locations (25+ of them inherited in a single year) alongside the franchise network and corporate offices. He led physical infrastructure rollouts including security-camera systems, Wi-Fi upgrades, and iPad fleets for corporate schools, plus corporate-office hardware and printer support. When COVID closed locations, he led the rapid conversion of in-person music lessons to fully remote instruction, built an online make-up-lesson booking system for students and parents, and turned the monthly in-person owner, manager, and admin training into on-demand video modules with quizzes.",
    topics: [
      "school of rock",
      "help desk",
      "corporate",
      "franchise",
      "wifi",
      "security cameras",
      "ipad",
      "remote",
      "covid",
      "training",
      "makeup booking",
      "infrastructure",
    ],
    source: "Career",
    priority: 7,
  },
  {
    id: "career-sor-locations",
    text: "School of Rock expansion cities Tyler supported: Glen Ellyn, Milwaukee, São Paulo, Rio de Janeiro, Santiago, Lima, Asunción, Madrid, Lisbon, Blackrock (Ireland), Taichung, Sydney, Perth, Cape Town.",
    topics: ["school of rock", "cities", "locations", "global", "expansion"],
    source: "Career",
    priority: 6,
  },
  {
    id: "career-outdoor",
    text:
      "At Outdoor Cap Company (" +
      CAREER_DATES.outdoorCap +
      "), Tyler was IT Product Manager I to II for Digital Experience. He built the Compass B2B wholesale online ordering platform — the company's largest technical undertaking. Coordinated with global supply chain across factories in Bangladesh, China, Vietnam, and Sri Lanka, with warehouses in Bentonville AR, Rancho Cucamonga CA, Dallas TX, and Zanesville OH.",
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
    text: "At Outdoor Cap, Tyler integrated Magento/Adobe Commerce with ERP, 3D product customization, and account dashboards. He was Adobe Commerce's first-ever customer advocate, sharing the framework and full agile SDLC lifecycle best practices with a global audience. The presentation lives in Adobe's Experience Center as a reference recording. He replaced a manual, rep-mediated ordering process with guided self-service built around how dealers actually order.",
    topics: ["outdoor cap", "adobe commerce", "magento", "erp", "3d", "customer advocate", "b2b"],
    source: "Career",
    priority: 7,
  },
  {
    id: "career-north40",
    text:
      "At North 40 Outfitters / Smith & Rogue (" +
      CAREER_DATES.north40 +
      "), Tyler was E-Commerce Operations Lead. He owned e-commerce operations for North 40, Smith & Rogue, and sibling brands. He brought the storefront in-house by migrating 14 brick-and-mortar stores from a legacy managed backend to Adobe Commerce Cloud. He unraveled the gatekeeping mess of their existing web development contractor and helped the team own their own business decisions, architecture, and integrations. He moved them from Nexcess/Liquid Web hosting to a multi-year six-figure Adobe Commerce Cloud contract — they owned the backend and architecture, and managed hosting became cheaper and easier to run. He managed hundreds of thousands of SKUs with weapons and state-specific compliance nuance.",
    topics: [
      "north 40",
      "smith rogue",
      "adobe commerce",
      "e-commerce",
      "retail",
      "migration",
      "agency",
    ],
    source: "Career",
    priority: 7,
  },
  {
    id: "career-htt-director",
    text:
      "At Head to Toe Brands (Riverside PE), Tyler was IT Director from " +
      CAREER_DATES.httDirector +
      ". He led enterprise IT for a Riverside private equity-backed multi-brand franchise group. The portfolio included The Lash Lounge (~130 units), Bishops Cuts and Color (~40 units), Frenchies Modern Nail Care (24 units), and Delta Crown Hair Extensions — 200+ locations total. He built the identity governance ecosystem: a master database federating across five brands and Microsoft tenants with role-based access tied to location, brand, and job function. He developed the onboarding framework that cut provisioning from days to minutes, with immediate and auditable offboarding. He left before full portfolio-wide rollout and is open-sourcing the framework so other franchise operators can benefit.",
    topics: [
      "head to toe",
      "riverside",
      "pe",
      "it director",
      "lash lounge",
      "bishops",
      "frenchies",
      "delta crown",
      "identity",
    ],
    source: "Career",
    priority: 10,
  },
  {
    id: "career-htt-ops",
    text:
      "At Head to Toe Brands, Tyler also served as IT Operations & Systems Engineer (" +
      CAREER_DATES.httOps +
      "). He developed production software across a five-brand, 200+ location franchise portfolio. He built Control Tower, Knowledge Fabric, and Estate Trace using Code Puppy (a supervised multi-agent system). He used human-in-the-loop guardrails, evaluation harnesses, and zero-secret OIDC-based automation. He left before full portfolio-wide deployment; the architecture and guardrails are being open-sourced for the community. Code Puppy is an open-source agent system created by Michael Pfaffenberger and John Choi; it won Walmart's President's Innovation Award and is used by 4,000+ Walmart employees daily.",
    topics: [
      "head to toe",
      "control tower",
      "knowledge fabric",
      "estate trace",
      "code puppy",
      "agents",
      "award",
    ],
    source: "Career",
    priority: 10,
  },
  {
    id: "career-htt-identity",
    text: "At Head to Toe Brands, Tyler built the identity governance ecosystem — a master database federating identities across five brands and five Microsoft Entra ID tenants. Access was governed by location, brand, and job function with role-based permissions. He developed the onboarding framework that went from days to minutes, with immediate and fully auditable offboarding. He left before full portfolio-wide rollout and is open-sourcing the framework so other franchise operators can benefit. This was a zero-trust security and access governance rollout.",
    topics: [
      "head to toe",
      "identity",
      "governance",
      "entra id",
      "onboarding",
      "offboarding",
      "access",
      "zero trust",
    ],
    source: "Career",
    priority: 9,
  },
  {
    id: "career-htt-support",
    text: "At Head to Toe Brands, Tyler built the support center and cut resolution time by ~40%. He stood up the entire IT support infrastructure for a 200+ location franchise portfolio, creating the processes and systems that enabled faster, more consistent support across all five brands.",
    topics: ["head to toe", "support", "help desk", "resolution", "freshdesk", "service desk"],
    source: "Career",
    priority: 8,
  },
];
