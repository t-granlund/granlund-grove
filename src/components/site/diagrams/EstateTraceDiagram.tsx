// Estate Trace — cost-governance pipeline
// Diagram: live read-only sources -> pull layer -> Brands Data Store (DuckDB)
// -> 12/12 verification gate -> canonical workbook -> Estate Intelligence + exec.
// Matches the shared diagram language (Box/Arr, oklch palette, mono labels).

const C = {
  cedar: "var(--cedar)",
  stone: "var(--stone)",
  muted: "var(--muted-foreground)",
  border: "oklch(0.3 0.018 150 / 0.55)",
  cedarBorder: "oklch(0.78 0.12 55 / 0.45)",
} as const;

function Arr({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={C.cedar}
      strokeWidth={1.2}
      strokeOpacity={0.65}
      markerEnd="url(#etarr)"
    />
  );
}

export function EstateTraceDiagram() {
  // Sources row — the five live, read-only feeds.
  const sources = [
    "GitHub API\n41 repos",
    "MS Graph\n5 tenants",
    "Azure Cost\nManagement",
    "Ramp\n58 invoices",
    "M365 SKUs\n126 vendors",
  ];
  const sW = 132,
    sH = 52,
    sGap = 14,
    sY = 22;
  const sTotalW = sources.length * sW + (sources.length - 1) * sGap;
  const sStartX = (760 - sTotalW) / 2;

  return (
    <svg
      viewBox="0 0 760 470"
      role="img"
      aria-label="Estate Trace cost-governance pipeline: five live read-only sources (GitHub API across 41 repos, Microsoft Graph across 5 tenants, Azure Cost Management, Ramp invoices, and M365 SKUs) flow through a read-only pull layer into the Brands Data Store (a DuckDB warehouse that normalizes the data and splits MSP/reseller billing from direct Microsoft charges), then through a 12-of-12 verification gate that reconciles each refresh against the prior canonical snapshot, into a single canonical workbook that feeds the Estate Intelligence dashboard and executive financial decisions."
      className="w-full h-auto"
    >
      <defs>
        <marker id="etarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill={C.cedar} fillOpacity={0.65} />
        </marker>
      </defs>

      {/* — Data sources — */}
      <text
        x={380}
        y={12}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.muted,
          fontSize: 9,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.15em",
        }}
      >
        LIVE READ-ONLY SOURCES
      </text>
      {sources.map((s, i) => {
        const x = sStartX + i * (sW + sGap);
        const lines = s.split("\n");
        return (
          <g key={i}>
            <rect
              x={x}
              y={sY}
              width={sW}
              height={sH}
              rx={8}
              fill="oklch(0.20 0.014 155)"
              stroke={C.border}
              strokeWidth={1}
            />
            <text
              x={x + sW / 2}
              y={sY + sH / 2 - 7}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.stone, fontSize: 11, fontFamily: "var(--font-mono)" }}
            >
              {lines[0]}
            </text>
            <text
              x={x + sW / 2}
              y={sY + sH / 2 + 9}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)" }}
            >
              {lines[1]}
            </text>
          </g>
        );
      })}

      {/* Arrows sources -> gather line */}
      {sources.map((_, i) => {
        const x = sStartX + i * (sW + sGap) + sW / 2;
        return <Arr key={i} x1={x} y1={sY + sH} x2={x} y2={104} />;
      })}
      <line
        x1={sStartX + sW / 2}
        y1={104}
        x2={sStartX + sTotalW - sW / 2}
        y2={104}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <Arr x1={380} y1={104} x2={380} y2={116} />

      {/* — Pull layer — */}
      <rect
        x={250}
        y={116}
        width={260}
        height={38}
        rx={19}
        fill="oklch(0.22 0.018 155)"
        stroke={C.cedarBorder}
        strokeWidth={1.5}
      />
      <text
        x={380}
        y={135}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.cedar, fontSize: 12, fontFamily: "var(--font-mono)" }}
      >
        READ-ONLY PULL LAYER
      </text>
      <Arr x1={380} y1={154} x2={380} y2={170} />

      {/* — Brands Data Store — */}
      <rect
        x={210}
        y={170}
        width={340}
        height={56}
        rx={10}
        fill="oklch(0.22 0.018 155)"
        stroke={C.cedarBorder}
        strokeWidth={1.5}
      />
      <text
        x={380}
        y={190}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.stone, fontSize: 12, fontFamily: "var(--font-mono)" }}
      >
        BRANDS DATA STORE · DuckDB
      </text>
      <text
        x={380}
        y={208}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
      >
        normalize · MSP/reseller split from direct Microsoft
      </text>
      <Arr x1={380} y1={226} x2={380} y2={242} />

      {/* — Verification gate — */}
      <rect
        x={150}
        y={242}
        width={460}
        height={52}
        rx={10}
        fill="oklch(0.78 0.12 55 / 0.07)"
        stroke={C.cedarBorder}
        strokeWidth={1.2}
      />
      <text
        x={380}
        y={262}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.cedar, fontSize: 12, fontFamily: "var(--font-mono)" }}
      >
        12 / 12 VERIFICATION GATE
      </text>
      <text
        x={380}
        y={280}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
      >
        every refresh reconciled vs the prior canonical snapshot
      </text>
      <Arr x1={380} y1={294} x2={380} y2={310} />

      {/* — Canonical workbook — */}
      <rect
        x={270}
        y={310}
        width={220}
        height={44}
        rx={10}
        fill="oklch(0.20 0.014 155)"
        stroke={C.border}
        strokeWidth={1}
      />
      <text
        x={380}
        y={332}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.stone, fontSize: 12, fontFamily: "var(--font-mono)" }}
      >
        CANONICAL WORKBOOK
      </text>

      {/* Workbook -> consumers */}
      <line
        x1={380}
        y1={354}
        x2={380}
        y2={372}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <line
        x1={250}
        y1={372}
        x2={510}
        y2={372}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <Arr x1={250} y1={372} x2={250} y2={392} />
      <Arr x1={510} y1={372} x2={510} y2={392} />

      {/* — Consumers — */}
      <rect
        x={140}
        y={392}
        width={220}
        height={48}
        rx={10}
        fill="oklch(0.20 0.014 155)"
        stroke={C.border}
        strokeWidth={1}
      />
      <text
        x={250}
        y={411}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.stone, fontSize: 11, fontFamily: "var(--font-mono)" }}
      >
        Estate Intelligence
      </text>
      <text
        x={250}
        y={427}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)" }}
      >
        dashboard · brand → vendor → line item
      </text>

      <rect
        x={400}
        y={392}
        width={220}
        height={48}
        rx={10}
        fill="oklch(0.20 0.014 155)"
        stroke={C.border}
        strokeWidth={1}
      />
      <text
        x={510}
        y={411}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.stone, fontSize: 11, fontFamily: "var(--font-mono)" }}
      >
        Executive Decisions
      </text>
      <text
        x={510}
        y={427}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)" }}
      >
        ~$48.5K/yr actioned · ~40% path
      </text>
    </svg>
  );
}
