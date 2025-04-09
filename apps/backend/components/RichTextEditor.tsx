"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
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
  const editorRef = useRef<EditorJS | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [editorError, setEditorError] = useState<string | null>(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(initialValue);
  const mountedRef = useRef(false);

  // Update refs when props change
  useEffect(() => {
    onChangeRef.current = onChange;
    initialValueRef.current = initialValue;
  }, [onChange, initialValue]);

  // Safe method to destroy editor
  const safeDestroyEditor = useCallback(() => {
    if (!editorRef.current) return;

    try {
      if (typeof editorRef.current.destroy === "function") {
        editorRef.current.destroy();
      }
    } catch (error) {
      console.error("Error destroying editor:", error);
    } finally {
      editorRef.current = null;
    }
  }, []);

  // Initialize editor
  const initializeEditor = useCallback(async () => {
    if (!containerRef.current) return;

    // First make sure any existing editor is destroyed
    safeDestroyEditor();

    try {
      setEditorReady(false);
      setEditorError(null);

      // Process the initial value
      const data = normalizeContent(initialValueRef.current);

      // Dynamically import EditorJS to avoid SSR issues
      const { default: EditorJS } = await import("@editorjs/editorjs");

      // Make sure component is still mounted
      if (!containerRef.current || !mountedRef.current) return;

      // Initialize editor
      const editor = new EditorJS({
        holder: containerRef.current,
        tools: EDITOR_JS_TOOLS,
        data: data,
        placeholder,
        readOnly,
        autofocus: false,
        onChange: async () => {
          try {
            const savedData = await editor.save();
            if (savedData && mountedRef.current) {
              onChangeRef.current(savedData);
            }
          } catch (error) {
            console.error("Failed to save EditorJS data:", error);
          }
        },
        onReady: () => {
          if (mountedRef.current) {
            setEditorReady(true);
            editorRef.current = editor;
          }
        },
      });

      // Handle errors
      editor.isReady
        .then(() => {
          if (!mountedRef.current) {
            // Component unmounted during initialization, clean up
            try {
              editor.destroy();
            } catch (error) {
              console.error("Error destroying editor:", error);
            }
          }
        })
        .catch((error) => {
          console.error("Editor.js initialization failed:", error);
          if (mountedRef.current) {
            setEditorError("Failed to initialize editor");
          }
        });
    } catch (error) {
      console.error("Failed to initialize EditorJS:", error);
      if (mountedRef.current) {
        setEditorError("Failed to load editor");
      }
    }
  }, [placeholder, readOnly, safeDestroyEditor]);

  // Initialize editor on mount
  useEffect(() => {
    mountedRef.current = true;

    // Wait for DOM to be ready
    const timerId = setTimeout(() => {
      if (mountedRef.current) {
        initializeEditor();
      }
    }, 0);

    return () => {
      mountedRef.current = false;
      clearTimeout(timerId);
      safeDestroyEditor();
    };
  }, [initializeEditor, safeDestroyEditor]);

  // Handle AIGeneratedContent changes
  useEffect(() => {
    if (!editorRef.current || !AIGeneratedContent || !mountedRef.current)
      return;

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
              language: block.data.language || "typescript",
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
        id="editorjs-container"
        className={`border border-gray-300 rounded-md min-h-[300px] ${!editorReady ? "editor-loading" : ""}`}
      >
        {!editorReady && (
          <div className="flex items-center justify-center h-full min-h-[300px]">
            <span className="text-gray-400">
              {editorError || "Loading editor..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
