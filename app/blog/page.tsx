import { getBlogPosts } from "../blogData";
import BlogList from "../components/BlogList";

export default async function BlogPage() {
  // Fetch the initial data on the server
  const initialBlogData = await getBlogPosts(1);

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

        {/* Pass the initial data to the client component */}
        <BlogList initialData={initialBlogData} />
      </div>
    </div>
  );
}
