"use client";

import { useState, useEffect, useCallback } from "react";
import {
  IoSearch,
  IoMoon,
  IoSunny,
  IoAdd,
  IoSparkles,
  IoRefresh,
} from "react-icons/io5";
import {
  getSlangTerms,
  getFeaturedSlang,
  getCategories,
  SlangTerm,
} from "@/lib/slang-api";
import { SubmitSlangForm } from "@/components/SubmitSlangForm";

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [darkMode, setDarkMode] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [dailySpotlight, setDailySpotlight] = useState<SlangTerm | null>(null);
  const [mounted, setMounted] = useState(false);

  // API state
  const [slangData, setSlangData] = useState<SlangTerm[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const itemsPerPage = 12;

  // Handle hydration and theme loading
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme) {
      const isDark = JSON.parse(savedTheme);
      setDarkMode(isDark);
      // Apply theme immediately
      if (isDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      // Check system preference if no saved theme
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  // Update localStorage and document class when theme changes
  useEffect(() => {
    if (!mounted) return; // Don't run on server

    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode, mounted]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load categories
  useEffect(() => {
    loadCategories();
  }, []);

  // Load featured slang for daily spotlight
  useEffect(() => {
    loadDailySpotlight();
  }, []);

  const loadInitialData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getSlangTerms({
        page: 1,
        limit: itemsPerPage,
      });

      if (response.success) {
        setSlangData(response.data);
        setTotalResults(response.meta?.total || 0);
      } else {
        setError(response.message || "Failed to load slang terms");
      }
    } catch (err) {
      setError("Failed to load slang terms. Please try again.");
      console.error("Error loading initial data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categoriesData = await getCategories();
      setCategories(["All", ...categoriesData]);
    } catch (err) {
      console.error("Error loading categories:", err);
      // Set fallback categories
      setCategories(["All", "General", "Compliment", "Behavior", "Quality"]);
    }
  };

  const loadDailySpotlight = async () => {
    try {
      const featured = await getFeaturedSlang();
      if (featured) {
        setDailySpotlight(featured || null);
      } else {
        // Fallback: get a random featured term from the main data
        const response = await getSlangTerms({ featured: true, limit: 1 });
        if (response.success && response.data.length > 0) {
          setDailySpotlight(response.data[0] || null);
        }
      }
    } catch (err) {
      console.error("Error loading daily spotlight:", err);
    }
  };

  const loadFilteredData = useCallback(
    async (page = 1, append = false) => {
      if (page === 1) {
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }
      setError(null);

      try {
        const response = await getSlangTerms({
          search: searchTerm || undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
          page,
          limit: itemsPerPage,
        });

        if (response.success) {
          if (append) {
            setSlangData((prev) => [...prev, ...response.data]);
          } else {
            setSlangData(response.data);
          }
          setTotalResults(response.meta?.total || 0);
        } else {
          setError(response.message || "Failed to load slang terms");
        }
      } catch (err) {
        setError("Failed to load slang terms. Please try again.");
        console.error("Error loading filtered data:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [searchTerm, selectedCategory, itemsPerPage]
  );

  // Load filtered data when search or category changes
  useEffect(() => {
    if (searchTerm || selectedCategory !== "All") {
      loadFilteredData();
    } else {
      loadInitialData();
    }
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, loadFilteredData]);

  // Pagination
  const totalPages = Math.ceil(totalResults / itemsPerPage);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    loadFilteredData(newPage);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmissionSuccess = useCallback(() => {
    // Refresh data after successful submission
    if (searchTerm || selectedCategory !== "All") {
      loadFilteredData();
    } else {
      loadInitialData();
    }
    setShowSubmissionModal(false);
  }, [searchTerm, selectedCategory, loadFilteredData]);

  const handleRefresh = () => {
    if (searchTerm || selectedCategory !== "All") {
      loadFilteredData();
    } else {
      loadInitialData();
    }
    loadDailySpotlight();
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Prevent hydration mismatch for dark mode
  if (!mounted) {
    return null;
  }

  if (isLoading && slangData.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 transition-colors duration-300">
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

            {/* Theme Toggle, Refresh & Add Button */}
            <div className="flex gap-2 ml-4">
              <button
                onClick={handleRefresh}
                disabled={isLoading}
                className="p-3 rounded-xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-purple-200 dark:border-gray-600 hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50"
                aria-label="Refresh data"
              >
                <IoRefresh
                  className={`h-5 w-5 text-purple-600 ${isLoading ? "animate-spin" : ""}`}
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
          {dailySpotlight && (
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
                    {dailySpotlight.term}
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">
                    {dailySpotlight.meaning}
                  </p>
                  {dailySpotlight.example && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      &ldquo;{dailySpotlight.example}&rdquo;
                    </p>
                  )}
                </div>
                <span className="px-3 py-1 text-sm rounded-full bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 font-medium self-start">
                  {dailySpotlight.category}
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
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-purple-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 rounded-xl border border-purple-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 dark:text-white sm:min-w-[200px] transition-colors duration-200"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="text-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {totalResults} term{totalResults !== 1 ? "s" : ""} found
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

        {slangData.length === 0 && !isLoading ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {slangData.map((slang, index) => (
                <div
                  key={slang.id || `${slang.term}-${index}`}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-md rounded-2xl p-6 border border-purple-200/50 dark:border-gray-700/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300">
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

                  {slang.submitted_by && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Submitted by: {slang.submitted_by}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Loading more indicator */}
            {isLoadingMore && (
              <div className="text-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Loading more terms...
                </p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-4">
                <button
                  onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                  disabled={currentPage === 1 || isLoadingMore}
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
                        disabled={isLoadingMore}
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
                  disabled={currentPage === totalPages || isLoadingMore}
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
          categories={categories.filter((cat) => cat !== "All")}
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
