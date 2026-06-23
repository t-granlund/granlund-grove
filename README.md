# granlund-grove

Tyler Granlund's personal portfolio — "a grove carved in code." Dark-mode-only, Nordic forest aesthetic (charcoal + deep spruce + warm cedar accents). Deployed at [tylergranlund.com](https://tylergranlund.com).

## Current State (2026-06-18)

|             |                                                                               |
| ----------- | ----------------------------------------------------------------------------- |
| **Stack**   | TanStack Start, React 19, Vite 7, Tailwind CSS 4, shadcn/ui, Three.js (globe) |
| **Hosting** | Cloudflare Workers + Pages (custom domain: `tylergranlund.com`)               |
| **Tests**   | 75/75 e2e (Playwright), 42/42 unit (Vitest), 0 axe violations                 |
| **Build**   | Clean — TypeScript, lint, format all green                                    |
| **Version** | `e3c3a80` on `main` → deployed `3ff4a4f2`                                     |

## Quick Commands

```bash
npm run dev           # local dev server
npm run build         # production build
npm run test          # unit + architecture tests
npm run test:e2e      # Playwright e2e + a11y
npm run test:all      # typecheck + unit + e2e
npm run format        # Prettier
npm run lint          # ESLint
npm run deploy        # build + wrangler deploy (needs .cloudflare.env)
```

## Key Files

| File                          | Purpose                                             |
| ----------------------------- | --------------------------------------------------- |
| `src/routes/**`               | TanStack file-based routes                          |
| `src/components/site/**`      | Page components (Hero, Career, Work, Contact, etc.) |
| `src/lib/chatbot/**`          | Chatbot engine + knowledge base                     |
| `src/lib/security-headers.ts` | CSP, HSTS, XFO — single source of truth             |
| `docs/NUMBER_VERIFICATION.md` | Metric verification gate (30/30 verified)           |
| `docs/planning/**`            | Backlog Decision Store (BDS)                        |
| `scripts/judge.py`            | Launch-readiness scoring (20/26, site live)         |

## Design System

- **Colors:** OKLCH semantic tokens — `spruce-deep`, `cedar`, `mist`, `border`
- **Fonts:** Self-hosted variable — Fraunces (display), Inter (body), JetBrains Mono (mono)
- **Animation:** CSS transforms + IntersectionObserver first, Framer Motion for orchestration
- **Accessibility:** Skip link, reduced-motion support, axe-core scanning every build

## Contact

- Email: [hello@tylergranlund.com](mailto:hello@tylergranlund.com) → forwards to `tygranlund@icloud.com`
- Based in Bella Vista, Arkansas
