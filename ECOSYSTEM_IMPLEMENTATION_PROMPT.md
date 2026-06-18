# TenantFleet Ecosystem Page — Implementation Prompt

## Context

This is for the granlund-grove personal site (tylergranlund.com), a TanStack Router + React + Tailwind CSS + shadcn/ui application. You need to add a new `/ecosystem` route that showcases the TenantFleet open-source ecosystem — 7 repos for multi-tenant Microsoft Entra ID governance.

## Files Already Created (in this repo)

These files already exist and are ready to integrate:

| File                                                | Purpose                           |
| --------------------------------------------------- | --------------------------------- |
| `src/routes/ecosystem.tsx`                          | Route definition for `/ecosystem` |
| `src/components/site/EcosystemPage.tsx`             | Main page component               |
| `src/components/site/RepoCard.tsx`                  | Individual repo card              |
| `src/components/site/diagrams/EcosystemDiagram.tsx` | SVG architecture diagram          |
| `src/components/site/diagrams/WorkflowDiagram.tsx`  | SVG workflow diagram              |

Also modified:

- `src/components/site/Nav.tsx` — "Ecosystem" link added to nav
- `src/components/site/Projects.tsx` — Case study updated to reference ecosystem

## What You Need To Do

### 1. Verify the route is registered

Check `src/routeTree.gen.ts` — it should have an `EcosystemRoute` import. If the route file exists but isn't in the route tree, run:

```bash
npm run dev
# or
npx tsr generate
```

TanStack Router's file-based routing should auto-discover `src/routes/ecosystem.tsx`.

### 2. Verify TypeScript compiles

```bash
npx tsc --noEmit
```

Should return zero errors.

### 3. Build and test locally

```bash
npx vite build
npx vite --port 5173
# Open http://localhost:5173/ecosystem
```

### 4. Commit and deploy

```bash
git add -A
git commit -m "feat: add TenantFleet ecosystem page"
git push origin main
# Deploy via your existing pipeline (Cloudflare Pages / GitHub Pages)
```

## Design System Reference

The site uses these Tailwind conventions:

```
--cedar: oklch(0.78 0.12 55)       /* warm accent */
--stone: oklch(0.85 0.012 90)      /* body text */
--mist: oklch(0.94 0.008 100)      /* headings */
--spruce: oklch(0.32 0.045 158)    /* secondary */
--spruce-deep: oklch(0.22 0.03 158)/* backgrounds */
--card: oklch(0.22 0.014 155)      /* card bg */
--border: oklch(0.3 0.018 150 / 0.6)
```

Typography:

- `font-display` — headings (light weight, tight leading)
- `font-mono` — labels, metrics, captions (uppercase, tracking-wide)
- `text-balance` — balanced text wrapping

Utility classes used:

- `lift` — hover lift effect on cards
- `topo-divider` — decorative top border
- `SectionLabel` — numbered section headers ("01 The Work")

## Key Components

### EcosystemPage

- 6 sections: Hero, Architecture Diagram, Repo Grid, Workflow, Value Props, CTA
- 7 repos defined in the `repos` array with full metadata
- All links point to `t-granlund.github.io/{repo}` and `github.com/t-granlund/{repo}`

### RepoCard

- Props: `{ repo: Repo }` where `Repo` has `name`, `tagline`, `description`, `pillar`, `metrics[]`, `stack[]`, `github`, `pages`, `features[]`
- Pillar color coding: mind=indigo, body=orange, spirit=emerald
- Shows top 4 features, all stack tags, live site + GitHub links

### EcosystemDiagram

- SVG, 900x520 viewBox
- Three columns: Mind (left), Body (center), Spirit (right)
- 7 repo nodes with connecting dashed lines
- Shared design system banner at bottom

### WorkflowDiagram

- SVG, 800x560 viewBox
- Three phases: Infrastructure, Governance, Operations
- 9 step boxes with arrows and feedback loops
- Gate banner at bottom ("Each phase gated by automated tests...")

## Acceptance Criteria

- [ ] `/ecosystem` loads without 404
- [ ] All 7 repo names appear on the page
- [ ] All 7 "Live Site" links go to `t-granlund.github.io/{repo}`
- [ ] All 7 "GitHub" links go to `github.com/t-granlund/{repo}`
- [ ] SVG diagrams render without overflow on mobile
- [ ] Navigation shows "Ecosystem" link
- [ ] TypeScript compiles with zero errors
- [ ] Build completes successfully
- [ ] Works at `tylergranlund.com/ecosystem` after deploy

## Live References

| Repo            | GitHub                                 | Live Site                             |
| --------------- | -------------------------------------- | ------------------------------------- |
| TenantFleet     | github.com/t-granlund/tenantfleet      | t-granlund.github.io/tenantfleet      |
| HubForge        | github.com/t-granlund/hubforge         | t-granlund.github.io/hubforge         |
| EntraGroups     | github.com/t-granlund/entragroups      | t-granlund.github.io/entragroups      |
| TenantForge     | github.com/t-granlund/tenantforge      | t-granlund.github.io/tenantforge      |
| DNSGuard        | github.com/t-granlund/dnsguard         | t-granlund.github.io/dnsguard         |
| RampGuard       | github.com/t-granlund/rampguard        | t-granlund.github.io/rampguard        |
| SharePointAgent | github.com/t-granlund/sharepoint-agent | t-granlund.github.io/sharepoint-agent |

## Troubleshooting

**If TanStack Router doesn't auto-discover the route:**

- Ensure `src/routes/ecosystem.tsx` uses `createFileRoute("/ecosystem")`
- Restart dev server
- Run `npx tsr generate` manually

**If SVG diagrams overflow on mobile:**

- They use `viewBox` + `className="w-full h-auto"` which should be responsive
- Add `overflow-x-auto` to the parent container if needed

**If colors don't match the design system:**

- Check `src/styles.css` for the actual CSS custom properties
- The diagrams use `var(--cedar)`, `var(--stone)`, etc. where possible
- Hardcoded OKLCH values are fallbacks

## Final Checklist

```bash
cd /Users/tygranlund/dev/projects/granlund-grove
npx tsc --noEmit                    # TypeScript check
npx vite build                      # Production build
git add -A
git commit -m "feat: add TenantFleet ecosystem page"
git push origin main              # Deploy
```

---

_This prompt is self-contained. Any developer with access to the granlund-grove repo can execute it._
