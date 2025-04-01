"use client";

import React, { useRef, useEffect, useState } from "react";
import { EDITOR_JS_TOOLS, normalizeContent } from "../lib/editorjs";
import type EditorJS from "@editorjs/editorjs";
import { OutputData } from "@editorjs/editorjs";

interface RichTextEditorProps {
  initialValue?: {
    blocks: { type: string; data: object }[];
    time: number;
    version: string;
  };
  onChange: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
}

export default function RichTextEditor({
  initialValue,
  onChange,
  placeholder = "Start writing your content here...",
  readOnly = false,
}: RichTextEditorProps) {
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
          data,
          placeholder,
          readOnly,
          onChange: async () => {
            try {
              const savedData = await editorRef.current?.save();
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
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, [initialValue, placeholder, readOnly]);

  return (
    <div className="rich-text-editor">
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
