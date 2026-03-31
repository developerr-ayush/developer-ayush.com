"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, LayoutDashboard } from "lucide-react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Admin error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-6 py-16">
      {/* Icon */}
      <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center justify-center mb-5">
        <AlertTriangle className="w-7 h-7 text-rose-400" />
      </div>

      {/* Message */}
      <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
      <p className="text-sm text-slate-400 max-w-md mb-2 leading-relaxed">
        {error.message || "An unexpected error occurred while loading this page. This may be a temporary issue with the database connection."}
      </p>
      {error.digest && (
        <p className="text-xs text-slate-600 font-mono mb-6">
          Error ID: {error.digest}
        </p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 mt-4">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm font-semibold rounded-xl transition-all"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          Dashboard
        </Link>
      </div>
    </div>
  );
}
