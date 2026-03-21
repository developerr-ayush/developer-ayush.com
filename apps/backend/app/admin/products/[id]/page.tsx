import { notFound } from "next/navigation";
import { getProductById } from "../../../../actions/products";
import ProductForm from "../product-form";
import Link from "next/link";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="mt-2 text-sm text-gray-600">{product.name}</p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
        >
          <svg
            className="h-4 w-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Products
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
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
