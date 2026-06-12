import { useState } from "react";

// Privacy-preserving YouTube facade. Shows a self-hosted poster; the
// youtube-nocookie player iframe is only created after an explicit click, so no
// Google requests fire on page load (matches the site's privacy-by-design CSP).
export function VideoEmbed({
  id,
  title,
  poster,
  credit,
}: {
  id: string;
  title: string;
  /** Local poster basename in /img/ventures (without extension). */
  poster: string;
  credit?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="group overflow-hidden rounded-2xl border border-border bg-card/60">
      <div className="relative aspect-video">
        {playing ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 h-full w-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cedar focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={`Play video: ${title}`}
          >
            <picture>
              <source srcSet={`/img/ventures/${poster}.webp`} type="image/webp" />
              <img
                src={`/img/ventures/${poster}.jpg`}
                alt=""
                width={1280}
                height={720}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            </picture>
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,oklch(0.14_0.012_150/0.75)_100%)]"
            />
            {/* Play affordance */}
            <span
              aria-hidden="true"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-cedar/50 bg-background/70 backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-cedar/20"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 translate-x-[1px] fill-cedar">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        )}
      </div>
      <figcaption className="flex items-baseline justify-between gap-3 px-4 py-3">
        <span className="font-display text-sm text-foreground">{title}</span>
        {credit && (
          <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.18em] text-stone/50">
            {credit}
          </span>
        )}
      </figcaption>
    </figure>
  );
}
