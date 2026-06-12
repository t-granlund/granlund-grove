// Estate Trace deep-dive sections — rendered inside the case-study modal.
// Intentionally generalized for public viewing: achievement framing,
// no client-specific dollar amounts or vendor contract details.

// Figures relativized as a share of realized savings (no raw client dollars)
// pending the financial-number verification gate (bd dev-jgu.2).
const SAVINGS = [
  { item: "M365 licensing consolidation", how: "migrated to managed bundle", result: "27%" },
  { item: "Cloud storage overprovisioning", how: "right-sized and cancelled", result: "15%" },
  { item: "License tier right-sizing", how: "Standard \u2192 Basic where fit", result: "12%" },
  { item: "Unused SaaS add-ons", how: "cancelled 3 subscriptions", result: "16%" },
  { item: "Decommissioned infra", how: "firewall + database removed", result: "13%" },
  { item: "Additional vendor consolidations", how: "various", result: "17%" },
] as const;

const FEATURES = [
  "Brand \u2192 vendor \u2192 invoice \u2192 line-item drill-down across all tenants",
  "Full vendor register with contract terms and renewal dates",
  "Invoice traces back to source across all payment channels",
  "Azure line-item cost attribution across subscriptions",
  "MSP / reseller billing separated from direct charges",
  "Confidence tag on every figure \u2014 live pull \u00b7 estimate \u00b7 needs pull",
  "Prioritized remediation action list (P0 / P1 / P2)",
  "12/12 verification gate before each refresh is published",
] as const;

const STEPS = [
  {
    n: "01",
    t: "Pull, read-only",
    d: "Live reads from version control, identity, cloud cost management, and card statement APIs \u2014 never a write.",
  },
  {
    n: "02",
    t: "Warehouse",
    d: "Everything normalized into a single analytical store \u2014 one schema, every brand, every source.",
  },
  {
    n: "03",
    t: "Untangle billing",
    d: "Reseller / MSP billing separated from direct charges so each dollar has exactly one accountable owner.",
  },
  {
    n: "04",
    t: "Verify",
    d: "12 automated checks reconcile each refresh against the prior canonical snapshot \u2014 all must pass before publish.",
  },
  {
    n: "05",
    t: "Publish",
    d: "One canonical output feeds the dashboard and exec reporting \u2014 the single source of truth every cost conversation starts from.",
  },
] as const;

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar mb-3">{children}</p>
  );
}

export function EstateTraceDeepDive() {
  return (
    <>
      {/* What it saved */}
      <section>
        <Label>What it saved</Label>
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center justify-between bg-[oklch(0.2_0.014_155)] px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
              Realized &amp; actioned
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone/50">
              share of realized
            </span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {SAVINGS.map((r) => (
                <tr key={r.item} className="border-t border-border/60">
                  <td className="px-4 py-2 text-stone/90">
                    {r.item}
                    <span className="ml-2 text-stone/50 text-xs italic">{r.how}</span>
                  </td>
                  <td className="px-4 py-2 text-right font-mono text-xs text-cedar whitespace-nowrap">
                    {r.result}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl border border-cedar/40 bg-cedar/[0.06] px-4 py-3.5 flex items-center justify-between gap-3">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
              Largest identified opportunity
            </div>
            <div className="mt-1 text-sm text-stone/90">
              Single over-provisioned capacity &mdash; pause&nbsp;/&nbsp;right-size
            </div>
            <div className="mt-0.5 text-xs text-stone/55">
              ~54% of total IT run-rate &middot; the ~40% optimization path
            </div>
          </div>
          <div className="shrink-0 text-right">
            <span className="font-display text-2xl font-light text-mist">~1.6&times;</span>
            <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-stone/50">
              vs. realized
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mt-7">
        <Label>What it had</Label>
        <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex gap-2.5 text-sm text-stone/90">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cedar" aria-hidden="true" />
              {f}
            </li>
          ))}
        </ul>
      </section>

      {/* How it worked */}
      <section className="mt-7">
        <Label>How it worked</Label>
        <ol className="space-y-3">
          {STEPS.map((s) => (
            <li key={s.n} className="grid grid-cols-[2.5rem_1fr] gap-3">
              <span className="font-mono text-xs text-cedar/80 pt-0.5">{s.n}</span>
              <p className="text-sm text-stone/90 leading-relaxed">
                <span className="text-foreground font-medium">{s.t}.</span> {s.d}
              </p>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}
