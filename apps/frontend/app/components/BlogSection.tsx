"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { BlogPost, formatDate } from "../blogData";

type BlogSectionProps = {
  posts: BlogPost[];
};

const BlogSection = ({ posts }: BlogSectionProps) => {
  // Make sure posts is an array and take only 3 most recent posts
  const blogPosts = Array.isArray(posts) ? posts : [];
  const recentPosts = blogPosts.slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-foreground/[0.02]">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Latest <span className="text-sky-500">Articles</span>
          </h2>
          <div className="mt-4 h-1 w-16 bg-sky-500 mx-auto rounded-full"></div>
          <p className="mt-4 text-foreground/70 max-w-2xl mx-auto">
            Check out my latest blog posts about web development, programming,
            and technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {recentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col bg-foreground/5 rounded-lg overflow-hidden hover:shadow-lg transition-all border border-foreground/10 h-full"
            >
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={post.banner}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <p className="text-foreground/70 line-clamp-2 mb-4 flex-grow">
                  {post.description}
                </p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-foreground/10">
                  <div className="text-sm text-foreground/60">
                    {formatDate(post.updatedAt)}
                  </div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sky-500 hover:text-sky-600 font-medium text-sm flex items-center"
                  >
                    Read More
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 ml-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="px-6 py-3 rounded-full border border-foreground/20 font-medium hover:bg-foreground/5 transition-colors inline-flex items-center"
          >
            View All Articles
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
