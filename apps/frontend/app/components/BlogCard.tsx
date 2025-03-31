"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { BlogPost, formatDate } from "../blogData";

type BlogCardProps = {
  post: BlogPost;
  index: number;
};

const BlogCard = ({ post, index }: BlogCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="flex flex-col bg-foreground/5 rounded-lg overflow-hidden hover:shadow-lg transition-all border border-foreground/10 h-full"
    >
      <div className="relative h-56 w-full overflow-hidden">
        <Image
          src={post.banner}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex gap-2 mb-3 flex-wrap">
          {post.categories.map((category) => (
            <span
              key={category.id}
              className="text-xs px-2 py-1 rounded-full bg-sky-500/10 text-sky-500"
            >
              {category.name}
            </span>
          ))}
        </div>
        <h3 className="text-xl font-bold line-clamp-2 mb-2">{post.title}</h3>
        <p className="text-foreground/70 line-clamp-3 mb-4 flex-grow">
          {post.description}
        </p>
        <div className="flex justify-between items-center mt-auto pt-4 border-t border-foreground/10">
          <div className="text-sm text-foreground/60">
            {formatDate(post.updatedAt)}
          </div>
          <div className="text-sm flex items-center gap-1 text-foreground/60">
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
            {post.views}
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
  );
};

export default BlogCard;
