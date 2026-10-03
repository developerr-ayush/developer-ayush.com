import { getBlogPosts, BlogPost } from "../blogData";
import BlogList from "../components/BlogList";
import JsonLd from "../components/JsonLd";
import { SITE_URL } from "../data";
import { Metadata } from "next";

const description =
  "Notes, technical guides and lessons from building fast, accessible web apps with React and Next.js.";

export const metadata: Metadata = {
  title: "Blog",
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    title: "Blog — Ayush Shah",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — Ayush Shah",
    description,
  },
};

export default async function BlogPage() {
  const initialData = await getBlogPosts(1);
  const initialPosts: BlogPost[] = initialData?.data || [];
  const initialMeta = initialData?.meta || {};

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Ayush Shah's blog",
    description,
    url: `${SITE_URL}/blog`,
    author: { "@type": "Person", name: "Ayush Shah", url: SITE_URL },
    blogPost: initialPosts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      image: post.banner,
      datePublished: post.updatedAt,
      dateModified: post.updatedAt,
      author: { "@type": "Person", name: post.author?.name ?? "Ayush Shah" },
      url: `${SITE_URL}/blog/${post.slug}`,
    })),
  };

  return (
    <div className="container-x pb-24 pt-12 sm:pt-16 lg:pt-24">
      <JsonLd data={structuredData} />

      <header className="grid gap-6 border-b border-line pb-12 md:grid-cols-12">
        <p className="eyebrow md:col-span-3 md:pt-4">
          <span className="text-accent">Blog</span> — Writing
        </p>
        <div className="md:col-span-9">
          <h1 className="display text-6xl sm:text-7xl lg:text-8xl">
            Notes from the <em className="text-accent">work</em>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
            {description}
          </p>
        </div>
      </header>

      <div className="mt-14">
        <BlogList initialPosts={initialPosts} initialMeta={initialMeta} />
      </div>
    </div>
  );
}
