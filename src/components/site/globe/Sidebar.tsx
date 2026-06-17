import { useState, useMemo } from "react";
import { LOCATIONS, TYPE_COLORS, TYPE_LABELS } from "./data";
import type { LocationData } from "./data";

const BRAND_GROUPS: Record<string, number[]> = {
  Apple: [0],
  "School of Rock": [1, 2, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  "Outdoor Cap": [3, 4, 5, 6, 7, 8],
  "North 40 / Smith & Rogue": [21],
  "Head to Toe Brands": [22, 23],
};

const TYPE_ORDER: Array<LocationData["type"]> = ["root", "hub", "intl"];

export function Sidebar({
  selectedIndex,
  onSelect,
  onClose,
  isOpen,
}: {
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  onClose: () => void;
  isOpen: boolean;
}) {
  const [activeFilter, setActiveFilter] = useState<"all" | LocationData["type"]>("all");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let indices = LOCATIONS.map((_, i) => i);
    if (activeFilter !== "all") {
      indices = indices.filter((i) => LOCATIONS[i].type === activeFilter);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      indices = indices.filter(
        (i) =>
          LOCATIONS[i].name.toLowerCase().includes(q) ||
          LOCATIONS[i].brand.toLowerCase().includes(q) ||
          LOCATIONS[i].role.toLowerCase().includes(q),
      );
    }
    return indices;
  }, [activeFilter, search]);

  const grouped = useMemo(() => {
    const out: Record<string, number[]> = {};
    for (const i of filtered) {
      const brand = LOCATIONS[i].brand;
      if (!out[brand]) out[brand] = [];
      out[brand].push(i);
    }
    // Sort each group by type order
    for (const brand of Object.keys(out)) {
      out[brand].sort(
        (a, b) => TYPE_ORDER.indexOf(LOCATIONS[a].type) - TYPE_ORDER.indexOf(LOCATIONS[b].type),
      );
    }
    return out;
  }, [filtered]);

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => onClose()}
        className={`absolute top-4 left-4 z-20 rounded-lg border border-border bg-card/90 backdrop-blur-sm p-2.5 transition-all duration-300 hover:bg-card ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        aria-label="Open city explorer"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="text-stone/70">
          <path
            d="M2.5 4.5h13M2.5 9h13M2.5 13.5h13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {/* Drawer */}
      <div
        data-testid="globe-sidebar"
        className={`absolute top-0 bottom-0 left-0 z-20 w-80 max-w-[80vw] border-r border-border bg-card/95 backdrop-blur-md transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar/80">
                22 cities · 5 continents
              </div>
              <h3 className="font-display text-lg mt-0.5">Explore the network</h3>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 hover:bg-white/5 transition-colors"
              aria-label="Close sidebar"
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

          {/* Search */}
          <div className="px-4 pt-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cities, brands..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-border bg-white/[0.03] px-3 py-2 text-sm text-stone/90 placeholder:text-stone/30 focus:outline-none focus:border-cedar/40 focus:ring-1 focus:ring-cedar/20 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-stone/40 hover:text-stone/70"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Type filter pills */}
          <div className="flex gap-2 px-4 pt-3 pb-1">
            {(["all", "root", "hub", "intl"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider transition-colors ${
                  activeFilter === t
                    ? "bg-cedar/20 text-cedar border border-cedar/30"
                    : "bg-white/[0.03] text-stone/50 border border-transparent hover:bg-white/[0.06]"
                }`}
              >
                {t === "all" ? "All" : TYPE_LABELS[t]}
              </button>
            ))}
          </div>

          {/* Location list */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
            {Object.entries(grouped).length === 0 ? (
              <div className="text-sm text-stone/40 text-center py-8">
                No locations match your filters.
              </div>
            ) : (
              Object.entries(grouped).map(([brand, indices]) => (
                <div key={brand}>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-stone/40 mb-2 flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    {brand}
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="space-y-1">
                    {indices.map((idx) => {
                      const loc = LOCATIONS[idx];
                      const color = `#${TYPE_COLORS[loc.type].getHexString()}`;
                      const isSelected = selectedIndex === idx;
                      return (
                        <button
                          key={idx}
                          onClick={() => onSelect(idx)}
                          className={`w-full text-left rounded-lg px-3 py-2 transition-all duration-200 group ${
                            isSelected
                              ? "bg-cedar/10 border border-cedar/20"
                              : "hover:bg-white/[0.04] border border-transparent"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-stone/90 truncate">
                                {loc.name}
                              </div>
                              <div className="text-[10px] text-stone/50 truncate">{loc.role}</div>
                            </div>
                            {isSelected && (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 14 14"
                                fill="none"
                                className="text-cedar shrink-0"
                              >
                                <path
                                  d="M2.5 7l3 3 6-6"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-border text-center">
            <span className="text-[10px] text-stone/30 font-mono uppercase tracking-wider">
              Click a city to explore
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
