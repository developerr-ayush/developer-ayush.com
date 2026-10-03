"use client";

import * as React from "react";
import { usePathname, useSearchParams } from "next/navigation";

const PendingContext = React.createContext<string | null>(null);

/** Href (path + query) currently being navigated to, or null when idle. */
export const usePendingHref = () => React.useContext(PendingContext);

/**
 * Instant navigation feedback. App Router keeps showing the old page until the server
 * answers (and loading.tsx never shows for query-string-only changes like tabs, sort
 * and pagination), so we track clicks on internal links ourselves.
 */
export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const search = useSearchParams().toString();
  const [pending, setPending] = React.useState<string | null>(null);
  const failsafe = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clear = React.useCallback(() => {
    if (failsafe.current) clearTimeout(failsafe.current);
    setPending(null);
  }, []);

  // New page / new query string rendered: done.
  React.useEffect(() => {
    clear();
  }, [pathname, search, clear]);

  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      const next = url.pathname + url.search;
      if (next === window.location.pathname + window.location.search) return;
      setPending(next);
      if (failsafe.current) clearTimeout(failsafe.current);
      failsafe.current = setTimeout(() => setPending(null), 15000);
    };
    // The unsaved-changes guard blocks some navigations; it tells us so we don't spin forever.
    const onBlocked = () => clear();
    document.addEventListener("click", onClick, true);
    window.addEventListener("admin:navigation-blocked", onBlocked);
    return () => {
      document.removeEventListener("click", onClick, true);
      window.removeEventListener("admin:navigation-blocked", onBlocked);
    };
  }, [clear]);

  return (
    <PendingContext.Provider value={pending}>
      {children}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-x-0 top-0 z-[70] h-0.5 overflow-hidden transition-opacity duration-150 ${pending ? "opacity-100" : "opacity-0"}`}
      >
        <div className="nav-progress h-full w-1/3 bg-accent" />
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        {pending ? "Loading page" : ""}
      </p>
    </PendingContext.Provider>
  );
}
