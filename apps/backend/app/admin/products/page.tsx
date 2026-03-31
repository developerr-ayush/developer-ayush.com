import Link from "next/link";
import { showProducts } from "../../../actions/products";
import { formatDistanceToNow } from "date-fns";
import DeleteProductButton from "./delete-button";
import Image from "next/image";
import { PageHeader } from "../../../components/admin/PageHeader";
import { DataTable, Td, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { Pencil, Star } from "lucide-react";

export default async function ProductsAdmin() {
  const products = await showProducts();

  const columns = [
    { label: "Product" },
    { label: "Category" },
    { label: "Price" },
    { label: "Status" },
    { label: "Updated" },
    { label: "Actions", className: "text-right" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description="Manage your affiliate product listings"
        ctaLabel="Add Product"
        ctaHref="/admin/products/new"
      />

      <DataTable
        columns={columns}
        isEmpty={products.length === 0}
        emptyState={
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="p-4 bg-white/5 rounded-2xl">
              <svg className="w-8 h-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-slate-400 font-medium mb-1">No products yet</p>
              <p className="text-sm text-slate-600">Start by adding your first product</p>
            </div>
            <Link href="/admin/products/new"
              className="mt-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-all">
              Add Product
            </Link>
          </div>
        }
      >
        {products.map((product) => (
          <Tr key={product.id}>
            {/* Product */}
            <Td>
              <div className="flex items-center gap-3">
                {product.image && (
                  <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden">
                    <Image src={product.image} alt="" width={36} height={36}
                      className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-white text-sm">{product.name}</p>
                    {product.featured && (
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    )}
                  </div>
                  {product.brand && (
                    <p className="text-xs text-slate-500">{product.brand}</p>
                  )}
                </div>
              </div>
            </Td>

            {/* Category */}
            <Td>
              <span className="text-xs text-slate-400">{product.category ?? "—"}</span>
            </Td>

            {/* Price */}
            <Td>
              {product.salePrice ? (
                <div>
                  <span className="font-semibold text-white text-sm">
                    ₹{product.salePrice.toLocaleString()}
                  </span>
                  {product.price && (
                    <span className="ml-2 text-xs text-slate-600 line-through">
                      ₹{product.price.toLocaleString()}
                    </span>
                  )}
                </div>
              ) : product.price ? (
                <span className="text-sm text-slate-300">₹{product.price.toLocaleString()}</span>
              ) : (
                <span className="text-slate-600">—</span>
              )}
            </Td>

            {/* Status */}
            <Td>
              <StatusBadge status={product.status} dot />
            </Td>

            {/* Updated */}
            <Td>
              <span className="text-xs text-slate-500">
                {formatDistanceToNow(new Date(product.updatedAt), { addSuffix: true })}
              </span>
            </Td>

            {/* Actions */}
            <Td className="text-right">
              <div className="flex items-center justify-end gap-3">
                <Link href={`/admin/products/${product.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors">
                  <Pencil className="w-3 h-3" /> Edit
                </Link>
                <DeleteProductButton productId={product.id} />
              </div>
            </Td>
          </Tr>
        ))}
      </DataTable>
    </div>
  );
}
