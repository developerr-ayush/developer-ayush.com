/* eslint-disable react/prop-types -- props are typed with TypeScript */
"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ExternalLink, Loader2, Sparkles, Trash2, TriangleAlert } from "lucide-react";
import type { OutputData } from "@editorjs/editorjs";
import { Button } from "@/components/ui/button";
import { Field, fieldA11y } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog } from "@/components/ui/dialog";
import { useConfirm } from "@/components/ui/confirm";
import { ImageField } from "@/components/admin/ImageField";
import { MultiSelect } from "@/components/admin/MultiSelect";
import { TagInput } from "@/components/admin/TagInput";
import { SaveBar, type SaveState } from "@/components/admin/SaveBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { useAdminUser } from "@/components/admin/user-context";
import type { RichTextEditorHandle } from "@/components/RichTextEditor";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useDebounced } from "@/hooks/use-debounced";
import { autoSaveBlog, approveBlog, deleteBlog, publishBlog, updateBlog } from "@/actions/blog";
import { checkSlugAvailable, checkTitleAvailable, setBlogCategories } from "@/actions/admin";
import { blogSchema } from "@/schemas";
import { postUrl, slugify } from "@/lib/format";
import { toast } from "@/lib/toast";
import { AISheet, type AIResult } from "./ai-sheet";

// Editor.js is heavy: load it (and all its tools) only when the editor mounts.
const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="space-y-4 pt-2" aria-hidden="true">
      <div className="skeleton h-5 w-2/3" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-4 w-11/12" />
    </div>
  ),
}) as React.ForwardRefExoticComponent<
  React.ComponentProps<typeof import("@/components/RichTextEditor").default> & React.RefAttributes<RichTextEditorHandle>
>;

const SEO_LENGTH = 160;

const postSchema = z
  .object({
    title: z.string().trim().min(10, "Title needs at least 10 characters").max(255, "Title must be under 255 characters"),
    slug: z
      .string()
      .trim()
      .min(1, "A slug is required")
      .max(120, "Slug is too long")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens"),
    description: z.string().max(1000, "Keep the description under 1000 characters"),
    banner: z.string(),
    categories: z.array(z.string()),
    tags: z.string(),
    status: z.enum(["draft", "published", "archived"]),
  })
  .superRefine((v, ctx) => {
    if (v.status === "published") {
      if (!v.banner) ctx.addIssue({ code: "custom", path: ["banner"], message: "Add a banner image before publishing" });
      if (v.categories.length === 0) ctx.addIssue({ code: "custom", path: ["categories"], message: "Pick at least one category before publishing" });
    }
  });
type PostValues = z.infer<typeof postSchema>;

export interface EditorPost {
  id: string;
  title: string;
  slug: string;
  description: string;
  banner: string;
  tags: string;
  status: "draft" | "published" | "archived";
  approved: boolean;
  content: string | null;
  categories: string[];
  authorName: string | null;
  authorEmail: string;
  authorRole: "SUPER_ADMIN" | "ADMIN" | "USER";
}

type SlugState = "idle" | "checking" | "available" | "taken" | "invalid";

function safeParse(content: string | null): OutputData | null {
  if (!content) return null;
  try {
    const parsed = JSON.parse(content);
    return parsed && Array.isArray(parsed.blocks) ? parsed : null;
  } catch {
    return null;
  }
}

const blocksSig = (d: OutputData | null) => JSON.stringify(d?.blocks ?? []);

