"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface MenuItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  external?: boolean;
  onSelect?: () => void;
  danger?: boolean;
  disabled?: boolean;
  /** Renders a divider above the item */
  separated?: boolean;
}

/**
 * Accessible dropdown (menu button pattern). The panel is `position: fixed`
 * so it is never clipped by a scrolling table container.
 */
export function Menu({
  label,
  trigger,
  items,
  align = "end",
  triggerClassName,
  header,
}: {
  label: string;
  trigger: React.ReactNode;
  items: MenuItem[];
  align?: "start" | "end";
  triggerClassName?: string;
  header?: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [pos, setPos] = React.useState<{ top: number; left?: number; right?: number } | null>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  const uid = React.useId();

  const close = React.useCallback((restore = true) => {
    setOpen(false);
    if (restore) btnRef.current?.focus();
  }, []);

  const place = React.useCallback(() => {
    const b = btnRef.current?.getBoundingClientRect();
    if (!b) return;
    const panelH = panelRef.current?.offsetHeight ?? 0;
    const below = b.bottom + 6;
    const top = below + panelH > window.innerHeight - 8 && b.top - 6 - panelH > 8 ? b.top - 6 - panelH : below;
    setPos(
      align === "end"
        ? { top, right: Math.max(8, window.innerWidth - b.right) }
        : { top, left: Math.max(8, b.left) }
    );
  }, [align]);

  React.useLayoutEffect(() => {
    if (!open) return;
    place();
    const raf = requestAnimationFrame(place);
    return () => cancelAnimationFrame(raf);
  }, [open, place]);

  React.useEffect(() => {
    if (!open) return;
    const items = panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])');
    items?.[0]?.focus();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panelRef.current?.contains(t) && !btnRef.current?.contains(t)) close(false);
    };
    const onScroll = () => close(false);
    document.addEventListener("mousedown", onDown);
    window.addEventListener("resize", onScroll);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open, close]);

  const onPanelKey = (e: React.KeyboardEvent) => {
    const nodes = Array.from(
      panelRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])') ?? []
    );
    const i = nodes.indexOf(document.activeElement as HTMLElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      nodes[(i + 1) % nodes.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nodes[(i - 1 + nodes.length) % nodes.length]?.focus();
    } else if (e.key === "Home") {
      e.preventDefault();
      nodes[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      nodes[nodes.length - 1]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      close();
    } else if (e.key === "Tab") {
      close(false);
    }
  };

  const itemCls = (it: MenuItem) =>
    cn(
      "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[13px] outline-none",
      "focus-visible:bg-surface-2 hover:bg-surface-2",
      it.danger ? "text-danger" : "text-ink",
      it.disabled && "cursor-not-allowed opacity-50"
    );

  return (
    <>
      <button
        ref={btnRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${uid}-menu` : undefined}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={`${uid}-menu`}
          role="menu"
          aria-label={label}
          onKeyDown={onPanelKey}
          style={{ position: "fixed", top: pos?.top ?? -9999, left: pos?.left, right: pos?.right, visibility: pos ? "visible" : "hidden" }}
          className="z-50 min-w-[11rem] max-w-[16rem] rounded-[10px] border border-line bg-surface p-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.4)]"
        >
          {header ? <div className="border-b border-line px-2.5 py-2">{header}</div> : null}
          {items.map((it) => {
            const inner = (
              <>
                {it.icon ? <span className="text-muted [&_svg]:size-3.5">{it.icon}</span> : null}
                <span className="flex-1">{it.label}</span>
              </>
            );
            return (
              <React.Fragment key={it.label}>
                {it.separated ? <div role="separator" className="my-1 h-px bg-line" /> : null}
                {it.href && !it.disabled ? (
                  <Link
                    href={it.href}
                    role="menuitem"
                    target={it.external ? "_blank" : undefined}
                    rel={it.external ? "noopener noreferrer" : undefined}
                    className={itemCls(it)}
                    onClick={() => close(false)}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    type="button"
                    role="menuitem"
                    aria-disabled={it.disabled || undefined}
                    className={itemCls(it)}
                    onClick={() => {
                      if (it.disabled) return;
                      close(false);
                      it.onSelect?.();
                    }}
                  >
                    {inner}
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
