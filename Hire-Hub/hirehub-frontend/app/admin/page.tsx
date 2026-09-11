"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, Users, Briefcase, TrendingUp, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";

interface AdminStats {
  totalUsers?: number;
  totalJobs?: number;
  totalApplications?: number;
}

export default function AdminPage() {
  const { user, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.role !== "ROLE_ADMIN") { router.push("/"); return; }
    // Attempt to load admin stats — endpoint may not be implemented yet
    Promise.all([
      api.get("/v1/admin/stats").catch(() => ({ data: {} })),
    ]).then(([statsRes]) => {
      setStats(statsRes.data ?? {});
    }).finally(() => setLoading(false));
  }, [isAuthenticated, user, router]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
              <p className="text-slate-400 text-sm">Platform management</p>
            </div>
          </div>

          {/* Backend notice */}
          <div className="glass rounded-2xl p-4 border border-amber-500/20 mb-8 flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-300">Admin API endpoints needed</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Admin stats and management features require backend implementation of{" "}
                <code className="text-indigo-300 bg-indigo-500/10 px-1 rounded">/api/v1/admin/...</code> endpoints.
                The frontend is ready and will populate automatically once the API is available.
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total Users", value: stats.totalUsers ?? "–", icon: Users, color: "text-indigo-400", bg: "bg-indigo-500/15" },
              { label: "Total Jobs", value: stats.totalJobs ?? "–", icon: Briefcase, color: "text-cyan-400", bg: "bg-cyan-500/15" },
              { label: "Applications", value: stats.totalApplications ?? "–", icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/15" },
            ].map(({ label, value, icon: Icon, color, bg }) => (
              <div key={label} className="glass rounded-2xl p-5 flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{loading ? "..." : value}</p>
                  <p className="text-sm text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Placeholder admin sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["User Management", "Job Moderation"].map((section) => (
              <div key={section} className="glass rounded-2xl p-6">
                <h2 className="font-semibold text-white mb-3">{section}</h2>
                <div className="text-sm text-slate-400 border border-dashed border-white/10 rounded-xl p-8 text-center">
                  <Shield className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p>Requires admin backend endpoints</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
