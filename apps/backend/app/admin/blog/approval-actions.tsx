"use client";

import { useState } from "react";
import { approveBlog, publishBlog } from "../../../actions/blog";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface Blog {
  id: string;
  title?: string | null;
  status: "draft" | "published" | "archived";
  approved: boolean;
}

export default function ApprovalActions({ blog }: { blog: Blog }) {
  const [isApproving, setIsApproving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handleApprove = async () => {
    if (blog.approved) return;

    setIsApproving(true);
    try {
      const result = await approveBlog(blog.id);
      if (result.success) {
        toast.success(result.success);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to approve blog");
      console.error(error);
    } finally {
      setIsApproving(false);
    }
  };

  const handlePublish = async () => {
    if (blog.status === "published") return;

    setIsPublishing(true);
    try {
      const result = await publishBlog(blog.id);
      if (result.success) {
        toast.success(result.success);
        router.refresh();
      } else if (result.error) {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Failed to publish blog");
      console.error(error);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Actions</h3>
      <p className="text-sm text-gray-600 mb-4">
        This blog post was created by another user and requires admin review.
      </p>

      <div className="flex flex-wrap gap-4">
        {!blog.approved && (
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isApproving ? "Approving..." : "Approve Content"}
          </button>
        )}

        {blog.approved && blog.status !== "published" && (
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {isPublishing ? "Publishing..." : "Publish Blog"}
          </button>
        )}

        {blog.approved && (
          <div className="flex items-center text-sm text-green-600">
            <svg
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Content Approved
          </div>
        )}

        {blog.status === "published" && (
          <div className="flex items-center text-sm text-green-600">
            <svg
              className="h-5 w-5 mr-1.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            Published
          </div>
        )}
      </div>
    </div>
  );
}
