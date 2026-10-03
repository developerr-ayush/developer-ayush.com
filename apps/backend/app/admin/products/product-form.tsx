"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, Loader2, Trash2, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, fieldA11y } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/components/ui/confirm";
import { ImageField } from "@/components/admin/ImageField";
import { TagInput } from "@/components/admin/TagInput";
import { SaveBar, type SaveState } from "@/components/admin/SaveBar";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { createProduct, deleteProduct, updateProduct } from "@/actions/products";
import { checkProductSlugAvailable } from "@/actions/admin";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useDebounced } from "@/hooks/use-debounced";
import { slugify } from "@/lib/format";
import { toast } from "@/lib/toast";

const amount = z
  .string()
  .trim()
  .refine((v) => v === "" || (/^\d+(\.\d{1,2})?$/.test(v) && Number(v) >= 0), "Enter an amount like 1999 or 1999.50");
const optionalUrl = z
  .string()
  .trim()
  .refine((v) => {
    if (v === "") return true;
    try {
      const u = new URL(v);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch {
      return false;
    }
  }, "Enter a full link starting with https://");

const productFormSchema = z
  .object({
    name: z.string().trim().min(2, "Name needs at least 2 characters").max(160, "Name is too long"),
    slug: z
      .string()
      .trim()
      .min(2, "A slug is required")
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and single hyphens"),
    shortDescription: z.string().max(500, "Keep the summary under 500 characters"),
    description: z.string(),
    price: amount,
    salePrice: amount,
    image: z.string(),
    affiliateLink: optionalUrl,
    amazonLink: optionalUrl,
    flipkartLink: optionalUrl,
    instagramPost: optionalUrl,
    category: z.string().trim().max(60),
    brand: z.string().trim().max(60),
    rating: z
      .string()
      .trim()
      .refine((v) => v === "" || (!Number.isNaN(Number(v)) && Number(v) >= 0 && Number(v) <= 5), "Rating is between 0 and 5"),
    tags: z.string(),
    status: z.enum(["draft", "published", "archived"]),
    featured: z.boolean(),
  })
  .superRefine((v, ctx) => {
    if (v.salePrice && v.price && Number(v.salePrice) >= Number(v.price)) {
      ctx.addIssue({ code: "custom", path: ["salePrice"], message: "Sale price must be lower than the price" });
    }
    if (v.salePrice && !v.price) {
      ctx.addIssue({ code: "custom", path: ["price"], message: "Add the regular price to show a sale" });
    }
  });
type ProductValues = z.infer<typeof productFormSchema>;

export interface ProductData {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  price: number | null;
  salePrice: number | null;
  image: string | null;
  images: string[];
  affiliateLink: string | null;
  amazonLink: string | null;
  flipkartLink: string | null;
  category: string | null;
  brand: string | null;
  rating: number | null;
  instagramPost: string | null;
  tags: string | null;
  status: "draft" | "published" | "archived";
  featured: boolean;
}

const str = (n: number | null | undefined) => (n == null ? "" : String(n));

export default function ProductForm({
  product,
  canManage,
  categoryOptions,
}: {
  product?: ProductData;
  canManage: boolean;
  categoryOptions: string[];
}) {
  const router = useRouter();
  const confirm = useConfirm();
  const isEditing = !!product;
  const slugTouched = React.useRef(isEditing);

  const defaults = React.useMemo<ProductValues>(
    () => ({
      name: product?.name ?? "",
      slug: product?.slug ?? "",
      shortDescription: product?.shortDescription ?? "",
      description: product?.description ?? "",
      price: str(product?.price),
      salePrice: str(product?.salePrice),
      image: product?.image ?? "",
      affiliateLink: product?.affiliateLink ?? "",
      amazonLink: product?.amazonLink ?? "",
      flipkartLink: product?.flipkartLink ?? "",
      instagramPost: product?.instagramPost ?? "",
      category: product?.category ?? "",
      brand: product?.brand ?? "",
      rating: str(product?.rating),
      tags: product?.tags ?? "",
      status: product?.status ?? "draft",
      featured: product?.featured ?? false,
    }),
    [product]
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    setFocus,
    reset,
    formState: { errors },
  } = useForm<ProductValues>({ resolver: zodResolver(productFormSchema), defaultValues: defaults, mode: "onTouched" });

  const values = useWatch({ control }) as ProductValues;
  const sig = JSON.stringify(values);
  const base = React.useRef(sig);
  const dirty = sig !== base.current;
  const [saveState, setSaveState] = React.useState<SaveState>({ kind: "clean", at: null });
  const [slugState, setSlugState] = React.useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [leaveHref, setLeaveHref] = React.useState<string | null>(null);
  const idRef = React.useRef(product?.id);

  React.useEffect(() => {
    setSaveState((s) => (s.kind === "saving" || s.kind === "error" ? s : dirty ? { kind: "dirty" } : s.kind === "dirty" ? { kind: "clean", at: null } : s));
  }, [dirty]);
  useUnsavedChanges(dirty && canManage, setLeaveHref);

  const name = values.name ?? "";
  React.useEffect(() => {
    if (!slugTouched.current) setValue("slug", slugify(name));
  }, [name, setValue]);

  const debouncedSlug = useDebounced(values.slug ?? "", 400);
  React.useEffect(() => {
    let live = true;
    if (!debouncedSlug) return setSlugState("idle");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(debouncedSlug)) return setSlugState("invalid");
    setSlugState("checking");
    checkProductSlugAvailable(debouncedSlug, idRef.current)
      .then((r) => live && setSlugState(r.available ? "available" : "taken"))
      .catch(() => live && setSlugState("idle"));
    return () => {
      live = false;
    };
  }, [debouncedSlug]);
  const slugPending = (values.slug ?? "") !== debouncedSlug;

  const onSubmit = handleSubmit(
    async (v) => {
      if (slugState === "taken") return toast.error("That slug is already used by another product.");
      setSaveState({ kind: "saving" });
      // Cleared text fields are sent as "" on edit so they actually clear (undefined means "leave unchanged").
      const text = (cur: string, prev: string | null | undefined) => (cur.trim() ? cur.trim() : isEditing && prev ? "" : undefined);
      const num = (cur: string) => (cur.trim() ? parseFloat(cur) : undefined);
      const payload = {
        name: v.name.trim(),
        slug: v.slug.trim(),
        shortDescription: text(v.shortDescription, product?.shortDescription),
        description: text(v.description, product?.description),
        price: num(v.price),
        salePrice: num(v.salePrice),
        image: text(v.image, product?.image),
        images: product?.images ?? [],
        affiliateLink: text(v.affiliateLink, product?.affiliateLink),
        amazonLink: text(v.amazonLink, product?.amazonLink),
        flipkartLink: text(v.flipkartLink, product?.flipkartLink),
        category: text(v.category, product?.category),
        brand: text(v.brand, product?.brand),
        rating: num(v.rating),
        instagramPost: text(v.instagramPost, product?.instagramPost),
        tags: text(v.tags, product?.tags),
        status: v.status,
        featured: v.featured,
      };
      try {
        const res = idRef.current ? await updateProduct(payload, idRef.current) : await createProduct(payload);
        if (res.error) throw new Error(res.error);
        base.current = JSON.stringify(v);
        setSaveState({ kind: "clean", at: new Date() });
        toast.success(res.success ?? "Saved");
        if (!isEditing) {
          router.push("/admin/products");
          router.refresh();
        } else {
          reset(v);
          router.refresh();
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : "Save failed";
        setSaveState({ kind: "error", message });
        toast.error(message);
      }
    },
    (errs) => {
      toast.error("Fix the highlighted fields to save.");
      const first = Object.keys(errs)[0] as keyof ProductValues | undefined;
      if (first) setFocus(first);
    }
  );

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && canManage) {
        e.preventDefault();
        void onSubmit();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const remove = async () => {
    if (!product) return;
    const ok = await confirm({
      title: "Delete this product?",
      description: `“${product.name}” will be removed from the products app. This cannot be undone.`,
      confirmLabel: "Delete product",
      destructive: true,
    });
    if (!ok) return;
    const res = await deleteProduct(product.id);
    if (res.error) return toast.error(res.error);
    toast.success("Product deleted");
    base.current = sig;
    router.push("/admin/products");
    router.refresh();
  };

  const e = (k: keyof ProductValues) => errors[k]?.message as string | undefined;
  const shortLen = (values.shortDescription ?? "").length;
  const busy = saveState.kind === "saving";

  const slugMsg = (() => {
    if (errors.slug) return null;
    if (slugPending || slugState === "checking") return { icon: <Loader2 className="size-3.5 animate-spin" />, text: "Checking…", cls: "text-muted" };
    if (slugState === "available") return { icon: <CheckCircle2 className="size-3.5" />, text: "Available", cls: "text-ok" };
    if (slugState === "taken") return { icon: <TriangleAlert className="size-3.5" />, text: "Already used by another product", cls: "text-danger" };
    return null;
  })();

  return (
    <form onSubmit={onSubmit} noValidate>
      {!canManage ? (
        <p role="note" className="mb-5 rounded-[var(--radius-ctl)] border border-line bg-surface-2 px-3.5 py-2.5 text-[13px] text-muted">
          Only admins can change products. You&apos;re viewing this listing read-only.
        </p>
      ) : null}
      <fieldset disabled={!canManage || busy} className="grid items-start gap-8 border-0 p-0 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <section className="card space-y-5 p-5" aria-labelledby="p-basic">
            <h2 id="p-basic" className="eyebrow">
              Details
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="p-name" label="Name" required error={e("name")}>
                <Input {...register("name")} {...fieldA11y("p-name", e("name"))} placeholder="e.g. Wireless noise-cancelling headphones" autoComplete="off" />
              </Field>
              <Field id="p-slug" label="Slug" required error={e("slug")} hint="Used in the product's URL.">
                <Input
                  {...register("slug", { onChange: () => (slugTouched.current = true) })}
                  {...fieldA11y("p-slug", e("slug"), true)}
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
            </div>
            <Field
              id="p-short"
              label="Short description"
              error={e("shortDescription")}
              aside={
                <span className={`mono ${shortLen > 500 ? "text-danger" : "text-muted"}`} aria-live="polite">
                  {shortLen}/500
                </span>
              }
              hint="One or two lines shown on listing cards."
            >
              <Textarea {...register("shortDescription")} {...fieldA11y("p-short", e("shortDescription"), true)} rows={2} />
            </Field>
            <Field id="p-desc" label="Description" error={e("description")}>
              <Textarea {...register("description")} {...fieldA11y("p-desc", e("description"))} rows={7} />
            </Field>
          </section>

          <section className="card space-y-5 p-5" aria-labelledby="p-price">
            <h2 id="p-price" className="eyebrow">
              Pricing & rating
            </h2>
            <div className="grid gap-5 sm:grid-cols-3">
              <Field id="p-price-in" label="Price (₹)" error={e("price")}>
                <Input {...register("price")} {...fieldA11y("p-price-in", e("price"))} inputMode="decimal" placeholder="1999" className="mono" />
              </Field>
              <Field id="p-sale" label="Sale price (₹)" error={e("salePrice")}>
                <Input {...register("salePrice")} {...fieldA11y("p-sale", e("salePrice"))} inputMode="decimal" placeholder="1499" className="mono" />
              </Field>
              <Field id="p-rating" label="Rating (0–5)" error={e("rating")}>
                <Input {...register("rating")} {...fieldA11y("p-rating", e("rating"))} inputMode="decimal" placeholder="4.5" className="mono" />
              </Field>
            </div>
          </section>

          <section className="card space-y-5 p-5" aria-labelledby="p-links">
            <h2 id="p-links" className="eyebrow">
              Links
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="p-aff" label="Affiliate link" error={e("affiliateLink")}>
                <Input {...register("affiliateLink")} {...fieldA11y("p-aff", e("affiliateLink"))} type="url" placeholder="https://" />
              </Field>
              <Field id="p-ig" label="Instagram post" error={e("instagramPost")}>
                <Input {...register("instagramPost")} {...fieldA11y("p-ig", e("instagramPost"))} type="url" placeholder="https://www.instagram.com/p/…" />
              </Field>
              <Field id="p-amz" label="Amazon link" error={e("amazonLink")}>
                <Input {...register("amazonLink")} {...fieldA11y("p-amz", e("amazonLink"))} type="url" placeholder="https://" />
              </Field>
              <Field id="p-flip" label="Flipkart link" error={e("flipkartLink")}>
                <Input {...register("flipkartLink")} {...fieldA11y("p-flip", e("flipkartLink"))} type="url" placeholder="https://" />
              </Field>
            </div>
          </section>
        </div>

        <aside aria-label="Product settings" className="min-w-0 space-y-4 lg:sticky lg:top-20">
          <section className="card space-y-4 p-4" aria-labelledby="p-pub">
            <div className="flex items-center justify-between">
              <h2 id="p-pub" className="eyebrow">
                Publish
              </h2>
              <StatusBadge status={values.status ?? "draft"} />
            </div>
            <Field id="p-status" label="Status">
              <Select {...register("status")} {...fieldA11y("p-status")}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Controller
              control={control}
              name="featured"
              render={({ field }) => (
                <div className="flex items-center justify-between gap-3">
                  <label htmlFor="p-featured" className="text-[13px] font-medium">
                    Featured
                    <span className="block text-xs font-normal text-muted">Highlight on the products app.</span>
                  </label>
                  <Switch id="p-featured" checked={field.value} onCheckedChange={field.onChange} />
                </div>
              )}
            />
          </section>

          <section className="card space-y-4 p-4" aria-labelledby="p-img">
            <h2 id="p-img" className="eyebrow">
              Image
            </h2>
            <Controller
              control={control}
              name="image"
              render={({ field }) => <ImageField id="p-image" value={field.value} onChange={field.onChange} folder="products" aspect="aspect-square" />}
            />
          </section>

          <section className="card space-y-4 p-4" aria-labelledby="p-tax">
            <h2 id="p-tax" className="eyebrow">
              Organise
            </h2>
            <Field id="p-cat" label="Category" error={e("category")}>
              <Input {...register("category")} {...fieldA11y("p-cat", e("category"))} list="p-cat-options" autoComplete="off" />
              <datalist id="p-cat-options">
                {categoryOptions.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </Field>
            <Field id="p-brand" label="Brand" error={e("brand")}>
              <Input {...register("brand")} {...fieldA11y("p-brand", e("brand"))} autoComplete="off" />
            </Field>
            <Field id="p-tags" label="Tags" hint="Press Enter or comma to add.">
              <Controller control={control} name="tags" render={({ field }) => <TagInput id="p-tags" value={field.value} onChange={field.onChange} describedBy="p-tags-hint" />} />
            </Field>
          </section>

          {product && canManage ? (
            <section className="card space-y-3 p-4" aria-labelledby="p-danger">
              <h2 id="p-danger" className="eyebrow">
                Danger zone
              </h2>
              <Button variant="danger" className="w-full" onClick={remove}>
                <Trash2 className="size-3.5" aria-hidden="true" /> Delete product…
              </Button>
            </section>
          ) : null}
        </aside>
      </fieldset>

      {canManage ? (
        <SaveBar state={saveState}>
          <Button onClick={() => router.push("/admin/products")} disabled={busy}>
            Close
          </Button>
          <Button type="submit" variant="default" loading={busy} disabled={slugState === "taken"}>
            {isEditing ? "Save changes" : "Create product"}
          </Button>
        </SaveBar>
      ) : null}

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
