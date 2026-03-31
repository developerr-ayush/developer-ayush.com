type Status =
  | "published"
  | "draft"
  | "archived"
  | "approved"
  | "pending"
  | "rejected"
  | "ADMIN"
  | "SUPER_ADMIN"
  | "USER"
  | string;

const STATUS_STYLES: Record<string, string> = {
  published: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  draft: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  rejected: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  archived: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  SUPER_ADMIN: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  ADMIN: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  USER: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

interface StatusBadgeProps {
  status: Status;
  label?: string;
  /** Show a pulsing dot indicator */
  dot?: boolean;
}

/**
 * Reusable status badge. Maps status strings to consistent color styles.
 * Falls back to a neutral gray if the status is unknown.
 */
export function StatusBadge({ status, label, dot }: StatusBadgeProps) {
  const style =
    STATUS_STYLES[status] ?? "bg-slate-500/10 text-slate-400 border-slate-500/20";
  const displayLabel = label ?? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${style}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            status === "published" || status === "approved"
              ? "bg-emerald-400"
              : status === "draft" || status === "pending"
                ? "bg-amber-400"
                : "bg-rose-400"
          }`}
        />
      )}
      {displayLabel}
    </span>
  );
}
