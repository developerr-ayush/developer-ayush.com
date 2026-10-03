import type { Metadata } from "next";
import { auth } from "../../../../auth";
import { db } from "../../../../lib/db";
import { PageHeader } from "../../../../components/admin/PageHeader";
import ProductForm from "../product-form";

export const metadata: Metadata = { title: "New product" };
export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const session = await auth();
  const canManage = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const cats = await db.product.findMany({ where: { category: { not: null } }, distinct: ["category"], select: { category: true } });
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Apps" title="New product" description="List a product with its affiliate links." />
      <ProductForm canManage={canManage} categoryOptions={cats.map((c) => c.category!).filter(Boolean)} />
    </div>
  );
}
