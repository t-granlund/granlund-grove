# North 40 Outfitters & Smith & Rogue Research Report

**Research Date:** 2025-06-16  
**Agent:** web-puppy-190c24  
**Status:** Complete (with one unresolved gap)

---

## Executive Summary

**North 40 Outfitters** is a regional farm, ranch, and outdoor retailer operating **12 stores** across **Montana, Idaho, and Washington**. The company was previously known as **"Big R"** until a rebranding in **July 2015**. Its parent company is **CSWW Inc.** (confirmed via website footer copyright).

**Smith & Rogue** — No verifiable connection to North 40 Outfitters or CSWW Inc. was found through any authoritative source. This may be a separate, unrelated entity, a very small/local brand, or an incorrect association.

---

## Key Findings at a Glance

| Question | Finding |
|---|---|
| **What is North 40 Outfitters?** | Farm, ranch, and outdoor retailer serving the Northwest |
| **Previous name?** | Big R (rebranded July 2015) |
| **Parent company?** | CSWW Inc. |
| **Store count?** | 12 stores |
| **States?** | Montana, Idaho, Washington |
| **Employees?** | 1,100+ |
| **Products?** | 120,000+ SKUs across 3,500+ brands |
| **E-commerce platform?** | Magento / Adobe Commerce |
| **Smith & Rogue connection?** | **No connection found** |

---

## What They Sell

From their website (https://north40.com/shop):

- **Farm & Ranch:** Feed, fencing, livestock supplies, equine, poultry
- **Workwear:** Boots, clothing, safety gear, FR (flame-resistant) apparel
- **Hunting & Shooting:** Firearms, ammunition, archery, optics, game calls
- **Fishing:** Rods, reels, tackle, fly fishing
- **Camping & Outdoor:** Tents, sleeping bags, cooking, knives
- **Pet Supplies:** Food, toys, grooming (including self-serve pet wash stations)
- **Automotive & Trailers:** Parts, accessories, towing
- **Services:** Hunting/fishing licenses, firearm transfers, archery ranges, propane, Buy Now Pay Later

---

## Store Locations (12 Total)

### Montana
1. **East Great Falls** — 1601 Market Place Drive, Great Falls, MT 59404
2. **West Great Falls** — 2220 10th Ave S, Great Falls, MT 59405
3. **Havre** — 1120 1st Street, Havre, MT 59501

### Idaho
4. **Coeur d'Alene** — 1375 W Prairie Ave, Hayden, ID 83835
5. **Ponderay** — 476863 Highway 95, Ponderay, ID 83852
6. **Lewiston** — 1921 19th Ave, Lewiston, ID 83501

### Washington
7. **Colville** — 1040 S Main St, Colville, WA 99114
8. **Mead** — 14220 N Market St, Mead, WA 99021
9. **Moses Lake** — 3215 W Broadway Ave, Moses Lake, WA 98837
10. **Omak** — 1010 Engh Rd, Omak, WA 98841
11. **Spokane** — 4303 N Market St, Spokane, WA 99207
12. **West Spokane** — 1804 W Francis Ave, Spokane, WA 99205

---

## E-Commerce Technology Stack

| Technology | Evidence | Source |
|---|---|---|
| **Magento / Adobe Commerce** | `mage/cookies`, `mage/storage`, `mage/translate`, `Magento_Ui/js/core/app` in JS bundles | Website JS analysis |
| **Yotpo** (reviews/UGC) | `yotpoWidgetsContainerId` in DOM | Homepage DOM |
| **LiveSearch** | `data-mage-init` attributes | Search functionality |
| **BreadPayments / Affirm** (BNPL) | `bread_config` object | Checkout-related JS |
| **New Relic** (APM) | `NREUM` beacon loader | Page header scripts |
| **WeltPixel GA4/GTM** | `weltpixel` object, GA4 tracking | Analytics JS |
| **Magefan Blog** | `/blog` route active | Website navigation |
| **PageBuilder** | Content structure patterns | CMS page layouts |

---

## Smith & Rogue Assessment

**Finding: No verifiable connection exists.**

Searches conducted:
- Direct search on North 40's website (navigation, footer, blog, store pages)
- News archive search via Great Falls Tribune
- General web search (blocked by CAPTCHA on major engines, but no references found in accessible content)
- PR Newswire search (0 results)

**Possible explanations:**
1. Smith & Rogue is a completely separate/unrelated entity
2. It is a very small local brand with no web presence
3. It may be a former/dormant brand not documented online
4. The name may have been provided in error or is a misremembered association

---

## Source Reliability

| Source | Tier | Assessment |
|---|---|---|
| north40.com (official) | **Tier 1** | Primary source — current data, direct from company |
| Great Falls Tribune | **Tier 2** | Local newspaper (Gannett/USA TODAY Network) — credible for regional business news |
| PR Newswire | **Tier 2** | Press release aggregator — no results found, but authoritative |
| Website JS/DOM analysis | **Tier 1** | Direct technical observation |

---

## Limitations

1. **Founding date unknown:** The "About" page does not state a founding year. The Big R→North 40 rebrand was in July 2015, but the original company's history is not documented in accessible sources.
2. **CSWW Inc. details sparse:** The parent company name appears only in the copyright footer. No independent information about CSWW's formation, ownership, or other holdings was found.
3. **Smith & Rogue:** No connection to North 40 could be verified.
4. **Google/DuckDuckGo searches blocked** by bot detection (CAPTCHA), limiting ability to search broader web archives.

---

## Files in This Research Directory

- `README.md` — This executive summary
- `sources.md` — Detailed source list with URLs and credibility notes
- `analysis.md` — Multi-dimensional analysis (security, cost, stability, etc.)
- `recommendations.md` — Contextual recommendations (if applicable to project)
- `raw-findings/` — Extracted text and screenshots from sources
