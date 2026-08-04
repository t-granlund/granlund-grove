# Granlund Grove — Page Review & Change Requests

**Generated:** 2026-06-25 · **Git HEAD:** `70265d7` · **Deployed:** `fafce2cf`
**Pages with change requests:** 4 · **Total notes:** 5

---

## How to use this handoff (next Code Puppy session)

1. Implement every change request below, page by page, in the `granlund-grove` repo.
2. For each change, add or extend coverage in the existing UAT/QA suite — Vitest (unit), Playwright (e2e), axe-core (a11y). No change ships without a test.
3. Run **three full rounds** of testing after implementation. Each round, all green, zero flakes:

   ```
   npm run build && npm run format:check && npm run lint && npm run typecheck && \
   npm run test:all && npx playwright test && python3 scripts/judge.py --skip-live
   ```

4. Standing rules (non-negotiable):
   - Accuracy is the product — never fabricate metrics; cross-check `docs/NUMBER_VERIFICATION.md` before changing any number.
   - Never hardcode a volatile metric (e.g. GitHub stars) — fetch at build time or drop it.
   - `src/routeTree.gen.ts` is generated — let the build regenerate it; never hand-edit.
   - Keep every source file < 600 lines. Preserve test-asserted strings. Never ship a red build.
   - Do **not** commit `docs/launch/` to the public repo.

---

## Change requests by page

### Career — `/career`

Live: https://tylergranlund.com/career

- [ ] for school of rock , we need more specific in the sense that I not only helped start and implement the master franchisor program when it comes to the IT operations and the overall playbook and system integrations, localization, merchant processing, data privacy, all that stuff. I also worked with all the domestic openings and oversaw 1.5 corporate-owned locations, making sure that they were having all of their support needs done with our help desk team. We had to do a mass security camera implementation across all the schools. We had to do some Wi-Fi upgrades across the schools. We also had our corporate offices that had hardware and printers and support that needed to happen. It was pretty much corporate schools, franchise schools, both domestic and international. Some of those were master franchise doors, and some of those were one-by-one franchises that we did internationally with someone. We also had the entire help desk support documentation, the management training that we did every month for new owners and managers and administrative staff that was on site during COVID. I then translated that to be an online short video module with a quiz section. We always had the pulse on working with the vendors to understand what we could and could not do at scale when it came to all the feature requests. Finally, the other thing that we can incorporate is that I implemented an online makeup booking option for students or parents to do for minors, which was the primary business. We also converted our entire business to an online music instruction capability using the G Suite commands with Google Workspace to deploy distribution groups in bulk that are specifically assigned to each location with defined parameters and access and instructions on how to use their own devices. For corporate schools, we had to order over 400 iPads and deploy them to a lot of this as well. We did a whole conversion of no remote lessons to full remote in about 10 days to two weeks. _(Jun 25 12:29 PM)_
- [ ] for The roles, in brief. section not just indicate that I am looking for an operations and systems engineer. It should be a broad scope type of role that is really just looking at anyone that's looking for someone that can come in and help orchestrate solving complex problems with their key stakeholders. It helps align everyone to a direction and path that allows for a functional, fast, iterative process that continues to drive success based on the customers' needs and the business's overlying budget requirements and operational procedures. To make sure that we're fully up to date on all of our security, data privacy, integration functionality, overall efficiencies, and making sure that any sort of IT debt or shadow IT is accounted for. It creates streamlined ways of working and communication that allow for full collaboration insight so that everyone can be held accountable in a way that supports collaboration and doesn't pinpoint anyone specifically. It helps people understand the needs and why behind different ways of working. _(Jun 25 12:31 PM)_

### Work — `/work`

Live: https://tylergranlund.com/work

