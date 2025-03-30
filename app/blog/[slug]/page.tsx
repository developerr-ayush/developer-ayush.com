import {
  getBlogPostBySlug,
  getBlogPosts,
  formatDate,
  getBlogPostDetail,
} from "../../blogData";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../blog-content.css";
import Script from "next/script";
import TableOfContents from "../../components/TableOfContents";
import RelatedPosts from "../../components/RelatedPosts";
import BreadcrumbsServer from "../../components/BreadcrumbsServer";
import { Metadata } from "next";

export async function generateStaticParams() {
  const blogData = await getBlogPosts(1);
  const posts = blogData.data || [];

  return posts.map((post) => ({
    slug: post.slug,
  }));
}
type Params = Promise<{ slug: string }>;
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug[0]);
  return {
    title: post?.title,
    description: post?.description,
    openGraph: {
      images: post?.banner,
    },
  };
}
export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const detailedPost = await getBlogPostDetail(slug[0]);
  const post = await getBlogPostBySlug(slug[0]);
  const blogData = await getBlogPosts(1); // Get all blog posts for related posts
  const allPosts = blogData.data || [];

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
      url: "https://developer-ayush.com",
    },
    publisher: {
      "@type": "Organization",
      name: "Ayush Shah",
      logo: {
        "@type": "ImageObject",
        url: "https://developer-ayush.com/favicon.jpg",
        width: "192",
        height: "192",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://developer-ayush.com/blog/${post.slug}`,
    },
    keywords: post.categories.map((category) => category.name).join(", "),
    articleSection: post.categories[0]?.name || "Technology",
    wordCount: detailedPost?.content
      ? detailedPost.content.split(" ").length
      : 0,
    inLanguage: "en-US",
  };

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
          {/* Back to blog link with breadcrumbs */}
          <BreadcrumbsServer title={post.title} />

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
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-3/4">
              <article className="blog-content">
                {detailedPost ? (
                  <div
                    dangerouslySetInnerHTML={{ __html: detailedPost.content }}
                  />
                ) : (
                  <p className="text-foreground/70">{post.description}</p>
                )}
              </article>
            </div>
            <aside className="w-full lg:w-1/4 lg:sticky lg:top-24 self-start">
              <TableOfContents />
              <div className="p-4 bg-foreground/5 rounded-lg border border-foreground/10">
                <h3 className="text-lg font-semibold mb-3">Share this post</h3>
                <div className="flex gap-2">
                  <a
                    href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                      post.title
                    )}&url=${encodeURIComponent(
                      `https://developer-ayush.com/blog/${post.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-foreground/10 hover:bg-sky-500/20 rounded-full transition-colors"
                    aria-label="Share on Twitter"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </a>
                  <a
                    href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                      `https://developer-ayush.com/blog/${post.slug}`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-foreground/10 hover:bg-sky-500/20 rounded-full transition-colors"
                    aria-label="Share on LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>

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

          {/* Related Posts section */}
          <RelatedPosts currentPost={post} allPosts={allPosts} />
        </div>
      </div>
    </div>
  );
}
