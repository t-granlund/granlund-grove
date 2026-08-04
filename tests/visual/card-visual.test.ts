import { describe, expect, it, beforeAll } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { PNG } from "pngjs";
import jsQR from "jsqr";

/**
 * bc-11 — Card visual + QR QA.
 *
 * Two gates:
 *   1. The QR on the rendered 300-DPI back raster decodes to the exact UTM
 *      payload at 100% and 75% scale (print/scan resilience).
 *   2. A fresh render pixel-matches the Tyler-approved baselines frozen in
 *      bc-08 (tests/visual/baseline/). Baselines are re-frozen ONLY through
 *      a deliberate approval — never auto-updated.
 *
 * Requires `npm run card:render` output in dist/card/ (run it first; the test
 * renders fresh rasters itself to compare against baseline).
 */

const root = process.cwd();
const EXPECTED_PAYLOAD = "https://tylergranlund.com/?utm_source=business_card&utm_medium=qr";

function readPng(path: string): PNG {
  return PNG.sync.read(readFileSync(path));
}

/** Nearest-neighbor downscale — mimics a smaller physical print/scan. */
function downscale(src: PNG, scale: number): PNG {
  const w = Math.round(src.width * scale);
  const h = Math.round(src.height * scale);
  const dst = new PNG({ width: w, height: h });
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const si = (Math.floor(y / scale) * src.width + Math.floor(x / scale)) * 4;
      const di = (y * w + x) * 4;
      dst.data.set(src.data.subarray(si, si + 4), di);
    }
  }
  return dst;
}

function decode(png: PNG): string | null {
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  return code?.data ?? null;
}

/** Mean per-channel absolute difference as a fraction of 255. */
function meanPixelDiff(a: PNG, b: PNG): number {
  if (a.width !== b.width || a.height !== b.height) return 1;
  let sum = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    sum +=
      Math.abs(a.data[i] - b.data[i]) +
      Math.abs(a.data[i + 1] - b.data[i + 1]) +
      Math.abs(a.data[i + 2] - b.data[i + 2]);
  }
  return sum / (a.data.length * 0.75 * 255);
}

describe("business card visual + QR QA (bc-08/bc-11)", () => {
  const renderedFront = join(root, "dist/card/card-front.png");
  const renderedBack = join(root, "dist/card/card-back.png");

  beforeAll(() => {
    // Fresh render so the diff is against current code, not stale output.
    execFileSync("node", ["scripts/render-card.mjs"], {
      cwd: root,
      stdio: "pipe",
      timeout: 120_000,
    });
  }, 150_000);

  it("renders both faces at exactly 300 DPI (1125×675)", () => {
    for (const p of [renderedFront, renderedBack]) {
      expect(existsSync(p), `${p} missing — render failed`).toBe(true);
      const png = readPng(p);
      expect(png.width).toBe(1125);
      expect(png.height).toBe(675);
    }
  });

  it.each([1.0, 0.75])("QR decodes at %s× scale from the rendered raster", (scale) => {
    const back = readPng(renderedBack);
    const sample = scale === 1.0 ? back : downscale(back, scale);
    expect(decode(sample)).toBe(EXPECTED_PAYLOAD);
  });

  it("QR also decodes from the frozen baseline (baseline is scannable)", () => {
    const baseline = readPng(join(root, "tests/visual/baseline/card-back.png"));
    expect(decode(baseline)).toBe(EXPECTED_PAYLOAD);
  });

  it.each(["front", "back"])("%s face pixel-matches the approved baseline", (face) => {
    const baselinePath = join(root, `tests/visual/baseline/card-${face}.png`);
    expect(
      existsSync(baselinePath),
      `baseline for ${face} missing — freeze via bc-08 approval first`,
    ).toBe(true);
    const baseline = readPng(baselinePath);
    const rendered = readPng(join(root, `dist/card/card-${face}.png`));
    // Tolerance for font-rasterization jitter across Chromium/macOS updates.
    // Deliberate layout changes blow far past this; sub-pixel AA shifts don't.
    expect(meanPixelDiff(rendered, baseline)).toBeLessThan(0.005);
  });
});