- [ ] I am great on showcasing the case studies, but ultimately what I really want to do is have everything that is related to the actual open source repositories that we are putting together when it comes to the tenant hub and all the different tools and open source repos that we put together. We need to make sure that all of the actual GitHub landing pages for each one of those repos is fully aligned with the current design system that we have and is taking advantage of every possible 3js or visual animation and artifacts that we can put together to really captivate and help ensure the vision, mission, and value of all of these repositories, both individually and also as a collective, and what it can enable and help institute within any business, small, medium, large, or extra large, all with their own specific nuances that can be scaled up and down. The framework itself is what helps solve a lot of technical debt or money you might spend on scoping this type of infrastructure out, because it should. This is what we also need to double check: have a fully agnostic approach. Whether you're using Azure, Google Workspace, or other identity platforms like Okta, Ping Identity, any of the tools that are out there that allow for identity management through single sign-on authorization, SAML 2.0, all the stuff that we implemented with the service principles to have them be authorized and set up with OIDC fed credentials per environment. All these types of efficiencies help also create security and peace of mind. Let's just really run with it, be creative, and make sure that all of this entire page in terms of work is translated into tangible things that we can just speak on behalf of the types of business problems that we solved. Have the generalized and entire framework written out for each one of the different components, and then have one final page that showcases all of the nuances of what this all puts together and gives you. Again, this is something that I'm open to ideas, but I need you to research and make sure that every single aspect of this is fully dialed in and replaced based off of the requirements that I just indicated. _(Jun 25 12:35 PM)_

### Writing — index — `/writing`

Live: https://tylergranlund.com/writing

- [ ] I want all of these writing articles to be more of a broad-stroke, generalized point of view that doesn't specifically talk about anything that I specifically did with a company. It talks about a more generalized approach on the types of problems that I saw and what could be done to help implement them. Based off of this, we can incorporate the "What Will Be the New Work Tab", which is all of the realized public repos that we are looking to open source that are agnostic. They can be a linked-off resource from these articles that speak to a deeper dive and more specific implementation. If you're looking for more information _(Jun 25 12:36 PM)_

### /ecosystem → redirect — `/ecosystem`

- [ ] System and work pages are essentially what need to be merged, and so the ecosystem page can be removed. Everything can be funneled into the work page based off of all the notes I had indicated. _(Jun 25 12:37 PM)_

---

## Full page inventory (reference)

Snapshot of what every route ships today — context for the changes above.

### Home — `/` · _indexable_

- **Purpose:** The landing experience — hero with the interactive 3D globe network.
- **Sections:** Nav (sticky) → Hero — name + role + tagline (h1) → 3D globe — 22 cities, 5 continents, culled labels → Positioning / intro copy → CTA scrim → Work / Contact → Footer → Floating chatbot (site-wide)
- Lazy-loaded React Three Fiber globe (~941 kB chunk)
- Front-face culling + screen-space label de-collision (max 9 visible)
- Pauses rotation under prefers-reduced-motion
- Globe wrapped in ErrorBoundary — WebGL throw can't crash the page
- JSON-LD: Person + WebSite graph
- **SEO:** Indexable. Title: 'Tyler Granlund — IT Operations & Systems Engineer'.

### About — `/about` · _indexable_

- **Purpose:** Bio, skill set, and working philosophy.
- **Sections:** Nav → Bio / intro (h1) → Skills grid — 6 groups → Philosophy → Headshot → Footer
- 6 skill groups
- Responsive headshot (Picture component)
- JSON-LD: ProfilePage
- **SEO:** Indexable.

### Career — `/career` · _indexable_

- **Purpose:** Career journey + measurable impact, structured resume-style.
- **Sections:** Nav → Journey timeline — 5 steps, scroll-linked (h1) → Role cards → Impact section → Scroll-linked world map — 14 countries → Footer
- GSAP ScrollTrigger timeline ↔ map sync (center-based tracking)
- World map with de-overlapped (greedy-collision) labels
- 14-country count (reconciled site-wide)
- Content single-sourced from src/lib/career-data.ts
- **SEO:** Indexable.

### Work — `/work` · _indexable_

