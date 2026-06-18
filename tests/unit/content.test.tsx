import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Skills } from "@/components/site/Skills";
import { Resume } from "@/components/site/Resume";
import { Projects, caseStudies } from "@/components/site/Projects";

describe("Skills", () => {
  it("groups capabilities the way the resume does", () => {
    render(<Skills />);
    for (const group of [
      "AI & Agent Systems",
      "Languages & Frameworks",
      "Cloud & Identity",
      "Data & BI",
      "Quality & Delivery",
      "Platform Integrations",
    ]) {
      expect(screen.getByRole("heading", { name: group })).toBeInTheDocument();
    }
    // Leads with orchestration.
    expect(screen.getByText("Multi-agent orchestration")).toBeInTheDocument();
  });
});

describe("Resume", () => {
  it("offers a default master download plus tailored variants", () => {
    render(<Resume />);
    const links = [
      "/resume/Tyler-Granlund-Master-Resume.pdf",
      "/resume/Tyler-Granlund-Resume-AI-PM.pdf",
      "/resume/Tyler-Granlund-Resume-FDE.pdf",
    ];
    for (const href of links) {
      const link = document.querySelector(`a[href="${href}"]`);
      expect(link, `download link for ${href}`).not.toBeNull();
      expect(link?.hasAttribute("download")).toBe(true);
    }
  });
});

describe("Projects / case studies", () => {
  it("renders all six flagship case studies", () => {
    render(<Projects />);
    for (const name of [
      "Control Tower",
      "Knowledge Fabric",
      "Estate Trace",
      "Zero-secret automation",
      "Mysa Mail",
      "TenantFleet Ecosystem",
    ]) {
      expect(screen.getByRole("heading", { name })).toBeInTheDocument();
    }
  });

  it("uses the full five-beat narrative for every case study", () => {
    // Beats live inside modals (not SSR'd until opened), so we verify the data.
    for (const study of caseStudies) {
      expect(study.problem, `${study.name}: problem`).toBeTruthy();
      expect(study.architecture, `${study.name}: architecture`).toBeTruthy();
      expect(study.oversight, `${study.name}: oversight`).toBeTruthy();
      expect(study.outcome, `${study.name}: outcome`).toBeTruthy();
      expect(study.reflection, `${study.name}: reflection (my take)`).toBeTruthy();
    }
  });

  it("keeps a lighter 'more builds' strip", () => {
    render(<Projects />);
    expect(screen.getByRole("heading", { name: /more from the workshop/i })).toBeInTheDocument();
  });

  it("links the open-source case study out to GitHub", () => {
    render(<Projects />);
    const mysa = screen.getByRole("heading", { name: "Mysa Mail" }).closest("article");
    expect(mysa).not.toBeNull();
    const link = within(mysa as HTMLElement).getByRole("link", { name: /view on github/i });
    expect(link).toHaveAttribute("href", "https://github.com/t-granlund/mysa-mail");
  });
});
