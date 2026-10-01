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
// Mock Dashboard Data
// =========================

const stats = [
  {
    label: "Total Stations",
    value: "13",
    icon: Building2,
    color: "text-blue-600",
    bg: "bg-blue-100",
  },
  {
    label: "Total Platforms",
    value: "78",
    icon: Layers,
    color: "text-indigo-600",
    bg: "bg-indigo-100",
  },
  {
    label: "Total Facilities",
    value: "342",
    icon: MapPin,
    color: "text-emerald-600",
    bg: "bg-emerald-100",
  },
  {
    label: "RAG Documents",
    value: "45",
    icon: FileText,
    color: "text-purple-600",
    bg: "bg-purple-100",
  },
  {
    label: "Pending Verification",
    value: "12",
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-100",
  },
  {
    label: "Open Complaints",
    value: "8",
    icon: AlertTriangle,
    color: "text-rose-600",
    bg: "bg-rose-100",
  },
];

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

const recentActivity = [
  {
    id: 1,
    action: "Station BPL updated",
    user: "Admin Sachin",
    time: "10 mins ago",
    type: "update",
  },
  {
    id: 2,
    action: "New facility 'Waiting Room' added at RKMP",
    user: "System Auto",
    time: "1 hour ago",
    type: "add",
  },
  {
    id: 3,
    action: "Uploaded Railway Rules.pdf",
    user: "Admin Priya",
    time: "2 hours ago",
    type: "upload",
  },
  {
    id: 4,
    action: "New complaint received at JBP",
    user: "Passenger Portal",
    time: "3 hours ago",
    type: "alert",
  },
];

// =========================
// Admin Dashboard
// =========================

export default function AdminDashboard() {
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
                  {stat.value}
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
              {recentActivity.map((activity) => (
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
                    {activity.time}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Activity Cards */}
        <div className="divide-y divide-slate-100 md:hidden">
          {recentActivity.map((activity) => (
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
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}