import { cn } from "@/lib/utils";

/**
 * "<AS>" brand mark. This is a typographic placeholder: swap the body of
 * `LogoMark` for the supplied logo file (e.g. `<Image src="/logo/as.svg" … />`)
 * and replace `app/icon.svg` — every call site picks it up.
 */
export function LogoMark({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-7 min-w-7 px-1.5 text-[12px]",
    md: "h-8 min-w-8 px-2 text-[13px]",
    lg: "h-11 min-w-11 px-3 text-[17px]",
  } as const;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex select-none items-center justify-center rounded-[9px] bg-ink font-mono font-bold leading-none tracking-tight text-paper",
        sizes[size],
        className
      )}
    >
      &lt;AS&gt;
    </span>
  );
}

export function Logo({
  className,
  showName = true,
  size = "md",
}: {
  className?: string;
  showName?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark size={size} />
      {showName ? (
        <span className="text-[13.5px] font-semibold tracking-tight">
          Ayush Shah
          <span className="sr-only"> admin</span>
        </span>
      ) : (
        <span className="sr-only">Ayush Shah</span>
      )}
    </span>
  );
}
