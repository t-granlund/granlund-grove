# Raw Findings: Extracted Content from Sources

## Source 1: North 40 Outfitters Homepage (north40.com)

**URL:** https://north40.com  
**Date accessed:** 2025-06-16

### Key DOM/Content Extracts:

**Company Description:**
> "Your Outfitter for Work, Play, & Everything in Between"

**Value Proposition:**
> "North 40 Outfitters is your go-to destination for farm, ranch, and outdoor gear. We're dedicated to providing the best products and services to our community."

**Technology Evidence (from page source):**
```html
<div id="yotpoWidgetsContainerId" class="yotpo yotpo-main-widget"></div>
<script type="text/x-magento-init">
{"*": {"Magento_Ui/js/core/app": {"components": {...}}}}
</script>
```

**JavaScript require-config confirms Magento:**
```javascript
var require = {
    "baseUrl": "https://north40.com/static/frontend/...",
    "paths": {
        "mage/cookies": "mage/cookies",
        "mage/storage": "mage/storage",
        "mage/translate": "mage/translate",
        "Magento_Ui/js/core/app": "Magento_Ui/js/core/app"
    }
};
```

**BreadPayments configuration:**
```javascript
var bread_config = {
    "customCSS": "...",
    "actAsLabel": true,
    "allowCheckOut": false,
    "buttonLocation": "..."
};
```

**New Relic monitoring:**
```javascript
window.NREUM || (NREUM = {});
NREUM.info = {
    "beacon": "bam.nr-data.net",
    "errorBeacon": "bam.nr-data.net",
    "licenseKey": "...",
    "applicationID": "..."
};
```

---

## Source 2: North 40 Outfitters About Page (north40.com/about-us)

**URL:** https://north40.com/about-us  
**Date accessed:** 2025-06-16

### Full Text Extract:

**Hero Section:**
> "It's Not Enough to Have Great Products"
> "for us, it's about being a solution, an answer. It's about being the best, most genuine resource for everything farm, ranch, and outdoors for the people who are out there living it and working in it every day."

**"Outfitting Work & Play" Section:**
> "To tell the story of North 40 Outfitters is to tell a success story of the people of the Northwest. We do what we love, and we love what we do because we're passionate. We're dedicated. We give it all we've got and then we get up in the morning and do it all over again. We're farmers and ranchers. We're barrel racers and river chasers. We're honest. We're helpful. And our families, our friends, and our communities are everything. This is us. This is who we are. It's what we do every day."

**Stats Grid (confirmed by visual inspection):**
- **12 Stores & Counting**
  - "Working hard to bring convenience and service to our loyal customers. We currently have 12 locations and counting. Can't visit us in person? Shop online."
- **Over 120,000 Products**
  - "We go out of our way to bring our customers quality products they can trust. We carry over 3,500 brands and over 120,000 products."
- **1,100 Employees & Growing**
  - "We employ over 1,100 hardworking, dedicated staff and, to us, they're family. Want to work for us? Check out our careers."
- **Mid-States Member**
  - "Being a Mid-States member allows us to have buying power with our vendors, meaning, we can pass our savings onto our customers."
- **3 States & Beyond**
  - "We work and play in the rivers, lakes, mountains, and plains of the Northwest. Our stores are located in three states; Montana, Idaho, and Washington."
- **One Vintage Dodge Truck**
  - "She's a classic. A source of pride and joy, our beloved 1951 Dodge truck, affectionately named Cecelia, is one of a kind."

**Cecelia Story:**
> "Meet Cecelia"
> "Found in a field in Omak, Washington with sagebrush growing out of her engine, Cecelia is named after Mount Cecelia in Montana. Expertly restored by a team of local Montana mechanics, she's a pristinely restored 1951 B3 Dodge cab-over stake truck. We love showing her off in parades!"

**Footer — Company Info:**
> "© 2025 CSWW Inc. All Rights Reserved. Use of this site is subject to certain Terms of Use which constitute a legal agreement between you and North 40 Outfitters."

