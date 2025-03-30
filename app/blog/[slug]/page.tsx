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

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Blog Post Not Found",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  return {
    title: `${post.title} | Ayush Shah`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://developer-ayush.com/blog/${post.slug}`,
      siteName: "Ayush Shah",
      images: [
        {
          url: post.banner,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: "en_US",
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  const posts = await getBlogPosts();

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  const postDetail = await getBlogPostDetail(params.slug);
  if (!postDetail) {
    const fallbackPost = await getBlogPostBySlug(params.slug);
    if (!fallbackPost) {
      notFound();
    }

    // Simple fallback if the detailed post can't be fetched
    return (
      <div className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <Link
                href="/blog"
                className="text-sky-500 hover:text-sky-600 flex items-center text-sm"
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
                Back to all blogs
              </Link>
            </div>

            <div className="flex gap-2 mb-4 flex-wrap">
              {fallbackPost.categories.map((category) => (
                <span
                  key={category.id}
                  className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-500"
                >
                  {category.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              {fallbackPost.title}
            </h1>

            <div className="flex items-center justify-between mb-8 text-foreground/70 text-sm">
              <div className="flex items-center">
                <span>By {fallbackPost.author.name}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(fallbackPost.updatedAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
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
                {fallbackPost.views} views
              </div>
            </div>

            <div className="relative w-full aspect-video mb-10 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={fallbackPost.banner}
                alt={fallbackPost.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
              />
            </div>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg leading-relaxed">
                {fallbackPost.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Handle tags if present
  const tagList = postDetail.tags
    ? postDetail.tags.split(",").map((tag) => tag.trim())
    : [];

  return (
    <div className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-sky-500 hover:text-sky-600 flex items-center text-sm"
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
              Back to all blogs
            </Link>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {tagList.map((tag, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-500"
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {postDetail.title}
          </h1>

          <div className="flex items-center justify-between mb-8 text-foreground/70 text-sm">
            <div className="flex items-center">
              <span>By {postDetail.author.name}</span>
              <span className="mx-2">•</span>
              <span>{formatDate(postDetail.updatedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              {postDetail.views} views
            </div>
          </div>

          <div className="relative w-full aspect-video mb-10 rounded-lg overflow-hidden shadow-lg">
            <Image
              src={postDetail.banner}
              alt={postDetail.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>

          <article className="blog-content">
            <div dangerouslySetInnerHTML={{ __html: postDetail.content }} />
          </article>
        </div>
      </div>
    </div>
  );
}
