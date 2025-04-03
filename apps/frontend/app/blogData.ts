const BASEURL =
  process.env.NEXT_PUBLIC_BASE_URL_ADMIN || "https://admin.developer-ayush.com";
export type Category = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  showInHome: boolean;
};

export type Author = {
  id: string;
  name: string;
  email?: string;
  role?: string;
};

export type BlogPost = {
  id: string;
  updatedAt: string;
  title: string;
  banner: string;
  description: string;
  categories: Category[];
  slug: string;
  views: number;
  status: string;
  author: Author;
};

export type BlogPostDetail = {
  id: string;
  title: string;
  content: string;
  json_content?: any;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  status: string;
  banner: string;
  description: string;
  slug: string;
  views: number;
  tags: string;
  author: {
    name: string;
  };
};

export type PaginationResponse<T> = {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
};

export async function getBlogPosts(
  page: number = 1
): Promise<PaginationResponse<BlogPost>> {
  try {
    console.log(`Fetching blog posts for page ${page}`);

    // Different fetch options based on environment
    const options: RequestInit & { next?: { revalidate: number } } = {
      next: { revalidate: 3600 }, // Revalidate every hour for SSR
    };

    // Only add cache: 'no-store' on the client
    if (typeof window !== "undefined") {
      options.cache = "no-store" as RequestCache;
    }

    // Construct URL based on page value
    const baseUrl = BASEURL + "/api/blog";
    const url = page === -1 ? baseUrl : `${baseUrl}?p=${page}`;

    const res = await fetch(url, options);

    if (!res.ok) {
      console.error(`API response not OK: ${res.status} ${res.statusText}`);
      throw new Error(
        `Failed to fetch blog posts: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log(
      `API data retrieved for page ${page}:`,
      typeof data,
      Array.isArray(data) ? data.length : "not array"
    );

    // If the API returns a flat array instead of pagination data,
    // we'll wrap it in our pagination structure
    if (Array.isArray(data)) {
      const postsPerPage = 10; // Assuming 10 posts per page
      const totalPages = page === 1 && data.length < postsPerPage ? 1 : 2;

      return {
        data,
        meta: {
          currentPage: page,
          totalPages: totalPages,
          totalItems: data.length * totalPages, // Estimate total items
          itemsPerPage: postsPerPage,
        },
      };
    }

    return data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return {
      data: [],
      meta: {
        currentPage: page,
        totalPages: 0,
        totalItems: 0,
        itemsPerPage: 0,
      },
    };
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const response = await getBlogPosts(1);
    const post = response.data.find((post) => post.slug === slug);
    return post || null;
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

export async function getBlogPostDetail(
  slug: string
): Promise<BlogPostDetail | null> {
  try {
    console.log(
      `Fetching blog post detail for slug ${BASEURL}/api/blog/${slug}`
    );
    const res = await fetch(`${BASEURL}/api/blog/${slug}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) throw new Error("Failed to fetch blog post detail");
    return await res.json();
  } catch (error) {
    console.error("Error fetching blog post detail:", error);
    return null;
  }
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
