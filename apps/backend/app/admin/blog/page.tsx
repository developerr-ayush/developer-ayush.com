import Link from "next/link";
import { showBlog } from "../../../actions/blog";
import { formatDistanceToNow } from "date-fns";
import DeleteButton from "./delete-button";
import Image from "next/image";
import { blogSchema } from "../../../schemas";
import * as z from "zod";

export default async function BlogAdmin() {
  const blogs: z.infer<typeof blogSchema>[] = await showBlog();

  return (
    <div>
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage your blog content and publications
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Post
        </Link>
      </div>

      <div className="bg-white overflow-hidden shadow-md rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Updated
                </th>
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {blogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <svg
                        className="w-12 h-12 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                      <p className="text-gray-500 mb-1">No blog posts found</p>
                      <p className="text-sm text-gray-400">
                        Get started by creating a new post
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                blogs.map((blog) => (
                  <tr
                    key={blog.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {blog.banner && (
                          <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden mr-4">
                            <Image
                              src={blog.banner}
                              alt=""
                              className="h-full w-full object-cover"
                              width={40}
                              height={40}
                            />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {blog.title}
                          </div>
                          {blog.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {blog.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${
                          blog.status === "published"
                            ? "bg-green-100 text-green-800"
                            : blog.status === "draft"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {blog.status || "draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {blog.updatedAt
                        ? formatDistanceToNow(new Date(blog.updatedAt), {
                            addSuffix: true,
                          })
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-4">
                        <Link
                          href={`/admin/blog/${blog.id}`}
                          className="text-indigo-600 hover:text-indigo-900 transition-colors flex items-center"
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
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                          Edit
                        </Link>
                        <DeleteButton blogId={blog.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
