"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, Briefcase, Users, TrendingUp, Eye,
  Trash2, ChevronRight, BarChart3,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/authStore";
import { jobsApi } from "@/lib/jobs";
import type { Job } from "@/types";
import { cn, timeAgo, JOB_TYPE_LABELS, JOB_TYPE_COLORS } from "@/lib/utils";

export default function RecruiterDashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.role !== "ROLE_RECRUITER") { router.push("/"); return; }
    jobsApi.getMyJobs()
      .then(setJobs)
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  const handleDelete = async (jobId: number) => {
    if (!confirm("Delete this job posting?")) return;
    await jobsApi.delete(jobId);
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const stats = {
    total: jobs.length,
    active: jobs.filter((j) => j.status === "ACTIVE").length,
    closed: jobs.filter((j) => j.status === "CLOSED").length,
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Recruiter Dashboard</h1>
              <p className="text-slate-400 mt-1">
                {user?.companyName ?? "Your company"} · Manage your postings
              </p>
            </div>
            <Link
              href="/recruiter/jobs/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cyber-primary text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Post a Job
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Postings", value: stats.total, icon: Briefcase, color: "text-cyan-400" },
              { label: "Active", value: stats.active, icon: TrendingUp, color: "text-emerald-400" },
              { label: "Closed", value: stats.closed, icon: BarChart3, color: "text-pink-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="cyber-card rounded-2xl p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-black/80 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{value}</p>
                  <p className="text-sm text-slate-400">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Jobs table */}
          <div className="cyber-card rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-cyan-500/20 flex items-center justify-between">
              <h2 className="font-semibold text-white">Your Job Postings</h2>
            </div>

            {loading ? (
              <div className="p-6 space-y-3 animate-pulse">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 bg-cyan-950/30 rounded-xl" />
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="p-16 text-center">
                <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <p className="text-white font-medium mb-2">No job postings yet</p>
                <p className="text-slate-400 text-sm mb-5">Start attracting top talent</p>
                <Link
                  href="/recruiter/jobs/new"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cyber-primary text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" /> Post your first job
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-cyan-500/10">
                {jobs.map((job) => (
                  <div key={job.id} className="px-6 py-4 flex items-center gap-4 hover:bg-cyan-500/5 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">{job.title}</p>
                        <span className={cn("badge border", JOB_TYPE_COLORS[job.jobType])}>
                          {JOB_TYPE_LABELS[job.jobType]}
                        </span>
                        <span className={cn(
                          "badge border text-xs",
                          job.status === "ACTIVE" ? "bg-emerald-950/60 text-emerald-300 border-emerald-500/30"
                          : "bg-slate-900 text-slate-400 border-slate-700"
                        )}>
                          {job.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {job.location ?? "Remote"} · Posted {timeAgo(job.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Link
                        href={`/recruiter/jobs/${job.id}`}
                        className="p-2 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-colors"
                        title="View applicants"
                      >
                        <Users className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/jobs/${job.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        title="View job"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(job.id)}
                        className="p-2 rounded-lg text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <Link
                        href={`/recruiter/jobs/${job.id}`}
                        className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
