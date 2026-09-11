import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { JobType, ApplicationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatSalary(min?: number, max?: number): string {
  if (!min && !max) return "Salary not specified";
  const fmt = (n: number) =>
    n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

export const JOB_TYPE_LABELS: Record<JobType, string> = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  REMOTE: "Remote",
};

export const JOB_TYPE_COLORS: Record<JobType, string> = {
  FULL_TIME: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  PART_TIME: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  CONTRACT: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  INTERNSHIP: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  REMOTE: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  PENDING: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  SHORTLISTED: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  REJECTED: "bg-red-500/20 text-red-300 border-red-500/30",
  HIRED: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  WITHDRAWN: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};
