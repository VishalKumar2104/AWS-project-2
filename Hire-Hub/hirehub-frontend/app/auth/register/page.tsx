"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Briefcase, Eye, EyeOff, Loader2, User as UserIcon, Building2 } from "lucide-react";
import { signUp, signInWithGoogle } from "@/lib/firebaseAuth";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Role, User } from "@/types";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  companyName: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setFirebaseState } = useAuthStore();
  const [role, setRole] = useState<Role>("ROLE_JOB_SEEKER");
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState("");
  const [googleLoading, setGoogleLoading] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const setupUserProfile = async (profileData: {
    firstName?: string;
    lastName?: string;
    companyName?: string;
  }) => {
    await api.post("/v1/users/me/setup", {
      role,
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      companyName: profileData.companyName,
    });

    const userRes = await api.get<User>("/v1/users/me");
    setUser(userRes.data);

    if (role === "ROLE_JOB_SEEKER") router.push("/dashboard");
    else if (role === "ROLE_RECRUITER") router.push("/recruiter");
    else router.push("/");
  };

  const onSubmit = async (data: FormData) => {
    setServerError("");
    try {
      const userCredential = await signUp(data.email, data.password);
      setFirebaseState(userCredential.user.uid, userCredential.user.email);
      await setupUserProfile(data);
    } catch (err: any) {
      let msg = "Registration failed. Please try again.";
      if (err?.code === "auth/email-already-in-use") {
        msg = "This email is already registered. Please sign in instead.";
      } else if (err?.code === "auth/weak-password") {
        msg = "Password should be at least 8 characters.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      setServerError(msg);
    }
  };

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true);
    setServerError("");
    try {
      const result = await signInWithGoogle();
      setFirebaseState(result.user.uid, result.user.email);
      const nameParts = (result.user.displayName || "").split(" ");
      await setupUserProfile({
        firstName: nameParts[0] || undefined,
        lastName: nameParts.slice(1).join(" ") || undefined,
      });
    } catch (err: any) {
      if (err?.code !== "auth/popup-closed-by-user") {
        setServerError(err?.message ?? "Google Sign-Up failed.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.5)]">
              <Briefcase className="w-5 h-5 text-black" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white via-cyan-200 to-pink-400 bg-clip-text text-transparent">
              HireHub
            </span>
          </Link>
          <h1 className="text-3xl font-extrabold text-white">Create your account</h1>
          <p className="text-slate-400 mt-2">Join thousands of professionals today</p>
        </div>

        <div className="cyber-card rounded-2xl p-8 border border-cyan-500/30">
          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["ROLE_JOB_SEEKER", "ROLE_RECRUITER"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  "flex flex-col items-center gap-2 p-4 rounded-xl border transition-all",
                  role === r
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(0,240,255,0.3)]"
                    : "cyber-card border-cyan-500/20 text-slate-400 hover:border-cyan-500/40 hover:text-white"
                )}
              >
                {r === "ROLE_JOB_SEEKER" ? <UserIcon className="w-5 h-5 text-cyan-400" /> : <Building2 className="w-5 h-5 text-pink-400" />}
                <span className="text-xs font-semibold">{r === "ROLE_JOB_SEEKER" ? "Job Seeker" : "Recruiter"}</span>
              </button>
            ))}
          </div>

          {serverError && (
            <div className="px-4 py-3 rounded-xl bg-pink-950/60 border border-pink-500/40 text-pink-300 text-sm mb-5">
              {serverError}
            </div>
          )}

          {/* Google Sign-in button */}
          <button
            type="button"
            onClick={handleGoogleSignUp}
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
            Sign up with Google
          </button>

          <div className="relative flex py-2 items-center mb-5">
            <div className="flex-grow border-t border-cyan-500/15"></div>
            <span className="flex-shrink mx-4 text-xs text-slate-500">or sign up with email</span>
            <div className="flex-grow border-t border-cyan-500/15"></div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Email address</label>
              <input {...register("email")} type="email" autoComplete="email" placeholder="you@example.com"
                id="register-email" className="input-base" />
              {errors.email && <p className="text-pink-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input {...register("password")} type={showPass ? "text" : "password"} autoComplete="new-password"
                  placeholder="Min. 8 characters" id="register-password" className="input-base pr-11" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-300 transition-colors">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-pink-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {role === "ROLE_JOB_SEEKER" ? (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">First name</label>
                  <input {...register("firstName")} placeholder="John" id="register-firstname" className="input-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1.5">Last name</label>
                  <input {...register("lastName")} placeholder="Doe" id="register-lastname" className="input-base" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Company name</label>
                <input {...register("companyName")} placeholder="Acme Inc." id="register-company" className="input-base" />
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || googleLoading}
              id="register-submit-btn"
              className="w-full btn-cyber-primary py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating account...</> : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-cyan-500/20 text-center">
            <p className="text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
