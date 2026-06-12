import { SectionLabel } from "./SectionLabel";
import { VideoEmbed } from "./VideoEmbed";

// The four FPV one-shot films (collaboration with Benton Drones).
const ONE_SHOTS = [
  {
    id: "LUuuOXUUqKE",
    title: "Fayetteville Square",
    poster: "LUuuOXUUqKE",
    credit: "FPV one-shot",
  },
  { id: "IerAeZNcFvQ", title: "4K One-Shot Tour", poster: "IerAeZNcFvQ", credit: "FPV one-shot" },
  {
    id: "YFSG0szsvpE",
    title: "Rogers Downtown Lights",
    poster: "YFSG0szsvpE",
    credit: "FPV one-shot",
  },
  {
    id: "dO30IZZW13w",
    title: "Arkansas Swim Academy",
    poster: "dO30IZZW13w",
    credit: "Brand film",
  },
] as const;

const CAPTURE_CHIPS = ["LiDAR", "Infrared", "High-res camera", "Survey QA"] as const;

const BREWING_DRIVE_URL = "https://drive.google.com/file/d/1XF_7cg7UZYq04Wf44hP4Lda7qz2pSNBM/view";

function Eyebrow({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-cedar mb-3">{children}</p>
  );
}

export function Ventures() {
  return (
    <section id="ventures" className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
      <SectionLabel index="01" chapter="Beyond the systems">
        Ventures
      </SectionLabel>

      <div className="max-w-3xl">
        <h1 className="font-display text-4xl font-light leading-tight text-foreground sm:text-5xl">
          Helping a vision <span className="text-cedar">take root</span>.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-stone/85">
          Alongside the systems work, I&rsquo;ve spent years helping people turn an idea into
          something you can actually see. The instinct is the same one that drives the engineering:
          sit with someone&rsquo;s vision, understand what they&rsquo;re really after, and build the
          thing that makes it real &mdash; whether that&rsquo;s a film, a brand moment, or a sensor
          rig in a field.
        </p>
      </div>

      {/* ---- Spruce Grove Media ---------------------------------------- */}
      <div className="mt-20">
        <Eyebrow>Spruce Grove Media &middot; creative studio I founded &amp; ran</Eyebrow>
        <h2 className="font-display text-2xl font-light text-foreground sm:text-3xl">
          One-shot films, motion, and a whole lot of small-business stories.
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-stone/80">
          I founded &mdash; and later wound down &mdash; Spruce Grove Media, a production studio
          where I handled producing, post-editing, sound design, and color grading. In collaboration
          with Benton Drones I produced first-person-view, single-take films of local businesses and
          the towns around them; I also cut weddings, events, and a long list of local shops &mdash;
          barbershops, a craft store, and more &mdash; always working to make a business
          owner&rsquo;s creative vision land on screen.
        </p>

        {/* Featured: animated product release */}
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <VideoEmbed
            id="7Fzq2Gazugk"
            title={"Space Goose & The Escape From Galactic Prison"}
            poster="7Fzq2Gazugk"
            credit="Animation · Bentonville Brewing"
          />
          <div>
            <Eyebrow>Featured &middot; motion &amp; animation</Eyebrow>
            <h3 className="font-display text-xl font-light text-foreground">
              A product release, told as a cartoon.
            </h3>
            <p className="mt-3 leading-relaxed text-stone/80">
              For Bentonville Brewing Company&rsquo;s &ldquo;Space Goose&rdquo; release I wrote,
              animated, and scored a short film just for the fun of it &mdash; a reminder that good
              creative doesn&rsquo;t always need a drone or a deadline.
            </p>
            <a
              href={BREWING_DRIVE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-cedar hover:text-foreground transition-colors"
            >
              Watch in full resolution
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>

        {/* One-shot films grid */}
        <div className="mt-12">
          <Eyebrow>One-shot films &middot; with Benton Drones</Eyebrow>
          <ul className="grid gap-6 sm:grid-cols-2">
            {ONE_SHOTS.map((v) => (
              <li key={v.id}>
                <VideoEmbed id={v.id} title={v.title} poster={v.poster} credit={v.credit} />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---- Field & sensor data capture ------------------------------- */}
      <div className="mt-24 rounded-3xl border border-border bg-card/50 p-8 sm:p-12">
        <Eyebrow>Field data capture &middot; Zipline &times; Walmart drone-delivery pilot</Eyebrow>
        <h2 className="font-display text-2xl font-light text-foreground sm:text-3xl">
          When the medium changed, the discipline didn&rsquo;t.
        </h2>
        <p className="mt-4 max-w-3xl leading-relaxed text-stone/80">
          Benton Drones and I were brought in &mdash; with specialized equipment contracted through
          Zipline &mdash; to capture survey data for the Walmart drone-delivery pilot in our city. I
          worked as a <span className="text-foreground">data-capture analyst</span>, running rigs
          that recorded LiDAR, infrared, and high-resolution camera data across willing
          participants, then validating that every dataset was complete and clean enough to help
          establish Zipline&rsquo;s V2 delivery platform.
        </p>
        <p className="mt-4 max-w-3xl leading-relaxed text-stone/70">
          Different tools, same instinct as everything else I build: meet the technical
          implementation wherever it is, and get the data right.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2.5">
          {CAPTURE_CHIPS.map((c) => (
            <li
              key={c}
              className="rounded-full border border-cedar/30 bg-cedar/[0.06] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-stone/80"
            >
              {c}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
