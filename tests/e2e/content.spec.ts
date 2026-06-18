import { expect, test } from "@playwright/test";

test.describe("home content sections", () => {
  test("renders all six flagship case studies, each with the five-beat narrative in its modal", async ({
    page,
  }) => {
    await page.goto("/work");
    const projects = page.locator("#projects");

    for (const name of [
      "Control Tower",
      "Knowledge Fabric",
      "Estate Trace",
      "Zero-secret automation",
      "Mysa Mail",
      "TenantFleet Ecosystem",
    ]) {
      await expect(projects.getByRole("heading", { name })).toBeVisible();
    }

    await expect(projects.getByRole("heading", { name: /more from the workshop/i })).toBeVisible();

    // The five-beat narrative now lives inside each case study's modal — open
    // the first one and assert the beats render there. The Radix trigger only
    // opens once React has hydrated, so wait for the fiber before clicking.
    await page.waitForFunction(() => {
      const btn = document.querySelector("#projects button");
      return !!btn && Object.keys(btn).some((k) => k.startsWith("__react"));
    });
    await projects
      .getByRole("button", { name: /explore the system/i })
      .first()
      .click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    for (const beat of ["Problem", "Architecture", "Outcome", "My take"]) {
      await expect(dialog.getByText(beat, { exact: true }).first()).toBeVisible();
    }
  });

  test("groups skills the way the resume does", async ({ page }) => {
    await page.goto("/about");
    const skills = page.locator("#skills");
    for (const group of [
      "AI & Agent Systems",
      "Languages & Frameworks",
      "Cloud & Identity",
      "Data & BI",
      "Quality & Delivery",
      "Platform Integrations",
    ]) {
      await expect(skills.getByRole("heading", { name: group })).toBeVisible();
    }
  });

  test("offers downloadable resume variants", async ({ page }) => {
    await page.goto("/resume");
    const resume = page.locator("#resume");
    for (const href of [
      "/resume/Tyler-Granlund-Master-Resume.pdf",
      "/resume/Tyler-Granlund-Resume-AI-PM.pdf",
      "/resume/Tyler-Granlund-Resume-FDE.pdf",
    ]) {
      const link = resume.locator(`a[href="${href}"]`);
      await expect(link).toHaveAttribute("download", "");
    }
  });
});

test.describe("resume PDFs are actually served", () => {
  for (const file of [
    "Tyler-Granlund-Master-Resume.pdf",
    "Tyler-Granlund-Resume-AI-PM.pdf",
    "Tyler-Granlund-Resume-FDE.pdf",
  ]) {
    test(`/resume/${file} returns a PDF`, async ({ request }) => {
      const res = await request.get(`/resume/${file}`);
      expect(res.ok()).toBe(true);
      expect(res.headers()["content-type"]).toContain("pdf");
    });
  }
});

test.describe("about page content", () => {
  test("renders about and skills sections", async ({ page }) => {
    await page.goto("/about");
    // "About" label is in SectionLabel (span), not a heading — use first() because
    // "Roots" also appears in "Deepen the roots" philosophy tenet
    await expect(page.getByText(/Roots/i).first()).toBeVisible();
    await expect(page.getByRole("heading", { name: /Rooted in systems/i })).toBeVisible();
    await expect(page.getByRole("heading", { name: /the grove/i })).toBeVisible();
    // Philosophy section is rendered via SectionLabel (span, not heading)
    await expect(page.getByText(/The Compass/i)).toBeVisible();
  });

  test("shows headshot image with alt text", async ({ page }) => {
    await page.goto("/about");
    const img = page.locator("img[alt*='Tyler Granlund']").first();
    await expect(img).toBeVisible();
    const alt = await img.getAttribute("alt");
    expect(alt).toContain("Tyler Granlund");
  });
});

