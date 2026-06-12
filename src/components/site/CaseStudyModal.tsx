// Generic expandable modal for every case study.
// Renders the five-beat narrative + diagram inside a Radix Dialog.
// Estate Trace passes extraContent (EstateTraceDeepDive) that renders first.

import type React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CaseStudy } from "./Projects";

function Beat({ label, children }: { label: string; children: string }) {
  return (
    <div className="grid sm:grid-cols-[9rem_1fr] gap-1 sm:gap-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar pt-1">
        {label}
      </div>
      <p className="text-sm text-stone/90 leading-relaxed">{children}</p>
    </div>
  );
}

function Label({ children }: { children: string }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar mb-3">{children}</p>
  );
}

interface Props {
  study: CaseStudy;
  /** Optional extra sections rendered above the five-beat narrative */
  extraContent?: React.ReactNode;
}

export function CaseStudyModal({ study, extraContent }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="grove" size="lg" className="mt-5 w-full sm:w-auto">
          Explore the system <span aria-hidden="true">&#8599;</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar text-left">
            {study.kicker}
          </span>
          <DialogTitle className="font-display text-3xl font-light text-foreground text-left">
            {study.name}
          </DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-center gap-3 text-left">
              <span className="text-sm text-stone/70">{study.teaser}</span>
              <span className="shrink-0 text-[10px] font-mono uppercase tracking-[0.2em] text-stone/50 px-2.5 py-1 rounded-full border border-border">
                {study.tag}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Key metrics */}
        <div
          className="grid grid-cols-3 gap-x-6 gap-y-4 border-l-2 border-cedar/40 pl-5 sm:flex sm:flex-wrap sm:gap-x-10"
          aria-label="Key metrics"
        >
          {study.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-3xl font-light leading-none text-mist">
                {m.value}
              </div>
              <div className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-cedar/90">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Estate Trace deep dive / any extra content */}
        {extraContent && <div className="mt-2">{extraContent}</div>}

        {/* Five-beat narrative */}
        <section className="mt-6 space-y-5">
          <Label>The full story</Label>
          <Beat label="Problem">{study.problem}</Beat>
          <Beat label="Architecture">{study.architecture}</Beat>
          <Beat label="Oversight &amp; evals">{study.oversight}</Beat>
          <Beat label="Outcome">{study.outcome}</Beat>
          <Beat label="My take">{study.reflection}</Beat>
        </section>

        {/* Technical diagram */}
        {study.diagram && (
          <section className="mt-7">
            <Label>System diagram</Label>
            <div className="rounded-xl border border-border bg-[oklch(0.16_0.012_150)] p-4 overflow-x-auto">
              {study.diagram}
            </div>
          </section>
        )}

        {/* Stack + link */}
        <div className="mt-6 flex flex-wrap gap-2">
          {study.stack.map((t) => (
            <span
              key={t}
              className="text-xs px-2.5 py-1 rounded-full border border-border bg-[oklch(0.30_0.03_158/0.4)] text-stone/90"
            >
              {t}
            </span>
          ))}
        </div>
        {(study.link || study.note) && (
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
            {study.link && (
              <a
                href={study.link.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 text-sm text-cedar hover:text-mist transition-colors"
              >
                {study.link.label} <span aria-hidden="true">&#8599;</span>
              </a>
            )}
            {study.note && <span className="text-xs text-stone/60 italic">{study.note}</span>}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
