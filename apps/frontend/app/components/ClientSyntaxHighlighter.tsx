"use client";

import { useEffect } from "react";
import hljs from "highlight.js/lib/core";
// Import specific languages to reduce bundle size
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import python from "highlight.js/lib/languages/python";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import sql from "highlight.js/lib/languages/sql";
import plaintext from "highlight.js/lib/languages/plaintext";
import tsx from "highlight.js/lib/languages/typescript";
import yaml from "highlight.js/lib/languages/yaml";
import php from "highlight.js/lib/languages/php";
import java from "highlight.js/lib/languages/java";
import csharp from "highlight.js/lib/languages/csharp";
import ruby from "highlight.js/lib/languages/ruby";
import go from "highlight.js/lib/languages/go";
import rust from "highlight.js/lib/languages/rust";
import swift from "highlight.js/lib/languages/swift";
import kotlin from "highlight.js/lib/languages/kotlin";

// Register all languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("python", python);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", html);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("sql", sql);
hljs.registerLanguage("plaintext", plaintext);
hljs.registerLanguage("tsx", tsx);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("php", php);
hljs.registerLanguage("java", java);
hljs.registerLanguage("csharp", csharp);
hljs.registerLanguage("ruby", ruby);
hljs.registerLanguage("go", go);
hljs.registerLanguage("rust", rust);
hljs.registerLanguage("swift", swift);
hljs.registerLanguage("kotlin", kotlin);

/**
 * Language detection patterns
 */
