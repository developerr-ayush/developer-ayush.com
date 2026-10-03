"use client";

import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { dismissToast, getServerToasts, getToasts, subscribeToasts, type ToastItem } from "@/lib/toast";

function ToastView({ t }: { t: ToastItem }) {
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused) return;
    const ms = t.kind === "error" ? 7000 : 4000;
    const timer = setTimeout(() => dismissToast(t.id), ms);
    return () => clearTimeout(timer);
  }, [t.id, t.kind, paused]);

  const Icon = t.kind === "success" ? CheckCircle2 : t.kind === "error" ? AlertCircle : Info;
  const tone = t.kind === "success" ? "text-ok" : t.kind === "error" ? "text-danger" : "text-accent";

  return (
    <div
      role={t.kind === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="pointer-events-auto flex w-full items-start gap-2.5 rounded-[var(--radius-card)] border border-line bg-surface px-3.5 py-3 text-[13px] shadow-[0_8px_24px_-12px_rgb(0_0_0/0.35)] [animation:toast-in_160ms_ease-out]"
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${tone}`} aria-hidden="true" />
      <p className="min-w-0 flex-1 break-words">{t.message}</p>
      <button
        type="button"
        onClick={() => dismissToast(t.id)}
        className="-m-1 rounded p-1 text-muted hover:text-ink"
        aria-label="Dismiss notification"
      >
        <X className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

export function Toaster() {
  const items = React.useSyncExternalStore(subscribeToasts, getToasts, getServerToasts);
  return (
    <div
      aria-live="polite"
      aria-label="Notifications"
      role="region"
      className="pointer-events-none fixed inset-x-3 bottom-3 z-[60] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-[22rem]"
    >
      {items.map((t) => (
        <ToastView key={t.id} t={t} />
      ))}
    </div>
  );
}
