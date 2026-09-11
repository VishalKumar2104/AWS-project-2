"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/authStore";
import { jobsApi } from "@/lib/jobs";
import type { JobType } from "@/types";

const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "INTERNSHIP", label: "Internship" },
  { value: "REMOTE", label: "Remote" },
];

interface FormState {
  title: string;
  description: string;
  requirements: string;
  skillsRequired: string;
  location: string;
  jobType: JobType;
  salaryMin: string;
  salaryMax: string;
}

const INITIAL: FormState = {
  title: "", description: "", requirements: "", skillsRequired: "",
  location: "", jobType: "FULL_TIME", salaryMin: "", salaryMax: "",
};

export default function PostJobPage() {
  const { isAuthenticated, user } = useAuthStore();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else if (user?.role !== "ROLE_RECRUITER") {
      router.push("/");
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== "ROLE_RECRUITER") {
    return null;
  }

  const set = (field: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const errs: Partial<Record<keyof FormState, string>> = {};
    if (!form.title || form.title.length < 3) errs.title = "Title must be at least 3 characters";
    if (!form.description || form.description.length < 50) errs.description = "Description must be at least 50 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      await jobsApi.create({
        title: form.title,
        description: form.description,
        requirements: form.requirements || undefined,
        skillsRequired: form.skillsRequired || undefined,
        location: form.location || undefined,
        jobType: form.jobType,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
      });
      router.push("/recruiter");
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Failed to create job. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/recruiter"
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to dashboard
          </Link>

          <h1 className="text-3xl font-bold text-white mb-2">Post a New Job</h1>
          <p className="text-slate-400 mb-8">Fill in the details to attract the best candidates</p>

          {serverError && (
            <div className="px-4 py-3 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-300 text-sm mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="cyber-card rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold text-white">Basic Information</h2>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Title *</label>
                <input
                  value={form.title}
                  onChange={set("title")}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="input-base"
                />
                {errors.title && <p className="text-pink-400 text-xs mt-1">{errors.title}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Job Type *</label>
                  <select value={form.jobType} onChange={set("jobType")} className="input-base bg-black">
                    {JOB_TYPES.map(({ value, label }) => (
                      <option key={value} value={value} className="bg-slate-900">{label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
                  <input
                    value={form.location}
                    onChange={set("location")}
                    placeholder="e.g. Bangalore or Remote"
                    className="input-base"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Min Salary (₹)</label>
                  <input
                    value={form.salaryMin}
                    onChange={set("salaryMin")}
                    type="number"
                    placeholder="e.g. 500000"
                    className="input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Max Salary (₹)</label>
                  <input
                    value={form.salaryMax}
                    onChange={set("salaryMax")}
                    type="number"
                    placeholder="e.g. 1200000"
                    className="input-base"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="cyber-card rounded-2xl p-6 space-y-5">
              <h2 className="font-semibold text-white">Job Details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  rows={6}
                  placeholder="Describe the role, responsibilities, and day-to-day work..."
                  className="input-base resize-y"
                />
                {errors.description && <p className="text-pink-400 text-xs mt-1">{errors.description}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Requirements</label>
                <textarea
                  value={form.requirements}
                  onChange={set("requirements")}
                  rows={4}
                  placeholder="e.g. 3+ years of React, Bachelor's in CS..."
                  className="input-base resize-y"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Required Skills</label>
                <input
                  value={form.skillsRequired}
                  onChange={set("skillsRequired")}
                  placeholder="e.g. React, TypeScript, Node.js (comma-separated)"
                  className="input-base"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Link href="/recruiter" className="flex-1 py-3.5 rounded-xl btn-cyber-outline text-center text-sm font-semibold">
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 btn-cyber-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 className="w-4 h-4 animate-spin" />Posting...</> : "Publish Job"}
              </button>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
