"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Users, Clock, TrendingUp, XCircle, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/authStore";
import { jobsApi } from "@/lib/jobs";
import type { Application, ApplicationStatus, Job } from "@/types";
import { cn, formatDate } from "@/lib/utils";

const NEXT_STATUSES: Record<ApplicationStatus, ApplicationStatus[]> = {
  PENDING: ["SHORTLISTED", "REJECTED"],
  SHORTLISTED: ["HIRED", "REJECTED"],
  HIRED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

const STATUS_ICONS: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-3.5 h-3.5 text-amber-400" />,
  SHORTLISTED: <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />,
  HIRED: <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />,
  REJECTED: <XCircle className="w-3.5 h-3.5 text-pink-400" />,
  WITHDRAWN: <XCircle className="w-3.5 h-3.5 text-slate-400" />,
};

export default function ManageJobPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== "ROLE_RECRUITER") { router.push("/"); return; }
    Promise.all([
      jobsApi.getById(Number(id)),
      jobsApi.getJobApplicants(Number(id)),
    ]).then(([j, apps]) => {
      setJob(j);
      setApplications(apps);
    }).catch(() => router.push("/recruiter"))
      .finally(() => setLoading(false));
  }, [id, isAuthenticated, user, router]);

  const handleStatusUpdate = async (appId: number, status: ApplicationStatus) => {
    setUpdating(appId);
    try {
      await jobsApi.updateApplicationStatus(appId, status);
      setApplications((prev) => prev.map((a) => a.id === appId ? { ...a, status } : a));
    } catch { /* ignore */ } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="pt-24 max-w-5xl mx-auto px-4 animate-pulse space-y-4">
          <div className="h-8 bg-cyan-950/40 rounded w-1/3" />
          <div className="h-48 bg-cyan-950/30 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/recruiter"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>

          {/* Job summary card */}
          {job && (
            <div className="cyber-card rounded-2xl p-6 mb-8 border-cyan-500/40">
              <h1 className="text-2xl font-bold text-white">{job.title}</h1>
              <p className="text-sm text-slate-400 mt-1">
                {job.location ?? "Remote"} · {job.jobType} · {applications.length} Applicants
              </p>
            </div>
          )}

          {/* Applicants panel */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Applicants ({applications.length})
            </h2>

            {applications.length === 0 ? (
              <div className="cyber-card rounded-2xl p-12 text-center">
                <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                <p className="text-white font-medium mb-1">No applicants yet</p>
                <p className="text-sm text-slate-400">Applications will appear here once candidates apply.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div key={app.id} className="cyber-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-white">
                          {app.jobSeekerProfile?.firstName ? `${app.jobSeekerProfile.firstName} ${app.jobSeekerProfile.lastName ?? ""}` : "Candidate"}
                        </p>
                        <span className="text-xs px-2.5 py-1 rounded bg-black/60 border border-cyan-500/30 text-cyan-300 flex items-center gap-1">
                          {STATUS_ICONS[app.status]}
                          {app.status}
                        </span>
                      </div>
                      {app.jobSeekerProfile?.location && (
                        <p className="text-xs text-slate-400 mt-1">{app.jobSeekerProfile.location}</p>
                      )}
                      {app.jobSeekerProfile?.skills && (
                        <p className="text-xs text-cyan-400/90 mt-1">
                          Skills: {app.jobSeekerProfile.skills}
                        </p>
                      )}
                      {app.coverLetter && (
                        <div className="mt-2 p-3 rounded-lg bg-black/50 border border-cyan-500/15 text-xs text-slate-300">
                          {app.coverLetter}
                        </div>
                      )}
                      <p className="text-xs text-slate-500 mt-2">Applied {formatDate(app.createdAt)}</p>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {NEXT_STATUSES[app.status]?.map((next) => (
                        <button
                          key={next}
                          disabled={updating === app.id}
                          onClick={() => handleStatusUpdate(app.id, next)}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold uppercase transition-all disabled:opacity-40",
                            next === "SHORTLISTED" && "bg-cyan-500/20 text-cyan-300 border border-cyan-400 hover:bg-cyan-500/30",
                            next === "HIRED" && "bg-emerald-500/20 text-emerald-300 border border-emerald-400 hover:bg-emerald-500/30",
                            next === "REJECTED" && "bg-pink-500/20 text-pink-300 border border-pink-400 hover:bg-pink-500/30"
                          )}
                        >
                          {next === "SHORTLISTED" ? "Shortlist" : next === "HIRED" ? "Hire" : "Reject"}
                        </button>
                      ))}
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
