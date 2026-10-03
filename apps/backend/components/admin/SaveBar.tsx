"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type SaveState =
  | { kind: "clean"; at: Date | null; auto?: boolean }
  | { kind: "dirty" }
  | { kind: "saving" }
  | { kind: "error"; message: string };

function fmt(d: Date) {
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

/** Sticky bottom bar: live save status on the left, actions on the right. */
export function SaveBar({
  state,
  children,
  note,
}: {
  state: SaveState;
  children: React.ReactNode;
  note?: React.ReactNode;
}) {
  let text: string;
  let dot = "bg-muted";
  if (state.kind === "dirty") {
    text = "Unsaved changes";
    dot = "bg-warn";
  } else if (state.kind === "saving") {
    text = "Saving…";
    dot = "bg-accent animate-pulse";
  } else if (state.kind === "error") {
    text = state.message;
    dot = "bg-danger";
  } else {
    text = state.at ? `${state.auto ? "Autosaved" : "Saved"} at ${fmt(state.at)}` : "No changes yet";
    dot = state.at ? "bg-ok" : "bg-muted";
  }

  return (
    <div className="sticky bottom-0 z-20 -mx-4 mt-8 border-t border-line bg-[color-mix(in_srgb,var(--paper)_92%,transparent)] px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1200px] items-center justify-between gap-3">
        <div className="min-w-0">
          <p role="status" aria-live="polite" className="mono flex items-center gap-2 text-xs">
            <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", dot)} />
            <span className={cn("truncate", state.kind === "error" && "text-danger", state.kind === "dirty" && "text-warn")}>{text}</span>
          </p>
          {note ? <p className="mt-0.5 hidden truncate text-xs text-muted sm:block">{note}</p> : null}
        </div>
        <div className="flex shrink-0 items-center gap-2">{children}</div>
      </div>
    </div>
  );
}
