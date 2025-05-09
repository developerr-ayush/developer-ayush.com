import edjsHTML from "editorjs-html";
import type { OutputData, OutputBlockData } from "@editorjs/editorjs";
// Import only the types we need
import "@editorjs/header";
import "@editorjs/list";
import "@editorjs/image";
import "@editorjs/quote";
import "@editorjs/paragraph";
import "@editorjs/code";
import "@editorjs/delimiter";
import "@editorjs/table";
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
import * as editorjsTable from "@editorjs/table";

// Define custom interface for table data to handle both formats
interface TableData extends OutputBlockData<string, any> {
  content?: string[][];
  rows?: Array<{ cells: string[] } | string[]>;
  withHeadings?: boolean;
  stretched?: boolean;
}

// Initialize the EditorJS HTML parser
const edjsParser = edjsHTML({
  table: (data: TableData) => {
    // If no data or no content/rows, return empty table
    if (!data) {
      return '<div class="table-responsive"><table class="table"><tbody><tr><td>No data</td></tr></tbody></table></div>';
    }

    let tableRows: string[][] = [];

    // Handle new format with content property (2D array)
    if (data.content && Array.isArray(data.content)) {
      tableRows = data.content;
    }
    // Handle old format with rows property
    else if (data.rows && Array.isArray(data.rows)) {
      tableRows = data.rows.map((row) => {
        // If row is an object with cells property
        if (
          row &&
          typeof row === "object" &&
          "cells" in row &&
          Array.isArray(row.cells)
        ) {
          return row.cells;
        }
        // If row is directly an array (older format)
        else if (Array.isArray(row)) {
          return row;
        }
        // Fallback
        return ["Empty cell"];
      });
    }
    // Fallback if neither format is detected
    else {
      tableRows = [["No data available"]];
    }

    // Ensure we have at least one row
    if (tableRows.length === 0) {
      tableRows = [["No data available"]];
    }

    // Get the headers from the first row if withHeadings is true
    const hasHeaders = data.withHeadings === true;
    let headerHtml = "";

    if (hasHeaders && tableRows.length > 0) {
      const firstRow = tableRows[0] || [];
      const headers = firstRow.map((cell) => `<th>${cell}</th>`).join("");
      headerHtml = `<thead><tr>${headers}</tr></thead>`;
      // Remove the header row from the data rows
      tableRows = tableRows.slice(1);
    }

    // Process the data rows
    const bodyRows = tableRows
      .map((row) => {
        const cells = row.map((cell) => `<td>${cell}</td>`).join("");
        return `<tr>${cells}</tr>`;
      })
      .join("");

    return `<div class="table-responsive">
      <table class="table${data.stretched ? " table-stretched" : ""}">
        ${headerHtml}
        <tbody>${bodyRows}</tbody>
      </table>
    </div>`;
  },
});

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
  table: {
    class: editorjsTable.default,
    inlineToolbar: true,
    config: {
      rows: 2,
      cols: 3,
    },
  } as any,
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
  code: {
    class: editorjsCode.default,
    config: {
      placeholder: "Enter code here",
      language: "auto",
    },
  },
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
 * Normalize table data to ensure compatibility with EditorJS table format
 * @param tableData - Table data in various formats
 * @returns Properly formatted table data for EditorJS
 */
export function normalizeTableData(tableData: any): any {
  // Return the new format if it's already correct
  if (
    tableData.withHeadings !== undefined &&
    tableData.content &&
    Array.isArray(tableData.content)
  ) {
    return tableData;
  }

  // If tableData is falsy, return a default table structure in new format
  if (!tableData) {
    return {
      withHeadings: false,
      stretched: false,
      content: [
        ["Header 1", "Header 2", "Header 3"],
        ["Cell 1", "Cell 2", "Cell 3"],
        ["Cell 4", "Cell 5", "Cell 6"],
      ],
    };
  }

  // Handle EditorJS standard format with content array
  if (tableData.content && Array.isArray(tableData.content)) {
    return {
      withHeadings: false,
      stretched: false,
      content: tableData.content,
    };
  }

  // Handle old format with rows property
  if (tableData.rows && Array.isArray(tableData.rows)) {
    // Convert the rows/cells structure to content 2D array
    const content = tableData.rows.map((row) => {
      if (
        row &&
        typeof row === "object" &&
        "cells" in row &&
        Array.isArray(row.cells)
      ) {
        return row.cells;
      }
      if (Array.isArray(row)) {
        return row;
      }
      return ["Empty cell"];
    });

    return {
      withHeadings: false,
      stretched: false,
      content,
    };
  }

  // Handle array of arrays format (old content format)
  if (Array.isArray(tableData)) {
    return {
      withHeadings: false,
      stretched: false,
      content: tableData,
    };
  }

  // Last resort fallback - just create a default table
  return {
    withHeadings: false,
    stretched: false,
    content: [
      ["Header 1", "Header 2", "Header 3"],
      ["Data 1", "Data 2", "Data 3"],
      ["Data 4", "Data 5", "Data 6"],
    ],
  };
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
      // Process blocks to ensure table blocks have the correct format
      const normalizedBlocks = content.blocks.map((block) => {
        if (block.type === "table" && block.data) {
          return {
            ...block,
            data: normalizeTableData(block.data),
          };
        }
        return block;
      });

      return {
        ...content,
        blocks: normalizedBlocks,
      };
    }
    return convertPlainTextToEditorJs(JSON.stringify(content));
  }

  // If content is a string, check if it's JSON
  if (typeof content === "string") {
    if (isValidJson(content)) {
      const parsed = JSON.parse(content);
      if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
        // Process blocks to ensure table blocks have the correct format
        const normalizedBlocks = parsed.blocks.map((block) => {
          if (block.type === "table" && block.data) {
            return {
              ...block,
              data: normalizeTableData(block.data),
            };
          }
          return block;
        });

        return {
          ...parsed,
          blocks: normalizedBlocks,
        };
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
