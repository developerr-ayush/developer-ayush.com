import Link from "next/link";
import Image from "next/image";
import { FaStar, FaAmazon } from "react-icons/fa";
import { SiFlipkart } from "react-icons/si";
import { HiExternalLink } from "react-icons/hi";
import type { Product } from "@/lib/products-api";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col">
      {/* Featured badge */}
      {product.featured && (
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-amber-400 text-amber-900 text-xs font-semibold px-2 py-0.5 rounded-full">
            Featured
          </span>
        </div>
      )}

      {/* Image */}
      <Link href={`/${product.slug}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        {product.brand && (
          <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">{product.brand}</p>
        )}
        <Link href={`/${product.slug}`}>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2 hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.shortDescription && (
          <p className="text-xs text-gray-500 line-clamp-2">{product.shortDescription}</p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1">
            <FaStar className="text-amber-400 w-3.5 h-3.5" />
            <span className="text-xs font-medium text-gray-700">{product.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Buy buttons */}
        <div className="flex gap-2 mt-auto pt-3">
          {product.amazonLink && (
            <a
              href={product.amazonLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-gray-900 text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              <FaAmazon className="w-3.5 h-3.5" />
              Amazon
            </a>
          )}
          {product.flipkartLink && (
            <a
              href={product.flipkartLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 flex items-center justify-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              <SiFlipkart className="w-3.5 h-3.5" />
              Flipkart
            </a>
          )}
          {product.affiliateLink && !product.amazonLink && !product.flipkartLink && (
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex-1 flex items-center justify-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              <HiExternalLink className="w-3.5 h-3.5" />
              Buy Now
            </a>
          )}
          {!product.amazonLink && !product.flipkartLink && !product.affiliateLink && (
            <Link
              href={`/${product.slug}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
            >
              View Details
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
