"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { useConfirm } from "@/components/ui/confirm";
import { DeleteUser } from "@/actions/users";
import { toast } from "@/lib/toast";

export function UserRowActions({ id, name, canDelete }: { id: string; name: string; canDelete: boolean }) {
  const router = useRouter();
  const confirm = useConfirm();
  const items: MenuItem[] = [{ label: "Edit", icon: <Pencil />, href: `/admin/users/${id}` }];
  if (canDelete) {
    items.push({
      label: "Delete…",
      icon: <Trash2 />,
      danger: true,
      separated: true,
      onSelect: async () => {
        const ok = await confirm({
          title: `Delete ${name}?`,
          description: "Their account is removed and their posts are transferred to you. This cannot be undone.",
          confirmLabel: "Delete user",
          destructive: true,
        });
        if (!ok) return;
        const res = await DeleteUser(id);
        if (res.error) return toast.error(res.error);
        toast.success(res.success ?? "User deleted");
        router.refresh();
      },
    });
  }
  return <Menu label={`Actions for ${name}`} triggerClassName="btn btn-ghost btn-sm btn-icon" trigger={<MoreHorizontal className="size-4" aria-hidden="true" />} items={items} />;
}
