import { Suspense } from "react";
import { Metadata } from "next";

// Import the Gallery component directly
import GalleryClient from "./Gallery-client";

export const metadata: Metadata = {
  title: "AI Image Gallery",
  description: "Browse our collection of AI-generated images",
};

interface PageProps {
  searchParams: { q?: string };
}

export default async function GalleryPage({ searchParams }: PageProps) {
  // Pass the search query to the client component
  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Image Gallery</h1>
        <p className="mt-2 text-foreground/80">
          Browse through our collection of AI-generated images
        </p>
      </div>

      <Suspense
        fallback={
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg bg-gray-200 animate-pulse"
              />
            ))}
          </div>
        }
      >
        <GalleryClient searchQuery={searchParams.q || ""} />
      </Suspense>
    </div>
  );
}
