"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, OVERVIEW, isActive, type NavCounts, type NavItem } from "./nav";
import { useAdminUser } from "./user-context";

function Item({
  item,
  collapsed,
  count,
  onNavigate,
}: {
  item: NavItem;
  collapsed: boolean;
  count?: number;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isActive(item, pathname);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? item.label : undefined}
      className={cn(
        "group relative flex h-9 items-center gap-2.5 rounded-lg px-2.5 text-[13.5px] font-medium transition-colors",
        collapsed && "justify-center px-0",
        active ? "bg-surface-2 text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
      )}
    >
      {active ? <span aria-hidden="true" className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-accent" /> : null}
      <Icon className="size-4 shrink-0" aria-hidden="true" />
      <span className={cn("flex-1 truncate", collapsed && "sr-only")}>{item.label}</span>
      {count ? (
        <span
          className={cn(
            "mono rounded-full bg-[color-mix(in_srgb,var(--warn)_14%,transparent)] px-1.5 text-[11px] text-warn",
            collapsed && "absolute right-1 top-0.5 px-1 text-[10px] leading-4"
          )}
        >
          <span className="sr-only">{count} need attention: </span>
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}

export function SidebarNav({
  collapsed = false,
  counts,
  onNavigate,
}: {
  collapsed?: boolean;
  counts: NavCounts;
  onNavigate?: () => void;
}) {
  const { isAdmin } = useAdminUser();
  return (
    <nav aria-label="Primary" className="flex-1 space-y-5 overflow-y-auto px-2.5 py-3">
      <Item item={OVERVIEW} collapsed={collapsed} onNavigate={onNavigate} />
      {NAV_SECTIONS.map((section) => {
        const items = section.items.filter((i) => !i.adminOnly || isAdmin);
        if (!items.length) return null;
        return (
          <div key={section.label} role="group" aria-labelledby={`nav-${section.label}`}>
            <p
              id={`nav-${section.label}`}
              className={cn("eyebrow mb-1.5 px-2.5", collapsed && "sr-only")}
            >
              {section.label}
            </p>
            {collapsed ? <div aria-hidden="true" className="mx-2 mb-1.5 h-px bg-line" /> : null}
            <div className="space-y-0.5">
              {items.map((item) => (
                <Item
                  key={item.href}
                  item={item}
                  collapsed={collapsed}
                  count={item.badge ? counts[item.badge] : undefined}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        );
      })}
    </nav>
  );
}
