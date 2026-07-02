interface ImagePlaceholderProps {
  label: string;
  /** Where the real asset should be dropped (relative to /public) */
  path: string;
  /** Tailwind aspect class, e.g. "aspect-video" or "aspect-[4/3]" */
  aspect?: string;
  className?: string;
}

/**
 * Styled stand-in for a not-yet-provided asset. Drop the real image at
 * `public/<path>` and swap this component for an <img> — the box keeps
 * the layout stable until then.
 */
export default function ImagePlaceholder({
  label,
  path,
  aspect = "aspect-video",
  className = "",
}: ImagePlaceholderProps) {
  return (
    <div
      role="img"
      aria-label={`Placeholder: ${label}`}
      className={`${aspect} ${className} flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-edge bg-panel/60 p-6 text-center`}
    >
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        className="h-8 w-8 text-fog/60"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="1.6" />
        <path d="m5 17 4.5-4.5 3 3L17 11l2 2" />
      </svg>
      <p className="max-w-sm text-sm text-fog">{label}</p>
      <code className="font-mono text-xs text-fog/60">public/{path}</code>
    </div>
  );
}
