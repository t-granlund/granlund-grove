// Control Tower — multi-tenant governance platform
// 5 tenants -> central FastAPI+HTMX+PostgreSQL -> Azure SDK + Security/Auth -> Quality gate

const C = {
  cedar: "var(--cedar)",
  cedarFaint: "oklch(0.78 0.12 55 / 0.45)",
  stone: "var(--stone)",
  muted: "var(--muted-foreground)",
  nodeFill: "oklch(0.20 0.014 155)",
  accentFill: "oklch(0.22 0.018 155)",
  border: "oklch(0.3 0.018 150 / 0.55)",
} as const;

function TenantBox({ x, y, label }: { x: number; y: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={118}
        height={42}
        rx={7}
        fill={C.nodeFill}
        stroke={C.border}
        strokeWidth={1}
      />
      <text
        x={x + 59}
        y={y + 21}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.stone, fontSize: 12, fontFamily: "var(--font-mono)" }}
      >
        {label}
      </text>
    </g>
  );
}

function ArrowDown({ x, y1, y2 }: { x: number; y1: number; y2: number }) {
  return (
    <line
      x1={x}
      y1={y1}
      x2={x}
      y2={y2}
      stroke={C.cedar}
      strokeWidth={1.2}
      strokeOpacity={0.65}
      markerEnd="url(#ctarr)"
    />
  );
}

function ServiceRow({
  x,
  y,
  w,
  title,
  items,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  items: string[];
}) {
  const rowH = 22;
  const headerH = 36;
  const totalH = headerH + items.length * rowH + 8;
  return (
    <g>
      {/* Outer box */}
      <rect
        x={x}
        y={y}
        width={w}
        height={totalH}
        rx={10}
        fill={C.nodeFill}
        stroke={C.border}
        strokeWidth={1}
      />
      {/* Title bar */}
      <rect
        x={x}
        y={y}
        width={w}
        height={headerH}
        rx={10}
        fill="oklch(0.24 0.016 155)"
        stroke="none"
      />
      {/* Square bottom of title bar */}
      <rect
        x={x}
        y={y + headerH - 10}
        width={w}
        height={10}
        fill="oklch(0.24 0.016 155)"
        stroke="none"
      />
      <text
        x={x + w / 2}
        y={y + headerH / 2}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.stone,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.06em",
        }}
      >
        {title}
      </text>
      {/* Item rows */}
      {items.map((item, i) => (
        <g key={item}>
          <rect
            x={x + 12}
            y={y + headerH + 4 + i * rowH}
            width={w - 24}
            height={rowH - 4}
            rx={4}
            fill="oklch(0.18 0.012 150 / 0.8)"
            stroke={C.border}
            strokeWidth={0.8}
          />
          <text
            x={x + w / 2}
            y={y + headerH + 4 + i * rowH + (rowH - 4) / 2}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fill: C.muted, fontSize: 9.5, fontFamily: "var(--font-mono)" }}
          >
            {item}
          </text>
        </g>
      ))}
    </g>
  );
}

