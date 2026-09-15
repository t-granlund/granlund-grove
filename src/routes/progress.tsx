import { createFileRoute, Link } from "@tanstack/react-router";
import { TreeMark } from "@/components/site/TreeMark";

// PUBLIC DAILY PROGRESS READOUT — deliberately unindexed.
// Shared directly (text/link) with the people it is written for. It is not in
// the nav, not in the sitemap, and carries noindex/nofollow. Content per the
// Sept 3 voice-log spec: chronological, rooted in people, tangibles visible.

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — September 3rd, 2026" },
      {
        name: "description",
        content:
          "Tyler Granlund's public daily progress readout. What was done, when, and where — plus what shipped and what comes next.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
    // No canonical, no sitemap entry: this page is shared by link, not found by search.
  }),
  component: ProgressPage,
});

type Stop = {
  time: string;
  place: string;
  title: string;
  body: string;
  people?: string[];
};

const TODAY: Stop[] = [
  {
    time: "Morning",
    place: "Home · Bella Vista",
    title: "Started with the house, not the hustle",
    body: "Kids up, out the door, no issues. House reset before anything else. Then the resume rework: last night's feedback was fair — titles are now exactly the titles held, and the multi-agent systems are described as orchestrated systems, not personal code fluency. Pure, honest, true.",
  },
  {
    time: "Morning",
    place: "Starbucks",
    title: "Worked session — progress page build",
    body: "Laptop open, final changes shipped on the work with Anderson, and this dashboard framework assembled. Two action items logged: a School of Rock section for the lead platform, and a warm intro email for Anderson to the owners I spent seven years serving.",
  },
  {
    time: "Late morning",
    place: "Bentonville Barbershop",
    title: "The shop is already working",
    body: "Picked up the resumes I'd left there — and heard a barber had already passed my contact info to a business owner looking for IT help. Pitched Drew Garrison on the Leather Apron Club. And when a gentleman mentioned his HVAC dying with two dogs and young kids at home in this heat, I wrote down my address and lent him my portable AC.",
    people: ["Drew Garrison", "Victor", "the neighbor with the AC"],
  },
  {
    time: "Midday",
    place: "Anderson's shop · Pea Ridge",
    title: "Shipped: the lead-capture platform is live",
    body: "After weeks of evenings, Anderson's lead-ingest directory is live on his own domain — with architecture docs, training material, and everything he needs to iterate on it himself. Terms already sketched: up to $350 per qualified lead he lands, with commission back to me. Also here: hearing Bobby's story — injured, on disability, keeping himself going through photography — I decided to gift him my 2001 Dyno Comp GT to restore for his 12-year-old son, who just found bikes.",
    people: ["Anderson", "Becca", "Bobby"],
  },
  {
    time: "Drive",
    place: "E McNelly Rd",
    title: "The 24-minute daily log",
    body: "Every minute of the drive toward Rogers was dictated into the daily log — the full morning replay, the friction, and the receipts. That audio became eleven transcribed, timestamped pages the same afternoon.",
  },
  {
    time: "Arriving",
    place: "S Arkansas St · Rogers",
    title: "Target named: a Friday gathering",
    body: "Parked outside Onyx, framing the rest of the afternoon — spend small, aim everything at revenue. And the big one: by next Friday, a one-hour gathering of like-minded people with real enablement opportunities — the Leather Apron Club, Franklin's Junto adapted to now, hosted at the barbershop, where even Walmart's top executives sit in the chair. Also specified out loud: this report, auto-sent to the two people it's written for at exactly 4pm.",
  },
  {
    time: "Midday",
    place: "Onyx Coffee Lab · Rogers",
    title: "Order number nine",
    body: "Small order — money is being watched. The barista, someone I'd met before, has a nine tattooed on her wrist for the moments it's shown up for her. When I told her what I'm out here doing — community-rooted work, because I was alone for a while — she said she wished we'd met a year ago, before she had to close her own coffee business. 'Please come back.'",
  },
  {
    time: "Midday",
    place: "Onyx Coffee Lab · Back bar",
    title: "The muralist and the Candela thread",
    body: "Sat by the roasters, next to a man drawing something stunning in colored pencil. He and his wife run a mural business across Springdale and Rogers. He'd just signed with Candela — the agency behind Onyx's website — via a grant. An introduction to Candela is on the table, numbers exchanged.",
    people: ["the muralist", "Tom"],
  },
  {
    time: "Afternoon",
    place: "Popeyes",
    title: "Decision: put the journey in the open",
    body: "This page is that decision. The journey goes public on a domain I've owned for years — dated, structured, and honest, instead of argued about over a picture of a resume.",
  },
  {
    time: "Afternoon",
    place: "Beltone",
    title: "The page becomes an architecture",
    body: "The spec sharpens: not a task list — a top-to-bottom chronological timeline, organized around people. Drew and Victor by name, the gentleman with the dead AC, the 'please come back so you can tell me what's up' at the register, the artist just met — each rooted with geo-coordinates, so the journey is provable instead of asserted.",
    people: ["Drew Garrison", "Victor"],
  },
  {
    time: "Afternoon",
    place: "First Security Bank",
    title: "Dictated the pipeline you're reading",
    body: "Specified the whole system out loud: voice memos → local transcription → structured, per-memo pages → this progress report. Executed the same day.",
  },
  {
    time: "Afternoon",
    place: "First Security Bank · addendum",
    title: "The tangibles memo",
    body: "A correction of record: the work with these people was already underway — it just needed to be seen. Per-person impact notes tied to goals, plus direct links to the tangibles. Anderson is live on his leads domain, fully enabled with Code Puppy to iterate the directory himself — up to $350 per qualified, landed lead, commission sketched. The barbershop still has no website — so the mock-up already built in their voice gets linked, in the open.",
    people: ["Anderson"],
  },
  {
    time: "Homeward",
    place: "I-49 N",
    title: "The insignia rule",
    body: "Eighteen seconds and one directive — every asset in this ecosystem carries the Spruce Grove tree mark, with an under-note: 'Inspired by Code Puppy.' Attribution isn't decoration; it's the creed with feet. Check the footer.",
  },
  {
    time: "16:00",
    place: "School pickup",
    title: "Pierce, on time",
    body: "The non-negotiable block in every day. Pick him up, get him home to his sister.",
  },
  {
    time: "Tonight",
    place: "NWA Tech Alliance · monthly meetup",
    title: "Into the room",
    body: "The region's tech community, monthly. Networking, listening, and offering value — letting the work introduce itself.",
  },
];

