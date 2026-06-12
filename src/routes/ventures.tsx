import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Ventures } from "@/components/site/Ventures";

export const Route = createFileRoute("/ventures")({
  head: () => ({
    meta: [
      { title: "Ventures — Tyler Granlund" },
      {
        name: "description",
        content:
          "Creative ventures beyond the systems work — Spruce Grove Media (FPV one-shot films, motion, color grading, sound design) and aerial LiDAR / sensor data capture for the Zipline × Walmart drone-delivery pilot.",
      },
      { property: "og:title", content: "Ventures — Tyler Granlund" },
      {
        property: "og:description",
        content:
          "Spruce Grove Media and field data capture — helping a vision take root, on screen and in the field.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/ventures" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/ventures" }],
  }),
  component: VenturesPage,
});

function VenturesPage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="relative min-h-screen pt-16 [&>section:first-child]:pt-24"
        tabIndex={-1}
      >
        <Ventures />
      </main>
      <Footer />
    </>
  );
}
