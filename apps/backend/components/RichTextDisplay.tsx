"use client";

import React, { useEffect, useState } from "react";
import { parseEditorJsToHtml, normalizeContent } from "../lib/editorjs";

interface RichTextDisplayProps {
  content: string | object | null;
  className?: string;
}

export default function RichTextDisplay({
  content,
  className = "",
}: RichTextDisplayProps) {
  const [htmlContent, setHtmlContent] = useState("");

  useEffect(() => {
    if (!content) {
      setHtmlContent("");
      return;
    }

    try {
      // First normalize the content to ensure it's in EditorJS format
      const normalizedContent = normalizeContent(content);
      // Then parse it to HTML
      const html = parseEditorJsToHtml(normalizedContent);
      setHtmlContent(html);
    } catch (error) {
      console.error("Error rendering EditorJS content:", error);
      // Fallback to displaying content as plain text
      if (typeof content === "string") {
        setHtmlContent(`<p>${content}</p>`);
      } else {
        setHtmlContent("<p>Failed to render content</p>");
      }
    }
  }, [content]);

  return (
    <div
      className={`rich-text-content ${className}`}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
