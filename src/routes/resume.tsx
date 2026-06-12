import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Resume } from "@/components/site/Resume";

export const Route = createFileRoute("/resume")({
  head: () => ({
    meta: [
      { title: "Resume — Tyler Granlund" },
      {
        name: "description",
        content:
          "Download Tyler Granlund's resume — a master record plus variants tailored for FDE and AI-PM screens.",
      },
      { property: "og:title", content: "Resume — Tyler Granlund" },
      { property: "og:description", content: "The growth rings — a downloadable record." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://tylergranlund.com/resume" },
      { property: "og:image", content: "https://tylergranlund.com/og-cover.jpg" },
    ],
    links: [{ rel: "canonical", href: "https://tylergranlund.com/resume" }],
  }),
  component: ResumePage,
});

function ResumePage() {
  return (
    <>
      <Nav />
      <main
        id="main-content"
        className="relative flex min-h-screen flex-col justify-center pt-16"
        tabIndex={-1}
      >
        <Resume />
      </main>
      <Footer />
    </>
  );
}
