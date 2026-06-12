import { expect, test } from "@playwright/test";

test.describe("landing hub", () => {
  test("renders the hero and links to the five destinations", async ({ page }) => {
    await page.goto("/");

    await expect(page).toHaveTitle(/Tyler Granlund/i);
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/resilient systems/i);

    for (const path of ["/about", "/career", "/work", "/resume", "/contact"]) {
      await expect(page.locator(`main a[href="${path}"]`).first()).toBeVisible();
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
