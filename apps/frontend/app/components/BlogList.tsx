"use client";

import { useEffect, useState, useCallback } from "react";
import {
  getBlogPosts,
  type BlogPost,
  type PaginationResponse,
} from "../blogData";
import BlogCard from "./BlogCard";
import { useInView } from "react-intersection-observer";

import { useInfiniteQuery } from "@tanstack/react-query";

export default function BlogList() {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["blogPosts"],
    queryFn: async ({ pageParam = 1 }) => {
      console.log("Fetching more posts for page:", pageParam);
      const response = await getBlogPosts(pageParam);
      if (!response || !response.data) {
        throw new Error("Invalid response format from API");
      }
      return response;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const postsPerPage = 10;
      const currentPage = allPages.length;
      const totalPages =
        lastPage.meta?.totalPages ||
        Math.ceil(lastPage.data.length / postsPerPage) + currentPage;
      
      const hasMorePages = lastPage.data.length >= postsPerPage;
      return hasMorePages && lastPage.data.length > 0 && currentPage < totalPages
        ? currentPage + 1
        : undefined;
    },
  });

  useEffect(() => {
    // If the loader is in view and we have more pages to load
    if (inView && hasNextPage && !isFetchingNextPage) {
      console.log("Loading next page...");
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  // Flatten the pages array into a single array of posts
  const posts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <>
      {status === "error" && (
        <div className="text-center py-8 mb-8 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-500">
            {error instanceof Error ? error.message : "Failed to load more blog posts. Please try again."}
          </p>
          <button
            onClick={() => fetchNextPage()}
            className="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      )}

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.id || index} post={post} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h3 className="text-xl font-semibold mb-2">No blog posts found</h3>
          <p className="text-foreground/60">Check back later for new content</p>
        </div>
      )}

      {/* Loading indicator */}
      <div ref={ref} className="mt-10 py-6 flex justify-center items-center">
        {(isFetchingNextPage || (isFetching && !isFetchingNextPage)) && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-sky-500 animate-pulse"></div>
            <div
              className="w-4 h-4 rounded-full bg-sky-500 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            ></div>
            <div
              className="w-4 h-4 rounded-full bg-sky-500 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            ></div>
          </div>
        )}
      </div>

      {/* No more posts indicator */}
      {!hasNextPage && posts.length > 0 && !isFetching && (
        <div className="mt-10 text-center text-foreground/60">
          You&apos;ve reached the end of the blog posts
        </div>
      )}
    </>
  );
}
