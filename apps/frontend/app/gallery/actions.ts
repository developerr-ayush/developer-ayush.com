"use server";

export type GalleryData = {
  images: string[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export async function getImagesMetadata(
  page: number = 1,
  limit: number = 12,
  searchQuery: string = ""
): Promise<GalleryData> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "";
    let url = `${baseUrl}/api/gallery?page=${page}&limit=${limit}`;

    // Add search query if provided
    if (searchQuery) {
      url += `&q=${encodeURIComponent(searchQuery)}`;
    }

    const response = await fetch(url, {
      cache: page === 1 ? "force-cache" : "no-store", // Cache first page, but not subsequent pages
    });

    if (!response.ok) {
      throw new Error("Failed to fetch gallery images");
    }

    const data = await response.json();
    return data as GalleryData;
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    // Return empty data on error
    return {
      images: [],
      total: 0,
      page,
      limit,
      hasMore: false,
    };
  }
}
