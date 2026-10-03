"use client";

import * as React from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const CLOUDINARY = ["res.cloudinary.com", "res-console.cloudinary.com"];
function optimizable(src: string) {
  try {
    return CLOUDINARY.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

/** Upload through the existing /api/upload route (Cloudinary), with progress. */
export function uploadFile(file: File, folder: string, onProgress?: (pct: number) => void): Promise<string> {
  return new Promise((resolve, reject) => {
    const body = new FormData();
    body.append("file", file);
    body.append("folder", folder);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/upload");
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress?.(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onerror = () => reject(new Error("Network error while uploading"));
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (data.success && data.url) resolve(data.url as string);
        else reject(new Error(data.error || `Upload failed (${xhr.status})`));
      } catch {
        reject(new Error(`Upload failed (${xhr.status})`));
      }
    };
    xhr.send(body);
  });
}

// Vercel rejects request bodies over 4.5 MB, so cap uploads below that.
export const MAX_IMAGE_MB = 4;

export function ImageField({
  id,
  value,
  onChange,
  folder,
  aspect = "aspect-video",
  busyExternal,
  describedBy,
  invalid,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  folder: string;
  aspect?: string;
  /** e.g. an AI image job is running */
  busyExternal?: boolean;
  describedBy?: string;
  invalid?: boolean;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [progress, setProgress] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [localPreview, setLocalPreview] = React.useState<string | null>(null);
  const busy = progress !== null || busyExternal;

  const pick = async (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (PNG, JPG, WebP or GIF).");
      return;
    }
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
      toast.error(`That image is over ${MAX_IMAGE_MB} MB.`);
      return;
    }
    const preview = URL.createObjectURL(file);
    setLocalPreview(preview);
    setProgress(0);
    try {
      const url = await uploadFile(file, folder, setProgress);
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setProgress(null);
      setLocalPreview(null);
      URL.revokeObjectURL(preview);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const shown = localPreview ?? value;

  return (
    <div className="space-y-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative overflow-hidden rounded-[var(--radius-ctl)] border bg-surface-2 transition-colors",
          aspect,
          dragging ? "border-accent" : invalid ? "border-danger" : "border-line border-dashed"
        )}
      >
        {shown ? (
          optimizable(shown) ? (
            <Image src={shown} alt="Banner preview" fill sizes="340px" className="object-cover" />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Banner preview" className="absolute inset-0 size-full object-cover" />
          )
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center text-muted">
            <ImagePlus className="size-5" aria-hidden="true" />
            <p className="text-xs">Drop an image here, or choose a file</p>
            <p className="mono text-[11px]">PNG · JPG · WebP · up to {MAX_IMAGE_MB} MB</p>
          </div>
        )}
        {busy ? (
          <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-[color-mix(in_srgb,var(--paper)_75%,transparent)]">
            <Loader2 className="size-5 animate-spin" aria-hidden="true" />
            <p className="mono text-xs">{progress !== null ? `Uploading ${progress}%` : "Generating…"}</p>
          </div>
        ) : null}
      </div>
      <div className="flex items-center gap-2">
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept="image/*"
          className="sr-only"
          aria-describedby={describedBy}
          aria-invalid={invalid || undefined}
          onChange={(e) => pick(e.target.files?.[0])}
          disabled={busy}
        />
        <label
          htmlFor={id}
          className={cn("btn btn-sm cursor-pointer focus-within:outline-2", busy && "pointer-events-none opacity-50", "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent has-[:focus-visible]:outline-offset-2")}
        >
          <Upload className="size-3.5" aria-hidden="true" /> {value ? "Replace" : "Upload"}
        </label>
        {value ? (
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => onChange("")} disabled={busy}>
            <Trash2 className="size-3.5" aria-hidden="true" /> Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}
