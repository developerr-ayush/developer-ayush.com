"use client";

import { BlogPost, BlogPostDetail } from "../blogData";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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

  // Find posts with matching categories
  const relatedPosts = otherPosts
    .map((post) => {
      // Count how many categories match
      const matchCount = post.categories.filter((cat) =>
        currentCategories.has(cat.id)
      ).length;
      return { post, matchCount };
    })
    .filter((item) => item.matchCount > 0) // Only keep posts with at least one matching category
    .sort((a, b) => b.matchCount - a.matchCount) // Sort by match count in descending order
    .slice(0, 3) // Take the top 3 matches
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
    <div className="mt-12 pt-8 border-t border-foreground/10">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {postsToShow.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="flex flex-col bg-foreground/5 rounded-lg overflow-hidden hover:shadow-lg transition-all border border-foreground/10"
          >
            <div className="relative h-40 w-full overflow-hidden">
              <Image
                src={post.banner}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="text-lg font-semibold line-clamp-2 mb-2">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-sky-500 transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              <div className="flex flex-wrap gap-2 mt-auto pt-3">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-500"
                  >
                    {category.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
