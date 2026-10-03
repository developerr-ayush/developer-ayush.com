"use client";

import * as React from "react";
import Link from "next/link";
import {
  PanelLeftClose,
  PanelLeftOpen,
  Menu as MenuIcon,
  Search,
  ExternalLink,
} from "lucide-react";
import { Logo, LogoMark } from "@/components/brand/Logo";
import { Dialog } from "@/components/ui/dialog";
import { ConfirmProvider } from "@/components/ui/confirm";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import { AdminUserProvider, type AdminUser } from "./user-context";
import { SidebarNav } from "./SidebarNav";
import { Breadcrumbs } from "./Breadcrumbs";
import { PaletteProvider, usePalette } from "./CommandPalette";
import { UserMenu } from "./UserMenu";
import { NavigationProvider, usePendingHref } from "./NavigationProgress";
import type { NavCounts } from "./nav";
import { usePathname } from "next/navigation";

const KEY = "admin:sidebar-collapsed";

function useCollapsed() {
  const [collapsed, setCollapsed] = React.useState(false);
  React.useEffect(() => {
    try {
      setCollapsed(localStorage.getItem(KEY) === "1");
    } catch {
      /* storage unavailable */
    }
  }, []);
  const toggle = React.useCallback(() => {
    setCollapsed((c) => {
      try {
        localStorage.setItem(KEY, c ? "0" : "1");
      } catch {
        /* storage unavailable */
      }
      return !c;
    });
  }, []);
  return [collapsed, toggle] as const;
}

function SearchButton() {
  const { open } = usePalette();
  const [isMac, setIsMac] = React.useState(false);
  React.useEffect(
    () => setIsMac(/Mac|iPhone|iPad/.test(navigator.platform)),
    [],
  );
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search pages and actions"
      aria-keyshortcuts="Control+K Meta+K"
      className="flex h-9 items-center gap-2 rounded-lg border border-line bg-surface px-2.5 text-[13px] text-muted transition-colors hover:border-[color-mix(in_srgb,var(--ink)_25%,var(--line))] hover:text-ink sm:w-56"
    >
      <Search className="size-3.5" aria-hidden="true" />
      <span className="hidden flex-1 text-left sm:inline">Search…</span>
      <span className="hidden items-center gap-1 sm:flex" aria-hidden="true">
        <span className="kbd">{isMac ? "⌘" : "Ctrl"}</span>
        <span className="kbd">K</span>
      </span>
    </button>
  );
}

function Main({ children }: { children: React.ReactNode }) {
  const pending = usePendingHref();
  return (
    <main
      id="main"
      tabIndex={-1}
      aria-busy={pending ? true : undefined}
      className={cn(
        "flex-1 px-4 pb-24 pt-6 outline-none transition-opacity duration-200 sm:px-6 lg:px-8 lg:pt-8",
        pending && "opacity-60",
      )}
    >
      <div className="mx-auto w-full max-w-[1200px]">{children}</div>
    </main>
  );
}

export function AdminShell({
  user,
  counts,
  children,
}: {
  user: AdminUser;
  counts: NavCounts;
  children: React.ReactNode;
}) {
  const [collapsed, toggleCollapsed] = useCollapsed();
  const [drawer, setDrawer] = React.useState(false);
  const pathname = usePathname();

  // Close the mobile drawer on navigation
  React.useEffect(() => setDrawer(false), [pathname]);

  return (
    <AdminUserProvider user={user}>
      <NavigationProvider>
        <ConfirmProvider>
          <PaletteProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <div className="flex min-h-dvh">
              <aside
                aria-label="Sidebar"
                className={cn(
                  "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-line bg-surface transition-[width] duration-200 lg:flex",
                  collapsed ? "w-[60px]" : "w-60",
                )}
              >
                <div
                  className={cn(
                    "flex h-14 items-center border-b border-line",
                    collapsed ? "justify-center" : "px-4",
                  )}
                >
                  <Link
                    href="/admin"
                    aria-label="Ayush Shah — dashboard"
                    className="rounded-md"
                  >
                    {collapsed ? <LogoMark size="md" /> : <Logo />}
                  </Link>
                </div>
                <SidebarNav collapsed={collapsed} counts={counts} />
                <div
                  className={cn(
                    "flex border-t border-line p-2.5",
                    collapsed
                      ? "flex-col items-center gap-1"
                      : "items-center justify-between",
                  )}
                >
                  <a
                    href="https://developer-ayush.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Open the site"
                    className={cn(
                      "btn btn-ghost btn-sm",
                      collapsed && "btn-icon",
                    )}
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                    <span className={cn(collapsed && "sr-only")}>
                      View site
                    </span>
                  </a>
                  <button
                    type="button"
                    onClick={toggleCollapsed}
                    aria-label={
                      collapsed ? "Expand sidebar" : "Collapse sidebar"
                    }
                    aria-pressed={collapsed}
                    className="btn btn-ghost btn-sm btn-icon"
                  >
                    {collapsed ? (
                      <PanelLeftOpen className="size-4" aria-hidden="true" />
                    ) : (
                      <PanelLeftClose className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </aside>

              <div className="flex min-w-0 flex-1 flex-col">
                <header className="sticky top-0 z-30 flex h-14 items-center gap-2 border-b border-line bg-[color-mix(in_srgb,var(--paper)_88%,transparent)] px-3 backdrop-blur sm:px-5 lg:px-8">
                  <button
                    type="button"
                    onClick={() => setDrawer(true)}
                    aria-label="Open navigation menu"
                    className="btn btn-ghost btn-icon lg:hidden"
                  >
                    <MenuIcon className="size-4" aria-hidden="true" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <Breadcrumbs />
                  </div>
                  <SearchButton />
                  <UserMenu />
                </header>

                <Main>{children}</Main>
              </div>
            </div>

            <Dialog
              open={drawer}
              onClose={() => setDrawer(false)}
              title="Menu"
              variant="drawer"
            >
              <div className="-mx-5 -my-4">
                <SidebarNav
                  counts={counts}
                  onNavigate={() => setDrawer(false)}
                />
              </div>
            </Dialog>
            <Toaster />
          </PaletteProvider>
        </ConfirmProvider>
      </NavigationProvider>
    </AdminUserProvider>
  );
}
