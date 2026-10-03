"use client";

import { useId, useState } from "react";
import { Check, ChevronDown, Copy, Search } from "lucide-react";
import type { Endpoint, HttpMethod } from "./products.config";
import { cn } from "@/lib/utils";

const METHOD_TONE: Record<HttpMethod, string> = {
  GET: "chip-ok",
  POST: "chip-accent",
  PUT: "chip-warn",
  PATCH: "chip-warn",
  DELETE: "chip-danger",
};

function MethodBadge({ method }: { method: HttpMethod }) {
  return <span className={cn("chip w-14 justify-center font-semibold", METHOD_TONE[method])}>{method}</span>;
}

function CodeBlock({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="eyebrow">{label}</span>
        <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-muted hover:text-ink">
          {copied ? <Check className="size-3 text-ok" aria-hidden="true" /> : <Copy className="size-3" aria-hidden="true" />}
          <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
          <span className="sr-only"> {label}</span>
        </button>
      </div>
      <pre tabIndex={0} className="mono overflow-x-auto rounded-lg border border-line bg-code p-3.5 text-code-ink text-xs leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function QueryParamsTable({ params }: { params: NonNullable<Endpoint["queryParams"]> }) {
  return (
    <div className="space-y-1.5">
      <span className="eyebrow">Query parameters</span>
      <div className="table-scroll rounded-lg border border-line">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-line bg-surface-2 text-left text-muted">
              <th scope="col" className="px-3 py-2 font-medium">Param</th>
              <th scope="col" className="px-3 py-2 font-medium">Type</th>
              <th scope="col" className="px-3 py-2 font-medium">Description</th>
              <th scope="col" className="px-3 py-2 font-medium">Default</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {params.map((p) => (
              <tr key={p.name}>
                <td className="mono px-3 py-2 text-accent">
                  {p.name}
                  {p.required ? <span className="ml-1 text-danger" title="required">*</span> : null}
                </td>
                <td className="mono px-3 py-2 text-muted">{p.type}</td>
                <td className="px-3 py-2 text-muted">{p.description}</td>
                <td className="mono px-3 py-2 text-muted">{p.default ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EndpointRow({ endpoint }: { endpoint: Endpoint }) {
  const [open, setOpen] = useState(false);
  const uid = useId();

  return (
    <div className="border-b border-line last:border-0">
      <h4>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${uid}-panel`}
          className="flex w-full items-start gap-3 px-4 py-3.5 text-left hover:bg-surface-2"
        >
          <MethodBadge method={endpoint.method} />
          <span className="min-w-0 flex-1">
            <span className="mono block truncate text-[13px]">{endpoint.path}</span>
            <span className="block truncate text-xs text-muted">{endpoint.summary}</span>
          </span>
          <ChevronDown className={cn("mt-1 size-4 shrink-0 text-muted transition-transform", open && "rotate-180")} aria-hidden="true" />
        </button>
      </h4>
      {open ? (
        <div id={`${uid}-panel`} className="space-y-4 px-4 pb-5">
          <p className="text-[13.5px] text-muted">{endpoint.description}</p>
          {endpoint.queryParams && endpoint.queryParams.length > 0 ? <QueryParamsTable params={endpoint.queryParams} /> : null}
          {endpoint.requestBody ? <CodeBlock label="Request body (JSON)" code={endpoint.requestBody} /> : null}
          <CodeBlock label="Example request" code={endpoint.exampleRequest} />
          <CodeBlock label="Example response" code={endpoint.exampleResponse} />
        </div>
      ) : null}
    </div>
  );
}

export interface ApiExplorerProps {
  endpoints: Endpoint[];
}

export function ApiExplorer({ endpoints }: ApiExplorerProps) {
  const [search, setSearch] = useState("");
  const uid = useId();
  const q = search.trim().toLowerCase();
  const filtered = endpoints.filter((e) => e.path.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q));

  return (
    <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface">
      <div className="flex items-center gap-2 border-b border-line px-4">
        <Search className="size-3.5 shrink-0 text-muted" aria-hidden="true" />
        <label htmlFor={`${uid}-filter`} className="sr-only">
          Filter endpoints
        </label>
        <input
          id={`${uid}-filter`}
          type="search"
          placeholder="Filter endpoints…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full bg-transparent text-[13px] outline-none placeholder:text-muted"
        />
        <span className="mono shrink-0 text-[11px] text-muted" aria-live="polite">
          {filtered.length} endpoint{filtered.length === 1 ? "" : "s"}
        </span>
      </div>
      {filtered.length > 0 ? (
        filtered.map((ep) => <EndpointRow key={`${ep.method}-${ep.path}`} endpoint={ep} />)
      ) : (
        <p className="px-4 py-10 text-center text-sm text-muted">No endpoints match “{search}”.</p>
      )}
    </div>
  );
}
