import Link from "next/link";
import { cn } from "@/lib/utils";

export interface FilterTab {
  key: string;
  label: string;
  count?: number;
  href: string;
}

/** Status filter tabs rendered as links, so they work without JS and are shareable. */
export function FilterTabs({ tabs, active, label }: { tabs: FilterTab[]; active: string; label: string }) {
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto px-1">
      <ul className="flex w-max items-center gap-1">
        {tabs.map((t) => {
          const on = t.key === active;
          return (
            <li key={t.key}>
              <Link
                href={t.href}
                aria-current={on ? "page" : undefined}
                className={cn(
                  "inline-flex h-8 items-center gap-2 rounded-md px-2.5 text-[13px] font-medium transition-colors",
                  on ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                )}
              >
                {t.label}
                {t.count !== undefined ? (
                  <span className={cn("mono text-[11px]", on ? "text-ink" : "text-muted")}>{t.count}</span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
