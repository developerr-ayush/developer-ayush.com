"use client";

import { useEffect, useRef } from "react";

/**
 * Warns before leaving a page with unsaved edits:
 *  - tab close / reload via `beforeunload`
 *  - in-app link clicks via a capture listener (App Router has no route events)
 */
export function useUnsavedChanges(
  dirty: boolean,
  confirmLeave: (href: string) => void
) {
  const confirmRef = useRef(confirmLeave);
  useEffect(() => {
    confirmRef.current = confirmLeave;
  });

  useEffect(() => {
    if (!dirty) return;

    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === window.location.pathname && url.search === window.location.search) return;
      e.preventDefault();
      e.stopPropagation();
      window.dispatchEvent(new Event("admin:navigation-blocked"));
      confirmRef.current(url.pathname + url.search + url.hash);
    };

    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty]);
}
