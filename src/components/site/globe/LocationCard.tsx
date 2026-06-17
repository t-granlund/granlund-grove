import { LocationData, TYPE_COLORS, TYPE_LABELS } from "./data";

export function LocationCard({
  location,
  onClose,
}: {
  location: LocationData;
  onClose: () => void;
}) {
  const color = TYPE_COLORS[location.type];
  const colorHex = `#${color.getHexString()}`;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[22rem] max-w-[90vw] rounded-2xl border border-border bg-card/98 backdrop-blur-md p-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: colorHex }} />
          <div>
            <div
              className="font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ color: colorHex }}
            >
              {TYPE_LABELS[location.type]}
            </div>
            <h3 className="font-display text-xl mt-0.5">{location.name}</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-full p-1.5 hover:bg-white/5 transition-colors shrink-0"
          aria-label="Close location details"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-stone/60">
            <path
              d="M12 4L4 12M4 4l8 8"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-2.5">
        <div className="flex gap-4">
          <div className="flex-1">
            <div className="font-mono text-[9px] uppercase tracking-widest text-stone/40 mb-0.5">
              Brand
            </div>
            <div className="text-sm text-stone/90">{location.brand}</div>
          </div>
          <div className="flex-1">
            <div className="font-mono text-[9px] uppercase tracking-widest text-stone/40 mb-0.5">
              Years
            </div>
            <div className="text-sm text-stone/90">{location.years}</div>
          </div>
        </div>

        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-stone/40 mb-0.5">
            Role
          </div>
          <div className="text-sm text-stone/90">{location.role}</div>
        </div>

        <div>
          <div className="font-mono text-[9px] uppercase tracking-widest text-stone/40 mb-1">
            Contribution
          </div>
          <p className="text-sm text-stone/80 leading-relaxed">{location.contribution}</p>
        </div>

        {location.sources.length > 0 && (
          <div className="pt-1">
            <div className="font-mono text-[9px] uppercase tracking-widest text-stone/40 mb-2">
              Sources
            </div>
            <div className="flex flex-wrap gap-2">
              {location.sources.map((source) => (
                <a
                  key={source.label}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-white/[0.03] px-3 py-1.5 text-sm text-cedar hover:text-cedar/80 hover:bg-white/[0.06] transition-colors"
                >
                  <span>{source.label}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M6 2h4v4M10 2L6 6M2 10h8"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
