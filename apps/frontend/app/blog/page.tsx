import { getBlogPosts, BlogPost } from "../blogData";
import BlogList from "../components/BlogList";
import Script from "next/script";
import { Metadata } from "next";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../get-query-client";

export const metadata: Metadata = {
  title: "Blog | Frontend Development, UI/UX, and Web Technologies",
  description:
    "Thoughts, technical guides, and insights about web development, programming, and my journey as a developer.",
  alternates: {
    canonical: "https://developer-ayush.com/blog",
  },
};

export default async function BlogPage() {
  const queryClient = getQueryClient();

  // Prefetch the initial data into the react-query cache instance
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["blogPosts"],
    queryFn: ({ pageParam = 1 }) => getBlogPosts(pageParam),
    initialPageParam: 1,
  });

  const initialBlogDataContext = queryClient.getQueryData<{
    pages: { data: BlogPost[]; meta: any }[];
  }>(["blogPosts"]);
  const initialBlogData = initialBlogDataContext?.pages?.[0] || { data: [] };

  // Create structured data for the blog listing page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    headline: "Ayush Shah's Developer Blog",
    description:
      "Thoughts, technical guides, and insights about web development, programming, and my journey as a developer.",
    url: "https://developer-ayush.com/blog",
    author: {
      "@type": "Person",
      name: "Ayush Shah",
    },
    blogPost:
      initialBlogData.data?.map((post) => ({
        "@type": "BlogPosting",
        headline: post.title,
        description: post.description,
        image: post.banner,
        datePublished: post.updatedAt,
        author: {
          "@type": "Person",
          name: post.author.name,
        },
        url: `https://developer-ayush.com/blog/${post.slug}`,
      })) || [],
  };

  return (
    <div className="py-20 md:py-28">
      {/* Add JSON-LD structured data */}
      <Script
        id="blog-list-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            My <span className="text-sky-500">Blog</span>
          </h1>
          <p className="text-foreground/70 max-w-2xl mx-auto">
            Thoughts, technical guides, and insights about web development,
            programming, and my journey as a developer.
          </p>
        </div>

        {/* Ensure HydrationBoundary passes context to the client seamlessly */}
        <HydrationBoundary state={dehydrate(queryClient)}>
          <BlogList />
        </HydrationBoundary>
      </div>
    </div>
  );
}
