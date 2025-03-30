"use client";

import { useEffect, useState } from "react";
import {
  getBlogPosts,
  type BlogPost,
  type PaginationResponse,
} from "../blogData";
import BlogCard from "./BlogCard";
import { useInView } from "react-intersection-observer";

type BlogListProps = {
  initialData: PaginationResponse<BlogPost>;
};

export default function BlogList({ initialData }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialData.data || []);
  const [pagination, setPagination] = useState<{
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
    hasMore: boolean;
  }>({
    currentPage: 1, // Start at page 1 since we already have that data
    totalPages: initialData.meta?.totalPages || 1,
    isLoading: false,
    hasMore: initialData.data.length >= 10, // Assuming 10 posts per page
  });

  const [error, setError] = useState<string | null>(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  });

  const fetchMorePosts = async (page: number) => {
    if (pagination.isLoading) return;

    setError(null);
    setPagination((prev) => ({ ...prev, isLoading: true }));

    try {
      console.log("Fetching more posts for page:", page);
      const response = await getBlogPosts(page);
      console.log("API Response for page", page, ":", response);

      if (!response || !response.data) {
        throw new Error("Invalid response format from API");
      }

      setPosts((prev) => [...prev, ...response.data]);

      // Calculate if there are more pages
      const postsPerPage = 10;
      const hasMorePages = response.data.length >= postsPerPage;

      setPagination({
        currentPage: page,
        totalPages:
          response.meta?.totalPages ||
          Math.ceil(response.data.length / postsPerPage) + page,
        isLoading: false,
        hasMore: hasMorePages && response.data.length > 0,
      });
    } catch (error) {
      console.error("Error fetching more posts:", error);
      setError("Failed to load more blog posts. Please try again.");
      setPagination((prev) => ({ ...prev, isLoading: false }));
    }
  };

  useEffect(() => {
    // If the loader is in view and we have more pages to load
    if (inView && pagination.hasMore && !pagination.isLoading) {
      const nextPage = pagination.currentPage + 1;
      console.log("Loading next page:", nextPage);
      fetchMorePosts(nextPage);
    }
  }, [
    inView,
    pagination.hasMore,
    pagination.isLoading,
    pagination.currentPage,
  ]);

  return (
    <>
      {error && (
        <div className="text-center py-8 mb-8 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => fetchMorePosts(pagination.currentPage)}
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
        {pagination.isLoading && (
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
      {!pagination.hasMore && posts.length > 0 && !pagination.isLoading && (
        <div className="mt-10 text-center text-foreground/60">
          You've reached the end of the blog posts
        </div>
      )}
    </>
  );
}
