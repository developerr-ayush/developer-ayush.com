"use client";

import * as React from "react";
import type EditorJS from "@editorjs/editorjs";
import type { OutputBlockData, OutputData } from "@editorjs/editorjs";
import { EDITOR_JS_TOOLS, normalizeContent, normalizeTableData } from "../lib/editorjs";
import { toast } from "../lib/toast";
import { uploadFile } from "./admin/ImageField";
import "./editor/post-canvas.css";

export interface RichTextEditorHandle {
  /** Replace the whole document */
  render: (data: OutputData) => Promise<void>;
  /** Append blocks to the end of the document */
  append: (blocks: OutputBlockData[]) => Promise<void>;
  /** Current document, or null if the editor isn't ready */
  save: () => Promise<OutputData | null>;
}

interface RichTextEditorProps {
  initialValue?: OutputData | null;
  /** Fired on every user edit with the saved document */
  onChange: (data: OutputData) => void;
  /** Fired once with the normalised starting document */
  onReady?: (data: OutputData) => void;
  placeholder?: string;
  readOnly?: boolean;
}

/** AI output uses `text` for code and loose table shapes; normalise before rendering. */
function processBlocks(blocks: OutputBlockData[] | undefined): OutputBlockData[] {
  return (blocks ?? []).map((block) => {
    if (block.type === "code" && block.data) {
      return {
        ...block,
        data: {
          ...block.data,
          code: block.data.text || block.data.code || "",
          language: block.data.language || "typescript",
        },
      };
    }
    if (block.type === "table" && block.data) {
      return { ...block, data: normalizeTableData(block.data) };
    }
    return block;
  });
}

// Editor.js's image tool used to inline images as base64 data URLs, bloating
// the stored post. Upload to Cloudinary instead and keep the stored shape ({ file: { url } }).
const TOOLS = {
  ...EDITOR_JS_TOOLS,
  image: {
    ...EDITOR_JS_TOOLS.image,
    config: {
      uploader: {
        async uploadByFile(file: File) {
          try {
            const url = await uploadFile(file, "blog");
            return { success: 1, file: { url } };
          } catch (e) {
            toast.error(e instanceof Error ? `${e.message} — image not added.` : "Image upload failed");
            return { success: 0 };
          }
        },
        uploadByUrl(url: string) {
          return Promise.resolve({ success: 1, file: { url } });
        },
      },
    },
  },
};

const RichTextEditor = React.forwardRef<RichTextEditorHandle, RichTextEditorProps>(function RichTextEditor(
  { initialValue, onChange, onReady, placeholder = "Start writing, or press Tab for blocks…", readOnly = false },
  ref
) {
  const holderRef = React.useRef<HTMLDivElement>(null);
  const editorRef = React.useRef<EditorJS | null>(null);
  const [ready, setReady] = React.useState(false);
  const [failed, setFailed] = React.useState<string | null>(null);
  const onChangeRef = React.useRef(onChange);
  const onReadyRef = React.useRef(onReady);
  const initialRef = React.useRef(initialValue);
  const quietRef = React.useRef(true);

  React.useEffect(() => {
    onChangeRef.current = onChange;
    onReadyRef.current = onReady;
  });

  React.useImperativeHandle(
    ref,
    () => ({
      async render(data) {
        const editor = editorRef.current;
        if (!editor) return;
        await editor.isReady;
        quietRef.current = true;
        await editor.render({ ...data, blocks: processBlocks(data.blocks) });
        const saved = await editor.save();
        quietRef.current = false;
        onChangeRef.current(saved);
      },
      async append(blocks) {
        const editor = editorRef.current;
        if (!editor) return;
        await editor.isReady;
        const current = await editor.save();
        quietRef.current = true;
        await editor.render({ ...current, blocks: [...current.blocks, ...processBlocks(blocks)] });
        const saved = await editor.save();
        quietRef.current = false;
        onChangeRef.current(saved);
      },
      async save() {
        const editor = editorRef.current;
        if (!editor) return null;
        await editor.isReady;
        return editor.save();
      },
    }),
    []
  );

  React.useEffect(() => {
    let cancelled = false;
    let instance: EditorJS | null = null;

    (async () => {
      try {
        const { default: EditorJSClass } = await import("@editorjs/editorjs");
        if (cancelled || !holderRef.current) return;
        const data = normalizeContent(initialRef.current ?? undefined);
        instance = new EditorJSClass({
          holder: holderRef.current,
          tools: TOOLS,
          data,
          placeholder,
          readOnly,
          autofocus: false,
          onChange: async () => {
            if (quietRef.current || !instance) return;
            try {
              const saved = await instance.save();
              if (!cancelled) onChangeRef.current(saved);
            } catch (err) {
              console.error("Failed to save Editor.js data:", err);
            }
          },
        });
        editorRef.current = instance;
        await instance.isReady;
        if (cancelled) return;
        const first = await instance.save();
        onReadyRef.current?.(first);
        // Editor.js can emit a change while it mounts; ignore that window.
        setTimeout(() => {
          quietRef.current = false;
        }, 250);
        setReady(true);
      } catch (err) {
        console.error("Editor.js failed to start:", err);
        if (!cancelled) setFailed("The editor failed to load. Reload the page to try again.");
      }
    })();

    return () => {
      cancelled = true;
      try {
        const e = instance as (EditorJS & { destroy?: () => void }) | null;
        e?.destroy?.();
      } catch (err) {
        console.error("Error destroying editor:", err);
      }
      editorRef.current = null;
    };
    // The editor owns its document after mount; later prop changes go through the handle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="post-canvas relative" aria-busy={!ready && !failed}>
      <div ref={holderRef} aria-label="Post content editor" />
      {!ready && !failed ? (
        <div className="absolute inset-0 space-y-4 pt-2" aria-hidden="true">
          <div className="skeleton h-5 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
          <div className="skeleton h-4 w-4/5" />
        </div>
      ) : null}
      {failed ? (
        <p role="alert" className="text-sm text-danger">
          {failed}
        </p>
      ) : null}
    </div>
  );
});

export default RichTextEditor;
