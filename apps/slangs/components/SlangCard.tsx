import { SlangTerm } from "@/lib/slang-api";
import { IoSparkles } from "react-icons/io5";

interface SlangCardProps {
  slang: SlangTerm;
  isUserSubmitted?: boolean;
  className?: string;
}

export const SlangCard: React.FC<SlangCardProps> = ({
  slang,
  isUserSubmitted = false,
  className = "",
}) => {
  return (
    <div
      className={`bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105 ${
        isUserSubmitted ? "ring-2 ring-green-400/50" : ""
      } ${slang.is_featured ? "ring-2 ring-yellow-400/50" : ""} ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">
            {slang.term}
          </h3>
          {slang.is_featured && (
            <IoSparkles className="h-5 w-5 text-yellow-500" title="Featured" />
          )}
          {isUserSubmitted && (
            <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
              New!
            </span>
          )}
        </div>
        <span className="px-2 py-1 text-xs rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 font-medium">
          {slang.category}
        </span>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
        {slang.meaning}
      </p>

      {slang.example && (
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border-l-4 border-purple-400">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">
            Example:
          </p>
          <p className="text-gray-700 dark:text-gray-300 italic">
            &ldquo;{slang.example}&rdquo;
          </p>
        </div>
      )}

      {slang.status === "pending" && (
        <div className="mt-3 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-center">
          Pending Review
        </div>
      )}
    </div>
  );
};
