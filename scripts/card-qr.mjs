#!/usr/bin/env node
/**
 * bc-03 — Business card QR generator.
 *
 * Emits src/components/brand/card-qr.svg: a deterministic, inverted
 * (light-on-dark) QR for the card back panel. Per layout-spec §2.1 / §6.7:
 *   - payload: UTM-tagged canonical URL
 *   - errorCorrectionLevel 'M' (short URL → v5, 37×37 modules)
 *   - margin: 4 modules (built-in quiet zone; panel padding is additive)
 *   - module fill: currentColor → the route styles it to var(--mist);
 *     NO literal brand hexes live in this asset (token parity, bc-09).
 *
 * Re-run is byte-identical: same payload + options → same SVG.
 */
import QRCode from "qrcode";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

export const QR_PAYLOAD =
  "https://tylergranlund.com/?utm_source=business_card&utm_medium=qr";

const OUT_PATH = resolve(ROOT, "src/components/brand/card-qr.svg");

// The qrcode lib only accepts hex colors, so render with a placeholder and
// post-process to currentColor (keeps the asset token-agnostic; the route
// styles it to var(--mist)).
const raw = await QRCode.toString(QR_PAYLOAD, {
  type: "svg",
  errorCorrectionLevel: "M",
  margin: 4, // modules of quiet zone, baked in
  color: {
    dark: "#010101", // placeholder, swapped below
    light: "#00000000", // transparent ground — the spruce-deep panel shows through
  },
});
const svg = raw.replaceAll("#010101", "currentColor");
if (!svg.includes("currentColor")) {
  throw new Error("card-qr: placeholder swap failed — qrcode output format changed?");
}

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(OUT_PATH, svg, "utf8");

// Report module count so geometry checks (spec §2.1) can be re-verified.
const sizeMatch = svg.match(/viewBox="0 0 (\d+) (\d+)"/);
const modules = sizeMatch ? Number(sizeMatch[1]) : "?";
console.log(`card-qr: wrote ${OUT_PATH}`);
console.log(`card-qr: payload "${QR_PAYLOAD}"`);
console.log(
  `card-qr: ${modules}x${modules} modules incl. quiet zone (expect 45 for v5-M + 4-module margin)`,
);
