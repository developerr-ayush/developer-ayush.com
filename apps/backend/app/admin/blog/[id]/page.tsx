import { db } from "../../../../lib/db";
import { notFound } from "next/navigation";
import BlogForm from "../blog-form";
import { auth } from "../../../../auth";
import ApprovalActions from "../approval-actions";
import DeleteButton from "../delete-button";
import Link from "next/link";

export default async function BlogPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    return <div>Not authenticated</div>;
  }

  const isAdmin =
    session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN";

  try {
    const blog = await db.blog.findUnique({
      where: {
        id: params.id,
      },
      include: {
        categories: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (!blog) {
      notFound();
    }

    // Check if user has permission to edit this blog
    // Only the author or admin can edit
    const isAuthor = blog.author.email === session.user.email;
    if (!isAuthor && !isAdmin) {
      return (
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Permission Denied
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>You don't have permission to edit this blog post.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Add approval actions for admins viewing other users' blogs
    const showApprovalActions =
      isAdmin && !isAuthor && blog.author.role === "USER";

    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>

          <div className="flex items-center space-x-4">
            <Link
              href="/admin/blog"
              className="text-gray-600 hover:text-gray-900 transition-colors flex items-center"
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
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Blogs
            </Link>

            <DeleteButton blogId={blog.id} authorEmail={blog.author.email} />
          </div>
        </div>

        {showApprovalActions && (
          <div className="mb-6">
            <ApprovalActions blog={blog} />
          </div>
        )}

        <BlogForm blog={blog as any} />
      </div>
    );
  } catch (error) {
    console.error("Error fetching blog:", error);
    return <div>Error loading blog post</div>;
  }
}
