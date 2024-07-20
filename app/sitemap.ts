import { MetadataRoute } from "next";

export default async function sitemap() {
  const apiData = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog`, {
    next: {
      revalidate: 3600,
    },
  });
  let data = await apiData.json();
  let updated = data[0].updatedAt;
  data = data.map((article: any) => {
    return {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "daily",
      priority: 0.8,
    };
  });
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/work`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/credentials`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
      lastModified: updated || new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...data,
  ];
}
