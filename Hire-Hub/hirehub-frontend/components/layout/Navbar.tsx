"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Briefcase,
  Bell,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  Building2,
  Shield,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { signOut } from "@/lib/firebaseAuth";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(3);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Application Received",
      desc: "Your application for Senior Full Stack Engineer at Google has been received.",
      time: "10m ago",
      read: false,
      link: "/dashboard"
    },
    {
      id: 2,
      title: "New Job Matches",
      desc: "3 new jobs matching your skills (React, TypeScript) were posted today.",
      time: "1h ago",
      read: false,
      link: "/jobs"
    },
    {
      id: 3,
      title: "Daily Feed Refreshed",
      desc: "12 new live tech roles were synchronized from top tech companies.",
      time: "3h ago",
      read: false,
      link: "/jobs"
    }
  ]);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (e) {
      console.error("Sign out error:", e);
    }
    logout();
    router.push("/auth/login");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    if (user.role === "ROLE_JOB_SEEKER") return "/dashboard";
    if (user.role === "ROLE_RECRUITER") return "/recruiter";
    if (user.role === "ROLE_ADMIN") return "/admin";
    return "/";
  };

  const getDashboardIcon = () => {
    if (!user) return null;
    if (user.role === "ROLE_RECRUITER") return <Building2 className="w-4 h-4 text-cyan-400" />;
    if (user.role === "ROLE_ADMIN") return <Shield className="w-4 h-4 text-pink-400" />;
    return <LayoutDashboard className="w-4 h-4 text-cyan-400" />;
  };

  const navLinks = [
    { href: "/jobs", label: "Browse Jobs" },
    ...(isAuthenticated ? [{ href: getDashboardLink(), label: "Dashboard", icon: getDashboardIcon() }] : []),
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-cyan-500/20 backdrop-blur-2xl bg-black/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,240,255,0.8)] transition-all">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-cyan-200 to-pink-400 bg-clip-text text-transparent">
              HireHub
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                  pathname === link.href
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    : "text-slate-300 hover:text-white hover:bg-cyan-500/5"
                )}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotificationsOpen(!notificationsOpen);
                      setUserMenuOpen(false);
                    }}
                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-colors relative border border-transparent hover:border-cyan-500/30"
                    title="Notifications"
                  >
                    <Bell className="w-4 h-4" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_8px_#00f0ff]" />
                    )}
                  </button>

                  {notificationsOpen && (
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 cyber-card rounded-xl shadow-2xl p-4 z-50 border border-cyan-500/40">
                      <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-bold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={markAllRead}
                            className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="divide-y divide-cyan-500/10 my-2 max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <Link
                            key={n.id}
                            href={n.link}
                            onClick={() => setNotificationsOpen(false)}
                            className="block py-2.5 px-2 rounded-lg hover:bg-cyan-500/5 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                                {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 inline-block" />}
                                {n.title}
                              </span>
                              <span className="text-[10px] text-slate-500">{n.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                              {n.desc}
                            </p>
                          </Link>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-cyan-500/20 text-center">
                        <Link
                          href="/dashboard"
                          onClick={() => setNotificationsOpen(false)}
                          className="text-xs text-cyan-400 hover:text-white font-medium transition-colors inline-block"
                        >
                          View all in Dashboard →
                        </Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-950/30 hover:bg-cyan-950/60 transition-all"
                  >
                    <div className="w-7 h-7 rounded bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center text-xs font-bold text-black">
                      {(user.firstName?.[0] ?? user.email[0]).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-200">
                      {user.firstName ?? user.email.split("@")[0]}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-cyan-400 transition-transform", userMenuOpen && "rotate-180")} />
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 cyber-card rounded-lg shadow-2xl py-1 z-50 border border-cyan-500/40">
                      <div className="px-4 py-2.5 border-b border-cyan-500/20">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-medium text-white truncate">{user.email}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-pink-400 hover:bg-pink-500/10 hover:text-pink-300 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg text-sm font-semibold btn-cyber-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-cyan-400 hover:text-white hover:bg-cyan-500/10 transition-colors border border-cyan-500/30"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-cyan-500/20 px-4 py-4 flex flex-col gap-2 bg-black/95">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/40"
                  : "text-slate-300 hover:text-white hover:bg-cyan-500/5"
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-cyan-500/5 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                    {unreadCount} new
                  </span>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="mt-2 w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-pink-400 hover:bg-pink-500/10"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-cyan-500/20">
              <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                className="text-center px-4 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-cyan-500/10 border border-cyan-500/30">
                Sign in
              </Link>
              <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                className="text-center px-4 py-2.5 rounded-lg text-sm font-semibold btn-cyber-primary">
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
