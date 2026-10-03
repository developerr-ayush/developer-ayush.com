import { CardSkeleton, PageHeaderSkeleton, Skeleton, TableSkeleton } from "@/components/ui/skeleton";

/** Dashboard-shaped skeleton: header, stat row, table + side list. */
export default function Loading() {
  return (
    <div className="space-y-8">
      <PageHeaderSkeleton />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <TableSkeleton rows={6} cols={4} toolbar={false} />
        <div className="card space-y-4 p-4" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3.5 w-1/2" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
