// TenantFleet Identity Lifecycle Workflow
// Shows the full flow from tenant provisioning to user offboarding

const C = {
  stepFill: "oklch(0.24 0.016 155)",
  activeFill: "oklch(0.30 0.035 155)",
  text: "var(--stone)",
  muted: "oklch(0.55 0.02 90)",
  cedar: "var(--cedar)",
  border: "oklch(0.3 0.018 150 / 0.55)",
  line: "oklch(0.4 0.02 150 / 0.4)",
} as const;

function StepBox({
  x,
  y,
  w,
  label,
  sub,
  repo,
  active,
}: {
  x: number;
  y: number;
  w: number;
  label: string;
  sub: string;
  repo: string;
  active?: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={64}
        rx={10}
        fill={active ? C.activeFill : C.stepFill}
        stroke={active ? C.cedar : C.border}
        strokeWidth={active ? 1.5 : 1}
      />
      <text
        x={x + 12}
        y={y + 24}
        style={{ fill: C.text, fontSize: 13, fontFamily: "var(--font-display)", fontWeight: 500 }}
      >
        {label}
      </text>
      <text
        x={x + 12}
        y={y + 42}
        style={{
          fill: C.muted,
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          letterSpacing: "0.1em",
        }}
      >
        {sub}
      </text>
      <text
        x={x + w - 12}
        y={y + 24}
        textAnchor="end"
        style={{
          fill: C.cedar,
          fontSize: 9,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {repo}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={C.line}
      strokeWidth={1.5}
      markerEnd="url(#wf-arr)"
    />
  );
}

export function WorkflowDiagram() {
  return (
    <svg
      viewBox="0 0 800 560"
      className="w-full h-auto"
      role="img"
      aria-label="Identity lifecycle workflow from tenant provisioning to user offboarding across the TenantFleet ecosystem"
    >
      <defs>
        <marker id="wf-arr" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 L2,4 Z" fill={C.line} />
        </marker>
      </defs>

      {/* Title */}
      <text
        x={400}
        y={30}
        textAnchor="middle"
        dominantBaseline="middle"
        style={{ fill: C.text, fontSize: 16, fontFamily: "var(--font-display)", fontWeight: 600 }}
      >
        Identity Lifecycle Workflow
      </text>

      {/* Phase labels */}
      <text
        x={60}
        y={70}
        style={{
          fill: C.cedar,
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontWeight: 600,
        }}
      >
        Phase 1: Infrastructure
      </text>
      <text
        x={60}
        y={230}
        style={{
          fill: C.cedar,
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontWeight: 600,
        }}
      >
        Phase 2: Governance
      </text>
      <text
        x={60}
        y={390}
        style={{
          fill: C.cedar,
          fontSize: 10,
          fontFamily: "var(--font-mono)",
          textTransform: "uppercase",
          letterSpacing: "0.2em",
          fontWeight: 600,
        }}
      >
        Phase 3: Operations
      </text>

      {/* Phase 1: Infrastructure */}
      <StepBox
        x={60}
        y={85}
        w={200}
        label="Provision Tenant"
        sub="Terraform module"
        repo="TenantForge"
        active
      />
      <Arrow x1={260} y1={117} x2={310} y2={117} />
      <StepBox
        x={310}
        y={85}
        w={200}
        label="Configure Auth"
        sub="OIDC federation"
        repo="TenantFleet"
      />
      <Arrow x1={510} y1={117} x2={560} y2={117} />
      <StepBox
        x={560}
        y={85}
        w={180}
        label="Deploy Dashboard"
        sub="SWA + Entra ID"
        repo="HubForge"
      />

      {/* Phase 2: Governance */}
      <StepBox
        x={60}
        y={245}
        w={200}
        label="Create Groups"
        sub="Persona-based RBAC"
        repo="EntraGroups"
        active
      />
      <Arrow x1={260} y1={277} x2={310} y2={277} />
      <StepBox
        x={310}
        y={245}
        w={200}
        label="Index Documents"
        sub="SharePoint + Teams"
        repo="SharePointAgent"
      />
      <Arrow x1={510} y1={277} x2={560} y2={277} />
      <StepBox x={560} y={245} w={180} label="Secure Domains" sub="DNS + DMARC" repo="DNSGuard" />

      {/* Phase 3: Operations */}
      <StepBox
        x={60}
        y={405}
        w={200}
        label="Onboard User"
        sub="Lifecycle automation"
        repo="TenantFleet"
        active
      />
      <Arrow x1={260} y1={437} x2={310} y2={437} />
      <StepBox
        x={310}
        y={405}
        w={200}
        label="Monitor Access"
        sub="Audit + compliance"
        repo="RampGuard"
      />
      <Arrow x1={510} y1={437} x2={560} y2={437} />
      <StepBox
        x={560}
        y={405}
        w={180}
        label="Offboard User"
        sub="Immediate + auditable"
        repo="TenantFleet"
      />

      {/* Feedback loops */}
      <path
        d="M160 149 Q160 180 160 245"
        fill="none"
        stroke={C.line}
        strokeWidth={1}
        strokeDasharray="4 3"
        markerEnd="url(#wf-arr)"
      />
      <path
        d="M160 309 Q160 340 160 405"
        fill="none"
        stroke={C.line}
        strokeWidth={1}
        strokeDasharray="4 3"
        markerEnd="url(#wf-arr)"
      />
      <path
        d="M650 149 Q700 180 650 245"
        fill="none"
        stroke={C.line}
        strokeWidth={1}
        strokeDasharray="4 3"
        markerEnd="url(#wf-arr)"
      />
      <path
        d="M650 309 Q700 340 650 405"
        fill="none"
        stroke={C.line}
        strokeWidth={1}
        strokeDasharray="4 3"
        markerEnd="url(#wf-arr)"
      />

      {/* Annotations */}
      <text
        x={170}
        y={200}
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)", fontStyle: "italic" }}
      >
        feeds into
      </text>
      <text
        x={170}
        y={360}
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)", fontStyle: "italic" }}
      >
        feeds into
      </text>
      <text
        x={660}
        y={200}
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)", fontStyle: "italic" }}
      >
        informs
      </text>
      <text
        x={660}
        y={360}
        style={{ fill: C.muted, fontSize: 9, fontFamily: "var(--font-mono)", fontStyle: "italic" }}
      >
        informs
      </text>

      {/* Bottom banner */}
      <g>
        <rect
          x={150}
          y={500}
          width={500}
          height={36}
          rx={18}
          fill={C.stepFill}
          stroke={C.border}
          strokeWidth={1}
        />
        <text
          x={400}
          y={518}
          textAnchor="middle"
          dominantBaseline="middle"
          style={{
            fill: C.muted,
            fontSize: 10,
            fontFamily: "var(--font-mono)",
            letterSpacing: "0.12em",
          }}
        >
          Each phase gated by automated tests / Judge score / Security audit / WCAG AA
        </text>
      </g>
    </svg>
  );
}