test.describe("career page content", () => {
  test("renders all career roles", async ({ page }) => {
    await page.goto("/career");
    const careerSection = page.locator("#career");
    await expect(careerSection.getByText(/IT Operations & Systems Engineer/i)).toBeVisible();
    await expect(careerSection.getByRole("heading", { name: /IT Director/i })).toBeVisible();
    await expect(careerSection.getByText(/Outdoor Cap Company/i)).toBeVisible();
    await expect(careerSection.getByText(/School of Rock/i)).toBeVisible();
  });

  test("impact section renders", async ({ page }) => {
    await page.goto("/career");
    await expect(page.getByRole("heading", { name: /Where I create impact/i })).toBeVisible();
  });

  test("career impact timeline renders", async ({ page }) => {
    await page.goto("/career");
    await expect(page.getByRole("heading", { name: /A career measured in/i })).toBeVisible();
    await expect(page.getByText(/from one market to the world/i)).toBeVisible();
    // Step badges in the timeline cards (not the map legend)
    const timelineSection = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: /A career measured in/i }) });
    await expect(timelineSection.getByText(/^Step 01$/i).first()).toBeVisible();
    await expect(timelineSection.getByText(/^Step 05$/i).first()).toBeVisible();
  });
});

test.describe("ventures page content", () => {
  test("renders Spruce Grove Media section", async ({ page }) => {
    await page.goto("/ventures");
    // Use first() because "Spruce Grove Media" appears in eyebrow + body text
    await expect(page.getByText(/Spruce Grove Media/i).first()).toBeVisible();
  });
});

test.describe("contact form", () => {
  // The form is SSR'd, but onSubmit only prevents a native (page-reloading)
  // submit once React has hydrated. Wait for React to tag the submit button
  // before interacting, otherwise the click races hydration.
  async function waitForHydration(page: import("@playwright/test").Page) {
    await page.waitForFunction(() => {
      const btn = document.querySelector('#contact form button[type="submit"]');
      return !!btn && Object.keys(btn).some((k) => k.startsWith("__react"));
    });
  }

  async function fillForm(page: import("@playwright/test").Page) {
    await waitForHydration(page);
    const form = page.locator("#contact form");
    await form.getByLabel("Name", { exact: true }).fill("Jane Recruiter");
    await form.getByLabel("Email", { exact: true }).fill("jane@example.com");
    await form.getByLabel("Subject", { exact: true }).fill("FDE conversation");
    await form.getByLabel("Message", { exact: true }).fill("Loved the case studies.");
    return form;
  }

  test("shows a sent confirmation when the backend accepts", async ({ page }) => {
    await page.route("**/api/contact", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ ok: true }),
      }),
    );
    await page.goto("/contact");
    const form = await fillForm(page);
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(form.getByRole("button", { name: /sent.*talk soon/i })).toBeVisible();
  });

  test("posts the message to the backend (then falls back when unavailable)", async ({ page }) => {
    // Suppress the real mailto navigation the client triggers on a 501 so it
    // can't unload the page mid-assertion.
    await page.addInitScript(() => {
      window.open = () => null;
    });

    let posted: Record<string, unknown> | null = null;
    await page.route("**/api/contact", async (route) => {
      posted = route.request().postDataJSON();
      await route.fulfill({
        status: 501,
        contentType: "application/json",
        body: JSON.stringify({ ok: false, fallback: true }),
      });
    });

    await page.goto("/contact");
    const form = await fillForm(page);
    await form.getByRole("button", { name: /send message/i }).click();

    // The client POSTs the form payload to the backend before any fallback —
    // this is the deterministic, meaningful contract to assert.
    await expect.poll(() => posted).not.toBeNull();
    expect(posted).toMatchObject({
      name: "Jane Recruiter",
      email: "jane@example.com",
      subject: "FDE conversation",
      message: "Loved the case studies.",
    });
  });

  test("honeypot field is hidden from accessibility tree", async ({ page }) => {
    await page.goto("/contact");
    const honeypot = page.locator('input[name="company"]');
    await expect(honeypot).toHaveAttribute("aria-hidden", "true");
    await expect(honeypot).toHaveAttribute("tabindex", "-1");
    await expect(honeypot).toHaveAttribute("autocomplete", "off");
  });
});
