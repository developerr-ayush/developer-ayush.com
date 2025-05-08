// Define the GalleryData type
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

// Define the Gallery component type
declare module "./Gallery" {
  import { FunctionComponent } from "react";
  import { GalleryData } from "./actions";

  interface GalleryProps {
    initialData: GalleryData;
  }

  const Gallery: FunctionComponent<GalleryProps>;
  export default Gallery;
}

// Define the Gallery-client component type
declare module "./Gallery-client" {
  import { FunctionComponent } from "react";

  interface GalleryClientProps {
    searchQuery: string;
  }

  const GalleryClient: FunctionComponent<GalleryClientProps>;
  export default GalleryClient;
}
