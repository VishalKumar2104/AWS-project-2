"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { signIn, signInWithGoogle } from "@/lib/firebaseAuth";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import type { User } from "@/types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setFirebaseState } = useAuthStore();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const handlePostAuthRedirect = async () => {
    try {
      const res = await api.get<User>("/v1/users/me");
      setUser(res.data);
      const role = res.data.role;
      if (role === "ROLE_JOB_SEEKER") router.push("/dashboard");
      else if (role === "ROLE_RECRUITER") router.push("/recruiter");
      else if (role === "ROLE_ADMIN") router.push("/admin");
      else router.push("/");
    } catch {
      router.push("/dashboard");
    }
  };

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const userCredential = await signIn(data.email, data.password);
      setFirebaseState(userCredential.user.uid, userCredential.user.email);
      await handlePostAuthRedirect();
    } catch (err: any) {
      let msg = "Invalid email or password. Please try again.";
      if (err?.code === "auth/configuration-not-found") {
        msg = "Firebase Authentication is not yet enabled in your Firebase Console.";
      } else if (err?.code === "auth/invalid-credential" || err?.code === "auth/user-not-found" || err?.code === "auth/wrong-password") {
        msg = "Invalid email or password.";
      } else if (err?.code === "auth/too-many-requests") {
        msg = "Too many failed attempts. Please try again later.";
      } else if (err?.code === "ERR_NETWORK" || err?.message?.includes("500") || err?.message?.includes("Network Error")) {
        msg = "Signed in with Firebase, but the Spring Boot backend server is not running.";
      } else if (err?.message) {
        msg = err.message;
      }
      setServerError(msg);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setServerError("");
    try {
      const result = await signInWithGoogle();
      setFirebaseState(result.user.uid, result.user.email);
      await handlePostAuthRedirect();
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setServerError(err?.message ?? "Google Sign-In failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-pink-400 bg-clip-text text-transparent">
              HireHub
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Welcome back</h1>
          <p className="text-slate-400 mt-2">Sign in to continue to your account</p>
        </div>

        {/* Card */}
        <div className="cyber-card rounded-2xl p-8 border border-cyan-500/30">
          {serverError && (
            <div className="px-4 py-3 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-300 text-sm mb-5">
              {serverError}
            </div>
          )}

          {/* Google Sign-in button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading || isSubmitting}
            className="w-full mb-5 py-3 px-4 cyber-card rounded-xl text-sm font-medium text-white hover:border-cyan-400 transition-colors flex items-center justify-center gap-3 border border-cyan-500/30"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-1.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z"
                />
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-cyan-500/15"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500">or sign in with email</span>
            <div className="flex-grow border-t border-cyan-500/15"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input
                {...register("email")}
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                id="login-email"
                className="input-base"
              />
              {errors.email && <p className="text-pink-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPass ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  id="login-password"
                  className="input-base pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-pink-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              id="login-submit-btn"
              className="w-full btn-cyber-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Signing in...</> : <>Sign in <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-cyan-500/20 text-center">
            <p className="text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Create one free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
