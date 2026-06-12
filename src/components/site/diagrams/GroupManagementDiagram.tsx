// Group Management Hub — generic governance architecture (code private).
// Four tenants -> central hub (FastAPI + Microsoft Graph) -> group operations
// + governance/quality -> a test-gated release. Styled to match the other
// case-study diagrams; brand identities are anonymized (Brand A-D).

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
        width={130}
        height={42}
        rx={7}
        fill={C.nodeFill}
        stroke={C.border}
        strokeWidth={1}
      />
      <text
        x={x + 65}
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
      markerEnd="url(#gmarr)"
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
      <rect
        x={x}
        y={y}
        width={w}
        height={headerH}
        rx={10}
        fill="oklch(0.24 0.016 155)"
        stroke="none"
      />
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

export function GroupManagementDiagram() {
  const tenants = ["Brand A", "Brand B", "Brand C", "Brand D"];
  const tW = 130,
    tGap = 16,
    tY = 20;
  const totalW = tenants.length * tW + (tenants.length - 1) * tGap;
  const tStartX = (760 - totalW) / 2;

  const hubX = 230,
    hubY = 112,
    hubW = 300,
    hubH = 68;
  const hubCX = hubX + hubW / 2; // 380

  const panelY = 230;
  const leftX = 30,
    rightX = 418,
    panelW = 312;

  const opItems = ["Provisioning", "Membership sync", "Access reviews", "Lifecycle (JML)"];
  const govItems = ["Naming policy", "RBAC model", "Audit trail", "WCAG AA UI"];
  const panelH = 36 + opItems.length * 22 + 8; // 132
  const gateY = panelY + panelH + 22;

  return (
    <svg
      viewBox={`0 0 760 ${gateY + 50}`}
      role="img"
      aria-label="Group Management Hub architecture: four anonymized tenants (Brand A through Brand D) feed a central hub built on FastAPI and Microsoft Graph. The hub splits into group operations (provisioning, membership sync, access reviews, and joiner-mover-leaver lifecycle) and governance and quality (naming policy, RBAC model, audit trail, and a WCAG AA user interface). Every release is gated by 7,984 automated tests with accessibility validated to WCAG AA before promotion."
      className="w-full h-auto"
    >
      <defs>
        <marker id="gmarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 Z" fill={C.cedar} fillOpacity={0.65} />
        </marker>
      </defs>

      {/* Tenant boxes */}
      {tenants.map((t, i) => (
        <TenantBox key={t} x={tStartX + i * (tW + tGap)} y={tY} label={t} />
      ))}

      {/* Gather lines from each tenant down to a horizontal bus */}
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
      <ArrowDown x={hubCX} y1={98} y2={hubY - 2} />

      {/* Central hub node */}
      <rect
        x={hubX}
        y={hubY}
        width={hubW}
        height={hubH}
        rx={12}
        fill={C.accentFill}
        stroke={C.cedarFaint}
        strokeWidth={1.5}
      />
      <text
        x={hubCX}
        y={hubY + 26}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.stone,
          fontSize: 12,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.08em",
        }}
      >
        GROUP MANAGEMENT HUB
      </text>
      <text
        x={hubCX}
        y={hubY + 46}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
      >
        FastAPI · Microsoft Graph
      </text>

      {/* Split: hub -> horizontal bar -> two panels */}
      <line
        x1={hubCX}
        y1={hubY + hubH}
        x2={hubCX}
        y2={panelY - 16}
        stroke={C.cedar}
        strokeWidth={1.2}
        strokeOpacity={0.65}
      />
      <line
        x1={leftX + panelW / 2}
        y1={panelY - 16}
        x2={rightX + panelW / 2}
        y2={panelY - 16}
        stroke={C.cedar}
        strokeWidth={1.2}
        strokeOpacity={0.65}
      />
      <ArrowDown x={leftX + panelW / 2} y1={panelY - 16} y2={panelY - 2} />
      <ArrowDown x={rightX + panelW / 2} y1={panelY - 16} y2={panelY - 2} />

      {/* Service panels */}
      <ServiceRow x={leftX} y={panelY} w={panelW} title="GROUP OPERATIONS" items={opItems} />
      <ServiceRow x={rightX} y={panelY} w={panelW} title="GOVERNANCE & QUALITY" items={govItems} />

      {/* Arrow to release gate */}
      <ArrowDown x={hubCX} y1={panelY + panelH} y2={gateY} />

      {/* Release / quality gate */}
      <rect
        x={30}
        y={gateY}
        width={700}
        height={40}
        rx={10}
        fill={C.nodeFill}
        stroke={C.cedarFaint}
        strokeWidth={1.5}
      />
      <text
        x={380}
        y={gateY + 20}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{
          fill: C.stone,
          fontSize: 11,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.06em",
        }}
      >
        RELEASE GATE · 7,984 tests · WCAG AA
      </text>
    </svg>
  );
}
