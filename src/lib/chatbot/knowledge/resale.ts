import type { KnowledgeChunk } from "../knowledge";

/**
 * For-sale listings knowledge (Granlund Grove storefront, /resale/site/).
 * Kept in sync with public/resale/llms.txt — update both when inventory
 * changes. Statuses as of 2026-09-14.
 */
export const resaleChunks: KnowledgeChunk[] = [
  {
    id: "resale-overview",
    text: "While Tyler looks for his next role, he's rehoming a few well-kept personal items on his storefront at tylergranlund.com/resale/site. Current listings: Peloton Bike+ full bundle ($549), Alienware AW3423DWF 34-inch QD-OLED ultrawide monitor ($325), Weber Spirit 3-burner natural gas grill ($275), Craftsman Platinum 21-inch self-propelled mower ($99), and a Colamy ergonomic mesh office chair ($75). Everything is pickup in Bella Vista (NWA), cash or Venmo, or meet at the Rogers/Bentonville police-station safe-exchange zone. Each item is described honestly, including flaws.",
    topics: [
      "for sale",
      "selling",
      "garage sale",
      "storefront",
      "resale",
      "buy",
      "purchase",
      "marketplace",
      "items",
      "listings",
    ],
    source: "Resale storefront",
    priority: 7,
  },
  {
    id: "resale-peloton",
    text: "For sale: Peloton Bike+ full bundle — $549. Newer generation with the 24-inch rotating touchscreen and camera, factory reset and sitting at the 'Activate your Bike+' screen (clean handoff, no account attached). Includes two pairs of Peloton cycling shoes (women's 36 + a larger pair), a Peloton Heart Rate Band (in box), Peloton dumbbells, and the bike mat. Excellent condition. Buyer note: Peloton membership + one-time ~$95 used-bike activation is Peloton's policy for all secondhand bikes. Details: tylergranlund.com/resale/site/peloton-bike-plus — contact peloton@tylergranlund.com.",
    topics: ["peloton", "bike", "bike+", "exercise bike", "fitness", "spin"],
    source: "Resale storefront",
    priority: 6,
  },
  {
    id: "resale-alienware",
    text: "For sale: Alienware AW3423DWF 34-inch curved QD-OLED ultrawide monitor — $325 (retails $799.99 at Dell right now). 3440x1440, 165Hz, 0.1ms GtG, FreeSync Premium Pro, HDR True Black 400, 99.3% DCI-P3, 10-bit. Manufactured November 2024; panel verified — no burn-in, no dead pixels. Dell warranty checkable via service tag 8FJH2S3 at dell.com/support. Details: tylergranlund.com/resale/site/alienware-aw3423dwf — contact alienware@tylergranlund.com.",
    topics: ["alienware", "monitor", "ultrawide", "oled", "qd-oled", "dell", "gaming", "display"],
    source: "Resale storefront",
    priority: 6,
  },
  {
    id: "resale-weber",
    text: "For sale: Weber Spirit 3-burner NATURAL GAS grill — $275. Purchased new in 2020 and always kept under its heavy-duty Weber cover (included). Stainless lid, push-button ignition, lid thermometer. This is the natural-gas model — ideal for houses with a patio gas stub (common in Cornerstone-built neighborhoods like Centerton). LP/propane adapter included, though LOW runs hotter on propane. Details: tylergranlund.com/resale/site/weber-spirit-ng — contact hello@tylergranlund.com.",
    topics: ["weber", "grill", "natural gas", "bbq", "barbecue", "patio", "spirit"],
    source: "Resale storefront",
    priority: 6,
  },
  {
    id: "resale-mower",
    text: "For sale: Craftsman Platinum 21-inch self-propelled mower — $99. USA-built Briggs & Stratton 190cc Platinum engine (7.25 ft-lbs), EZ Walk variable-speed front-wheel drive, 21-inch steel 3-in-1 deck (bag/mulch/side discharge). Runs good, oil recently changed. Honest flaw: blade edge chewed from a rock — file it or replace for ~$15-25, priced accordingly. Also a fine engine donor for a go-kart project. Details: tylergranlund.com/resale/site/craftsman-mower — contact hello@tylergranlund.com.",
    topics: ["mower", "lawn mower", "craftsman", "briggs", "stratton", "lawn"],
    source: "Resale storefront",
    priority: 6,
  },
  {
    id: "resale-chair",
    text: "For sale: Colamy ergonomic mesh office chair — $75 (about $250-300 new from Amazon). Breathable mesh back with adjustable headrest, cushioned fabric seat, padded adjustable arms, chrome five-star base. Clean mesh, everything adjusts, rolls true — one owner, used for full-time remote work. Details: tylergranlund.com/resale/site/colamy-chair — contact hello@tylergranlund.com.",
    topics: ["chair", "office chair", "ergonomic", "mesh", "desk chair", "wfh"],
    source: "Resale storefront",
    priority: 6,
  },
];
