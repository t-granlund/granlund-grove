// Code Puppy deep-dive — expanded details, news coverage, and repository imagery.

const NEWS_LINKS = [
  {
    outlet: "Business Insider",
    headline: "Code Puppy: Walmart's secret weapon against AI lock-in",
    url: "https://www.businessinsider.com/walmart-code-puppy-ai-anthropic-claude-code-openai-codex",
  },
  {
    outlet: "Talk Business & Politics",
    headline: "Furner recognized Pfaffenberger and Choi with the President's Innovation Award",
    url: "https://talkbusiness.net/2026/06/walmart-code-puppy/",
  },
  {
    outlet: "B17 News",
    headline: "Code Puppy: Walmart's secret weapon against AI lock-in",
    url: "https://b17news.com/code-puppy-walmarts-secret-weapon-against-ai-lock-in",
  },
] as const;

const REPO_STATS = [
  { value: "616", label: "GitHub stars" },
  { value: "192", label: "forks" },
  { value: "65+", label: "AI providers" },
  { value: "4,000+", label: "Walmart employees using it" },
] as const;

const RECOGNITION = [
  {
    award: "President's Innovation Award",
    presenter: "John Furner, Walmart President & CEO",
    scope: "Selected from 2.1 million associates worldwide",
    recipients: "Michael Pfaffenberger & John Choi",
  },
] as const;

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar mb-3">{children}</p>
  );
}

export function CodePuppyDeepDive() {
  return (
    <div className="space-y-8">
      {/* What it is */}
      <section>
        <Label>What it is</Label>
        <p className="text-sm text-stone/90 leading-relaxed">
          Code Puppy is an open-source AI code agent created by Michael Pfaffenberger and John Choi.
          It was built in reaction to the lock-in and pricing of proprietary AI coding tools like
          Windsurf and Cursor. The tool supports 65+ AI providers, runs on Python 3.11+, and is
          installable via{" "}
          <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">uvx code-puppy</code> or{" "}
          <code className="text-xs bg-white/5 px-1.5 py-0.5 rounded">pip install code-puppy</code>.
        </p>
        <p className="mt-3 text-sm text-stone/90 leading-relaxed">
          I use Code Puppy as my primary development agent — it is the tool behind Control Tower,
          Knowledge Fabric, Estate Trace, and this website. The supervised-agent discipline I apply
          to every production system is built on the foundation Code Puppy provides.
        </p>
      </section>

      {/* Recognition */}
      <section>
        <Label>Recognition</Label>
        {RECOGNITION.map((r) => (
          <div key={r.award} className="rounded-xl border border-cedar/30 bg-cedar/[0.06] p-5">
            <div className="font-display text-lg text-foreground">{r.award}</div>
            <div className="mt-2 text-sm text-stone/90">
              <span className="text-cedar">{r.recipients}</span> — presented by {r.presenter}.{" "}
              {r.scope}.
            </div>
          </div>
        ))}
      </section>

      {/* Repo stats */}
      <section>
        <Label>Repository</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {REPO_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border bg-card/60 p-4 text-center"
            >
              <div className="font-display text-2xl font-light text-mist">{s.value}</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.15em] text-cedar/80">
                {s.label}
              </div>
            </div>
          ))}
        </div>
        <a
          href="https://github.com/mpfaffenberger/code_puppy"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm text-cedar hover:text-mist transition-colors"
        >
          View on GitHub <span aria-hidden="true">&#8599;</span>
        </a>
      </section>

      {/* News coverage */}
      <section>
        <Label>News coverage</Label>
        <ul className="space-y-3">
          {NEWS_LINKS.map((n) => (
            <li key={n.url}>
              <a
                href={n.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 rounded-xl border border-border bg-card/60 p-4 hover:border-cedar transition-colors"
              >
                <span
                  className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-cedar"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-cedar">
                    {n.outlet}
                  </div>
                  <div className="mt-1 text-sm text-stone/90 group-hover:text-foreground transition-colors">
                    {n.headline}
                  </div>
                </div>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* How I use it */}
      <section>
        <Label>How I use it</Label>
        <p className="text-sm text-stone/90 leading-relaxed">
          At Head to Toe Brands, I used Code Puppy to run a five-brand, 200+ location franchise
          portfolio with a lean team of two people plus external contractors. The agent built
          applications, automations, and operational efficiencies that would otherwise require a
          much larger organization — including the Control Tower multi-tenant governance platform,
          the Knowledge Fabric identity-aware RAG system, and the Estate Trace cost governance
          pipeline. Every system ships with 7,000+ tests, WCAG AA accessibility, and a 48/48
          automated judge score.
        </p>
      </section>
    </div>
  );
}
