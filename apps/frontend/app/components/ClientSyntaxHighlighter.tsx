"use client";

import { useEffect } from "react";
import { initCodeSyntaxHighlighting } from "../../lib/editorjs";
import "highlight.js/styles/tokyo-night-dark.css"; // Changed to a better dark theme

/**
 * Client component for initializing syntax highlighting
 * This is a client component that initializes syntax highlighting after the blog content is rendered
 */
export default function ClientSyntaxHighlighter() {
  useEffect(() => {
    // Initialize syntax highlighting
    // Add a small delay to ensure the DOM is fully rendered
    const timer = setTimeout(() => {
      initCodeSyntaxHighlighting();
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
