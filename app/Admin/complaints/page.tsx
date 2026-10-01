"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Search,
  SlidersHorizontal,
  Eye,
  X,
  Check,
  XCircle,
  Clock3,
  CircleDot,
  User,
  Building2,
  CalendarDays,
  MapPin,
  MessageSquare,
  UserRoundCheck,
  Save,
  RefreshCw,
  CheckCircle,
  CheckCircle2,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type ComplaintStatus =
  | "Open"
  | "In Progress"
  | "Resolved"
  | "Rejected";

type ComplaintPriority =
  | "Low"
  | "Medium"
  | "High"
  | "Critical";

type ComplaintCategory =
  | "Station Facilities"
  | "Cleanliness"
  | "Staff Behaviour"
  | "Ticketing"
  | "Platform"
  | "Train Delay"
  | "Safety"
  | "Food"
  | "Accessibility"
  | "Other";

interface Complaint {
  id: string;
  userName: string;
  userEmail: string;
  station: string;
  category: ComplaintCategory;
  subject: string;
  description: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdDate: string;
  updatedDate: string;
  assignedTo: string;
  resolution: string;
  userContact: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const stations = [
  "Bhopal Junction",
  "Rani Kamlapati",
  "Indore Junction",
  "Ujjain Junction",
  "Jabalpur Junction",
  "Itarsi Junction",
  "Katni Junction",
  "Satna Junction",
];

const categories: ComplaintCategory[] = [
  "Station Facilities",
  "Cleanliness",
  "Staff Behaviour",
  "Ticketing",
  "Platform",
  "Train Delay",
  "Safety",
  "Food",
  "Accessibility",
  "Other",
];

const priorities: ComplaintPriority[] = [
  "Low",
  "Medium",
  "High",
  "Critical",
];

const statuses: ComplaintStatus[] = [
  "Open",
  "In Progress",
  "Resolved",
  "Rejected",
];

const admins = [
  "Admin",
  "Station Manager",
  "Operations Team",
  "Support Team",
  "Safety Team",
];

/* =========================================================
   DUMMY DATA
========================================================= */

const initialComplaints: Complaint[] = [
  {
    id: "CMP-1001",
    userName: "Rahul Sharma",
    userEmail: "rahul@example.com",
    station: "Bhopal Junction",
    category: "Cleanliness",
    subject: "Platform 2 requires cleaning",
    description:
      "The platform area has not been cleaned properly and there is garbage near the waiting area.",
    priority: "Medium",
    status: "Open",
    createdDate: "2026-09-29 09:25",
    updatedDate: "2026-09-29 09:25",
    assignedTo: "—",
    resolution: "",
    userContact: "+91 98XXXXXX21",
  },
  {
    id: "CMP-1002",
    userName: "Priya Verma",
    userEmail: "priya@example.com",
    station: "Rani Kamlapati",
    category: "Accessibility",
    subject: "Lift not working",
    description:
      "The lift near the main entrance is not working. Elderly passengers are facing difficulty reaching the platform.",
    priority: "High",
    status: "In Progress",
    createdDate: "2026-09-28 14:10",
    updatedDate: "2026-09-29 10:30",
    assignedTo: "Station Manager",
    resolution: "",
    userContact: "+91 97XXXXXX42",
  },
  {
    id: "CMP-1003",
    userName: "Amit Singh",
    userEmail: "amit@example.com",
    station: "Indore Junction",
    category: "Staff Behaviour",
    subject: "Issue with counter staff",
    description:
      "Passenger reported inappropriate behaviour by staff at the ticket counter.",
    priority: "High",
    status: "Resolved",
    createdDate: "2026-09-26 11:45",
    updatedDate: "2026-09-27 16:20",
    assignedTo: "Admin",
    resolution:
      "Complaint reviewed and forwarded to the concerned department. Staff counselling completed.",
    userContact: "+91 96XXXXXX15",
  },
  {
    id: "CMP-1004",
    userName: "Neha Patel",
    userEmail: "neha@example.com",
    station: "Ujjain Junction",
    category: "Station Facilities",
    subject: "Drinking water facility unavailable",
    description:
      "Drinking water facility near platform 1 was not operational during the visit.",
    priority: "Medium",
    status: "Open",
    createdDate: "2026-09-27 08:15",
    updatedDate: "2026-09-27 08:15",
    assignedTo: "—",
    resolution: "",
    userContact: "+91 95XXXXXX67",
  },
  {
    id: "CMP-1005",
    userName: "Vikas Yadav",
    userEmail: "vikas@example.com",
    station: "Jabalpur Junction",
    category: "Safety",
    subject: "Crowding near platform entry",
    description:
      "Heavy crowding was observed near the platform entry gate during peak hours.",
    priority: "Critical",
    status: "In Progress",
    createdDate: "2026-09-25 18:40",
    updatedDate: "2026-09-26 09:10",
    assignedTo: "Safety Team",
    resolution: "",
    userContact: "+91 94XXXXXX88",
  },
  {
    id: "CMP-1006",
    userName: "Suresh Kumar",
    userEmail: "suresh@example.com",
    station: "Itarsi Junction",
    category: "Food",
    subject: "Food quality complaint",
    description:
      "Passenger reported poor quality food purchased from a station food outlet.",
    priority: "High",
    status: "Resolved",
    createdDate: "2026-09-24 13:20",
    updatedDate: "2026-09-25 12:05",
    assignedTo: "Admin",
    resolution:
      "Vendor was contacted and the complaint was forwarded for inspection.",
    userContact: "+91 93XXXXXX12",
  },
  {
    id: "CMP-1007",
    userName: "Anjali Mishra",
    userEmail: "anjali@example.com",
    station: "Katni Junction",
    category: "Ticketing",
    subject: "Ticket counter queue issue",
    description:
      "Long queue observed at the ticket counter with insufficient counters operational.",
    priority: "Medium",
    status: "Open",
    createdDate: "2026-09-23 07:55",
    updatedDate: "2026-09-23 07:55",
    assignedTo: "—",
    resolution: "",
    userContact: "+91 92XXXXXX76",
  },
  {
    id: "CMP-1008",
    userName: "Rohit Jain",
    userEmail: "rohit@example.com",
    station: "Satna Junction",
    category: "Platform",
    subject: "Platform display not working",
    description:
      "The digital display board on platform 3 was not showing train information.",
    priority: "High",
    status: "Rejected",
    createdDate: "2026-09-20 15:30",
    updatedDate: "2026-09-21 11:15",
    assignedTo: "Operations Team",
    resolution:
      "Issue could not be reproduced during verification.",
    userContact: "+91 91XXXXXX33",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function ComplaintsPage() {
  const [complaints, setComplaints] =
    useState<Complaint[]>(initialComplaints);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [priorityFilter, setPriorityFilter] =
    useState("All");

  const [stationFilter, setStationFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedComplaint, setSelectedComplaint] =
    useState<Complaint | null>(null);

  const [modal, setModal] = useState<
    "view" | "update" | "resolve" | "reject" | null
  >(null);

  const [newStatus, setNewStatus] =
    useState<ComplaintStatus>("Open");

  const [assignedTo, setAssignedTo] =
    useState("Admin");

  const [remarks, setRemarks] =
    useState("");

  const [resolution, setResolution] =
    useState("");

  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filteredComplaints = useMemo(() => {
    const query = search.toLowerCase().trim();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !query ||
        complaint.id
          .toLowerCase()
          .includes(query) ||
        complaint.userName
          .toLowerCase()
          .includes(query) ||
        complaint.subject
          .toLowerCase()
          .includes(query) ||
        complaint.station
          .toLowerCase()
          .includes(query) ||
        complaint.category
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        complaint.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        complaint.category === categoryFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        complaint.priority === priorityFilter;

      const matchesStation =
        stationFilter === "All" ||
        complaint.station === stationFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesPriority &&
        matchesStation
      );
    });
  }, [
    complaints,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    stationFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalComplaints = complaints.length;

  const openComplaints = complaints.filter(
    (complaint) =>
      complaint.status === "Open"
  ).length;

  const inProgressComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "In Progress"
    ).length;

  const resolvedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Resolved"
    ).length;

