import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Pagination({
  page,
  totalPages,
  totalItems,
  perPage,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  hrefFor: (page: number) => string;
}) {
  if (totalItems === 0) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, totalItems);
  const prev = page > 1;
  const next = page < totalPages;
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3 text-[13px] text-muted">
      <p className="mono text-xs" aria-live="polite">
        {from}–{to} of {totalItems}
      </p>
      <div className="flex items-center gap-1.5">
        <Link
          href={hrefFor(page - 1)}
          aria-disabled={!prev}
          tabIndex={prev ? undefined : -1}
          className={cn("btn btn-sm", !prev && "pointer-events-none opacity-50")}
          aria-label="Previous page"
        >
          <ChevronLeft className="size-3.5" aria-hidden="true" /> Prev
        </Link>
        <span className="mono px-2 text-xs">
          {page} / {totalPages}
        </span>
        <Link
          href={hrefFor(page + 1)}
          aria-disabled={!next}
          tabIndex={next ? undefined : -1}
          className={cn("btn btn-sm", !next && "pointer-events-none opacity-50")}
          aria-label="Next page"
        >
          Next <ChevronRight className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
    </nav>
  );
}
