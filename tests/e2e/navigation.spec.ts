import { expect, test } from "@playwright/test";

test.describe("primary navigation", () => {
  test("all nav links are present and functional", async ({ page }) => {
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary navigation" });
    for (const label of ["About", "Career", "Work", "Ventures", "Resume", "Contact"]) {
      const link = nav.getByRole("link", { name: label });
      await expect(link).toBeVisible();
    }
  });

  test("logo links back to home", async ({ page }) => {
    await page.goto("/work");
    await page
      .getByRole("link", { name: /Tyler Granlund/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("mobile menu opens and closes", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // The hamburger button is the only button in the header on mobile
    const menuBtn = page.locator("header button").first();
    await expect(menuBtn).toBeVisible();

    await menuBtn.click();
    const mobileNav = page.locator("#mobile-nav");
    await expect(mobileNav).toBeVisible();

    // Escape closes the menu
    await page.keyboard.press("Escape");
    await expect(mobileNav).not.toBeVisible();
  });

  test("mobile menu navigation works", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const menuBtn = page.locator("header button").first();
    await menuBtn.click();
    await page.locator("#mobile-nav").getByRole("link", { name: "Work" }).click();
    await expect(page).toHaveURL(/\/work$/);
    await expect(page).toHaveTitle(/Work/i);
  });
});

test.describe("skip link", () => {
  test("skip link is the first focusable element on every page", async ({ page }) => {
    for (const path of ["/", "/about", "/career", "/work", "/ventures", "/resume", "/contact"]) {
      await page.goto(path);
      await page.keyboard.press("Tab");
      const skipLink = page.getByRole("link", { name: /skip to content/i });
      await expect(skipLink).toBeFocused();
    }
  });
});

test.describe("keyboard navigation", () => {
  test("contact form is fully keyboard operable", async ({ page }) => {
    await page.goto("/contact");

    // Click into the form to establish focus, then Tab through fields
    await page.getByLabel("Name", { exact: true }).click();

    const fields = ["Name", "Email", "Subject", "Message"];
    for (const label of fields) {
      await expect(page.getByLabel(label, { exact: true })).toBeFocused();
      await page.keyboard.press("Tab");
    }

    // Submit button should have focus after tabbing through all fields
    await expect(page.getByRole("button", { name: /send message/i })).toBeFocused();
  });
});
