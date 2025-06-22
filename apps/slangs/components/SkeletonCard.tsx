export default function SkeletonCard() {
  return (
    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 dark:border-gray-700/50 animate-pulse">
      {/* Header with term and category */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="h-6 bg-purple-200 dark:bg-purple-800/50 rounded-lg w-3/4 mb-2"></div>
        </div>
        <div className="h-5 bg-purple-100 dark:bg-purple-900/50 rounded-full w-16 ml-3"></div>
      </div>

      {/* Meaning text */}
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
      </div>

      {/* Example section (appears randomly like real cards) */}
      {Math.random() > 0.4 && (
        <div className="mt-4 p-3 bg-purple-50/50 dark:bg-purple-900/10 rounded-lg border-l-4 border-purple-200 dark:border-purple-800">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
      )}

      {/* Contributor section (appears sometimes) */}
      {Math.random() > 0.6 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
        </div>
      )}
    </div>
  );
}
