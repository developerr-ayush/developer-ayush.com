import {
  getBlogPostBySlug,
  getBlogPosts,
  formatDate,
  getBlogPostDetail,
} from "../../blogData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import "../blog-content.css";
import Script from "next/script";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.updatedAt,
      authors: [post.author.name],
      images: [
        {
          url: post.banner,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.banner],
    },
    alternates: {
      canonical: `https://developer-ayush.com/blog/${post.slug}`,
    },
  };
}

export async function generateStaticParams() {
  const blogData = await getBlogPosts(1);
  const posts = blogData.data || [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const detailedPost = await getBlogPostDetail(params.slug);
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  // Create structured data for the blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.banner,
    datePublished: post.updatedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
    },
    publisher: {
      "@type": "Person",
      name: post.author.name,
      logo: {
        "@type": "ImageObject",
        url: "/android-chrome-192x192.png",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://developer-ayush.com/blog/${post.slug}`,
    },
  };

  // For SEO, split the categories into individual tags
  const tags = post.categories.map((category) => category.name).join(", ");

  return (
    <div className="py-20 md:py-28">
      {/* JSON-LD structured data */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Back to blog link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-sm text-sky-500 hover:text-sky-600 mb-8"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Blog post banner */}
          <div className="rounded-2xl overflow-hidden mb-8 relative aspect-video">
            <Image
              src={post.banner}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 60vw"
            />
          </div>

          {/* Blog post header */}
          <div className="mb-8">
            {/* Categories/tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs px-3 py-1 rounded-full bg-sky-500/10 text-sky-500"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              {post.title}
            </h1>

            <div className="flex justify-between items-center text-foreground/60 text-sm">
              <div className="flex items-center">
                <span>By {post.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.updatedAt)}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                {post.views} views
              </div>
            </div>
          </div>

          {/* Blog post content */}
          <article className="blog-content">
            {detailedPost ? (
              <div dangerouslySetInnerHTML={{ __html: detailedPost.content }} />
            ) : (
              <p className="text-foreground/70">{post.description}</p>
            )}
          </article>

          {/* Tags for improved SEO */}
          <div className="mt-12 pt-6 border-t border-foreground/10">
            <div className="flex items-center">
              <span className="text-foreground/60 mr-3">Tags:</span>
              <div className="flex flex-wrap gap-2">
                {post.categories.map((category) => (
                  <span
                    key={category.id}
                    className="text-xs px-3 py-1 rounded-full bg-foreground/10 text-foreground/70"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
