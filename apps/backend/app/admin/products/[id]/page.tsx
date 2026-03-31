import { notFound } from "next/navigation";
import { getProductById } from "../../../../actions/products";
import ProductForm from "../product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div className="space-y-6">
      {/* Back */}
      <Link href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Edit Product</h1>
        <p className="mt-1 text-sm text-slate-400">{product.name}</p>
      </div>

      {/* Form card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        <ProductForm
          product={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            shortDescription: product.shortDescription,
            description: product.description,
            price: product.price,
            salePrice: product.salePrice,
            image: product.image,
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
    </div>
  );
}
