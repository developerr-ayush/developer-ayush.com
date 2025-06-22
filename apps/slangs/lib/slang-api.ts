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

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching slang terms:", error);
    // Return fallback data structure
    return {
      success: false,
      data: [],
      meta: { total: 0, categories: [] },
      message: "Failed to fetch slang terms",
    };
  }
}

export async function getFeaturedSlang(): Promise<SlangTerm | null> {
  try {
    const response = await fetch(`${API_BASE}/api/slang/featured`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success ? result.data : null;
  } catch (error) {
    console.error("Error fetching featured slang:", error);
    return null;
  }
}

export async function getCategories(): Promise<string[]> {
  try {
    const response = await fetch(`${API_BASE}/api/slang/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success ? result.data : [];
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
    const response = await fetch(`${API_BASE}/api/slang`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        term: data.term,
        meaning: data.meaning,
        example: data.example,
        category: data.category || "General",
        submitted_by: data.submittedBy || "anonymous",
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(
        result.message || `HTTP error! status: ${response.status}`
      );
    }

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
    const response = await fetch(`${API_BASE}/api/slang/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success
      ? result.data
      : { total: 0, pending: 0, approved: 0, categories: 0 };
  } catch (error) {
    console.error("Error fetching slang stats:", error);
    return { total: 0, pending: 0, approved: 0, categories: 0 };
  }
}
