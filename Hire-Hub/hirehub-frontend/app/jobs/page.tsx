"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import { jobsApi } from "@/lib/jobs";
import { useAuthStore } from "@/store/authStore";
import type { Job, PageResponse } from "@/types";

export default function JobsPage() {
  const { isAuthenticated } = useAuthStore();
  const [data, setData] = useState<PageResponse<Job>>({ content: [], totalElements: 0, totalPages: 0, size: 12, number: 0 });
  const [savedJobIds, setSavedJobIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(0);
  const [source, setSource] = useState<"platform" | "live">("platform");

  const fetchJobs = useCallback(async (currentFilters = filters, currentPage = page, currentSource = source) => {
    setLoading(true);
    try {
      if (currentSource === "live") {
        const result = await jobsApi.getExternal({ ...currentFilters, page: currentPage, size: 12 });
        setData({
          content: result,
          totalElements: result.length,
          totalPages: 1,
          size: 12,
          number: 0
        });
      } else {
        const result = await jobsApi.getAll({ ...currentFilters, page: currentPage, size: 12 });
        setData(result);
      }
    } catch {
      setData({ content: [], totalElements: 0, totalPages: 0, size: 12, number: 0 });
    } finally {
      setLoading(false);
    }
  }, [filters, page, source]);

  useEffect(() => { fetchJobs(); }, [fetchJobs]);

  useEffect(() => {
    if (isAuthenticated) {
      jobsApi.getSavedJobs()
        .then((jobs) => setSavedJobIds(new Set(jobs.map((j) => j.id))))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const handleFilter = (newFilters: Record<string, string>) => {
    setFilters(newFilters);
    setPage(0);
    fetchJobs(newFilters, 0, source);
  };

  const handleSourceChange = (newSource: "platform" | "live") => {
    setSource(newSource);
    setPage(0);
    fetchJobs(filters, 0, newSource);
  };

  const handleSaveToggle = async (jobId: number) => {
    if (!isAuthenticated) return;
    const isSaved = savedJobIds.has(jobId);
    try {
      if (isSaved) {
        await jobsApi.unsaveJob(jobId);
        setSavedJobIds((prev) => { const n = new Set(prev); n.delete(jobId); return n; });
      } else {
        await jobsApi.saveJob(jobId);
        setSavedJobIds((prev) => new Set([...prev, jobId]));
      }
    } catch { /* ignore */ }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Browse Jobs</h1>
              <p className="text-slate-400">
                {data.totalElements > 0
                  ? `${data.totalElements.toLocaleString()} opportunities available`
                  : "Discover your next opportunity"}
              </p>
            </div>

            {/* Source Toggle */}
            <div className="flex items-center p-1.5 cyber-card rounded-2xl border border-cyan-500/30 self-start sm:self-auto">
              <button
                onClick={() => handleSourceChange("platform")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  source === "platform"
                    ? "bg-cyan-500 text-black font-bold shadow-[0_0_12px_rgba(0,240,255,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                🏢 Platform Jobs
              </button>
              <button
                onClick={() => handleSourceChange("live")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  source === "live"
                    ? "bg-pink-500 text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.5)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                ⚡ Real-Time Live Feed
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-8">
            <JobFilters onFilter={handleFilter} />
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="cyber-card rounded-2xl p-5 h-56 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/40" />
                    <div className="flex-1 space-y-2 pt-1">
                      <div className="h-2.5 bg-cyan-950/40 rounded w-1/3" />
                      <div className="h-4 bg-cyan-950/60 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2.5 bg-cyan-950/30 rounded w-1/4" />
                    <div className="h-2.5 bg-cyan-950/30 rounded" />
                    <div className="h-2.5 bg-cyan-950/30 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : data.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {data.content.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    isSaved={savedJobIds.has(job.id)}
                    onSaveToggle={isAuthenticated ? handleSaveToggle : undefined}
                  />
                ))}
              </div>

              {/* Pagination */}
              {data.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 mt-10">
                  <button
                    onClick={() => { setPage(page - 1); fetchJobs(filters, page - 1); }}
                    disabled={page === 0}
                    className="p-2.5 rounded-xl cyber-card btn-cyber-outline disabled:opacity-40"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-slate-400">
                    Page <span className="text-white font-semibold">{page + 1}</span> of {data.totalPages}
                  </span>
                  <button
                    onClick={() => { setPage(page + 1); fetchJobs(filters, page + 1); }}
                    disabled={page >= data.totalPages - 1}
                    className="p-2.5 rounded-xl cyber-card btn-cyber-outline disabled:opacity-40"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-24 cyber-card rounded-2xl">
              <Briefcase className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-slate-400 text-sm">Try adjusting your search filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
