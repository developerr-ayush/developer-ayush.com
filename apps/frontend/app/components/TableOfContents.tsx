"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

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

    // Extract heading data
    const headingElements = elements.map((el) => ({
      id: el.id,
      text: el.textContent || "",
      level: parseInt(el.tagName.substring(1), 10),
    }));

    setHeadings(headingElements);

    // Setup intersection observer to track active heading
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    // Observe all heading elements
    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  if (headings.length < 3) {
    return null; // Don't show TOC for short articles
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="toc mb-8 p-4 bg-foreground/5 rounded-lg border border-foreground/10"
    >
      <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`${
              heading.level === 2
                ? "ml-0"
                : heading.level === 3
                ? "ml-4"
                : "ml-8"
            }`}
          >
            <a
              href={`#${heading.id}`}
              className={`${
                activeId === heading.id
                  ? "text-sky-500 font-medium"
                  : "text-foreground/70 hover:text-sky-500"
              } transition-colors duration-200 inline-block`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
