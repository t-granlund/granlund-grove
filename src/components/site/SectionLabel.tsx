export function SectionLabel({
  index,
  chapter,
  children,
}: {
  index: string;
  chapter?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <span className="font-mono text-xs text-cedar tracking-[0.25em]">{index}</span>
      <div className="h-px flex-1 max-w-[60px] bg-gradient-to-r from-cedar/60 to-transparent" />
      <span className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
        {children}
      </span>
      {chapter && (
        <>
          <span className="text-stone/30">·</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cedar/60">
            {chapter}
          </span>
        </>
      )}
    </div>
  );
}
