"use client";

import { useForm } from "react-hook-form";
import { useState, useEffect, useRef, useCallback } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { createBlog, updateBlog, autoSaveBlog } from "../../../actions/blog";
import { blogSchema } from "../../../schemas";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Image from "next/image";
import { OutputData } from "@editorjs/editorjs";
import { Blog, category, User, Role } from "@prisma/client";
import { useSession } from "next-auth/react";
// Dynamically import the RichTextEditor to avoid SSR issues
const RichTextEditor = dynamic(
  () => import("../../../components/RichTextEditor"),
  { ssr: false }
);

type FormValues = z.infer<typeof blogSchema>;
interface BlogFormProps extends Blog {
  categories: category[];
  author: User;
}

// Define AI blog generation interface
interface AIBlogContent {
  title: string;
  content: OutputData;
  description: string;
  slug: string;
  tags: string;
  categories: string[];
}

export default function BlogForm({ blog }: { blog?: BlogFormProps }) {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const isAdmin = userRole === Role.ADMIN;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [selectedBannerFile, setSelectedBannerFile] = useState<File | null>(
    null
  );
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [uploadingBanner, setUploadingBanner] = useState(false);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [editorContent, setEditorContent] = useState<OutputData | null>(null);
  const [AIGeneratedContent, setAIGeneratedContent] = useState<
    OutputData | null | undefined
  >(null);
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);

  // AI blog generation states
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [blogIdea, setBlogIdea] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);
  const [longForm, setLongForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    "openai" | "groq-llama-4" | "groq-deepseek" | "groq-llama-3.3"
  >("openai");

  // Auto-save related states
  const [autoSaveStatus, setAutoSaveStatus] = useState<
    "idle" | "saving" | "saved" | "error"
  >("idle");
  const [autoSaveMessage, setAutoSaveMessage] = useState<string>("");
  const currentBlogIdRef = useRef<string | undefined>(blog?.id);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      setValue("title", blog.title || "");
      setValue("content", blog.content || "");
      setEditorContent(blog.content ? JSON.parse(blog.content) : null);
      setValue("description", blog.description || "");
      setValue("banner", blog.banner || "");
      setValue("status", blog.status);
      setValue("slug", blog.slug || "");
      setValue("tags", blog.tags || "");
      setValue("categories", blog.categories?.map((cat) => cat.name) || []);
      setValue("date", new Date());

      // If we're editing an existing blog, consider the slug as manually edited
      if (blog.slug) {
        setSlugManuallyEdited(true);
      }
    }
  }, [blog, setValue]);

  // Update banner URL when the watched value changes
  useEffect(() => {
    if (blog && blog.banner && !bannerUrl) {
      setBannerUrl(blog.banner);
    }
  }, [blog, bannerUrl]);

  // Function to handle auto-saving with debounce
  const debouncedAutoSave = useCallback(
    async (formData: Partial<FormValues>) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      autoSaveTimeoutRef.current = setTimeout(async () => {
        // Only auto-save if we have meaningful content to save
        if (!formData.title && !editorContent) return;

        setAutoSaveStatus("saving");
        setAutoSaveMessage("Saving changes...");

        try {
          // Prepare data for auto-save
          const autoSaveData: Partial<FormValues> = {
            ...formData,
            content: editorContent,
          };

          // Call the auto-save action
          const result = await autoSaveBlog(
            autoSaveData,
            currentBlogIdRef.current
          );

          if (result.error) {
            setAutoSaveStatus("error");
            setAutoSaveMessage(`Auto-save failed: ${result.error}`);
            console.error("Auto-save error:", result.error);
          } else {
            // Store the blog ID if this is a new blog
            if (result.blog && !currentBlogIdRef.current) {
              currentBlogIdRef.current = result.blog.id;
            }
            setAutoSaveStatus("saved");
            setAutoSaveMessage("All changes saved");
            setTimeout(() => {
              setAutoSaveStatus("idle");
              setAutoSaveMessage("");
            }, 3000);
          }
        } catch (err) {
          console.error("Auto-save error:", err);
          setAutoSaveStatus("error");
          setAutoSaveMessage("Failed to auto-save");
        }
      }, 1500); // Debounce for 1.5 seconds
    },
    [editorContent]
  );

  // Monitor form changes and trigger auto-save
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      // Get current form values
      const currentValues = {
        title: value.title,
        description: value.description,
        slug: value.slug,
        tags: value.tags,
        categories: Array.isArray(value.categories)
          ? value.categories.filter(
              (item): item is string => typeof item === "string"
            )
          : [],
      };

      // Trigger auto-save when any of these fields change
      if (
        name &&
        ["title", "description", "slug", "tags", "categories"].includes(name)
      ) {
        debouncedAutoSave(currentValues);
      }
    });

    return () => subscription.unsubscribe();
  }, [watch, debouncedAutoSave]);

  // Auto-save when editor content changes
  useEffect(() => {
    if (editorContent) {
      const currentValues = {
        title: watch("title"),
        description: watch("description"),
        slug: watch("slug"),
        tags: watch("tags"),
        categories: Array.isArray(watch("categories"))
          ? watch("categories").filter(
              (item): item is string => typeof item === "string"
            )
          : [],
      };

      debouncedAutoSave({
        ...currentValues,
        content: editorContent,
      });
    }
  }, [editorContent, debouncedAutoSave, watch]);

  // Handle editor content change
  const handleEditorChange = (data: OutputData) => {
    setEditorContent(data);
    // setValue("json_content", data);

    // Also set a string version for the content field
    setValue(
      "content",
      typeof data === "object" ? JSON.stringify(data) : (data as string)
    );

    // Auto-save is triggered via the editorContent useEffect
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
          // If upload failed and we don't have an existing banner
          if (!data.banner) {
            setError("Banner image upload failed. Please try again.");
            setIsSubmitting(false);
            return;
          }
        }
      } else if (!blog?.banner) {
        // If no file is selected and this is a new post or an edit without an existing banner
        setError("Please upload a banner image");
        setIsSubmitting(false);
        return;
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

  // If the user is not an admin and tries to directly publish, set to draft
  useEffect(() => {
    if (!isAdmin && watch("status") === "published") {
      setValue("status", "draft");
    }
  }, [isAdmin, setValue, watch]);

  // Function to generate blog content with AI
  const generateBlogWithAI = async () => {
    if (!blogIdea.trim()) {
      toast.error("Please enter a blog idea or topic");
      return;
    }

    setGeneratingContent(true);
    try {
      // Set up a timeout for the fetch request
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        longForm ? 45000 : 25000
      ); // Longer timeout for long-form content

      // Determine which endpoint to use based on selected model
      const endpoint =
        selectedModel === "openai"
          ? "/api/ai/generate-blog"
          : "/api/ai/generate-blog-groq";

      // Call the appropriate API endpoint with the controller signal
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: blogIdea,
          simplified: !longForm, // Request simplified response unless long-form is selected
          model: selectedModel.startsWith("groq-")
            ? selectedModel.substring(5)
            : undefined, // Extract model name if it's a groq model
        }),
        signal: controller.signal,
      });

      // Clear the timeout
      clearTimeout(timeoutId);

      // Handle response errors
      if (!response.ok) {
        if (response.status === 504 || response.status === 408) {
          throw new Error(
            "Request timed out. Try a simpler blog idea or try again later."
          );
        }
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate content");
      }

      // Validate the generated content
      const generatedContent = data.content as AIBlogContent;

      // First validation: Check if all required fields are present
      if (
        !generatedContent.title ||
        !generatedContent.content ||
        !generatedContent.description
      ) {
        throw new Error("Generated content is missing required fields");
      }

      // Second validation: Check content structure
      if (
        !generatedContent.content.blocks ||
        generatedContent.content.blocks.length === 0
      ) {
        throw new Error("Generated content structure is invalid");
      }

      // Third validation: Check for reasonable content length
      if (
        generatedContent.description.length < 10 ||
        generatedContent.title.length < 3 ||
        generatedContent.content.blocks.length < 2
      ) {
        throw new Error(
          "Generated content appears to be too short or incomplete"
        );
      }

      // If all validations pass, fill the form
      setValue("title", generatedContent.title);

      // Ensure the content has the right structure for EditorJS

      // Set the editor content
      setEditorContent(generatedContent.content);
      setAIGeneratedContent(generatedContent.content);

      // Set the form content field as a JSON string
      setValue("content", generatedContent.content);

      setValue("description", generatedContent.description);
      setValue(
        "slug",
        generatedContent.slug || generateSlug(generatedContent.title)
      );
      setValue("tags", generatedContent.tags || "");
      setValue("categories", generatedContent.categories || []);

      // Close the popup and show success message
      setShowAIPopup(false);
      toast.success("Blog content generated successfully!");

      // Force refresh the editor after a brief delay
    } catch (err) {
      console.error("AI generation error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to generate blog content"
      );
    } finally {
      setGeneratingContent(false);
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

      {/* AI Blog Generation Popup */}
      {showAIPopup && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-indigo-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
                      Generate Blog with AI
                    </h3>
                    <div className="mt-2">
                      <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded text-sm text-blue-800">
                        <p className="font-medium mb-1">✨ How it works:</p>
                        <ol className="list-decimal pl-5 space-y-1">
                          <li>Enter a blog idea or detailed instructions</li>
                          <li>AI will generate complete blog content</li>
                          <li>Review and edit before publishing</li>
                        </ol>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">
                        Be specific about the topic, target audience, tone, and
                        key points you want to cover.
                      </p>
                      <textarea
                        rows={4}
                        className="block w-full rounded-md border-0 py-2 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="E.g., 'Write a comprehensive guide about AI-powered content generation for marketing teams. Include sections on benefits, implementation steps, and best practices.'"
                        value={blogIdea}
                        onChange={(e) => setBlogIdea(e.target.value)}
                      />

                      <div className="mt-4 space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select AI Model
                          </label>
                          <div className="flex flex-wrap gap-4">
                            <div
                              onClick={() => setSelectedModel("openai")}
                              className={`flex items-center p-2 border rounded cursor-pointer ${
                                selectedModel === "openai"
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 mr-2 text-gray-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
                                />
                              </svg>
                              <div>
                                <div className="font-medium">OpenAI</div>
                                <div className="text-xs text-gray-500">
                                  GPT-4 Turbo
                                </div>
                              </div>
                            </div>

                            <div
                              onClick={() => setSelectedModel("groq-llama-4")}
                              className={`flex items-center p-2 border rounded cursor-pointer ${
                                selectedModel === "groq-llama-4"
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 mr-2 text-gray-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a5 5 0 0 1 3.536 8.536 1 1 0 0 1-1.415-1.414A3 3 0 0 0 15 12a3 3 0 0 0-3-3 3 3 0 0 0-2.121.879A3 3 0 0 0 9 12a3 3 0 0 0 .879 2.121 1 1 0 0 1-1.415 1.415A5 5 0 0 1 12 7z"
                                />
                              </svg>
                              <div>
                                <div className="font-medium">Llama 4</div>
                                <div className="text-xs text-gray-500">
                                  meta-llama/llama-4-scout-17b
                                </div>
                              </div>
                            </div>

                            <div
                              onClick={() => setSelectedModel("groq-deepseek")}
                              className={`flex items-center p-2 border rounded cursor-pointer ${
                                selectedModel === "groq-deepseek"
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 mr-2 text-gray-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a5 5 0 0 1 3.536 8.536 1 1 0 0 1-1.415-1.414A3 3 0 0 0 15 12a3 3 0 0 0-3-3 3 3 0 0 0-2.121.879A3 3 0 0 0 9 12a3 3 0 0 0 .879 2.121 1 1 0 0 1-1.415 1.415A5 5 0 0 1 12 7z"
                                />
                              </svg>
                              <div>
                                <div className="font-medium">DeepSeek</div>
                                <div className="text-xs text-gray-500">
                                  deepseek-r1-distill-qwen-32b
                                </div>
                              </div>
                            </div>

                            <div
                              onClick={() => setSelectedModel("groq-llama-3.3")}
                              className={`flex items-center p-2 border rounded cursor-pointer ${
                                selectedModel === "groq-llama-3.3"
                                  ? "border-indigo-500 bg-indigo-50"
                                  : "border-gray-300 hover:border-gray-400"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                className="w-5 h-5 mr-2 text-gray-700"
                              >
                                <path
                                  fill="currentColor"
                                  d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2zm0 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 3a5 5 0 0 1 3.536 8.536 1 1 0 0 1-1.415-1.414A3 3 0 0 0 15 12a3 3 0 0 0-3-3 3 3 0 0 0-2.121.879A3 3 0 0 0 9 12a3 3 0 0 0 .879 2.121 1 1 0 0 1-1.415 1.415A5 5 0 0 1 12 7z"
                                />
                              </svg>
                              <div>
                                <div className="font-medium">Llama 3.3</div>
                                <div className="text-xs text-gray-500">
                                  llama-3.3-70b-specdec
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {selectedModel === "openai"
                              ? "OpenAI typically provides more structured content."
                              : selectedModel === "groq-llama-4"
                                ? "Llama 4 offers balanced quality and speed."
                                : selectedModel === "groq-deepseek"
                                  ? "DeepSeek is optimized for technical content."
                                  : "Llama 3.3 is designed for long-form content."}
                          </p>
                        </div>

                        <div className="flex items-center">
                          <input
                            id="longForm"
                            name="longForm"
                            type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            checked={longForm}
                            onChange={(e) => setLongForm(e.target.checked)}
                          />
                          <label
                            htmlFor="longForm"
                            className="ml-2 block text-sm text-gray-700"
                          >
                            Generate long-form content (takes longer)
                          </label>
                        </div>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        The AI will generate title, content, description, tags,
                        and categories. You'll still need to add a banner image.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  disabled={generatingContent || !blogIdea.trim()}
                  onClick={generateBlogWithAI}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generatingContent ? (
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
                      Generating...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAIPopup(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                Basic Information
              </h3>
              <button
                type="button"
                onClick={() => setShowAIPopup(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Generate with AI
              </button>
            </div>
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
                <div className="w-full">
                  <input
                    ref={bannerFileInputRef}
                    type="file"
                    accept="image/*"
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2"
                    onChange={handleBannerFileChange}
                    disabled={isSubmitting}
                  />
                  {errors.banner && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.banner.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Upload an image for your blog banner. The image will be
                    uploaded when you click{" "}
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
                initialValue={blog?.content ? JSON.parse(blog.content) : null}
                onChange={handleEditorChange}
                AIGeneratedContent={AIGeneratedContent}
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
                  {isAdmin && <option value="published">Published</option>}
                  {isAdmin && <option value="archived">Archived</option>}
                </select>
                {!isAdmin && (
                  <p className="text-xs text-amber-600 mt-1">
                    As a regular user, your posts will need approval before they
                    can be published.
                  </p>
                )}
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
                    ? blog?.categories.map((cat) => cat).join(", ")
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

          {/* Auto-save status indicator */}
          <div
            className={`text-sm ${
              autoSaveStatus === "saving"
                ? "text-amber-600"
                : autoSaveStatus === "saved"
                  ? "text-green-600"
                  : autoSaveStatus === "error"
                    ? "text-red-600"
                    : "text-gray-400"
            }`}
          >
            {autoSaveMessage}
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
