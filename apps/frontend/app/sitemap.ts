import { MetadataRoute } from "next";
import { getBlogPosts } from "./blogData";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const blogData = await getBlogPosts(-1);
  const posts = blogData.data || [];

  // Base URL
  const baseUrl = "https://developer-ayush.com";
  const currentDate = new Date();

  // Get the date for the last blog post if available
  const lastBlogPostDate =
    posts.length > 0 ? new Date(posts[0]?.updatedAt || "") : currentDate;

  // Main pages
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: lastBlogPostDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      // About page
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      // Contact page
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];

  // Dynamic blog post routes
  const blogPostRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Combine all routes
  return [...staticRoutes, ...blogPostRoutes];
}
