import { BlogPost, BlogPostDetail } from "../blogData";
import BlogCard from "./BlogCard";

type RelatedPostsProps = {
  currentPost: BlogPostDetail;
  allPosts: BlogPost[];
};

export default function RelatedPosts({
  currentPost,
  allPosts,
}: RelatedPostsProps) {
  // Filter out current post
  const otherPosts = allPosts.filter((post) => post.id !== currentPost.id);

  // Get the current post's categories
  const currentCategories = new Set(
    currentPost.categories.map((cat) => cat.id)
  );

  // Posts sharing the most categories first
  const relatedPosts = otherPosts
    .map((post) => ({
      post,
      matchCount: post.categories.filter((cat) =>
        currentCategories.has(cat.id)
      ).length,
    }))
    .filter((item) => item.matchCount > 0)
    .sort((a, b) => b.matchCount - a.matchCount)
    .slice(0, 3)
    .map((item) => item.post);

  // If we don't have enough related posts, add some recent posts
  const recentPosts = otherPosts
    .filter((post) => !relatedPosts.some((rp) => rp.id === post.id))
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    )
    .slice(0, 3 - relatedPosts.length);

  const postsToShow = [...relatedPosts, ...recentPosts];

  if (postsToShow.length === 0) return null;

  return (
    <section aria-labelledby="related-title" className="mt-20 border-t border-line pt-10">
      <h2 id="related-title" className="display text-4xl sm:text-5xl">
        Keep <em className="text-accent">reading</em>
      </h2>
      <ul className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-3">
        {postsToShow.map((post) => (
          <li key={post.id}>
            <BlogCard post={post} index={99} headingLevel="h3" />
          </li>
        ))}
      </ul>
    </section>
  );
}
