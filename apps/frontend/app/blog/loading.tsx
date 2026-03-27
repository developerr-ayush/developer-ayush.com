export default function Loading() {
  return (
    <div className="py-20 md:py-28 container mx-auto px-4 md:px-6">
      <div className="text-center mb-12 md:mb-16">
        <div className="h-12 w-48 bg-foreground/10 rounded animate-pulse mx-auto mb-4" />
        <div className="h-4 w-64 bg-foreground/10 rounded animate-pulse mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-foreground/10 overflow-hidden bg-background"
          >
            <div className="aspect-video bg-foreground/10 animate-pulse" />
            <div className="p-6 space-y-4">
              <div className="h-4 w-20 bg-sky-500/10 rounded-full animate-pulse" />
              <div className="h-6 w-full bg-foreground/10 rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-foreground/10 rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
