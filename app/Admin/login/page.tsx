"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  TrainFront,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ==========================================
  // LOGIN
  // ==========================================

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    // Temporary admin credentials
    const adminEmail = "admin@example.com";
    const adminPassword = "admin123";

    if (
      email.trim().toLowerCase() === adminEmail &&
      password === adminPassword
    ) {
      localStorage.setItem("isAdmin", "true");

      localStorage.setItem(
        "adminUser",
        JSON.stringify({
          name: "Admin User",
          email: adminEmail,
          role: "Super Admin",
        })
      );

      router.push("/Admin");
      return;
    }

    setError("Invalid email or password.");
    setLoading(false);
  };

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-slate-50 lg:flex">

      {/* =====================================================
          DESKTOP LEFT PANEL
          Hidden on mobile
      ====================================================== */}

      <section className="relative hidden min-h-screen overflow-hidden lg:flex lg:w-1/2">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900" />

        {/* Glow */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* Content */}
        <div className="relative z-10 flex min-h-screen w-full flex-col justify-between p-12 xl:p-16">

          {/* Logo */}
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

          {/* Main Content */}
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
              Monitor stations, facilities, AI agents,
              documents, complaints and railway data from
              one centralized admin panel.
            </p>
          </div>

          {/* Footer */}
          <p className="text-xs text-slate-500">
            © 2026 Railway-AI. Admin access only.
          </p>
        </div>
      </section>

      {/* =====================================================
          LOGIN SECTION
      ====================================================== */}

      <section
        className="
          flex min-h-screen w-full
          items-center justify-center
          bg-slate-50
          px-4 py-6
          sm:px-6 sm:py-8
          lg:w-1/2
          lg:px-8
        "
      >
        <div className="w-full max-w-md">

          {/* =================================================
              MOBILE LOGO
          ================================================== */}

          <div className="mb-5 flex flex-col items-center lg:hidden">

            {/* Logo */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-md shadow-blue-600/20">
              <TrainFront className="h-6 w-6 text-white" />
            </div>

            {/* Name */}
            <h1 className="mt-2 text-lg font-bold text-slate-900">
              Railway-AI
            </h1>

            <p className="text-xs text-slate-500">
              Admin Panel
            </p>
          </div>

          {/* =================================================
              LOGIN CARD
          ================================================== */}

          <div
            className="
              w-full
              rounded-2xl
              border border-slate-200
              bg-white
              p-5
              shadow-lg shadow-slate-200/60
              sm:p-8
            "
          >

            {/* Heading */}
            <div className="mb-6 text-left sm:mb-8">

              <h2 className="text-2xl font-bold text-slate-900">
                Admin Login
              </h2>

              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                Sign in to access the Railway-AI admin panel.
              </p>

            </div>

            {/* =================================================
                FORM
            ================================================== */}

            <form
              onSubmit={handleLogin}
              className="space-y-4 sm:space-y-5"
            >

              {/* ================= EMAIL ================= */}

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                  Email Address
                </label>

                <div className="relative">

                  <Mail
                    className="
                      pointer-events-none
                      absolute left-3
                      top-1/2
                      h-5 w-5
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border border-slate-200
                      bg-slate-50
                      pl-11
                      pr-4
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                  />

                </div>
              </div>

              {/* ================= PASSWORD ================= */}

              <div>

                <div className="mb-1.5 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="
                      text-xs
                      font-medium
                      text-blue-600
                      transition
                      hover:text-blue-700
                    "
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="relative">

                  <Lock
                    className="
                      pointer-events-none
                      absolute left-3
                      top-1/2
                      h-5 w-5
                      -translate-y-1/2
                      text-slate-400
                    "
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="
                      h-11
                      w-full
                      rounded-lg
                      border border-slate-200
                      bg-slate-50
                      pl-11
                      pr-11
                      text-sm
                      text-slate-900
                      outline-none
                      transition
                      placeholder:text-slate-400
                      focus:border-blue-500
                      focus:bg-white
                      focus:ring-2
                      focus:ring-blue-500/10
                    "
                  />

                  {/* Eye Button */}
                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-md
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-600
                    "
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>
              </div>

              {/* ================= ERROR ================= */}

              {error && (
                <div
                  className="
                    rounded-lg
                    border border-red-200
                    bg-red-50
                    px-3
                    py-2.5
                    text-sm
                    text-red-600
                  "
                >
                  {error}
                </div>
              )}

              {/* ================= REMEMBER ================= */}

              <div className="flex items-center gap-2 pt-1">

                <input
                  id="remember"
                  type="checkbox"
                  className="
                    h-4
                    w-4
                    shrink-0
                    rounded
                    border-slate-300
                    text-blue-600
                    focus:ring-blue-500
                  "
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-slate-600"
                >
                  Remember me
                </label>

              </div>

              {/* ================= LOGIN BUTTON ================= */}

              <button
                type="submit"
                disabled={loading}
                className="
                  flex
                  h-11
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-blue-600
                  text-sm
                  font-semibold
                  text-white
                  shadow-md
                  shadow-blue-600/20
                  transition-all
                  hover:bg-blue-700
                  hover:shadow-lg
                  hover:shadow-blue-600/25
                  active:scale-[0.99]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>

            {/* =================================================
                SIGN UP
            ================================================== */}

            <div className="mt-5 border-t border-slate-100 pt-5 text-center sm:mt-6 sm:pt-6">

              <p className="text-sm leading-5 text-slate-500">
                Don&apos;t have an admin account?
              </p>

              <Link
                href="/Admin/signup"
                className="
                  mt-1
                  inline-block
                  text-sm
                  font-semibold
                  text-blue-600
                  transition
                  hover:text-blue-700
                "
              >
                Create account
              </Link>

            </div>

          </div>

          {/* =================================================
              SECURITY TEXT
          ================================================== */}

          <p className="mt-4 text-center text-[11px] leading-4 text-slate-400 sm:mt-5">
            🔒 This area is restricted to authorized administrators.
          </p>

        </div>
      </section>
    </main>
  );
}