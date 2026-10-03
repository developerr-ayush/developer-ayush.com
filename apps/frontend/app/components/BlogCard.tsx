import Image from "next/image";
import Link from "next/link";
import { BlogPost, formatDate } from "../blogData";

type BlogCardProps = {
  post: BlogPost;
  index: number;
  headingLevel?: "h2" | "h3";
};

const BlogCard = ({ post, index, headingLevel = "h2" }: BlogCardProps) => {
  const Heading = headingLevel;
  return (
    <article className="group reveal relative flex h-full flex-col gap-4">
      <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-surface">
        {post.banner && (
          <Image
            src={post.banner}
            alt=""
            fill
            // first row is above the fold on most screens
            priority={index < 2}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 400px"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3">
        <p className="eyebrow flex flex-wrap gap-x-3">
          <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
          <span>{post.views} views</span>
        </p>
        <Heading className="display text-3xl transition-colors group-hover:text-accent">
          <Link
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:content-['']"
          >
            {post.title}
          </Link>
        </Heading>
        <p className="line-clamp-3 text-muted">{post.description}</p>
        {post.categories.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-2" aria-label="Categories">
            {post.categories.map((category) => (
              <li key={category.id} className="chip">
                {category.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </article>
  );
};

export default BlogCard;
