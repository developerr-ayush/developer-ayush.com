// Shared dark-themed skeleton loading state used by all admin list pages
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-5 py-4">
          <div className="h-4 bg-white/5 rounded-lg animate-pulse" style={{ width: `${60 + (i % 3) * 20}%` }} />
        </td>
      ))}
    </tr>
  );
}

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-44 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-white/[0.03] rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-32 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Table skeleton */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
        {/* Header row */}
        <div className="px-5 py-3.5 border-b border-white/5 flex gap-6">
          {["Title", "Status", "Updated", "Actions"].map((h) => (
            <div key={h} className="h-3 bg-white/5 rounded animate-pulse" style={{ width: 60 }} />
          ))}
        </div>

        {/* Body rows */}
        <div className="divide-y divide-white/5">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonRow key={i} cols={4} />
          ))}
        </div>
      </div>
    </div>
  );
}
