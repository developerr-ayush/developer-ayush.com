"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { Menu, type MenuItem } from "@/components/ui/menu";
import { useConfirm } from "@/components/ui/confirm";
import { deleteProduct } from "@/actions/products";
import { toast } from "@/lib/toast";

export function ProductRowActions({ id, name, canManage }: { id: string; name: string; canManage: boolean }) {
  const router = useRouter();
  const confirm = useConfirm();

  const items: MenuItem[] = [{ label: canManage ? "Edit" : "View", icon: <Pencil />, href: `/admin/products/${id}` }];
  if (canManage) {
    items.push({
      label: "Delete…",
      icon: <Trash2 />,
      danger: true,
      separated: true,
      onSelect: async () => {
        const ok = await confirm({
          title: "Delete this product?",
          description: `“${name}” will be removed from the products app. This cannot be undone.`,
          confirmLabel: "Delete product",
          destructive: true,
        });
        if (!ok) return;
        const res = await deleteProduct(id);
        if (res.error) return toast.error(res.error);
        toast.success("Product deleted");
        router.refresh();
      },
    });
  }

  return (
    <Menu label={`Actions for ${name}`} triggerClassName="btn btn-ghost btn-sm btn-icon" trigger={<MoreHorizontal className="size-4" aria-hidden="true" />} items={items} />
  );
}
