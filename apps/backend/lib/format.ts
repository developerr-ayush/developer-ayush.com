import { format, formatDistanceToNowStrict } from "date-fns";

export function shortDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return format(new Date(d), "d MMM yyyy");
}

export function dateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  return format(new Date(d), "d MMM yyyy, HH:mm");
}

export function timeOfDay(d: Date) {
  return format(d, "HH:mm");
}

export function ago(d: Date | string | null | undefined) {
  if (!d) return "—";
  return `${formatDistanceToNowStrict(new Date(d))} ago`;
}

export function compact(n: number) {
  return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(n);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export const SITE_URL = "https://developer-ayush.com";
export const postUrl = (slug: string) => `${SITE_URL}/blog/${slug}`;
