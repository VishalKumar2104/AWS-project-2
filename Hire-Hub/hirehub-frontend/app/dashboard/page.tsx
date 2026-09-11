"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase, Bookmark, FileText, Clock, CheckCircle, XCircle,
  ArrowRight, TrendingUp, Search,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import { useAuthStore } from "@/store/authStore";
import { jobsApi } from "@/lib/jobs";
import type { Application, Job } from "@/types";
import { cn, formatDate, STATUS_COLORS } from "@/lib/utils";

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3.5 h-3.5 text-amber-400" />,
  SHORTLISTED: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
  HIRED: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  REJECTED: <XCircle className="w-3.5 h-3.5 text-pink-400" />,
  WITHDRAWN: <XCircle className="w-3.5 h-3.5 text-slate-400" />,
};

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.role !== "ROLE_JOB_SEEKER") { router.push("/"); return; }

    Promise.all([
      jobsApi.getMyApplications().catch(() => []),
      jobsApi.getSavedJobs().catch(() => []),
    ]).then(([apps, saved]) => {
      setApplications(apps);
      setSavedJobs(saved);
    }).finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === "PENDING").length,
    shortlisted: applications.filter((a) => a.status === "SHORTLISTED").length,
    hired: applications.filter((a) => a.status === "HIRED").length,
  };

  const handleUnsave = async (jobId: number) => {
    await jobsApi.unsaveJob(jobId);
    setSavedJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 max-w-7xl mx-auto px-4 sm:px-6 animate-pulse space-y-6">
          <div className="h-8 bg-cyan-950/40 rounded w-1/3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-cyan-950/30 rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {user?.firstName ?? user?.email?.split("@")[0]}! 👋
              </h1>
              <p className="text-slate-400 mt-1">Track your applications and saved jobs</p>
            </div>
            <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cyber-primary text-sm font-semibold">
              <Search className="w-4 h-4" /> Find Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[
              { label: "Total Applied", value: stats.total, icon: FileText, color: "text-cyan-400" },
              { label: "Pending", value: stats.pending, icon: Clock, color: "text-amber-400" },
              { label: "Shortlisted", value: stats.shortlisted, icon: TrendingUp, color: "text-purple-400" },
              { label: "Hired", value: stats.hired, icon: CheckCircle, color: "text-emerald-400" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="cyber-card rounded-2xl p-5">
                <div className="w-9 h-9 rounded-xl bg-black/60 border border-cyan-500/30 flex items-center justify-center mb-3">
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-sm text-slate-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  My Applications
                </h2>
              </div>

              {applications.length === 0 ? (
                <div className="cyber-card rounded-2xl p-10 text-center">
                  <Briefcase className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                  <p className="text-white font-medium mb-1">No applications yet</p>
                  <p className="text-sm text-slate-400 mb-5">Start exploring opportunities!</p>
                  <Link href="/jobs" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-cyber-primary text-sm font-semibold">
                    Browse Jobs <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((app) => (
                    <div key={app.id} className="cyber-card rounded-2xl p-4 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-black/80 border border-cyan-500/30 flex items-center justify-center text-sm font-bold text-cyan-300 shrink-0">
                        {app.job?.company?.name?.[0] ?? "C"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link href={`/jobs/${app.job?.id}`} className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors line-clamp-1">
                          {app.job?.title}
                        </Link>
                        <p className="text-xs text-slate-400 mt-0.5">{app.job?.company?.name} · Applied {formatDate(app.createdAt)}</p>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1.5">
                        {STATUS_ICONS[app.status]}
                        {app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Saved Jobs */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-pink-400" />
                  Saved Jobs
                </h2>
                <span className="text-xs text-slate-400">{savedJobs.length} saved</span>
              </div>

              {savedJobs.length === 0 ? (
                <div className="cyber-card rounded-2xl p-8 text-center">
                  <Bookmark className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">No saved jobs yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedJobs.slice(0, 5).map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved
                      onSaveToggle={() => handleUnsave(job.id)}
                    />
                  ))}
                  {savedJobs.length > 5 && (
                    <p className="text-center text-sm text-slate-500">+{savedJobs.length - 5} more saved</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
