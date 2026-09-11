import Link from "next/link";
import { Briefcase, Share2, Code2, Globe } from "lucide-react";

const JOB_SEEKER_LINKS = [
  { label: "Browse Jobs", href: "/jobs" },
  { label: "Create Profile", href: "/profile" },
  { label: "Saved Jobs", href: "/dashboard" },
  { label: "My Applications", href: "/dashboard" },
];

const RECRUITER_LINKS = [
  { label: "Post a Job", href: "/recruiter/jobs/new" },
  { label: "Manage Listings", href: "/recruiter" },
  { label: "View Applicants", href: "/recruiter" },
  { label: "Recruiter Dashboard", href: "/recruiter" },
];

const SOCIAL_LINKS = [
  { icon: Share2, href: "#", label: "Twitter" },
  { icon: Code2, href: "#", label: "GitHub" },
  { icon: Globe, href: "#", label: "LinkedIn" },
];

const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Contact"];

export default function Footer() {
  return (
    <footer className="border-t border-cyan-500/20 mt-20 bg-black/90 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                <Briefcase className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                HireHub
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-4">
              Connecting top talent with industry-leading companies. Find your next opportunity or hire the best engineers.
            </p>
            <div className="flex items-center gap-3 mt-5">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-2 rounded-lg bg-black/80 border border-cyan-500/30 text-cyan-400 hover:text-white hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,240,255,0.4)] transition-all"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Job Seeker Links */}
          <div>
            <h4 className="text-sm font-semibold text-cyan-300 mb-4">For Job Seekers</h4>
            <ul className="space-y-2.5">
              {JOB_SEEKER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Recruiter Links */}
          <div>
            <h4 className="text-sm font-semibold text-pink-400 mb-4">For Recruiters</h4>
            <ul className="space-y-2.5">
              {RECRUITER_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-cyan-500/15 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} HireHub. All rights reserved.</p>
          <div className="flex gap-5">
            {LEGAL_LINKS.map((item) => (
              <Link key={item} href="#" className="hover:text-slate-300 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
