import ProductForm from "../product-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      {/* Back */}
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
        <p className="mt-1 text-sm text-slate-400">
          List a new tech product with affiliate links
        </p>
      </div>

      {/* Form card */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
        <ProductForm />
      </div>
    </div>
  );
}
