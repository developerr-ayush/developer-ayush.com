"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog } from "../../../actions/blog";
import { blogSchema } from "../../../schemas";

type FormValues = z.infer<typeof blogSchema>;

export default function BlogForm({ blog }: { blog?: any }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: "",
      description: "",
      banner: "",
      status: "draft",
      slug: "",
      tags: "",
      categories: [],
      date: new Date(),
    },
  });

  // Watch banner field for preview
  const watchedBanner = watch("banner");

  useEffect(() => {
    if (blog) {
      setValue("title", blog.title);
      setValue("content", blog.content);
      setValue("description", blog.description || "");
      setValue("banner", blog.banner);
      setBannerUrl(blog.banner || "");
      setValue("status", blog.status || "draft");
      setValue("slug", blog.slug);
      setValue("tags", blog.tags || "");
      setValue("categories", blog.categories?.map((cat: any) => cat.id) || []);
      setValue("date", new Date());
    }
  }, [blog, setValue]);

  // Update banner URL when the watched value changes
  useEffect(() => {
    setBannerUrl(watchedBanner || "");
  }, [watchedBanner]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (blog) {
        const result = await updateBlog(data, blog.id);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/blog");
          router.refresh();
        }
      } else {
        const result = await createBlog(data);
        if (result.error) {
          setError(result.error);
        } else {
          router.push("/admin/blog");
          router.refresh();
        }
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden">
      {error && (
        <div className="border-l-4 border-red-400 bg-red-50 p-4 m-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.title ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  placeholder="Enter blog title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="slug"
                  className="block text-sm font-medium text-gray-700"
                >
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  id="slug"
                  type="text"
                  className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.slug ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  placeholder="enter-url-slug"
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.slug.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  This will be used in the URL
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="space-y-2">
              <label
                htmlFor="banner"
                className="block text-sm font-medium text-gray-700"
              >
                Banner Image URL <span className="text-red-500">*</span>
              </label>
              <input
                id="banner"
                type="text"
                className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.banner ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="https://example.com/image.jpg"
                {...register("banner")}
              />
              {errors.banner && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.banner.message}
                </p>
              )}
            </div>

            {bannerUrl && (
              <div className="mt-4">
                <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={bannerUrl}
                    alt="Banner preview"
                    className="object-cover w-full h-full"
                    onError={() => setBannerUrl("")}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="space-y-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                rows={3}
                className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.description ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Brief description of your blog post"
                {...register("description")}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                A short summary that appears in blog listings
              </p>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="space-y-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700"
              >
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                rows={10}
                className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.content ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Write your blog content here..."
                {...register("content")}
              />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.content.message}
                </p>
              )}
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-6">
              Publishing Options
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.status ? "ring-red-300" : "ring-gray-300"} focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  {...register("status")}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700"
                >
                  Tags
                </label>
                <input
                  id="tags"
                  type="text"
                  className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.tags ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                  placeholder="tag1, tag2, tag3"
                  {...register("tags")}
                />
                {errors.tags && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.tags.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Separate tags with commas
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="space-y-2">
              <label
                htmlFor="categories"
                className="block text-sm font-medium text-gray-700"
              >
                Categories <span className="text-red-500">*</span>
              </label>
              <input
                id="categories"
                type="text"
                className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${errors.categories ? "ring-red-300" : "ring-gray-300"} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                placeholder="Category1, Category2"
                {...register("categories")}
              />
              {errors.categories && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.categories.message}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Enter categories separated by commas
              </p>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end border-t border-gray-200 gap-x-4">
            <button
              type="button"
              onClick={() => router.push("/admin/blog")}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
            >
              {isSubmitting ? (
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
                  Saving...
                </>
              ) : blog ? (
                "Update Post"
              ) : (
                "Create Post"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
