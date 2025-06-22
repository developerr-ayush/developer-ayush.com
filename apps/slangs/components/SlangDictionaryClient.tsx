"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoSearch, IoAdd, IoSparkles, IoRefresh } from "react-icons/io5";
import { SlangTerm } from "@/lib/slang-api";
import { SubmitSlangForm } from "./SubmitSlangForm";
import SlangCard from "./SlangCard";

interface SlangDictionaryClientProps {
  initialSlangData: SlangTerm[];
  initialCategories: string[];
  initialFeaturedSlang: SlangTerm | null;
  initialTotalResults: number;
  initialSearch: string;
  initialCategory: string;
  initialPage: number;
  itemsPerPage: number;
}

export default function SlangDictionaryClient({
  initialSlangData,
  initialCategories,
  initialFeaturedSlang,
  initialTotalResults,
  initialSearch,
  initialCategory,
  initialPage,
  itemsPerPage,
}: SlangDictionaryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  const totalPages = Math.ceil(initialTotalResults / itemsPerPage);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Update URL when filters change
  const updateURL = (search: string, category: string, page: number) => {
    const params = new URLSearchParams();

    if (search) params.set("search", search);
    if (category !== "All") params.set("category", category);
    if (page > 1) params.set("page", page.toString());

    const query = params.toString();
    const url = query ? `/?${query}` : "/";

    router.push(url);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
    updateURL(value, selectedCategory, 1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
    updateURL(searchTerm, category, 1);
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    updateURL(searchTerm, selectedCategory, newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRefresh = () => {
    router.refresh();
  };

  const handleSubmissionSuccess = () => {
    setShowSubmissionModal(false);
    router.refresh();
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Loading slang terms...
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Getting the latest Gen Z slang for you! 🔥
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-300">
      {/* Header */}
      <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border-b border-purple-200 dark:border-gray-700 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="text-center flex-1">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Gen Z Slang Dictionary 📱
              </h1>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Stay updated with the latest slang terms, no cap! 🔥
              </p>
            </div>

            {/* Refresh & Add Button */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleRefresh}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-purple-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-200"
                aria-label="Refresh data"
              >
                <IoRefresh className="h-5 w-5 text-purple-600" />
              </button>

              <button
                onClick={() => setShowSubmissionModal(true)}
                className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg"
                aria-label="Add new slang"
              >
                <IoAdd className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Daily Spotlight */}
          {initialFeaturedSlang && (
            <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <IoSparkles className="h-5 w-5 text-yellow-500" />
                <h3 className="font-bold text-yellow-800 dark:text-yellow-300">
                  Featured Slang Term
                </h3>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-1">
                    {initialFeaturedSlang.term}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {initialFeaturedSlang.meaning}
                  </p>
                  {initialFeaturedSlang.example && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      &ldquo;{initialFeaturedSlang.example}&rdquo;
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 font-medium self-start">
                  {initialFeaturedSlang.category}
                </span>
              </div>
            </div>
          )}

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <IoSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search slang terms or meanings..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white sm:min-w-[200px] transition-colors duration-200"
            >
              {initialCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {initialTotalResults} term{initialTotalResults !== 1 ? "s" : ""}{" "}
              found
              {selectedCategory !== "All" && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  in {selectedCategory}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {initialSlangData.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">😕</div>
            <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No slang found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <>
            {/* Slang Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {initialSlangData.map((slang, index) => (
                <SlangCard
                  key={slang.id || `${slang.term}-${index}`}
                  slang={slang}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-purple-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Previous
                </button>

                <div className="flex gap-2">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 ${
                          currentPage === pageNum
                            ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                            : "bg-white/80 dark:bg-gray-700/80 border border-purple-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    handlePageChange(Math.min(currentPage + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-purple-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* User Submission Modal */}
      {showSubmissionModal && (
        <SubmitSlangForm
          onClose={() => setShowSubmissionModal(false)}
          onSuccess={handleSubmissionSuccess}
          categories={initialCategories.filter((cat) => cat !== "All")}
        />
      )}

      {/* Footer */}
      <footer className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-md border-t border-purple-200 dark:border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Keep slaying and stay updated with the latest Gen Z slang! ✨
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Built with Next.js & Tailwind CSS • PWA Ready 📱
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
