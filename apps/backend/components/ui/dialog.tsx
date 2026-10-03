"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "modal" | "sheet" | "drawer";

/**
 * Thin wrapper over the native <dialog>: showModal() gives us focus
 * trapping, inert background, Esc to close and focus restore for free.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  variant = "modal",
  hideTitle,
  className,
  children,
  footer,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  variant?: Variant;
  hideTitle?: boolean;
  className?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  labelledBy?: string;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);
  const uid = React.useId();
  const titleId = labelledBy ?? `${uid}-title`;
  const descId = `${uid}-desc`;

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onMouseDown={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cn(
        "bg-surface text-ink border border-line p-0 shadow-none",
        variant === "modal" &&
          "dialog-modal m-auto w-[min(92vw,30rem)] rounded-[var(--radius-card)] max-h-[88dvh]",
        variant === "sheet" &&
          "dialog-sheet ml-auto mr-0 my-0 h-dvh max-h-dvh w-[min(100vw,26rem)] rounded-none border-y-0 border-r-0",
        variant === "drawer" &&
          "dialog-drawer ml-0 mr-auto my-0 h-dvh max-h-dvh w-[min(86vw,18rem)] rounded-none border-y-0 border-l-0",
        className
      )}
    >
      {open ? (
        <div className={cn("flex min-h-0 flex-col", variant === "modal" ? "max-h-[88dvh]" : "h-dvh")}>
          <div className={cn("flex items-start justify-between gap-4 border-b border-line px-5 py-4", hideTitle && "sr-only")}>
            <div className="min-w-0">
              <h2 id={titleId} className="text-[15px] font-semibold tracking-tight">
                {title}
              </h2>
              {description ? (
                <p id={descId} className="mt-1 text-[13px] text-muted">
                  {description}
                </p>
              ) : null}
            </div>
            <button type="button" className="btn btn-ghost btn-sm btn-icon -mr-2 -mt-1" onClick={onClose} aria-label="Close">
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>
          {footer ? <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-3.5">{footer}</div> : null}
        </div>
      ) : null}
    </dialog>
  );
}
