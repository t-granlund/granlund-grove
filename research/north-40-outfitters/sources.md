# Sources & Credibility Assessment

## Primary Sources (Tier 1)

### 1. North 40 Outfitters Official Website
- **URL:** https://north40.com
- **Type:** Primary source — company-owned
- **Currency:** Active (2025), copyright reads "© 2025 CSWW Inc."
- **Authority:** Official brand website
- **Validation:** Self-reported, but direct from company
- **Key data extracted:**
  - Store locator with 12 locations
  - Product categories (farm, ranch, hunting, fishing, workwear, pet, automotive)
  - Services (licenses, firearm transfers, archery range, pet wash, propane, BNPL)
  - Blog content (Magefan platform)
  - About Us page: "12 Stores & Counting," "1,100 Employees & Growing," "120,000+ Products"
  - Parent company: CSWW Inc.
  - Mid-States buying group membership
  - Cecelia — 1951 B3 Dodge truck mascot

### 2. North 40 Outfitters Store Locator
- **URL:** https://north40.com/store-locator
- **Type:** Primary source — official store directory
- **Currency:** 2025
- **Authority:** Official
- **Key data:** Complete addresses for all 12 store locations

### 3. Website DOM & JavaScript Analysis
- **Method:** Direct browser inspection of HTML/JS bundles
- **Type:** Primary technical observation
- **Authority:** Unbiased — direct code observation
- **Key findings:**
  - `require-config.js` references Magento paths (`mage/`, `Magento_Ui/`)
  - `yotpoWidgetsContainerId` confirms Yotpo integration
  - `bread_config` confirms BreadPayments/Affirm BNPL
  - `NREUM` loader confirms New Relic APM
  - `weltpixel` object confirms GA4/GTM tracking
  - `Magefan_Blog` confirms blog platform

---

## Secondary Sources (Tier 2)

### 4. Great Falls Tribune — "Big R is now North 40 Outfitters"
- **URL:** Search results page: https://www.greatfallstribune.com/search/?q=North+40+Outfitters
- **Article title:** "Big R is now North 40 Outfitters"
- **Author:** Jo Dee Black
- **Date:** July 24, 2015
- **Type:** Local news article
- **Authority:** Gannett/USA TODAY Network newspaper — credible for regional business news
- **Validation:** Newspaper archive, independent journalist
- **Note:** Direct article URL could not be accessed (404 on reconstructed URL), but the title and author are confirmed in search results page text.

### 5. PR Newswire Search
- **URL:** https://www.prnewswire.com/search/?keyword=North+40+Outfitters
- **Type:** Press release database
- **Result:** 0 results found
- **Authority:** Major press release aggregator
- **Note:** No press releases from North 40 Outfitters found in this database

---

## Tertiary / Attempted Sources

### 6. LinkedIn — North 40 Outfitters Company Page
- **URL:** https://www.linkedin.com/company/north-40-outfitters/
- **Result:** Blocked — requires login
- **Note:** Could not access company info, employee count, or history

### 7. Montana Secretary of State Business Search
- **URL:** https://biz.sosmt.gov/search/business
- **Result:** Page loaded but search form requires interaction
- **Note:** Could not query CSWW Inc. due to form complexity

### 8. Better Business Bureau
- **URL:** Attempted: https://www.bbb.org/us/mt/great-falls/profile/sporting-goods/north-40-outfitters-1296-17001362
- **Result:** Blocked by Cloudflare challenge

### 9. Google / DuckDuckGo Search
- **Result:** Blocked by CAPTCHA/bot detection on both engines
- **Limitation:** Prevented broader web search for historical information

---

## Source Reliability Summary

| Source | Tier | Reliability | Bias | Currency |
|---|---|---|---|---|
| north40.com | 1 | High | Low (self-reported) | Current (2025) |
| Store Locator | 1 | High | Low | Current |
| JS/DOM analysis | 1 | High | None | Current |
| Great Falls Tribune | 2 | High | Low | 2015 (historical) |
| PR Newswire | 2 | High | Low | N/A (no results) |
| LinkedIn | N/A | N/A | N/A | Blocked |
| MT SOS | N/A | N/A | N/A | Inaccessible |
| BBB | N/A | N/A | N/A | Blocked |
