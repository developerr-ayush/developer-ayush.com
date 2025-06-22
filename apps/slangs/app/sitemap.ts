import { MetadataRoute } from "next";
import { getSlangTerms, getCategories } from "@/lib/slang-api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://slang.developer-ayush.com";

  // Get categories for category pages
  const categories = await getCategories();

  // Get some popular slang terms
  const popularSlangs = await getSlangTerms({
    featured: true,
    limit: 50,
  });

  // Base pages
  const routes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  // Category pages
  categories.forEach((category) => {
    routes.push({
      url: `${baseUrl}?category=${encodeURIComponent(category)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.8,
    });
  });

  // Popular slang term pages (using search parameter)
  if (popularSlangs.success) {
    popularSlangs.data.forEach((slang) => {
      routes.push({
        url: `${baseUrl}?search=${encodeURIComponent(slang.term)}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.6,
      });
    });
  }

  return routes;
}
