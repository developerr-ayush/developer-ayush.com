"use client";

import React, { useRef, useEffect, useState } from "react";
import { EDITOR_JS_TOOLS, normalizeContent } from "../lib/editorjs";
import type EditorJS from "@editorjs/editorjs";
import { OutputData } from "@editorjs/editorjs";
import "../app/blog-content.css";
interface RichTextEditorProps {
  initialValue?: {
    blocks: { type: string; data: object }[];
    time: number;
    version: string;
  };
  onChange: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
  AIGeneratedContent?: OutputData | null | undefined;
}

export default function RichTextEditor({
  initialValue,
  onChange,
  placeholder = "Start writing your content here...",
  readOnly = false,
  AIGeneratedContent,
}: RichTextEditorProps) {
  console.log("initialValue", initialValue);
  const editorRef = useRef<EditorJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [initialData, setInitialData] = useState<OutputData | null>(null);
  const hasInitialized = useRef(false);

  // Initialize editor with initial data
  useEffect(() => {
    if (!containerRef.current) return;

    // Prevent double initialization in development due to StrictMode
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // Process the initial value
    const data = normalizeContent(initialValue);
    setInitialData(data || initialData);

    // Clean up previous editor instance if it exists
    if (editorRef.current) {
      editorRef.current.destroy();
      editorRef.current = null;
    }

    // Dynamically import EditorJS to avoid SSR issues
    import("@editorjs/editorjs").then(({ default: EditorJS }) => {
      if (!containerRef.current) return;

      try {
        // Initialize editor
        const editor = new EditorJS({
          holder: containerRef.current,
          tools: EDITOR_JS_TOOLS,
          data: data || initialData,
          placeholder,
          readOnly,
          onChange: async () => {
            try {
              const savedData = await editorRef.current?.save();
              console.log("savedData", savedData);
              if (savedData) {
                onChange(savedData);
              }
            } catch (error) {
              console.error("Failed to save EditorJS data:", error);
            }
          },
          onReady: () => {
            setEditorReady(true);
          },
        });

        editorRef.current = editor;
      } catch (error) {
        console.error("Failed to initialize EditorJS:", error);
      }
    });

    // Cleanup on component unmount
    return () => {
      if (editorRef.current?.destroy) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialValue, placeholder, readOnly, onChange, initialData]);

  // Handle AIGeneratedContent changes
  useEffect(() => {
    if (!editorRef.current || !AIGeneratedContent) return;

    console.log("Rendering AI content:", AIGeneratedContent);

    // Ensure code blocks have the correct structure
    const processedContent = {
      ...AIGeneratedContent,
      blocks: AIGeneratedContent.blocks?.map((block) => {
        if (block.type === "code" && block.data) {
          // Ensure code blocks have text property
          return {
            ...block,
            data: {
              ...block.data,
              code: block.data.text || block.data.code || "",
            },
          };
        }
        return block;
      }),
    };

    try {
      editorRef.current.clear();
      editorRef.current.render(processedContent).catch((error) => {
        console.error("Failed to render editor content:", error);
      });
    } catch (error) {
      console.error("Error rendering editor content:", error);
    }
  }, [AIGeneratedContent]);

  return (
    <div className="rich-text-editor blog-content">
      <div
        ref={containerRef}
        className={`border border-gray-300 rounded-md min-h-[300px] ${!editorReady ? "editor-loading" : ""}`}
      >
        {!editorReady && (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <span className="text-gray-400">Loading editor...</span>
          </div>
        )}
      </div>
    </div>
  );
}