export default function PostEditor({ post, allCategories }: { post?: EditorPost; allCategories: string[] }) {
  const router = useRouter();
  const user = useAdminUser();
  const confirm = useConfirm();
  const isAdmin = user.isAdmin;
  const isAuthor = !post || post.authorEmail === user.email;

  const editorRef = React.useRef<RichTextEditorHandle>(null);
  const idRef = React.useRef<string | undefined>(post?.id);
  const persistedStatus = React.useRef<"draft" | "published" | "archived" | null>(post?.status ?? null);
  const savingRef = React.useRef(false);
  const slugTouched = React.useRef(!!post);

  const initial = React.useMemo(() => safeParse(post?.content ?? null), [post?.content]);
  const defaults = React.useMemo<PostValues>(
    () => ({
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      description: post?.description ?? "",
      banner: post?.banner ?? "",
      categories: post?.categories ?? [],
      tags: post?.tags ?? "",
      status: post?.status ?? "draft",
    }),
    [post]
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    setFocus,
    formState: { errors },
  } = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues: defaults, mode: "onTouched" });

  const values = useWatch({ control }) as PostValues;
  const metaSig = JSON.stringify([values.title, values.slug, values.description, values.banner, values.categories, values.tags, values.status]);
  const baseMeta = React.useRef(metaSig);
  const baseContent = React.useRef<string | null>(null);
  const [contentSig, setContentSig] = React.useState<string | null>(null);
  const [hasContent, setHasContent] = React.useState(!!initial?.blocks?.length);
  const [editorReady, setEditorReady] = React.useState(false);

  const [saveState, setSaveState] = React.useState<SaveState>({ kind: "clean", at: null });
  const [slugState, setSlugState] = React.useState<SlugState>("idle");
  const [aiOpen, setAiOpen] = React.useState(false);
  const [leaveHref, setLeaveHref] = React.useState<string | null>(null);
  const [aiBannerBusy] = React.useState(false);

  const dirty = editorReady && (metaSig !== baseMeta.current || (contentSig !== null && contentSig !== baseContent.current));

  // Mirror dirtiness into the save bar (unless a save is in flight / failed)
  React.useEffect(() => {
    setSaveState((s) => {
      if (s.kind === "saving") return s;
      if (dirty) return s.kind === "dirty" ? s : { kind: "dirty" };
      return s.kind === "dirty" ? { kind: "clean", at: null } : s;
    });
  }, [dirty]);

  useUnsavedChanges(dirty, setLeaveHref);

  // ── Slug: auto from title until the author edits it ─────────
  const title = values.title ?? "";
  React.useEffect(() => {
    if (!slugTouched.current) setValue("slug", slugify(title), { shouldValidate: false });
  }, [title, setValue]);

  const debouncedSlug = useDebounced(values.slug ?? "", 400);
  React.useEffect(() => {
    let live = true;
    if (!debouncedSlug) {
      setSlugState("idle");
      return;
    }
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(debouncedSlug)) {
      setSlugState("invalid");
      return;
    }
    setSlugState("checking");
    checkSlugAvailable(debouncedSlug, idRef.current)
      .then((r) => live && setSlugState(r.available ? "available" : "taken"))
      .catch(() => live && setSlugState("idle"));
    return () => {
      live = false;
    };
  }, [debouncedSlug]);
  // Titles are unique in the database; surface a clash before saving instead of after.
  const [titleTaken, setTitleTaken] = React.useState(false);
  const debouncedTitle = useDebounced(title, 500);
  React.useEffect(() => {
    let live = true;
    if (debouncedTitle.trim().length < 3) {
      setTitleTaken(false);
      return;
    }
    checkTitleAvailable(debouncedTitle, idRef.current)
      .then((r) => live && setTitleTaken(!r.available))
      .catch(() => live && setTitleTaken(false));
    return () => {
      live = false;
    };
  }, [debouncedTitle]);
  const titleError = errors.title?.message ?? (titleTaken && debouncedTitle === title ? "Another post already has this title" : undefined);
  const slugPending = (values.slug ?? "") !== debouncedSlug;

  // ── Save ────────────────────────────────────────────────────
  const snapshot = async () => {
    const content = (await editorRef.current?.save()) ?? initial ?? { blocks: [] };
    return { content: content as OutputData, v: getValues() };
  };

  const persist = async (v: PostValues) => {
    if (savingRef.current) return;
    savingRef.current = true;
    setSaveState({ kind: "saving" });
    try {
      const { content } = await snapshot();
      const contentStr = JSON.stringify(content);

      if (slugState === "taken") throw new Error("That slug is already used by another post.");
      if (titleTaken) throw new Error("Another post already has this title.");

      let id = idRef.current;
      if (!id) {
        const created = await autoSaveBlog({ title: v.title, content: contentStr, description: v.description, banner: v.banner, tags: v.tags });
        if (created.error || !("blog" in created) || !created.blog) throw new Error(created.error ?? "Could not create the post");
        id = created.blog.id;
        idRef.current = id;
      }

      const res = await updateBlog(
        {
          title: v.title,
          content: contentStr,
          description: v.description,
          banner: v.banner,
          status: v.status,
          slug: v.slug,
          tags: v.tags,
          categories: v.categories,
          date: new Date(),
        } as unknown as z.infer<typeof blogSchema>,
        id
      );
      if (res.error) throw new Error(res.error);

      const cats = await setBlogCategories(id, v.categories);
      if (cats.error) throw new Error(cats.error);

      persistedStatus.current = isAdmin ? v.status : "draft";
      baseMeta.current = JSON.stringify([v.title, v.slug, v.description, v.banner, v.categories, v.tags, v.status]);
      baseContent.current = blocksSig(content);
      setContentSig(blocksSig(content));
      setSaveState({ kind: "clean", at: new Date() });
      toast.success(v.status === "published" ? "Post saved and live" : "Post saved");
      if (!post && typeof window !== "undefined") window.history.replaceState(null, "", `/admin/blog/${id}`);
      router.refresh();
    } catch (e) {
      const message = e instanceof Error ? e.message : "Save failed";
      setSaveState({ kind: "error", message });
      toast.error(message);
    } finally {
      savingRef.current = false;
    }
  };

  const save = handleSubmit(persist, (errs) => {
    toast.error("Fix the highlighted fields to save.");
    const first = (["title", "slug", "description", "banner", "categories"] as const).find((k) => errs[k]);
    if (first) setFocus(first);
  });

  // ⌘S / Ctrl+S
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  // ── Autosave (drafts only: never silently edits live content) ──
  React.useEffect(() => {
    if (!dirty || savingRef.current) return;
    if (persistedStatus.current && persistedStatus.current !== "draft") return;
    if (titleTaken) return;
    if (values.status !== "draft") return;
    const t = setTimeout(async () => {
      if (savingRef.current) return;
      const { content, v } = await snapshot();
      if (!v.title.trim() && !content.blocks.length) return;
      savingRef.current = true;
      setSaveState({ kind: "saving" });
      const sigNow = JSON.stringify([v.title, v.slug, v.description, v.banner, v.categories, v.tags, v.status]);
      try {
        const res = await autoSaveBlog(
          {
            title: v.title || undefined,
            description: v.description,
            banner: v.banner,
            tags: v.tags,
            categories: v.categories,
            content: JSON.stringify(content) as unknown as undefined,
            ...(slugState === "available" ? { slug: v.slug } : {}),
          },
          idRef.current
        );
        if (res.error || !("blog" in res) || !res.blog) throw new Error(res.error ?? "Autosave failed");
        idRef.current = res.blog.id;
        persistedStatus.current = "draft";
        baseMeta.current = sigNow;
        baseContent.current = blocksSig(content);
        setContentSig(blocksSig(content));
        setSaveState({ kind: "clean", at: new Date(), auto: true });
        if (!post && typeof window !== "undefined") window.history.replaceState(null, "", `/admin/blog/${res.blog.id}`);
      } catch (e) {
        setSaveState({ kind: "error", message: e instanceof Error ? `Autosave failed — ${e.message}` : "Autosave failed" });
      } finally {
        savingRef.current = false;
      }
    }, 2500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [metaSig, contentSig, dirty]);

  // ── AI results ──────────────────────────────────────────────
  const fillMeta = (r: AIResult, overwrite: boolean) => {
    const opts = { shouldDirty: true, shouldValidate: true } as const;
    const cur = getValues();
    if (overwrite || !cur.title.trim()) setValue("title", r.title, opts);
    if (overwrite || !cur.description.trim()) setValue("description", r.description ?? "", opts);
    if (overwrite || !cur.tags.trim()) setValue("tags", r.tags ?? "", opts);
    if (overwrite || cur.categories.length === 0) setValue("categories", (r.categories ?? []).map((c) => c.toLowerCase()), opts);
    if (overwrite && (r.slug || r.title) && !post) {
      slugTouched.current = true;
      setValue("slug", slugify(r.slug || r.title), opts);
    }
  };

  const onContent = React.useCallback((d: OutputData) => {
    setContentSig(blocksSig(d));
    setHasContent(d.blocks.length > 0);
  }, []);

  // ── Banner/status helpers ───────────────────────────────────
  const canPublish = isAdmin;
  const statusNow = values.status ?? "draft";
  const alreadyLive = persistedStatus.current === "published";
  const primaryLabel =
    statusNow === "published" ? (alreadyLive ? "Update post" : "Publish") : statusNow === "archived" ? "Save & archive" : "Save draft";
  const busy = saveState.kind === "saving";
  const previewable = !!post && post.status === "published" && !!values.slug;

  const descLen = (values.description ?? "").length;
  const descTone = descLen > 1000 ? "text-danger" : descLen > SEO_LENGTH ? "text-warn" : "text-muted";

  const slugMsg = (() => {
    if (errors.slug) return null;
    if (slugPending || slugState === "checking") return { icon: <Loader2 className="size-3.5 animate-spin" />, text: "Checking…", cls: "text-muted" };
    if (slugState === "available") return { icon: <CheckCircle2 className="size-3.5" />, text: "Available", cls: "text-ok" };
    if (slugState === "taken") return { icon: <TriangleAlert className="size-3.5" />, text: "Already used by another post", cls: "text-danger" };
    return null;
  })();

  const removePost = async () => {
    if (!idRef.current) return;
    const ok = await confirm({
      title: "Delete this post?",
      description: "It will be permanently removed from the site and the database. This cannot be undone.",
      confirmLabel: "Delete post",
      destructive: true,
    });
    if (!ok) return;
    const res = await deleteBlog(idRef.current);
    if (res.error) return toast.error(res.error);
    toast.success("Post deleted");
    baseMeta.current = metaSig;
    router.push("/admin/blog");
    router.refresh();
  };

  const doApprove = async () => {
    if (!post) return;
    const res = post.approved ? await publishBlog(post.id) : await approveBlog(post.id);
    if (res.error) toast.error(res.error);
    else {
      toast.success(res.success ?? "Done");
      router.refresh();
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); void save(); }} noValidate>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <p className="eyebrow">{post ? "Editing post" : "New post"}</p>
          <StatusBadge status={statusNow} />
        </div>
        <Button onClick={() => setAiOpen(true)}>
          <Sparkles className="size-4" aria-hidden="true" /> Write with AI
        </Button>
      </div>

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        {/* ── Writing canvas ─────────────────────────────── */}
        <section aria-label="Writing canvas" className="min-w-0">
          <div className="max-w-[68ch]">
            <label htmlFor="post-title" className="sr-only">
              Post title
            </label>
            <TitleArea
              {...register("title")}
              {...fieldA11y("post-title", titleError)}
              placeholder="Post title"
            />
            <p id="post-title-error" aria-live="polite" className={`mt-1 text-xs text-danger ${titleError ? "" : "hidden"}`}>
              {titleError}
            </p>
          </div>
          <div className="mt-4">
            <RichTextEditor
              ref={editorRef}
              initialValue={initial}
              onChange={onContent}
              onReady={(d) => {
                baseContent.current = blocksSig(d);
                setContentSig(blocksSig(d));
                setHasContent(d.blocks.length > 0);
                setEditorReady(true);
              }}
            />
          </div>
        </section>

        {/* ── Settings ───────────────────────────────────── */}
        <aside aria-label="Post settings" className="min-w-0 space-y-4 lg:sticky lg:top-20 lg:max-h-[calc(100dvh-9rem)] lg:overflow-y-auto lg:pr-1">
          <section className="card space-y-4 p-4" aria-labelledby="s-publish">
            <h2 id="s-publish" className="eyebrow">
              Publish
            </h2>
            <Field id="post-status" label="Status" hint={!canPublish ? "Your posts are saved as drafts until an admin approves them." : undefined}>
              <Select {...register("status")} {...fieldA11y("post-status", undefined, !canPublish)} disabled={!canPublish}>
                <option value="draft">Draft</option>
                {canPublish ? <option value="published">Published</option> : null}
                {canPublish ? <option value="archived">Archived</option> : null}
              </Select>
            </Field>

            {previewable ? (
              <a href={postUrl(values.slug)} target="_blank" rel="noopener noreferrer" className="btn w-full">
                <ExternalLink className="size-3.5" aria-hidden="true" /> Preview on site
              </a>
            ) : (
              <div>
                <button type="button" className="btn w-full" aria-disabled="true" aria-describedby="preview-note" onClick={(e) => e.preventDefault()}>
                  <ExternalLink className="size-3.5" aria-hidden="true" /> Preview on site
                </button>
                <p id="preview-note" className="mt-1.5 text-xs text-muted">
                  Available once the post is published and saved.
                </p>
              </div>
            )}

            {post && isAdmin && (!post.approved || post.status !== "published") && post.authorRole === "USER" ? (
              <div className="rounded-[var(--radius-ctl)] border border-line bg-surface-2 p-3 text-[13px]">
                <p className="font-medium">{post.approved ? "Approved" : "Awaiting approval"}</p>
                <p className="mt-0.5 text-xs text-muted">By {post.authorName ?? post.authorEmail}</p>
                {!(post.approved && post.status === "published") ? (
                  <Button size="sm" className="mt-2.5" onClick={doApprove}>
                    {post.approved ? "Publish now" : "Approve content"}
                  </Button>
                ) : null}
              </div>
            ) : null}
          </section>

          <section className="card space-y-4 p-4" aria-labelledby="s-url">
            <h2 id="s-url" className="eyebrow">
              URL
            </h2>
            <Field id="post-slug" label="Slug" error={errors.slug?.message} hint="Generated from the title until you edit it.">
              <Input
                {...register("slug", {
                  onChange: () => {
                    slugTouched.current = true;
                  },
                })}
                {...fieldA11y("post-slug", errors.slug?.message, true)}
                className="mono text-[13px]"
                autoComplete="off"
                spellCheck={false}
              />
              <p aria-live="polite" className={`mt-1.5 flex min-h-4 items-center gap-1.5 text-xs ${slugMsg?.cls ?? ""}`}>
                {slugMsg ? (
                  <>
                    <span aria-hidden="true">{slugMsg.icon}</span> {slugMsg.text}
                  </>
                ) : null}
              </p>
            </Field>
            <p className="mono break-all text-[11px] text-muted">developer-ayush.com/blog/{values.slug || "…"}</p>
          </section>

          <section className="card space-y-4 p-4" aria-labelledby="s-seo">
            <h2 id="s-seo" className="eyebrow">
              Search description
            </h2>
            <Field
              id="post-desc"
              label="Description"
              error={errors.description?.message}
              aside={
                <span className={`mono ${descTone}`} aria-live="polite">
                  {descLen}/{SEO_LENGTH}
                </span>
              }
              hint={descLen > SEO_LENGTH ? "Search engines usually cut off after about 160 characters." : "Aim for about 160 characters."}
            >
              <Textarea {...register("description")} {...fieldA11y("post-desc", errors.description?.message, true)} rows={4} />
            </Field>
          </section>

          <section className="card space-y-4 p-4" aria-labelledby="s-banner">
            <h2 id="s-banner" className="eyebrow">
              Banner
            </h2>
            <Controller
              control={control}
              name="banner"
              render={({ field }) => (
                <ImageField
                  id="post-banner"
                  value={field.value}
                  onChange={(url) => field.onChange(url)}
                  folder="blog-banners"
                  busyExternal={aiBannerBusy}
                  invalid={!!errors.banner}
                  describedBy={errors.banner ? "post-banner-error" : undefined}
                />
              )}
            />
            <p id="post-banner-error" aria-live="polite" className={`text-xs text-danger ${errors.banner ? "" : "hidden"}`}>
              {errors.banner?.message}
            </p>
          </section>

          <section className="card space-y-4 p-4" aria-labelledby="s-tax">
            <h2 id="s-tax" className="eyebrow">
              Categories & tags
            </h2>
            <Field id="post-cats" label="Categories" error={errors.categories?.message as string | undefined}>
              <Controller
                control={control}
                name="categories"
                render={({ field }) => (
                  <MultiSelect
                    id="post-cats"
                    options={allCategories}
                    value={field.value}
                    onChange={(v) => field.onChange(v.map((x) => x.toLowerCase()))}
                    invalid={!!errors.categories}
                    describedBy={errors.categories ? "post-cats-error" : undefined}
                  />
                )}
              />
            </Field>
            <Field id="post-tags" label="Tags" hint="Press Enter or comma to add.">
              <Controller
                control={control}
                name="tags"
                render={({ field }) => <TagInput id="post-tags" value={field.value} onChange={field.onChange} describedBy="post-tags-hint" />}
              />
            </Field>
          </section>

          {post && (isAdmin || isAuthor) ? (
            <section className="card space-y-3 p-4" aria-labelledby="s-danger">
              <h2 id="s-danger" className="eyebrow">
                Danger zone
              </h2>
              <Button variant="danger" onClick={removePost} className="w-full">
                <Trash2 className="size-3.5" aria-hidden="true" /> Delete post…
              </Button>
            </section>
          ) : null}
        </aside>
      </div>

      <SaveBar state={saveState} note={post ? `Last edited by ${post.authorName ?? post.authorEmail}` : "Drafts autosave while you write."}>
        <Button onClick={() => router.push("/admin/blog")} disabled={busy}>
          Close
        </Button>
        <Button type="submit" variant="default" loading={busy} disabled={slugState === "taken" || titleTaken}>
          {primaryLabel}
        </Button>
      </SaveBar>

      <AISheet
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        postTitle={values.title ?? ""}
        hasContent={hasContent}
        onInsert={async (r) => {
          await editorRef.current?.append(r.content.blocks);
          fillMeta(r, false);
        }}
        onReplace={async (r) => {
          await editorRef.current?.render(r.content);
          fillMeta(r, true);
        }}
        onBanner={(url) => setValue("banner", url, { shouldDirty: true, shouldValidate: true })}
        confirmReplace={() =>
          confirm({
            title: "Replace the whole post?",
            description: "The current content, title and settings will be overwritten by the draft. You can still undo by not saving and reloading.",
            confirmLabel: "Replace post",
            destructive: true,
          })
        }
      />

      <Dialog
        open={leaveHref !== null}
        onClose={() => setLeaveHref(null)}
        title="Leave without saving?"
        description="You have unsaved changes. If you leave now they will be lost."
        footer={
          <>
            <Button onClick={() => setLeaveHref(null)} autoFocus>
              Keep editing
            </Button>
            <Button
              variant="danger-solid"
              onClick={() => {
                const href = leaveHref;
                setLeaveHref(null);
                if (href) router.push(href);
              }}
            >
              Discard & leave
            </Button>
          </>
        }
      />
    </form>
  );
}

/** Auto-growing serif title, styled like the live post's <h1>. */
const TitleArea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(function TitleArea(
  { onChange, ...props },
  ref
) {
  const inner = React.useRef<HTMLTextAreaElement | null>(null);
  const grow = () => {
    const el = inner.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  React.useLayoutEffect(grow);
  return (
    <textarea
      {...props}
      ref={(el) => {
        inner.current = el;
        if (typeof ref === "function") ref(el);
        else if (ref) ref.current = el;
      }}
      rows={1}
      onChange={(e) => {
        onChange?.(e);
        grow();
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") e.preventDefault();
      }}
      className="block w-full resize-none overflow-hidden border-0 bg-transparent p-0 font-serif text-[clamp(2rem,1.5rem+2vw,3rem)] leading-[1.08] tracking-[-0.015em] text-ink outline-none placeholder:text-muted/50 focus-visible:outline-none"
    />
  );
});
