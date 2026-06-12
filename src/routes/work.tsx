import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Projects } from "@/components/site/Projects";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Tyler Granlund" },
      {
        name: "description",
        content:
          "Six flagship case studies from Tyler Granlund — problem, architecture, oversight & evals, outcome, and what he'd do differently.",
      },
      { property: "og:title", content: "Work — Tyler Granlund" },
      {
        property: "og:description",
        content: "Six flagship case studies — problem, architecture, oversight, outcome.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/work" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/work" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <Projects />
      </main>
      <Footer />
    </>
  );
}
