import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://tylergranlund.com";
// Build-time constant. Using `new Date()` per request makes <lastmod> change on
// every crawl — a misleading freshness signal. Bump this when content changes.
const LAST_MODIFIED = "2026-06-17";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const pages = [
          { path: "/", changefreq: "weekly", priority: "1.0" },
          { path: "/about", changefreq: "monthly", priority: "0.8" },
          { path: "/career", changefreq: "monthly", priority: "0.8" },
          { path: "/work", changefreq: "monthly", priority: "0.9" },
          { path: "/ventures", changefreq: "monthly", priority: "0.8" },
          { path: "/resume", changefreq: "monthly", priority: "0.7" },
          { path: "/contact", changefreq: "yearly", priority: "0.6" },
          { path: "/privacy", changefreq: "yearly", priority: "0.3" },
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .map(
    (p) => `  <url>
    <loc>${BASE_URL}${p.path}</loc>
    <lastmod>${LAST_MODIFIED}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;
        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
