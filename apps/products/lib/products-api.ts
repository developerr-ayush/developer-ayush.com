const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  (typeof window !== "undefined" ? "" : "https://admin.developer-ayush.com");

export interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price?: number | null;
  salePrice?: number | null;
  image?: string | null;
  images: string[];
  affiliateLink?: string | null;
  amazonLink?: string | null;
  flipkartLink?: string | null;
  category?: string | null;
  brand?: string | null;
  rating?: number | null;
  instagramPost?: string | null;
  tags?: string | null;
  status: string;
  featured: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductsResponse {
  success: boolean;
  data: Product[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: { "Content-Type": "application/json", ...options.headers },
    });
    clearTimeout(timeoutId);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json() as Promise<T>;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
}

export async function getProducts(params?: {
  page?: number;
  size?: number;
  search?: string;
  category?: string;
  featured?: boolean;
}): Promise<ProductsResponse> {
  const url = new URL(`${API_BASE}/api/products`);
  if (params?.page) url.searchParams.set("p", String(params.page));
  if (params?.size) url.searchParams.set("size", String(params.size));
  if (params?.search) url.searchParams.set("search", params.search);
  if (params?.category) url.searchParams.set("category", params.category);
  if (params?.featured) url.searchParams.set("featured", "true");

  try {
    return await apiFetch<ProductsResponse>(url.toString(), {
      cache: "no-cache",
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { currentPage: 1, totalPages: 0, totalItems: 0, itemsPerPage: 12 },
    };
  }
}

export async function getProductBySlug(
  slug: string
): Promise<Product | null> {
  try {
    const data = await apiFetch<{ success: boolean; data: Product }>(
      `${API_BASE}/api/products/${slug}`,
      { cache: "no-store" }
    );
    return data.success ? data.data : null;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const data = await getProducts({ size: 100 });
    const cats = Array.from(
      new Set(data.data.map((p) => p.category).filter(Boolean) as string[])
    ).sort();
    return cats;
  } catch {
    return [];
  }
}
