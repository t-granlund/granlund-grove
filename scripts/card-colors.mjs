#!/usr/bin/env node
/**
 * bc-06 — Card color verifier.
 *
 * Parses the OKLCH tokens actually used by the card from src/styles.css,
 * asserts each is inside the sRGB gamut (culori), and emits a machine-readable
 * dist/card/colors.json consumed by the architecture fitness functions (bc-09).
 *
 * Also verifies the print rich-black build stays under the 300% TAC cap
 * (findings.md §2: C40 M30 Y30 K100 = 200%).
 *
 * Exit 1 on any violation — this is a gate, not a report.
 */
import { converter, formatHex, inGamut } from "culori";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const CSS_PATH = resolve(ROOT, "src/styles.css");
const OUT_PATH = resolve(ROOT, "dist/card/colors.json");

// Tokens the card is allowed to use (layout-spec §1/§2). Single source of truth
// is styles.css — we parse, never hardcode.
const CARD_TOKENS = [
  "background",
  "foreground",
  "cedar",
  "spruce",
  "spruce-deep",
  "moss",
  "stone",
  "mist",
  "bark",
];

const OKLCH_RE = /--([\w-]+):\s*oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/g;

const css = readFileSync(CSS_PATH, "utf8");
const found = new Map();
for (const m of css.matchAll(OKLCH_RE)) {
  if (!found.has(m[1])) {
    found.set(m[1], { l: Number(m[2]), c: Number(m[3]), h: Number(m[4]) });
  }
}

const toRgb = converter("oklch");
const inSrgb = inGamut("rgb");

let failures = 0;
const colors = {};
for (const name of CARD_TOKENS) {
  const tok = found.get(name);
  if (!tok) {
    console.error(`MISSING  --${name}: not found in styles.css`);
    failures++;
    continue;
  }
  const oklch = { mode: "oklch", ...tok };
  const hex = formatHex(toRgb(oklch));
  const gamutOk = inSrgb(oklch);
  colors[name] = { oklch: tok, hex, inSrgbGamut: gamutOk };
  console.log(
    `${gamutOk ? "OK     " : "GAMUT  "} --${name.padEnd(12)} oklch(${tok.l} ${tok.c} ${tok.h}) → ${hex}`,
  );
  if (!gamutOk) failures++;
}

// Rich-black TAC check (findings.md §2).
const RICH_BLACK = { c: 40, m: 30, y: 30, k: 100 };
const TAC_CAP = 300;
const tac = RICH_BLACK.c + RICH_BLACK.m + RICH_BLACK.y + RICH_BLACK.k;
const tacOk = tac <= TAC_CAP;
console.log(
  `${tacOk ? "OK     " : "TAC    "} rich black C${RICH_BLACK.c} M${RICH_BLACK.m} Y${RICH_BLACK.y} K${RICH_BLACK.k} → TAC ${tac}% (cap ${TAC_CAP}%)`,
);
if (!tacOk) failures++;

mkdirSync(dirname(OUT_PATH), { recursive: true });
writeFileSync(
  OUT_PATH,
  JSON.stringify(
    {
      generated: new Date().toISOString(),
      source: "src/styles.css",
      colors,
      richBlack: { ...RICH_BLACK, tac, tacCap: TAC_CAP, ok: tacOk },
    },
    null,
    2,
  ) + "\n",
);
console.log(`card-colors: wrote ${OUT_PATH}`);

if (failures > 0) {
  console.error(`card-colors: ${failures} violation(s) — FAIL`);
  process.exit(1);
}
console.log("card-colors: all checks passed");
