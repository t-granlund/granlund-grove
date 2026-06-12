import { Link } from "@tanstack/react-router";
import { TreeMark } from "./TreeMark";

const sections = [
  { to: "/about", label: "About" },
  { to: "/career", label: "Career" },
  { to: "/work", label: "Work" },
  { to: "/resume", label: "Resume" },
  { to: "/contact", label: "Contact" },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-border bg-[oklch(0.14_0.012_150)]">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <TreeMark className="h-6 w-6 text-cedar" />
          <span className="font-display text-base text-foreground">Tyler Granlund</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            · Spruce Grove
          </span>
        </Link>

        <nav
          className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
          aria-label="Footer navigation"
        >
          {sections.map((s) => (
            <Link key={s.to} to={s.to} className="hover:text-foreground transition-colors">
              {s.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t border-border">
        <div className="mx-auto max-w-6xl px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div className="flex gap-5">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/colophon" className="hover:text-foreground transition-colors">
              Colophon
            </Link>
          </div>
          <span className="font-mono tracking-[0.15em]">
            © {new Date().getFullYear()} · tylergranlund.com
          </span>
        </div>
      </div>
    </footer>
  );
}
