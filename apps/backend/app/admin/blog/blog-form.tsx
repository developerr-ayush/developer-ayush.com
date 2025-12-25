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

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      // Manually trigger the change handler logic
      handleFileSelection(file);
    }
  };

  // Separated file handling logic for reuse
  const handleFileSelection = (file: File) => {
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
  }

  // AI blog generation states
  const [showAIPopup, setShowAIPopup] = useState(false);
  const [blogIdea, setBlogIdea] = useState("");
  const [generatingContent, setGeneratingContent] = useState(false);
  const [generateImage, setGenerateImage] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const [longForm, setLongForm] = useState(false);
  const [selectedModel, setSelectedModel] = useState<
    "gemini"
  >("gemini");

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
    handleFileSelection(file);
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
      // 1. Submit the blog job
      const response = await fetch("/api/ai/generate-blog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: blogIdea,
          simplified: !longForm,
          model: selectedModel === "gemini" ? undefined : selectedModel,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to start generation: ${response.status}`);
      }

      const data = await response.json();
      if (!data.success || !data.jobId) {
        throw new Error(data.error || "Failed to start generation job");
      }

      const jobId = data.jobId;
      toast.info("AI Generation started... please wait.");

      // 2. Poll for blog status
      const pollInterval = setInterval(async () => {
        try {
          const statusRes = await fetch(`/api/ai/job/${jobId}`);
          if (!statusRes.ok) return;

          const statusData = await statusRes.json();

          if (statusData.status === "SUCCESS") {
            clearInterval(pollInterval);
            handleGenerationSuccess(statusData.result);
          } else if (statusData.status === "FAILED") {
            clearInterval(pollInterval);
            setGeneratingContent(false);
            toast.error(`Generation failed: ${statusData.error || "Unknown error"}`);
          }
        } catch (e) {
          console.error("Polling error:", e);
        }
      }, 5000);

    } catch (err) {
      console.error("AI generation error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to generate blog content"
      );
      setGeneratingContent(false);
    }
  };

  const handleGenerationSuccess = (generatedContent: any) => {

    // Validate the generated content
    let contentObj = generatedContent;
    if (typeof generatedContent === 'string') {
      try {
        contentObj = JSON.parse(generatedContent);
      } catch (e) {
        console.error("Failed to parse content result", e);
      }
    }

    if (
      !contentObj.title ||
      !contentObj.content
    ) {
      setGeneratingContent(false);
      toast.error("Generated content is missing required fields");
      return;
    }

    // Fill the form
    setValue("title", contentObj.title);
    setEditorContent(contentObj.content);
    setAIGeneratedContent(contentObj.content);
    setValue("content", contentObj.content); // Store as object, let submit handler stringify
    setValue("description", contentObj.description || "");

    if (contentObj.slug) {
      setValue("slug", contentObj.slug);
    } else {
      setValue("slug", generateSlug(contentObj.title));
    }

    setValue("tags", contentObj.tags || "");
    setValue("categories", contentObj.categories || []);

    setShowAIPopup(false);
    toast.success("Blog content generated successfully!");

    // Trigger image generation if requested (Sequential)
    if (generateImage) {
      setGeneratingContent(false); // Done with blog part
      // Use title + description for better image context
      const imagePrompt = `A blog banner image for an article titled "${contentObj.title}". Summary: ${contentObj.description || contentObj.title}`;
      generateImageOnly(imagePrompt);
    } else {
      setGeneratingContent(false);
    }
  };

  // Standalone Image Generator
  const [imagePrompt, setImagePrompt] = useState("");

  const generateImageOnly = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || imagePrompt || watch("title"); // Fallback to title if manual prompt not provided.

    if (!promptToUse) {
      toast.error("Please enter a prompt or ensure blog title is filled.");
      return;
    }

    setGeneratingImage(true);
    toast.info("Generating banner image...");

    try {
      const res = await fetch("/api/ai/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptToUse }),
      });

      const imageData = await res.json();

      if (imageData.success && imageData.jobId) {
        // Poll for image status
        const imagePollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/ai/job/${imageData.jobId}`);
            if (!statusRes.ok) return;

            const statusData = await statusRes.json();
            if (statusData.status === "SUCCESS") {
              clearInterval(imagePollInterval);
              setGeneratingImage(false);
              if (statusData.result) {
                let result = statusData.result;
                // If api returns string for some reason, parse it. If it's already object (expected), use it.
                if (typeof result === "string") {
                  try {
                    result = JSON.parse(result);
                  } catch (e) {
                    console.error("Failed to parse image result", e);
                  }
                }

                if (result.imageUrl) {
                  setBannerUrl(result.imageUrl);
                  // Also set the file input to empty if we used an upload before? 
                  // Actually better to just set the hidden value. 
                  // We might need to handle form submission gracefully if it expects a file object.
                  // But since we have bannerUrl, we likely prioritize that in onSubmit.
                  toast.success("Banner image generated!");
                }
              }
            } else if (statusData.status === "FAILED") {
              clearInterval(imagePollInterval);
              setGeneratingImage(false);
              toast.error(`Image generation failed: ${statusData.error}`);
            }
          } catch (e) {
            console.error("Image polling error:", e);
          }
        }, 5000);
      } else {
        throw new Error(imageData.error || "Failed to start image job");
      }
    } catch (err: any) {
      console.error("Image gen error:", err);
      setGeneratingImage(false);
      toast.error(err.message || "Failed to generate image");
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
      {
        showAIPopup && (
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
                                onClick={() => setSelectedModel("gemini")}
                                className={`flex items-center p-2 border rounded cursor-pointer ${selectedModel === "gemini"
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
                                    d="M15.5 18.15a2.4 2.4 0 0 1-2.3 2.37H5.77a2.4 2.4 0 0 1-2.37-2.3V10.7a2.4 2.4 0 0 1 2.3-2.37h7.43a2.4 2.4 0 0 1 2.37 2.3v7.43ZM15.41 5.23a2.4 2.4 0 0 1-2.3 2.37H5.68a2.4 2.4 0 0 1-2.37-2.3V5.15a2.4 2.4 0 0 1 2.3-2.37h7.43a2.4 2.4 0 0 1 2.37 2.3v.08ZM20.23 13.33a2.4 2.4 0 0 1-2.3 2.37h-.16a2.4 2.4 0 0 1-2.37-2.3v-.16a2.4 2.4 0 0 1 2.3-2.37h.16a2.4 2.4 0 0 1 2.37 2.3v.16ZM20.32 5.23a2.4 2.4 0 0 1-2.3 2.37h-.16a2.4 2.4 0 0 1-2.37-2.3V5.15a2.4 2.4 0 0 1 2.3-2.37h.16a2.4 2.4 0 0 1 2.37 2.3v.08Z"
                                  />
                                </svg>
                                <div>
                                  <div className="font-medium">Gemini</div>
                                  <div className="text-xs text-gray-500">
                                    Default (3.0 Pro Preview)
                                  </div>
                                </div>
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              Using Gemini for best performance and accuracy.
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

                          <div className="flex items-center">
                            <input
                              id="generateImage"
                              name="generateImage"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={generateImage}
                              onChange={(e) => setGenerateImage(e.target.checked)}
                            />
                            <label
                              htmlFor="generateImage"
                              className="ml-2 block text-sm text-gray-700"
                            >
                              Generate Banner Image with AI
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
        )
      }

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
                {generatingImage && <span className="text-xs text-indigo-600 ml-2 animate-pulse">Generating image...</span>}
              </label>
              <div className="flex flex-col gap-4">
                <div
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors ${isDragging
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300 hover:border-indigo-400"
                    }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="banner-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                      >
                        <span className="px-1">Upload a file</span>
                        <input
                          id="banner-upload"
                          ref={bannerFileInputRef}
                          name="banner"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={handleBannerFileChange}
                          aria-label="Upload banner image"
                          disabled={isSubmitting}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
                {errors.banner && (
                  <p className="mt-1 text-sm text-red-600" role="alert">
                    {errors.banner.message}
                  </p>
                )}

                {/* Standalone Image Generator */}
                <div className="mt-4 border-t border-gray-200 pt-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">OR Generate with AI</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Describe the image (or leave empty to use title)"
                      value={imagePrompt}
                      onChange={(e) => setImagePrompt(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => generateImageOnly()}
                      disabled={generatingImage}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${generatingImage ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {generatingImage ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : 'Generate'}
                    </button>
                  </div>
                </div>
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
          className={`text-sm ${autoSaveStatus === "saving"
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
      </form>
    </div>
  );
}
