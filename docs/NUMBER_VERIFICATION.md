# Number Verification Gate -- Granlund Grove

> **bd:** dev-kxh (T1.3) | **judge criterion:** G3.2 | **Owner:** Tyler
>
> Every public-facing metric on tylergranlund.com must be confirmed here before
> it ships. Against AI-generated application spam, verifiable specifics are the
> differentiator -- but a wrong number is worse than no number.
>
> **How the judge reads this file:** G3.2 passes only when this file contains
> the word `VERIFIED` and has **zero** unchecked `[x]` boxes. Tick each box to
> `[x]` once you've confirmed the figure against its source, then change the
> status line at the bottom to `VERIFIED`.

---

## Positioning (Hero + Prologue) -- bd dev-ejm, dev-f05

| #   | Claim                             | Source to confirm               | Confirmed |
| --- | --------------------------------- | ------------------------------- | --------- |
| 1   | **19 systems** live in production | system inventory / Estate Trace | [x]       |
| 2   | **5 brands**                      | org chart                       | [x]       |
| 3   | **200+ locations**                | franchise count                 | [x]       |

## Case Study: Control Tower -- bd dev-b39

| #   | Claim                               | Source          | Confirmed |
| --- | ----------------------------------- | --------------- | --------- |
| 4   | **7,386** automated tests           | CI test count   | [x]       |
| 5   | **48/48** automated judge score     | judge.py output | [x]       |
| 6   | **5 Microsoft tenants**             | tenant list     | [x]       |
| 7   | **v2.5.0 in production, June 2026** | release tag     | [x]       |

## Case Study: Knowledge Fabric -- bd dev-k4v

| #   | Claim                                 | Source               | Confirmed |
| --- | ------------------------------------- | -------------------- | --------- |
| 8   | **100K+ Freshdesk tickets**           | Freshdesk export     | [x]       |
| 9   | **1,523 verified humans**             | Entra identity count | [x]       |
| 10  | **15-slot attribute schema**          | schema doc           | [x]       |
| 11  | **Phase 1 closed at 52/52 QA checks** | QA report            | [x]       |

## Case Study: Estate Trace -- bd dev-r76

| #   | Claim                                                  | Source                                                                   | Confirmed |
| --- | ------------------------------------------------------ | ------------------------------------------------------------------------ | --------- |
| 12  | **41 repos**                                           | identity-register.csv + repo-inventory-raw.json (both = 41)              | [x]       |
| 13  | **11 subscriptions**                                   | Azure                                                                    | [x]       |
| 14  | **196 Azure resources**                                | live inventory 2026-06-05 (\_counts.csv; 178 was the stale April export) | [x]       |
| 15  | **12/12 verification checks**                          | MASTER-WORKBOOK-STATUS-2026-06-08.md                                     | [x]       |
| 16  | **~$12.2K/mo IT run-rate** ($12,167)                   | canonical 6/8 workbook, Technology dept (read via DuckDB)                | [x]       |
| 17  | **~40% optimization path** (Fabric F64 ~54%, ~$79K/yr) | WEBSITE-NUMBER-RECONCILIATION.md                                         | [x]       |
| 18  | **25 prioritized remediation actions**                 | workbook                                                                 | [x]       |

## Case Study: Zero-secret automation -- bd dev-oyi

| #   | Claim                                                       | Source                | Confirmed |
| --- | ----------------------------------------------------------- | --------------------- | --------- |
| 19  | **5 tenants**, workload identity federation, **no secrets** | GitHub Actions config | [x]       |

## Case Study: Mysa Mail -- bd dev-9af

| #   | Claim                  | Source     | Confirmed |
| --- | ---------------------- | ---------- | --------- |
| 20  | **5 classifiers**      | code       | [x]       |
| 21  | **5,700+ LOC backend** | cloc       | [x]       |
| 22  | **WCAG 2.2 AA**        | axe report | [x]       |

## Case Study: Group Management Hub (alt) -- bd dev-461

| #   | Claim           | Source      | Confirmed |
| --- | --------------- | ----------- | --------- |
| 23  | **7,984 tests** | CI          | [x]       |
| 24  | **4 tenants**   | tenant list | [x]       |
| 25  | **334 groups**  | Entra       | [x]       |
| 26  | **WCAG AA**     | axe report  | [x]       |

## Career / dates (already in Career.tsx) -- bd dev-eqz

| #   | Claim                                                             | Source | Confirmed |
| --- | ----------------------------------------------------------------- | ------ | --------- |
| 27  | HTT Brands: IT Ops & Systems Engineer (Jan 2026 — June 2026)      | resume | [x]       |
| 28  | HTT Brands: IT Director (Oct 2024-Jan 2026)                       | resume | [x]       |
| 29  | Outdoor Cap: IT PM I to II (2022-2023)                            | resume | [x]       |
| 30  | School of Rock: IT Manager to Sr IT Manager (Apr 2015 — Jan 2022) | resume | [x]       |

---

## Status

**VERIFIED** -- 30/30 confirmed. Non-financial (28/30) confirmed by Tyler
2026-06-11 (bd dev-kxh closed). Financials #16/#17 resolved 2026-06-11 by the
Estate-Trace data reconciliation (bd dev-jgu.2): the "~$12K/mo" figure traced to
the canonical 6/8 workbook (Technology dept = $12,167/mo, read via DuckDB; passed
12/12 checks), and the "~40% optimization" is conservative — pausing the single
Fabric F64 capacity ($6,606/mo, ~$79K/yr) is ~54% of IT run-rate. The site copy
now labels it the _IT/Technology_ run-rate to distinguish it from whole-company
SaaS (~$38.7K/mo).

> Caveat (permanent): the Fabric F64 line ($6,606/mo) is a list-price mid-band
> estimate ($5,003-8,410). Its exact MCA invoice is unobtainable (Tyler has left
> HTT), so mid-band is best-and-final. It is the optimization story regardless.

_Last reviewed: 2026-06-18 — dates reconciled to site copy (HTT Ops end June 2026, SoR end Jan 2022). Non-financial by Tyler Granlund; financials by Estate-Trace reconciliation (code-puppy / Richard), Tyler-approved._
