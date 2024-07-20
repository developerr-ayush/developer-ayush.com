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
    };
  });
  return [
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/about`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/work`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/contact`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/credentials`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/services`,
    },
    {
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/blog`,
    },
    ...data,
  ];
}
