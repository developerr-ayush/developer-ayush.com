import type { Metadata } from "next";
import Link from "next/link";
import ErrorState from "./components/ErrorState";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <ErrorState
      eyebrow="404 — Not found"
      title={
        <>
          Nothing <em>here</em>, yet
        </>
      }
      message="The page you're looking for doesn't exist or has moved."
      action={
        <Link href="/blog" className="btn btn-primary">
          Read the blog
        </Link>
      }
      backHref="/"
      backLabel="Back to home"
    />
  );
}
