"use client";

import { useMemo, useState } from "react";
import {
  Users,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  CheckCircle2,
  XCircle,
  Ban,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  CalendarDays,
  Clock3,
  MessageSquare,
  X,
  Save,
  UserRound,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type UserStatus =
  | "Active"
  | "Inactive"
  | "Blocked";

type UserRole =
  | "Passenger"
  | "Admin"
  | "Station Manager"
  | "Support Agent";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  status: UserStatus;
  registrationDate: string;
  lastLogin: string;
  totalComplaints: number;
  location: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const roles: UserRole[] = [
  "Passenger",
  "Admin",
  "Station Manager",
  "Support Agent",
];

const statuses: UserStatus[] = [
  "Active",
  "Inactive",
  "Blocked",
];

/* =========================================================
   DUMMY DATA
========================================================= */

const initialUsers: UserData[] = [
  {
    id: "USR-1001",
    name: "Rahul Sharma",
    email: "rahul@example.com",
    phone: "+91 98XXXXXX21",
    role: "Passenger",
    status: "Active",
    registrationDate: "2026-08-12",
    lastLogin: "2026-09-29 09:15",
    totalComplaints: 2,
    location: "Bhopal",
  },
  {
    id: "USR-1002",
    name: "Priya Verma",
    email: "priya@example.com",
    phone: "+91 97XXXXXX42",
    role: "Passenger",
    status: "Active",
    registrationDate: "2026-08-20",
    lastLogin: "2026-09-29 08:40",
    totalComplaints: 1,
    location: "Bhopal",
  },
  {
    id: "USR-1003",
    name: "Amit Singh",
    email: "amit@example.com",
    phone: "+91 96XXXXXX15",
    role: "Passenger",
    status: "Active",
    registrationDate: "2026-07-15",
    lastLogin: "2026-09-28 18:20",
    totalComplaints: 3,
    location: "Indore",
  },
  {
    id: "USR-1004",
    name: "Neha Patel",
    email: "neha@example.com",
    phone: "+91 95XXXXXX67",
    role: "Passenger",
    status: "Inactive",
    registrationDate: "2026-06-22",
    lastLogin: "2026-08-30 11:05",
    totalComplaints: 1,
    location: "Ujjain",
  },
  {
    id: "USR-1005",
    name: "Vikas Yadav",
    email: "vikas@example.com",
    phone: "+91 94XXXXXX88",
    role: "Passenger",
    status: "Active",
    registrationDate: "2026-09-02",
    lastLogin: "2026-09-29 07:50",
    totalComplaints: 4,
    location: "Jabalpur",
  },
  {
    id: "USR-1006",
    name: "Anjali Mishra",
    email: "anjali@example.com",
    phone: "+91 92XXXXXX76",
    role: "Passenger",
    status: "Blocked",
    registrationDate: "2026-05-18",
    lastLogin: "2026-09-01 13:10",
    totalComplaints: 5,
    location: "Katni",
  },
  {
    id: "ADM-001",
    name: "Super Admin",
    email: "admin@railvision.ai",
    phone: "+91 90XXXXXX01",
    role: "Admin",
    status: "Active",
    registrationDate: "2026-01-10",
    lastLogin: "2026-09-29 10:30",
    totalComplaints: 0,
    location: "Bhopal",
  },
  {
    id: "STM-001",
    name: "Station Manager",
    email: "manager@railvision.ai",
    phone: "+91 90XXXXXX02",
    role: "Station Manager",
    status: "Active",
    registrationDate: "2026-02-15",
    lastLogin: "2026-09-29 09:50",
    totalComplaints: 0,
    location: "Bhopal",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function UsersPage() {
  const [users, setUsers] =
    useState<UserData[]>(initialUsers);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [roleFilter, setRoleFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedUser, setSelectedUser] =
    useState<UserData | null>(null);

  const [modal, setModal] = useState<
    "view" | "edit" | "status" | null
  >(null);

  const [editData, setEditData] =
    useState<UserData | null>(null);

  const [newStatus, setNewStatus] =
    useState<UserStatus>("Active");

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.id
          .toLowerCase()
          .includes(query) ||
        user.name
          .toLowerCase()
          .includes(query) ||
        user.email
          .toLowerCase()
          .includes(query) ||
        user.phone
          .toLowerCase()
          .includes(query) ||
        user.location
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    statusFilter,
    roleFilter,
  ]);

  /* =======================================================
     STATS
  ======================================================= */

  const totalUsers = users.length;

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const blockedUsers = users.filter(
    (user) => user.status === "Blocked"
  ).length;

  const newUsers = users.filter((user) => {
    const registrationDate = new Date(
      user.registrationDate
    );

    const now = new Date();

    const difference =
      now.getTime() -
      registrationDate.getTime();

    return (
      difference <=
      30 * 24 * 60 * 60 * 1000
    );
  }).length;

  /* =======================================================
     MODALS
  ======================================================= */

  const closeModal = () => {
    setModal(null);
    setSelectedUser(null);
    setEditData(null);
  };

  const openViewModal = (
    user: UserData
  ) => {
    setSelectedUser(user);
    setModal("view");
  };

  const openEditModal = (
    user: UserData
  ) => {
    setSelectedUser(user);
    setEditData({ ...user });
    setModal("edit");
  };

  const openStatusModal = (
    user: UserData
  ) => {
    setSelectedUser(user);
    setNewStatus(
      user.status === "Active"
        ? "Inactive"
        : "Active"
    );
    setModal("status");
  };

  /* =======================================================
     UPDATE USER
  ======================================================= */

  const handleEditSave = () => {
    if (!editData) return;

    setUsers((previous) =>
      previous.map((user) =>
        user.id === editData.id
          ? editData
          : user
      )
    );

    closeModal();
  };

  /* =======================================================
     STATUS UPDATE
  ======================================================= */

  const handleStatusChange = () => {
    if (!selectedUser) return;

    setUsers((previous) =>
      previous.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              status: newStatus,
            }
          : user
      )
    );

    closeModal();
  };

  /* =======================================================
     BLOCK / UNBLOCK
  ======================================================= */

  const toggleBlock = (
    user: UserData
  ) => {
    const nextStatus: UserStatus =
      user.status === "Blocked"
        ? "Active"
        : "Blocked";

    setUsers((previous) =>
      previous.map((item) =>
        item.id === user.id
          ? {
              ...item,
              status: nextStatus,
            }
          : item
      )
    );
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setRoleFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} />

            <span>Admin</span>

            <span>/</span>

            <span className="text-slate-700">
              Users
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            User Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage passengers, administrators and
            support users.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <ShieldCheck
            size={18}
            className="text-blue-600"
          />

          <span className="text-sm font-semibold text-blue-700">
            User Administration
          </span>
        </div>
      </div>

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          description="Registered users"
        />

        <SummaryCard
          title="Active Users"
          value={activeUsers}
          icon={UserCheck}
          description="Currently active"
        />

        <SummaryCard
          title="Inactive"
          value={inactiveUsers}
          icon={UserX}
          description="Inactive accounts"
        />

        <SummaryCard
          title="Blocked"
          value={blockedUsers}
          icon={Ban}
          description="Blocked accounts"
        />

        <SummaryCard
          title="New Users"
          value={newUsers}
          icon={UserRound}
          description="Last 30 days"
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
              placeholder="Search user ID, name, email, phone..."
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
            roleFilter !== "All") && (
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
              label="Role"
              value={roleFilter}
              onChange={setRoleFilter}
              options={[
                {
                  value: "All",
                  label: "All Roles",
                },
                ...roles.map((role) => ({
                  value: role,
                  label: role,
                })),
              ]}
            />
          </div>
        )}
      </div>

      {/* ===================================================
          RESULT COUNT
      =================================================== */}

      <div>
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredUsers.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {users.length}
          </span>{" "}
          users
        </p>
      </div>

      {/* ===================================================
          DESKTOP TABLE
      =================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className={thClass}>
                  User
                </th>

                <th className={thClass}>
                  Role
                </th>

                <th className={thClass}>
                  Status
                </th>

                <th className={thClass}>
                  Registration
                </th>

                <th className={thClass}>
                  Last Login
                </th>

                <th className={thClass}>
                  Complaints
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="transition hover:bg-slate-50/80"
                >
                  {/* USER */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={user.name}
                      />

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {user.email}
                        </p>

                        <p className="mt-1 font-mono text-[11px] text-blue-600">
                          {user.id}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* ROLE */}
                  <td className="px-5 py-4">
                    <RoleBadge
                      role={user.role}
                    />
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">
                    <UserStatusBadge
                      status={user.status}
                    />
                  </td>

                  {/* REGISTRATION */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <CalendarDays
                        size={14}
                        className="text-slate-400"
                      />

                      {user.registrationDate}
                    </div>
                  </td>

                  {/* LOGIN */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Clock3
                        size={14}
                        className="text-slate-400"
                      />

                      {user.lastLogin}
                    </div>
                  </td>

                  {/* COMPLAINTS */}
                  <td className="px-5 py-4">
                    <span
                      className={`font-semibold ${
                        user.totalComplaints > 2
                          ? "text-orange-600"
                          : "text-slate-700"
                      }`}
                    >
                      {user.totalComplaints}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="View"
                        onClick={() =>
                          openViewModal(user)
                        }
                      >
                        <Eye size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Edit"
                        onClick={() =>
                          openEditModal(user)
                        }
                      >
                        <Pencil size={17} />
                      </ActionButton>

                      {user.role !==
                        "Admin" && (
                        <ActionButton
                          title={
                            user.status ===
                            "Blocked"
                              ? "Unblock"
                              : "Block"
                          }
                          danger={
                            user.status !==
                            "Blocked"
                          }
                          success={
                            user.status ===
                            "Blocked"
                          }
                          onClick={() =>
                            toggleBlock(user)
                          }
                        >
                          {user.status ===
                          "Blocked" ? (
                            <ShieldCheck
                              size={17}
                            />
                          ) : (
                            <Ban
                              size={17}
                            />
                          )}
                        </ActionButton>
                      )}

                      {user.role !==
                        "Admin" &&
                        user.status !==
                          "Blocked" && (
                          <ActionButton
                            title="Change Status"
                            onClick={() =>
                              openStatusModal(
                                user
                              )
                            }
                          >
                            <RefreshCw
                              size={17}
                            />
                          </ActionButton>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length ===
                0 && (
                <tr>
                  <td
                    colSpan={7}
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
        {filteredUsers.map((user) => (
          <div
            key={user.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <Avatar
                name={user.name}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-800">
                      {user.name}
                    </h3>

                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user.email}
                    </p>

                    <p className="mt-1 font-mono text-[11px] text-blue-600">
                      {user.id}
                    </p>
                  </div>

                  <UserStatusBadge
                    status={user.status}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Role"
                    value={user.role}
                  />

                  <InfoBox
                    label="Location"
                    value={user.location}
                  />

                  <InfoBox
                    label="Complaints"
                    value={String(
                      user.totalComplaints
                    )}
                  />

                  <InfoBox
                    label="Registered"
                    value={
                      user.registrationDate
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <p className="text-xs text-slate-400">
                Last login:{" "}
                {user.lastLogin}
              </p>

              <div className="flex gap-1">
                <ActionButton
                  title="View"
                  onClick={() =>
                    openViewModal(user)
                  }
                >
                  <Eye size={16} />
                </ActionButton>

                <ActionButton
                  title="Edit"
                  onClick={() =>
                    openEditModal(user)
                  }
                >
                  <Pencil size={16} />
                </ActionButton>

                {user.role !==
                  "Admin" && (
                  <ActionButton
                    title={
                      user.status ===
                      "Blocked"
                        ? "Unblock"
                        : "Block"
                    }
                    danger={
                      user.status !==
                      "Blocked"
                    }
                    success={
                      user.status ===
                      "Blocked"
                    }
                    onClick={() =>
                      toggleBlock(user)
                    }
                  >
                    {user.status ===
                    "Blocked" ? (
                      <ShieldCheck
                        size={16}
                      />
                    ) : (
                      <Ban size={16} />
                    )}
                  </ActionButton>
                )}
              </div>
            </div>
          </div>
        ))}

        {filteredUsers.length ===
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
        selectedUser && (
          <Modal
            title="User Details"
            subtitle="Complete user account information."
            onClose={closeModal}
            size="xl"
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Avatar
                    name={
                      selectedUser.name
                    }
                    large
                  />

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedUser.name}
                    </h3>

                    <p className="mt-1 font-mono text-xs text-blue-600">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>

                <UserStatusBadge
                  status={
                    selectedUser.status
                  }
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailBox
                  label="Email"
                  value={
                    selectedUser.email
                  }
                  icon={Mail}
                />

                <DetailBox
                  label="Phone"
                  value={
                    selectedUser.phone
                  }
                  icon={Phone}
                />

                <DetailBox
                  label="Role"
                  value={
                    selectedUser.role
                  }
                  icon={Shield}
                />

                <DetailBox
                  label="Location"
                  value={
                    selectedUser.location
                  }
                />

                <DetailBox
                  label="Registration Date"
                  value={
                    selectedUser.registrationDate
                  }
                />

                <DetailBox
                  label="Last Login"
                  value={
                    selectedUser.lastLogin
                  }
                />

                <DetailBox
                  label="Total Complaints"
                  value={String(
                    selectedUser.totalComplaints
                  )}
                  icon={MessageSquare}
                />
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={() =>
                    openEditModal(
                      selectedUser
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Pencil size={17} />
                  Edit User
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* ===================================================
          EDIT MODAL
      =================================================== */}

      {modal === "edit" &&
        editData && (
          <Modal
            title="Edit User"
            subtitle="Update user account information."
            onClose={closeModal}
            size="lg"
          >
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField label="Full Name">
                  <input
                    value={editData.name}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Email">
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        email: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Phone">
                  <input
                    value={editData.phone}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        phone: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Location">
                  <input
                    value={editData.location}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        location:
                          e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Role">
                  <select
                    value={editData.role}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        role: e.target
                          .value as UserRole,
                      })
                    }
                    className={inputClass}
                  >
                    {roles.map((role) => (
                      <option
                        key={role}
                        value={role}
                      >
                        {role}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Status">
                  <select
                    value={editData.status}
                    onChange={(e) =>
                      setEditData({
                        ...editData,
                        status:
                          e.target
                            .value as UserStatus,
                      })
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
                </FormField>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  User ID
                </p>

                <p className="mt-1 font-mono text-sm font-semibold text-slate-700">
                  {editData.id}
                </p>
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleEditSave}
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
          STATUS MODAL
      =================================================== */}

      {modal === "status" &&
        selectedUser && (
          <Modal
            title="Change User Status"
            subtitle="Update the current account status."
            onClose={closeModal}
            size="sm"
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    name={
                      selectedUser.name
                    }
                  />

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedUser.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedUser.id}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  New Status
                </label>

                <select
                  value={newStatus}
                  onChange={(e) =>
                    setNewStatus(
                      e.target
                        .value as UserStatus
                    )
                  }
                  className={inputClass}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={
                    handleStatusChange
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Save size={17} />
                  Update Status
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
   AVATAR
========================================================= */

function Avatar({
  name,
  large = false,
}: {
  name: string;
  large?: boolean;
}) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 ${
        large
          ? "h-14 w-14 text-lg"
          : "h-10 w-10 text-xs"
      }`}
    >
      {initials}
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function UserStatusBadge({
  status,
}: {
  status: UserStatus;
}) {
  const styles: Record<
    UserStatus,
    string
  > = {
    Active:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    Inactive:
      "border-slate-200 bg-slate-100 text-slate-600",
    Blocked:
      "border-red-100 bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Active" && (
        <CheckCircle2 size={12} />
      )}

      {status === "Inactive" && (
        <Clock3 size={12} />
      )}

      {status === "Blocked" && (
        <Ban size={12} />
      )}

      {status}
    </span>
  );
}

/* =========================================================
   ROLE BADGE
========================================================= */

function RoleBadge({
  role,
}: {
  role: UserRole;
}) {
  const isAdmin =
    role === "Admin" ||
    role === "Station Manager" ||
    role === "Support Agent";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${
        isAdmin
          ? "border-purple-100 bg-purple-50 text-purple-700"
          : "border-blue-100 bg-blue-50 text-blue-700"
      }`}
    >
      {isAdmin ? (
        <Shield size={12} />
      ) : (
        <UserRound size={12} />
      )}

      {role}
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
   FORM FIELD
========================================================= */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
      </label>

      {children}
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
   EMPTY
========================================================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Users size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No users found
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