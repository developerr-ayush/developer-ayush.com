const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : typeof window !== "undefined"
    ? "" // Use relative URLs in browser for proxy
    : "https://admin.developer-ayush.com"; // Fallback for SSR

export interface SlangTerm {
  id?: number;
  term: string;
  meaning: string;
  example?: string;
  category: string;
  is_featured?: boolean;
  status?: "pending" | "approved" | "rejected";
  submitted_by?: string;
  submitted_at?: string;
  approved_at?: string;
}

export interface SlangResponse {
  success: boolean;
  data: SlangTerm[];
  meta?: {
    total: number;
    categories: string[];
    featured?: SlangTerm;
  };
  message?: string;
}

// Helper function for making API requests with better error handling
async function makeAPIRequest(url: string, options: RequestInit = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw new Error("Request timeout - please try again");
      }
      throw error;
    }
    throw new Error("Network error - please check your connection");
  }
}

export async function getSlangTerms(params?: {
  search?: string;
  category?: string;
  featured?: boolean;
  page?: number;
  limit?: number;
}): Promise<SlangResponse> {
  try {
    const url = new URL(`${API_BASE}/api/slang`);

    if (params?.search) url.searchParams.set("search", params.search);
    if (params?.category && params.category !== "All")
      url.searchParams.set("category", params.category);
    if (params?.featured) url.searchParams.set("featured", "true");
    if (params?.page) url.searchParams.set("page", params.page.toString());
    if (params?.limit) url.searchParams.set("limit", params.limit.toString());

    const data = await makeAPIRequest(url.toString(), {
      method: "GET",
      cache: "no-store", // Disable caching for real-time data
    });

    return data;
  } catch (error) {
    console.error("Error fetching slang terms:", error);

    // Return structured error response
    return {
      success: false,
      data: [],
      meta: { total: 0, categories: [] },
      message:
        error instanceof Error ? error.message : "Failed to fetch slang terms",
    };
  }
}

export async function getFeaturedSlang(): Promise<SlangTerm | null> {
  try {
    const data = await makeAPIRequest(`${API_BASE}/api/slang/featured`, {
      method: "GET",
      cache: "no-store",
    });

    return data.success ? data.data : null;
  } catch (error) {
    console.error("Error fetching featured slang:", error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const data = await makeAPIRequest(`${API_BASE}/api/slang/categories`, {
      method: "GET",
      next: { revalidate: 3600 }, // Cache categories for 1 hour
    });

    return data.success ? data.data : [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return ["General", "Compliment", "Behavior", "Quality", "Emotion"];
  }
}

export async function submitSlangTerm(data: {
  term: string;
  meaning: string;
  example?: string;
  category?: string;
  submittedBy?: string;
}): Promise<{ success: boolean; message: string; data?: SlangTerm }> {
  try {
    const result = await makeAPIRequest(`${API_BASE}/api/slang`, {
      method: "POST",
      body: JSON.stringify({
        term: data.term,
        meaning: data.meaning,
        example: data.example,
        category: data.category || "General",
        submitted_by: data.submittedBy || "anonymous",
      }),
    });

    return {
      success: true,
      message:
        result.message ||
        "Slang term submitted successfully! It will be reviewed by our team.",
      data: result.data,
    };
  } catch (error) {
    console.error("Error submitting slang term:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to submit slang term. Please try again.",
    };
  }
}

export async function getSlangStats(): Promise<{
  total: number;
  pending: number;
  approved: number;
  categories: number;
}> {
  try {
    const data = await makeAPIRequest(`${API_BASE}/api/slang/stats`, {
      method: "GET",
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    return data.success
      ? data.data
      : { total: 0, pending: 0, approved: 0, categories: 0 };
  } catch (error) {
    console.error("Error fetching slang stats:", error);
    return { total: 0, pending: 0, approved: 0, categories: 0 };
  }
}
