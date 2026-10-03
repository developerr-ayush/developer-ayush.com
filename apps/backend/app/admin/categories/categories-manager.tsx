"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, Pencil, Plus, SearchX, Tags, X } from "lucide-react";
import { createCategory, editCategory } from "@/actions/category";
import { Button } from "@/components/ui/button";
import { Field, fieldA11y } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { EmptyState } from "@/components/ui/empty-state";
import { DataTable, TableCard, Td, Th, Tr } from "@/components/admin/DataTable";
import { toast } from "@/lib/toast";

interface Row {
  id: string;
  name: string;
  slug: string;
  showInHome: boolean;
  posts: number;
}

const nameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters")
    .max(40, "Keep it under 40 characters")
    .regex(/^[\p{L}\p{N}][\p{L}\p{N} &/+.-]*$/u, "Start with a letter or number; letters, numbers, spaces and - & / + . are allowed"),
});
type NameValues = z.infer<typeof nameSchema>;

export default function CategoriesManager({ categories }: { categories: Row[] }) {
  const router = useRouter();
  const [filter, setFilter] = React.useState("");
  const [editing, setEditing] = React.useState<string | null>(null);
  const [pending, setPending] = React.useState<string | null>(null);

  const create = useForm<NameValues>({ resolver: zodResolver(nameSchema), defaultValues: { name: "" } });
  const rename = useForm<NameValues>({ resolver: zodResolver(nameSchema), defaultValues: { name: "" } });

  const taken = (name: string, exceptId?: string) =>
    categories.some((c) => c.id !== exceptId && c.name.toLowerCase() === name.trim().toLowerCase());

  const onCreate = create.handleSubmit(async ({ name }) => {
    if (taken(name)) return create.setError("name", { message: "That category already exists" });
    const res = await createCategory(name.trim());
    if (res.error) return toast.error(res.error);
    toast.success(`Category “${name.trim().toLowerCase()}” created`);
    create.reset();
    router.refresh();
  });

  const startEdit = (row: Row) => {
    setEditing(row.id);
    rename.reset({ name: row.name });
  };

  const onRename = (row: Row) =>
    rename.handleSubmit(async ({ name }) => {
      if (taken(name, row.id)) return rename.setError("name", { message: "That category already exists" });
      setPending(row.id);
      const res = await editCategory({ id: row.id, name: name.trim(), showInHome: row.showInHome });
      setPending(null);
      if (res.error) return toast.error(res.error);
      toast.success("Category renamed");
      setEditing(null);
      router.refresh();
    });

  const toggleHome = async (row: Row, next: boolean) => {
    setPending(row.id);
    const res = await editCategory({ id: row.id, name: row.name, showInHome: next });
    setPending(null);
    if (res.error) return toast.error(res.error);
    toast.success(next ? `“${row.name}” now shows on the home page` : `“${row.name}” hidden from the home page`);
    router.refresh();
  };

  const shown = categories.filter((c) => c.name.toLowerCase().includes(filter.trim().toLowerCase()));

  return (
    <div className="space-y-5">
      <form onSubmit={onCreate} noValidate className="card p-4">
        <Field id="new-category" label="New category" error={create.formState.errors.name?.message}>
          <div className="flex gap-2">
            <Input
              {...create.register("name")}
              {...fieldA11y("new-category", create.formState.errors.name?.message)}
              placeholder="e.g. web development"
              autoComplete="off"
            />
            <Button type="submit" variant="default" loading={create.formState.isSubmitting} className="shrink-0">
              <Plus className="size-4" aria-hidden="true" /> Add
            </Button>
          </div>
        </Field>
      </form>

      {categories.length > 8 ? (
        <div className="max-w-xs">
          <label htmlFor="cat-filter" className="sr-only">
            Filter categories
          </label>
          <Input id="cat-filter" type="search" placeholder="Filter categories" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </div>
      ) : null}

      <TableCard>
        {categories.length === 0 ? (
          <EmptyState
            icon={<Tags className="size-6" aria-hidden="true" />}
            title="No categories yet"
            description="Add the first one above. Posts can be filed under several categories."
          />
        ) : shown.length === 0 ? (
          <EmptyState icon={<SearchX className="size-6" aria-hidden="true" />} title="No match" description={`Nothing is named “${filter}”.`} />
        ) : (
          <DataTable caption="Blog categories">
            <thead>
              <tr>
                <Th>Name</Th>
                <Th>Slug</Th>
                <Th className="text-right">Posts</Th>
                <Th>On home page</Th>
                <Th srOnly>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {shown.map((row) => (
                <Tr key={row.id}>
                  <Td primary>
                    {editing === row.id ? (
                      <form onSubmit={onRename(row)} noValidate className="flex items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <label htmlFor={`rename-${row.id}`} className="sr-only">
                            Category name
                          </label>
                          <Input
                            {...rename.register("name")}
                            {...fieldA11y(`rename-${row.id}`, rename.formState.errors.name?.message)}
                            autoFocus
                            onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                          />
                          <p id={`rename-${row.id}-error`} aria-live="polite" className="mt-1 text-xs text-danger">
                            {rename.formState.errors.name?.message}
                          </p>
                        </div>
                        <Button type="submit" size="icon" variant="default" aria-label="Save name" loading={pending === row.id}>
                          <Check className="size-4" aria-hidden="true" />
                        </Button>
                        <Button size="icon" aria-label="Cancel renaming" onClick={() => setEditing(null)}>
                          <X className="size-4" aria-hidden="true" />
                        </Button>
                      </form>
                    ) : (
                      <span className="font-medium">{row.name}</span>
                    )}
                  </Td>
                  <Td label="Slug" className="mono text-xs text-muted">
                    {row.slug}
                  </Td>
                  <Td label="Posts" className="mono text-right text-muted">
                    {row.posts}
                  </Td>
                  <Td label="On home page">
                    <div className="flex items-center gap-2.5">
                      <Switch
                        checked={row.showInHome}
                        disabled={pending === row.id}
                        onCheckedChange={(v) => toggleHome(row, v)}
                        aria-label={`Show ${row.name} on the home page`}
                      />
                      <span className="mono text-xs text-muted" aria-hidden="true">
                        {row.showInHome ? "shown" : "hidden"}
                      </span>
                    </div>
                  </Td>
                  <Td actions className="md:w-12 md:text-right">
                    {editing === row.id ? null : (
                      <Button size="icon-sm" variant="ghost" aria-label={`Rename ${row.name}`} onClick={() => startEdit(row)}>
                        <Pencil className="size-3.5" aria-hidden="true" />
                      </Button>
                    )}
                  </Td>
                </Tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </TableCard>
    </div>
  );
}
