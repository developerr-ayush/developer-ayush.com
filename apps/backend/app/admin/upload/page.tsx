"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

export default function UploadPage() {
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      toast.error("Please select an image to upload");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      formData.append("folder", "blog");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to upload image");
      }

      toast.success("Image uploaded successfully!");
      setUploadedImage(data.url);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSelectedImage(null);
    setUploadedImage(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Image Upload</h1>

      <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Upload to Cloudinary</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Image
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg p-2.5"
              disabled={uploading}
            />
          </div>

          {selectedImage && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <div className="relative w-full h-64 border border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={selectedImage}
                  alt="Preview"
                  className="object-contain w-full h-full"
                  width={100}
                  height={100}
                />
              </div>
            </div>
          )}

          <div className="flex space-x-4">
            <button
              onClick={handleUpload}
              disabled={uploading || !selectedImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? "Uploading..." : "Upload Image"}
            </button>

            <button
              onClick={resetForm}
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              Reset
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {uploadedImage && (
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Uploaded Image
              </h3>
              <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-md">
                Image uploaded successfully!
              </div>
              <div className="relative w-full h-64 border border-gray-200 rounded-lg overflow-hidden">
                <Image
                  src={uploadedImage}
                  alt="Uploaded"
                  className="object-contain w-full h-full"
                  width={100}
                  height={100}
                />
              </div>
              <input
                type="text"
                value={uploadedImage}
                readOnly
                className="mt-2 w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                onClick={(e) => {
                  (e.target as HTMLInputElement).select();
                  navigator.clipboard.writeText(uploadedImage);
                  toast.success("URL copied to clipboard!");
                }}
              />
              <p className="mt-1 text-sm text-gray-500">
                Click to copy the image URL
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
