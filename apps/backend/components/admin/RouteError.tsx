"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw } from "lucide-react";

/** Shared error UI for every error.tsx boundary under /admin. */
export function RouteError({
  error,
  reset,
  title = "Something went wrong",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  React.useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div role="alert" className="mx-auto flex max-w-md flex-col items-center px-4 py-20 text-center">
      <AlertTriangle className="mb-4 size-6 text-danger" aria-hidden="true" />
      <h1 className="font-serif text-[2rem] leading-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted">
        This page failed to load. It is usually temporary, such as a dropped database connection. Try again, and if it keeps
        happening check the server logs.
      </p>
      {error.digest ? <p className="mono mt-3 text-xs text-muted">ref: {error.digest}</p> : null}
      <div className="mt-6 flex items-center gap-2">
        <button type="button" onClick={reset} className="btn btn-primary" autoFocus>
          <RefreshCw className="size-3.5" aria-hidden="true" /> Try again
        </button>
        <Link href="/admin" className="btn">
          Dashboard
        </Link>
      </div>
    </div>
  );
}
