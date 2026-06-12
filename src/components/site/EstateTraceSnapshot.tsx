// Faithful-but-generalized snapshot of the Estate Intelligence dashboard —
// shows the system's design and analytical structure without revealing
// client-specific financials. Reskinned into the grove forest-dark palette.

// Relative licensing spend across tenants (normalized to 100, no raw $).
const TENANTS = [
  { code: "Brand A", w: "100%", label: "Largest" },
  { code: "Brand B", w: "37%", label: "" },
  { code: "Brand C", w: "20%", label: "" },
  { code: "Brand D", w: "19%", label: "" },
  { code: "Brand E", w: "2%", label: "" },
] as const;

const TILES = [
  { label: "Vendors reviewed", value: "126" },
  { label: "Invoices traced", value: "58" },
  { label: "Tenants covered", value: "5" },
  { label: "Checks passed", value: "12/12" },
] as const;

export function EstateTraceSnapshot() {
  return (
    <div className="rounded-xl border border-border bg-[oklch(0.16_0.012_150)] overflow-hidden shadow-lg">
      {/* Faux browser chrome */}
      <div className="flex items-center gap-2 px-3 h-8 border-b border-border bg-[oklch(0.19_0.012_150)]">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.55_0.14_25)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.78_0.1_75)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[oklch(0.6_0.1_150)]" />
        </span>
        <span className="ml-2 flex-1 truncate rounded-md bg-[oklch(0.14_0.01_150)] px-2.5 py-0.5 font-mono text-[10px] text-stone/60">
          estate-intelligence &middot; read-only audit
        </span>
      </div>

      <div className="p-4 sm:p-5">
        {/* Header lockup */}
        <div className="flex items-baseline justify-between gap-3 border-b border-border pb-3">
          <div>
            <div className="font-display text-lg leading-none text-mist">Estate Intelligence</div>
            <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar/90">
              Technology spend &amp; vendor audit &middot; 5 brands
            </div>
          </div>
          <span className="shrink-0 rounded-full border border-cedar/40 bg-cedar/10 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.15em] text-cedar">
            12/12 verified
          </span>
        </div>

        {/* Stat tiles */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {TILES.map((t) => (
            <div
              key={t.label}
              className="rounded-lg border border-border bg-[oklch(0.2_0.014_155)] px-3 py-2.5"
            >
              <div className="font-display text-2xl font-light leading-none text-mist">
                {t.value}
              </div>
              <div className="mt-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-stone/60">
                {t.label}
              </div>
            </div>
          ))}
        </div>

        {/* M365 licensing by tenant (relative, no raw $) */}
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-stone/50">
              M365 licensing &middot; relative spend by tenant
            </span>
            <span className="font-mono text-[9px] text-stone/40">5 tenants</span>
          </div>
          <div className="mt-2.5 space-y-1.5">
            {TENANTS.map((t) => (
              <div key={t.code} className="flex items-center gap-2.5">
                <span className="w-16 shrink-0 font-mono text-[10px] text-stone/70">{t.code}</span>
                <span className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-[oklch(0.22_0.014_155)]">
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-cedar/50 to-cedar"
                    style={{ width: t.w }}
                  />
                </span>
                {t.label && (
                  <span className="w-14 shrink-0 text-right font-mono text-[9px] text-stone/40 italic">
                    {t.label}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Confidence legend */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-t border-border pt-3">
          {[
            { c: "oklch(0.6 0.1 150)", t: "live pull" },
            { c: "oklch(0.78 0.1 75)", t: "estimate" },
            { c: "oklch(0.55 0.14 25)", t: "needs pull" },
          ].map((l) => (
            <span
              key={l.t}
              className="flex items-center gap-1.5 font-mono text-[9px] text-stone/55"
            >
              <span className="h-2 w-2 rounded-sm" style={{ background: l.c }} />
              {l.t}
            </span>
          ))}
          <span className="ml-auto font-mono text-[9px] text-stone/40">
            brand &rarr; vendor &rarr; invoice &rarr; line item
          </span>
        </div>
      </div>
    </div>
  );
}