**Footer — Contact:**
- Call Us: 844.466.8440
- E-Mail Us: support@north40.com

**Footer — Social Links:**
- Facebook
- Instagram
- YouTube

---

## Source 3: North 40 Outfitters Store Locator (north40.com/store-locator)

**URL:** https://north40.com/store-locator  
**Date accessed:** 2025-06-16

### Store List with Addresses:

| # | Store | Address |
|---|---|---|
| 1 | East Great Falls | 1601 Market Place Drive, Great Falls, MT 59404 |
| 2 | West Great Falls | 2220 10th Ave S, Great Falls, MT 59405 |
| 3 | Havre | 1120 1st Street, Havre, MT 59501 |
| 4 | Coeur d'Alene | 1375 W Prairie Ave, Hayden, ID 83835 |
| 5 | Ponderay | 476863 Highway 95, Ponderay, ID 83852 |
| 6 | Lewiston | 1921 19th Ave, Lewiston, ID 83501 |
| 7 | Colville | 1040 S Main St, Colville, WA 99114 |
| 8 | Mead | 14220 N Market St, Mead, WA 99021 |
| 9 | Moses Lake | 3215 W Broadway Ave, Moses Lake, WA 98837 |
| 10 | Omak | 1010 Engh Rd, Omak, WA 98841 |
| 11 | Spokane | 4303 N Market St, Spokane, WA 99207 |
| 12 | West Spokane | 1804 W Francis Ave, Spokane, WA 99205 |

---

## Source 4: North 40 Outfitters Blog (north40.com/blog)

**URL:** https://north40.com/blog  
**Date accessed:** 2025-06-16

### Sample Blog Post Titles:
- "Best Turkey Decoys for Spring Hunting"
- "DIY Chicken Coop Ideas"
- "How to Choose the Right Fishing Rod"
- "Spring Gardening Tips for the Northwest"
- "Preparing Your Horse for Spring Riding"

**Platform:** Magefan Blog (Magento extension)

---

## Source 5: Great Falls Tribune Search Results

**URL:** https://www.greatfallstribune.com/search/?q=North+40+Outfitters  
**Date accessed:** 2025-06-16

### Key Article Found in Search Results:

**Title:** "Big R is now North 40 Outfitters"  
**Author:** Jo Dee Black  
**Date:** July 24, 2015

**Context from search results page:**
The article appears in a list of search results alongside other local business and outdoor lifestyle articles. The title explicitly confirms a rebranding event from "Big R" to "North 40 Outfitters" in 2015.

**Other related articles by same author/topic:**
- "Something for everyone at What Women Want Expo"
- "Fall activities lead up to Halloween"
- "Montana rifle hunting season opening day spurs sales"

**Note:** Direct article URL could not be reconstructed. Gannett/USA TODAY Network articles typically use numeric IDs in URLs, but attempts to access the article returned 404. The article may be behind an archive wall or the URL pattern may differ from the expected format.

---

## Source 6: Services Page Analysis

**URL:** https://north40.com/services  
**Date accessed:** 2025-06-16

### Services Identified:

**Retail Services:**
- Hunting & Fishing Licenses
- Firearm Sales & Transfers
- Archery Range
- Pet Wash Stations
- Propane Refill/Exchange
- Buy Now, Pay Later (Bread/Affirm)
- Gift Cards

**Customer Support:**
- "Real Customer Support" — "We are here to help you. Yes, really! We are real people who can give you real solutions."

---

## Source 7: PR Newswire Search Results

**URL:** https://www.prnewswire.com/search/?keyword=North+40+Outfitters  
**Date accessed:** 2025-06-16

### Result:
> "Displaying Results 1-0 of 0 'North 40 Outfitters'"
> "No results found. Please change your search terms and try again."

**Interpretation:** North 40 Outfitters has not issued press releases through PR Newswire, or they do not actively use formal press release distribution.
