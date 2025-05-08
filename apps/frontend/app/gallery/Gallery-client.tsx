"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

// Define types directly in this file to avoid declaration file issues
type GalleryData = {
  images: string[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

async function fetchGalleryData(
  page: number = 1,
  limit: number = 12,
  searchQuery: string = ""
): Promise<GalleryData> {
  try {
    let url = `/api/gallery?page=${page}&limit=${limit}`;

    // Add search query if provided
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      cache: page === 1 ? "force-cache" : "no-store",
    });

    if (!response.ok) {
      throw new Error("Failed to fetch gallery images");
    }

    const data = await response.json();
    return data as GalleryData;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    // Return empty data on error
    return {
      images: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
}

interface GalleryClientProps {
  searchQuery: string;
}

export default function GalleryClient({
  searchQuery: initialSearchQuery,
}: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [galleryData, setGalleryData] = useState<GalleryData | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    initialSearchQuery || searchParams.get("q") || ""
  );
  const [isSearching, setIsSearching] = useState(false);

  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGalleryData(1, 12, searchQuery);
        setGalleryData(data);
        setImages(data.images);
        setCurrentPage(1);
      } catch (err) {
        setError("Failed to load images");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && galleryData?.hasMore) {
            loadMoreImages();
          }
        },
        { threshold: 0.1 }
      );

      if (node) observer.current.observe(node);
    },
    [isLoading, galleryData?.hasMore]
  );

  // Perform search when query changes
  const performSearch = useCallback(async () => {
    setIsSearching(true);
    setIsLoading(true);
    setCurrentPage(1);

    try {
      // Update the URL with search query
      const params = new URLSearchParams(searchParams.toString());
      if (searchQuery) {
        params.set("q", searchQuery);
      } else {
        params.delete("q");
      }

      // Replace URL with new search params
      const newPath = `/gallery${params.toString() ? `?${params.toString()}` : ""}`;
      router.replace(newPath);

      // Fetch new results
      const newData = await fetchGalleryData(1, 12, searchQuery);
      setGalleryData(newData);
      setImages(newData.images);
      setError(null);
    } catch (err) {
      setError("Failed to search images. Please try again.");
      console.error("Error searching images:", err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  }, [searchQuery, router, searchParams]);

  // Load more images when scrolling
  const loadMoreImages = async () => {
    if (isLoading || !galleryData?.hasMore) return;

    setIsLoading(true);
    try {
      const nextPage = currentPage + 1;
      const newData = await fetchGalleryData(nextPage, 12, searchQuery);

      setGalleryData(newData);
      setImages((prevImages) => [...prevImages, ...newData.images]);
      setCurrentPage(nextPage);
      setError(null);
    } catch (err) {
      setError("Failed to load more images. Please try again.");
      console.error("Error loading more images:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image click to show full view
  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";
  };

  // Close the full view
  const closeFullView = () => {
    setSelectedImage(null);
    // Re-enable scrolling
    document.body.style.overflow = "";
  };

  // Clear search and reset gallery
  const clearSearch = () => {
    setSearchQuery("");
    searchInputRef.current?.focus();

    if (searchParams.has("q")) {
      performSearch();
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch();
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeFullView();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      {/* Search bar */}
      <div className="mb-8">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              ref={searchInputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search images..."
              className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={isSearching}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-70"
          >
            {isSearching ? (
              <div className="flex items-center">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <span>Search</span>
            )}
          </button>
        </form>
      </div>

      {/* Gallery grid */}
      {isLoading && images.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-gray-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700">
            No images found
          </h3>
          <p className="text-gray-500 mt-2 max-w-md">
            {searchQuery
              ? `No results matching "${searchQuery}"`
              : "There are no images in the gallery"}
          </p>
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((imagePath, index) => {
            const isLastImage = index === images.length - 1;
            return (
              <motion.div
                ref={isLastImage ? lastImageElementRef : null}
                key={`${imagePath}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 1) }}
                className="relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer group"
                onClick={() => handleImageClick(imagePath)}
              >
                <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
                <Image
                  src={`/ai-images/${imagePath}`}
                  alt={`${imagePath.split("-").join(" ")}`}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105 z-10"
                  onLoadingComplete={(img) => {
                    // Remove loading animation once image is loaded
                    img.parentElement
                      ?.querySelector(".animate-pulse")
                      ?.classList.add("hidden");
                  }}
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300 z-20"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                  <p className="text-white text-sm truncate">
                    {imagePath.split("-").slice(0, 6).join(" ")}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {isLoading && images.length > 0 && (
        <div className="flex justify-center mt-8 pb-8">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
            <p className="text-gray-600">Loading more images...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-center mt-8 pb-8">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => performSearch()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {!isLoading && galleryData?.hasMore === false && images.length > 0 && (
        <div className="text-center text-gray-500 mt-8 pb-8">
          {searchQuery
            ? `End of results for "${searchQuery}"`
            : "You've reached the end of the gallery"}
        </div>
      )}

      {/* Full view modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
            onClick={closeFullView}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75 z-10 transition-all hover:rotate-90"
                onClick={closeFullView}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center bg-black bg-opacity-50 rounded-md px-4 py-2">
                <p className="text-white truncate mr-2">
                  {selectedImage.replaceAll("-", " ").replaceAll("_", " ")}
                </p>

                <div className="flex space-x-2">
                  {/* Navigation arrows */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = images.indexOf(selectedImage);
                      if (currentIndex > 0) {
                        setSelectedImage(images[currentIndex - 1]);
                      }
                    }}
                    disabled={images.indexOf(selectedImage) === 0}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = images.indexOf(selectedImage);
                      if (currentIndex < images.length - 1) {
                        setSelectedImage(images[currentIndex + 1]);
                      }
                    }}
                    disabled={
                      images.indexOf(selectedImage) === images.length - 1
                    }
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="relative w-full h-[80vh]">
                <Image
                  src={`/ai-images/${selectedImage}`}
                  alt={selectedImage.replaceAll("-", " ")}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