- **Purpose:** Flagship case studies plus the open-source TenantFleet ecosystem.
- **Sections:** Nav → Projects hero (h1) → Case studies ×6 — Control Tower, Knowledge Fabric, Estate Trace, Zero-secret automation, Mysa Mail, TenantFleet Ecosystem → Ecosystem (#ecosystem) — 7 repos + architecture + workflow diagrams + value props + CTA → Code Puppy — 'the engine behind all of it' → Passions → Footer
- 6 case studies, each with metrics + tags
- 7-repo ecosystem grid (RepoCards: Live Site + GitHub links)
- Ecosystem + workflow SVG diagrams
- #ecosystem is the anchor target of the /ecosystem redirect
- JSON-LD: ItemList of SoftwareApplication
- PENDING Phase 4: replace ∞ RepoCard metrics + de-hardcode the star count
- **SEO:** Indexable. Largest page. ∞-metric + star-count accuracy fixes queued in Phase 4.

### Writing — index — `/writing` · _indexable_

- **Purpose:** Field-notes blog index.
- **Sections:** Nav → Index hero — 'Notes from the work' (h1) → Post list — 2 posts → Footer
- Lists posts from src/lib/writing/posts.ts
- JSON-LD: CollectionPage
- 2 posts live (post #3 'Deploy in 15 min' queued in Phase 4)
- **SEO:** Indexable.

### Post #1 — Running IT with AI agents — `/writing/running-it-for-200-locations-with-ai-agents` · _indexable_

- **Purpose:** Supervised AI agents across a 200+ location franchise group.
- **Sections:** Nav → Back link → /writing → Article header (h1) + tags → Body — 6 × h2 sections → CTA — Let's talk / case studies → Footer
- ~6 min read
- JSON-LD: BlogPosting
- OG article tags + article:published_time + canonical
- **SEO:** Indexable.

### Post #2 — Identity-aware RAG — `/writing/building-identity-aware-rag` · _indexable_

- **Purpose:** Building Knowledge Fabric so identity filters retrieval.
- **Sections:** Nav → Back link → /writing → Article header (h1) + tags → Body — 6 × h2 sections → CTA — Let's talk / case studies → Footer
- ~6 min read
- JSON-LD: BlogPosting
- OG article tags + article:published_time + canonical
- **SEO:** Indexable.

### Ventures — `/ventures` · _indexable_

- **Purpose:** Side ventures and pilots.
- **Sections:** Nav → Hero (h1) → Spruce Grove Media · Bentonville Brewing · Zipline/Walmart pilot → Footer
- 3 venture cards
- **SEO:** Indexable.

### Résumé — `/resume` · _indexable_

- **Purpose:** Downloadable résumé variants.
- **Sections:** Nav → Hero (h1) → PDF variant cards ×3 — Master, AI-PM, FDE → Footer
- 3 downloadable PDFs (public/resume/\*.pdf)
- CONFIRM: HTT line should read 'Jan 2026 – June 2026' (human edit, source tool)
- **SEO:** Indexable.

### Contact — `/contact` · _indexable_

- **Purpose:** Contact form + channels.
- **Sections:** Nav → Hero (h1) → Contact form — name / email / message + honeypot → Channel cards — email · LinkedIn · GitHub → Footer
- POST /api/contact → Resend (live, verified)
- Honeypot spam guard (hidden 'company' field)
- Rate-limit currently implicit via Cloudflare (native binding queued)
- **SEO:** Indexable.

### Colophon — `/colophon` · _noindex_

- **Purpose:** Build stack + credits.
- **Sections:** Nav → Hero (h1) → Stack / credits → Footer
- robots: noindex
- **SEO:** noindex.

### Privacy — `/privacy` · _noindex_

- **Purpose:** Privacy policy.
- **Sections:** Nav → Hero (h1) → Policy sections → Footer
- robots: noindex
- **SEO:** noindex.

### /ecosystem → redirect — `/ecosystem` · _redirect_

- **Purpose:** 307 redirect to /work#ecosystem (section was folded into Work).
- **Sections:** beforeLoad → redirect to /work#ecosystem
- No page rendered — keeps old bookmarks/links working
- **SEO:** Redirect (307).

### /sitemap.xml — `/sitemap.xml` · _system_

- **Purpose:** XML sitemap.
- **Sections:** Server route → XML response
- 10 URLs
- Build-time LAST_MODIFIED constant
- Cache-Control public, max-age=3600
- **SEO:** Machine-readable.

### /api/contact — `/api/contact` · _system_

- **Purpose:** Contact form backend.
- **Sections:** POST handler → validate → Resend
- Honeypot check
- Returns {ok:false} if RESEND_API_KEY missing
- **SEO:** API endpoint.

---

_Generated by the Granlund Grove page-review board._
