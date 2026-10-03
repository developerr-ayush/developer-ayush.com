import { Skeleton } from "@/components/ui/skeleton";

/** Matches the two-column editor: canvas on the left, settings cards on the right. */
export function EditorSkeleton() {
  return (
    <div role="status" aria-label="Loading editor" className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-9 w-32" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="max-w-[68ch] space-y-4">
          <Skeleton className="h-11 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/5" />
          <Skeleton className="mt-6 h-28 w-full" />
        </div>
        <div className="space-y-4">
          {[110, 96, 120, 150, 120].map((h, i) => (
            <div key={i} className="card space-y-3 p-4">
              <Skeleton className="h-3 w-20" />
              <Skeleton style={{ height: h - 50 }} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
