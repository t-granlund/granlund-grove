// Knowledge base for the portfolio chatbot
// Split by domain for cohesion and the 600-line guideline.

import { bioContactChunks } from "./knowledge/bio-contact";
import { careerChunks } from "./knowledge/career";
import { skillsChunks } from "./knowledge/skills";
import { projectChunks } from "./knowledge/projects";

export interface KnowledgeChunk {
  id: string;
  text: string;
  topics: string[];
  source: string;
  priority: number; // 1-10, higher = more important
}

export const knowledgeBase: KnowledgeChunk[] = [
  ...bioContactChunks,
  ...careerChunks,
  ...skillsChunks,
  ...projectChunks,
];

// Topic synonyms for better matching
export const topicSynonyms: Record<string, string[]> = {
  bio: ["tyler", "who", "about", "person", "himself", "background", "granlund"],
  name: ["tyler", "granlund", "who is"],
  role: ["job", "work", "position", "title", "what does he do", "engineer"],
  contact: ["email", "reach", "message", "get in touch", "talk", "connect", "hello"],
  hiring: [
    "hire",
    "job",
    "role",
    "position",
    "available",
    "open",
    "opportunity",
    "recruiting",
    "employment",
    "work",
    "looking",
    "status",
  ],
  apple: ["apple", "genius", "retail", "mac", "iphone", "training"],
  "school of rock": ["school of rock", "sor", "music", "franchise", "okta", "pike 13", "nmi"],
  "outdoor cap": ["outdoor cap", "compass", "b2b", "wholesale", "magento", "adobe commerce"],
  "head to toe": [
    "head to toe",
    "riverside",
    "lash lounge",
    "bishops",
    "frenchies",
    "delta crown",
    "current",
    "pe",
    "last job",
    "previous",
    "former",
  ],
  "north 40": [
    "north 40",
    "smith rogue",
    "smith and rogue",
    "retail",
    "adobe commerce",
    "migration",
  ],
  ai: [
    "ai",
    "artificial intelligence",
    "machine learning",
    "ml",
    "llm",
    "agent",
    "agents",
    "model",
  ],
  rag: ["rag", "retrieval", "knowledge", "fabric", "vector", "embedding"],
  ollama: ["ollama", "local", "local-first", "local llm", "self hosted"],
  python: ["python", "fastapi", "pydantic", "sqlalchemy", "django", "flask"],
  typescript: ["typescript", "ts", "javascript", "js", "node", "nodejs"],
  react: ["react", "frontend", "front-end", "ui", "component", "jsx"],
  svelte: ["svelte", "sveltekit", "kit"],
  htmx: ["htmx", "hypertext", "server rendered", "spa", "htmx"],
  azure: ["azure", "microsoft", "cloud", "entra", "graph", "app service", "functions"],
  aws: ["aws", "amazon", "lambda", "ecs", "fargate", "athena", "s3"],
  terraform: ["terraform", "infrastructure", "iac", "bicep", "infrastructure as code"],
  "control tower": ["control tower", "governance", "dashboard", "platform", "tenant"],
  "estate trace": ["estate trace", "cost", "finops", "resources", "duckdb", "cost management"],
  "code puppy": ["code puppy", "agent system", "multi-agent", "how he builds", "puppy"],
  tenantfleet: [
    "tenantfleet",
    "ecosystem",
    "repos",
    "github",
    "open source",
    "mit",
    "multi-tenant",
    "hubforge",
    "entragroups",
    "tenantforge",
    "dnsguard",
    "rampguard",
    "sharepointagent",
  ],
  "zero secret": [
    "zero secret",
    "oidc",
    "federation",
    "secrets",
    "credential",
    "workload identity",
  ],
  mysa: ["mysa", "mail", "email", "personal project", "mysa mail"],
  skills: [
    "skills",
    "tech stack",
    "technologies",
    "tools",
    "capabilities",
    "what does he know",
    "expertise",
  ],
  ventures: ["spruce grove", "media", "video", "drone", "creative", "bentonville brewing"],
  resume: ["resume", "cv", "download", "pdf", "document"],
  location: ["where", "based", "arkansas", "bella vista", "remote", "travel"],
  email: ["email", "hello", "contact", "reach", "message", "mail"],
  linkedin: ["linkedin", "social", "profile", "connect"],
  github: ["github", "code", "repository", "repo", "source"],
  security: ["security", "zero trust", "stride", "threat", "compliance", "gdpr", "coppa", "ferpa"],
  testing: ["test", "testing", "pytest", "vitest", "playwright", "e2e", "unit test"],
  accessibility: ["accessibility", "a11y", "wcag", "axe", "screen reader", "keyboard"],
  database: ["database", "postgres", "postgresql", "sql server", "sqlite", "duckdb", "snowflake"],
  devops: ["devops", "cicd", "ci cd", "github actions", "pipeline", "deployment"],
  identity: ["identity", "entra id", "azure ad", "sso", "okta", "rbac", "access"],
  "e-commerce": [
    "e-commerce",
    "ecommerce",
    "magento",
    "adobe commerce",
    "bigcommerce",
    "shopify",
    "b2b",
    "b2c",
  ],
  franchise: ["franchise", "franchising", "franconnect", "master franchise", "multi-location"],
  support: ["support", "help desk", "freshdesk", "service desk", "ticket", "resolution"],
  data: ["data", "bi", "analytics", "etl", "warehouse", "reporting", "power bi"],
  cost: ["cost", "finops", "budget", "spend", "optimization", "governance"],
  automation: ["automation", "automate", "workflow", "script", "batch", "cron"],
};
