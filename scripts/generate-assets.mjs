// One-shot brand-asset generator (run on demand, not in the build):
//   node scripts/generate-assets.mjs
//
// Produces, into public/:
//   - apple-touch-icon.png (180), icon-192.png, icon-512.png, icon-512-maskable.png
//   - og-cover.jpg (1200x630 branded share card, real Fraunces + hero photo)
//
// Icons come from sharp rasterizing the existing favicon.svg (single source of
// truth for the mark). The OG card is rendered by headless Chromium so it uses
// the actual brand font and looks like the site, not a generic template.
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { chromium } from "playwright";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(root, "public");

const CEDAR = "#c89b6a";
const SPRUCE = "#1a2620";
const SPRUCE_DEEP = "#10160f";
const MIST = "#d8e0d4";
const STONE = "#aab5a4";

// Reuse the favicon mark. Padded ("maskable") variant keeps the tree inside the
// platform safe-zone so Android doesn't clip it.
const faviconSvg = readFileSync(join(pub, "favicon.svg"));
const treePaths = `
  <path d="M24 9 L24 39"/>
  <path d="M24 12 L18 19 L30 19 Z"/>
  <path d="M24 19 L16 28 L32 28 Z"/>
  <path d="M24 28 L14 37 L34 37 Z"/>`;
const maskableSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" fill="none"
        stroke="${CEDAR}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
     <rect width="48" height="48" fill="${SPRUCE}" stroke="none"/>
     <g transform="translate(24 24) scale(0.62) translate(-24 -24)">${treePaths}</g>
   </svg>`,
);

async function icons() {
  const jobs = [
    [faviconSvg, 180, "apple-touch-icon.png"],
    [faviconSvg, 192, "icon-192.png"],
    [faviconSvg, 512, "icon-512.png"],
    [maskableSvg, 512, "icon-512-maskable.png"],
  ];
  for (const [svg, size, name] of jobs) {
    await sharp(svg, { density: 384 }).resize(size, size).png().toFile(join(pub, name));
    console.log(`   ${name} (${size}x${size})`);
  }
}

async function ogCard() {
  const heroUrl = "file://" + join(root, "src/assets/hero-spruce.jpg");
  const frauncesUrl = "file://" + join(pub, "fonts/fraunces-latin-variable.woff2");
  const monoUrl = "file://" + join(pub, "fonts/jetbrains-mono-latin-variable.woff2");

  const html = `<!doctype html><html><head><meta charset="utf-8"><style>
    @font-face{font-family:'Fraunces';src:url('${frauncesUrl}') format('woff2');font-weight:300 700;}
    @font-face{font-family:'JBMono';src:url('${monoUrl}') format('woff2');font-weight:400 600;}
    *{margin:0;padding:0;box-sizing:border-box}
    html,body{width:1200px;height:630px}
    .card{position:relative;width:1200px;height:630px;overflow:hidden;background:${SPRUCE_DEEP};
      font-family:Fraunces,Georgia,serif;color:${MIST}}
    .bg{position:absolute;inset:0;background:url('${heroUrl}') center/cover;opacity:0.42}
    .veil{position:absolute;inset:0;background:
      linear-gradient(105deg, ${SPRUCE_DEEP} 8%, rgba(16,22,15,0.55) 55%, rgba(16,22,15,0.15) 100%)}
    .grid{position:absolute;inset:0;opacity:0.05;
      background-image:linear-gradient(${MIST} 1px,transparent 1px),linear-gradient(90deg,${MIST} 1px,transparent 1px);
      background-size:64px 64px;
      -webkit-mask-image:radial-gradient(ellipse at center, black 30%, transparent 78%)}
    .frame{position:absolute;inset:28px;border:1px solid rgba(200,155,106,0.32);border-radius:18px}
    .content{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;
      padding:0 92px;gap:14px}
    .kicker{display:flex;align-items:center;gap:14px;
      font-family:JBMono,monospace;font-size:16px;letter-spacing:0.34em;text-transform:uppercase;color:${CEDAR}}
    .kicker svg{width:36px;height:36px}
    .name{font-size:96px;line-height:0.98;font-weight:340;letter-spacing:-0.5px}
    .title{font-size:38px;font-weight:380;color:${CEDAR};font-style:normal}
    .tagline{font-size:22px;font-weight:340;color:${STONE};max-width:740px;line-height:1.35;
      margin-top:4px;font-style:italic}
    .chips{display:flex;gap:16px;margin-top:6px}
    .chip{font-family:JBMono,monospace;font-size:13px;letter-spacing:0.18em;text-transform:uppercase;
      color:${STONE};padding:6px 16px;border:1px solid rgba(200,155,106,0.35);border-radius:100px}
    .foot{position:absolute;left:92px;bottom:56px;
      font-family:JBMono,monospace;font-size:15px;letter-spacing:0.28em;text-transform:uppercase;color:${STONE};opacity:0.65}
  </style></head><body>
    <div class="card">
      <div class="bg"></div><div class="veil"></div><div class="grid"></div>
      <div class="frame"></div>
      <div class="content">
        <div class="kicker">
          <svg viewBox="0 0 48 48" fill="none" stroke="${CEDAR}" stroke-width="2.2"
               stroke-linecap="round" stroke-linejoin="round">${treePaths}</svg>
          Spruce Grove · Granlund
        </div>
        <div class="name">Tyler Granlund</div>
        <div class="title">IT Operations &amp; Systems Engineer</div>
        <div class="tagline">Supervised multi-agent systems, shipped to production — franchise scale.</div>
        <div class="chips">
          <span class="chip">Multi-agent</span>
          <span class="chip">Franchise IT</span>
          <span class="chip">OIDC &amp; Security</span>
        </div>
      </div>
      <div class="foot">Bella Vista, Arkansas · tylergranlund.com</div>
    </div>
  </body></html>`;

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const png = await page.screenshot({ type: "png" });
  await browser.close();
  await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(join(pub, "og-cover.jpg"));
  console.log("   og-cover.jpg (1200x630)");
}

// Responsive image variants -> public/img/{name}-{w}.{avif,webp,jpg}. Lets the
// browser pick format + size so phones don't download 1920px hero bytes. (Free;
// Cloudflare Polish converts format at the edge but does NOT resize on the free
// plan, so the srcset widths are the real mobile-LCP win.)
const RESPONSIVE = [
  { name: "hero-spruce", widths: [768, 1280, 1920] },
  { name: "trail", widths: [768, 1280, 1920] },
  { name: "clearing", widths: [768, 1280, 1920] },
  { name: "house", widths: [768, 1280, 1920] },
  { name: "branch", widths: [640, 960, 1280] },
];

async function responsive() {
  const outDir = join(pub, "img");
  mkdirSync(outDir, { recursive: true });
  for (const { name, widths } of RESPONSIVE) {
    const src = join(root, "src/assets", `${name}.jpg`);
    for (const w of widths) {
      const base = sharp(src).resize(w);
      await base
        .clone()
        .avif({ quality: 52 })
        .toFile(join(outDir, `${name}-${w}.avif`));
      await base
        .clone()
        .webp({ quality: 74 })
        .toFile(join(outDir, `${name}-${w}.webp`));
      await base
        .clone()
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(join(outDir, `${name}-${w}.jpg`));
    }
    console.log(`   img/${name}-{${widths.join(",")}}.{avif,webp,jpg}`);
  }
}

console.log("Generating brand assets…");
await icons();
await ogCard();
await responsive();
console.log("Done.");
