import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Projects, caseStudies } from "@/components/site/Projects";
import { EcosystemShowcase } from "@/components/site/EcosystemShowcase";
import { CodePuppy, Passions } from "@/components/site/WorkExtras";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Tyler Granlund" },
      {
        name: "description",
        content:
          "Tyler Granlund's work — flagship case studies plus the open-source TenantFleet ecosystem (7 repos for multi-tenant Entra ID governance), all built with supervised AI agents.",
      },
      { property: "og:title", content: "Work — Tyler Granlund" },
      {
        property: "og:description",
        content:
          "Flagship case studies and the open-source TenantFleet ecosystem — problem, architecture, oversight, outcome.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/work" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/work" }],
  }),
  component: WorkPage,
});

// Schema.org SoftwareApplication for each case study — helps Google understand
// the projects as distinct creative works authored by Tyler.
const workStructuredData = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Case Studies — Tyler Granlund",
  itemListElement: caseStudies.map((c, i) => ({
    "@type": "SoftwareApplication",
    position: i + 1,
    name: c.name,
    description: c.teaser,
    applicationCategory: c.kicker,
    softwareVersion: c.tag
      .replace("Production · ", "")
      .replace("Live · ", "")
      .replace("Personal · ", "")
      .replace(" · In build", ""),
    author: { "@id": "https://tylergranlund.com/#person" },
    url: `https://tylergranlund.com/work#${c.name.toLowerCase().replace(/\s+/g, "-")}`,
    // AggregateRating is a stretch for "judge score" but it's the closest
    // schema.org has to a quality metric.
    ...(c.metrics.some((m) => m.label.includes("judge"))
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: c.metrics.find((m) => m.label.includes("judge"))?.value.split("/")[0],
            bestRating: c.metrics.find((m) => m.label.includes("judge"))?.value.split("/")[1],
          },
        }
      : {}),
  })),
};

function WorkPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(workStructuredData) }}
      />
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <Projects />
        <EcosystemShowcase />
        <CodePuppy />
        <Passions />
      </main>
      <Footer />
    </>
  );
}
