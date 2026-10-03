import { PageHeaderSkeleton, Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton action={false} />
      <div className="card space-y-4 p-5" aria-hidden="true">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-44 w-full" />
      </div>
    </div>
  );
}
