"use client";

import * as React from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, Copy, ImagePlus, Loader2, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { MAX_IMAGE_MB, uploadFile } from "@/components/admin/ImageField";
import { toast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const FOLDERS = [
  { value: "blog", label: "blog — post images" },
  { value: "blog-banners", label: "blog-banners — post banners" },
  { value: "products", label: "products — product images" },
];

interface Item {
  id: string;
  file: File;
  preview: string;
  state: "queued" | "uploading" | "done" | "error";
  progress: number;
  url?: string;
  error?: string;
}

const CLOUDINARY = ["res.cloudinary.com", "res-console.cloudinary.com"];
const optimizable = (u: string) => {
  try {
    return CLOUDINARY.includes(new URL(u).hostname);
  } catch {
    return false;
  }
};

export default function UploadManager() {
  const [folder, setFolder] = React.useState("blog");
  const [items, setItems] = React.useState<Item[]>([]);
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const running = React.useRef(false);
  const itemsRef = React.useRef(items);
  itemsRef.current = items;

  const patch = (id: string, p: Partial<Item>) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const pump = React.useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      for (;;) {
        const next = itemsRef.current.find((i) => i.state === "queued");
        if (!next) break;
        patch(next.id, { state: "uploading", progress: 0 });
        try {
          const url = await uploadFile(next.file, folder, (p) => patch(next.id, { progress: p }));
          patch(next.id, { state: "done", url, progress: 100 });
        } catch (e) {
          patch(next.id, { state: "error", error: e instanceof Error ? e.message : "Upload failed" });
        }
      }
    } finally {
      running.current = false;
    }
  }, [folder]);

  const add = (files: FileList | File[]) => {
    const accepted: Item[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) {
        toast.error(`“${f.name}” isn't an image.`);
        continue;
      }
      if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
        toast.error(`“${f.name}” is over ${MAX_IMAGE_MB} MB.`);
        continue;
      }
      accepted.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, file: f, preview: URL.createObjectURL(f), state: "queued", progress: 0 });
    }
    if (!accepted.length) return;
    setItems((cur) => [...accepted, ...cur]);
    // let state settle, then start the queue
    setTimeout(pump, 0);
  };

  React.useEffect(
    () => () => {
      itemsRef.current.forEach((i) => URL.revokeObjectURL(i.preview));
    },
    []
  );

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Couldn't copy. Select the URL and copy it manually.");
    }
  };

  const retry = (id: string) => {
    patch(id, { state: "queued", error: undefined, progress: 0 });
    setTimeout(pump, 0);
  };

  const remove = (id: string) =>
    setItems((cur) => {
      const gone = cur.find((i) => i.id === id);
      if (gone) URL.revokeObjectURL(gone.preview);
      return cur.filter((i) => i.id !== id);
    });

  const done = items.filter((i) => i.state === "done");

  return (
    <div className="space-y-6">
      <section className="card space-y-5 p-5" aria-labelledby="u-h">
        <h2 id="u-h" className="sr-only">
          Upload images
        </h2>
        <Field id="u-folder" label="Cloudinary folder" className="max-w-sm">
          <Select id="u-folder" value={folder} onChange={(e) => setFolder(e.target.value)}>
            {FOLDERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </Select>
        </Field>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            add(e.dataTransfer.files);
          }}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-[var(--radius-card)] border border-dashed px-6 py-12 text-center transition-colors",
            dragging ? "border-accent bg-[color-mix(in_srgb,var(--accent)_6%,transparent)]" : "border-line bg-surface-2"
          )}
        >
          <ImagePlus className="size-6 text-muted" aria-hidden="true" />
          <p className="text-[13.5px]">Drop images here, or</p>
          <input ref={inputRef} id="u-files" type="file" accept="image/*" multiple className="sr-only" onChange={(e) => {
              if (e.target.files) add(e.target.files);
              e.target.value = "";
            }} />
          <label htmlFor="u-files" className="btn btn-primary cursor-pointer has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent">
            Choose files
          </label>
          <p className="mono text-[11px] text-muted">PNG · JPG · WebP · GIF · up to {MAX_IMAGE_MB} MB each</p>
        </div>
      </section>

      <section aria-labelledby="u-list" className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 id="u-list" className="text-[15px] font-semibold tracking-tight">
            This session
          </h2>
          <p className="mono text-xs text-muted" aria-live="polite">
            {done.length}/{items.length} uploaded
          </p>
        </div>
        {items.length === 0 ? (
          <div className="card px-6 py-10 text-center">
            <p className="font-serif text-[1.5rem]">Nothing uploaded yet</p>
            <p className="mt-1.5 text-sm text-muted">Uploaded images appear here with a copyable URL. The list resets when you leave the page.</p>
          </div>
        ) : (
          <ul className="card divide-y divide-line">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 p-3">
                <div className="relative size-14 shrink-0 overflow-hidden rounded-md border border-line bg-surface-2">
                  {i.url && optimizable(i.url) ? (
                    <Image src={i.url} alt="" fill sizes="56px" className="object-cover" />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={i.preview} alt="" className="size-full object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">{i.file.name}</p>
                  {i.state === "done" ? (
                    <p className="mono mt-0.5 flex items-center gap-1.5 truncate text-[11.5px] text-ok">
                      <CheckCircle2 className="size-3.5 shrink-0" aria-hidden="true" />
                      <span className="truncate text-muted">{i.url}</span>
                    </p>
                  ) : i.state === "error" ? (
                    <p role="alert" className="mt-0.5 flex items-center gap-1.5 text-xs text-danger">
                      <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" /> {i.error}
                    </p>
                  ) : (
                    <div className="mt-1.5 flex items-center gap-2" role="status">
                      {i.state === "uploading" ? <Loader2 className="size-3.5 animate-spin text-accent" aria-hidden="true" /> : null}
                      <div className="h-1 w-32 overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${i.progress}%` }} />
                      </div>
                      <span className="mono text-xs text-muted">{i.state === "queued" ? "queued" : `${i.progress}%`}</span>
                    </div>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {i.state === "done" && i.url ? (
                    <Button size="sm" onClick={() => copy(i.url!)}>
                      <Copy className="size-3.5" aria-hidden="true" /> Copy URL
                    </Button>
                  ) : null}
                  {i.state === "error" ? (
                    <Button size="sm" onClick={() => retry(i.id)}>
                      <RotateCcw className="size-3.5" aria-hidden="true" /> Retry
                    </Button>
                  ) : null}
                  <Button size="icon-sm" variant="ghost" aria-label={`Remove ${i.file.name} from the list`} onClick={() => remove(i.id)} disabled={i.state === "uploading"}>
                    <X className="size-4" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
