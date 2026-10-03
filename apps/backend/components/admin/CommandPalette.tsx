"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CornerDownLeft,
  ExternalLink,
  FilePlus2,
  PackagePlus,
  Search,
  Timer,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS, OVERVIEW } from "./nav";
import { useAdminUser } from "./user-context";

interface Command {
  id: string;
  label: string;
  group: "Actions" | "Go to";
  href: string;
  icon: React.ReactNode;
  external?: boolean;
  keywords?: string;
}

const PaletteContext = React.createContext<{ open: () => void } | null>(null);
export const usePalette = () => {
  const ctx = React.useContext(PaletteContext);
  if (!ctx) throw new Error("usePalette must be used inside <PaletteProvider>");
  return ctx;
};

export function PaletteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const value = React.useMemo(() => ({ open: () => setOpen(true) }), []);
  return (
    <PaletteContext.Provider value={value}>
      {children}
      <Palette open={open} onClose={() => setOpen(false)} />
    </PaletteContext.Provider>
  );
}

function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { isAdmin } = useAdminUser();
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [query, setQuery] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const uid = React.useId();

  const commands = React.useMemo<Command[]>(() => {
    const actions: Command[] = [
      { id: "new-post", label: "New post", group: "Actions", href: "/admin/blog/new", icon: <FilePlus2 />, keywords: "write create blog article" },
      { id: "new-product", label: "New product", group: "Actions", href: "/admin/products/new", icon: <PackagePlus />, keywords: "add create" },
      { id: "review-slang", label: "Review pending slang", group: "Actions", href: "/admin/slang/pending", icon: <Timer />, keywords: "moderate approve queue" },
    ];
    if (isAdmin) {
      actions.push({ id: "new-user", label: "New user", group: "Actions", href: "/admin/users/new", icon: <UserPlus />, keywords: "add create account" });
    }
    const pages: Command[] = [OVERVIEW, ...NAV_SECTIONS.flatMap((s) => s.items)]
      .filter((i) => !("adminOnly" in i && i.adminOnly) || isAdmin)
      .map((i) => ({
        id: i.href,
        label: i.label,
        group: "Go to" as const,
        href: i.href,
        icon: <i.icon />,
      }));
    pages.push({
      id: "site",
      label: "Open developer-ayush.com",
      group: "Go to",
      href: "https://developer-ayush.com",
      external: true,
      icon: <ExternalLink />,
      keywords: "portfolio website",
    });
    return [...actions, ...pages];
  }, [isAdmin]);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    const tokens = q.split(/\s+/);
    return commands.filter((c) => {
      const hay = `${c.label} ${c.keywords ?? ""}`.toLowerCase();
      return tokens.every((t) => hay.includes(t));
    });
  }, [commands, query]);

  React.useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      setQuery("");
      setIndex(0);
      el.showModal();
      inputRef.current?.focus();
    }
    if (!open && el.open) el.close();
  }, [open]);

  React.useEffect(() => {
    setIndex(0);
  }, [query]);

  React.useEffect(() => {
    document.getElementById(`${uid}-opt-${index}`)?.scrollIntoView({ block: "nearest" });
  }, [index, uid]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    onClose();
    if (c.external) window.open(c.href, "_blank", "noopener,noreferrer");
    else router.push(c.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      run(results[index]);
    }
  };

  let lastGroup = "";
  return (
    <dialog
      ref={dialogRef}
      aria-label="Command palette"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onMouseDown={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className="dialog-modal m-0 mx-auto mt-[12vh] w-[min(92vw,34rem)] rounded-[var(--radius-card)] border border-line bg-surface p-0 shadow-none"
    >
      {open ? (
        <div onKeyDown={onKeyDown}>
          <div className="flex items-center gap-2.5 border-b border-line px-3.5">
            <Search className="size-4 shrink-0 text-muted" aria-hidden="true" />
            <input
              ref={inputRef}
              role="combobox"
              aria-expanded="true"
              aria-controls={`${uid}-list`}
              aria-activedescendant={results.length ? `${uid}-opt-${index}` : undefined}
              aria-label="Search pages and actions"
              aria-autocomplete="list"
              autoComplete="off"
              spellCheck={false}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Jump to a page or action…"
              className="h-12 w-full bg-transparent text-[14px] outline-none placeholder:text-muted"
            />
            <span className="kbd">Esc</span>
          </div>
          <ul id={`${uid}-list`} role="listbox" aria-label="Results" className="max-h-[50vh] overflow-y-auto p-1.5">
            {results.length === 0 ? (
              <li className="px-3 py-8 text-center text-[13px] text-muted" role="presentation">
                No matches for “{query}”
              </li>
            ) : (
              results.map((c, i) => {
                const header = c.group !== lastGroup ? c.group : null;
                lastGroup = c.group;
                return (
                  <React.Fragment key={c.id}>
                    {header ? (
                      <li role="presentation" className="eyebrow px-2.5 pb-1 pt-2.5">
                        {header}
                      </li>
                    ) : null}
                    <li
                      id={`${uid}-opt-${i}`}
                      role="option"
                      aria-selected={i === index}
                      onMouseMove={() => setIndex(i)}
                      onClick={() => run(c)}
                      className={cn(
                        "flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-2.5 text-[13.5px]",
                        i === index ? "bg-surface-2" : ""
                      )}
                    >
                      <span className="text-muted [&_svg]:size-4" aria-hidden="true">
                        {c.icon}
                      </span>
                      <span className="flex-1 truncate">{c.label}</span>
                      {i === index ? <CornerDownLeft className="size-3.5 text-muted" aria-hidden="true" /> : <ArrowRight className="size-3.5 text-transparent" aria-hidden="true" />}
                    </li>
                  </React.Fragment>
                );
              })
            )}
          </ul>
          <div className="flex items-center gap-4 border-t border-line px-3.5 py-2 text-xs text-muted">
            <span className="flex items-center gap-1.5"><span className="kbd">↑</span><span className="kbd">↓</span> navigate</span>
            <span className="flex items-center gap-1.5"><span className="kbd">↵</span> open</span>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