const languagePatterns = [
  { lang: "html", pattern: /<\/?[a-z][\s\S]*>/i },
  { lang: "css", pattern: /\s*(\.|#|:)[a-z0-9_-]+\s*\{[\s\S]*?\}/i },
  {
    lang: "javascript",
    pattern: /(const|let|var|function|=>|import|export|class|async|await)/i,
  },
  {
    lang: "typescript",
    pattern: /(interface|type|namespace|enum|<.*>|:.*=>)/i,
  },
  { lang: "jsx", pattern: /<[A-Z][A-Za-z0-9]*(\.|\s+|\/>|>)/i }, // React component pattern
  { lang: "json", pattern: /^\s*(\{[\s\S]*\}|\[[\s\S]*\])\s*$/i },
  {
    lang: "python",
    pattern: /(def|import|from|class|if __name__ == ['"]__main__['"]:)/i,
  },
  { lang: "bash", pattern: /(^\s*\$|^\s*#!\/bin\/|^\s*echo|^\s*export|sudo)/i },
  {
    lang: "sql",
    pattern:
      /(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|FROM|WHERE|GROUP BY)/i,
  },
  { lang: "yaml", pattern: /^---(\s*\n.*:.*\n)+/i },
  { lang: "ruby", pattern: /(def|class|module|require|gem|do\s+\|.*\|)/i },
  { lang: "php", pattern: /(<\?php|namespace|use\s+[\\\w]+;)/i },
  {
    lang: "java",
    pattern:
      /(public\s+class|private|protected|package\s+[\w\.]+;|import\s+[\w\.]+;)/i,
  },
  {
    lang: "csharp",
    pattern: /(namespace|using\s+[\w\.]+;|class|void|string\[\])/i,
  },
  { lang: "go", pattern: /(package\s+\w+|func|import\s+\(|\)|\bgo\b)/i },
  {
    lang: "rust",
    pattern: /(fn\s+\w+|let\s+mut|impl|struct|enum|match|use\s+\w+::\w+)/i,
  },
];

/**
 * Detect language based on content
 */
function detectLanguage(content: string): string {
  // Try to detect language by content patterns
  for (const { lang, pattern } of languagePatterns) {
    if (pattern.test(content)) {
      console.log(`Auto-detected ${lang} based on content pattern`);
      return lang;
    }
  }

  // Default to plaintext if no match
  return "plaintext";
}

/**
 * Client component for initializing syntax highlighting
 * This is a client component that initializes syntax highlighting after the blog content is rendered
 */
export default function ClientSyntaxHighlighter() {
  useEffect(() => {
    // Find and highlight all code blocks
    const highlightCode = () => {
      console.log("Applying syntax highlighting...");
      // Target both pre > code and code blocks with 'language-' class
      const codeBlocks = document.querySelectorAll(
        'pre code, code[class*="language-"]'
      );
      console.log(`Found ${codeBlocks.length} code blocks to highlight`);

      codeBlocks.forEach((block, index) => {
        console.log(`Processing block ${index + 1}:`, block.className);

        // Get the language from class or data attribute
        let language = "";
        const classList = block.className.split(" ");

        // Check if language is specified in class
        for (const cls of classList) {
          if (cls.startsWith("language-")) {
            language = cls.replace("language-", "");
            break;
          }
        }

        // If no language specified or it's plaintext, try to auto-detect
        if (!language || language === "plaintext") {
          const content = block.textContent || "";
          if (content.trim().length > 0) {
            const detectedLang = detectLanguage(content);

            // Only change language if we detected something other than plaintext
            if (detectedLang !== "plaintext" || !language) {
              language = detectedLang;

              // Update class to reflect detected language
              if (block.className.includes("language-")) {
                block.className = block.className.replace(
                  /language-[a-zA-Z0-9_]+/,
                  `language-${language}`
                );
              } else {
                block.className += ` language-${language}`;
              }

              console.log(`Auto-detected and set language to: ${language}`);
            }
          }
        }

        // Force re-highlighting with the correct language
        if (language) {
          try {
            const result = hljs.highlight(block.textContent || "", {
              language,
              ignoreIllegals: true,
            });
            block.innerHTML = result.value;
            block.classList.add("hljs");
          } catch (e) {
            console.warn(
              `Failed to highlight with ${language}, falling back to auto`,
              e
            );
            hljs.highlightElement(block as HTMLElement);
          }
        } else {
          // Fallback to auto-detection
          hljs.highlightElement(block as HTMLElement);
        }

        // Add classes to ensure proper styling
        const parent = block.parentElement;
        if (parent && parent.tagName === "PRE") {
          parent.classList.add("hljs-pre");
        }
      });

      console.log("Syntax highlighting applied");
    };

    // Apply highlighting multiple times with increasing delays
    // This helps ensure the DOM is fully loaded and processed
    const timer1 = setTimeout(highlightCode, 100);
    const timer2 = setTimeout(highlightCode, 500);
    const timer3 = setTimeout(highlightCode, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <>
      <style jsx global>{`
        /* Base styles for code blocks */
        pre.hljs-pre {
          background-color: #1a1b26 !important;
          border-radius: 0.5rem !important;
          padding: 1.25rem !important;
          overflow-x: auto !important;
          margin: 1.5rem 0 !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
        }

        /* Code highlighting styles - VS Code-like dark theme */
        .hljs {
          color: #c9d1d9 !important;
          background: #1a1b26 !important;
          font-family:
            ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace !important;
        }

        .hljs-keyword,
        .hljs-tag,
        .hljs-built_in,
        .hljs-name,
        .hljs-selector-tag {
          color: #ff7b72 !important;
        }

        .hljs-string,
        .hljs-title,
        .hljs-section,
        .hljs-attribute,
        .hljs-literal,
        .hljs-template-tag,
        .hljs-template-variable,
        .hljs-type {
          color: #a5d6ff !important;
        }

        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-number {
          color: #d2a8ff !important;
        }

        .hljs-symbol,
        .hljs-bullet,
        .hljs-link,
        .hljs-meta,
        .hljs-selector-id,
        .hljs-title.function_ {
          color: #7ee787 !important;
        }

        .hljs-doctag,
        .hljs-strong,
        .hljs-emphasis {
          font-weight: bold !important;
        }

        .hljs-comment,
        .hljs-quote {
          color: #8b949e !important;
          font-style: italic !important;
        }

        .hljs-selector-class {
          color: #d2a8ff !important;
        }

        .hljs-attr,
        .hljs-variable,
        .hljs-template-variable,
        .hljs-code,
        .hljs-selector-attr,
        .hljs-selector-pseudo,
        .hljs-regexp {
          color: #79c0ff !important;
        }

        .hljs-function,
        .hljs-class,
        .hljs-title {
          color: #d2a8ff !important;
        }

        /* Language specific highlighting - added for common languages */
        /* HTML */
        .language-html .hljs-tag,
        .language-html .hljs-name {
          color: #ff7b72 !important;
        }

        .language-html .hljs-attr {
          color: #79c0ff !important;
        }

        .language-html .hljs-string {
          color: #a5d6ff !important;
        }

        /* CSS */
        .language-css .hljs-selector-class,
        .language-css .hljs-selector-id {
          color: #ff7b72 !important;
        }

        .language-css .hljs-attribute {
          color: #79c0ff !important;
        }

        .language-css .hljs-number {
          color: #a5d6ff !important;
        }

        /* JavaScript/TypeScript */
        .language-javascript .hljs-keyword,
        .language-typescript .hljs-keyword {
          color: #ff7b72 !important;
        }

        .language-javascript .hljs-title.function_,
        .language-typescript .hljs-title.function_ {
          color: #d2a8ff !important;
        }

        /* JSON */
        .language-json .hljs-attr {
          color: #7ee787 !important;
        }

        .language-json .hljs-string {
          color: #a5d6ff !important;
        }
      `}</style>
    </>
  );
}
