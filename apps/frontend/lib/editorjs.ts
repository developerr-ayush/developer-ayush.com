import type { OutputData, OutputBlockData } from "@editorjs/editorjs";

interface TableData {
  content?: string[][];
  rows?: Array<{ cells: string[] }>;
  withHeadings?: boolean;
  stretched?: boolean;
}

interface EditorJsBlock {
  id?: string;
  type: string;
  data: {
    level?: number;
    text?: string;
    style?: string;
    items?: (string | EditorJsListItem)[];
    file?: {
      url: string;
    };
    caption?: string;
    embed?: string;
    code?: string;
  } & Partial<TableData>;
}

interface EditorJsListItem {
  content?: string;
  items?: (string | EditorJsListItem)[];
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
  } catch (e) {
    return false;
  }
}

/**
 * Check if the content is in EditorJS format
 * @param content - Content to check
 * @returns boolean
 */
export function isEditorJsData(content: unknown): boolean {
  return (
    typeof content === "object" &&
    content !== null &&
    "blocks" in content &&
    Array.isArray((content as { blocks: unknown[] }).blocks)
  );
}

/**
 * Process blog content for display
 * @param content - Blog content
 * @returns Processed HTML content
 */
export function processBlogContent(
  content: OutputData | null | undefined
): string {
  if (content && content.blocks && Array.isArray(content.blocks)) {
    return content.blocks
      .map((block: EditorJsBlock) => {
        try {
          switch (block.type) {
            case "header": {
              const level = block.data.level || 2;
              return `<h${level}>${block.data.text || ""}</h${level}>`;
            }

            case "paragraph":
              return `<p>${block.data.text || ""}</p>`;

            case "list": {
              const tag = block.data.style === "ordered" ? "ol" : "ul";
              const renderListItems = (
                items: (string | EditorJsListItem)[]
              ): string => {
                return items
                  .map((item) => {
                    if (typeof item === "string") {
                      return `<li>${item}</li>`;
                    }
                    const nestedList =
                      item.items && item.items.length > 0
                        ? renderListItems(item.items)
                        : "";
                    return `<li>${item.content || ""}${nestedList}</li>`;
                  })
                  .join("");
              };
              return `<${tag}>${renderListItems(block.data.items || [])}</${tag}>`;
            }

            case "table": {
              // Handle case where table data is in the content property (EditorJS format)
              if (block.data.content && Array.isArray(block.data.content)) {
                const rows = block.data.content;
                const withHeadings = block.data.withHeadings || false;

                if (rows.length === 0) {
                  return '<div class="table-responsive"><table><tbody><tr><td>No data</td></tr></tbody></table></div>';
                }

                // If withHeadings is true or not specified but we have multiple rows
                if (
                  (withHeadings || withHeadings === undefined) &&
                  rows.length > 1
                ) {
                  // First row is header
                  const firstRow = rows[0] || [];
                  const headerCells = firstRow
                    .map((cell) => `<th>${cell}</th>`)
                    .join("");
                  const headerRow = `<tr>${headerCells}</tr>`;

                  // Rest are body rows
                  const bodyRows = rows
                    .slice(1)
                    .map((row) => {
                      const cells = row
                        .map((cell) => `<td>${cell}</td>`)
                        .join("");
                      return `<tr>${cells}</tr>`;
                    })
                    .join("");

                  return `<div class="table-responsive">
                    <table>
                      <thead>${headerRow}</thead>
                      <tbody>${bodyRows}</tbody>
                    </table>
                  </div>`;
                } else {
                  // All rows are body rows
                  const bodyRows = rows
                    .map((row) => {
                      const cells = row
                        .map((cell) => `<td>${cell}</td>`)
                        .join("");
                      return `<tr>${cells}</tr>`;
                    })
                    .join("");

                  return `<div class="table-responsive">
                    <table>
                      <tbody>${bodyRows}</tbody>
                    </table>
                  </div>`;
                }
              }

              // Handle case where table data is in the rows property
              if (!block.data.rows || !Array.isArray(block.data.rows)) {
                return '<div class="table-responsive"><table><tbody><tr><td>No data</td></tr></tbody></table></div>';
              }

              // If there are at least two rows, use the first row as header
              if (block.data.rows.length >= 2) {
                // Get header row
                const headerRow = block.data.rows[0];
                if (
                  !headerRow ||
                  !headerRow.cells ||
                  !Array.isArray(headerRow.cells)
                ) {
                  return '<div class="table-responsive"><table><tbody><tr><td>Invalid table data</td></tr></tbody></table></div>';
                }

                const headerCells = headerRow.cells
                  .map((cell) => `<th>${cell}</th>`)
                  .join("");

                // Process body rows separately
                const bodyRows = block.data.rows
                  .slice(1)
                  .map((row) => {
                    if (!row || !row.cells || !Array.isArray(row.cells)) {
                      return "<tr><td>Invalid row data</td></tr>";
                    }
                    const cells = row.cells
                      .map((cell) => `<td>${cell}</td>`)
                      .join("");
                    return `<tr>${cells}</tr>`;
                  })
                  .join("");

                return `<div class="table-responsive">
                  <table>
                    <thead><tr>${headerCells}</tr></thead>
                    <tbody>${bodyRows}</tbody>
                  </table>
                </div>`;
              } else {
                // Single row table, no header
                const bodyRows = block.data.rows
                  .map((row) => {
                    if (!row || !row.cells || !Array.isArray(row.cells)) {
                      return "<tr><td>Invalid row data</td></tr>";
                    }
                    const cells = row.cells
                      .map((cell) => `<td>${cell}</td>`)
                      .join("");
                    return `<tr>${cells}</tr>`;
                  })
                  .join("");

                return `<div class="table-responsive">
                  <table>
                    <tbody>${bodyRows}</tbody>
                  </table>
                </div>`;
              }
            }

            case "image":
              return `<img src="${block.data.file?.url || ""}" alt="${block.data.caption || ""}" />`;

            case "embed":
              return `<iframe src="${block.data.embed || ""}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;

            case "code": {
              const escapedCode =
                block.data.code
                  ?.replace(/&/g, "&amp;")
                  .replace(/</g, "&lt;")
                  .replace(/>/g, "&gt;")
                  .replace(/"/g, "&quot;")
                  .replace(/'/g, "&#039;") || "";
              return `<pre><code>${escapedCode}</code></pre>`;
            }

            default:
              return "";
          }
        } catch (error) {
          console.error(`Error processing block type ${block.type}:`, error);
          return "";
        }
      })
      .join("\n");
  }

  if (content === null || content === undefined) {
    return "";
  }

  return typeof content === "string" ? content : JSON.stringify(content || "");
}
