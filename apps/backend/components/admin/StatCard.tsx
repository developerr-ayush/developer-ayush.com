import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: number | string;
  icon: ReactNode;
  /** Tailwind color for the icon background — e.g. "blue", "amber", "emerald" */
  color?: "blue" | "amber" | "emerald" | "rose" | "violet" | "slate";
  description?: string;
  /** Show a change indicator */
  change?: { value: string; positive: boolean };
}

const COLOR_MAP = {
  blue: "bg-blue-500/10 text-blue-400",
  amber: "bg-amber-500/10 text-amber-400",
  emerald: "bg-emerald-500/10 text-emerald-400",
  rose: "bg-rose-500/10 text-rose-400",
  violet: "bg-violet-500/10 text-violet-400",
  slate: "bg-slate-500/10 text-slate-400",
};

/**
 * Metric/stat card used on the dashboard and the slang management page.
 */
export function StatCard({
  label,
  value,
  icon,
  color = "blue",
  description,
  change,
}: StatCardProps) {
  return (
    <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6 hover:border-white/15 transition-all group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl ${COLOR_MAP[color]}`}>{icon}</div>
        {change && (
          <span
            className={`text-xs font-semibold ${
              change.positive ? "text-emerald-400" : "text-rose-400"
            }`}
          >
            {change.positive ? "↑" : "↓"} {change.value}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-3xl font-bold text-white tabular-nums">{value}</p>
        {description && (
          <p className="text-xs text-slate-600">{description}</p>
        )}
      </div>
    </div>
  );
}
