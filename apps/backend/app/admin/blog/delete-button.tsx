"use client";

import { useState } from "react";
import { deleteBlog } from "../../../actions/blog";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function DeleteButton({
  blogId,
  authorEmail,
}: {
  blogId: string;
  authorEmail?: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  // Determine if the user has permission to delete this blog
  const isAdmin =
    session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const isAuthor = session?.user?.email === authorEmail;
  const canDelete = isAdmin || isAuthor;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteBlog(blogId);
      if (result.success) {
        router.refresh();
      } else {
        console.error(result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error("Failed to delete blog post:", error);
      alert("Failed to delete blog post");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      {canDelete ? (
        <button
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:text-red-900 transition-colors flex items-center"
          disabled={isDeleting}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
      ) : (
        <div className="relative">
          <button
            onClick={() => setShowTooltip(!showTooltip)}
            className="text-gray-400 cursor-not-allowed flex items-center"
            disabled
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>

          {showTooltip && (
            <div className="absolute bottom-full left-0 mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-md shadow-lg animate-fadeIn z-10">
              <p>
                {session?.user?.role === "USER"
                  ? "You can only delete your own blog posts"
                  : "You don't have permission to delete this blog"}
              </p>
              <div className="absolute bottom-0 left-3 transform translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
            </div>
          )}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 m-4 transform transition-all">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-red-100 rounded-full p-2 mr-3">
                <svg
                  className="h-5 w-5 text-red-600"
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
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                Delete Blog Post
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6 w-full text-wrap">
              Are you sure you want to delete this blog post? This action cannot
              be undone and all associated data will be permanently removed.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
