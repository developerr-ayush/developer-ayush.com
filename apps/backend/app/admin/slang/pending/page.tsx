"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { PageHeader } from "../../../../components/admin/PageHeader";
import { DataTable, Td, Tr } from "../../../../components/admin/DataTable";
import { StatusBadge } from "../../../../components/admin/StatusBadge";
import { Clock, CheckCircle, XCircle, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface SlangTerm {
  id: string;
  term: string;
  meaning: string;
  example?: string;
  category: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
  submittedBy?: string;
  submittedAt: string;
  createdAt: string;
  updatedAt: string;
}

const COLUMNS = [
  { label: "Term" },
  { label: "Meaning" },
  { label: "Category" },
  { label: "Submitted" },
  { label: "Actions", className: "text-right" },
];

export default function PendingSlangPage() {
  const [slangs, setSlangs] = useState<SlangTerm[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchPending = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({ status: "pending", page: page.toString(), limit: "15" });
      const res = await fetch(`/api/admin/slang?${params}`);
      const data = await res.json();
      if (data.success) {
        setSlangs(data.data);
        setTotalPages(data.meta.totalPages);
        setTotal(data.meta.stats?.pending ?? data.meta.total);
      } else {
        toast.error(data.error ?? "Failed to load pending terms");
      }
    } catch {
      toast.error("Failed to load pending terms");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => { fetchPending(); }, [fetchPending]);

  const handleAction = async (id: string, action: "approve" | "reject") => {
    try {
      const res = await fetch(`/api/admin/slang/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success(action === "approve" ? "Term approved ✓" : "Term rejected");
        fetchPending();
      } else {
        toast.error(data.error ?? "Action failed");
      }
    } catch {
      toast.error("Action failed");
    }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      {/* Back link */}
      <Link href="/admin/slang"
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-300 transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to all terms
      </Link>

      <PageHeader
        title="Pending Review"
        description={`${total} term${total !== 1 ? "s" : ""} awaiting your approval`}
      />

      {/* Quick info banner */}
      {total > 0 && (
        <div className="flex items-center gap-3 px-5 py-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <p className="text-sm text-amber-300">
            Review each term and either <strong>Approve</strong> it (makes it public) or{" "}
            <strong>Reject</strong> it (removes from queue).
          </p>
        </div>
      )}

      <DataTable
        columns={COLUMNS}
        isEmpty={!loading && slangs.length === 0}
        emptyState={
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-medium mb-1">All caught up!</p>
              <p className="text-sm text-slate-500">No pending slang terms to review.</p>
            </div>
          </div>
        }
      >
        {loading ? (
          <tr>
            <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm">Loading...</td>
          </tr>
        ) : (
          slangs.map((slang) => (
            <Tr key={slang.id}>
              {/* Term */}
              <Td>
                <p className="font-semibold text-white text-sm">{slang.term}</p>
              </Td>

              {/* Meaning */}
              <Td>
                <p className="text-sm text-slate-300 max-w-xs truncate">{slang.meaning}</p>
                {slang.example && (
                  <p className="text-xs text-slate-500 italic mt-0.5 max-w-xs truncate">&ldquo;{slang.example}&rdquo;</p>
                )}
              </Td>

              {/* Category */}
              <Td>
                <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/8 rounded-full text-slate-400">
                  {slang.category}
                </span>
              </Td>

              {/* Submitted */}
              <Td>
                <p className="text-xs text-slate-400">{formatDate(slang.submittedAt)}</p>
                <p className="text-xs text-slate-600">by {slang.submittedBy ?? "anon"}</p>
              </Td>

              {/* Actions */}
              <Td className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => handleAction(slang.id, "approve")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <CheckCircle className="w-3 h-3" /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(slang.id, "reject")}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg transition-colors"
                  >
                    <XCircle className="w-3 h-3" /> Reject
                  </button>
                </div>
              </Td>
            </Tr>
          ))
        )}
      </DataTable>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Page {page} of {totalPages}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage(p => p - 1)} disabled={page <= 1}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-40 text-slate-300 text-sm transition-colors">
              Previous
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= totalPages}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-40 text-slate-300 text-sm transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
