"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrainFront,
  Mail,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

type LoginStep = "email" | "otp";

// Django backend base URL; override with NEXT_PUBLIC_API_URL in .env.local.
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export default function AdminLoginPage() {
  const router = useRouter();

  const [step, setStep] = useState<LoginStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // OTP resend countdown
  useEffect(() => {
    if (step !== "otp" || seconds <= 0) return;

    const timer = window.setTimeout(() => {
      setSeconds((previous) => previous - 1);
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [step, seconds]);

  // Step 1: Request an OTP from the Django backend.
  const handleSendOTP = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/admin/send-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to request an OTP.");
      }

      // The API intentionally uses a generic message to avoid revealing
      // whether an email belongs to an authorized administrator.
      setEmail(normalizedEmail);
      setOtp("");
      setStep("otp");
      setSeconds(60);
      setMessage(
        data.message ||
          "If this email belongs to an authorized admin, an OTP has been requested."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to the server. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify the OTP and receive JWT tokens.
  const handleVerifyOTP = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/admin/verify-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email.trim().toLowerCase(),
            otp,
          }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "OTP verification failed.");
      }

      if (!data.access || !data.refresh) {
        throw new Error("The server did not return authentication tokens.");
      }

      // Development implementation. For production, prefer HttpOnly,
      // Secure cookies set by the backend instead of JS-readable storage.
      sessionStorage.setItem("adminAccessToken", data.access);
      sessionStorage.setItem("adminRefreshToken", data.refresh);
      sessionStorage.setItem("adminUser", JSON.stringify(data.user ?? {}));

      setMessage("Login successful. Opening dashboard...");
      router.replace("/Admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "OTP verification failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Request a fresh OTP after the resend cooldown.
  const handleResendOTP = async () => {
    if (seconds > 0 || loading) return;

    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/admin/send-otp/`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim().toLowerCase() }),
        }
      );

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to resend OTP.");
      }

      setOtp("");
      setSeconds(60);
      setMessage(
        data.message ||
          "If this email belongs to an authorized admin, a new OTP has been requested."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to resend OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setStep("email");
    setOtp("");
    setError("");
    setMessage("");
    setSeconds(0);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 lg:flex">
      {/* Left panel */}
      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600">
              <TrainFront className="h-6 w-6 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold text-white">
                Railway-AI
              </h1>

              <p className="text-xs text-slate-400">
                Admin Panel
              </p>
            </div>
          </div>

          <div className="max-w-xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-blue-400">
              Railway Intelligence System
            </p>

            <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
              Manage your railway{" "}
              <span className="text-blue-500">
                intelligence platform.
              </span>
            </h2>

            <p className="mt-5 max-w-lg text-base leading-7 text-slate-400">
              Monitor stations, facilities, AI agents, documents,
              complaints and railway data from one centralized
              admin panel.
            </p>
          </div>

          <p className="text-xs text-slate-500">
            © 2026 Railway-AI. Admin access only.
          </p>
        </div>
      </section>

      
{/* LOGIN SECTION */}
<section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/70 px-4 py-10 sm:px-8 lg:w-1/2 lg:px-12">
  {/* Subtle background decoration */}
  <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-blue-100/50 blur-3xl" />
  <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-100/40 blur-3xl" />

  <div className="relative z-10 w-full max-w-[440px]">
    {/* Mobile logo */}
    <div className="mb-8 flex flex-col items-center lg:hidden">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/20">
        <TrainFront className="h-6 w-6" />
      </div>

      <h1 className="mt-3 text-lg font-bold text-slate-900">
        Railway-AI
      </h1>

      <p className="text-sm text-slate-500">Admin Portal</p>
    </div>

    {/* Login card */}
    <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_20px_70px_-25px_rgba(15,23,42,0.18)] backdrop-blur-xl sm:p-9">
      {/* Security badge */}
      <div className="mb-7 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
          <ShieldCheck className="h-6 w-6" />
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Secure Authentication
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Authorized administrators only
          </p>
        </div>
      </div>

      {/* Heading */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Admin Login
        </h2>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Sign in securely using a one-time verification code
          sent to your registered email address.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-5 text-red-700"
        >
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div
          role="status"
          className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-5 text-emerald-700"
        >
          {message}
        </div>
      )}

      {step === "email" ? (
        <form onSubmit={handleSendOTP} className="space-y-6">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Registered Email Address
            </label>

            <div className="group relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400 transition group-focus-within:text-blue-600" />

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                  setMessage("");
                }}
                placeholder="admin@yourcompany.com"
                autoComplete="email"
                maxLength={254}
                required
                className="h-14 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            <p className="mt-2 text-xs leading-5 text-slate-500">
              Use the email address registered for your admin account.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition duration-200 hover:-translate-y-0.5 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-600/25 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              "Sending OTP..."
            ) : (
              <>
                Send Verification Code
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-6">
          <div>
            <label
              htmlFor="admin-otp"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              6-Digit Verification Code
            </label>

            <input
              id="admin-otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              minLength={6}
              maxLength={6}
              value={otp}
              onChange={(event) => {
                setOtp(event.target.value.replace(/\D/g, "").slice(0, 6));
                setError("");
              }}
              placeholder="000000"
              required
              className="h-16 w-full rounded-xl border border-slate-200 bg-slate-50 text-center text-2xl font-bold tracking-[0.6em] text-slate-900 outline-none transition placeholder:text-slate-300 placeholder:tracking-[0.6em] focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
            />

            <p className="mt-3 break-all text-xs leading-5 text-slate-500">
              Enter the code sent to{" "}
              <span className="font-semibold text-slate-700">
                {email.trim().toLowerCase()}
              </span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:from-blue-700 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify & Continue"}
            {!loading && <ArrowRight className="h-4 w-4" />}
          </button>

          <div className="flex flex-col items-center gap-4">
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={loading || seconds > 0}
              className="text-sm font-semibold text-blue-600 transition hover:text-blue-800 disabled:cursor-not-allowed disabled:text-slate-400"
            >
              {seconds > 0
                ? `Resend code in ${seconds}s`
                : "Resend verification code"}
            </button>

            <button
              type="button"
              onClick={handleChangeEmail}
              disabled={loading}
              className="text-sm text-slate-500 transition hover:text-slate-800"
            >
              Use a different email address
            </button>
          </div>
        </form>
      )}

      {/* Bottom security notice */}
      <div className="mt-8 border-t border-slate-100 pt-5">
        <div className="flex items-start justify-center gap-2 text-center">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />

          <p className="text-xs leading-5 text-slate-500">
            Your admin access is protected by email verification.
            Never share your one-time code with anyone.
          </p>
        </div>
      </div>
    </div>

    <p className="mt-5 text-center text-xs text-slate-400">
      © 2026 Railway-AI · Secure Admin Portal
    </p>
  </div>
</section>


    </main>
  );
}