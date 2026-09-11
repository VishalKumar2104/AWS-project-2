import Link from "next/link";
import { MapPin, DollarSign, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import type { Job } from "@/types";
import { cn, formatSalary, timeAgo, JOB_TYPE_LABELS, JOB_TYPE_COLORS } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  isSaved?: boolean;
  onSaveToggle?: (jobId: number) => void;
  showActions?: boolean;
}

export default function JobCard({ job, isSaved = false, onSaveToggle, showActions = true }: JobCardProps) {
  return (
    <div className="cyber-card rounded-xl p-5 flex flex-col gap-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-lg bg-black/80 border border-cyan-500/40 p-1 flex items-center justify-center text-lg font-bold text-cyan-300 shrink-0 overflow-hidden relative shadow-[0_0_12px_rgba(0,240,255,0.15)] group-hover:border-cyan-400 group-hover:shadow-[0_0_18px_rgba(0,240,255,0.35)] transition-all">
            {job.company?.logoUrl ? (
              <img
                src={job.company.logoUrl}
                alt={job.company.name || "Company"}
                className="w-full h-full object-cover rounded"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                }}
              />
            ) : (
              <span>{job.company?.name?.[0] ?? "C"}</span>
            )}
          </div>
          <div>
            <p className="text-xs text-slate-400 font-medium">{job.company?.name || "HireHub Partner"}</p>
            <Link
              href={`/jobs/${job.id}`}
              className="text-base font-semibold text-white hover:text-cyan-300 transition-colors line-clamp-1"
            >
              {job.title}
            </Link>
          </div>
        </div>

        {showActions && onSaveToggle && (
          <button
            onClick={() => onSaveToggle(job.id)}
            className={cn(
              "p-2 rounded-lg transition-colors shrink-0",
              isSaved
                ? "text-cyan-400 bg-cyan-500/20 shadow-[0_0_8px_rgba(0,240,255,0.4)]"
                : "text-slate-500 hover:text-cyan-400 hover:bg-cyan-500/10"
            )}
            title={isSaved ? "Unsave job" : "Save job"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-2">
        <span className={cn("badge border", JOB_TYPE_COLORS[job.jobType])}>
          {JOB_TYPE_LABELS[job.jobType]}
        </span>
        {job.location && (
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <MapPin className="w-3 h-3 text-cyan-400" />
            {job.location}
          </span>
        )}
        {(job.salaryMin || job.salaryMax) && (
          <span className="flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
            <DollarSign className="w-3 h-3 text-emerald-400" />
            {formatSalary(job.salaryMin, job.salaryMax)}
          </span>
        )}
      </div>

      {/* Skills Required Chips */}
      {job.skillsRequired && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {job.skillsRequired.split(",").slice(0, 3).map((skill, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2 py-0.5 rounded bg-black/60 text-cyan-300 border border-cyan-500/25"
            >
              {skill.trim()}
            </span>
          ))}
        </div>
      )}

      {/* Description preview */}
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-cyan-500/15">
        <span className="flex items-center gap-1.5 text-xs text-slate-500">
          <Clock className="w-3 h-3 text-cyan-500/70" />
          {timeAgo(job.createdAt)}
        </span>
        <Link
          href={`/jobs/${job.id}`}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold btn-cyber-primary"
        >
          View Job
        </Link>
      </div>
    </div>
  );
}
