import { useCallback, useEffect, useRef, useState } from "react";
import { TreeMark } from "./TreeMark";
import { CareerWorldMap } from "./CareerWorldMap";

interface SourceLink {
  label: string;
  url: string;
}

interface ImpactStep {
  company: string;
  role: string;
  dates: string;
  start: string;
  end: string;
  locations: string[];
  stat: string;
  statLabel: string;
  story: string;
  achievements: string[];
  value: string;
  sources: SourceLink[];
}

// Resume-style chapters. Narrative + measurable highlights drawn only from
// pre-verified employment facts (see docs/NUMBER_VERIFICATION.md). Every chapter
// carries the same through-line: understand what people need, then remove the
// obstacles that make their day harder.
const STEPS: ImpactStep[] = [
  {
    company: "Apple",
    role: "Lead South Chicago Market Technical Facilitator",
    dates: "2009 — 2015",
    start: "South Chicago market",
    end: "South Chicago market",
    locations: ["Chicago"],
    stat: "1",
    statLabel: "market — the root",
    story:
      "Where it started. I led Mac and Mobile technician training for the South Chicago market and ran the Genius Bar operations playbook day to day.",
    achievements: [
      "Built and taught the one-week promoted-staff course. Troubleshooting theory, Apple facilitation practices, and Genius Bar operations.",
      "Trained Mac and Mobile technicians across the South Chicago market.",
      "Mentored the next wave of technicians. Internal promotions and external hires alike.",
    ],
    value:
      "Learned the 1-to-many support philosophy that still drives how I build. Teach the room, not just the person.",
    sources: [{ label: "Apple Retail", url: "https://www.apple.com/retail/" }],
  },
  {
    company: "School of Rock",
    role: "IT Manager → Senior IT Manager",
    dates: "Apr 2015 — Jan 2022",
    start: "~145 locations · 8 countries",
    end: "~300+ locations · 14 countries",
    locations: [
      "Glen Ellyn",
      "Milwaukee",
      "São Paulo",
      "Rio",
      "Santiago",
      "Lima",
      "Asunción",
      "Madrid",
      "Lisbon",
      "Blackrock",
      "Taichung",
      "Sydney",
      "Perth",
      "Cape Town",
    ],
    stat: "150+",
    statLabel: "locations helped open",
    story:
      "The primary IT support pillar for every master-franchise launch across LATAM, Europe, APAC, and Africa. For each new market I analyzed requirements, adapted systems, built what did not exist yet, and trained the owners and managers who would run it.",
    achievements: [
      "Built merchant-processing integrations that did not previously exist. Local banks to NMI transnational gateways to Pike 13, with revenue tracking leadership could trust.",
      "Rolled out global SSO and Google Workspace governance across 300+ schools via Okta.",
      "Stood up privacy and compliance for new markets. GDPR for the Ireland and Iberia launches, plus COPPA/FERPA posture.",
      "Built the Summerfest All-Stars video pipeline. Nine regional GoPro kits, capture-to-judging FTP workflow.",
    ],
    value:
      "Grew the footprint from ~145 locations in 8 countries to 300+ across 14. Every market opened on time because the technical obstacles were already cleared.",
    sources: [{ label: "School of Rock", url: "https://www.schoolofrock.com" }],
  },
  {
    company: "Outdoor Cap",
    role: "IT Product Manager I → II",
    dates: "2022 — 2023",
    start: "Bentonville HQ",
    end: "Global supply chain",
    locations: ["Bentonville", "Dallas", "Rancho Cucamonga", "Zanesville"],
    stat: "4",
    statLabel: "countries in the supply chain",
    story:
      "Built Compass, the B2B wholesale online ordering platform. The company's largest technical undertaking. I owned it from requirements through rollout.",
    achievements: [
      "Integrated Magento / Adobe Commerce with ERP and 3D product customization, and shipped self-service account dashboards.",
      "Coordinated a global supply chain. Factories in Bangladesh, China, Vietnam, and Sri Lanka feeding four U.S. distribution centers.",
      "Became Adobe Commerce's first-ever customer advocate, presenting the build to enterprise customers.",
      "Replaced a manual, rep-mediated ordering process with guided self-service built around how dealers actually order.",
    ],
    value:
      "Turned wholesale ordering from phone-and-spreadsheet friction into a platform dealers could run themselves.",
    sources: [
      { label: "Outdoor Cap Company", url: "https://www.outdoorcap.com" },
      {
        label: "Compass launch",
        url: "https://www.outdoorcap.com/blog/new-online-ordering-experience-compass-revolutionizes-ordering/?page=home",
      },
    ],
  },
  {
    company: "North 40 / Smith & Rogue",
    role: "E-Commerce Operations Lead",
    dates: "2023 — 2024",
    start: "Great Falls HQ",
    end: "Northwest footprint",
    locations: ["Great Falls"],
    stat: "14",
    statLabel: "stores across MT, ID, WA",
    story:
      "Owned e-commerce operations for North 40, Smith & Rogue, and sibling brands. Brought the storefront in-house.",
    achievements: [
      "Migrated 14 brick-and-mortar stores from a legacy managed backend to Adobe Commerce Cloud.",
      "Broke the agency dependency so the team could move at its own pace, not a vendor's.",
      "Managed hundreds of thousands of SKUs with weapons and state-specific compliance nuance.",
    ],
    value:
      "Gave a regional retailer direct control of its own storefront, and the agile SDLC to keep improving it.",
    sources: [
      { label: "North 40 Outfitters", url: "https://www.north40.com" },
      {
        label: "Adobe Commerce talk",
        url: "https://experienceleague.adobe.com/en/docs/events/learn-from-your-peers-recordings/commerce/2024/agile-sdlc",
      },
    ],
  },
  {
    company: "Head to Toe Brands",
    role: "IT Director → IT Ops & Systems Engineer",
    dates: "2024 — Present",
    start: "Glen Arbor HQ",
    end: "200+ locations · 5 brands",
    locations: ["Glen Arbor", "South Lake"],
    stat: "200+",
    statLabel: "locations · 5 brands · Riverside PE",
    story:
      "Enterprise IT for a Riverside private-equity-backed franchise group. Portfolio: The Lash Lounge (~130 units), Bishops (~40), Frenchies (24), and Delta Crown. Today I ship supervised multi-agent systems to production alongside non-technical operators.",
    achievements: [
      "Built the identity-governance ecosystem. A master database federating identities across 5 brands and 5 Microsoft tenants. Access by location, brand, and role.",
      "Cut onboarding from days to minutes; offboarding is immediate and auditable.",
      "Stood up the support center. ~40% faster resolutions.",
      "Shipped Control Tower, Knowledge Fabric, and Estate Trace to production. Built with Code Puppy, with eval harnesses gating every release.",
      "Zero-secret, OIDC-based automation across all five tenants.",
    ],
    value:
      "200+ locations running on systems that make the work less stressful. The whole point: create brand ambassadors by serving the people behind the counter.",
    sources: [{ label: "Head to Toe Brands", url: "https://www.headtotoebrands.com" }],
  },
];

