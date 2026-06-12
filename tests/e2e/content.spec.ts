import { expect, test } from "@playwright/test";

test.describe("home content sections", () => {
  test("renders all six flagship case studies with the five-beat narrative", async ({ page }) => {
    await page.goto("/work");
    const projects = page.locator("#projects");

    for (const name of [
      "Control Tower",
      "Knowledge Fabric",
      "Estate Trace",
      "Zero-secret automation",
      "Mysa Mail",
      "Group Management Hub",
    ]) {
      await expect(projects.getByRole("heading", { name })).toBeVisible();
    }

    for (const beat of ["Problem", "Architecture", "Outcome", "My take"]) {
      await expect(projects.getByText(beat, { exact: true }).first()).toBeVisible();
    }

    await expect(projects.getByRole("heading", { name: /more from the workshop/i })).toBeVisible();
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
});
