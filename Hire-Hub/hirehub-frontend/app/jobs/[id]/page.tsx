"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MapPin, DollarSign, Clock, Briefcase, Building2,
  ArrowLeft, BookmarkCheck, Bookmark, CheckCircle, Globe, Send,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobsApi } from "@/lib/jobs";
import { useAuthStore } from "@/store/authStore";
import type { Job } from "@/types";
import { cn, formatSalary, formatDate, JOB_TYPE_LABELS, JOB_TYPE_COLORS } from "@/lib/utils";

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [applyError, setApplyError] = useState("");

  useEffect(() => {
    jobsApi.getById(Number(id))
      .then(setJob)
      .catch(() => router.push("/jobs"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSave = async () => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    try {
      if (isSaved) { await jobsApi.unsaveJob(Number(id)); setIsSaved(false); }
      else { await jobsApi.saveJob(Number(id)); setIsSaved(true); }
    } catch { /* ignore */ }
  };

  const handleApply = async () => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.role !== "ROLE_JOB_SEEKER") return;
    setApplying(true);
    setApplyError("");
    try {
      await jobsApi.apply(Number(id), { coverLetter });
      setApplied(true);
      setShowApplyModal(false);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setApplyError(e?.response?.data?.message ?? "Failed to apply. Please try again.");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-cyan-950/40 rounded w-1/3" />
            <div className="h-12 bg-cyan-950/60 rounded w-2/3" />
            <div className="h-48 bg-cyan-950/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/jobs" className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header card */}
              <div className="cyber-card rounded-2xl p-6">
                <div className="flex items-start gap-4 mb-5">
                  <div className="w-16 h-16 rounded-2xl bg-black/80 border border-cyan-500/40 p-1 flex items-center justify-center text-2xl font-bold text-cyan-300 shrink-0">
                    {job.company?.logoUrl ? (
                      <img src={job.company.logoUrl} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <span>{job.company?.name?.[0] ?? "C"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-400 text-sm">
                      {job.company?.name}
                    </p>
                    <h1 className="text-2xl font-bold text-white mt-0.5">{job.title}</h1>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <span className={cn("badge border", JOB_TYPE_COLORS[job.jobType])}>
                        {JOB_TYPE_LABELS[job.jobType]}
                      </span>
                      {job.location && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <MapPin className="w-3 h-3 text-cyan-400" />{job.location}
                        </span>
                      )}
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3 text-cyan-400" />Posted {formatDate(job.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="cyber-card rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Job Description</h2>
                <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {job.description}
                </div>
              </div>

              {/* Requirements */}
              {job.requirements && (
                <div className="cyber-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Requirements</h2>
                  <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {job.requirements}
                  </div>
                </div>
              )}

              {/* Skills */}
              {job.skillsRequired && (
                <div className="cyber-card rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-white mb-4">Required Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.split(",").map((skill) => (
                      <span key={skill.trim()} className="px-3 py-1.5 rounded-lg text-xs font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Apply card */}
              <div className="cyber-card rounded-2xl p-5 sticky top-24 border-cyan-500/40">
                {(job.salaryMin || job.salaryMax) && (
                  <div className="mb-4 pb-4 border-b border-cyan-500/20">
                    <p className="text-xs text-slate-400 mb-1">Salary Range</p>
                    <p className="text-xl font-bold text-emerald-400">{formatSalary(job.salaryMin, job.salaryMax)}</p>
                  </div>
                )}

                {applied ? (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-semibold">
                    <CheckCircle className="w-4 h-4" /> Application Submitted!
                  </div>
                ) : (
                  <button
                    onClick={() => isAuthenticated ? setShowApplyModal(true) : router.push("/auth/login")}
                    disabled={user?.role === "ROLE_RECRUITER"}
                    className="w-full btn-cyber-primary rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    {user?.role === "ROLE_RECRUITER" ? "Recruiter Account" : "Apply Now"}
                  </button>
                )}

                <button
                  onClick={handleSave}
                  className={cn(
                    "w-full mt-2.5 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium btn-cyber-outline",
                    isSaved && "border-cyan-400 text-cyan-300 bg-cyan-500/20"
                  )}
                >
                  {isSaved ? <><BookmarkCheck className="w-4 h-4" />Saved</> : <><Bookmark className="w-4 h-4" />Save Job</>}
                </button>

                {/* Company info */}
                <div className="mt-5 pt-5 border-t border-cyan-500/20 space-y-3">
                  <h3 className="text-sm font-semibold text-white">{job.company?.name}</h3>
                  {job.company?.industry && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Building2 className="w-3.5 h-3.5 text-cyan-400" />{job.company.industry}
                    </div>
                  )}
                  {job.company?.location && (
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-pink-400" />{job.company.location}
                    </div>
                  )}
                  {job.company?.website && (
                    <a href={job.company.website} target="_blank" rel="noreferrer"
                      className="flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 transition-colors">
                      <Globe className="w-3.5 h-3.5" />Visit website
                    </a>
                  )}
                </div>
              </div>

              {/* Similar jobs hint */}
              <div className="cyber-card rounded-2xl p-4 text-center">
                <Briefcase className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <p className="text-xs text-slate-400">
                  Looking for more?{" "}
                  <Link href="/jobs" className="text-cyan-400 hover:text-cyan-300">Browse all jobs</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setShowApplyModal(false)}>
          <div className="cyber-card rounded-2xl p-6 w-full max-w-lg shadow-2xl border-2 border-cyan-500/40">
            <h2 className="text-xl font-bold text-white mb-1">Apply for {job.title}</h2>
            <p className="text-sm text-slate-400 mb-5">at {job.company?.name}</p>
            {applyError && (
              <div className="px-4 py-3 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-300 text-sm mb-4">
                {applyError}
              </div>
            )}
            <label className="block text-sm font-medium text-slate-300 mb-2">Cover Letter (optional)</label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={6}
              placeholder="Tell the employer why you're a great fit..."
              className="input-base resize-none mb-5"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowApplyModal(false)} className="flex-1 btn-cyber-outline py-3 rounded-xl text-sm font-semibold">
                Cancel
              </button>
              <button onClick={handleApply} disabled={applying} className="flex-1 btn-cyber-primary py-3 rounded-xl text-sm font-semibold">
                {applying ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
