"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Field, fieldA11y } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DataTable, TableCard, Td, Th, Tr } from "@/components/admin/DataTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { shortDate } from "@/lib/format";
import { toast } from "@/lib/toast";

const schema = z.object({
  name: z.string().trim().min(2, "Name needs at least 2 characters").max(80, "Name is too long"),
  role: z.enum(["USER", "ADMIN", "SUPER_ADMIN"]),
});
type Values = z.infer<typeof schema>;

interface UserData {
  id: string;
  name: string | null;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER";
  blogs: { id: string; title: string | null; status: "draft" | "published" | "archived"; approved: boolean; updatedAt: string }[];
}

export default function EditUserPage({ user, viewerRole, viewerId }: { user: UserData; viewerRole: "SUPER_ADMIN" | "ADMIN" | "USER"; viewerId: string }) {
  const router = useRouter();
  const isSuper = viewerRole === "SUPER_ADMIN";
  const isSelf = viewerId === user.id;
  const viewerIsAdmin = viewerRole === "ADMIN" || isSuper;
  const canEdit = viewerIsAdmin || isSelf;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { name: user.name ?? "", role: user.role } });

  const onSubmit = handleSubmit(async (v) => {
    const res = await updateUser(user.id, { name: v.name.trim(), ...(isSuper ? { role: v.role } : {}) });
    if (res.error) return toast.error(res.error);
    toast.success("User updated");
    reset(v);
    router.refresh();
  });

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
      <form onSubmit={onSubmit} noValidate className="card space-y-5 p-5">
        <Field id="u-name" label="Name" required error={errors.name?.message}>
          <Input {...register("name")} {...fieldA11y("u-name", errors.name?.message)} autoComplete="off" disabled={!canEdit} />
        </Field>
        <Field id="u-email" label="Email" hint="The email can't be changed.">
          <Input id="u-email" aria-describedby="u-email-hint" value={user.email} readOnly disabled className="mono text-[13px]" />
        </Field>
        <Field id="u-role" label="Role" hint={isSuper ? undefined : "Only a super admin can change roles."}>
          <Select {...register("role")} {...fieldA11y("u-role", undefined, !isSuper)} disabled={!isSuper}>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super admin</option>
          </Select>
        </Field>
        <div className="flex items-center justify-end gap-2 pt-1">
          <Button onClick={() => router.push("/admin/users")}>Back</Button>
          <Button type="submit" variant="default" loading={isSubmitting} disabled={!canEdit || !isDirty}>
            Save changes
          </Button>
        </div>
      </form>

      <section aria-labelledby="u-posts" className="min-w-0 space-y-3">
        <h2 id="u-posts" className="text-[15px] font-semibold tracking-tight">
          Posts <span className="mono ml-1 text-xs font-normal text-muted">{user.blogs.length}</span>
        </h2>
        <TableCard>
          {user.blogs.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted">No posts yet.</p>
          ) : (
            <DataTable caption={`Posts by ${user.name ?? user.email}`}>
              <thead>
                <tr>
                  <Th>Title</Th>
                  <Th>Status</Th>
                  <Th>Updated</Th>
                </tr>
              </thead>
              <tbody>
                {user.blogs.map((b) => (
                  <Tr key={b.id}>
                    <Td primary>
                      <Link href={`/admin/blog/${b.id}`} className="line-clamp-1 font-medium hover:text-accent">
                        {b.title || "Untitled draft"}
                      </Link>
                    </Td>
                    <Td label="Status">
                      <div className="flex flex-wrap gap-1.5">
                        <StatusBadge status={b.status} />
                        {!b.approved ? <StatusBadge status="pending" label="needs review" dot={false} /> : null}
                      </div>
                    </Td>
                    <Td label="Updated" className="mono whitespace-nowrap text-xs text-muted">
                      {shortDate(b.updatedAt)}
                    </Td>
                  </Tr>
                ))}
              </tbody>
            </DataTable>
          )}
        </TableCard>
      </section>
    </div>
  );
}
