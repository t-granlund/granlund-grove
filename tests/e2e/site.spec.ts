import { expect, test } from "@playwright/test";

test.describe("landing hub", () => {
  test("renders the hero and links to the five destinations", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Tyler Granlund/i);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/rooted in training/i);

    for (const path of ["/about", "/career", "/work", "/resume", "/contact"]) {
      await expect(page.locator(`main a[href="${path}"]`).first()).toBeVisible();
    }
  });

  test("renders the globe network section", async ({ page }) => {
    await page.goto("/");
    const globeSection = page.locator("[data-testid='globe-network']");
    await expect(globeSection).toBeVisible();
    await expect(globeSection.getByRole("heading", { name: /crossed continents/i })).toBeVisible();
    await expect(globeSection.getByText(/22 cities/i).first()).toBeVisible();
    await expect(globeSection.getByText(/5 continents/i).first()).toBeVisible();
    await expect(globeSection.getByText(/one market to the world/i)).toBeVisible();
    await expect(globeSection.getByRole("link", { name: /See the journey/i })).toBeVisible();
  });

  test("globe overlay links to career page", async ({ page }) => {
    await page.goto("/");
    const globeSection = page.locator("[data-testid='globe-network']");
    await globeSection.getByRole("link", { name: /See the journey/i }).click();
    await expect(page).toHaveURL(/\/career$/);
  });

  test("renders the globe canvas container", async ({ page }) => {
    await page.goto("/");
    const canvas = page.locator("[data-testid='globe-canvas-container']");
    await expect(canvas).toBeVisible();
  });

  test("renders the globe network legend", async ({ page }) => {
    await page.goto("/");
    const globeSection = page.locator("[data-testid='globe-network']");
    for (const label of ["Roots", "Hubs", "International"]) {
      await expect(globeSection.getByText(label).first()).toBeVisible();
    }
  });

  test("skip link focuses main content", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const skipLink = page.getByRole("link", { name: /skip to content/i });
    await expect(skipLink).toBeFocused();
    await skipLink.press("Enter");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("a destination card navigates to its section page", async ({ page }) => {
    await page.goto("/");
    await page.locator('main a[href="/work"]').first().click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page).toHaveTitle(/Work/i);
  });
});

test.describe("section routes load", () => {
  const routes: [string, RegExp][] = [
    ["/about", /About/i],
    ["/career", /Career/i],
    ["/work", /Work/i],
    ["/resume", /Resume/i],
    ["/contact", /Contact/i],
    ["/ventures", /Ventures/i],
    ["/colophon", /Colophon/i],
    ["/writing", /Writing/i],
    ["/writing/running-it-for-200-locations-with-ai-agents", /Running IT/i],
    ["/writing/building-identity-aware-rag", /identity-aware RAG/i],
  ];
  for (const [path, titleRe] of routes) {
    test(`${path} renders main + correct title`, async ({ page }) => {
      await page.goto(path);
      await expect(page).toHaveTitle(titleRe);
      await expect(page.getByRole("main")).toBeVisible();
    });
  }

  test("career page shows the IT Director role", async ({ page }) => {
    await page.goto("/career");
    await expect(page.getByRole("heading", { name: "IT Director" })).toBeVisible();
  });

  test("ventures page shows Spruce Grove Media", async ({ page }) => {
    await page.goto("/ventures");
    await expect(page.getByText(/Spruce Grove Media/i).first()).toBeVisible();
  });

  test("colophon page shows build stack details", async ({ page }) => {
    await page.goto("/colophon");
    await expect(page.getByText(/TanStack Start/i)).toBeVisible();
    await expect(page.getByText(/Tailwind CSS v4/i)).toBeVisible();
  });
});

test.describe("404 handling", () => {
  test("unknown routes show a branded 404 page", async ({ page }) => {
    await page.goto("/this-does-not-exist");
    await expect(page.getByRole("heading", { name: /404/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /go home/i })).toBeVisible();
  });
});

test.describe("primary CTAs render their cedar gradient fill", () => {
  // Regression guard: `bg-[var(--gradient-cedar)]` silently emits an invalid
  // background-COLOR in Tailwind v4 (the var is a gradient image), leaving the
  // primary buttons transparent/invisible. The fix is the `image:` type hint —
  // these assertions fail if anyone reverts it.
  const ctas: [string, "link" | "button", string][] = [
    ["/", "link", "Explore the work"],
    ["/resume", "link", "Download resume"],
    ["/contact", "button", "Send message"],
  ];
  for (const [path, role, name] of ctas) {
    test(`${path} "${name}" paints a gradient background`, async ({ page }) => {
      await page.goto(path);
      const el = page.getByRole(role, { name }).first();
      await expect(el).toBeVisible();
      const bgImage = await el.evaluate((n) => getComputedStyle(n).backgroundImage);
      expect(bgImage).toContain("gradient");
    });
  }
});

test.describe("navigation reflects the active route", () => {
  test("the current section is marked active in the primary nav", async ({ page }) => {
    await page.goto("/work");
    const active = page
      .getByRole("navigation", { name: "Primary navigation" })
      .getByRole("link", { name: "Work" });
    const color = await active.evaluate((n) => getComputedStyle(n).color);
    // active links use text-cedar — a warm hue distinct from muted-foreground.
    expect(color).not.toBe("");
    await expect(active).toHaveClass(/text-cedar/);
  });
});

test.describe("privacy + sitemap", () => {
  test("privacy route renders a main landmark and heading", async ({ page }) => {
    await page.goto("/privacy");

    await expect(page).toHaveTitle(/Privacy Policy/i);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { name: /privacy policy/i })).toBeVisible();
    await expect(page.getByText(/no personal data automatically/i)).toBeVisible();
  });

  test("sitemap returns XML with the current public routes", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/xml");

    const body = await response.text();
    for (const path of ["/", "/about", "/career", "/work", "/resume", "/contact", "/privacy"]) {
      expect(body).toContain(`https://tylergranlund.com${path}`);
    }
  });
});
