"use client";

import { useEffect } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

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
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
        <FaExclamationTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Unable to load products</h2>
      <p className="text-gray-600 mb-8 max-w-sm">
        We ran into a problem while fetching the product list. Please check your internet connection and try again.
      </p>
      <button
        onClick={() => reset()}
        className="py-3 px-8 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
      >
        Try Again
      </button>
    </div>
  );
}
