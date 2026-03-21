import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products-api";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { FaStar, FaAmazon, FaInstagram, FaArrowLeft } from "react-icons/fa";

import { SiFlipkart } from "react-icons/si";
import { HiExternalLink, HiTag } from "react-icons/hi";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.shortDescription || product.description?.slice(0, 160) || product.name,
    openGraph: {
      title: product.name,
      description: product.shortDescription || "",
      images: product.image ? [{ url: product.image }] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const tags = product.tags
    ? product.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const buyLinks = [
    product.amazonLink && { label: "Buy on Amazon", href: product.amazonLink, icon: "amazon", color: "bg-amber-400 hover:bg-amber-500 text-gray-900" },
    product.flipkartLink && { label: "Buy on Flipkart", href: product.flipkartLink, icon: "flipkart", color: "bg-blue-500 hover:bg-blue-600 text-white" },
    product.affiliateLink && { label: "Buy Now", href: product.affiliateLink, icon: "link", color: "bg-indigo-600 hover:bg-indigo-700 text-white" },
  ].filter(Boolean) as { label: string; href: string; icon: string; color: string }[];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <FaArrowLeft className="w-3.5 h-3.5" />
            All Products
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Image */}
            <div className="relative aspect-square bg-gray-50 flex items-center justify-center p-8">
              {product.featured && (
                <span className="absolute top-4 right-4 bg-amber-400 text-amber-900 text-xs font-bold px-2.5 py-1 rounded-full z-10">
                  Featured
                </span>
              )}
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-contain p-8"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="text-gray-200">
                  <svg className="w-24 h-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 sm:p-8 flex flex-col gap-4">
              {(product.brand || product.category) && (
                <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wide font-medium">
                  {product.brand && <span>{product.brand}</span>}
                  {product.brand && product.category && <span>·</span>}
                  {product.category && <span>{product.category}</span>}
                </div>
              )}

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`w-4 h-4 ${i < Math.round(product.rating!) ? "text-amber-400" : "text-gray-200"}`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 font-medium ml-1">
                    {product.rating.toFixed(1)} / 5
                  </span>
                </div>
              )}

              {product.shortDescription && (
                <p className="text-gray-600 text-sm leading-relaxed">
                  {product.shortDescription}
                </p>
              )}

              {/* Buy buttons */}
              {buyLinks.length > 0 && (
                <div className="flex flex-col gap-2.5 mt-2">
                  {buyLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer sponsored"
                      className={`flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-semibold text-sm transition-colors ${link.color}`}
                    >
                      {link.icon === "amazon" && <FaAmazon className="w-4 h-4" />}
                      {link.icon === "flipkart" && <SiFlipkart className="w-4 h-4" />}
                      {link.icon === "link" && <HiExternalLink className="w-4 h-4" />}
                      {link.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Instagram post */}
              {product.instagramPost && (
                <a
                  href={product.instagramPost}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-pink-600 hover:text-pink-700 transition-colors mt-1"
                >
                  <FaInstagram className="w-4 h-4" />
                  View Instagram post
                </a>
              )}

              {/* Tags */}
              {tags.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap mt-1">
                  <HiTag className="w-3.5 h-3.5 text-gray-400" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-gray-400 mt-auto pt-2">
                * Affiliate links — I may earn a commission at no extra cost to you.
              </p>
            </div>
          </div>

          {/* Full description */}
          {product.description && (
            <div className="border-t border-gray-100 px-6 sm:px-8 py-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">About this product</h2>
              <div className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </div>
          )}
        </div>

        {/* Back link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            ← Browse all products
          </Link>
        </div>
      </div>
    </div>
  );
}
