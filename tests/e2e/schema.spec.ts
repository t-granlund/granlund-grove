import { expect, test } from "@playwright/test";

test.describe("structured data", () => {
  test("home page ships JSON-LD Person schema", async ({ page }) => {
    await page.goto("/");
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    let foundPerson = false;
    for (const script of scripts) {
      const text = await script.textContent();
      if (!text) continue;
      const data = JSON.parse(text);
      const graph = data["@graph"] || [data];
      for (const item of graph) {
        if (item["@type"] === "Person") {
          foundPerson = true;
          expect(item.name).toBe("Tyler Granlund");
          expect(item.jobTitle).toBeTruthy();
          expect(item.knowsAbout).toContain("IT Operations");
        }
      }
    }
    expect(foundPerson).toBe(true);
  });

  test("work page ships JSON-LD ItemList of SoftwareApplication", async ({ page }) => {
    await page.goto("/work");
    const scripts = await page.locator('script[type="application/ld+json"]').all();
    expect(scripts.length).toBeGreaterThanOrEqual(1);

    let foundItemList = false;
    for (const script of scripts) {
      const text = await script.textContent();
      if (!text) continue;
      const data = JSON.parse(text);
      if (data["@type"] === "ItemList") {
        foundItemList = true;
        expect(data.itemListElement.length).toBe(6);
        expect(data.itemListElement[0]["@type"]).toBe("SoftwareApplication");
        expect(data.itemListElement[0].name).toBeTruthy();
      }
    }
    expect(foundItemList).toBe(true);
  });
});

test.describe("meta tags", () => {
  test("home page has correct OG tags", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute("content", "website");
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      "content",
      "https://tylergranlund.com/",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      "https://tylergranlund.com/og-cover.jpg",
    );
  });

  test("work page has canonical link", async ({ page }) => {
    await page.goto("/work");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://tylergranlund.com/work",
    );
  });

  test("privacy page has robots noindex", async ({ page }) => {
    await page.goto("/privacy");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", "noindex, follow");
  });

  test("colophon page has robots noindex", async ({ page }) => {
    await page.goto("/colophon");
    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute("content", "noindex, follow");
  });
});
