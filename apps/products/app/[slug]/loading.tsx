export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 h-14 animate-pulse" />
      
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Image Skeleton */}
            <div className="aspect-square bg-gray-100 animate-pulse" />
            
            {/* Info Skeleton */}
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                <div className="h-8 w-3/4 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-100 rounded animate-pulse" />
              <div className="space-y-2">
                <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
                <div className="h-12 w-full bg-gray-100 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
