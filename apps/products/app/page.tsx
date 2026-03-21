import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/products-api";
import ProductsClient from "@/components/ProductsClient";
import Link from "next/link";
import { FaInstagram } from "react-icons/fa";

interface PageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const search = params.search || "";
  const category = params.category || "All";
  const page = parseInt(params.page || "1", 10);

  const [productsData, categories] = await Promise.all([
    getProducts({
      search,
      category: category !== "All" ? category : undefined,
      page,
      size: 12,
    }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                Tech Picks 🛍️
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Products I&apos;ve featured on Instagram — with the best
                affiliate deals
              </p>
            </div>
            <a
              href="https://instagram.com/ayushh_io_"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-pink-600 hover:text-pink-700 transition-colors"
            >
              <FaInstagram className="w-5 h-5" />
              <span className="hidden sm:inline">Follow on Instagram</span>
            </a>
          </div>
        </div>
      </header>

      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-full" />
                  <div className="h-8 bg-gray-100 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        }
      >
        <ProductsClient
          initialProducts={productsData.data}
          initialCategories={categories}
          initialTotalPages={productsData.meta.totalPages}
          initialTotalItems={productsData.meta.totalItems}
          initialSearch={search}
          initialCategory={category}
          initialPage={page}
        />
      </Suspense>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-400">
          <p>
            © {new Date().getFullYear()} Developer Ayush. Affiliate links may
            earn commission.
          </p>
          <Link
            href="https://developer-ayush.com"
            className="hover:text-gray-600 transition-colors"
          >
            developer-ayush.com
          </Link>
        </div>
      </footer>
    </div>
  );
}