export function ControlTowerDiagram() {
  const tenants = ["HTT", "BCC", "FN", "TLL", "DCE"];
  const tW = 118,
    tGap = 13,
    tY = 20;
  const totalW = tenants.length * tW + (tenants.length - 1) * tGap;
  const tStartX = (760 - totalW) / 2;

  // Control Tower box
  const ctX = 230,
    ctY = 112,
    ctW = 300,
    ctH = 68;
  const ctCX = ctX + ctW / 2; // 380

  // Bottom panels
  const panelY = 230;
  const leftX = 30,
    rightX = 418;
  const panelW = 312;

  const azureItems = ["Cost Management", "Resource Manager", "Policy", "Defender"];
  const secItems = [
    "OIDC-only auth",
    "Workload identity fed.",
    "Docker -> GHCR",
    "Zero stored secrets",
  ];

  // Height of service rows
  const leftH = 36 + azureItems.length * 22 + 8; // 140
  const gateY = panelY + Math.max(leftH, 36 + secItems.length * 22 + 8) + 20;

  return (
    <svg
      viewBox={`0 0 760 ${gateY + 34}`}
      role="img"
      aria-label="Control Tower architecture: five Microsoft tenants (HTT, BCC, FN, TLL, DCE) feed into a central Control Tower platform built on FastAPI, HTMX, and PostgreSQL. The platform queries the Azure SDK across Cost Management, Resource Manager, Policy, and Defender services, with OIDC-only authentication and workload identity federation — zero stored secrets. Every release is gated by 7,386 automated tests and a 48/48 judge score."
      className="w-full h-auto"
    >
      <defs>
        <marker id="ctarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill={C.cedar} fillOpacity={0.65} />
        </marker>
      </defs>

      {/* Tenant boxes */}
      {tenants.map((t, i) => (
        <TenantBox key={t} x={tStartX + i * (tW + tGap)} y={tY} label={t} />
      ))}

      {/* Dashed gather lines from each tenant down to horizontal at y=98 */}
      {tenants.map((_, i) => {
        const cx = tStartX + i * (tW + tGap) + tW / 2;
        return (
          <line
            key={i}
            x1={cx}
            y1={tY + 42}
            x2={cx}
            y2={98}
            stroke={C.cedar}
            strokeWidth={1}
            strokeOpacity={0.35}
            strokeDasharray="3 3"
          />
        );
      })}
      <line
        x1={tStartX + tW / 2}
        y1={98}
        x2={tStartX + totalW - tW / 2}
        y2={98}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.35}
        strokeDasharray="3 3"
      />
      <ArrowDown x={ctCX} y1={98} y2={ctY - 2} />

      {/* Control Tower central node */}
      <rect
        x={ctX}
        y={ctY}
        width={ctW}
        height={ctH}
        rx={12}
        fill={C.accentFill}
        stroke={C.cedarFaint}
        strokeWidth={1.5}
      />
      <text
        x={ctCX}
        y={ctY + 26}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.stone,
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
        }}
      >
        CONTROL TOWER
      </text>
      <text
        x={ctCX}
        y={ctY + 46}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
      >
        FastAPI · HTMX · PostgreSQL
      </text>

      {/* Split arrow: CT bottom -> horizontal bar -> two panels */}
      <line
        x1={ctCX}
        y1={ctY + ctH}
        x2={ctCX}
        y2={panelY - 16}
        stroke={C.cedar}
        strokeWidth={1.2}
        strokeOpacity={0.65}
      />
      {/* horizontal split bar */}
      <line
        x1={leftX + panelW / 2}
        y1={panelY - 16}
        x2={rightX + panelW / 2}
        y2={panelY - 16}
        stroke={C.cedar}
        strokeWidth={1.2}
        strokeOpacity={0.65}
      />
      {/* drop down to each panel */}
      <ArrowDown x={leftX + panelW / 2} y1={panelY - 16} y2={panelY - 2} />
      <ArrowDown x={rightX + panelW / 2} y1={panelY - 16} y2={panelY - 2} />

      {/* Azure SDK */}
      <ServiceRow x={leftX} y={panelY} w={panelW} title="AZURE SDK" items={azureItems} />

      {/* Security & Auth */}
      <ServiceRow x={rightX} y={panelY} w={panelW} title="SECURITY & AUTH" items={secItems} />

      {/* Arrow to quality gate */}
      <ArrowDown x={ctCX} y1={panelY + leftH} y2={gateY} />

      {/* Quality gate */}
      <rect
        x={30}
        y={gateY}
        width={700}
        height={22}
        rx={6}
        fill="oklch(0.78 0.12 55 / 0.09)"
        stroke={C.cedarFaint}
        strokeWidth={1}
      />
      <text
        x={380}
        y={gateY + 11}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.cedar,
          fontSize: 10.5,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.07em",
        }}
      >
        7,386 AUTOMATED TESTS · JUDGE 48/48 · DR DRILLS COMPLETE
      </text>
    </svg>
  );
}
