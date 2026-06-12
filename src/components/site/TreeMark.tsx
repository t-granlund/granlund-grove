export function TreeMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* tree-ring backdrop */}
      <circle cx="24" cy="24" r="21" opacity="0.25" />
      <circle cx="24" cy="24" r="15" opacity="0.18" />
      <circle cx="24" cy="24" r="9" opacity="0.12" />
      {/* spruce */}
      <path d="M24 6 L24 42" />
      <path d="M24 10 L17 18 L24 18 L31 18 Z" />
      <path d="M24 18 L15 27 L24 27 L33 27 Z" />
      <path d="M24 27 L13 37 L24 37 L35 37 Z" />
    </svg>
  );
}
