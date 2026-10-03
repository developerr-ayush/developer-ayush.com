import { PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action={false} />
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]" aria-hidden="true">
        <div className="space-y-6">
          {[260, 130, 180].map((h, i) => (
            <div key={i} className="card space-y-4 p-5">
              <Skeleton className="h-3 w-24" />
              <Skeleton style={{ height: h - 60 }} className="w-full" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {[150, 260, 230].map((h, i) => (
            <div key={i} className="card space-y-3 p-4">
              <Skeleton className="h-3 w-16" />
              <Skeleton style={{ height: h - 50 }} className="w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
