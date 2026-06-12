// One-shot headshot optimizer:
//   node scripts/add-headshot.mjs /path/to/your-photo.jpg
//
// Generates responsive variants to public/img/:
//   tyler-headshot-640.{avif,webp,jpg}
//   tyler-headshot-960.{avif,webp,jpg}
//   tyler-headshot-1280.{avif,webp,jpg}
//
// Then the About component can use:
//   <Picture name="tyler-headshot" widths={[640, 960, 1280]} ... />

import { createReadStream } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imgOut = join(root, "public", "img");

const src = process.argv[2];
if (!src) {
  console.error("Usage: node scripts/add-headshot.mjs /path/to/photo.jpg");
  process.exit(1);
}

const widths = [640, 960, 1280];
const name = "tyler-headshot";

console.log(`Processing ${src} → public/img/${name}-*.{avif,webp,jpg}`);

for (const w of widths) {
  const base = sharp(src).resize(w, null, { withoutEnlargement: true });
  await base
    .clone()
    .avif({ quality: 60 })
    .toFile(join(imgOut, `${name}-${w}.avif`));
  await base
    .clone()
    .webp({ quality: 75 })
    .toFile(join(imgOut, `${name}-${w}.webp`));
  await base
    .clone()
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(join(imgOut, `${name}-${w}.jpg`));
  console.log(`   ${w}px (avif + webp + jpg)`);
}

console.log("Done! Now update About.tsx name prop from 'branch' to 'tyler-headshot'.");
