import BlogForm from "../blog-form";
import Link from "next/link";

export default function NewBlogPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Blog Post
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Write and publish a new article to your blog
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Your changes will be auto-saved as you type
          </p>
        </div>
        <Link
          href="/admin/blog"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Posts
        </Link>
      </div>
      <BlogForm />
    </div>
  );
}
