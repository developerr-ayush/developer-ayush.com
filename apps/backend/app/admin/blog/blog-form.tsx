"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useRef } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog } from "../../../actions/blog";
import { blogSchema } from "../../../schemas";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Image from "next/image";
// Dynamically import the RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("../../../components/RichTextEditor"),
  { ssr: false }
);

type FormValues = z.infer<typeof blogSchema>;

interface BlogCategory {
  name: string;
}

interface BlogData {
  id: string;
  title: string;
  content: any; // Using any here just for this specific field to avoid type issues
  description: string;
  banner: string;
  status: "draft" | "published" | "archived";
  slug: string;
  tags: string;
  categories?: BlogCategory[];
}

export default function BlogForm({ blog }: { blog?: BlogData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState<any>(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: "",
      content: null,
      description: "",
      banner: "",
      status: "draft",
      slug: "",
      tags: "",
      categories: [],
      date: new Date(),
    },
  });

  // Watch title and banner fields
  const watchedTitle = watch("title");
  const watchedBanner = watch("banner");

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Remove consecutive hyphens
      .trim(); // Trim leading/trailing whitespace
  };

  // Auto-generate slug from title when title changes (only if slug hasn't been manually edited)
  useEffect(() => {
    if (watchedTitle && !slugManuallyEdited) {
      setValue("slug", generateSlug(watchedTitle));
    }
  }, [watchedTitle, setValue, slugManuallyEdited]);

  useEffect(() => {
    if (blog) {
      setValue("title", blog.title);
      setValue("content", blog.content || "");
      setEditorContent(blog.content || "");
      setValue("description", blog.description);
      setValue("banner", blog.banner);
      setValue("status", blog.status);
      setValue("slug", blog.slug);
      setValue("tags", blog.tags);
      setValue(
        "categories",
        blog.categories?.map((cat: { name: string }) => cat.name) || []
      );
      setValue("date", new Date());

      // If we're editing an existing blog, consider the slug as manually edited
      if (blog.slug) {
        setSlugManuallyEdited(true);
      }
    }
  }, [blog, setValue]);

  // Update banner URL when the watched value changes
  useEffect(() => {
    if (watchedBanner && !selectedBannerFile) {
      setBannerUrl(watchedBanner);
    }
  }, [watchedBanner, selectedBannerFile]);

  // Handle editor content change
  const handleEditorChange = (data: { [key: string]: [] }) => {
    setEditorContent(data);
    setValue("json_content", data);

    // Also set a string version for the content field
    setValue(
      "content",
      typeof data === "object" ? JSON.stringify(data) : (data as string)
    );
  };

  // Function to clear banner file input
  const clearBannerFileInput = () => {
    if (bannerFileInputRef.current) {
      bannerFileInputRef.current.value = "";
    }
  };

  // Handle banner image change
  const handleBannerFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedBannerFile(null);
      setBannerPreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      clearBannerFileInput();
      return;
    }

    // Store the selected file
    setSelectedBannerFile(file);

    // Create a preview
    const reader = new FileReader();
    reader.onload = () => {
      setBannerPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Upload the banner image to Cloudinary
  const uploadBannerToCloudinary = async (): Promise<string | null> => {
    if (!selectedBannerFile) return null;

    try {
      setUploadingBanner(true);

      const formData = new FormData();
      formData.append("file", selectedBannerFile);
      formData.append("folder", "blog-banners");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed with status: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      toast.success("Banner image uploaded successfully!");
      return data.url;
    } catch (err) {
      console.error("Banner upload error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to upload banner image"
      );
      return null;
    } finally {
      setUploadingBanner(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload banner image if one is selected
      if (selectedBannerFile) {
        const uploadedUrl = await uploadBannerToCloudinary();
        if (uploadedUrl) {
          data.banner = uploadedUrl;
        } else {
          // If upload failed, use the existing banner URL if available
          if (!data.banner) {
            setError(
              "Banner image upload failed. Please try again or provide a URL."
            );
            setIsSubmitting(false);
            return;
          }
        }
      }

      // Set the editor content to the form values
      data.json_content = editorContent;
      data.content =
        typeof editorContent === "object"
          ? JSON.stringify(editorContent)
          : editorContent;

      // Process categories - if it's a string, split by commas and trim
      if (typeof data.categories === "string") {
        data.categories = (data.categories as unknown as string)
          .split(",")
          .map((cat) => cat.trim())
          .filter((cat) => cat.length > 0);
      }

      // Submit the blog post
      if (blog) {
        const result = await updateBlog(data, blog.id);
        if (result.error) {
          setError(result.error);
        } else {
          toast.success("Blog post updated successfully!");
          router.push("/admin/blog");
          router.refresh();
        }
      } else {
        const result = await createBlog(data);
        if (result.error) {
          setError(result.error);
        } else {
          toast.success("Blog post created successfully!");
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
                  onInput={() => setSlugManuallyEdited(true)}
                  {...register("slug")}
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.slug.message}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  Auto-generated from title. You can edit manually.
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
                Banner Image <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-4">
                <div className="flex-grow">
                  <input
                    id="banner"
                    type="text"
                    className={`block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ${
                      errors.banner ? "ring-red-300" : "ring-gray-300"
                    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6`}
                    placeholder="https://example.com/image.jpg"
                    {...register("banner")}
                  />
                  {errors.banner && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.banner.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a URL or upload a new image below
                  </p>
                </div>

                <div className="w-full">
                  <input
                    ref={bannerFileInputRef}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
                    onChange={handleBannerFileChange}
                    disabled={isSubmitting}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Selected image will be uploaded when you click{" "}
                    {blog ? "Update Post" : "Create Post"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {bannerUrl && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Current Banner:
                  </p>
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={bannerUrl}
                      alt="Current banner"
                      className="object-cover w-full h-full"
                      onError={() => setBannerUrl("")}
                      width={1000}
                      height={1000}
                    />
                  </div>
                </div>
              )}

              {bannerPreview && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    New Banner Preview:
                  </p>
                  <div className="aspect-w-16 aspect-h-9 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={bannerPreview}
                      alt="New banner preview"
                      className="object-cover w-full h-full"
                      width={1000}
                      height={1000}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    This image will be uploaded when form is submitted
                  </p>
                </div>
              )}
            </div>
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
              <RichTextEditor
                initialValue={blog?.content}
                onChange={handleEditorChange}
              />
              {errors.content && typeof errors.content.message === "string" && (
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
                defaultValue={
                  Array.isArray(blog?.categories)
                    ? blog?.categories
                        .map((cat: { name: string }) => cat.name)
                        .join(", ")
                    : ""
                }
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
              disabled={isSubmitting || uploadingBanner}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center"
            >
              {isSubmitting || uploadingBanner ? (
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
                  {uploadingBanner ? "Uploading Image..." : "Saving..."}
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
