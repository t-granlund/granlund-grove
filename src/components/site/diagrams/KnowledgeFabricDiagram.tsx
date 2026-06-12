// Knowledge Fabric — identity-aware RAG
// Diagram: Data sources → multi-agent pipeline → Entra identity filter → consumers

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

function Arr({
  x1,
  y1,
  x2,
  y2,
  dashed,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed?: boolean;
}) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={C.cedar}
      strokeWidth={1.2}
      strokeOpacity={0.65}
      strokeDasharray={dashed ? "3 3" : undefined}
      markerEnd="url(#kfarr)"
    />
  );
}

export function KnowledgeFabricDiagram() {
  // Sources row
  const sources = [
    "POS Configs\n(Mindbody · Zenoti)",
    "SharePoint\nDocs & Wikis",
    "Freshdesk\n100K+ tickets",
  ];
  const sW = 172,
    sH = 52,
    sGap = 18,
    sY = 20;
  const sTotalW = sources.length * sW + (sources.length - 1) * sGap;
  const sStartX = (760 - sTotalW) / 2;

  // Agents row
  const agents = ["Crawler", "Programmer", "Code\nReviewer", "Security\nAuditor"];
  const aW = 110,
    aH = 44,
    aGap = 16,
    aY = 160;
  const aTotalW = agents.length * aW + (agents.length - 1) * aGap;
  const aStartX = (760 - aTotalW) / 2;

  return (
    <svg
      viewBox="0 0 760 440"
      role="img"
      aria-label="Knowledge Fabric RAG architecture: POS configs, SharePoint, and 100K+ Freshdesk tickets feed into a supervised multi-agent pipeline (Planner coordinating Crawler, Programmer, Code Reviewer, Security Auditor), stored in SQLite+FTS5 memory, filtered through Entra identity (1,523 verified users, 15-slot schema), and surfaced to Teams, Outlook, and Freshdesk consumers."
      className="w-full h-auto"
    >
      <defs>
        <marker id="kfarr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
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
        DATA SOURCES
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
              y={sY + sH / 2 + 8}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)" }}
            >
              {lines[1]}
            </text>
          </g>
        );
      })}

      {/* Arrows sources → planner */}
      {sources.map((_, i) => {
        const x = sStartX + i * (sW + sGap) + sW / 2;
        return <Arr key={i} x1={x} y1={sY + sH} x2={x} y2={108} />;
      })}
      {/* Gather line */}
      <line
        x1={sStartX + sW / 2}
        y1={108}
        x2={sStartX + sTotalW - sW / 2}
        y2={108}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <Arr x1={380} y1={108} x2={380} y2={118} />

      {/* — Planner agent (orchestrator) — */}
      <Box x={290} y={118} w={180} h={36} label="PLANNER AGENT" accent r={18} />

      {/* Arrows planner → specialists */}
      {agents.map((_, i) => {
        const ax = aStartX + i * (aW + aGap) + aW / 2;
        return (
          <g key={i}>
            <line
              x1={380}
              y1={154}
              x2={ax}
              y2={154}
              stroke={C.cedar}
              strokeWidth={1}
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
            <Arr x1={ax} y1={154} x2={ax} y2={aY} />
          </g>
        );
      })}

      {/* — Specialist agents — */}
      {agents.map((a, i) => {
        const x = aStartX + i * (aW + aGap);
        const lines = a.split("\n");
        return (
          <g key={i}>
            <rect
              x={x}
              y={aY}
              width={aW}
              height={aH}
              rx={6}
              fill="oklch(0.20 0.014 155)"
              stroke={C.border}
              strokeWidth={1}
            />
            <text
              x={x + aW / 2}
              y={lines.length > 1 ? aY + 14 : aY + aH / 2 + 4}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fill: C.stone, fontSize: 11, fontFamily: "var(--font-mono)" }}
            >
              {lines[0]}
            </text>
            {lines[1] && (
              <text
                x={x + aW / 2}
                y={aY + 28}
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
              >
                {lines[1]}
              </text>
            )}
          </g>
        );
      })}

      {/* Arrows agents → memory */}
      {agents.map((_, i) => {
        const ax = aStartX + i * (aW + aGap) + aW / 2;
        return (
          <g key={i}>
            <line
              x1={ax}
              y1={aY + aH}
              x2={ax}
              y2={232}
              stroke={C.cedar}
              strokeWidth={1}
              strokeOpacity={0.4}
              strokeDasharray="3 3"
            />
          </g>
        );
      })}
      <line
        x1={aStartX + aW / 2}
        y1={232}
        x2={aStartX + aTotalW - aW / 2}
        y2={232}
        stroke={C.cedar}
        strokeWidth={1}
        strokeOpacity={0.4}
        strokeDasharray="3 3"
      />
      <Arr x1={380} y1={232} x2={380} y2={244} />

      {/* — Memory store — */}
      <Box
        x={270}
        y={244}
        w={220}
        h={44}
        label="MEMORY STORE"
        sub="SQLite · FTS5 · vector index"
        accent
        r={10}
      />

      {/* Memory → Identity filter */}
      <Arr x1={380} y1={288} x2={380} y2={302} />

      {/* — Entra identity filter — */}
      <rect
        x={140}
        y={302}
        width={480}
        height={52}
        rx={10}
        fill="oklch(0.78 0.12 55 / 0.07)"
        stroke={C.cedarBorder}
        strokeWidth={1.2}
      />
      <text
        x={380}
        y={322}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.cedar, fontSize: 12, fontFamily: "var(--font-mono)" }}
      >
        ENTRA IDENTITY FILTER
      </text>
      <text
        x={380}
        y={340}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 10, fontFamily: "var(--font-mono)" }}
      >
        1,523 verified users · 15-slot attribute schema · brand + role boundaries
      </text>

      {/* Identity → consumers */}
      {[0, 1, 2].map((i) => {
        const cx = 180 + i * 200;
        return (
          <g key={i}>
            <line
              x1={cx}
              y1={354}
              x2={cx}
              y2={370}
              stroke={C.cedar}
              strokeWidth={1.2}
              strokeOpacity={0.65}
              markerEnd="url(#kfarr)"
            />
          </g>
        );
      })}

      {/* — Consumers — */}
      {["Teams", "Outlook", "Freshdesk"].map((c, i) => (
        <Box key={c} x={80 + i * 200} y={370} w={120} h={36} label={c} r={18} />
      ))}
    </svg>
  );
}
