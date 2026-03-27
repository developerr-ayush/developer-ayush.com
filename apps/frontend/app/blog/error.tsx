"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="bg-red-500/10 p-6 rounded-2xl mb-8">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-16 w-16 text-red-500 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Failed to load blog posts</h2>
        <p className="text-foreground/70 max-w-md mx-auto">
          We&apos;re having trouble fetching the list of blog posts. Please try again in a moment.
        </p>
      </div>
      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors font-semibold"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-2 bg-foreground/10 text-foreground rounded-full hover:bg-foreground/20 transition-colors font-semibold"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
