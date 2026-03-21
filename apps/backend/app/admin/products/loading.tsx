export default function ProductsLoading() {
  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-56 bg-gray-100 rounded animate-pulse mt-2" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg animate-pulse mt-4 sm:mt-0" />
      </div>

      <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {["Product", "Category", "Price", "Status", "Updated", "Actions"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-gray-100 animate-pulse flex-shrink-0" />
                      <div>
                        <div className="h-4 w-36 bg-gray-100 rounded animate-pulse" />
                        <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mt-1" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-16 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-5 w-16 bg-gray-100 rounded-full animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-100 rounded animate-pulse" /></td>
                  <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-100 rounded animate-pulse" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
