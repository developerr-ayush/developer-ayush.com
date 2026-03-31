"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface ViewCounterProps {
  slug: string;
  initialViews: number;
}

export default function ViewCounter({ slug, initialViews }: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const [hasIncremented, setHasIncremented] = useState(false);

  const incrementMutation = useMutation({
    mutationFn: async () => {
      const baseUrl =
        process.env.NEXT_PUBLIC_BASE_URL_ADMIN ||
        "https://admin.developer-ayush.com";
      const response = await fetch(`${baseUrl}/api/blog/${slug}/view`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Failed to increment views");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data && typeof data.views === "number") {
        setViews(data.views);
      }
    },
    onError: (error) => {
      console.error("Failed to increment view count:", error);
    },
  });

  useEffect(() => {
    if (!hasIncremented && !incrementMutation.isPending && !incrementMutation.isSuccess) {
      setHasIncremented(true);
      incrementMutation.mutate();
    }
  }, [hasIncremented, incrementMutation]);

  return (
    <div className="flex items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4 mr-1"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {views} views
    </div>
  );
}
