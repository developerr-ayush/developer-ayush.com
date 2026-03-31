"use client";

import { useState } from "react";
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  Copy, 
  Terminal, 
  Check, 
  Database, 
  ShoppingBag, 
  Sparkles,
  BookOpen
} from "lucide-react";

interface Endpoint {
  method: "GET" | "POST" | "PUT" | "DELETE";
  path: string;
  description: string;
  category: "Content" | "E-commerce" | "AI";
  request?: string;
  response: string;
}

const endpoints: Endpoint[] = [
  {
    method: "GET",
    path: "/api/blog",
    description: "Fetch paginated list of published blog posts.",
    category: "Content",
    request: "curl -X GET 'https://api.example.com/api/blog?p=1&size=10'",
    response: `{
  "data": [
    { "id": "1", "title": "Hello World", "slug": "hello-world", ... }
  ],
  "meta": { "currentPage": 1, "totalPages": 5, "totalItems": 50 }
}`
  },
  {
    method: "GET",
    path: "/api/blog/[slug]",
    description: "Fetch a single blog post by its unique slug.",
    category: "Content",
    request: "curl -X GET 'https://api.example.com/api/blog/my-first-post'",
    response: `{
  "id": "1",
  "title": "My First Post",
  "content": "...",
  "author": { "name": "Admin" }
}`
  },
  {
    method: "GET",
    path: "/api/products",
    description: "List products with search and category filtering.",
    category: "E-commerce",
    request: "curl -X GET 'https://api.example.com/api/products?search=shoes&category=fashion'",
    response: `{
  "success": true,
  "data": [
    { "id": "p1", "name": "Running Shoes", "price": 89.99, ... }
  ],
  "meta": { "currentPage": 1, "totalPages": 2 }
}`
  },
  {
    method: "POST",
    path: "/api/ai/generate-blog",
    description: "Generate a blog post content using AI models.",
    category: "AI",
    request: "curl -X POST 'https://api.example.com/api/ai/generate-blog' -H 'Content-Type: application/json' -d '{ \"topic\": \"Next.js 15 Features\" }'",
    response: `{
  "success": true,
  "jobId": "job_12345",
  "status": "queued"
}`
  }
];

export function ApiExplorer() {
  const [activeTab, setActiveTab] = useState<Endpoint["category"] | "All">("All");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredEndpoints = endpoints.filter(e => {
    const matchesTab = activeTab === "All" || e.category === activeTab;
    const matchesSearch = e.path.toLowerCase().includes(search.toLowerCase()) || 
                          e.description.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
      {/* Header */}
      <div className="p-6 border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Terminal className="w-5 h-5 text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-white">API Reference</h2>
        </div>
        
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search endpoints..." 
            className="pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 w-full md:w-64 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-6 py-4 gap-2 overflow-x-auto no-scrollbar border-b border-white/10">
        {["All", "Content", "E-commerce", "AI"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab 
                ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="divide-y divide-white/5 max-h-[600px] overflow-y-auto">
        {filteredEndpoints.length > 0 ? (
          filteredEndpoints.map((endpoint, idx) => (
            <div key={`${endpoint.path}-${idx}`} className="group transition-colors hover:bg-white/[0.02]">
              <button 
                className="w-full px-6 py-5 flex items-start gap-4 text-left"
                onClick={() => setExpanded(expanded === endpoint.path ? null : endpoint.path)}
              >
                <div className={`mt-1 flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold ${
                  endpoint.method === "GET" ? "bg-emerald-500/10 text-emerald-400" : 
                  endpoint.method === "POST" ? "bg-amber-500/10 text-amber-400" : 
                  "bg-blue-500/10 text-blue-400"
                }`}>
                  {endpoint.method}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-mono text-gray-200 truncate">{endpoint.path}</span>
                    <span className="px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-gray-500 border border-white/5">
                      {endpoint.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 line-clamp-1">{endpoint.description}</p>
                </div>
                <div className={`transition-transform duration-200 ${expanded === endpoint.path ? "rotate-180" : ""}`}>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </div>
              </button>

              {expanded === endpoint.path && (
                <div className="px-6 pb-6 pt-0 animate-fadeIn">
                  <div className="space-y-4">
                    {endpoint.request && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Example Request</span>
                          <button 
                            onClick={() => copyToClipboard(endpoint.request!, `req-${idx}`)}
                            className="text-[10px] font-medium text-blue-400 flex items-center gap-1 hover:text-blue-300"
                          >
                            {copied === `req-${idx}` ? (
                              <><Check className="w-3 h-3" /> Copied</>
                            ) : (
                              <><Copy className="w-3 h-3" /> Copy</>
                            )}
                          </button>
                        </div>
                        <pre className="p-4 bg-black/40 rounded-xl text-xs font-mono text-blue-200 border border-white/5 leading-relaxed overflow-x-auto">
                          {endpoint.request}
                        </pre>
                      </div>
                    )}
                    
                    <div className="space-y-1.5">
                      <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Example Response</span>
                      <pre className="p-4 bg-black/40 rounded-xl text-xs font-mono text-emerald-100 border border-white/5 overflow-x-auto">
                        {endpoint.response}
                      </pre>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="px-6 py-20 text-center">
            <div className="inline-block p-3 bg-white/5 rounded-full mb-4">
              <Search className="w-6 h-6 text-gray-500" />
            </div>
            <p className="text-gray-400">No endpoints found matching your search.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 bg-white/[0.02] border-t border-white/10 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Full Docs Coming Soon</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Database className="w-3.5 h-3.5" />
          <span>PostgreSQL DB</span>
        </div>
      </div>
    </div>
  );
}
