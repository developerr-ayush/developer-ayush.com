"use client";

import { useEffect } from "react";
import ErrorState from "../components/ErrorState";

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
    <ErrorState
      eyebrow="Something went wrong"
      title={
        <>
          Couldn&apos;t load the <em>posts</em>
        </>
      }
      message="We're having trouble fetching the list of blog posts. Please try again in a moment."
      action={
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
      }
      backHref="/"
      backLabel="Back to home"
    />
  );
}
