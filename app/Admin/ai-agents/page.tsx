"use client";

import { useMemo, useState } from "react";
import {
  Bot,
  Search,
  SlidersHorizontal,
  Eye,
  Play,
  Square,
  RotateCcw,
  FileText,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock3,
  Zap,
  BrainCircuit,
  Server,
  X,
  RefreshCw,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type AgentStatus =
  | "Online"
  | "Offline"
  | "Warning"
  | "Error";

type AgentType =
  | "Railway Assistant"
  | "Station Information"
  | "Navigation"
  | "Complaint"
  | "RAG Knowledge"
  | "Ticket & Rules";

interface AIAgent {
  id: string;
  name: string;
  type: AgentType;
  status: AgentStatus;
  model: string;
  requests: number;
  responseTime: number;
  accuracy: number;
  lastActive: string;
  uptime: string;
  description: string;
  version: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const statuses: AgentStatus[] = [
  "Online",
  "Offline",
  "Warning",
  "Error",
];

const agentTypes: AgentType[] = [
  "Railway Assistant",
  "Station Information",
  "Navigation",
  "Complaint",
  "RAG Knowledge",
  "Ticket & Rules",
];

/* =========================================================
   DUMMY DATA
========================================================= */

const initialAgents: AIAgent[] = [
  {
    id: "AGT-001",
    name: "Railway Assistant",
    type: "Railway Assistant",
    status: "Online",
    model: "RailVision-Llama-3",
    requests: 18452,
    responseTime: 420,
    accuracy: 96.8,
    lastActive: "Just now",
    uptime: "99.8%",
    description:
      "Handles general passenger queries related to railway services, stations and travel information.",
    version: "v2.4.1",
  },
  {
    id: "AGT-002",
    name: "Station Information Agent",
    type: "Station Information",
    status: "Online",
    model: "RailVision-RAG",
    requests: 12380,
    responseTime: 310,
    accuracy: 98.2,
    lastActive: "Just now",
    uptime: "99.9%",
    description:
      "Provides station-specific information including platforms, facilities, timings and services.",
    version: "v2.3.0",
  },
  {
    id: "AGT-003",
    name: "Navigation Agent",
    type: "Navigation",
    status: "Online",
    model: "RailVision-Navigation",
    requests: 9876,
    responseTime: 275,
    accuracy: 97.4,
    lastActive: "1 min ago",
    uptime: "99.5%",
    description:
      "Provides indoor station navigation and accessible route guidance.",
    version: "v1.9.2",
  },
  {
    id: "AGT-004",
    name: "Complaint Agent",
    type: "Complaint",
    status: "Warning",
    model: "RailVision-Support",
    requests: 6342,
    responseTime: 680,
    accuracy: 91.6,
    lastActive: "2 min ago",
    uptime: "97.4%",
    description:
      "Classifies passenger complaints and assists with complaint routing and responses.",
    version: "v1.7.5",
  },
  {
    id: "AGT-005",
    name: "RAG Knowledge Agent",
    type: "RAG Knowledge",
    status: "Online",
    model: "RailVision-RAG",
    requests: 15670,
    responseTime: 390,
    accuracy: 98.7,
    lastActive: "Just now",
    uptime: "99.9%",
    description:
      "Retrieves verified railway knowledge from indexed documents and knowledge sources.",
    version: "v3.1.0",
  },
  {
    id: "AGT-006",
    name: "Ticket & Rules Agent",
    type: "Ticket & Rules",
    status: "Offline",
    model: "RailVision-Rules",
    requests: 4210,
    responseTime: 510,
    accuracy: 94.3,
    lastActive: "18 min ago",
    uptime: "96.2%",
    description:
      "Answers passenger questions about ticketing, refund rules, luggage and railway policies.",
    version: "v1.5.3",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function AIAgentsPage() {
  const [agents, setAgents] =
    useState<AIAgent[]>(initialAgents);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedAgent, setSelectedAgent] =
    useState<AIAgent | null>(null);

  const [modal, setModal] = useState<
    "view" | "logs" | null
  >(null);

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredAgents = useMemo(() => {
    const query = search.toLowerCase().trim();

    return agents.filter((agent) => {
      const matchesSearch =
        !query ||
        agent.id
          .toLowerCase()
          .includes(query) ||
        agent.name
          .toLowerCase()
          .includes(query) ||
        agent.type
          .toLowerCase()
          .includes(query) ||
        agent.model
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        agent.status === statusFilter;

      const matchesType =
        typeFilter === "All" ||
        agent.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType
      );
    });
  }, [
    agents,
    search,
    statusFilter,
    typeFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalAgents = agents.length;

  const onlineAgents = agents.filter(
    (agent) => agent.status === "Online"
  ).length;

  const offlineAgents = agents.filter(
    (agent) => agent.status === "Offline"
  ).length;

  const warningAgents = agents.filter(
    (agent) => agent.status === "Warning"
  ).length;

  const errorAgents = agents.filter(
    (agent) => agent.status === "Error"
  ).length;

  const totalRequests = agents.reduce(
    (sum, agent) => sum + agent.requests,
    0
  );

  /* =======================================================
     MODAL
  ======================================================= */

  const closeModal = () => {
    setModal(null);
    setSelectedAgent(null);
  };

  const openViewModal = (
    agent: AIAgent
  ) => {
    setSelectedAgent(agent);
    setModal("view");
  };

  const openLogsModal = (
    agent: AIAgent
  ) => {
    setSelectedAgent(agent);
    setModal("logs");
  };

  /* =======================================================
     AGENT CONTROL
  ======================================================= */

  const updateAgentStatus = (
    id: string,
    status: AgentStatus
  ) => {
    setAgents((previous) =>
      previous.map((agent) =>
        agent.id === id
          ? {
              ...agent,
              status,
              lastActive:
                status === "Online"
                  ? "Just now"
                  : agent.lastActive,
            }
          : agent
      )
    );

    if (selectedAgent?.id === id) {
      setSelectedAgent((previous) =>
        previous
          ? {
              ...previous,
              status,
              lastActive:
                status === "Online"
                  ? "Just now"
                  : previous.lastActive,
            }
          : null
      );
    }
  };

  const handleStart = (
    agent: AIAgent
  ) => {
    updateAgentStatus(
      agent.id,
      "Online"
    );
  };

  const handleStop = (
    agent: AIAgent
  ) => {
    updateAgentStatus(
      agent.id,
      "Offline"
    );
  };

  const handleRestart = (
    agent: AIAgent
  ) => {
    updateAgentStatus(
      agent.id,
      "Warning"
    );

    setTimeout(() => {
      updateAgentStatus(
        agent.id,
        "Online"
      );
    }, 1000);
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setTypeFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Bot size={16} />

            <span>Admin</span>

            <span>/</span>

            <span className="text-slate-700">
              AI Agents
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            AI Agent Monitoring
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Monitor AI agents, performance, requests
            and operational status.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <Activity
            size={18}
            className="text-blue-600"
          />

          <span className="text-sm font-semibold text-blue-700">
            Live Monitoring
          </span>

          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <SummaryCard
          title="Total Agents"
          value={totalAgents}
          icon={Bot}
          description="Configured agents"
        />

        <SummaryCard
          title="Online"
          value={onlineAgents}
          icon={CheckCircle2}
          description="Currently running"
        />

        <SummaryCard
          title="Offline"
          value={offlineAgents}
          icon={XCircle}
          description="Currently stopped"
        />

        <SummaryCard
          title="Warning"
          value={warningAgents}
          icon={AlertTriangle}
          description="Needs attention"
        />

        <SummaryCard
          title="Errors"
          value={errorAgents}
          icon={XCircle}
          description="Requires action"
        />

        <SummaryCard
          title="Requests"
          value={totalRequests}
          icon={Zap}
          description="Total processed"
        />
      </div>

      {/* ===================================================
          SEARCH / FILTER
      =================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search agent, type, model..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <button
            onClick={() =>
              setShowFilters(
                (previous) => !previous
              )
            }
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              showFilters
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={17} />
            Filters
          </button>

          {(search ||
            statusFilter !== "All" ||
            typeFilter !== "All") && (
            <button
              onClick={resetFilters}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                {
                  value: "All",
                  label: "All Status",
                },
                ...statuses.map(
                  (status) => ({
                    value: status,
                    label: status,
                  })
                ),
              ]}
            />

            <FilterSelect
              label="Agent Type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                {
                  value: "All",
                  label: "All Agent Types",
                },
                ...agentTypes.map(
                  (type) => ({
                    value: type,
                    label: type,
                  })
                ),
              ]}
            />
          </div>
        )}
      </div>

      {/* ===================================================
          RESULT COUNT
      =================================================== */}

      <p className="text-sm text-slate-500">
        Showing{" "}
        <span className="font-semibold text-slate-800">
          {filteredAgents.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-slate-800">
          {agents.length}
        </span>{" "}
        AI agents
      </p>

      {/* ===================================================
          DESKTOP TABLE
      =================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className={thClass}>
                  AI Agent
                </th>

                <th className={thClass}>
                  Status
                </th>

                <th className={thClass}>
                  Model
                </th>

                <th className={thClass}>
                  Requests
                </th>

                <th className={thClass}>
                  Response
                </th>

                <th className={thClass}>
                  Accuracy
                </th>

                <th className={thClass}>
                  Last Active
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredAgents.map(
                (agent) => (
                  <tr
                    key={agent.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* AGENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <AgentIcon
                          type={agent.type}
                        />

                        <div>
                          <p className="font-semibold text-slate-800">
                            {agent.name}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {agent.type}
                          </p>

                          <p className="mt-1 font-mono text-[11px] text-blue-600">
                            {agent.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <AgentStatusBadge
                        status={agent.status}
                      />
                    </td>

                    {/* MODEL */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <BrainCircuit
                          size={15}
                          className="text-slate-400"
                        />

                        {agent.model}
                      </div>
                    </td>

                    {/* REQUESTS */}
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-700">
                        {agent.requests.toLocaleString()}
                      </p>
                    </td>

                    {/* RESPONSE */}
                    <td className="px-5 py-4">
                      <span
                        className={
                          agent.responseTime >
                          600
                            ? "font-semibold text-orange-600"
                            : "text-slate-600"
                        }
                      >
                        {agent.responseTime} ms
                      </span>
                    </td>

                    {/* ACCURACY */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-blue-500"
                            style={{
                              width: `${agent.accuracy}%`,
                            }}
                          />
                        </div>

                        <span className="text-sm font-semibold text-slate-700">
                          {agent.accuracy}%
                        </span>
                      </div>
                    </td>

                    {/* LAST ACTIVE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <Clock3
                          size={14}
                          className="text-slate-400"
                        />

                        {agent.lastActive}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton
                          title="View Details"
                          onClick={() =>
                            openViewModal(
                              agent
                            )
                          }
                        >
                          <Eye size={17} />
                        </ActionButton>

                        <ActionButton
                          title="View Logs"
                          onClick={() =>
                            openLogsModal(
                              agent
                            )
                          }
                        >
                          <FileText
                            size={17}
                          />
                        </ActionButton>

                        {agent.status ===
                          "Offline" ||
                          agent.status ===
                            "Error" ? (
                          <ActionButton
                            title="Start Agent"
                            success
                            onClick={() =>
                              handleStart(
                                agent
                              )
                            }
                          >
                            <Play
                              size={17}
                            />
                          </ActionButton>
                        ) : (
                          <ActionButton
                            title="Stop Agent"
                            danger
                            onClick={() =>
                              handleStop(
                                agent
                              )
                            }
                          >
                            <Square
                              size={16}
                            />
                          </ActionButton>
                        )}

                        <ActionButton
                          title="Restart Agent"
                          onClick={() =>
                            handleRestart(
                              agent
                            )
                          }
                        >
                          <RotateCcw
                            size={17}
                          />
                        </ActionButton>
                      </div>
                    </td>
                  </tr>
                )
              )}

              {filteredAgents.length ===
                0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >
                    <EmptyState />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===================================================
          MOBILE CARDS
      =================================================== */}

      <div className="grid gap-4 lg:hidden">
        {filteredAgents.map(
          (agent) => (
            <div
              key={agent.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <AgentIcon
                  type={agent.type}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {agent.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        {agent.type}
                      </p>

                      <p className="mt-1 font-mono text-[11px] text-blue-600">
                        {agent.id}
                      </p>
                    </div>

                    <AgentStatusBadge
                      status={
                        agent.status
                      }
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <InfoBox
                      label="Model"
                      value={agent.model}
                    />

                    <InfoBox
                      label="Requests"
                      value={agent.requests.toLocaleString()}
                    />

                    <InfoBox
                      label="Response"
                      value={`${agent.responseTime} ms`}
                    />

                    <InfoBox
                      label="Accuracy"
                      value={`${agent.accuracy}%`}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400">
                  {agent.lastActive}
                </p>

                <div className="flex gap-1">
                  <ActionButton
                    title="View"
                    onClick={() =>
                      openViewModal(
                        agent
                      )
                    }
                  >
                    <Eye size={16} />
                  </ActionButton>

                  <ActionButton
                    title="Logs"
                    onClick={() =>
                      openLogsModal(
                        agent
                      )
                    }
                  >
                    <FileText
                      size={16}
                    />
                  </ActionButton>

                  {agent.status ===
                    "Offline" ||
                  agent.status ===
                    "Error" ? (
                    <ActionButton
                      title="Start"
                      success
                      onClick={() =>
                        handleStart(
                          agent
                        )
                      }
                    >
                      <Play size={16} />
                    </ActionButton>
                  ) : (
                    <ActionButton
                      title="Stop"
                      danger
                      onClick={() =>
                        handleStop(
                          agent
                        )
                      }
                    >
                      <Square
                        size={15}
                      />
                    </ActionButton>
                  )}

                  <ActionButton
                    title="Restart"
                    onClick={() =>
                      handleRestart(
                        agent
                      )
                    }
                  >
                    <RotateCcw
                      size={16}
                    />
                  </ActionButton>
                </div>
              </div>
            </div>
          )
        )}

        {filteredAgents.length ===
          0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <EmptyState />
          </div>
        )}
      </div>

      {/* ===================================================
          VIEW MODAL
      =================================================== */}

      {modal === "view" &&
        selectedAgent && (
          <Modal
            title="AI Agent Details"
            subtitle="Detailed monitoring information for this agent."
            onClose={closeModal}
            size="xl"
          >
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <AgentIcon
                    type={
                      selectedAgent.type
                    }
                    large
                  />

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {
                        selectedAgent.name
                      }
                    </h3>

                    <p className="mt-1 font-mono text-xs text-blue-600">
                      {selectedAgent.id}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        selectedAgent.type
                      }
                    </p>
                  </div>
                </div>

                <AgentStatusBadge
                  status={
                    selectedAgent.status
                  }
                />
              </div>

              {/* METRICS */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <MetricBox
                  label="Requests"
                  value={selectedAgent.requests.toLocaleString()}
                  icon={Zap}
                />

                <MetricBox
                  label="Response Time"
                  value={`${selectedAgent.responseTime} ms`}
                  icon={Clock3}
                />

                <MetricBox
                  label="Accuracy"
                  value={`${selectedAgent.accuracy}%`}
                  icon={CheckCircle2}
                />

                <MetricBox
                  label="Uptime"
                  value={selectedAgent.uptime}
                  icon={Activity}
                />
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailBox
                  label="Model"
                  value={
                    selectedAgent.model
                  }
                  icon={BrainCircuit}
                />

                <DetailBox
                  label="Version"
                  value={
                    selectedAgent.version
                  }
                  icon={Server}
                />

                <DetailBox
                  label="Last Active"
                  value={
                    selectedAgent.lastActive
                  }
                  icon={Clock3}
                />
              </div>

              {/* DESCRIPTION */}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {
                    selectedAgent.description
                  }
                </p>
              </div>

              {/* ACCURACY */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-700">
                    Agent Accuracy
                  </p>

                  <span className="text-sm font-bold text-blue-600">
                    {
                      selectedAgent.accuracy
                    }
                    %
                  </span>
                </div>

                <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${selectedAgent.accuracy}%`,
                    }}
                  />
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                {selectedAgent.status ===
                  "Offline" ||
                selectedAgent.status ===
                  "Error" ? (
                  <button
                    onClick={() =>
                      handleStart(
                        selectedAgent
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <Play size={17} />
                    Start Agent
                  </button>
                ) : (
                  <button
                    onClick={() =>
                      handleStop(
                        selectedAgent
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Square size={16} />
                    Stop Agent
                  </button>
                )}

                <button
                  onClick={() =>
                    handleRestart(
                      selectedAgent
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <RotateCcw size={17} />
                  Restart
                </button>

                <button
                  onClick={() =>
                    openLogsModal(
                      selectedAgent
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <FileText size={17} />
                  View Logs
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* ===================================================
          LOGS MODAL
      =================================================== */}

      {modal === "logs" &&
        selectedAgent && (
          <Modal
            title="Agent Logs"
            subtitle={`${selectedAgent.name} • ${selectedAgent.id}`}
            onClose={closeModal}
            size="lg"
          >
            <div className="space-y-3">
              <LogRow
                time="10:42:31"
                type="INFO"
                message="Agent health check completed successfully."
              />

              <LogRow
                time="10:41:58"
                type="INFO"
                message="Knowledge retrieval request processed."
              />

              <LogRow
                time="10:41:20"
                type="INFO"
                message="Response generated successfully."
              />

              <LogRow
                time="10:40:47"
                type="INFO"
                message="Embedding search completed in 128 ms."
              />

              <LogRow
                time="10:39:52"
                type="INFO"
                message="Agent heartbeat received."
              />

              {selectedAgent.status ===
                "Warning" && (
                <LogRow
                  time="10:38:10"
                  type="WARN"
                  message="Response latency exceeded the configured threshold."
                />
              )}

              {selectedAgent.status ===
                "Error" && (
                <LogRow
                  time="10:37:42"
                  type="ERROR"
                  message="Agent reported an operational error."
                />
              )}
            </div>

            <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
              <button
                onClick={closeModal}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </Modal>
        )}
    </div>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {value.toLocaleString()}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {description}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   AGENT ICON
========================================================= */

function AgentIcon({
  type,
  large = false,
}: {
  type: AgentType;
  large?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 ${
        large
          ? "h-14 w-14"
          : "h-10 w-10"
      }`}
    >
      {type === "Navigation" ? (
        <Activity
          size={large ? 25 : 19}
        />
      ) : type === "RAG Knowledge" ? (
        <BrainCircuit
          size={large ? 25 : 19}
        />
      ) : type === "Complaint" ? (
        <AlertTriangle
          size={large ? 25 : 19}
        />
      ) : type === "Station Information" ? (
        <Server
          size={large ? 25 : 19}
        />
      ) : type === "Ticket & Rules" ? (
        <FileText
          size={large ? 25 : 19}
        />
      ) : (
        <Bot size={large ? 25 : 19} />
      )}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function AgentStatusBadge({
  status,
}: {
  status: AgentStatus;
}) {
  const styles: Record<
    AgentStatus,
    string
  > = {
    Online:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    Offline:
      "border-slate-200 bg-slate-100 text-slate-600",
    Warning:
      "border-amber-100 bg-amber-50 text-amber-700",
    Error:
      "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "Online"
            ? "bg-emerald-500"
            : status === "Warning"
            ? "bg-amber-500"
            : status === "Error"
            ? "bg-red-500"
            : "bg-slate-400"
        }`}
      />

      {status}
    </span>
  );
}

/* =========================================================
   FILTER
========================================================= */

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>

      <select
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={inputClass}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   INFO BOX
========================================================= */

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   METRIC BOX
========================================================= */

function MetricBox({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2">
        <Icon
          size={15}
          className="text-blue-500"
        />

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-2 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   DETAIL BOX
========================================================= */

function DetailBox({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-2">
        {Icon && (
          <Icon
            size={14}
            className="text-slate-400"
          />
        )}

        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {label}
        </p>
      </div>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
    </div>
  );
}

/* =========================================================
   LOG ROW
========================================================= */

function LogRow({
  time,
  type,
  message,
}: {
  time: string;
  type: "INFO" | "WARN" | "ERROR";
  message: string;
}) {
  const typeClass = {
    INFO: "bg-blue-50 text-blue-700",
    WARN: "bg-amber-50 text-amber-700",
    ERROR: "bg-red-50 text-red-700",
  };

  return (
    <div className="rounded-xl border border-slate-200 p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <span className="font-mono text-xs text-slate-400">
          {time}
        </span>

        <span
          className={`w-fit rounded-md px-2 py-0.5 text-[10px] font-bold ${typeClass[type]}`}
        >
          {type}
        </span>

        <p className="flex-1 text-sm text-slate-700">
          {message}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   ACTION BUTTON
========================================================= */

function ActionButton({
  title,
  children,
  onClick,
  danger = false,
  success = false,
}: {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  success?: boolean;
}) {
  let classes =
    "text-slate-400 hover:bg-blue-50 hover:text-blue-600";

  if (danger) {
    classes =
      "text-slate-400 hover:bg-red-50 hover:text-red-600";
  }

  if (success) {
    classes =
      "text-slate-400 hover:bg-emerald-50 hover:text-emerald-600";
  }

  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${classes}`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Bot size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No AI agents found
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

/* =========================================================
   MODAL
========================================================= */

function Modal({
  title,
  subtitle,
  children,
  onClose,
  size = "lg",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "lg" | "xl";
}) {
  const widthClasses = {
    lg: "max-w-2xl",
    xl: "max-w-5xl",
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative flex max-h-[92vh] w-full ${widthClasses[size]} flex-col overflow-hidden rounded-2xl bg-white shadow-2xl`}
      >
        <div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div className="pr-4">
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-xs text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   STYLES
========================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const thClass =
  "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";