// TenantFleet Ecosystem Architecture Diagram
// Shows the three pillars and seven repos as a connected system

const C = {
  mind: "oklch(0.65 0.12 270)",
  body: "oklch(0.70 0.14 55)",
  spirit: "oklch(0.60 0.12 160)",
  nodeFill: "oklch(0.22 0.014 155)",
  text: "var(--stone)",
  muted: "oklch(0.6 0.02 90)",
  border: "oklch(0.3 0.018 150 / 0.55)",
} as const;

function RepoNode({
  x,
  y,
  label,
  sub,
  color,
}: {
  x: number;
  y: number;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={140} height={52} rx={8} fill={C.nodeFill} stroke={color} strokeWidth={1.5} />
      <text
        x={x + 70}
        y={y + 22}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.text, fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {label}
      </text>
      <text
        x={x + 70}
        y={y + 40}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.12em" }}
      >
        {sub}
      </text>
    </g>
  );
}

function PillarLabel({ x, y, label, color }: { x: number; y: number; label: string; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={90} height={28} rx={14} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1} />
      <text
        x={x + 45}
        y={y + 17}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: color, fontSize: 10, fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.18em", fontWeight: 600 }}
      >
        {label}
      </text>
    </g>
  );
}

function Connector({ x1, y1, x2, y2, color }: { x1: number; y1: number; x2: number; y2: number; color: string }) {
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={1.2} strokeOpacity={0.5} strokeDasharray="4 3" />
  );
}

export function EcosystemDiagram() {
  return (
    <svg viewBox="0 0 900 520" className="w-full h-auto" role="img" aria-label="TenantFleet ecosystem architecture showing three pillars and seven interconnected repositories">
      <defs>
        <marker id="eco-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={C.muted} opacity={0.6} />
        </marker>
      </defs>

      {/* Background zones */}
      <rect x={40} y={80} width={260} height={380} rx={16} fill="none" stroke={C.mind} strokeWidth={0.8} strokeOpacity={0.25} strokeDasharray="6 4" />
      <rect x={320} y={80} width={260} height={380} rx={16} fill="none" stroke={C.body} strokeWidth={0.8} strokeOpacity={0.25} strokeDasharray="6 4" />
      <rect x={600} y={80} width={260} height={380} rx={16} fill="none" stroke={C.spirit} strokeWidth={0.8} strokeOpacity={0.25} strokeDasharray="6 4" />

      {/* Pillar labels */}
      <PillarLabel x={125} y={95} label="Mind" color={C.mind} />
      <PillarLabel x={405} y={95} label="Body" color={C.body} />
      <PillarLabel x={685} y={95} label="Spirit" color={C.spirit} />

      {/* Mind repos */}
      <RepoNode x={70} y={140} label="TenantFleet" sub="Root framework" color={C.mind} />
      <RepoNode x={70} y={220} label="HubForge" sub="SWA templates" color={C.mind} />
      <RepoNode x={70} y={300} label="TenantForge" sub="Terraform" color={C.mind} />
      <RepoNode x={70} y={380} label="RampGuard" sub="Finance" color={C.mind} />

      {/* Body repos */}
      <RepoNode x={350} y={180} label="EntraGroups" sub="Group lifecycle" color={C.body} />
      <RepoNode x={350} y={300} label="SharePointAgent" sub="Documents" color={C.body} />

      {/* Spirit repos */}
      <RepoNode x={630} y={240} label="DNSGuard" sub="Domain security" color={C.spirit} />

      {/* Cross-pillar connections */}
      <Connector x1={210} y1={166} x2={350} y2={206} color={C.muted} />
      <Connector x1={210} y1={246} x2={350} y2={206} color={C.muted} />
      <Connector x1={210} y1={326} x2={350} y2={206} color={C.muted} />
      <Connector x1={210} y1={406} x2={350} y2={326} color={C.muted} />
      <Connector x1={490} y1={234} x2={630} y2={266} color={C.muted} />
      <Connector x1={490} y1={326} x2={630} y2={266} color={C.muted} />
      <Connector x1={210} y1={166} x2={630} y2={266} color={C.muted} />

      {/* Shared design system banner */}
      <g>
        <rect x={200} y={460} width={500} height={40} rx={20} fill={C.nodeFill} stroke={C.border} strokeWidth={1} />
        <text
          x={450}
          y={478}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{ fill: C.muted, fontSize: 11, fontFamily: "var(--font-mono)", letterSpacing: "0.15em" }}
        >
          Shared: Inter + JetBrains Mono / Glassmorphism / Aurora Orbs / GitHub Pages / MIT License
        </text>
      </g>

      {/* Title */}
      <text
        x={450}
        y={40}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.text, fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        TenantFleet Ecosystem Architecture
      </text>
    </svg>
  );
}
