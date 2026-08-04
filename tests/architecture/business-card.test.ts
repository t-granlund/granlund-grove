import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

/**
 * bc-09 — Business card fitness functions.
 *
 * Gates the print pipeline (research/business-card-print/findings.md +
 * layout-spec.md). If any of these fail, the card must NOT go to a printer.
 */

const root = process.cwd();
const cardRoutePath = join(root, "src/routes/brand/card.tsx");
const cardCssPath = join(root, "src/components/brand/card.css");
const colorsJsonPath = join(root, "dist/card/colors.json");
const sitemapPath = join(root, "src/routes/sitemap[.]xml.ts");

describe("business card fitness (bc-09)", () => {
  it("uses semantic tokens only — no literal brand colors in card route/CSS", () => {
    const sources = [cardRoutePath, cardCssPath].map((p) => readFileSync(p, "utf8"));

    // Verified brand hexes from findings.md §2 — none may appear literally.
    const brandHexes = [
      "#0e130f",
      "#e4aa71",
      "#f2a26a",
      "#1d3a2a",
      "#0e1f15",
      "#395f47",
      "#d1cec5",
      "#ecebe5",
      "#3d3026",
      "#c89b6a", // legacy favicon cedar — token or nothing
    ];
    for (const [i, src] of sources.entries()) {
      for (const hex of brandHexes) {
        expect(
          src.toLowerCase().includes(hex),
          `literal brand hex ${hex} found in ${i === 0 ? "card.tsx" : "card.css"} — use var(--*) tokens`,
        ).toBe(false);
      }
    }

    // No literal oklch() outside the specced atmosphere gradient (documented
    // exception: layout-spec §4 F1 keeps the site's exact spruce-hue ramp).
    const css = sources[1];
    const oklchUses = css.match(/oklch\(/g) ?? [];
    expect(
      oklchUses.length,
      "card.css may contain at most the F1 atmosphere gradient oklch()",
    ).toBeLessThanOrEqual(1);
  });

  it("keeps the rich-black build under the 300% TAC cap (bc-06 output)", () => {
    expect(
      existsSync(colorsJsonPath),
      "dist/card/colors.json missing — run `npm run card:colors` first",
    ).toBe(true);
    const { richBlack } = JSON.parse(readFileSync(colorsJsonPath, "utf8"));
    expect(richBlack.ok).toBe(true);
    expect(richBlack.tac).toBeLessThanOrEqual(richBlack.tacCap);
  });

  it("keeps every card token inside the sRGB gamut (bc-06 output)", () => {
    const { colors } = JSON.parse(readFileSync(colorsJsonPath, "utf8"));
    for (const [name, info] of Object.entries(colors)) {
      expect(
        (info as { inSrgbGamut: boolean }).inSrgbGamut,
        `--${name} escaped the sRGB gamut — check styles.css token drift`,
      ).toBe(true);
    }
  });

  it("excludes /brand/card from the sitemap and marks it noindex", () => {
    const sitemap = readFileSync(sitemapPath, "utf8");
    expect(
      sitemap.includes("/brand/card"),
      "sitemap.xml must never list the print-artifact route",
    ).toBe(false);

    const route = readFileSync(cardRoutePath, "utf8");
    expect(route).toContain("noindex, nofollow");
  });

  it("ships the route-scoped print-reset override (the white-card landmine)", () => {
    const css = readFileSync(cardCssPath, "utf8");
    // Without this pair, Chromium page.pdf() triggers the global @media print
    // block in styles.css and the card prints WHITE. Regression = disaster.
    expect(css).toContain("@media print");
    expect(css).toContain("brand-card-print");
    expect(css).toContain("print-color-adjust: exact");
  });

  it("respects the 7pt reversed-text floor in card CSS", () => {
    const css = readFileSync(cardCssPath, "utf8");
    const sizes = [...css.matchAll(/font-size:\s*([\d.]+)pt/g)].map((m) => Number(m[1]));
    expect(sizes.length, "card.css should declare pt font sizes").toBeGreaterThan(0);
    for (const size of sizes) {
      expect(
        size,
        `font-size ${size}pt is below the 7pt reversed-text floor`,
      ).toBeGreaterThanOrEqual(7);
    }
  });

  it("generates the QR asset deterministically", () => {
    // Re-running the generator must produce a byte-identical asset — if not,
    // a frozen visual baseline (bc-08) could silently diverge from the QR.
    const before = readFileSync(join(root, "src/components/brand/card-qr.svg"), "utf8");
    execFileSync("node", ["scripts/card-qr.mjs"], { cwd: root });
    const after = readFileSync(join(root, "src/components/brand/card-qr.svg"), "utf8");
    expect(after).toBe(before);
  });

  it("keeps the QR payload on the canonical UTM URL", () => {
    const svg = readFileSync(join(root, "src/components/brand/card-qr.svg"), "utf8");
    expect(svg).toContain("currentColor"); // token-agnostic modules
    const script = readFileSync(join(root, "scripts/card-qr.mjs"), "utf8");
    expect(script).toContain("https://tylergranlund.com/?utm_source=business_card&utm_medium=qr");
  });
});
