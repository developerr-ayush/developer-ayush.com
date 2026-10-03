import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "../../../../auth";
import { db } from "../../../../lib/db";
import { PageHeader } from "../../../../components/admin/PageHeader";
import ProductForm from "../product-form";

export const metadata: Metadata = { title: "Edit product" };
export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  const canManage = session?.user?.role === "ADMIN" || session?.user?.role === "SUPER_ADMIN";
  const [product, cats] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.product.findMany({ where: { category: { not: null } }, distinct: ["category"], select: { category: true } }),
  ]);
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Apps" title={product.name} description={`${product.views.toLocaleString()} views`} />
      <ProductForm
        canManage={canManage}
        categoryOptions={cats.map((c) => c.category!).filter(Boolean)}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          shortDescription: product.shortDescription,
          description: product.description,
          price: product.price,
          salePrice: product.salePrice,
          image: product.image,
          images: product.images,
          affiliateLink: product.affiliateLink,
          amazonLink: product.amazonLink,
          flipkartLink: product.flipkartLink,
          category: product.category,
          brand: product.brand,
          rating: product.rating,
          instagramPost: product.instagramPost,
          tags: product.tags,
          status: product.status,
          featured: product.featured,
        }}
      />
    </div>
  );
}
