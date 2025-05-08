declare module "./actions" {
  export type GalleryData = {
    images: string[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };

  export function getImagesMetadata(
    page?: number,
    limit?: number,
    searchQuery?: string
  ): Promise<GalleryData>;
}
