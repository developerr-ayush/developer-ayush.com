"use client";

import { useState } from "react";
import { Copy, Check, ChevronDown, Search, Terminal } from "lucide-react";
import type { Endpoint, HttpMethod } from "./products.config";

// ── Method badge ────────────────────────────────────────────────
const METHOD_STYLES: Record<HttpMethod, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
  POST: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  PUT: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
  PATCH: "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20",
  DELETE: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
};

function MethodBadge({ method }: { method: HttpMethod }) {
  return (
    <span
      className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${METHOD_STYLES[method]}`}
    >
      {method}
    </span>
  );
}

// ── Code block with copy button ──────────────────────────────────
function CodeBlock({
  code,
  id,
  label,
  colorClass = "text-slate-300",
}: {
  code: string;
  id: string;
  label: string;
  colorClass?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          {label}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[10px] font-medium text-slate-400 hover:text-white transition-colors"
        >
          {copied ? (
            <><Check className="w-3 h-3 text-emerald-400" /> Copied</>
          ) : (
            <><Copy className="w-3 h-3" /> Copy</>
          )}
        </button>
      </div>
      <pre
        className={`p-3.5 bg-black/50 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto border border-white/5 ${colorClass}`}
      >
        {code}
      </pre>
    </div>
  );
}

// ── Query params table ───────────────────────────────────────────
function QueryParamsTable({
  params,
}: {
  params: NonNullable<Endpoint["queryParams"]>;
}) {
  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
        Query Parameters
      </span>
      <div className="rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-white/[0.03] border-b border-white/5">
              <th className="px-3 py-2 text-left font-semibold text-slate-400">Param</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-400">Type</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-400">Description</th>
              <th className="px-3 py-2 text-left font-semibold text-slate-400">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {params.map((p) => (
              <tr key={p.name} className="hover:bg-white/[0.02]">
                <td className="px-3 py-2 font-mono text-blue-300">
                  {p.name}
                  {p.required && (
                    <span className="ml-1 text-rose-400 text-[9px]">*</span>
                  )}
                </td>
                <td className="px-3 py-2 text-slate-500 font-mono">{p.type}</td>
                <td className="px-3 py-2 text-slate-400">{p.description}</td>
                <td className="px-3 py-2 text-slate-500 font-mono">
                  {p.default ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Single endpoint row ──────────────────────────────────────────
function EndpointRow({ endpoint, idx }: { endpoint: Endpoint; idx: number }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/5 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors group"
      >
        <MethodBadge method={endpoint.method} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-0.5">
            <span className="text-sm font-mono text-slate-200">{endpoint.path}</span>
            {endpoint.tags?.map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-white/5 border border-white/5 rounded text-[9px] text-slate-500 font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500 truncate">{endpoint.summary}</p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 animate-fadeIn">
          <p className="text-sm text-slate-400 leading-relaxed">{endpoint.description}</p>

          {endpoint.queryParams && endpoint.queryParams.length > 0 && (
            <QueryParamsTable params={endpoint.queryParams} />
          )}

          {endpoint.requestBody && (
            <CodeBlock
              id={`body-${idx}`}
              label="Request Body (JSON)"
              code={endpoint.requestBody}
              colorClass="text-amber-200"
            />
          )}

          <CodeBlock
            id={`req-${idx}`}
            label="Example Request (cURL)"
            code={endpoint.exampleRequest}
            colorClass="text-blue-200"
          />

          <CodeBlock
            id={`res-${idx}`}
            label="Example Response"
            code={endpoint.exampleResponse}
            colorClass="text-emerald-200"
          />
        </div>
      )}
    </div>
  );
}

// ── Public component ─────────────────────────────────────────────
export interface ApiExplorerProps {
  endpoints: Endpoint[];
}

export function ApiExplorer({ endpoints }: ApiExplorerProps) {
  const [search, setSearch] = useState("");

  const filtered = endpoints?.filter(
    (e) =>
      e.path.toLowerCase().includes(search.toLowerCase()) ||
      e.summary.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden">
      {/* Search bar */}
      <div className="px-5 py-3 border-b border-white/10 flex items-center gap-2">
        <Terminal className="w-4 h-4 text-slate-500 flex-shrink-0" />
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter endpoints..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 bg-transparent text-xs text-slate-300 placeholder-slate-600 focus:outline-none"
          />
        </div>
        <span className="text-[10px] text-slate-600 flex-shrink-0">
          {filtered?.length} endpoint{filtered?.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Endpoint list */}
      {filtered?.length > 0 ? (
        filtered.map((ep, idx) => (
          <EndpointRow key={`${ep.method}-${ep.path}`} endpoint={ep} idx={idx} />
        ))
      ) : (
        <div className="py-10 text-center text-slate-600 text-sm">
          No endpoints match &quot;{search}&quot;
        </div>
      )}
    </div>
  );
}
