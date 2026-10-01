"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  TrainFront,
  User,
  UserPlus,
  CircleCheck,
} from "lucide-react";

export default function AdminSignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Password strength
  const passwordStrength =
    password.length === 0
      ? 0
      : password.length < 6
        ? 1
        : password.length < 10
          ? 2
          : 3;

  const passwordMatch =
    confirmPassword.length > 0 && password === confirmPassword;

  // Signup
  const handleSignup = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const adminUser = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "Super Admin",
      password,
    };

    // Temporary frontend storage
    localStorage.setItem(
      "adminAccount",
      JSON.stringify(adminUser)
    );

    setSuccess("Account created successfully!");

    setTimeout(() => {
      router.push("/Admin/login");
    }, 1200);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-50 lg:flex lg:h-screen">
      {/* =====================================================
          LEFT PANEL - DESKTOP
      ====================================================== */}
      <section className="relative hidden overflow-hidden bg-[#071a33] lg:flex lg:h-screen lg:w-[43%]">
        {/* Background effects */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative z-10 flex h-full w-full flex-col justify-between p-9 xl:p-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-900/40">
              <TrainFront className="h-5 w-5 text-white" />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">
                Railway-AI
              </h1>

              <p className="text-[11px] text-blue-200">
                Intelligent Railway Management
              </p>
            </div>
          </div>

          {/* Main content */}
          <div className="max-w-md">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-200">
              <UserPlus className="h-3.5 w-3.5" />
              ADMIN REGISTRATION
            </div>

            <h2 className="text-4xl font-bold leading-tight text-white xl:text-[46px]">
              Build your
              <span className="block text-blue-400">
                control access.
              </span>
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">
              Create your administrator account and get access to
              Railway-AI&apos;s intelligent management control center.
            </p>

            {/* Steps */}
            <div className="mt-8 space-y-5">
              <Step
                number="01"
                title="Identity"
                description="Set up your administrator profile"
                active
              />

              <Step
                number="02"
                title="Credentials"
                description="Create secure login credentials"
              />

              <Step
                number="03"
                title="Access"
                description="Enter the Railway-AI control center"
              />
            </div>
          </div>

          {/* Bottom */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            Secure administrator registration
          </div>
        </div>
      </section>

      {/* =====================================================
          RIGHT SIDE
      ====================================================== */}
      <section className="flex min-h-screen flex-1 items-center justify-center overflow-hidden px-4 py-4 sm:px-6 lg:h-screen lg:py-5">
        <div className="w-full max-w-xl">
          {/* Mobile brand */}
          <div className="mb-5 flex items-center justify-center lg:hidden">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#071a33]">
                <TrainFront className="h-5 w-5 text-white" />
              </div>

              <div>
                <h1 className="font-bold text-slate-900">
                  Railway-AI
                </h1>

                <p className="text-[10px] text-slate-500">
                  Admin Control Center
                </p>
              </div>
            </div>
          </div>

          {/* =================================================
              FORM CARD
          ================================================== */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
            {/* Top accent */}
            <div className="h-1.5 bg-gradient-to-r from-blue-700 via-blue-500 to-cyan-400" />

            <div className="p-5 sm:p-7 lg:p-8">
              {/* Heading */}
              <div className="mb-5">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <UserPlus className="h-5 w-5 text-blue-600" />
                </div>

                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Create Admin Account
                </h2>

                <p className="mt-1.5 text-sm leading-5 text-slate-500">
                  Register a new administrator for the Railway-AI
                  control system.
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* Success */}
              {success && (
                <div className="mb-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-2.5 text-sm text-green-700">
                  <CircleCheck className="h-4 w-4 shrink-0" />
                  {success}
                </div>
              )}

              {/* Form */}
              <form
                onSubmit={handleSignup}
                className="space-y-4"
              >
                {/* ==========================================
                    NAME + EMAIL
                =========================================== */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Name */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Full Name
                    </label>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="text"
                        value={name}
                        onChange={(e) =>
                          setName(e.target.value)
                        }
                        placeholder="Enter your name"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-slate-700">
                      Email Address
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                      <input
                        type="email"
                        value={email}
                        onChange={(e) =>
                          setEmail(e.target.value)
                        }
                        placeholder="admin@example.com"
                        className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                      />
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    PASSWORD
                =========================================== */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-sm font-medium text-slate-700">
                      Password
                    </label>

                    {password && (
                      <span className="text-xs font-medium text-slate-500">
                        {passwordStrength === 1
                          ? "Weak"
                          : passwordStrength === 2
                            ? "Medium"
                            : "Strong"}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={
                        showPassword ? "text" : "password"
                      }
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Create a password"
                      className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Strength */}
                  {password && (
                    <div className="mt-1.5 flex gap-1">
                      {[1, 2, 3].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full ${
                            level <= passwordStrength
                              ? "bg-blue-500"
                              : "bg-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ==========================================
                    CONFIRM PASSWORD
                =========================================== */}
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Confirm Password
                  </label>

                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      value={confirmPassword}
                      onChange={(e) =>
                        setConfirmPassword(e.target.value)
                      }
                      placeholder="Confirm your password"
                      className={`h-10 w-full rounded-lg border bg-slate-50 pl-10 pr-11 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:bg-white focus:ring-2 ${
                        confirmPassword
                          ? passwordMatch
                            ? "border-green-400 focus:border-green-500 focus:ring-green-100"
                            : "border-red-300 focus:border-red-500 focus:ring-red-100"
                          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          !showConfirmPassword
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Match message */}
                  {passwordMatch && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-green-600">
                      <Check className="h-3.5 w-3.5" />
                      Passwords match
                    </div>
                  )}
                </div>

                {/* ==========================================
                    ADMIN ACCESS INFO
                =========================================== */}
                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                  <div className="flex gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Administrator Access
                      </p>

                      <p className="mt-0.5 text-xs leading-5 text-slate-500">
                        Your account will be registered with Super
                        Admin access for the Railway-AI dashboard.
                      </p>
                    </div>
                  </div>
                </div>

                {/* ==========================================
                    SUBMIT
                =========================================== */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#071a33] text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Admin Account

                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* ==========================================
                  LOGIN LINK
              =========================================== */}
              <div className="mt-5 border-t border-slate-100 pt-4 text-center">
                <p className="text-sm text-slate-500">
                  Already have an admin account?{" "}
                  <button
                    type="button"
                    onClick={() =>
                      router.push("/Admin/login")
                    }
                    className="font-semibold text-blue-600 transition hover:text-blue-700"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-3 text-center text-[11px] text-slate-400">
            Railway-AI Admin Portal • Secure Control System
          </p>
        </div>
      </section>
    </main>
  );
}

/* ============================================================
   STEP COMPONENT
============================================================ */

function Step({
  number,
  title,
  description,
  active = false,
}: {
  number: string;
  title: string;
  description: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-start gap-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
          active
            ? "border-blue-400 bg-blue-500 text-white"
            : "border-slate-600 bg-slate-800 text-slate-300"
        }`}
      >
        {active ? (
          <Check className="h-4 w-4" />
        ) : (
          number
        )}
      </div>

      <div>
        <p className="text-sm font-semibold text-white">
          {title}
        </p>

        <p className="mt-1 text-xs text-slate-400">
          {description}
        </p>
      </div>
    </div>
  );
}