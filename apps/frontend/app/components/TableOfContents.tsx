"use client";

import { useEffect, useState } from "react";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    // Find all headings in the blog content
    const article = document.querySelector(".blog-content");
    if (!article) return;

    const elements = Array.from(article.querySelectorAll("h2, h3, h4"));

    // Generate IDs for headings if they don't have one
    elements.forEach((el, index) => {
      if (!el.id) {
        el.id = `heading-${index}`;
      }
    });

    setHeadings(
      elements.map((el) => ({
        id: el.id,
        text: el.textContent || "",
        level: parseInt(el.tagName.substring(1), 10),
      }))
    );

    // Track the heading currently in view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -60% 0px", threshold: 0 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length < 3) {
    return null; // Don't show TOC for short articles
  }

  return (
    <nav aria-labelledby="toc-title" className="mb-10">
      <h2 id="toc-title" className="eyebrow mb-4">
        On this page
      </h2>
      <ol className="space-y-1 border-l border-line text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={
              heading.level === 3 ? "pl-4" : heading.level === 4 ? "pl-8" : ""
            }
          >
            <a
              href={`#${heading.id}`}
              aria-current={activeId === heading.id ? "location" : undefined}
              className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-muted transition-colors hover:text-ink aria-[current=location]:border-accent aria-[current=location]:text-ink"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
