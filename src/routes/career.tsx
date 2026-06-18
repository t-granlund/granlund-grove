import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Career } from "@/components/site/Career";
import { CareerImpactTimeline } from "@/components/site/CareerImpactTimeline";
import { Impact } from "@/components/site/Impact";

export const Route = createFileRoute("/career")({
  head: () => ({
    meta: [
      { title: "Career — Tyler Granlund" },
      {
        name: "description",
        content:
          "Tyler Granlund's career path. Roles, scope, and the measurable impact at each turn, from School of Rock to a multi-brand franchise group.",
      },
      { property: "og:title", content: "Career — Tyler Granlund" },
      {
        property: "og:description",
        content: "The path through the grove. Roles, scope, and impact.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/career" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/career" }],
  }),
  component: CareerPage,
});

function CareerPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        {/* Journey + map leads the page — "See the journey" lands here, then the
            reader follows the trail downward. */}
        <CareerImpactTimeline />
        <Career />
        <Impact />
      </main>
      <Footer />
    </>
  );
}
