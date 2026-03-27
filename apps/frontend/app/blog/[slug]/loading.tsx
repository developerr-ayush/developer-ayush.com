export default function Loading() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-20 md:py-28">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumbs Skeleton */}
        <div className="h-4 w-32 bg-foreground/10 rounded animate-pulse mb-8" />
        
        {/* Banner Skeleton */}
        <div className="rounded-2xl overflow-hidden mb-8 aspect-video bg-foreground/10 animate-pulse" />
        
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="flex gap-2 mb-4">
            <div className="h-6 w-20 bg-sky-500/10 rounded-full animate-pulse" />
            <div className="h-6 w-20 bg-sky-500/10 rounded-full animate-pulse" />
          </div>
          <div className="h-10 w-3/4 bg-foreground/10 rounded animate-pulse mb-4" />
          <div className="flex justify-between items-center">
            <div className="h-4 w-40 bg-foreground/10 rounded animate-pulse" />
            <div className="h-4 w-20 bg-foreground/10 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Content Skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-foreground/10 rounded animate-pulse" />
          <div className="h-4 w-[90%] bg-foreground/10 rounded animate-pulse" />
          <div className="h-4 w-full bg-foreground/10 rounded animate-pulse mt-8" />
          <div className="h-4 w-[80%] bg-foreground/10 rounded animate-pulse" />
        </div>
      </div>
    </div>
  );
}
