import { MetadataRoute } from "next";
import { getBlogPosts } from "./blogData";
import { SITE_URL } from "./data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all blog posts
  const blogData = await getBlogPosts(-1);
  const posts = blogData.data || [];

  const currentDate = new Date();

  // Date of the most recently updated post, if any
  const lastBlogPostDate = posts.reduce<Date | undefined>((latest, post) => {
    const d = new Date(post.updatedAt);
    return !latest || d > latest ? d : latest;
  }, undefined);

  // Main pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: lastBlogPostDate ?? currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/social-media`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Dynamic blog post routes
  const blogPostRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
    // sitemap image URLs must be absolute (CMS banners are Cloudinary URLs)
    images: post.banner?.startsWith("http") ? [post.banner] : undefined,
  }));

  return [...staticRoutes, ...blogPostRoutes];
}
