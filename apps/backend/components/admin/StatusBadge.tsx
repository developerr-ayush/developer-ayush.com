import { cn } from "@/lib/utils";

const TONES: Record<string, string> = {
  published: "chip-ok",
  approved: "chip-ok",
  draft: "",
  archived: "",
  pending: "chip-warn",
  rejected: "chip-danger",
  SUPER_ADMIN: "chip-accent",
  ADMIN: "chip-accent",
  USER: "",
};

const LABELS: Record<string, string> = {
  SUPER_ADMIN: "super admin",
  ADMIN: "admin",
  USER: "user",
};

/** Status chip: colour is always paired with a dot + text label. */
export function StatusBadge({
  status,
  label,
  dot = true,
  className,
}: {
  status: string;
  label?: string;
  dot?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("chip", dot && "chip-dot", TONES[status], className)}>
      {label ?? LABELS[status] ?? status}
    </span>
  );
}