function StepCard({
  step,
  index,
  isActive,
  registerNode,
}: {
  step: ImpactStep;
  index: number;
  isActive: boolean;
  registerNode: (index: number, el: HTMLLIElement | null) => void;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // One-way entrance reveal — decoupled from active tracking, which the parent
  // computes from scroll position so the map always matches the centered card.
  const [revealed, setRevealed] = useState(index === 0);

  useEffect(() => {
    const el = ref.current;
    registerNode(index, el);
    if (!el || revealed) return;
    const io = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, registerNode, revealed]);

  return (
    <li
      ref={ref}
      data-active={isActive}
      className={`relative transition-all duration-700 ${
        revealed ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      {/* connector line into the next chapter */}
      {index < STEPS.length - 1 && (
        <div
          aria-hidden
          className="absolute left-6 top-full h-10 lg:h-16 w-px bg-gradient-to-b from-cedar/40 to-transparent"
        />
      )}

      <article
        className={`rounded-2xl border bg-card/70 p-6 lg:p-8 lift transition-colors duration-500 ${
          isActive ? "border-cedar/45 shadow-[var(--shadow-grove)]" : "border-border"
        }`}
      >
        {/* header row */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar">
                Step 0{index + 1}
              </span>
              <span className="h-px w-8 bg-gradient-to-r from-cedar/50 to-transparent" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone/55">
                {step.dates}
              </span>
            </div>
            <h3 className="mt-3 font-display text-2xl lg:text-3xl text-foreground">
              {step.company}
            </h3>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-cedar/90">
              {step.role}
            </div>
          </div>
          <TreeMark className="h-5 w-5 text-cedar/40 shrink-0 mt-1" />
        </div>

        {/* scope stat */}
        <div className="mt-5 flex items-end gap-3 border-y border-border/60 py-4">
          <div className="font-display text-4xl lg:text-5xl font-light text-mist leading-none">
            {step.stat}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-cedar/80 pb-1">
            {step.statLabel}
          </div>
          <div className="ml-auto pb-0.5 text-right text-[11px] text-stone/60">
            <span className="text-stone/40">From</span> {step.start}
            <br />
            <span className="text-stone/40">To</span> <span className="text-cedar">{step.end}</span>
          </div>
        </div>

        {/* narrative */}
        <p className="mt-5 text-sm lg:text-[15px] text-stone/85 leading-relaxed">{step.story}</p>

        {/* achievements */}
        <ul className="mt-5 space-y-2.5">
          {step.achievements.map((a) => (
            <li key={a} className="flex items-start gap-2.5 text-sm text-stone/85 leading-relaxed">
              <TreeMark className="mt-[3px] h-3.5 w-3.5 text-cedar/70 shrink-0" />
              <span>{a}</span>
            </li>
          ))}
        </ul>

        {/* value line — the through-line to the mission */}
        <p className="mt-5 border-l-2 border-cedar/50 pl-4 text-sm italic leading-relaxed text-mist/85">
          {step.value}
        </p>

        {/* location chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {step.locations.map((city) => (
            <span
              key={city}
              className="text-[10px] px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.3)] text-stone/85"
            >
              {city}
            </span>
          ))}
        </div>

        {/* verifiable sources */}
        {step.sources.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/50 pt-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-stone/55">
              Verify
            </span>
            {step.sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.14em] text-stone/75 hover:text-cedar transition-colors"
              >
                {s.label}
                <span aria-hidden className="opacity-50 group-hover:opacity-100 transition-opacity">
                  ↗
                </span>
              </a>
            ))}
          </div>
        )}
      </article>
    </li>
  );
}

export function CareerImpactTimeline() {
  const [activeStep, setActiveStep] = useState(0);
  const nodesRef = useRef<(HTMLLIElement | null)[]>([]);
  const registerNode = useCallback((index: number, el: HTMLLIElement | null) => {
    nodesRef.current[index] = el;
  }, []);

  // Active chapter = the step card whose center is nearest the reading line.
  // Scroll-driven + rAF-throttled so the sticky map always matches what's being
  // read — not whichever card last tripped an IntersectionObserver threshold.
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      const focus = window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;
      nodesRef.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2;
        const dist = Math.abs(center - focus);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      });
      setActiveStep((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="relative py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-3xl mb-12 lg:mb-16">
          <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-cedar/80">
            The journey · from one market to the world
          </div>
          <h2 className="mt-4 font-display text-3xl sm:text-4xl lg:text-5xl font-light text-balance">
            A career measured in <em className="not-italic text-cedar">impact,</em> not titles.
          </h2>
          <p className="mt-5 text-stone/85 leading-relaxed">
            Every role expanded the footprint. From training Mac and Mobile technicians in South
            Chicago to building systems that touch 22 cities across 5 continents. Follow the map as
            each chapter lights up, and read what shipped at every turn.
          </p>
        </div>

        {/* Map leads — full-width on mobile (top), sticky companion on desktop (left) */}
        <div className="lg:grid lg:grid-cols-[minmax(0,1.02fr)_minmax(0,1.4fr)] lg:gap-12 xl:gap-16 items-start">
          <div className="mb-12 lg:mb-0 lg:sticky lg:top-24">
            <CareerWorldMap activeStep={activeStep} />
          </div>

          <ol className="space-y-10 lg:space-y-16">
            {STEPS.map((step, i) => (
              <StepCard
                key={step.company}
                step={step}
                index={i}
                isActive={i === activeStep}
                registerNode={registerNode}
              />
            ))}
          </ol>
        </div>

        {/* closing stat */}
        <div className="mt-20 rounded-3xl border border-cedar/30 bg-cedar/[0.06] p-8 lg:p-12">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div>
              <div className="font-display text-4xl lg:text-5xl font-light text-mist">22</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
                cities across 5 continents
              </div>
            </div>
            <div>
              <div className="font-display text-4xl lg:text-5xl font-light text-mist">150+</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
                School of Rock locations opened
              </div>
            </div>
            <div>
              <div className="font-display text-4xl lg:text-5xl font-light text-mist">200+</div>
              <div className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar">
                current locations managed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