const SHIPPED: { label: string; href?: string; note: string }[] = [
  {
    label: "Single-page honest resume",
    href: "https://tylergranlund.com/resume",
    note: "Reworked this morning after last night's feedback. Titles are titles held; agent systems described as orchestrated, not hand-coded.",
  },
  {
    label: "Anderson's lead-capture platform",
    note: "Live on his domain. Full architecture docs + training materials shipped with it; he can now iterate independently. Licensing path sketched.",
  },
  {
    label: "Bentonville Barbershop website mock-up",
    note: "They have no website. The mock-up speaks their values and is ready to put in front of them.",
  },
  {
    label: "Eleven-memo daily log system",
    note: "Dictated all day, transcribed locally the same afternoon, rendered as timestamped pages in this design system.",
  },
  {
    label: "This page",
    note: "progress.tylergranlund.com — built, deployed, and shared the day it was dictated.",
  },
];

function ProgressPage() {
  return (
    <main id="main-content" className="min-h-screen bg-[var(--color-background)]" tabIndex={-1}>
      <div className="mx-auto max-w-3xl px-6 py-24 sm:py-32">
        {/* ——— Masthead ——— */}
        <div className="flex items-center gap-2.5 mb-14">
          <TreeMark className="h-7 w-7 text-cedar" />
          <span className="font-display text-base font-semibold tracking-tight text-foreground">
            Spruce Grove
          </span>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-4">
          Public daily progress · September 3rd, 2026
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-light text-balance leading-[1.08]">
          A day in the grove, <em className="not-italic text-cedar">in order.</em>
        </h1>
        <p className="mt-6 text-stone/85 leading-relaxed max-w-xl">
          Actions speak louder than words — so here are the actions. What I did today, where I was,
          who I talked to, and what shipped. This page is written for two specific people, but it's
          public on purpose: progress you can check beats reassurance you have to take on faith.
        </p>
        <p className="mt-3 text-sm text-stone/60 font-mono">
          progress.tylergranlund.com · updated daily
        </p>

        {/* ——— Timeline ——— */}
        <section className="mt-16" aria-labelledby="today">
          <h2
            id="today"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-8"
          >
            Today, in order
          </h2>
          <ol className="relative border-l border-border ml-2 space-y-10">
            {TODAY.map((stop) => (
              <li key={stop.place} className="pl-8 relative">
                <span
                  className="absolute -left-[5px] top-2 h-2.5 w-2.5 rounded-full bg-cedar/70"
                  aria-hidden="true"
                />
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone/60">
                  {stop.time} · {stop.place}
                </div>
                <h3 className="mt-1.5 font-display text-xl text-foreground">{stop.title}</h3>
                <p className="mt-2 text-sm text-stone/80 leading-relaxed">{stop.body}</p>
                {stop.people && (
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {stop.people.map((person) => (
                      <li
                        key={person}
                        className="rounded-full border border-border bg-[oklch(0.22_0.03_158/0.6)] px-3 py-1 font-mono text-[10px] text-stone/70"
                      >
                        {person}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* ——— Tangibles ——— */}
        <section className="mt-20" aria-labelledby="shipped">
          <h2
            id="shipped"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-6"
          >
            What shipped today
          </h2>
          <div className="divide-y divide-border border-y border-border">
            {SHIPPED.map((item) => (
              <div key={item.label} className="py-5 grid sm:grid-cols-[16rem_1fr] gap-2 sm:gap-6">
                <div className="text-sm font-medium text-foreground">
                  {item.href ? (
                    <a href={item.href} className="text-cedar hover:underline">
                      {item.label} ↗
                    </a>
                  ) : (
                    item.label
                  )}
                </div>
                <p className="text-sm text-stone/75 leading-relaxed">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ——— The initiative ——— */}
        <section className="mt-20 rounded-xl border border-border bg-card p-8" aria-labelledby="lac">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-3">
            The initiative
          </p>
          <h2 id="lac" className="font-display text-2xl text-foreground">
            The Leather Apron Club
          </h2>
          <p className="mt-4 text-sm text-stone/85 leading-relaxed">
            When Benjamin Franklin was 21, he started the Junto — working people and tradesmen
            meeting weekly to improve themselves and their community. That's the model, adapted to
            now: small business owners, artists, and makers in Northwest Arkansas, meeting around a
            barbershop, learning to navigate the agentic era together instead of being steamrolled
            by it. Nobody in the room needs to be technical — that's the point. The community
            carries the technology load; the members carry their craft.
          </p>
          <p className="mt-4 text-sm text-stone/85 leading-relaxed">
            First gathering is targeted for <span className="text-cedar">next Friday</span> — an
            hour, a small group of the right people, and the Spruce Grove system demonstrated live
            on real work shipped this week.
          </p>
        </section>

        {/* ——— Plain statement ——— */}
        <section className="mt-20" aria-labelledby="plain">
          <h2
            id="plain"
            className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar mb-6"
          >
            Said plainly
          </h2>
          <div className="text-stone/85 leading-relaxed space-y-4 text-[15px]">
            <p>
              I'm not an IT systems engineer by trade, and I'm not going to print that on a
              resume again. I'm a product manager and operator who has spent fifteen years
              standing up real systems — help desks, identity platforms, commerce backends, and
              now supervised multi-agent systems — for organizations that ran on them.
            </p>
            <p>
              The agent systems I've built lately aren't a claim about being fluent in a dozen
              programming languages. They're orchestrated systems: I design the architecture,
              direct the agents, and gate what ships. The proof isn't a bullet point — it's live
              on the internet, and the architecture is being open-sourced so anyone can inspect
              it.
            </p>
            <p>
              Today wasn't arts and crafts. A platform went live for a paying use case, a lead
              came in from a barbershop that never had a website, two introductions opened toward
              real revenue, and one neighbor's house has air conditioning tonight. That's the
              work. It's also the job hunt — done the only way I know how: in the community, out
              loud, with receipts.
            </p>
          </div>
        </section>

        {/* ——— Insignia footer (per the I-49 memo spec) ——— */}
        <footer className="mt-24 pt-8 border-t border-border">
          <div className="flex items-center gap-2 text-stone/70">
            <TreeMark className="h-4 w-4 text-cedar/80" />
            <span className="font-display text-sm font-semibold tracking-tight">Spruce Grove</span>
          </div>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-stone/50">
            Inspired by Code Puppy
          </p>
          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-stone/50 font-mono">
            <span>SEPT 3, 2026</span>
            <span>BELLA VISTA → ROGERS, AR</span>
            <Link to="/" className="hover:text-cedar transition-colors">
              tylergranlund.com
            </Link>
            <Link to="/resume" className="hover:text-cedar transition-colors">
              /resume
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
