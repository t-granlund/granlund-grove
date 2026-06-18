import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { TreeMark } from "./TreeMark";

const items = [
  { to: "/about", label: "About" },
  { to: "/career", label: "Career" },
  { to: "/work", label: "Work" },
  { to: "/ecosystem", label: "Ecosystem" },
  { to: "/ventures", label: "Ventures" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
] as const;

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus trap + Escape key for mobile menu
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusable = panel.querySelectorAll<HTMLElement>(
      'a[href], button, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      }
    };

    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };

    const onClickOutside = (e: MouseEvent) => {
      if (
        panel &&
        !panel.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    first?.focus();
    document.addEventListener("keydown", onTab);
    document.addEventListener("keydown", onEscape);
    document.addEventListener("mousedown", onClickOutside);

    return () => {
      document.removeEventListener("keydown", onTab);
      document.removeEventListener("keydown", onEscape);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`flex items-center justify-between rounded-full px-5 py-3 transition-all duration-500 ${
            scrolled ? "glass shadow-[var(--shadow-lift)]" : "bg-transparent"
          }`}
        >
          <Link to="/" className="flex items-center gap-2.5 group">
            <TreeMark className="h-7 w-7 text-cedar transition-transform duration-700 group-hover:rotate-[3deg]" />
            <div className="flex items-baseline gap-2">
              <span className="font-display text-base font-semibold tracking-tight">
                Tyler Granlund
              </span>
              {/* gran·lund (Swedish) = spruce grove — linguistic gloss inline with name */}
              <span className="hidden sm:inline font-mono text-[10px] tracking-[0.12em] text-muted-foreground/80">
                gran·lund&nbsp;&middot;&nbsp;sv.&nbsp;&middot;&nbsp;spruce grove
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1" aria-label="Primary navigation">
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-full"
                activeProps={{
                  className:
                    "px-3 py-2 text-sm text-cedar rounded-full bg-[oklch(0.68_0.12_55/0.12)]",
                  "aria-current": "page",
                }}
              >
                {i.label}
              </Link>
            ))}
          </nav>

          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center gap-2 rounded-full border border-cedar bg-[oklch(0.68_0.12_55/0.1)] px-4 py-2 text-sm text-cedar hover:bg-[oklch(0.68_0.12_55/0.18)] transition-colors"
          >
            Let&apos;s talk
            <span className="text-base leading-none">→</span>
          </Link>

          <button
            ref={buttonRef}
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-foreground"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            <div className="space-y-1.5">
              <span
                className={`block h-px w-6 bg-current transition-transform ${open ? "translate-y-1.5 rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-current transition-opacity ${open ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-px w-6 bg-current transition-transform ${open ? "-translate-y-1.5 -rotate-45" : ""}`}
              />
            </div>
          </button>
        </div>

        {open && (
          <div
            ref={panelRef}
            id="mobile-nav"
            role="dialog"
            aria-label="Navigation menu"
            className="lg:hidden mt-3 glass rounded-2xl p-4 space-y-1"
          >
            {items.map((i) => (
              <Link
                key={i.to}
                to={i.to}
                onClick={() => setOpen(false)}
                className="block px-4 py-3 rounded-xl text-foreground hover:bg-[oklch(0.30_0.03_158/0.4)]"
                activeProps={{
                  className: "block px-4 py-3 rounded-xl text-cedar bg-[oklch(0.68_0.12_55/0.12)]",
                  "aria-current": "page",
                }}
              >
                {i.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
