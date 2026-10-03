"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getBlogPosts, BlogPost, PaginationResponse } from "../blogData";
import BlogCard from "./BlogCard";

interface BlogListProps {
  initialPosts: BlogPost[];
  initialMeta: Partial<PaginationResponse<BlogPost>["meta"]>;
}

const POSTS_PER_PAGE = 10;

export default function BlogList({ initialPosts, initialMeta }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(
    initialPosts.length >= POSTS_PER_PAGE &&
      (initialMeta.totalPages === undefined || initialMeta.totalPages > 1)
  );
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  const fetchNextPage = useCallback(async () => {
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
  }, [isFetching, hasNextPage, page]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      },
      { rootMargin: "400px 0px" }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  return (
    <>
      {posts.length > 0 ? (
        <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <li key={post.id || index}>
              <BlogCard post={post} index={index} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="display text-3xl">No posts yet</p>
          <p className="mt-2 text-muted">Check back later for new writing.</p>
        </div>
      )}

      {/* Scroll trigger + status */}
      <div
        ref={loaderRef}
        className="mt-14 flex min-h-12 flex-col items-center justify-center gap-4 text-sm text-muted"
        aria-live="polite"
      >
        {error && (
          <div role="alert" className="flex flex-col items-center gap-3">
            <p className="text-accent">{error}</p>
            <button type="button" onClick={fetchNextPage} className="btn btn-ghost">
              Try again
            </button>
          </div>
        )}
        {isFetching && <p>Loading more posts…</p>}
        {!isFetching && !error && hasNextPage && (
          <button type="button" onClick={fetchNextPage} className="btn btn-ghost">
            Load more posts
          </button>
        )}
        {!hasNextPage && posts.length > 0 && !isFetching && (
          <p>You&apos;ve reached the end.</p>
        )}
      </div>
    </>
  );
}
