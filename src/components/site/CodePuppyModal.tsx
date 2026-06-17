import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CodePuppyDeepDive } from "./CodePuppyDeepDive";

export function CodePuppyModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="grove" size="lg" className="mt-5 w-full sm:w-auto">
          Explore Code Puppy <span aria-hidden="true">&#8599;</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cedar text-left">
            Open Source · Enterprise
          </span>
          <DialogTitle className="font-display text-3xl font-light text-foreground text-left">
            Code Puppy
          </DialogTitle>
          <DialogDescription asChild>
            <div className="text-left">
              <span className="text-sm text-stone/70">
                The open-source AI agent behind every system I build — recognized by Walmart's CEO
                with the President's Innovation Award.
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {/* Key metrics */}
        <div
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-l-2 border-cedar/40 pl-5"
          aria-label="Key metrics"
        >
          {[
            { value: "616", label: "GitHub stars" },
            { value: "192", label: "forks" },
            { value: "65+", label: "AI providers" },
            { value: "4,000+", label: "Walmart employees" },
          ].map((m) => (
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

        <div className="mt-2">
          <CodePuppyDeepDive />
        </div>
      </DialogContent>
    </Dialog>
  );
}
