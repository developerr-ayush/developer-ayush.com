"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { PageHeader } from "../../../components/admin/PageHeader";
import { StatCard } from "../../../components/admin/StatCard";
import { DataTable, Td, Tr } from "../../../components/admin/DataTable";
import { StatusBadge } from "../../../components/admin/StatusBadge";
import { MessageSquare, Clock, CheckCircle, XCircle, Search, Star } from "lucide-react";

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

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const COLUMNS = [
  { label: "Term" },
  { label: "Meaning" },
  { label: "Category" },
  { label: "Status" },
  { label: "Submitted" },
  { label: "Actions", className: "text-right" },
];

export default function SlangManagementPage() {
  const [slangs, setSlangs] = useState<SlangTerm[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchSlangs = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        search: searchTerm,
        page: page.toString(),
        limit: "10",
      });
      const res = await fetch(`/api/admin/slang?${params}`);
      const data = await res.json();
      if (data.success) {
        setSlangs(data.data);
        setStats(data.meta.stats);
        setTotalPages(data.meta.totalPages);
      } else {
        toast.error(data.error ?? "Failed to fetch slang terms");
      }
    } catch {
      toast.error("Failed to fetch slang terms");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchTerm, page]);

  useEffect(() => { fetchSlangs(); }, [fetchSlangs]);

  const handleAction = async (id: string, action: string) => {
    try {
      const res = await fetch(`/api/admin/slang/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) { toast.success(data.message); fetchSlangs(); }
      else toast.error(data.error ?? "Action failed");
    } catch { toast.error("Action failed"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this slang term?")) return;
    try {
      const res = await fetch(`/api/admin/slang/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) { toast.success(data.message); fetchSlangs(); }
      else toast.error(data.error ?? "Delete failed");
    } catch { toast.error("Delete failed"); }
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Slang Dictionary"
        description="Moderate and manage community-submitted slang terms"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Terms" value={stats.total}
          icon={<MessageSquare className="w-5 h-5" />} color="blue" />
        <StatCard label="Pending Review" value={stats.pending}
          icon={<Clock className="w-5 h-5" />} color="amber" />
        <StatCard label="Approved" value={stats.approved}
          icon={<CheckCircle className="w-5 h-5" />} color="emerald" />
        <StatCard label="Rejected" value={stats.rejected}
          icon={<XCircle className="w-5 h-5" />} color="rose" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search terms..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
          <option value="all" className="bg-slate-900">All Status</option>
          <option value="pending" className="bg-slate-900">Pending</option>
          <option value="approved" className="bg-slate-900">Approved</option>
          <option value="rejected" className="bg-slate-900">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <DataTable
        columns={COLUMNS}
        isEmpty={!loading && slangs.length === 0}
        emptyState={
          <p className="text-slate-500 text-sm">
            {searchTerm ? `No results for "${searchTerm}"` : "No slang terms found"}
          </p>
        }
      >
        {loading ? (
          <tr>
            <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm">
              Loading...
            </td>
          </tr>
        ) : (
          slangs.map((slang) => (
            <Tr key={slang.id}>
              {/* Term */}
              <Td>
                <div className="font-medium text-white text-sm">
                  {slang.term}
                  {slang.isFeatured && (
                    <Star className="inline-block ml-1.5 w-3 h-3 text-amber-400 fill-amber-400" />
                  )}
                </div>
              </Td>

              {/* Meaning */}
              <Td>
                <div className="text-sm text-slate-300 max-w-xs truncate">{slang.meaning}</div>
                {slang.example && (
                  <div className="text-xs text-slate-500 italic mt-0.5 max-w-xs truncate">
                    &ldquo;{slang.example}&rdquo;
                  </div>
                )}
              </Td>

              {/* Category */}
              <Td>
                <span className="text-xs px-2 py-0.5 bg-white/5 border border-white/8 rounded-full text-slate-400">
                  {slang.category}
                </span>
              </Td>

              {/* Status */}
              <Td>
                <StatusBadge status={slang.status} dot />
              </Td>

              {/* Submitted */}
              <Td>
                <div className="text-xs text-slate-400">{formatDate(slang.submittedAt)}</div>
                <div className="text-xs text-slate-600">by {slang.submittedBy ?? "anon"}</div>
              </Td>

              {/* Actions */}
              <Td className="text-right">
                <div className="flex items-center justify-end gap-2 flex-wrap">
                  {slang.status === "pending" && (
                    <>
                      <button onClick={() => handleAction(slang.id, "approve")}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors">
                        Approve
                      </button>
                      <button onClick={() => handleAction(slang.id, "reject")}
                        className="px-2.5 py-1 text-[10px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                  {slang.status === "approved" && (
                    <button onClick={() => handleAction(slang.id, "feature")}
                      className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-colors ${
                        slang.isFeatured
                          ? "bg-amber-500/10 hover:bg-amber-500/20 text-amber-400"
                          : "bg-slate-500/10 hover:bg-slate-500/20 text-slate-400"
                      }`}>
                      {slang.isFeatured ? "Unfeature" : "Feature"}
                    </button>
                  )}
                  <button onClick={() => handleDelete(slang.id)}
                    className="px-2.5 py-1 text-[10px] font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors">
                    Delete
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
            <button onClick={() => setPage(page - 1)} disabled={page <= 1}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-300">
              Previous
            </button>
            <button onClick={() => setPage(page + 1)} disabled={page >= totalPages}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-slate-300">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
