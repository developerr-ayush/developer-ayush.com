"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { IoSearch, IoAdd, IoSparkles, IoRefresh } from "react-icons/io5";
import { SlangTerm, getSlangTerms } from "@/lib/slang-api";
import { SubmitSlangForm } from "./SubmitSlangForm";
import SlangCard from "./SlangCard";
import SkeletonGrid from "./SkeletonGrid";

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

// Helper function to sanitize search input
const sanitizeSearchInput = (input: string): string => {
  return input.trim().replace(/\s+/g, " "); // Remove extra spaces and normalize
};

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

  // Client-side data state
  const [slangData, setSlangData] = useState<SlangTerm[]>(initialSlangData);
  const [totalResults, setTotalResults] = useState(initialTotalResults);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(totalResults / itemsPerPage);

  // Handle hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Client-side data fetching function
  const fetchSlangData = useCallback(
    async (
      search: string,
      category: string,
      page: number,
      isFromSearch = false
    ) => {
      try {
        if (isFromSearch) {
          setIsSearching(true);
        } else {
          setIsLoading(true);
        }
        setError(null);

        const sanitizedSearch = sanitizeSearchInput(search);

        const response = await getSlangTerms({
          search: sanitizedSearch || undefined,
          category: category !== "All" ? category : undefined,
          page,
          limit: itemsPerPage,
        });

        if (response.success) {
          setSlangData(response.data);
          setTotalResults(response.meta?.total || 0);
        } else {
          setError(response.message || "Failed to load slang terms");
          setSlangData([]);
          setTotalResults(0);
        }
      } catch (err) {
        console.error("Error fetching slang data:", err);
        setError("Failed to load slang terms. Please try again.");
        setSlangData([]);
        setTotalResults(0);
      } finally {
        setIsLoading(false);
        setIsSearching(false);
      }
    },
    [itemsPerPage]
  );

  // Debounced search function
  const debouncedFetch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;

    return (search: string, category: string, page: number) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        fetchSlangData(search, category, page, true);
      }, 300); // 300ms debounce
    };
  }, [fetchSlangData]);

  // Update URL without triggering full page reload
  const updateURL = useCallback(
    (search: string, category: string, page: number) => {
      const params = new URLSearchParams();

      const sanitizedSearch = sanitizeSearchInput(search);
      if (sanitizedSearch) params.set("search", sanitizedSearch);
      if (category !== "All") params.set("category", category);
      if (page > 1) params.set("page", page.toString());

      const query = params.toString();
      const url = query ? `/?${query}` : "/";

      // Use replace to avoid adding to history for every keystroke
      if (search !== initialSearch || category !== initialCategory) {
        window.history.replaceState(null, "", url);
      } else {
        router.push(url);
      }
    },
    [router, initialSearch, initialCategory]
  );

  const handleSearch = useCallback(
    (value: string) => {
      const sanitizedValue = sanitizeSearchInput(value);

      // Prevent searching if only spaces or too many consecutive spaces
      if (sanitizedValue.length === 0 && value.length > 0) {
        return; // Don't update if input only contains spaces
      }

      setSearchTerm(value); // Keep the original input in the field
      setCurrentPage(1);

      // Only fetch if there's meaningful content or if clearing the search
      if (sanitizedValue.length > 0 || value.length === 0) {
        debouncedFetch(sanitizedValue, selectedCategory, 1);
        updateURL(sanitizedValue, selectedCategory, 1);
      }
    },
    [selectedCategory, debouncedFetch, updateURL]
  );

  const handleCategoryChange = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      setCurrentPage(1);
      fetchSlangData(sanitizeSearchInput(searchTerm), category, 1);
      updateURL(searchTerm, category, 1);
    },
    [searchTerm, fetchSlangData, updateURL]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      setCurrentPage(newPage);
      fetchSlangData(
        sanitizeSearchInput(searchTerm),
        selectedCategory,
        newPage
      );
      updateURL(searchTerm, selectedCategory, newPage);

      // Scroll to content area instead of top
      const contentElement = document.getElementById("slang-content");
      if (contentElement) {
        contentElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    [searchTerm, selectedCategory, fetchSlangData, updateURL]
  );

  const handleRefresh = useCallback(() => {
    fetchSlangData(
      sanitizeSearchInput(searchTerm),
      selectedCategory,
      currentPage
    );
  }, [searchTerm, selectedCategory, currentPage, fetchSlangData]);

  const handleSubmissionSuccess = useCallback(() => {
    setShowSubmissionModal(false);
    // Refresh current data
    fetchSlangData(
      sanitizeSearchInput(searchTerm),
      selectedCategory,
      currentPage
    );
  }, [searchTerm, selectedCategory, currentPage, fetchSlangData]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="h-12 bg-purple-200 dark:bg-purple-800/50 rounded-lg w-3/4 mx-auto mb-4 animate-pulse"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mx-auto animate-pulse"></div>
          </div>
          <SkeletonGrid count={12} />
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
                disabled={isLoading || isSearching}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-purple-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                aria-label="Refresh data"
              >
                <IoRefresh
                  className={`h-5 w-5 text-purple-600 ${isLoading || isSearching ? "animate-spin" : ""}`}
                />
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
                maxLength={100} // Limit input length
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              disabled={isLoading || isSearching}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white sm:min-w-[200px] transition-colors duration-200 disabled:opacity-50"
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
              {isSearching
                ? "Searching..."
                : isLoading
                  ? "Loading..."
                  : `${totalResults} term${totalResults !== 1 ? "s" : ""} found`}
              {selectedCategory !== "All" && !isLoading && !isSearching && (
                <span className="ml-2 px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full">
                  in {selectedCategory}
                </span>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        id="slang-content"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        {error && (
          <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-700 dark:text-red-300 text-center">
              {error}
            </p>
            <button
              onClick={handleRefresh}
              className="mt-2 mx-auto block px-4 py-2 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/70 transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Loading States with Skeletons */}
        {isLoading || isSearching ? (
          <div className="space-y-6">
            <SkeletonGrid count={itemsPerPage} />
          </div>
        ) : slangData.length === 0 ? (
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
              {slangData.map((slang, index) => (
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
                  disabled={currentPage === 1 || isLoading || isSearching}
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
                        disabled={isLoading || isSearching}
                        className={`px-3 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50 ${
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
                  disabled={
                    currentPage === totalPages || isLoading || isSearching
                  }
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
