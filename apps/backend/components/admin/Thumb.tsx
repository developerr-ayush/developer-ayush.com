import Image from "next/image";
import { cn } from "@/lib/utils";

const OPTIMIZABLE = ["res.cloudinary.com", "res-console.cloudinary.com"];

function canOptimize(src: string) {
  try {
    return OPTIMIZABLE.includes(new URL(src).hostname);
  } catch {
    return false;
  }
}

/**
 * Thumbnail that uses next/image for Cloudinary URLs (allowed in next.config)
 * and falls back to a plain <img> for any other host so a stray URL can't crash a page.
 */
export function Thumb({
  src,
  size = 36,
  className,
  rounded = "rounded-md",
}: {
  src?: string | null;
  size?: number;
  className?: string;
  rounded?: string;
}) {
  const box = { width: size, height: size };
  const cls = cn("shrink-0 border border-line bg-surface-2 object-cover", rounded, className);
  if (!src) return <span aria-hidden="true" style={box} className={cn("shrink-0 border border-line bg-surface-2", rounded, className)} />;
  if (canOptimize(src)) {
    return <Image src={src} alt="" {...box} sizes={`${size}px`} className={cls} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt="" {...box} loading="lazy" className={cls} />;
}
