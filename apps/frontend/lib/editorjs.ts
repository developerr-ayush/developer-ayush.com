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
 * Render EditorJS blocks to HTML
 * @param data - EditorJS data
 * @returns HTML string
 */
export function renderEditorJsContent(data: any): string {
  if (
    !data ||
    !data.blocks ||
    !Array.isArray(data.blocks) ||
    data.blocks.length === 0
  ) {
    return "";
  }

  try {
    return data.blocks
      .map((block: any) => {
        switch (block.type) {
          case "header":
            return `<h${block.data.level} id="${slugify(block.data.text)}">${block.data.text}</h${block.data.level}>`;

          case "paragraph":
            return `<p>${block.data.text}</p>`;

          case "list":
            const listItems = block.data.items
              .map((item: string) => `<li>${item}</li>`)
              .join("");
            return block.data.style === "ordered"
              ? `<ol>${listItems}</ol>`
              : `<ul>${listItems}</ul>`;

          case "image":
            const caption = block.data.caption
              ? `<figcaption>${block.data.caption}</figcaption>`
              : "";
            return `
            <figure class="my-8">
              <img 
                src="${block.data.file.url}" 
                alt="${block.data.caption || ""}" 
                class="rounded-lg mx-auto ${block.data.stretched ? "w-full" : ""}"
              />
              ${caption}
            </figure>
          `;

          case "embed":
            const embedCaption = block.data.caption
              ? `<figcaption>${block.data.caption}</figcaption>`
              : "";
            return `
            <div class="embed-container my-8">
              <iframe
                src="${block.data.embed}"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="w-full aspect-video rounded"
              ></iframe>
              ${embedCaption}
            </div>
          `;

          case "code":
            // Ensure the language class is set correctly for highlight.js to detect it
            const language = block.data.language || "plaintext";
            // Escape HTML in the code to prevent rendering issues
            const escapedCode = block.data.code
              .replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");

            // Use data attributes to help with client-side processing
            return `<pre><code class="language-${language}" data-language="${language}">${escapedCode}</code></pre>`;

          case "quote":
            const cite = block.data.caption
              ? `<cite>— ${block.data.caption}</cite>`
              : "";
            return `<blockquote><p>${block.data.text}</p>${cite}</blockquote>`;

          case "delimiter":
            return '<hr class="my-8" />';

          default:
            console.warn(`Unknown block type: ${block.type}`);
            return "";
        }
      })
      .join("");
  } catch (error) {
    console.error("Error rendering EditorJS content:", error);
    return "";
  }
}

/**
 * Create a slug from a string
 * @param text - Text to convert to slug
 * @returns Slug string
 */
function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Process blog content for display
 * @param content - Blog content
 * @param jsonContent - Optional JSON content from the json_content field
 * @returns Processed HTML content
 */
export function processBlogContent(content: any, jsonContent?: any): string {
  // First try jsonContent if available
  if (jsonContent) {
    // If it's a string, try to parse it
    if (typeof jsonContent === "string") {
      try {
        const parsedContent = JSON.parse(jsonContent);
        if (isEditorJsData(parsedContent)) {
          return renderEditorJsContent(parsedContent);
        }
      } catch {
        // If parsing fails, continue with regular content
      }
    }
    // If it's already an object, check if it's EditorJS data
    else if (isEditorJsData(jsonContent)) {
      return renderEditorJsContent(jsonContent);
    }
  }

  // Handle null or undefined content
  if (content === null || content === undefined) {
    return "";
  }

  // If jsonContent is not available or not valid, use regular content
  // If the content is already a string, return as is
  if (typeof content === "string") {
    // Check if it's EditorJS JSON in string format
    if (content.trim().startsWith("{") && isValidJson(content)) {
      try {
        const parsedContent = JSON.parse(content);
        if (isEditorJsData(parsedContent)) {
          return renderEditorJsContent(parsedContent);
        }
      } catch (error) {
        // If parsing fails, return the original content
        console.error("Error parsing content JSON:", error);
        return content;
      }
    }
    return content;
  }

  // If the content is an object, check if it's EditorJS data
  if (typeof content === "object" && content !== null) {
    if (isEditorJsData(content)) {
      return renderEditorJsContent(content);
    }
  }

  // Fallback
  return typeof content === "string" ? content : JSON.stringify(content || "");
}
