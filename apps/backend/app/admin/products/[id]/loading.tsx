export default function EditProductLoading() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="h-8 w-36 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-md animate-pulse" />
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-8">
        {/* Basic info skeleton */}
        <div className="space-y-4">
          <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
          <div className="grid grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mb-2" />
                <div className="h-9 bg-gray-100 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
        {/* Image skeleton */}
        <div>
          <div className="h-4 w-28 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="h-40 bg-gray-100 rounded-xl animate-pulse" />
        </div>
        {/* Pricing skeleton */}
        <div>
          <div className="h-4 w-20 bg-gray-100 rounded animate-pulse mb-4" />
          <div className="grid grid-cols-3 gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-9 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </div>
        {/* Submit skeleton */}
        <div className="flex gap-3 pt-2">
          <div className="h-10 w-32 bg-indigo-100 rounded-lg animate-pulse" />
          <div className="h-10 w-24 bg-gray-100 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}
