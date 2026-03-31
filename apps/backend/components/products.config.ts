// ============================================================
// products.config.ts
// Central source of truth for all products powered by this backend.
// To add a new product: append an object to the `products` array.
// ============================================================

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface QueryParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  default?: string;
}

export interface Endpoint {
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  queryParams?: QueryParam[];
  requestBody?: string;
  exampleRequest: string;
  exampleResponse: string;
  tags?: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** Live public URL */
  domain: string;
  /** Icon name from lucide-react — resolved in the UI layer */
  iconName: "BookOpen" | "MessageSquare" | "ShoppingBag" | "Mail" | "Layers";
  /** Tailwind CSS color token used for accent (e.g. "blue", "violet", "emerald") */
  color: "blue" | "violet" | "emerald" | "amber" | "rose" | "cyan";
  /** Internal admin route */
  adminPath: string;
  /** Key technical highlights shown on the card */
  highlights: string[];
  endpoints: Endpoint[];
}

// ---------------------------------------------------------------
// Product Definitions
// ---------------------------------------------------------------

const blogProduct: Product = {
  id: "blog",
  name: "Blog",
  tagline: "Personal blog & portfolio",
  description:
    "Powers the writing hub on developer-ayush.com. Supports rich content via Editor.js, categories, view tracking, and AI-assisted drafting.",
  domain: "https://developer-ayush.com",
  iconName: "BookOpen",
  color: "blue",
  adminPath: "/admin/blog",
  highlights: ["Paginated posts", "Category filtering", "Slug-based lookup", "AI draft generation"],
  endpoints: [
    {
      method: "GET",
      path: "/api/blog",
      summary: "List published posts",
      description:
        "Returns all published blog posts with pagination. Posts are ordered by creation date (newest first) and include author info and categories.",
      queryParams: [
        { name: "p", type: "number", required: false, description: "Page number", default: "1" },
        { name: "size", type: "number", required: false, description: "Items per page", default: "10" },
      ],
      exampleRequest: "curl 'https://api.developer-ayush.com/api/blog?p=1&size=5'",
      exampleResponse: `{
  "data": [
    {
      "id": "clx1...",
      "title": "Building a Personal OS",
      "slug": "building-personal-os",
      "status": "published",
      "author": { "id": "u1", "name": "Ayush", "email": "..." },
      "categories": [{ "id": "c1", "name": "Productivity" }],
      "createdAt": "2025-01-15T10:00:00.000Z"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 4,
    "totalItems": 38,
    "itemsPerPage": 10
  }
}`,
      tags: ["Public", "Paginated"],
    },
    {
      method: "GET",
      path: "/api/blog/[slug]",
      summary: "Get post by slug",
      description:
        "Fetches a single published blog post by its unique slug. Includes author name and categories. Does NOT increment view count (idempotent).",
      exampleRequest: "curl 'https://api.developer-ayush.com/api/blog/building-personal-os'",
      exampleResponse: `{
  "id": "clx1...",
  "title": "Building a Personal OS",
  "slug": "building-personal-os",
  "content": { ... },
  "viewCount": 1240,
  "author": { "name": "Ayush" },
  "categories": [{ "id": "c1", "name": "Productivity" }],
  "createdAt": "2025-01-15T10:00:00.000Z"
}`,
      tags: ["Public"],
    },
  ],
};

const slangsProduct: Product = {
  id: "slangs",
  name: "Slangs",
  tagline: "Indian developer slang dictionary",
  description:
    "Powers slangs.developer-ayush.com — a community-driven dictionary of Indian tech & internet slang. Supports public browsing and community submissions.",
  domain: "https://slangs.developer-ayush.com",
  iconName: "MessageSquare",
  color: "violet",
  adminPath: "/admin/slang",
  highlights: ["Community submissions", "Category browsing", "Featured terms", "Moderation queue"],
  endpoints: [
    {
      method: "GET",
      path: "/api/slang",
      summary: "List approved slang terms",
      description:
        "Returns all approved slang terms with pagination. Supports filtering by category, search query, and featured status. Results include category metadata.",
      queryParams: [
        { name: "page", type: "number", required: false, description: "Page number", default: "1" },
        { name: "limit", type: "number", required: false, description: "Items per page", default: "12" },
        { name: "category", type: "string", required: false, description: "Filter by category slug" },
        { name: "search", type: "string", required: false, description: "Search term or meaning" },
        { name: "featured", type: "boolean", required: false, description: "Only return featured terms" },
      ],
      exampleRequest: "curl 'https://api.developer-ayush.com/api/slang?category=coding&page=1'",
      exampleResponse: `{
  "success": true,
  "data": [
    {
      "id": "sl1",
      "term": "jugaad",
      "meaning": "A workaround or hack to solve a problem quickly",
      "example": "Bhai, ye jugaad hai, production mein mat daalna",
      "category": "coding",
      "is_featured": true,
      "submitted_by": "anonymous",
      "submitted_at": "2025-01-10T08:00:00.000Z"
    }
  ],
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 12,
    "totalPages": 10,
    "categories": ["coding", "internet", "workplace", "general"]
  }
}`,
      tags: ["Public", "CORS", "Paginated"],
    },
    {
      method: "POST",
      path: "/api/slang",
      summary: "Submit a slang term",
      description:
        "Allows community members to submit a new slang term. Submissions enter a moderation queue with 'pending' status and require admin approval before going live.",
      requestBody: `{
  "term": "chakka jam",
  "meaning": "When the CI/CD pipeline blocks all deployments",
  "example": "Yaar, chakka jam chal raha hai, merge mat karo",
  "category": "devops",
  "submitted_by": "your-github-handle"
}`,
      exampleRequest: `curl -X POST 'https://api.developer-ayush.com/api/slang' \\
  -H 'Content-Type: application/json' \\
  -d '{"term":"chakka jam","meaning":"When CI/CD blocks all deployments","category":"devops"}'`,
      exampleResponse: `{
  "success": true,
  "message": "Slang term submitted! It will be reviewed by our admin team.",
  "data": {
    "id": "sl99",
    "term": "chakka jam",
    "status": "pending",
    "submitted_at": "2025-03-31T04:00:00.000Z"
  }
}`,
      tags: ["Public", "CORS", "Write"],
    },
  ],
};

