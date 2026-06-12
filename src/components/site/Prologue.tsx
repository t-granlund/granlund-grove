// Prologue — dual-audience framing block for /about.
// Surfaces the FDE and AI-PM value props explicitly so screeners can
// self-select and know immediately why Tyler's background is relevant to them.
import { Link } from "@tanstack/react-router";

const tracks = [
  {
    id: "fde",
    label: "Field Deployment Engineers",
    headline: "Embedded with operators,\nshipping to production.",
    body: "I don't hand off to an ops team — I am the ops team. Discovery with non-technical operators, scoping against real constraints, rollout at franchise scale, and the CI/CD + security posture to keep it stable. Every system I build has been used by real people in real locations.",
    proof: [
      "Discovery through production rollout",
      "Non-technical operator context",
      "OIDC, zero stored secrets",
      "Eval harnesses gating every release",
    ],
  },
  {
    id: "ai-pm",
    label: "AI Product Managers",
    headline: "Orchestrating agents,\nnot just prompting them.",
    body: "The interesting problem isn't the model — it's the system around it. Planner agents, specialist sub-agents, human-in-the-loop approval gates, evaluation harnesses, cost-per-outcome decisions. I build the oversight layer, not just the feature.",
    proof: [
      "Multi-agent orchestration patterns",
      "HITL guardrails before destructive writes",
      "Evaluation harnesses as release gates",
      "Cost-per-outcome visibility",
    ],
  },
] as const;

export function Prologue() {
  return (
    <section
      id="prologue"
      aria-labelledby="prologue-heading"
      className="relative py-24 lg:py-32 bg-spruce-deep/30"
    >
      <div className="topo-divider absolute top-0 inset-x-0" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl mb-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">Two Lenses</p>
          <h2
            id="prologue-heading"
            className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl leading-[1.08] font-light"
          >
            The work reads differently{" "}
            <em className="not-italic text-cedar">depending on what you need.</em>
          </h2>
        </div>

        <div className="grid lg:grid-cols-2 gap-5">
          {tracks.map((t) => (
            <article
              key={t.id}
              className="group relative rounded-2xl border border-border bg-card/70 p-8 lg:p-10 lift overflow-hidden"
            >
              {/* Hover shimmer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none bg-[radial-gradient(circle_at_top_left,oklch(0.68_0.12_55/0.10),transparent_60%)]" />

              <div className="relative">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                  {t.label}
                </p>

                <h3 className="mt-4 font-display text-2xl lg:text-3xl leading-[1.1] whitespace-pre-line">
                  {t.headline}
                </h3>

                <p className="mt-5 text-stone/85 leading-relaxed">{t.body}</p>

                <ul className="mt-6 space-y-2">
                  {t.proof.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-stone/80">
                      <span className="mt-[5px] h-1.5 w-1.5 rounded-full bg-cedar shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-8 text-stone/60 text-sm">
          Either way, the proof is the same —{" "}
          <Link
            to="/work"
            className="text-cedar hover:text-mist transition-colors underline underline-offset-2"
          >
            see the case studies
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
