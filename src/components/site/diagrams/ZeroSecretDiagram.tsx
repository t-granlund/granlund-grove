// Zero-secret automation — OIDC lifecycle across 5 tenants
// Diagram: Monday.com/CSV → GitHub Actions → per-tenant OIDC federation → audit trail

const C = {
  cedar: "var(--cedar)",
  stone: "var(--stone)",
  muted: "var(--muted-foreground)",
  border: "oklch(0.3 0.018 150 / 0.55)",
  cedarBorder: "oklch(0.78 0.12 55 / 0.45)",
} as const;

function Box({
  x,
  y,
  w,
  h,
  label,
  sub,
  accent = false,
  r = 8,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  accent?: boolean;
  r?: number;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={r}
        fill={accent ? "oklch(0.22 0.018 155)" : "oklch(0.20 0.014 155)"}
        stroke={accent ? C.cedarBorder : C.border}
        strokeWidth={accent ? 1.5 : 1}
      />
      <text
        x={x + w / 2}
        y={y + (sub ? h / 2 - 6 : h / 2 + 5)}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.stone, fontSize: sub ? 11 : 12, fontFamily: "var(--font-mono)" }}
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 10}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
        >
          {sub}
        </text>
      )}
    </g>
  );
}

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
      markerEnd="url(#zsarr)"
    />
  );
}

export function ZeroSecretDiagram() {
  const tenants = ["HTT", "BCC", "FN", "TLL", "DCE"];
  const tW = 110,
    tH = 68,
    tGap = 14,
    tY = 188;
  const tTotalW = tenants.length * tW + (tenants.length - 1) * tGap;
  const tStartX = (760 - tTotalW) / 2;

  return (
    <svg
      viewBox="0 0 760 380"
      role="img"
      aria-label="Zero-secret automation: Monday.com and CSV inputs drive GitHub Actions workflows with per-tenant workload identity federation (OIDC) — no stored secrets, least privilege, full audit trail for onboard, offboard, and leave-of-absence lifecycles across all five tenants."
      className="w-full h-auto"
    >
      <defs>
        <marker id="zsarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill={C.cedar} fillOpacity={0.65} />
        </marker>
      </defs>

      {/* — Inputs — */}
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
        TRIGGER SOURCES
      </text>

      <Box x={190} y={22} w={160} h={44} label="Monday.com" sub="HR workflow events" />
      <Box x={410} y={22} w={160} h={44} label="CSV Import" sub="Bulk lifecycle ops" />

      {/* Input arrows converge */}
      <Arr x1={270} y1={66} x2={270} y2={86} />
      <Arr x1={490} y1={66} x2={490} y2={86} />
      <line
        x1={270}
        y1={86}
        x2={490}
        y2={86}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <Arr x1={380} y1={86} x2={380} y2={100} />

      {/* — GitHub Actions orchestrator — */}
      <Box
        x={240}
        y={100}
        w={280}
        h={60}
        label="GITHUB ACTIONS"
        sub="Workload identity · Per-tenant scope"
        accent
        r={10}
      />

      {/* — Zero-secrets callout — */}
      <rect
        x={558}
        y={106}
        width={168}
        height={48}
        rx={8}
        fill="oklch(0.78 0.12 55 / 0.06)"
        stroke={C.cedarBorder}
        strokeWidth={1}
      />
      <text
        x={642}
        y={122}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.cedar, fontSize: 11, fontFamily: "var(--font-mono)" }}
      >
        ZERO STORED
      </text>
      <text
        x={642}
        y={138}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.cedar, fontSize: 11, fontFamily: "var(--font-mono)" }}
      >
        SECRETS
      </text>

      {/* — Fan out to tenants — */}
      <line
        x1={380}
        y1={160}
        x2={380}
        y2={174}
        stroke={C.cedar}
        strokeWidth={1.2}
        strokeOpacity={0.65}
      />
      <line
        x1={tStartX + tW / 2}
        y1={174}
        x2={tStartX + tTotalW - tW / 2}
        y2={174}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      {tenants.map((_, i) => {
        const ax = tStartX + i * (tW + tGap) + tW / 2;
        return <Arr key={i} x1={ax} y1={174} x2={ax} y2={tY} />;
      })}

      {/* — Per-tenant OIDC boxes — */}
      {tenants.map((t, i) => {
        const x = tStartX + i * (tW + tGap);
        return (
          <g key={t}>
            <rect
              x={x}
              y={tY}
              width={tW}
              height={tH}
              rx={8}
              fill="oklch(0.20 0.014 155)"
              stroke={C.border}
              strokeWidth={1}
            />
            <text
              x={x + tW / 2}
              y={tY + 16}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.stone, fontSize: 12, fontFamily: "var(--font-mono)" }}
            >
              {t}
            </text>
            <text
              x={x + tW / 2}
              y={tY + 30}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{
                fill: C.cedar,
                fontSize: 9,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.06em",
              }}
            >
              OIDC
            </text>
            <text
              x={x + tW / 2}
              y={tY + 44}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)" }}
            >
              Federated trust
            </text>
            <text
              x={x + tW / 2}
              y={tY + 58}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)" }}
            >
              Least privilege
            </text>
          </g>
        );
      })}

      {/* Tenant arrows down to lifecycle */}
      {tenants.map((_, i) => {
        const ax = tStartX + i * (tW + tGap) + tW / 2;
        return (
          <g key={i}>
            <line
              x1={ax}
              y1={tY + tH}
              x2={ax}
              y2={288}
              stroke={C.cedar}
              strokeWidth={1}
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
          </g>
        );
      })}
      <line
        x1={tStartX + tW / 2}
        y1={288}
        x2={tStartX + tTotalW - tW / 2}
        y2={288}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <Arr x1={380} y1={288} x2={380} y2={300} />

      {/* — Lifecycle operations — */}
      {["Onboard", "Offboard", "Leave of Absence"].map((op, i) => (
        <Box key={op} x={80 + i * 200} y={300} w={160} h={36} label={op} r={18} />
      ))}

      {/* — Audit trail footer — */}
      <rect
        x={30}
        y={352}
        width={700}
        height={20}
        rx={6}
        fill="oklch(0.78 0.12 55 / 0.08)"
        stroke={C.cedarBorder}
        strokeWidth={1}
      />
      <text
        x={380}
        y={362}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.cedar,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
        }}
      >
        EVERY RUN PRODUCES A FULL AUDIT TRAIL · NO SECRETS EVER TOUCH DISK
      </text>
    </svg>
  );
}
