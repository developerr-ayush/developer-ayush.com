import Link from "next/link";

export default function BlogNotFound() {
  return (
    <div className="py-20 md:py-28">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Blog Post Not Found
          </h1>
          <p className="text-foreground/70 text-lg mb-8">
            Sorry, the blog post you are looking for doesn&apos;t exist or may
            have been moved.
          </p>
          <Link
            href="/blog"
            className="px-6 py-3 rounded-full bg-sky-500 text-white font-medium hover:bg-sky-600 transition-colors"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    </div>
  );
}
