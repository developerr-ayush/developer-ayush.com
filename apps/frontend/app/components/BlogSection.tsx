import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { BlogPost, formatDate } from "../blogData";
import SectionHeader from "./SectionHeader";

type BlogSectionProps = {
  posts: BlogPost[];
};

const BlogSection = ({ posts }: BlogSectionProps) => {
  const recentPosts = (Array.isArray(posts) ? posts : []).slice(0, 4);

  return (
    <section
      id="blog"
      aria-labelledby="blog-title"
      className="container-x py-20 lg:py-28"
    >
      <SectionHeader
        index="05"
        label="Writing"
        id="blog-title"
        aside={
          <Link
            href="/blog"
            className="link-underline inline-flex shrink-0 items-center gap-2 text-sm font-medium"
          >
            All posts <FiArrowRight aria-hidden="true" />
          </Link>
        }
      >
        Notes from the <em>work</em>
      </SectionHeader>

      {recentPosts.length > 0 ? (
        <ul className="mt-14 border-b border-line">
          {recentPosts.map((post) => (
            <li key={post.id} className="reveal border-t border-line">
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-6 sm:grid-cols-[7rem_1fr_auto] md:grid-cols-12"
              >
                <time
                  dateTime={post.updatedAt}
                  className="eyebrow col-span-2 sm:col-span-1 md:col-span-2"
                >
                  {formatDate(post.updatedAt)}
                </time>
                <span className="md:col-span-7">
                  <span className="display block text-3xl transition-colors group-hover:text-accent sm:text-4xl">
                    {post.title}
                  </span>
                  {post.description && (
                    <span className="mt-2 line-clamp-2 block text-sm text-muted">
                      {post.description}
                    </span>
                  )}
                </span>
                <span className="relative hidden aspect-[3/2] w-full overflow-hidden rounded-lg bg-surface md:col-span-2 md:block">
                  {post.banner && (
                    <Image
                      src={post.banner}
                      alt=""
                      fill
                      sizes="160px"
                      className="object-cover"
                    />
                  )}
                </span>
                <FiArrowUpRight
                  aria-hidden="true"
                  className="h-6 w-6 justify-self-end transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 md:col-span-1"
                />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-14 text-muted">
          New posts are on the way.{" "}
          <Link href="/blog" className="link-underline text-ink">
            Visit the blog
          </Link>
          .
        </p>
      )}
    </section>
  );
};

export default BlogSection;
