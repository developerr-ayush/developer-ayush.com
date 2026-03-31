"use client";

import { useEffect, useRef, useState } from "react";
import { getBlogPosts, BlogPost } from "../blogData";
import BlogCard from "./BlogCard";

interface Meta {
  totalPages?: number;
  [key: string]: any;
}

interface BlogListProps {
  initialPosts: BlogPost[];
  initialMeta: Meta;
}

const POSTS_PER_PAGE = 10;

export default function BlogList({ initialPosts, initialMeta }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(
    initialPosts.length >= POSTS_PER_PAGE
  );
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchNextPage = async () => {
    if (isFetching || !hasNextPage) return;
    setIsFetching(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const response = await getBlogPosts(nextPage);

      if (!response?.data) throw new Error("Invalid response from API");

      setPosts((prev) => [...prev, ...response.data]);
      setPage(nextPage);

      const totalPages =
        response.meta?.totalPages ||
        Math.ceil(response.data.length / POSTS_PER_PAGE) + nextPage;

      setHasNextPage(
        response.data.length >= POSTS_PER_PAGE && nextPage < totalPages
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load more posts");
    } finally {
      setIsFetching(false);
    }
  };

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.length > 0 && entries[0] && entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching]);
  console.log(initialPosts)
  return (
    <>
      {error && (
        <div className="text-center py-8 mb-8 bg-red-500/10 rounded-lg border border-red-500/20">
          <p className="text-red-500">{error}</p>
          <button
            onClick={fetchNextPage}
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

      {/* Scroll trigger */}
      <div ref={loaderRef} className="mt-10 py-6 flex justify-center items-center">
        {isFetching && (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-sky-500 animate-pulse" />
            <div className="w-4 h-4 rounded-full bg-sky-500 animate-pulse" style={{ animationDelay: "0.2s" }} />
            <div className="w-4 h-4 rounded-full bg-sky-500 animate-pulse" style={{ animationDelay: "0.4s" }} />
          </div>
        )}
      </div>

      {!hasNextPage && posts.length > 0 && !isFetching && (
        <div className="mt-10 text-center text-foreground/60">
          You&apos;ve reached the end of the blog posts
        </div>
      )}
    </>
  );
}