import { getBlogPosts } from "../blogData";
import BlogCard from "../components/BlogCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Ayush Shah",
  description:
    "Check out my latest blog posts on web development and programming",
  openGraph: {
    title: "Blog | Ayush Shah",
    description:
      "Check out my latest blog posts on web development and programming",
    url: "https://developer-ayush.com/blog",
    siteName: "Ayush Shah",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ayush Shah Blog",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="py-20 md:py-28">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {posts.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
