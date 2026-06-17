import { expect, test } from "@playwright/test";
import { getSeriousAccessibilityViolations } from "./accessibility";

for (const path of [
  "/",
  "/about",
  "/career",
  "/work",
  "/resume",
  "/contact",
  "/privacy",
  "/ventures",
  "/colophon",
]) {
  test(`${path} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(path);

    const violations = await getSeriousAccessibilityViolations(page);
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}
