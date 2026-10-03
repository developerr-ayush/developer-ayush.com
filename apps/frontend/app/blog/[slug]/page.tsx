import { getBlogPosts, formatDate, getBlogPostDetail } from "../../blogData";
import ViewCounter from "../../components/ViewCounter";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../blog-content.css";
import TableOfContents from "../../components/TableOfContents";
import RelatedPosts from "../../components/RelatedPosts";
import BreadcrumbsServer from "../../components/BreadcrumbsServer";
import JsonLd from "../../components/JsonLd";
import { Metadata } from "next";
import { FiArrowLeft } from "react-icons/fi";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { processBlogContent } from "../../../lib/editorjs";
import ClientSyntaxHighlighter from "../../../app/components/ClientSyntaxHighlighter";
import { SITE_URL } from "../../data";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostDetail(slug);
  if (!post) {
    return { title: "Post not found", robots: { index: false } };
  }

  const url = `/blog/${post.slug}`;
  const images = post.banner
    ? [{ url: post.banner, width: 1200, height: 630, alt: post.title }]
    : undefined;

  return {
    title: post.title,
    description: post.description,
    keywords: post.categories.map((c) => c.name),
    authors: [{ name: post.author?.name ?? "Ayush Shah", url: SITE_URL }],
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.createdAt,
      modifiedTime: post.updatedAt,
      authors: [post.author?.name ?? "Ayush Shah"],
      tags: post.categories.map((c) => c.name),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.banner ? [post.banner] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const detailedPost = await getBlogPostDetail(slug);
  const blogData = await getBlogPosts(1); // Get all blog posts for related posts
  const allPosts = blogData.data || [];
  if (!detailedPost) {
    notFound();
  }

  // Process content - handle both legacy content and EditorJS content
  const processedContent = processBlogContent(JSON.parse(detailedPost.content));
  const postUrl = `${SITE_URL}/blog/${detailedPost.slug}`;
  const wordCount = processedContent
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const readingMinutes = Math.max(1, Math.round(wordCount / 230));

  // Structured data for the blog post
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `${postUrl}#article`,
        headline: detailedPost.title,
        description: detailedPost.description,
        image: detailedPost.banner ? [detailedPost.banner] : undefined,
        datePublished: detailedPost.createdAt || detailedPost.updatedAt,
        dateModified: detailedPost.updatedAt,
        author: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: detailedPost.author.name,
          url: SITE_URL,
        },
        publisher: {
          "@type": "Person",
          "@id": `${SITE_URL}/#person`,
          name: "Ayush Shah",
          url: SITE_URL,
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": postUrl },
        url: postUrl,
        keywords: detailedPost.categories.map((c) => c.name).join(", "),
        articleSection: detailedPost.categories[0]?.name || "Technology",
        wordCount,
        inLanguage: "en-US",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE_URL}/blog`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: detailedPost.title,
            item: postUrl,
          },
        ],
      },
    ],
  };

  const shareLinks = [
    {
      name: "X",
      icon: FaXTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        detailedPost.title
      )}&url=${encodeURIComponent(postUrl)}`,
    },
    {
      name: "LinkedIn",
      icon: FaLinkedin,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        postUrl
      )}`,
    },
  ];

  return (
    <div className="container-x pb-24 pt-10 sm:pt-14">
      <JsonLd data={structuredData} />

      <article>
        <header className="mx-auto max-w-5xl">
          <BreadcrumbsServer title={detailedPost.title} />

          {detailedPost.categories.length > 0 && (
            <ul className="mt-10 flex flex-wrap gap-1.5" aria-label="Categories">
              {detailedPost.categories.map((category) => (
                <li key={category.id} className="chip">
                  {category.name}
                </li>
              ))}
            </ul>
          )}

          <h1 className="display mt-5 max-w-4xl text-5xl sm:text-6xl lg:text-7xl [text-wrap:balance]">
            {detailedPost.title}
          </h1>

          {detailedPost.description && (
            <p className="mt-6 max-w-2xl text-xl leading-relaxed text-muted">
              {detailedPost.description}
            </p>
          )}

          <div className="mt-8 flex max-w-4xl flex-wrap items-center gap-x-5 gap-y-2 border-y border-line py-4 font-mono text-xs uppercase tracking-wider text-muted">
            <span className="text-ink">By {detailedPost.author.name}</span>
            <time dateTime={detailedPost.updatedAt}>
              {formatDate(detailedPost.updatedAt)}
            </time>
            <span>{readingMinutes} min read</span>
            <ViewCounter
              slug={detailedPost.slug}
              initialViews={detailedPost.views}
            />
          </div>
        </header>

        {detailedPost.banner && (
          <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-2xl border border-line bg-surface">
            <Image
              src={detailedPost.banner}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1100px) 100vw, 1024px"
            />
          </div>
        )}

        <div className="mx-auto mt-14 grid max-w-5xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="min-w-0">
            <div
              className="blog-content max-w-[68ch]"
              dangerouslySetInnerHTML={{ __html: processedContent }}
            />
            {/* Client component for syntax highlighting */}
            <ClientSyntaxHighlighter />
          </div>

          <aside className="order-first lg:order-none lg:sticky lg:top-24 lg:self-start">
            <TableOfContents />
            <div>
              <h2 className="eyebrow mb-3">Share</h2>
              <ul className="flex gap-2">
                {shareLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-11 items-center justify-center rounded-full border border-line transition-colors hover:border-ink"
                    >
                      <link.icon aria-hidden="true" className="h-4 w-4" />
                      <span className="sr-only">
                        Share on {link.name} (opens in a new tab)
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </article>

      <div className="mx-auto max-w-5xl">
        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <Link
            href="/blog"
            className="link-underline inline-flex items-center gap-2 text-sm font-medium"
          >
            <FiArrowLeft aria-hidden="true" /> All posts
          </Link>
          {detailedPost.categories.length > 0 && (
            <p className="text-sm text-muted">
              Filed under{" "}
              {detailedPost.categories.map((c) => c.name).join(", ")}
            </p>
          )}
        </div>

        <RelatedPosts currentPost={detailedPost} allPosts={allPosts} />
      </div>
    </div>
  );
}
