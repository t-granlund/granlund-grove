import * as THREE from "three";

export interface SourceLink {
  label: string;
  url: string;
}

export interface LocationData {
  name: string;
  lat: number;
  lng: number;
  type: "root" | "hub" | "intl";
  brand: string;
  role: string;
  years: string;
  contribution: string;
  sources: SourceLink[];
}

export const LOCATIONS: LocationData[] = [
  {
    name: "Chicago",
    lat: 41.8781,
    lng: -87.6298,
    type: "root",
    brand: "Apple",
    role: "Lead South Chicago Market Technical Facilitator",
    years: "2009–2015",
    contribution:
      "Led the South Chicago market for Mac and Mobile technician trainings. Built the one-week " +
      "promoted-staff course: troubleshooting theory, Apple facilitation practices, and Genius Bar " +
      "operations. Supported and mentored the next generation of employees. Internal promotions " +
      "and external hires. Recruited by School of Rock.",
    sources: [
      {
        label: "Apple Retail",
        url: "https://www.apple.com/retail/",
      },
    ],
  },
  {
    name: "Glen Ellyn",
    lat: 41.8775,
    lng: -88.067,
    type: "hub",
    brand: "School of Rock",
    role: "IT Operations & Systems Architect",
    years: "2015–2021",
    contribution:
      "Corporate IT hub and the primary IT support pillar for all international markets. " +
      "Analyzed, understood, adapted, modified, implemented, and built anything the systems needed " +
      "to run our standard ways of working across 300+ locations in 14 countries. " +
      "This included integrating custom local solutions for scheduling, invoicing, and payment processing. " +
      "Championed everything possible while navigating merchant processing limitations, data privacy laws, " +
      "and regional banking requirements. Built the bridge between Pike 13 (business management), Okta " +
      "(identity), Google Workspace, and NMI transnational merchant gateways.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Milwaukee",
    lat: 43.0389,
    lng: -87.9065,
    type: "hub",
    brand: "School of Rock",
    role: "All-Stars Festival & Media Producer",
    years: "2015–2021",
    contribution:
      "Summerfest in Milwaukee — the annual All-Stars festival. Built the GoPro kit program: one kit " +
      "per region (9 kits total), each containing a GoPro camera and accessories. Regional managers " +
      "recorded all student auditions, shipped memory cards back, and I organized the FTP mass upload " +
      "for judges to review. Complete video pipeline from capture to judging.",
    sources: [
      {
        label: "School of Rock All-Stars",
        url: "https://www.schoolofrock.com/allstars",
      },
      {
        label: "Summerfest",
        url: "https://summerfest.com",
      },
    ],
  },
  {
    name: "Bentonville",
    lat: 36.3729,
    lng: -94.2088,
    type: "hub",
    brand: "Outdoor Cap",
    role: "B2B E-Commerce Product Manager",
    years: "2021–2023",
    contribution:
      "Built the Compass B2B wholesale online ordering platform. The company's biggest technical undertaking. " +
      "Coordinated with global supply chain: factories in Bangladesh, China, Vietnam, and Sri Lanka. " +
      "Warehouses in Bentonville AR, Rancho Cucamonga CA, Dallas TX, and Zanesville OH. Integrated " +
      "Magento / Adobe Commerce with ERP and 3D product customization. First-ever Adobe Commerce customer advocate, sharing agile SDLC best practices globally.",
    sources: [
      {
        label: "Outdoor Cap Company",
        url: "https://www.outdoorcap.com",
      },
      {
        label: "Compass Ordering Tool",
        url: "https://www.outdoorcap.com/blog/new-online-ordering-experience-compass-revolutionizes-ordering/?page=home",
      },
    ],
  },

  {
    name: "Dallas",
    lat: 32.7767,
    lng: -96.797,
    type: "hub",
    brand: "Outdoor Cap",
    role: "Warehouse & Logistics Operations",
    years: "2021–2023",
    contribution:
      "One of four U.S. distribution centers (Bentonville AR, Rancho Cucamonga CA, Dallas TX, " +
      "Zanesville OH). Coordinated warehouse logistics integration into the Compass B2B ordering " +
      "platform, enabling 1-2 day peak shipping for Southwest and Southeast regions.",
    sources: [
      {
        label: "Outdoor Cap Locations",
        url: "https://www.outdoorcap.com/locations",
      },
    ],
  },
  {
    name: "Rancho Cucamonga",
    lat: 34.1064,
    lng: -117.5931,
    type: "hub",
    brand: "Outdoor Cap",
    role: "Warehouse & Logistics Operations",
    years: "2021–2023",
    contribution:
      "West Coast distribution center serving California and the Pacific region. Part of the four-warehouse " +
      "network (Bentonville AR, Rancho Cucamonga CA, Dallas TX, Zanesville OH) integrated into the " +
      "Compass B2B ordering platform for real-time inventory and fulfillment.",
    sources: [
      {
        label: "Outdoor Cap Locations",
        url: "https://www.outdoorcap.com/locations",
      },
    ],
  },
  {
    name: "Zanesville",
    lat: 39.9403,
    lng: -82.0132,
    type: "hub",
    brand: "Outdoor Cap",
    role: "Warehouse & Logistics Operations",
    years: "2021–2023",
    contribution:
      "Midwest distribution center serving Ohio and the surrounding region. Part of the four-warehouse " +
      "network (Bentonville AR, Rancho Cucamonga CA, Dallas TX, Zanesville OH) integrated into the " +
      "Compass B2B ordering platform for real-time inventory and fulfillment.",
    sources: [
      {
        label: "Outdoor Cap Locations",
        url: "https://www.outdoorcap.com/locations",
      },
    ],
  },
  {
    name: "São Paulo",
    lat: -23.5505,
    lng: -46.6333,
    type: "intl",
    brand: "School of Rock",
    role: "LATAM Systems & Payment Integration Lead",
    years: "2017–2021",
    contribution:
      "Primary IT support pillar for the largest LATAM market. Worked directly with local teams to " +
      "analyze requirements and build what the systems needed to operate: identity, scheduling, " +
      "invoicing, and payment processing. " +
      "Championed merchant processing integration that did not previously exist — connected local " +
      "banks to NMI transnational merchant gateways, bridged Pike 13 (business management) to local " +
      "payment rails, and built revenue tracking so master franchise leadership had confidence in " +
      "all calculations and reporting.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Rio de Janeiro",
    lat: -22.9068,
    lng: -43.1729,
    type: "intl",
    brand: "School of Rock",
    role: "LATAM Systems & Payment Integration Support",
    years: "2017–2021",
    contribution:
      "Primary IT support for the Rio market. Analyzed local operational requirements, adapted " +
      "systems for Brazilian payment regulations, and built custom integrations for scheduling and " +
      "invoicing. Navigated data privacy constraints while connecting local merchant processing " +
      "to NMI gateways and Pike 13 for unified revenue reporting.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Santiago",
    lat: -33.4489,
    lng: -70.6693,
    type: "intl",
    brand: "School of Rock",
    role: "LATAM Systems & Payment Integration Lead",
    years: "2018–2021",
    contribution:
      "Primary IT support pillar for Chile. Analyzed local banking and regulatory requirements, " +
      "then built the custom integrations needed: merchant processing through NMI transnational " +
      "gateways connected to Pike 13, localized scheduling, and invoicing tools. Championed " +
      "solutions within local data privacy constraints while ensuring master franchise leadership " +
      "had accurate revenue tracking and reporting.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Lima",
    lat: -12.0464,
    lng: -77.0428,
    type: "intl",
    brand: "School of Rock",
    role: "LATAM Systems & Payment Integration Lead",
    years: "2018–2021",
    contribution:
      "Primary IT support pillar for Peru. Analyzed what the market needed to operate our standard " +
      "ways of working, then adapted and built the systems: Pike 13 integration, Okta identity " +
      "federation, Google Workspace governance, and NMI merchant gateway connections. Worked with " +
      "local banks to establish payment processing that did not previously exist, enabling revenue " +
      "tracking and reporting for master franchise leadership.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Asunción",
    lat: -25.2637,
    lng: -57.5759,
    type: "intl",
    brand: "School of Rock",
    role: "LATAM Systems & Payment Integration Lead",
    years: "2019–2021",
    contribution:
      "Primary IT support pillar for Paraguay. Built the full technology stack from requirements " +
      "analysis through implementation: merchant processing via NMI gateways connected to Pike 13, " +
      "identity and access management, custom scheduling and invoicing integrations. Navigated local " +
      "banking and data privacy constraints to create payment tracking that gave master franchise " +
      "leadership confidence in revenue reporting.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Madrid",
    lat: 40.4168,
    lng: -3.7038,
    type: "intl",
    brand: "School of Rock",
    role: "Europe Systems & Data Compliance Lead",
    years: "2019–2021",
    contribution:
      "Primary IT support pillar for the Spanish market expansion. Analyzed GDPR and local data " +
      "privacy requirements, then built compliant identity systems, data residency controls, and " +
      "cross-border data handling. Integrated Pike 13 with European payment rails through NMI gateways, " +
      "created localized scheduling and invoicing solutions, and ensured revenue tracking met " +
      "master franchise reporting standards.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Lisbon",
    lat: 38.7223,
    lng: -9.1393,
    type: "intl",
    brand: "School of Rock",
    role: "Europe Systems & Data Compliance Lead",
    years: "2019–2021",
    contribution:
      "Primary IT support pillar for Portugal. Analyzed local operational and regulatory requirements, " +
      "then built compliant systems: GDPR-aligned identity and data handling, merchant processing " +
      "through NMI gateways integrated with Pike 13, custom scheduling, and invoicing tools. " +
      "Enabled payment tracking and revenue reporting that gave master franchise leadership full visibility.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Blackrock",
    lat: 53.3014,
    lng: -6.1783,
    type: "intl",
    brand: "School of Rock",
    role: "Europe GDPR & Systems Lead",
    years: "2020–2021",
    contribution:
      "Ireland launch — our first GDPR-zone entry. As the primary IT support pillar, architected " +
      "data compliance and security from the ground up: GDPR-compliant identity systems, data residency, " +
      "and cross-border data handling. Built merchant processing integrations connecting local banks " +
      "to NMI gateways and Pike 13, with full revenue tracking and reporting for master franchise " +
      "leadership.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Taichung",
    lat: 24.1477,
    lng: 120.6736,
    type: "intl",
    brand: "School of Rock",
    role: "APAC Systems & Payment Integration Lead",
    years: "2019–2021",
    contribution:
      "Primary IT support pillar for the APAC master franchise. Analyzed what Taiwan needed to run " +
      "our standard operations, then built the entire technology foundation: identity federation, " +
      "merchant processing through NMI gateways connected to Pike 13, custom scheduling and invoicing, " +
      "and training programs. Navigated local banking and data privacy constraints to create payment " +
      "tracking that gave master franchise leadership confidence in revenue reporting.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Sydney",
    lat: -33.8688,
    lng: 151.2093,
    type: "intl",
    brand: "School of Rock",
    role: "APAC Systems & Payment Integration Lead",
    years: "2020–2021",
    contribution:
      "Primary IT support pillar for New South Wales. Worked directly with Australian franchisees to " +
      "analyze local requirements and build what the systems needed: Pike 13 integration, merchant " +
      "processing through NMI gateways, localized scheduling and invoicing, and identity management. " +
      "Adapted solutions for Australian banking regulations and data privacy requirements while " +
      "maintaining unified revenue reporting.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Perth",
    lat: -31.9505,
    lng: 115.8605,
    type: "intl",
    brand: "School of Rock",
    role: "APAC Systems & Payment Integration Lead",
    years: "2020–2021",
    contribution:
      "Primary IT support pillar for Western Australia. Analyzed local operational requirements and " +
      "built the full systems stack: Pike 13 integration, NMI merchant gateway connections, custom " +
      "scheduling and invoicing tools, and identity management. Extended the APAC support network " +
      "to the Australian west coast with payment tracking and revenue reporting that met master " +
      "franchise standards.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Cape Town",
    lat: -33.9249,
    lng: 18.4241,
    type: "intl",
    brand: "School of Rock",
    role: "Africa Systems & Payment Integration Lead",
    years: "2020–2021",
    contribution:
      "Primary IT support pillar for the South African market. Analyzed local banking and regulatory " +
      "requirements, then built the systems from the ground up: merchant processing through NMI " +
      "gateways connected to Pike 13, international invoicing, identity and access management, " +
      "and custom scheduling tools. Created the master franchisee packet and trained the local team " +
      "on all technology and operations.",
    sources: [
      {
        label: "School of Rock",
        url: "https://www.schoolofrock.com",
      },
    ],
  },
  {
    name: "Great Falls",
    lat: 47.5053,
    lng: -111.3008,
    type: "hub",
    brand: "North 40 / Smith & Rogue",
    role: "E-Commerce Operations Lead",
    years: "2023–2024",
    contribution:
      "North 40 Outfitters headquarters in Great Falls, Montana, with retail locations across Montana, " +
      "Idaho, and Washington. Ran all e-commerce operations for North 40, Smith & Rogue, and sibling " +
      "brands. Migrated from legacy manual backend to Adobe Commerce Cloud and broke away from agency " +
      "dependency.",
    sources: [
      {
        label: "North 40 Outfitters",
        url: "https://www.north40.com",
      },
      {
        label: "Adobe Commerce Webinar",
        url: "https://experienceleague.adobe.com/en/docs/events/learn-from-your-peers-recordings/commerce/2024/agile-sdlc",
      },
    ],
  },
  {
    name: "Glen Arbor",
    lat: 44.8714,
    lng: -85.989,
    type: "hub",
    brand: "Head to Toe Brands",
    role: "Product & E-Commerce Director",
    years: "2024–2026",
    contribution:
      "Headquarters in Glen Arbor, Michigan. Built the identity governance ecosystem. A master database for user identities across five brands and Microsoft tenants. Clear end-to-end onboarding and offboarding lifecycle with the least friction: access resources based on location, brand affiliation, and role. Also built Control Tower, Knowledge Fabric, and Estate Trace systems using Code Puppy. Code Puppy won Walmart's President's Innovation Award.",
    sources: [
      {
        label: "Head to Toe Brands",
        url: "https://www.headtotoebrands.com",
      },
    ],
  },
  {
    name: "South Lake",
    lat: 32.9412,
    lng: -97.1331,
    type: "hub",
    brand: "Head to Toe Brands",
    role: "Training & Operations Facility",
    years: "2024–2026",
    contribution:
      "Main training facility for Head to Toe Brands in South Lake, Texas. All field operations, franchisee onboarding, and systems training ran through this facility. Connected to Dallas-based private equity leadership and Glen Arbor headquarters.",
    sources: [
      {
        label: "Head to Toe Brands",
        url: "https://www.headtotoebrands.com",
      },
    ],
  },
];

