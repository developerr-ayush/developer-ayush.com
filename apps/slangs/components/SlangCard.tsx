import { SlangTerm } from "@/lib/slang-api";

interface SlangCardProps {
  slang: SlangTerm;
}

export default function SlangCard({ slang }: SlangCardProps) {
  return (
    <article
      className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105"
      itemScope
      itemType="https://schema.org/DefinedTerm"
    >
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-xl font-bold text-purple-700 dark:text-purple-300"
          itemProp="name"
        >
          {slang.term}
          {slang.is_featured && (
            <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 px-2 py-1 rounded-full">
              Featured ⭐
            </span>
          )}
          {slang.status === "pending" && (
            <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 px-2 py-1 rounded-full">
              Pending
            </span>
          )}
        </h3>
        <span
          className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium"
          itemProp="inDefinedTermSet"
          itemScope
          itemType="https://schema.org/DefinedTermSet"
        >
          <span itemProp="name">{slang.category}</span>
        </span>
      </div>

      <p
        className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
        itemProp="description"
      >
        {slang.meaning}
      </p>

      {slang.example && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-400">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
            Example:
          </p>
          <p
            className="text-gray-700 dark:text-gray-300 italic"
            itemProp="example"
            itemScope
            itemType="https://schema.org/CreativeWork"
          >
            <span itemProp="text">&ldquo;{slang.example}&rdquo;</span>
          </p>
        </div>
      )}

      {slang.submitted_by && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Submitted by:{" "}
            <span itemProp="contributor">{slang.submitted_by}</span>
          </p>
        </div>
      )}
    </article>
  );
}