  const rejectedComplaints =
    complaints.filter(
      (complaint) =>
        complaint.status === "Rejected"
    ).length;

  /* =======================================================
     MODAL HELPERS
  ======================================================= */

  const closeModal = () => {
    setModal(null);
    setSelectedComplaint(null);
    setRemarks("");
    setResolution("");
  };

  const openViewModal = (
    complaint: Complaint
  ) => {
    setSelectedComplaint(complaint);
    setModal("view");
  };

  const openUpdateModal = (
    complaint: Complaint
  ) => {
    setSelectedComplaint(complaint);
    setNewStatus(complaint.status);
    setAssignedTo(
      complaint.assignedTo === "—"
        ? "Admin"
        : complaint.assignedTo
    );
    setRemarks("");
    setModal("update");
  };

  const openResolveModal = (
    complaint: Complaint
  ) => {
    setSelectedComplaint(complaint);
    setResolution(complaint.resolution);
    setModal("resolve");
  };

  const openRejectModal = (
    complaint: Complaint
  ) => {
    setSelectedComplaint(complaint);
    setRemarks("");
    setModal("reject");
  };

  /* =======================================================
     UPDATE COMPLAINT
  ======================================================= */

  const handleUpdate = () => {
    if (!selectedComplaint) return;

    const updatedDate =
      new Date().toLocaleString("en-IN");

    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id ===
        selectedComplaint.id
          ? {
              ...complaint,
              status: newStatus,
              assignedTo,
              updatedDate,
              resolution:
                remarks.trim() ||
                complaint.resolution,
            }
          : complaint
      )
    );

    closeModal();
  };

  /* =======================================================
     RESOLVE
  ======================================================= */

  const handleResolve = () => {
    if (!selectedComplaint) return;

    if (!resolution.trim()) {
      alert(
        "Please enter resolution details."
      );
      return;
    }

    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id ===
        selectedComplaint.id
          ? {
              ...complaint,
              status: "Resolved",
              resolution:
                resolution.trim(),
              updatedDate:
                new Date().toLocaleString(
                  "en-IN"
                ),
              assignedTo:
                complaint.assignedTo === "—"
                  ? "Admin"
                  : complaint.assignedTo,
            }
          : complaint
      )
    );

    closeModal();
  };

  /* =======================================================
     REJECT
  ======================================================= */

  const handleReject = () => {
    if (!selectedComplaint) return;

    if (!remarks.trim()) {
      alert(
        "Please enter a reason for rejection."
      );
      return;
    }

    setComplaints((previous) =>
      previous.map((complaint) =>
        complaint.id ===
        selectedComplaint.id
          ? {
              ...complaint,
              status: "Rejected",
              resolution: remarks.trim(),
              updatedDate:
                new Date().toLocaleString(
                  "en-IN"
                ),
              assignedTo:
                complaint.assignedTo === "—"
                  ? "Admin"
                  : complaint.assignedTo,
            }
          : complaint
      )
    );

    closeModal();
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setStationFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <AlertTriangle size={16} />

            <span>Admin</span>

            <span>/</span>

            <span className="text-slate-700">
              Complaints
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Complaint Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review, assign and resolve passenger
            complaints across railway stations.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-amber-100 bg-amber-50 px-4 py-2.5">
          <AlertTriangle
            size={18}
            className="text-amber-600"
          />

          <span className="text-sm font-semibold text-amber-700">
            Support Center
          </span>
        </div>
      </div>

      {/* ===================================================
          SUMMARY CARDS
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Complaints"
          value={totalComplaints}
          icon={AlertTriangle}
          description="All complaints"
        />

        <SummaryCard
          title="Open"
          value={openComplaints}
          icon={CircleDot}
          description="Awaiting action"
        />

        <SummaryCard
          title="In Progress"
          value={inProgressComplaints}
          icon={RefreshCw}
          description="Currently assigned"
        />

        <SummaryCard
          title="Resolved"
          value={resolvedComplaints}
          icon={CheckCircle2}
          description="Successfully resolved"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedComplaints}
          icon={XCircle}
          description="Rejected complaints"
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
              placeholder="Search complaint ID, user, station, subject..."
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
            categoryFilter !== "All" ||
            priorityFilter !== "All" ||
            stationFilter !== "All") && (
            <button
              onClick={resetFilters}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-4">
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
              label="Category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[
                {
                  value: "All",
                  label: "All Categories",
                },
                ...categories.map(
                  (category) => ({
                    value: category,
                    label: category,
                  })
                ),
              ]}
            />

            <FilterSelect
              label="Priority"
              value={priorityFilter}
              onChange={setPriorityFilter}
              options={[
                {
                  value: "All",
                  label: "All Priorities",
                },
                ...priorities.map(
                  (priority) => ({
                    value: priority,
                    label: priority,
                  })
                ),
              ]}
            />

            <FilterSelect
              label="Station"
              value={stationFilter}
              onChange={setStationFilter}
              options={[
                {
                  value: "All",
                  label: "All Stations",
                },
                ...stations.map(
                  (station) => ({
                    value: station,
                    label: station,
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredComplaints.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {complaints.length}
          </span>{" "}
          complaints
        </p>
      </div>

      {/* ===================================================
          DESKTOP TABLE
      =================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className={thClass}>
                  Complaint
                </th>

                <th className={thClass}>
                  User
                </th>

                <th className={thClass}>
                  Station
                </th>

                <th className={thClass}>
                  Category
                </th>

                <th className={thClass}>
                  Priority
                </th>

                <th className={thClass}>
                  Status
                </th>

                <th className={thClass}>
                  Created
                </th>

                <th className={thClass}>
                  Assigned To
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredComplaints.map(
                (complaint) => (
                  <tr
                    key={complaint.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* COMPLAINT */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-semibold text-slate-800">
                          {complaint.subject}
                        </p>

                        <p className="mt-1 font-mono text-xs text-blue-600">
                          {complaint.id}
                        </p>
                      </div>
                    </td>

                    {/* USER */}
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-slate-700">
                          {complaint.userName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {complaint.userEmail}
                        </p>
                      </div>
                    </td>

                    {/* STATION */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin
                          size={14}
                          className="text-slate-400"
                        />

                        {complaint.station}
                      </div>
                    </td>

                    {/* CATEGORY */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {complaint.category}
                      </span>
                    </td>

                    {/* PRIORITY */}
                    <td className="px-5 py-4">
                      <PriorityBadge
                        priority={
                          complaint.priority
                        }
                      />
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <StatusBadge
                        status={
                          complaint.status
                        }
                      />
                    </td>

                    {/* CREATED */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <CalendarDays
                          size={14}
                          className="text-slate-400"
                        />

                        {complaint.createdDate}
                      </div>
                    </td>

                    {/* ASSIGNED */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <UserRoundCheck
                          size={14}
                          className="text-slate-400"
                        />

                        {complaint.assignedTo}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton
                          title="View"
                          onClick={() =>
                            openViewModal(
                              complaint
                            )
                          }
                        >
                          <Eye size={17} />
                        </ActionButton>

                        {complaint.status !==
                          "Resolved" &&
                          complaint.status !==
                            "Rejected" && (
                            <ActionButton
                              title="Update"
                              onClick={() =>
                                openUpdateModal(
                                  complaint
                                )
                              }
                            >
                              <RefreshCw
                                size={17}
                              />
                            </ActionButton>
                          )}

                        {complaint.status !==
                          "Resolved" &&
                          complaint.status !==
                            "Rejected" && (
                            <ActionButton
                              title="Resolve"
                              success
                              onClick={() =>
                                openResolveModal(
                                  complaint
                                )
                              }
                            >
                              <Check
                                size={17}
                              />
                            </ActionButton>
                          )}

                        {complaint.status !==
                          "Rejected" &&
                          complaint.status !==
                            "Resolved" && (
                            <ActionButton
                              title="Reject"
                              danger
                              onClick={() =>
                                openRejectModal(
                                  complaint
                                )
                              }
                            >
                              <XCircle
                                size={17}
                              />
                            </ActionButton>
                          )}
                      </div>
                    </td>
                  </tr>
                )
              )}

              {filteredComplaints.length ===
                0 && (
                <tr>
                  <td
                    colSpan={9}
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
        {filteredComplaints.map(
          (complaint) => (
            <div
              key={complaint.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-mono text-xs font-semibold text-blue-600">
                    {complaint.id}
                  </p>

                  <h3 className="mt-1 font-semibold text-slate-800">
                    {complaint.subject}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {complaint.userName}
                  </p>
                </div>

                <StatusBadge
                  status={complaint.status}
                />
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <InfoBox
                  label="Station"
                  value={complaint.station}
                />

                <InfoBox
                  label="Category"
                  value={complaint.category}
                />

                <InfoBox
                  label="Priority"
                  value={
                    complaint.priority
                  }
                />

                <InfoBox
                  label="Assigned To"
                  value={
                    complaint.assignedTo
                  }
                />
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <p className="text-xs text-slate-400">
                  {complaint.createdDate}
                </p>

                <div className="flex gap-1">
                  <ActionButton
                    title="View"
                    onClick={() =>
                      openViewModal(
                        complaint
                      )
                    }
                  >
                    <Eye size={16} />
                  </ActionButton>

                  {complaint.status !==
                    "Resolved" &&
                    complaint.status !==
                      "Rejected" && (
                      <>
                        <ActionButton
                          title="Update"
                          onClick={() =>
                            openUpdateModal(
                              complaint
                            )
                          }
                        >
                          <RefreshCw
                            size={16}
                          />
                        </ActionButton>

                        <ActionButton
                          title="Resolve"
                          success
                          onClick={() =>
                            openResolveModal(
                              complaint
                            )
                          }
                        >
                          <Check size={16} />
                        </ActionButton>
                      </>
                    )}
                </div>
              </div>
            </div>
          )
        )}

        {filteredComplaints.length ===
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
        selectedComplaint && (
          <Modal
            title="Complaint Details"
            subtitle="Complete passenger complaint information."
            onClose={closeModal}
            size="xl"
          >
            <div className="space-y-6">
              {/* HEADER */}
              <div className="flex flex-col gap-4 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold text-amber-700">
                    {selectedComplaint.id}
                  </p>

                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    {
                      selectedComplaint.subject
                    }
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {
                      selectedComplaint.category
                    }
                  </p>
                </div>

                <StatusBadge
                  status={
                    selectedComplaint.status
                  }
                />
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailBox
                  label="User"
                  value={
                    selectedComplaint.userName
                  }
                />

                <DetailBox
                  label="Email"
                  value={
                    selectedComplaint.userEmail
                  }
                />

                <DetailBox
                  label="Contact"
                  value={
                    selectedComplaint.userContact
                  }
                />

                <DetailBox
                  label="Station"
                  value={
                    selectedComplaint.station
                  }
                />

                <DetailBox
                  label="Category"
                  value={
                    selectedComplaint.category
                  }
                />

                <DetailBox
                  label="Priority"
                  value={
                    selectedComplaint.priority
                  }
                />

                <DetailBox
                  label="Created Date"
                  value={
                    selectedComplaint.createdDate
                  }
                />

                <DetailBox
                  label="Updated Date"
                  value={
                    selectedComplaint.updatedDate
                  }
                />

                <DetailBox
                  label="Assigned To"
                  value={
                    selectedComplaint.assignedTo
                  }
                />
              </div>

              {/* DESCRIPTION */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare
                    size={16}
                    className="text-slate-400"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Complaint Description
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  {
                    selectedComplaint.description
                  }
                </p>
              </div>

              {/* RESOLUTION */}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Resolution / Remarks
                </p>

                <p className="text-sm leading-6 text-slate-700">
                  {selectedComplaint.resolution ||
                    "No resolution has been added yet."}
                </p>
              </div>

              {/* ACTIONS */}
              {selectedComplaint.status !==
                "Resolved" &&
                selectedComplaint.status !==
                  "Rejected" && (
                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      onClick={() =>
                        openRejectModal(
                          selectedComplaint
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                    >
                      <XCircle size={17} />
                      Reject
                    </button>

                    <button
                      onClick={() =>
                        openResolveModal(
                          selectedComplaint
                        )
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                    >
                      <Check size={17} />
                      Resolve
                    </button>
                  </div>
                )}
            </div>
          </Modal>
        )}

      {/* ===================================================
          UPDATE MODAL
      =================================================== */}

      {modal === "update" &&
        selectedComplaint && (
          <Modal
            title="Update Complaint"
            subtitle="Assign the complaint and update its current status."
            onClose={closeModal}
            size="lg"
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="font-mono text-xs font-semibold text-blue-600">
                  {selectedComplaint.id}
                </p>

                <p className="mt-1 text-sm font-semibold text-slate-800">
                  {
                    selectedComplaint.subject
                  }
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>
                    Status
                  </label>

                  <select
                    value={newStatus}
                    onChange={(e) =>
                      setNewStatus(
                        e.target
                          .value as ComplaintStatus
                      )
                    }
                    className={inputClass}
                  >
                    {statuses.map(
                      (status) => (
                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>
                    Assign To
                  </label>

                  <select
                    value={assignedTo}
                    onChange={(e) =>
                      setAssignedTo(
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    {admins.map((admin) => (
                      <option
                        key={admin}
                        value={admin}
                      >
                        {admin}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Remarks
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Add internal remarks..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdate}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save size={17} />
                  Save Changes
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* ===================================================
          RESOLVE MODAL
      =================================================== */}

      {modal === "resolve" &&
        selectedComplaint && (
          <Modal
            title="Resolve Complaint"
            subtitle="Add the resolution details before closing this complaint."
            onClose={closeModal}
            size="lg"
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {
                        selectedComplaint.subject
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Complaint ID:{" "}
                      {selectedComplaint.id}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Resolution Details
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={resolution}
                  onChange={(e) =>
                    setResolution(
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder="Describe how this complaint was resolved..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleResolve}
                  disabled={!resolution.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Check size={17} />
                  Resolve Complaint
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* ===================================================
          REJECT MODAL
      =================================================== */}

      {modal === "reject" &&
        selectedComplaint && (
          <Modal
            title="Reject Complaint"
            subtitle="Provide a reason for rejecting this complaint."
            onClose={closeModal}
            size="sm"
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                <div className="flex items-start gap-3">
                  <XCircle
                    size={21}
                    className="mt-0.5 shrink-0 text-red-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {
                        selectedComplaint.subject
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedComplaint.id}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Rejection Reason
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(
                      e.target.value
                    )
                  }
                  rows={4}
                  placeholder="Enter reason for rejection..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleReject}
                  disabled={!remarks.trim()}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <XCircle size={17} />
                  Reject Complaint
                </button>
              </div>
            </div>
          </Modal>
        )}
    </div>
  );
}

/* =========================================================
   COMPONENTS
========================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

const labelClass =
  "mb-1.5 block text-sm font-semibold text-slate-700";

const thClass =
  "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";

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

          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value}
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
   STATUS BADGE
========================================================= */

function StatusBadge({
  status,
}: {
  status: ComplaintStatus;
}) {
  const styles: Record<
    ComplaintStatus,
    string
  > = {
    Open:
      "border-blue-100 bg-blue-50 text-blue-700",
    "In Progress":
      "border-amber-100 bg-amber-50 text-amber-700",
    Resolved:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    Rejected:
      "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Open" && (
        <CircleDot size={12} />
      )}

      {status === "In Progress" && (
        <Clock3 size={12} />
      )}

      {status === "Resolved" && (
        <CheckCircle2 size={12} />
      )}

      {status === "Rejected" && (
        <XCircle size={12} />
      )}

      {status}
    </span>
  );
}

/* =========================================================
   PRIORITY BADGE
========================================================= */

function PriorityBadge({
  priority,
}: {
  priority: ComplaintPriority;
}) {
  const styles: Record<
    ComplaintPriority,
    string
  > = {
    Low:
      "border-slate-200 bg-slate-100 text-slate-600",
    Medium:
      "border-blue-100 bg-blue-50 text-blue-700",
    High:
      "border-orange-100 bg-orange-50 text-orange-700",
    Critical:
      "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[priority]}`}
    >
      {priority}
    </span>
  );
}

/* =========================================================
   FILTER SELECT
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
   DETAIL BOX
========================================================= */

function DetailBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 break-words text-sm font-semibold text-slate-800">
        {value}
      </p>
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
        <AlertTriangle size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No complaints found
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
  size?: "sm" | "lg" | "xl";
}) {
  const widthClasses = {
    sm: "max-w-md",
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