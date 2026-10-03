import { Suspense } from "react";
import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";
import { getImagesMetadata } from "./actions";

// Import the Gallery component directly
import GalleryClient from "./Gallery-client";

const description =
  "A searchable collection of AI-generated images. Click any image to view it full size.";

export const metadata: Metadata = {
  title: "AI Image Gallery",
  description,
  alternates: { canonical: "/gallery" },
  openGraph: {
    type: "website",
    url: "/gallery",
    title: "AI Image Gallery — Ayush Shah",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Image Gallery — Ayush Shah",
    description,
  },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function GalleryPage({ searchParams }: PageProps) {
  // Await the searchParams promise
  const params = await searchParams;
  const searchQuery = params.q || "";

  const queryClient = getQueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["gallery", searchQuery],
    queryFn: ({ pageParam = 1 }) =>
      getImagesMetadata(pageParam as number, 12, searchQuery),
    initialPageParam: 1,
  });

  return (
    <div className="container-x pb-24 pt-12 sm:pt-16 lg:pt-24">
      <header className="grid gap-6 border-b border-line pb-12 md:grid-cols-12">
        <p className="eyebrow md:col-span-3 md:pt-4">
          <span className="text-accent">Gallery</span> — AI images
        </p>
        <div className="md:col-span-9">
          <h1 className="display text-6xl sm:text-7xl lg:text-8xl">
            Made with <em className="text-accent">prompts</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        </div>
      </header>

      <div className="mt-12">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <div key={index} className="skeleton aspect-square rounded-xl" />
                ))}
              </div>
            }
          >
            <GalleryClient searchQuery={searchQuery} />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
