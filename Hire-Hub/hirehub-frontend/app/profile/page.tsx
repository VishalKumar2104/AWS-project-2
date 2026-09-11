"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, User, MapPin, Phone, FileText, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useAuthStore } from "@/store/authStore";
import { jobsApi } from "@/lib/jobs";

const schema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  resumeUrl: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    jobsApi.getProfile()
      .then((profile) => reset(profile))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated, router, reset]);

  const onSubmit = async (data: FormData) => {
    setServerError(""); setSaved(false);
    try {
      await jobsApi.updateProfile(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setServerError(e?.response?.data?.message ?? "Failed to save. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen"><Navbar />
        <div className="pt-24 max-w-2xl mx-auto px-4 animate-pulse space-y-4">
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
        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          <div className="border-b border-cyan-500/20 pb-4 mb-8">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-slate-400 mt-1">Manage your profile information and resume</p>
          </div>

          {saved && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm font-semibold mb-6">
              <CheckCircle className="w-4 h-4" /> Profile updated successfully!
            </div>
          )}

          {serverError && (
            <div className="px-4 py-3 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-300 text-sm mb-6">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="cyber-card rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white">Profile Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">First Name</label>
                  <input {...register("firstName")} placeholder="John" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Last Name</label>
                  <input {...register("lastName")} placeholder="Doe" className="input-base" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Location</label>
                <input {...register("location")} placeholder="e.g. Bangalore, India" className="input-base" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Phone Number</label>
                <input {...register("phone")} placeholder="+91 98765 43210" className="input-base" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Skills (comma-separated)</label>
                <input {...register("skills")} placeholder="React, TypeScript, Next.js, Node.js" className="input-base" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Resume URL</label>
                <input {...register("resumeUrl")} placeholder="https://drive.google.com/your-resume.pdf" className="input-base" />
                {errors.resumeUrl && <p className="text-pink-400 text-xs mt-1">{errors.resumeUrl.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Bio</label>
                <textarea
                  {...register("bio")}
                  rows={4}
                  placeholder="Tell recruiters about yourself, experience, and what you're looking for..."
                  className="input-base resize-y"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-cyber-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
