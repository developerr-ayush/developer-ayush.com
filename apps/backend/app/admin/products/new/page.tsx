import ProductForm from "../product-form";
import Link from "next/link";

export default function NewProductPage() {
  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="mt-2 text-sm text-gray-600">List a new tech product with affiliate links</p>
        </div>
        <Link href="/admin/products"
          className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </Link>
      </div>
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <ProductForm />
      </div>
    </div>
  );
}
