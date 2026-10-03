"use client";

import { useEffect } from "react";
import ErrorState from "../../components/ErrorState";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <ErrorState
      eyebrow="Something went wrong"
      title={
        <>
          This post didn&apos;t <em>load</em>
        </>
      }
      message="We hit an error while loading this blog post. It may be a temporary network or database issue."
      action={
        <button type="button" onClick={() => reset()} className="btn btn-primary">
          Try again
        </button>
      }
      backHref="/blog"
      backLabel="Back to blog"
    />
  );
}
