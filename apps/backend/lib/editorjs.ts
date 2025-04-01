import edjsHTML from "editorjs-html";
import type { OutputData } from "@editorjs/editorjs";
// Import only the types we need
import "@editorjs/header";
import "@editorjs/list";
import "@editorjs/image";
import "@editorjs/quote";
import "@editorjs/paragraph";
import "@editorjs/code";
import "@editorjs/delimiter";
import * as editorjsHeader from "@editorjs/header";
import * as editorjsList from "@editorjs/list";
import * as editorjsImage from "@editorjs/image";
import * as editorjsQuote from "@editorjs/quote";
import * as editorjsParagraph from "@editorjs/paragraph";
import * as editorjsCode from "@editorjs/code";
import * as editorjsDelimiter from "@editorjs/delimiter";
import * as editorjsEmbed from "@editorjs/embed";
import * as editorjsRaw from "@editorjs/raw";
import * as editorjsMarker from "@editorjs/marker";

// Initialize the EditorJS HTML parser
const edjsParser = edjsHTML();

/**
 * Default EditorJS configuration
 */
export const EDITOR_JS_TOOLS = {
  header: {
    class: editorjsHeader.default,
    config: {
      placeholder: "Enter a header",
      levels: [2, 3, 4, 5, 6],
      defaultLevel: 2,
    },
  },
  list: {
    class: editorjsList.default,
    inlineToolbar: true,
  },
  image: {
    class: editorjsImage.default,
    config: {
      uploader: {
        uploadByFile(file: File) {
          // In a real implementation, we would upload the file to a server
          // and return the URL, but for now, we'll use a fake URL
          return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = function (e) {
              resolve({
                success: 1,
                file: {
                  url: e.target?.result as string,
                },
              });
            };
            reader.readAsDataURL(file);
          });
        },
        uploadByUrl(url: string) {
          return Promise.resolve({
            success: 1,
            file: {
              url,
            },
          });
        },
      },
    },
  },
  embed: {
    class: editorjsEmbed.default,
    config: {
      services: {
        youtube: true,
        vimeo: true,
        instagram: true,
        twitter: true,
        facebook: true,
        codepen: true,
        pinterest: true,
        // Add more services as needed
        // Custom service for other embed types
        generic: {
          // Generic embeds - detect common embed URLs
          regex: /^(https?:\/\/.*?\/.*?)$/,
          embedUrl: "<%= remote_id %>",
          html: "<iframe class='embed-responsive-item' src='<%= remote_id %>' frameborder='0' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture' allowfullscreen></iframe>",
          height: 320,
          width: "100%",
          id: (groups: string[]) => groups[1],
        },
      },
    },
    inlineToolbar: true,
  },
  raw: {
    class: editorjsRaw.default,
    config: {
      placeholder: "Enter HTML code here (iframe, embed code, etc.)",
    },
    inlineToolbar: true,
  },
  code: editorjsCode.default,
  quote: {
    class: editorjsQuote.default,
    inlineToolbar: true,
  },
  delimiter: editorjsDelimiter.default,
  paragraph: {
    class: editorjsParagraph.default,
    inlineToolbar: true,
  },
  marker: {
    class: editorjsMarker.default,
    shortcut: "CMD+SHIFT+M",
  },
};

/**
 * Parse EditorJS JSON to HTML
 * @param data - EditorJS JSON data
 * @returns HTML string
 */
export function parseEditorJsToHtml(data: OutputData): string {
  if (!data || !data.blocks || !data.blocks.length) {
    return "";
  }

  try {
    const html = edjsParser.parse(data);
    return Array.isArray(html) ? html.join("") : "";
  } catch (error) {
    console.error("Error parsing EditorJS data:", error);
    return "";
  }
}

/**
 * Convert plain text to EditorJS data format
 * @param text - Plain text content
 * @returns EditorJS compatible data object
 */
export function convertPlainTextToEditorJs(text: string): OutputData {
  if (!text) {
    return {
      time: new Date().getTime(),
      blocks: [],
      version: "2.30.8",
    };
  }

  // Split text by double newlines to create paragraphs
  const paragraphs = text.split(/\n\n+/);

  return {
    time: new Date().getTime(),
    blocks: paragraphs.map((paragraph) => ({
      type: "paragraph",
      data: {
        text: paragraph.replace(/\n/g, "<br>"),
      },
    })),
    version: "2.30.8",
  };
}

/**
 * Check if a string is valid JSON
 * @param str - String to check
 * @returns boolean
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return false;
  }
}

/**
 * Determine if content is EditorJS data or plain text
 * @param content - Content to check
 * @returns EditorJS data object
 */
export function normalizeContent(
  content: string | OutputData | undefined | null
): OutputData {
  // Handle null or undefined content
  if (content === null || content === undefined) {
    return {
      time: new Date().getTime(),
      blocks: [],
      version: "2.30.8",
    };
  }

  // If content is already an object, check if it's valid EditorJS data
  if (typeof content === "object") {
    if (content.blocks && Array.isArray(content.blocks)) {
      return content;
    }
    return convertPlainTextToEditorJs(JSON.stringify(content));
  }

  // If content is a string, check if it's JSON
  if (typeof content === "string") {
    if (isValidJson(content)) {
      const parsed = JSON.parse(content);
      if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
        return parsed;
      }
    }
    // If not valid EditorJS JSON, treat as plain text
    return convertPlainTextToEditorJs(content);
  }

  // Default empty editor
  return {
    time: new Date().getTime(),
    blocks: [],
    version: "2.30.8",
  };
}
