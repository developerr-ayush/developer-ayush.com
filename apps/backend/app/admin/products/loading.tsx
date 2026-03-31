function SkeletonRow() {
  return (
    <tr>
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white/5 rounded-lg animate-pulse flex-shrink-0" />
          <div className="space-y-1.5">
            <div className="h-4 w-40 bg-white/5 rounded animate-pulse" />
            <div className="h-3 w-24 bg-white/[0.03] rounded animate-pulse" />
          </div>
        </div>
      </td>
      {["cat", "price", "status", "updated", "actions"].map((k) => (
        <td key={k} className="px-5 py-4">
          <div className="h-4 bg-white/5 rounded animate-pulse" style={{ width: k === "actions" ? 60 : 80 }} />
        </td>
      ))}
    </tr>
  );
}

export default function ProductsLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="h-7 w-32 bg-white/5 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-white/[0.03] rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-36 bg-white/5 rounded-xl animate-pulse" />
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-white/5 flex gap-8">
          {["Product", "Category", "Price", "Status", "Updated", "Actions"].map((h) => (
            <div key={h} className="h-3 w-14 bg-white/5 rounded animate-pulse" />
          ))}
        </div>
        <div className="divide-y divide-white/5">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}
        </div>
      </div>
    </div>
  );
}
