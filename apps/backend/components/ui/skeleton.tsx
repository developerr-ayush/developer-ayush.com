import { cn } from "@/lib/utils";

export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return <div aria-hidden="true" className={cn("skeleton", className)} style={style} />;
}

export function PageHeaderSkeleton({ action = true }: { action?: boolean }) {
  return (
    <div className="flex items-end justify-between gap-4" role="status" aria-label="Loading">
      <div className="space-y-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-3.5 w-72 max-w-full" />
      </div>
      {action ? <Skeleton className="h-9 w-28" /> : null}
    </div>
  );
}

export function TableSkeleton({ rows = 8, cols = 5, toolbar = true }: { rows?: number; cols?: number; toolbar?: boolean }) {
  return (
    <div className="space-y-4" aria-hidden="true">
      {toolbar ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
          <Skeleton className="h-9 w-64 max-w-full" />
        </div>
      ) : null}
      <div className="card overflow-hidden">
        <div className="flex gap-6 border-b border-line px-4 py-3">
          {Array.from({ length: cols }).map((_, i) => (
            <Skeleton key={i} className="h-3 w-16" />
          ))}
        </div>
        {Array.from({ length: rows }).map((_, r) => (
          <div key={r} className="flex items-center gap-6 border-b border-line px-4 py-3.5 last:border-0">
            <Skeleton className="size-9 shrink-0" />
            {Array.from({ length: cols - 1 }).map((_, i) => (
              <Skeleton key={i} className="h-3.5" style={{ width: `${14 + ((i * 7 + r * 3) % 5) * 6}%` }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("card space-y-3 p-4", className)} aria-hidden="true">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}
