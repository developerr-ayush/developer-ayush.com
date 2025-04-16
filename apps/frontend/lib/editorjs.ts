import type { OutputData } from "@editorjs/editorjs";

/**
 * Check if a string is valid JSON
 * @param str - String to check
 * @returns boolean
 */
export function isValidJson(str: string): boolean {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Check if the content is in EditorJS format
 * @param content - Content to check
 * @returns boolean
 */
export function isEditorJsData(content: any): boolean {
  return (
    typeof content === "object" &&
    content !== null &&
    content.blocks &&
    Array.isArray(content.blocks)
  );
}

/**
 * Process blog content for display
 * @param content - Blog content
 * @param jsonContent - Optional JSON content from the json_content field
 * @returns Processed HTML content
 */
export function processBlogContent(content: OutputData): string {
  // First try jsonContent if available
  if (content) {
    console.log(content);
    return content.blocks
      .map((block) => {
        switch (block.type) {
          case "header": {
            const level = block.data.level || 2;
            return `<h${level}>${block.data.text}</h${level}>`;
          }

          case "paragraph":
            return `<p>${block.data.text}</p>`;

          case "list": {
            const tag = block.data.style === "ordered" ? "ol" : "ul";
            const renderListItems = (items: any[]): string => {
              return items
                .map((item: any) => {
                  if (typeof item === "string") {
                    return `<li>${item}</li>`;
                  }
                  const nestedList =
                    item.items && item.items.length > 0
                      ? renderListItems(item.items)
                      : "";
                  return `<li>${item.content || item}${nestedList}</li>`;
                })
                .join("");
            };
            return `<${tag}>${renderListItems(block.data.items)}</${tag}>`;
          }
          case "image":
            return `<img src="${block.data.file.url}" alt="${block.data.caption || ""}" />`;

          case "embed":
            return `<iframe src="${block.data.embed}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

          case "code": {
            const escapedCode = block.data.code
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
            return `<pre><code>${escapedCode}</code></pre>`;
          }

          // Add more block types if needed

          default:
            return "";
        }
      })
      .join("\n");
  }

  // Handle null or undefined content
  if (content === null || content === undefined) {
    return "";
  }

  // Fallback
  return typeof content === "string" ? content : JSON.stringify(content || "");
}
