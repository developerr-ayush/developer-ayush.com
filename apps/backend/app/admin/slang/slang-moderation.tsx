"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Check, Inbox, PartyPopper, Search, SearchX, Star, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { FilterTabs } from "@/components/ui/filter-tabs";
import { useConfirm } from "@/components/ui/confirm";
import { DataTable, TableCard, Td, Th, Tr } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { TableSkeleton } from "@/components/ui/skeleton";
import { useDebounced } from "@/hooks/use-debounced";
import { shortDate } from "@/lib/format";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";
interface Term {
  id: string;
  term: string;
  meaning: string;
  example: string | null;
  category: string;
  status: Status;
  isFeatured: boolean;
  submittedBy: string | null;
  submittedAt: string;
}
interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
type Action = "approve" | "reject" | "feature";

const LIMIT = 20;
const EMPTY_STATS: Stats = { total: 0, pending: 0, approved: 0, rejected: 0 };
const TABS = ["all", "pending", "approved", "rejected"] as const;
type Tab = (typeof TABS)[number];

function isTyping(el: EventTarget | null) {
  const t = el as HTMLElement | null;
  if (!t) return false;
  return t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
}

export default function SlangModeration({ defaultStatus }: { defaultStatus: "all" | "pending" }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const confirm = useConfirm();

  const rawStatus = params.get("status") ?? "";
  const status: Tab = (TABS as readonly string[]).includes(rawStatus) ? (rawStatus as Tab) : defaultStatus;
  const page = Math.max(1, parseInt(params.get("page") ?? "1", 10) || 1);
  const qParam = params.get("q") ?? "";

  const [q, setQ] = React.useState(qParam);
  const debouncedQ = useDebounced(q, 300);
  const [terms, setTerms] = React.useState<Term[]>([]);
  const [stats, setStats] = React.useState<Stats>(EMPTY_STATS);
  const [totalPages, setTotalPages] = React.useState(1);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [loadedOnce, setLoadedOnce] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());
  const [active, setActive] = React.useState(0);
  const rowRefs = React.useRef<Map<string, HTMLTableRowElement>>(new Map());

  const hrefFor = React.useCallback(
    (over: { status?: Tab; page?: number; q?: string }) => {
      const next = new URLSearchParams();
      const s = over.status ?? status;
      if (s !== defaultStatus) next.set("status", s);
      const qq = over.q ?? qParam;
      if (qq) next.set("q", qq);
      const pg = over.page ?? page;
      if (pg > 1) next.set("page", String(pg));
      const str = next.toString();
      return str ? `${pathname}?${str}` : pathname;
    },
    [status, qParam, page, pathname, defaultStatus]
  );

  // Sync the debounced search box into the URL
  React.useEffect(() => {
    if (debouncedQ !== qParam) router.replace(hrefFor({ q: debouncedQ, page: 1 }), { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  const load = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const sp = new URLSearchParams({ status, search: qParam, page: String(page), limit: String(LIMIT) });
      const res = await fetch(`/api/admin/slang?${sp}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error ?? "Failed to load slang terms");
      setTerms(data.data);
      setStats(data.meta.stats);
      setTotalPages(Math.max(1, data.meta.totalPages));
      setTotal(data.meta.total);
      setActive((a) => Math.min(a, Math.max(0, data.data.length - 1)));
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load slang terms");
    } finally {
      setLoading(false);
      setLoadedOnce(true);
    }
  }, [status, qParam, page]);

  React.useEffect(() => {
    void load();
  }, [load]);

  // ── Actions ────────────────────────────────────────────────
  const call = async (id: string, action: Action) => {
    const res = await fetch(`/api/admin/slang/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.success) throw new Error(data.error ?? "Action failed");
    return data as { message: string };
  };

  const act = async (ids: string[], action: Action) => {
    if (!ids.length) return;
    const results = await Promise.allSettled(ids.map((id) => call(id, action)));
    const ok = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - ok;
    const verb = action === "approve" ? "approved" : action === "reject" ? "rejected" : "feature toggled";
    if (ok) toast.success(`${ok} term${ok === 1 ? "" : "s"} ${verb}`);
    if (failed) toast.error(`${failed} action${failed === 1 ? "" : "s"} failed`);
    await load();
  };

  const remove = async (ids: string[]) => {
    if (!ids.length) return;
    const ok = await confirm({
      title: ids.length === 1 ? "Delete this term?" : `Delete ${ids.length} terms?`,
      description: "They will be permanently removed from the dictionary.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (!ok) return;
    const results = await Promise.allSettled(
      ids.map((id) => fetch(`/api/admin/slang/${id}`, { method: "DELETE" }).then((r) => (r.ok ? r : Promise.reject(new Error("Delete failed")))))
    );
    const done = results.filter((r) => r.status === "fulfilled").length;
    if (done) toast.success(`${done} term${done === 1 ? "" : "s"} deleted`);
    if (done < ids.length) toast.error("Some terms could not be deleted");
    await load();
  };

  const toggle = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  // ── Keyboard: J/K move, A/R/F act, X select, Esc clears ────
  React.useEffect(() => {
    const targetIds = (): string[] => {
      if (selected.size) return [...selected];
      const t = terms[active];
      return t ? [t.id] : [];
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target) || document.querySelector("dialog[open]")) return;
      const k = e.key.toLowerCase();
      if (k === "j") {
        e.preventDefault();
        setActive((a) => Math.min(terms.length - 1, a + 1));
      } else if (k === "k") {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (k === "a") {
        e.preventDefault();
        void act(targetIds(), "approve");
      } else if (k === "r") {
        e.preventDefault();
        void act(targetIds(), "reject");
      } else if (k === "f") {
        e.preventDefault();
        void act(targetIds(), "feature");
      } else if (k === "x") {
        e.preventDefault();
        const t = terms[active];
        if (t) toggle(t.id);
      } else if (e.key === "Escape" && selected.size) {
        setSelected(new Set());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [terms, active, selected, load]);

  React.useEffect(() => {
    const t = terms[active];
    if (t) rowRefs.current.get(t.id)?.scrollIntoView({ block: "nearest" });
  }, [active, terms]);

  const allSelected = terms.length > 0 && selected.size === terms.length;

  const tabs = TABS.map((t) => ({
    key: t,
    label: t === "all" ? "All" : t[0]!.toUpperCase() + t.slice(1),
    count: t === "all" ? stats.total : stats[t],
    href: hrefFor({ status: t, page: 1 }),
  }));

  const firstLoad = !loadedOnce && loading;

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <FilterTabs tabs={tabs} active={status} label="Filter slang by status" />
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted" aria-hidden="true" />
          <Input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search term or meaning" aria-label="Search slang terms" className="pl-9" />
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul aria-label="Keyboard shortcuts" className="hidden flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted sm:flex">
          <li className="flex items-center gap-1.5">
            <span className="kbd">J</span>
            <span className="kbd">K</span> move
          </li>
          <li className="flex items-center gap-1.5">
            <span className="kbd">A</span> approve
          </li>
          <li className="flex items-center gap-1.5">
            <span className="kbd">R</span> reject
          </li>
          <li className="flex items-center gap-1.5">
            <span className="kbd">F</span> feature
          </li>
          <li className="flex items-center gap-1.5">
            <span className="kbd">X</span> select
          </li>
        </ul>
        <div aria-live="polite" className="min-h-8">
          {selected.size > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <span className="mono text-xs text-muted">{selected.size} selected</span>
              <Button size="sm" onClick={() => act([...selected], "approve")}>
                <Check className="size-3.5" aria-hidden="true" /> Approve
              </Button>
              <Button size="sm" onClick={() => act([...selected], "reject")}>
                <X className="size-3.5" aria-hidden="true" /> Reject
              </Button>
              <Button size="sm" variant="danger" onClick={() => remove([...selected])}>
                <Trash2 className="size-3.5" aria-hidden="true" /> Delete
              </Button>
              <Button size="sm" variant="ghost" onClick={() => setSelected(new Set())}>
                Clear
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {firstLoad ? (
        <TableSkeleton rows={8} cols={5} toolbar={false} />
      ) : error ? (
        <TableCard>
          <EmptyState
            title="Couldn't load terms"
            description={error}
            action={
              <Button variant="default" onClick={() => void load()}>
                Try again
              </Button>
            }
          />
        </TableCard>
      ) : (
        <TableCard className={cn(loading && "opacity-60 transition-opacity")}>
          {terms.length === 0 ? (
            qParam ? (
              <EmptyState icon={<SearchX className="size-6" aria-hidden="true" />} title="No terms match" description={`Nothing found for “${qParam}”.`} action={<Button onClick={() => setQ("")}>Clear search</Button>} />
            ) : status === "pending" ? (
              <EmptyState icon={<PartyPopper className="size-6" aria-hidden="true" />} title="The queue is clear" description="No submissions are waiting for review. New ones appear here." />
            ) : (
              <EmptyState icon={<Inbox className="size-6" aria-hidden="true" />} title="Nothing here yet" description={`No ${status === "all" ? "" : status + " "}slang terms.`} />
            )
          ) : (
            <DataTable caption="Slang terms">
              <thead>
                <tr>
                  <Th className="w-10">
                    <input
                      type="checkbox"
                      className="size-4 accent-[var(--accent)]"
                      checked={allSelected}
                      onChange={() => setSelected(allSelected ? new Set() : new Set(terms.map((t) => t.id)))}
                      aria-label="Select all terms on this page"
                    />
                  </Th>
                  <Th>Term</Th>
                  <Th>Category</Th>
                  <Th>Status</Th>
                  <Th>Submitted</Th>
                  <Th srOnly>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {terms.map((t, i) => (
                  <Tr
                    key={t.id}
                    ref={(el: HTMLTableRowElement | null) => {
                      if (el) rowRefs.current.set(t.id, el);
                      else rowRefs.current.delete(t.id);
                    }}
                    active={i === active}
                    selected={selected.has(t.id)}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button, a, input, label")) return;
                      setActive(i);
                    }}
                    aria-current={i === active ? "true" : undefined}
                  >
                    <Td className="rt-check align-top">
                      <input
                        type="checkbox"
                        className="size-4 accent-[var(--accent)]"
                        checked={selected.has(t.id)}
                        onChange={() => toggle(t.id)}
                        aria-label={`Select “${t.term}”`}
                      />
                    </Td>
                    <Td primary className="min-w-[16rem] max-w-[34rem] align-top">
                      <div className="flex items-center gap-1.5">
                        <span className="mono text-[14px] font-semibold">{t.term}</span>
                        {t.isFeatured ? (
                          <>
                            <Star className="size-3.5 fill-warn text-warn" aria-hidden="true" />
                            <span className="sr-only">Featured</span>
                          </>
                        ) : null}
                      </div>
                      <p className="mt-0.5 text-[13.5px]">{t.meaning}</p>
                      {t.example ? <p className="mt-0.5 text-[13px] italic text-muted">“{t.example}”</p> : null}
                    </Td>
                    <Td label="Category" className="align-top">
                      <span className="chip">{t.category}</span>
                    </Td>
                    <Td label="Status" className="align-top">
                      <StatusBadge status={t.status} />
                    </Td>
                    <Td label="Submitted" className="mono whitespace-nowrap align-top text-xs text-muted">
                      {shortDate(t.submittedAt)}
                      <span className="block max-w-[10rem] truncate">{t.submittedBy ?? "anonymous"}</span>
                    </Td>
                    <Td actions className="align-top">
                      <div className="flex items-center justify-end gap-1">
                        <Button size="icon-sm" variant="ghost" aria-label={`Approve “${t.term}”`} aria-keyshortcuts="A" title="Approve (A)" disabled={t.status === "approved"} onClick={() => act([t.id], "approve")}>
                          <Check className="size-4 text-ok" aria-hidden="true" />
                        </Button>
                        <Button size="icon-sm" variant="ghost" aria-label={`Reject “${t.term}”`} aria-keyshortcuts="R" title="Reject (R)" disabled={t.status === "rejected"} onClick={() => act([t.id], "reject")}>
                          <X className="size-4 text-danger" aria-hidden="true" />
                        </Button>
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          aria-label={t.isFeatured ? `Unfeature “${t.term}”` : `Feature “${t.term}”`}
                          aria-pressed={t.isFeatured}
                          aria-keyshortcuts="F"
                          title="Feature (F)"
                          onClick={() => act([t.id], "feature")}
                        >
                          <Star className={cn("size-4", t.isFeatured ? "fill-warn text-warn" : "text-muted")} aria-hidden="true" />
                        </Button>
                        <Button size="icon-sm" variant="ghost" aria-label={`Delete “${t.term}”`} title="Delete" onClick={() => remove([t.id])}>
                          <Trash2 className="size-4 text-muted" aria-hidden="true" />
                        </Button>
                      </div>
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </TableCard>
      )}

      {totalPages > 1 ? (
        <nav aria-label="Pagination" className="flex items-center justify-between text-[13px] text-muted">
          <p className="mono text-xs" aria-live="polite">
            {(page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
          </p>
          <div className="flex items-center gap-1.5">
            <Link href={hrefFor({ page: page - 1 })} aria-disabled={page <= 1} tabIndex={page <= 1 ? -1 : undefined} className={cn("btn btn-sm", page <= 1 && "pointer-events-none opacity-50")}>
              Prev
            </Link>
            <span className="mono px-2 text-xs">
              {page} / {totalPages}
            </span>
            <Link href={hrefFor({ page: page + 1 })} aria-disabled={page >= totalPages} tabIndex={page >= totalPages ? -1 : undefined} className={cn("btn btn-sm", page >= totalPages && "pointer-events-none opacity-50")}>
              Next
            </Link>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