const productsProduct: Product = {
  id: "products",
  name: "Products",
  tagline: "Curated tech product catalogue",
  description:
    "Powers products.developer-ayush.com — a catalogue of handpicked tech products and tools. Supports search, category filters, and featured highlights.",
  domain: "https://products.developer-ayush.com",
  iconName: "ShoppingBag",
  color: "emerald",
  adminPath: "/admin/products",
  highlights: ["Full-text search", "Category filtering", "Featured products", "Slug/ID lookup"],
  endpoints: [
    {
      method: "GET",
      path: "/api/products",
      summary: "List published products",
      description:
        "Returns published products with pagination, search, and filtering. Featured products are boosted to the top. Supports CORS for cross-origin frontends.",
      queryParams: [
        { name: "p", type: "number", required: false, description: "Page number", default: "1" },
        { name: "size", type: "number", required: false, description: "Items per page", default: "12" },
        { name: "search", type: "string", required: false, description: "Search by name, brand, or tags" },
        { name: "category", type: "string", required: false, description: "Filter by category name" },
        { name: "featured", type: "boolean", required: false, description: "Return only featured products" },
      ],
      exampleRequest: "curl 'https://api.developer-ayush.com/api/products?search=mechanical+keyboard&featured=true'",
      exampleResponse: `{
  "success": true,
  "data": [
    {
      "id": "p1",
      "name": "Keychron Q1 Pro",
      "slug": "keychron-q1-pro",
      "brand": "Keychron",
      "category": "keyboards",
      "price": 199.99,
      "featured": true,
      "status": "published"
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 28,
    "itemsPerPage": 12
  }
}`,
      tags: ["Public", "CORS", "Paginated"],
    },
    {
      method: "GET",
      path: "/api/products/[id]",
      summary: "Get product by ID or slug",
      description:
        "Fetches a single published product. Accepts either the database ID (cuid) or a URL-friendly slug. Returns 404 if the product is unpublished or not found.",
      exampleRequest: "curl 'https://api.developer-ayush.com/api/products/keychron-q1-pro'",
      exampleResponse: `{
  "success": true,
  "data": {
    "id": "p1",
    "name": "Keychron Q1 Pro",
    "slug": "keychron-q1-pro",
    "brand": "Keychron",
    "description": "Wireless mechanical keyboard with QMK/VIA support",
    "price": 199.99,
    "tags": "mechanical,wireless,qmk",
    "featured": true,
    "status": "published",
    "createdAt": "2025-02-01T00:00:00.000Z"
  }
}`,
      tags: ["Public", "CORS"],
    },
  ],
};

// ---------------------------------------------------------------
// Exported config — add new products here
// ---------------------------------------------------------------
export const products: Product[] = [blogProduct, slangsProduct, productsProduct];

export const platformServices = [
  {
    name: "Authentication",
    description: "NextAuth.js with session management, Prisma adapter, and role-based access control.",
    icon: "ShieldCheck",
  },
  {
    name: "AI Services",
    description: "Blog drafting via Anthropic Claude, Groq, and OpenRouter. Async job queue with status polling.",
    icon: "Sparkles",
  },
  {
    name: "File Uploads",
    description: "Cloudinary-backed image upload with automatic optimization and CDN delivery.",
    icon: "Upload",
  },
  {
    name: "CORS Middleware",
    description: "Per-route CORS configuration with allowlist for all production domains and Vercel previews.",
    icon: "Globe",
  },
] as const;
