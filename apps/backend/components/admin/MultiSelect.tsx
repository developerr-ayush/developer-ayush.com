"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

/** Combobox + chips. Typing a name that doesn't exist offers to create it. */
export function MultiSelect({
  id,
  options,
  value,
  onChange,
  allowCreate = true,
  placeholder = "Search categories…",
  describedBy,
  invalid,
}: {
  id: string;
  options: string[];
  value: string[];
  onChange: (next: string[]) => void;
  allowCreate?: boolean;
  placeholder?: string;
  describedBy?: string;
  invalid?: boolean;
}) {
  const [query, setQuery] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const wrapRef = React.useRef<HTMLDivElement>(null);
  const uid = React.useId();

  const q = query.trim().toLowerCase();
  const list = options.filter((o) => !value.includes(o) && o.toLowerCase().includes(q));
  const canCreate = allowCreate && q.length > 0 && ![...options, ...value].some((o) => o.toLowerCase() === q);
  const rows = [...list.map((o) => ({ label: o, create: false })), ...(canCreate ? [{ label: q, create: true }] : [])];

  React.useEffect(() => setActive(0), [query, open]);
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  const add = (name: string) => {
    if (!value.includes(name)) onChange([...value, name]);
    setQuery("");
  };

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={cn(
          "field flex min-h-9 flex-wrap items-center gap-1.5 py-1.5 focus-within:border-accent focus-within:shadow-[0_0_0_3px_var(--ring)]",
          invalid && "border-danger"
        )}
      >
        {value.map((v) => (
          <span key={v} className="chip chip-accent gap-1 pr-1">
            {v}
            <button
              type="button"
              aria-label={`Remove category ${v}`}
              className="rounded-full p-0.5 hover:opacity-70"
              onClick={() => onChange(value.filter((x) => x !== v))}
            >
              <X className="size-3" aria-hidden="true" />
            </button>
          </span>
        ))}
        <input
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-controls={`${uid}-list`}
          aria-autocomplete="list"
          aria-activedescendant={open && rows.length ? `${uid}-opt-${active}` : undefined}
          aria-describedby={describedBy}
          value={query}
          placeholder={value.length ? "" : placeholder}
          autoComplete="off"
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
              setActive((i) => (rows.length ? (i + 1) % rows.length : 0));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setActive((i) => (rows.length ? (i - 1 + rows.length) % rows.length : 0));
            } else if (e.key === "Enter") {
              if (open && rows[active]) {
                e.preventDefault();
                add(rows[active].label);
              }
            } else if (e.key === "Escape") {
              if (open) {
                e.stopPropagation();
                setOpen(false);
              }
            } else if (e.key === "Backspace" && !query && value.length) {
              onChange(value.slice(0, -1));
            }
          }}
          className="min-w-24 flex-1 bg-transparent text-[13.5px] outline-none placeholder:text-muted/70"
        />
      </div>
      {open && rows.length > 0 ? (
        <ul
          id={`${uid}-list`}
          role="listbox"
          aria-label="Categories"
          className="absolute inset-x-0 top-full z-30 mt-1.5 max-h-52 overflow-y-auto rounded-[10px] border border-line bg-surface p-1 shadow-[0_12px_32px_-12px_rgb(0_0_0/0.4)]"
        >
          {rows.map((r, i) => (
            <li
              key={`${r.create}-${r.label}`}
              id={`${uid}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => add(r.label)}
              onMouseMove={() => setActive(i)}
              className={cn("flex cursor-pointer items-center gap-2 rounded-md px-2.5 py-2 text-[13px]", i === active && "bg-surface-2")}
            >
              {r.create ? (
                <>
                  <Plus className="size-3.5 text-muted" aria-hidden="true" /> Create “{r.label}”
                </>
              ) : (
                r.label
              )}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
