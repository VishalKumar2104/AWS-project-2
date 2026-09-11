"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  ArrowRight,
  Briefcase,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
  Zap,
  Search,
  Building2,
  Globe,
  Shield,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import { jobsApi } from "@/lib/jobs";
import type { Job } from "@/types";

const STATS = [
  { value: "50K+", label: "Jobs Posted", icon: Briefcase, color: "text-cyan-400" },
  { value: "200K+", label: "Job Seekers", icon: Users, color: "text-pink-400" },
  { value: "15K+", label: "Companies", icon: Building2, color: "text-emerald-400" },
  { value: "95%", label: "Placement Rate", icon: TrendingUp, color: "text-purple-400" },
];

const FEATURES = [
  { icon: Search, title: "Smart Search", desc: "Find the perfect role with keyword, location, and type filters." },
  { icon: Zap, title: "Instant Apply", desc: "Apply to multiple jobs in minutes with your saved profile." },
  { icon: Shield, title: "Verified Employers", desc: "Every company is reviewed before posting on HireHub." },
  { icon: Globe, title: "Remote & Global", desc: "Find remote-first opportunities worldwide." },
];

const TESTIMONIALS = [
  { name: "Priya Sharma", role: "Frontend Developer", company: "Zomato", quote: "Got my dream job in 2 weeks!", rating: 5 },
  { name: "Arjun Mehta", role: "Product Manager", company: "Razorpay", quote: "The recruiter dashboard is incredible.", rating: 5 },
  { name: "Divya Nair", role: "Data Scientist", company: "PhonePe", quote: "10x better than other job boards.", rating: 5 },
];

export default function LandingPage() {
  const [featuredJobs, setFeaturedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobsApi.getAll({ size: 6 })
      .then((data) => setFeaturedJobs(data.content ?? []))
      .catch(() => setFeaturedJobs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 overflow-hidden border-b border-cyan-500/15">
        {/* Glow Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-cyan-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[350px] h-[350px] bg-pink-500/10 blur-[140px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full cyber-card border border-cyan-500/30 text-sm text-cyan-300 font-medium mb-8 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            #1 Tech Job Platform in 2026
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
            Find Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-teal-200 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
              Dream Job
            </span>
            <br />
            Land It Fast.
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            HireHub connects ambitious talent with top companies. Browse thousands of curated
            opportunities and get hired — all in one place.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/jobs"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold btn-cyber-primary"
              id="hero-browse-jobs-btn"
            >
              Browse Jobs <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold btn-cyber-outline"
              id="hero-post-job-btn"
            >
              Post a Job Free
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 mt-12 flex-wrap">
            {["Google", "Microsoft", "Netflix", "Razorpay", "Zomato", "CRED"].map((brand) => (
              <span key={brand} className="text-sm text-slate-500 font-semibold tracking-wide uppercase">
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-cyan-500/15 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map(({ value, label, icon: Icon, color }) => (
              <div key={label} className="cyber-card rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-cyan-500/30 flex items-center justify-center mx-auto mb-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-3xl font-extrabold text-white mb-1">{value}</p>
                <p className="text-sm text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-cyan-400 text-sm font-semibold uppercase tracking-widest mb-2">Latest Openings</p>
              <h2 className="text-3xl font-bold text-white">Featured Jobs</h2>
            </div>
            <Link href="/jobs" className="text-sm text-cyan-400 hover:text-white transition-colors flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="cyber-card rounded-2xl p-5 h-52 animate-pulse">
                  <div className="flex gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-950/40" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-cyan-950/40 rounded w-1/3" />
                      <div className="h-4 bg-cyan-950/60 rounded w-2/3" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-cyan-950/30 rounded" />
                    <div className="h-3 bg-cyan-950/30 rounded w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} showActions={false} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 cyber-card rounded-2xl">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No jobs available yet. Start the backend to see live listings.</p>
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 border-t border-cyan-500/15 bg-black/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <p className="text-pink-400 text-sm font-semibold uppercase tracking-widest mb-2">Simple Process</p>
            <h2 className="text-3xl font-bold text-white">Get Hired in 3 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Create Profile", desc: "Sign up and build your profile with skills, experience, and preferred roles." },
              { step: "02", title: "Discover Opportunities", desc: "Browse curated jobs filtered by your preferences and expertise." },
              { step: "03", title: "Apply & Get Hired", desc: "Apply in one click, track your status in real-time, and land the role." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="cyber-card rounded-2xl p-7 relative">
                <span className="absolute top-6 right-6 text-5xl font-black text-cyan-500/10">{step}</span>
                <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center mb-5">
                  <CheckCircle className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">Why HireHub?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="cyber-card rounded-2xl p-6">
                <div className="w-10 h-10 rounded-xl bg-cyan-950/50 border border-cyan-500/30 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 border-t border-cyan-500/15 bg-black/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white">What People Say</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, company, quote, rating }) => (
              <div key={name} className="cyber-card rounded-2xl p-6">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">&ldquo;{quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center text-sm font-bold text-black">
                    {name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-slate-400">{role} at {company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="cyber-card rounded-3xl p-10 text-center border-2 border-cyan-500/40 relative overflow-hidden shadow-[0_0_40px_rgba(0,240,255,0.2)]">
            <h2 className="text-3xl font-extrabold text-white mb-3">Ready to Find Your Dream Job?</h2>
            <p className="text-slate-400 mb-8 max-w-lg mx-auto">Join over 200,000 professionals who found their next opportunity on HireHub.</p>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-semibold btn-cyber-primary"
              id="cta-get-started-btn"
            >
              Get Started Free <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
