"use client";

import * as React from "react";
import { X } from "lucide-react";

export function parseTags(value: string) {
  return value
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Chip input backed by a comma separated string (the stored format). */
export function TagInput({
  id,
  value,
  onChange,
  placeholder = "Add a tag and press Enter",
  describedBy,
}: {
  id: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  describedBy?: string;
}) {
  const tags = parseTags(value);
  const [draft, setDraft] = React.useState("");

  const commit = (raw: string) => {
    const incoming = parseTags(raw.replace(/\n/g, ","));
    if (!incoming.length) return;
    const next = [...tags];
    for (const t of incoming) if (!next.some((x) => x.toLowerCase() === t.toLowerCase())) next.push(t);
    onChange(next.join(", "));
    setDraft("");
  };

  return (
    <div className="field flex min-h-9 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--ring)]">
      {tags.map((t) => (
        <span key={t} className="chip gap-1 pr-1">
          {t}
          <button
            type="button"
            aria-label={`Remove tag ${t}`}
            className="rounded-full p-0.5 hover:text-ink"
            onClick={() => onChange(tags.filter((x) => x !== t).join(", "))}
          >
            <X className="size-3" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        value={draft}
        aria-describedby={describedBy}
        onChange={(e) => {
          if (e.target.value.includes(",")) commit(e.target.value);
          else setDraft(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) {
            onChange(tags.slice(0, -1).join(", "));
          }
        }}
        onBlur={() => commit(draft)}
        placeholder={tags.length ? "" : placeholder}
        className="min-w-24 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted/70"
        autoComplete="off"
      />
    </div>
  );
}
