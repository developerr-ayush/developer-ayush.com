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

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch("https://admin.developer-ayush.com/api/blog?p=2", {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (!res.ok) throw new Error("Failed to fetch blog posts");
    return await res.json();
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  try {
    const posts = await getBlogPosts();
    const post = posts.find((post) => post.slug === slug);
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
    const res = await fetch(
      `https://admin.developer-ayush.com/api/blog/${slug}`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );
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