export const ARCS: [number, number][] = [
  [0, 1], // Chicago → Glen Ellyn
  [1, 2], // Glen Ellyn → Milwaukee (Summerfest)
  [1, 7], // Glen Ellyn → São Paulo
  [1, 9], // Glen Ellyn → Santiago
  [1, 10], // Glen Ellyn → Lima
  [1, 11], // Glen Ellyn → Asunción
  [1, 14], // Glen Ellyn → Blackrock (Ireland)
  [1, 15], // Glen Ellyn → Taichung
  [1, 16], // Glen Ellyn → Sydney
  [1, 17], // Glen Ellyn → Perth
  [1, 18], // Glen Ellyn → Cape Town
  [7, 12], // São Paulo → Madrid
  [7, 13], // São Paulo → Lisbon
  [3, 4], // Bentonville → Dallas
  [3, 5], // Bentonville → Rancho Cucamonga
  [3, 6], // Bentonville → Zanesville
  [3, 19], // Bentonville → Great Falls
  [3, 20], // Bentonville → Glen Arbor
  [20, 21], // Glen Arbor → South Lake
];

export const CEDAR = new THREE.Color("#c49a6c");
export const ROOT_COLOR = new THREE.Color("#e8d5c0");
export const HUB_COLOR = new THREE.Color("#c49a6c");
export const INTL_COLOR = new THREE.Color("#8a6a4b");

export const TYPE_COLORS = { root: ROOT_COLOR, hub: HUB_COLOR, intl: INTL_COLOR };
export const TYPE_LABELS = { root: "Root", hub: "Hub", intl: "International" };
