import { getBlogById } from "../../../../actions/blog";
import { notFound } from "next/navigation";
import BlogForm from "../blog-form";
import Link from "next/link";

export default async function EditBlogPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const blog = await getBlogById(id);

  if (!blog) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          <p className="mt-2 text-sm text-gray-600">
            Update &apos;{blog.title}&apos;
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
      <BlogForm blog={blog} />
    </div>
  );
}
