"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight, FiSearch, FiX } from "react-icons/fi";
import { getImagesMetadata } from "./actions";

interface GalleryClientProps {
  searchQuery: string;
}

/** Turn a file name into readable alt text. */
function describe(file: string) {
  const text = file
    .replace(/\.[a-z0-9]+$/i, "")
    .replace(/_\d{10,}$/, "")
    .replace(/^deepai_[a-z0-9-]+$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return text ? `AI-generated image: ${text}` : "AI-generated image";
}

export default function GalleryClient({
  searchQuery: initialSearchQuery,
}: GalleryClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(
    initialSearchQuery || searchParams.get("q") || ""
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["gallery", searchQuery],
    queryFn: async ({ pageParam = 1 }) => {
      return getImagesMetadata(pageParam as number, 12, searchQuery);
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // If the backend hasMore flag is true, compute next page
      if (lastPage.hasMore && lastPage.images.length > 0) {
        return allPages.length + 1;
      }
      return undefined;
    },
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastImageElementRef = useCallback(
    (node: HTMLLIElement | null) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: "400px 0px" }
      );

      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  // Perform search when query changes
  const performSearch = useCallback(async () => {
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
  }, [searchQuery, router, searchParams]);

  const images = data?.pages.flatMap((page) => page.images) || [];
  const isLoading = status === "pending";
  const isSearching = isFetching && !isFetchingNextPage && images.length > 0;
  const selectedIndex = selectedImage ? images.indexOf(selectedImage) : -1;

  // Open / close the lightbox dialog
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (selectedImage && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!selectedImage && dialog.open) {
      dialog.close();
    }
  }, [selectedImage]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleImageClick = (imagePath: string, opener: HTMLElement) => {
    openerRef.current = opener;
    setSelectedImage(imagePath);
  };

  // Fired by Escape, the close button and backdrop clicks
  const handleDialogClose = () => {
    setSelectedImage(null);
    document.body.style.overflow = "";
    openerRef.current?.focus();
  };

  const showPrev = () => {
    if (selectedIndex > 0) setSelectedImage(images[selectedIndex - 1] || null);
  };
  const showNext = () => {
    if (selectedIndex < images.length - 1)
      setSelectedImage(images[selectedIndex + 1] || null);
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

  return (
    <>
      {/* Search bar */}
      <form
        role="search"
        onSubmit={handleSearchSubmit}
        className="mb-10 flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="gallery-search" className="sr-only">
          Search images
        </label>
        <div className="relative flex-grow">
          <FiSearch
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            id="gallery-search"
            type="search"
            ref={searchInputRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search images, e.g. sofa, phone, laptop"
            className="field !rounded-full pl-11 pr-12 [&::-webkit-search-cancel-button]:hidden"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:text-ink"
            >
              <FiX aria-hidden="true" />
              <span className="sr-only">Clear search</span>
            </button>
          )}
        </div>
        <button type="submit" disabled={isSearching} className="btn btn-primary disabled:opacity-70">
          {isSearching ? "Searching…" : "Search"}
        </button>
      </form>

      <p className="sr-only" aria-live="polite">
        {isLoading
          ? "Loading images"
          : `${images.length} images shown${searchQuery ? ` for “${searchQuery}”` : ""}`}
      </p>

      {/* Gallery grid */}
      {isLoading && images.length === 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="skeleton aspect-square rounded-xl" />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="display text-3xl">No images found</p>
          <p className="mt-2 text-muted">
            {searchQuery
              ? `No results matching “${searchQuery}”.`
              : "There are no images in the gallery yet."}
          </p>
          {searchQuery && (
            <button type="button" onClick={clearSearch} className="btn btn-ghost mt-6">
              Clear search
            </button>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {images.map((imagePath, index) => {
            const isLastImage = index === images.length - 1;
            return (
              <li
                ref={isLastImage ? lastImageElementRef : null}
                key={`${imagePath}-${index}`}
              >
                <button
                  type="button"
                  onClick={(e) => handleImageClick(imagePath, e.currentTarget)}
                  className="group relative block aspect-square w-full overflow-hidden rounded-xl bg-surface"
                >
                  <Image
                    src={`/ai-images/${imagePath}`}
                    alt={describe(imagePath)}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 300px"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-10 text-center text-sm text-muted">
        {isFetchingNextPage && <p>Loading more images…</p>}

        {status === "error" && (
          <div role="alert">
            <p className="text-accent">
              {error instanceof Error ? error.message : "Error loading images"}
            </p>
            <button type="button" onClick={() => performSearch()} className="btn btn-ghost mt-4">
              Retry
            </button>
          </div>
        )}

        {!isLoading && !hasNextPage && images.length > 0 && (
          <p>
            {searchQuery
              ? `End of results for “${searchQuery}”`
              : "You've reached the end of the gallery"}
          </p>
        )}
      </div>

      {/* Full view lightbox */}
      <dialog
        ref={dialogRef}
        onClose={handleDialogClose}
        onClick={(e) => {
          // click on the backdrop (the dialog element itself) closes it
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") showPrev();
          if (e.key === "ArrowRight") showNext();
        }}
        aria-label="Image viewer"
        className="m-auto h-[100dvh] max-h-none w-full max-w-none bg-transparent p-4 text-white backdrop:bg-black/90 sm:p-8"
      >
        {selectedImage && (
          <div className="pointer-events-none flex h-full flex-col gap-4">
            <div className="pointer-events-auto flex items-center justify-between gap-4">
              <p className="truncate font-mono text-xs text-white/80">
                {selectedIndex + 1} / {images.length}
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => dialogRef.current?.close()}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <FiX aria-hidden="true" className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </button>
            </div>

            <div className="relative min-h-0 flex-1">
              <Image
                src={`/ai-images/${selectedImage}`}
                alt={describe(selectedImage)}
                fill
                sizes="100vw"
                priority
                className="object-contain"
              />
            </div>

            <div className="pointer-events-auto flex items-center justify-between gap-4">
              <p className="line-clamp-2 text-sm text-white/80">
                {describe(selectedImage).replace("AI-generated image: ", "")}
              </p>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={showPrev}
                  disabled={selectedIndex <= 0}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
                >
                  <FiChevronLeft aria-hidden="true" className="h-5 w-5" />
                  <span className="sr-only">Previous image</span>
                </button>
                <button
                  type="button"
                  onClick={showNext}
                  disabled={selectedIndex >= images.length - 1}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30"
                >
                  <FiChevronRight aria-hidden="true" className="h-5 w-5" />
                  <span className="sr-only">Next image</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
