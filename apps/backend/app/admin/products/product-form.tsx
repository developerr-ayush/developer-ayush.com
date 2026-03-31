"use client";

import { useState, useTransition, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createProduct, updateProduct } from "../../../actions/products";

interface ProductFormProps {
  product?: {
    id: string;
    name: string;
    slug: string;
    shortDescription?: string | null;
    description?: string | null;
    price?: number | null;
    salePrice?: number | null;
    image?: string | null;
    affiliateLink?: string | null;
    amazonLink?: string | null;
    flipkartLink?: string | null;
    category?: string | null;
    brand?: string | null;
    rating?: number | null;
    instagramPost?: string | null;
    tags?: string | null;
    status: string;
    featured: boolean;
  };
}

export default function ProductForm({ product }: ProductFormProps) {
  const isEditing = !!product;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fields
  const [name, setName] = useState(product?.name || "");
  const [slug, setSlug] = useState(product?.slug || "");
  const [shortDescription, setShortDescription] = useState(product?.shortDescription || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price?.toString() || "");
  const [salePrice, setSalePrice] = useState(product?.salePrice?.toString() || "");
  const [affiliateLink, setAffiliateLink] = useState(product?.affiliateLink || "");
  const [amazonLink, setAmazonLink] = useState(product?.amazonLink || "");
  const [flipkartLink, setFlipkartLink] = useState(product?.flipkartLink || "");
  const [category, setCategory] = useState(product?.category || "");
  const [brand, setBrand] = useState(product?.brand || "");
  const [rating, setRating] = useState(product?.rating?.toString() || "");
  const [instagramPost, setInstagramPost] = useState(product?.instagramPost || "");
  const [tags, setTags] = useState(product?.tags || "");
  const [status, setStatus] = useState(product?.status || "draft");
  const [featured, setFeatured] = useState(product?.featured || false);

  // Image upload state
  const [image, setImage] = useState(product?.image || "");
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image || null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const generateSlug = (val: string) =>
    val.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) setSlug(generateSlug(val));
  };

  // File selection handler
  const handleFileSelection = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
    setError(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelection(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelection(file);
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "products");

    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Upload failed");
    return data.url as string;
  };

  const handleRemoveImage = () => {
    setImage("");
    setImagePreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    startTransition(async () => {
      let finalImageUrl = image;

      // Upload new image if one was selected
      if (selectedFile) {
        try {
          setUploadingImage(true);
          finalImageUrl = await uploadImageToCloudinary(selectedFile);
          setImage(finalImageUrl);
        } catch {
          setError("Image upload failed. Please try again.");
          setUploadingImage(false);
          return;
        } finally {
          setUploadingImage(false);
        }
      }

      const values = {
        name,
        slug,
        shortDescription: shortDescription || undefined,
        description: description || undefined,
        price: price ? parseFloat(price) : undefined,
        salePrice: salePrice ? parseFloat(salePrice) : undefined,
        image: finalImageUrl || undefined,
        affiliateLink: affiliateLink || undefined,
        amazonLink: amazonLink || undefined,
        flipkartLink: flipkartLink || undefined,
        category: category || undefined,
        brand: brand || undefined,
        rating: rating ? parseFloat(rating) : undefined,
        instagramPost: instagramPost || undefined,
        tags: tags || undefined,
        status: status as "draft" | "published" | "archived",
        featured,
      };

      const result = isEditing
        ? await updateProduct(values, product.id)
        : await createProduct(values);

      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(result.success || "Saved");
        if (!isEditing) router.push("/admin/products");
      }
    });
  };

  const inputClass =
    "mt-1 block w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-slate-600 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-400 uppercase tracking-wide";
  const isLoading = isPending || uploadingImage;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3 text-sm text-rose-300">
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3 text-sm text-emerald-300">
          {success}
        </div>
      )}

      {/* Section: Basic Info */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className={labelClass}>Product Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className={inputClass}
              placeholder="e.g. Sony WH-1000XM5"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Slug *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={inputClass}
              placeholder="sony-wh-1000xm5"
              required
            />
          </div>
          <div>
            <label className={labelClass}>Brand</label>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className={inputClass}
              placeholder="Sony"
            />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClass}
              placeholder="Audio, Laptops, Smartphones..."
            />
          </div>
        </div>

        <div className="mt-5">
          <label className={labelClass}>Short Description (shown on cards)</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            rows={2}
            className={inputClass}
            placeholder="Best noise-cancelling headphones with 30hr battery"
          />
        </div>

        <div className="mt-5">
          <label className={labelClass}>Full Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            className={inputClass}
            placeholder="Detailed product description..."
          />
        </div>
      </div>

      {/* Section: Main Image */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Product Image
        </h2>

        {imagePreview ? (
          <div className="flex items-start gap-6">
            <div className="relative w-40 h-40 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex-shrink-0">
              <Image src={imagePreview} alt="Product preview" fill className="object-contain p-2" />
            </div>
            <div className="flex flex-col gap-2 justify-center">
              <p className="text-sm font-medium text-slate-300">
                {selectedFile ? selectedFile.name : "Current image"}
              </p>
              {selectedFile && (
                <p className="text-xs text-slate-500">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB — will upload on save
                </p>
              )}
              <div className="flex gap-2 mt-1">
                <button type="button" onClick={() => fileInputRef.current?.click()}
                  className="text-xs px-3 py-1.5 border border-white/10 rounded-lg text-slate-400 hover:bg-white/5 transition-colors">
                  Change image
                </button>
                <button type="button" onClick={handleRemoveImage}
                  className="text-xs px-3 py-1.5 border border-rose-500/30 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-blue-500/50 bg-blue-500/5"
                : "border-white/10 hover:border-blue-500/30 hover:bg-white/[0.02]"
            }`}
          >
            <svg className="mx-auto w-10 h-10 text-slate-600 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-slate-400 font-medium">
              Drag &amp; drop an image here, or{" "}
              <span className="text-blue-400">browse</span>
            </p>
            <p className="text-xs text-slate-600 mt-1">PNG, JPG, WEBP up to 10MB</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
        />

        {/* Also allow pasting a URL directly */}
        <div className="mt-3">
          <label className="block text-xs text-slate-500 mb-1">
            Or paste an image URL directly
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => {
              setImage(e.target.value);
              setImagePreview(e.target.value || null);
              setSelectedFile(null);
            }}
            className={inputClass}
            placeholder="https://..."
          />
        </div>
      </div>

      {/* Section: Pricing */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Pricing
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div>
            <label className={labelClass}>MRP / Original Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className={inputClass}
              placeholder="35000"
            />
          </div>
          <div>
            <label className={labelClass}>Affiliate / Sale Price (₹)</label>
            <input
              type="number"
              step="0.01"
              value={salePrice}
              onChange={(e) => setSalePrice(e.target.value)}
              className={inputClass}
              placeholder="28000"
            />
          </div>
          <div>
            <label className={labelClass}>Rating (0–5)</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              className={inputClass}
              placeholder="4.5"
            />
          </div>
        </div>
      </div>

      {/* Section: Affiliate Links */}
      <div>
        <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Affiliate Links
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Amazon Affiliate Link</label>
            <input
              type="url"
              value={amazonLink}
              onChange={(e) => setAmazonLink(e.target.value)}
              className={inputClass}
              placeholder="https://amzn.to/..."
            />
          </div>
          <div>
            <label className={labelClass}>Flipkart Affiliate Link</label>
            <input
              type="url"
              value={flipkartLink}
              onChange={(e) => setFlipkartLink(e.target.value)}
              className={inputClass}
              placeholder="https://fktr.in/..."
            />
          </div>
          <div>
            <label className={labelClass}>Generic Affiliate Link</label>
            <input
              type="url"
              value={affiliateLink}
              onChange={(e) => setAffiliateLink(e.target.value)}
              className={inputClass}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Section: Social & Meta */}
      <div>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
          Social & Meta
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Instagram Post URL</label>
            <input
              type="url"
              value={instagramPost}
              onChange={(e) => setInstagramPost(e.target.value)}
              className={inputClass}
              placeholder="https://www.instagram.com/p/..."
            />
          </div>
          <div>
            <label className={labelClass}>Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className={inputClass}
              placeholder="headphones, wireless, noise-cancelling"
            />
          </div>
        </div>
      </div>

      {/* Section: Publish Settings */}
      <div className="bg-white/[0.03] border border-white/8 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-5">
        <div className="flex-1">
          <label className={labelClass}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className={inputClass}>
            <option value="draft" className="bg-slate-900">Draft</option>
            <option value="published" className="bg-slate-900">Published</option>
            <option value="archived" className="bg-slate-900">Archived</option>
          </select>
        </div>
        <div className="flex items-center gap-3 sm:pt-6">
          <input type="checkbox" id="featured" checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="h-4 w-4 rounded border-white/20 bg-white/5 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="featured" className="text-sm font-medium text-slate-300">
            Featured Product
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4 pt-2">
        <button type="submit" disabled={isLoading}
          className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-semibold rounded-xl text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition-all active:scale-[0.98]">
          {uploadingImage ? "Uploading image..." : isPending ? "Saving..." : isEditing ? "Update Product" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.push("/admin/products")}
          className="px-6 py-2.5 border border-white/10 text-sm font-semibold rounded-xl text-slate-400 hover:text-white hover:border-white/20 transition-all">
          Cancel
        </button>
      </div>
    </form>
  );
}
