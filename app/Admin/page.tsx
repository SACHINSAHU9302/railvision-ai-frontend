"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Layers,
  MapPin,
  FileText,
  AlertTriangle,
  Bot,
  Clock,
  CheckCircle2,
  Activity,
  UserCircle,
} from "lucide-react";

// =========================
// Dashboard Data
// =========================

type DashboardStats = {
  total_stations: number;
  total_platforms: number;
  total_facilities: number;
  total_trains: number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

// JWT refresh is kept in this page module; no shared api.ts file is used.
let adminRefreshPromise: Promise<string> | null = null;

function clearAdminSessionAndRedirect() {
  sessionStorage.removeItem("adminAccessToken");
  sessionStorage.removeItem("adminRefreshToken");
  sessionStorage.removeItem("adminUser");
  sessionStorage.removeItem("accessToken");
  sessionStorage.removeItem("access");
  window.location.replace("/Admin/Login");
}

async function refreshAdminAccessToken(): Promise<string> {
  if (!adminRefreshPromise) {
    adminRefreshPromise = (async () => {
      const refresh = sessionStorage.getItem("adminRefreshToken");

      if (!refresh) {
        clearAdminSessionAndRedirect();
        throw new Error("Admin session expired. Please log in again.");
      }

      const response = await fetch(`${API_BASE_URL}/api/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh }),
        cache: "no-store",
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.access) {
        clearAdminSessionAndRedirect();
        throw new Error("Admin session expired. Please log in again.");
      }

      sessionStorage.setItem("adminAccessToken", data.access);
      // SimpleJWT returns a rotated refresh token when ROTATE_REFRESH_TOKENS=True.
      if (data.refresh) {
        sessionStorage.setItem("adminRefreshToken", data.refresh);
      }

      return data.access as string;
    })().finally(() => {
      adminRefreshPromise = null;
    });
  }

  return adminRefreshPromise;
}

async function adminFetch(path: string, options: RequestInit = {}) {
  let token = sessionStorage.getItem("adminAccessToken");

  if (!token) {
    token = await refreshAdminAccessToken();
  }

  const makeRequest = (accessToken: string) => {
    const headers = new Headers(options.headers);
    headers.set("Authorization", `Bearer ${accessToken}`);
    if (options.body && !headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }

    return fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      cache: "no-store",
    });
  };

  const tokenUsedForRequest = token;
  let response = await makeRequest(tokenUsedForRequest);

  // If another parallel request already refreshed the token, reuse it.
  if (response.status === 401) {
    const latestToken = sessionStorage.getItem("adminAccessToken");
    token =
      latestToken && latestToken !== tokenUsedForRequest
        ? latestToken
        : await refreshAdminAccessToken();
    response = await makeRequest(token);
  }

  return response;
}


const stats = [
  {
    key: "total_stations",
    label: "Total Stations",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    key: "total_platforms",
    label: "Total Platforms",
    icon: Layers,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    key: "total_facilities",
    label: "Total Facilities",
    icon: MapPin,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    key: null,
    label: "RAG Documents",
    icon: FileText,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    key: null,
    label: "Pending Verification",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-100",
  },
  {
    key: null,
    label: "Open Complaints",
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
] as const;

const aiAgents = [
  {
    name: "Navigation Agent",
    status: "Online",
    queries: "1.2k",
    version: "v2.1",
  },
  {
    name: "Facility Finder Agent",
    status: "Online",
    queries: "850",
    version: "v1.8",
  },
  {
    name: "Document/RAG Agent",
    status: "Online",
    queries: "420",
    version: "v3.0",
  },
];

type RecentActivity = {
  id: number;
  action: string;
  user: string;
  type: "add" | "update" | "delete" | "upload" | "alert" | string;
  description: string;
  time: string;
};

// =========================
// Admin Dashboard
// =========================

export default function AdminDashboard() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState("");

  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [activityError, setActivityError] = useState("");

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await adminFetch("/api/admin/dashboard/", {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Your session has expired. Please log in again.");
          }
          if (response.status === 403) {
            throw new Error("Admin access is required to view these statistics.");
          }
          throw new Error(data.detail || data.message || "Unable to load dashboard statistics.");
        }

        if (!data.success || !data.stats) {
          throw new Error(data.message || "Invalid dashboard response from server.");
        }

        setDashboardStats(data.stats as DashboardStats);
        setApiError("");
      } catch (error) {
        setApiError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading dashboard statistics."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  // Fetch recent activity from Django using the admin JWT access token.
  useEffect(() => {
    const fetchRecentActivities = async () => {
      try {
        const response = await adminFetch("/api/admin/activities/", {
          method: "GET",
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Your session has expired. Please log in again.");
          }
          if (response.status === 403) {
            throw new Error("Admin access is required to view recent activities.");
          }
          throw new Error(
            data.detail || data.message || "Unable to load recent activities."
          );
        }

        if (!data.success || !Array.isArray(data.results)) {
          throw new Error(data.message || "Invalid recent activities response from server.");
        }

        setRecentActivity(data.results as RecentActivity[]);
        setActivityError("");
      } catch (error) {
        setActivityError(
          error instanceof Error
            ? error.message
            : "Something went wrong while loading recent activities."
        );
      } finally {
        setActivityLoading(false);
      }
    };

    fetchRecentActivities();
  }, []);

  const formatActivityTime = (value: string) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-w-0">
      {/* =========================
          Page Header
      ========================== */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Admin Dashboard
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Overview of Railway-AI system infrastructure and agent activity.
        </p>
      </div>

      {apiError && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800"
        >
          {apiError}
        </div>
      )}

      {/* =========================
          Statistics Cards
      ========================== */}
      <section className="mb-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="group rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
              >
                <div
                  className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${stat.bg} ${stat.color} transition-transform duration-200 group-hover:scale-105`}
                >
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <p className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                  {stat.key ? (loading ? "..." : dashboardStats?.[stat.key] ?? "—") : "—"}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500 sm:text-sm">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================
          AI Agents + Verification
      ========================== */}
      <section className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* AI Agent Status */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
            <Bot className="h-5 w-5 text-blue-600" />

            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                AI Agent Status
              </h2>

              <p className="text-xs text-slate-500">
                Current status of Railway-AI agents
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-3 sm:p-6">
            {aiAgents.map((agent) => (
              <div
                key={agent.name}
                className="rounded-xl border border-slate-100 bg-slate-50 p-4 transition-colors hover:border-slate-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="max-w-[150px] text-sm font-semibold leading-tight text-slate-900">
                    {agent.name}
                  </h3>

                  <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
                    {agent.status}
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between border-t border-slate-200/70 pt-4">
                  <div>
                    <p className="text-xs text-slate-400">Queries</p>
                    <p className="mt-0.5 text-sm font-bold text-slate-700">
                      {agent.queries}
                    </p>
                  </div>

                  <span className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500">
                    {agent.version}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Verification */}
        <div className="rounded-2xl border border-slate-200/70 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6 sm:py-5">
            <CheckCircle2 className="h-5 w-5 text-indigo-600" />

            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Data Verification
              </h2>

              <p className="text-xs text-slate-500">
                Current verification status
              </p>
            </div>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            {/* Verified */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Verified Data
                </span>

                <span className="text-sm font-bold text-slate-900">
                  85%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: "85%" }}
                />
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Pending Review
                </span>

                <span className="text-sm font-bold text-slate-900">
                  10%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-amber-500"
                  style={{ width: "10%" }}
                />
              </div>
            </div>

            {/* Rejected */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-700">
                  Rejected / Failed
                </span>

                <span className="text-sm font-bold text-slate-900">
                  5%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-rose-500"
                  style={{ width: "5%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          Recent Activity
      ========================== */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="flex items-center gap-2.5">
            <Activity className="h-5 w-5 text-slate-600" />

            <div>
              <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
                Recent Activity
              </h2>

              <p className="text-xs text-slate-500">
                Latest activity across the system
              </p>
            </div>
          </div>

          <button className="self-start text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
            View Audit Log
          </button>
        </div>

        {/* Desktop Table */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/70 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-medium">
                  Action Detail
                </th>

                <th className="px-6 py-4 font-medium">
                  Performed By
                </th>

                <th className="px-6 py-4 text-right font-medium">
                  Timestamp
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {activityLoading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                    Loading recent activities...
                  </td>
                </tr>
              ) : activityError ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-red-600">
                    {activityError}
                  </td>
                </tr>
              ) : recentActivity.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500">
                    No recent activities found.
                  </td>
                </tr>
              ) : (
                recentActivity.map((activity) => (
                  <tr
                    key={activity.id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span
                          className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                            activity.type === "add"
                              ? "bg-emerald-500"
                              : activity.type === "update"
                                ? "bg-blue-500"
                                : activity.type === "alert"
                                  ? "bg-rose-500"
                                  : activity.type === "delete"
                                    ? "bg-red-600"
                                    : "bg-purple-500"
                          }`}
                        />

                        <span className="font-medium text-slate-900">
                          {activity.action}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-slate-600">
                      <div className="flex items-center gap-2">
                        <UserCircle className="h-4 w-4 text-slate-400" />
                        {activity.user}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right text-slate-400">
                      {formatActivityTime(activity.time)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Activity Cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {activityLoading ? (
            <p className="p-6 text-sm text-slate-500">
              Loading recent activities...
            </p>
          ) : activityError ? (
            <p className="p-6 text-sm text-red-600">
              {activityError}
            </p>
          ) : recentActivity.length === 0 ? (
            <p className="p-6 text-sm text-slate-500">
              No recent activities found.
            </p>
          ) : (
            recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="p-4 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${
                      activity.type === "add"
                        ? "bg-emerald-500"
                        : activity.type === "update"
                          ? "bg-blue-500"
                          : activity.type === "alert"
                            ? "bg-rose-500"
                            : activity.type === "delete"
                              ? "bg-red-600"
                              : "bg-purple-500"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {activity.action}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <span>{activity.user}</span>
                      <span>•</span>
                      <span>{formatActivityTime(activity.time)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}