// Writing index — post metadata only (no JSX), so it can be imported by the
// index route, each post route's <head>, and the sitemap server route alike.
// One static route file per post lives in src/routes/writing.<slug>.tsx.

export interface PostMeta {
  slug: string;
  title: string;
  description: string;
  /** Human-readable date for display. */
  date: string;
  /** ISO date for <time> + JSON-LD datePublished. */
  dateISO: string;
  readingMinutes: number;
  tags: string[];
}

export const posts: PostMeta[] = [
  {
    slug: "running-it-for-200-locations-with-ai-agents",
    title: "Running IT for 200+ locations with supervised AI agents",
    description:
      "How a lean team ran enterprise IT across five brands and 200+ locations by building production systems with supervised AI agents — and the discipline that kept it safe.",
    date: "June 2026",
    dateISO: "2026-06-15",
    readingMinutes: 6,
    tags: ["AI Agents", "Franchise IT", "Identity Governance", "FinOps"],
  },
];

export const WRITING_BASE_URL = "https://tylergranlund.com/writing";

export function postBySlug(slug: string): PostMeta | undefined {
  return posts.find((p) => p.slug === slug);
}
