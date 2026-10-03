"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Archive, ArchiveRestore, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { useConfirm } from "@/components/ui/confirm";
import { toast } from "@/lib/toast";
import { deleteBlog } from "@/actions/blog";
import { setBlogStatus } from "@/actions/admin";
import { postUrl } from "@/lib/format";

export function PostRowActions({
  id,
  title,
  slug,
  status,
  canArchive,
  canDelete,
}: {
  id: string;
  title: string;
  slug: string | null;
  status: "draft" | "published" | "archived";
  canArchive: boolean;
  canDelete: boolean;
}) {
  const router = useRouter();
  const confirm = useConfirm();

  const items: MenuItem[] = [
    { label: "Edit", icon: <Pencil />, href: `/admin/blog/${id}` },
    {
      label: status === "published" ? "View on site" : "View on site (published only)",
      icon: <ExternalLink />,
      href: slug ? postUrl(slug) : undefined,
      external: true,
      disabled: status !== "published" || !slug,
    },
  ];
  if (canArchive) {
    items.push(
      status === "archived"
        ? { label: "Restore to drafts", icon: <ArchiveRestore />, onSelect: () => run("draft"), separated: true }
        : { label: "Archive", icon: <Archive />, onSelect: () => run("archived"), separated: true }
    );
  }
  if (canDelete) {
    items.push({ label: "Delete…", icon: <Trash2 />, danger: true, onSelect: remove, separated: !canArchive });
  }

  async function run(next: "draft" | "archived") {
    const res = await setBlogStatus(id, next);
    if (res.error) toast.error(res.error);
    else {
      toast.success(res.success ?? "Updated");
      router.refresh();
    }
  }

  async function remove() {
    const ok = await confirm({
      title: "Delete this post?",
      description: `“${title || "Untitled draft"}” will be permanently deleted. This cannot be undone.`,
      confirmLabel: "Delete post",
      destructive: true,
    });
    if (!ok) return;
    const res = await deleteBlog(id);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Post deleted");
      router.refresh();
    }
  }

  return (
    <Menu
      label={`Actions for ${title || "Untitled draft"}`}
      triggerClassName="btn btn-ghost btn-sm btn-icon"
      trigger={<MoreHorizontal className="size-4" aria-hidden="true" />}
      items={items}
    />
  );
}
