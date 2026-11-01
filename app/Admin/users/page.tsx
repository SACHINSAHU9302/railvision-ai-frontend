"use client";

import { useMemo, useState } from "react";
import {
  Users, Search, SlidersHorizontal, Eye, Pencil, CheckCircle2,
  XCircle, Ban, UserCheck, UserX, Shield, Mail, Phone,
  CalendarDays, Clock3, MessageSquare, X, Save, UserRound,
  ShieldCheck, RefreshCw, MapPin, AlertCircle, Database,
} from "lucide-react";

type UserStatus = "Active" | "Inactive" | "Blocked";
type UserRole = "Passenger" | "Admin" | "Station Manager" | "Support Agent";

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

const roles: UserRole[] = ["Passenger", "Admin", "Station Manager", "Support Agent"];
const statuses: UserStatus[] = ["Active", "Inactive", "Blocked"];
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";
const labelClass = "mb-1.5 block text-sm font-semibold text-slate-700";
const thClass = "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";

export default function UsersPage() {
  // No demo records: this page will display real users after the API is connected.
  const [users] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [modal, setModal] = useState<"view" | "edit" | "status" | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();
    return users.filter((user) => {
      const matchesSearch = !query || [user.id, user.name, user.email, user.phone, user.location]
        .some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (statusFilter === "All" || user.status === statusFilter)
        && (roleFilter === "All" || user.role === roleFilter);
    });
  }, [users, search, statusFilter, roleFilter]);

  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.status === "Active").length;
  const inactiveUsers = users.filter((user) => user.status === "Inactive").length;
  const blockedUsers = users.filter((user) => user.status === "Blocked").length;
  const newUsers = users.filter((user) => {
    const date = new Date(user.registrationDate).getTime();
    return Number.isFinite(date) && Date.now() - date <= 30 * 24 * 60 * 60 * 1000;
  }).length;

  const closeModal = () => { setModal(null); setSelectedUser(null); };
  const resetFilters = () => { setSearch(""); setStatusFilter("All"); setRoleFilter("All"); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Users size={16} /><span>Admin</span><span>/</span><span className="text-slate-700">Users</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">User Management</h1>
          <p className="mt-1 text-sm text-slate-500">Manage passengers, administrators and support users.</p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <ShieldCheck size={18} className="text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">User Administration</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total Users" value={totalUsers} icon={Users} description="Registered users" />
        <SummaryCard title="Active Users" value={activeUsers} icon={UserCheck} description="Currently active" />
        <SummaryCard title="Inactive" value={inactiveUsers} icon={UserX} description="Inactive accounts" />
        <SummaryCard title="Blocked" value={blockedUsers} icon={Ban} description="Blocked accounts" />
        <SummaryCard title="New Users" value={newUsers} icon={UserRound} description="Last 30 days" />
      </div>

      <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
        <div className="flex items-start gap-3">
          <Database size={19} className="mt-0.5 shrink-0 text-blue-600" />
          <div>
            <p className="text-sm font-semibold text-blue-900">Backend connection pending</p>
            <p className="mt-1 text-sm leading-6 text-blue-800">This page currently contains no sample users. Real user records, statistics and account actions will appear after connecting the Django API.</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search user ID, name, email, phone..." className={`${inputClass} pl-10`} />
          </div>
          <button onClick={() => setShowFilters((value) => !value)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${showFilters ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
            <SlidersHorizontal size={17} /> Filters
          </button>
          {(search || statusFilter !== "All" || roleFilter !== "All") && (
            <button onClick={resetFilters} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800">Clear</button>
          )}
        </div>
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <FilterSelect label="Status" value={statusFilter} onChange={setStatusFilter} options={["All", ...statuses]} />
            <FilterSelect label="Role" value={roleFilter} onChange={setRoleFilter} options={["All", ...roles]} />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-800">{filteredUsers.length}</span> of <span className="font-semibold text-slate-800">{users.length}</span> users</p>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead><tr className="border-b border-slate-200 bg-slate-50">
              <th className={thClass}>User</th><th className={thClass}>Role</th><th className={thClass}>Status</th><th className={thClass}>Registration</th><th className={thClass}>Last Login</th><th className={thClass}>Complaints</th><th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr></thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-slate-100 hover:bg-slate-50/80">
                  <td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar name={user.name} /><div><p className="font-semibold text-slate-800">{user.name}</p><p className="mt-1 text-xs text-slate-500">{user.email}</p><p className="mt-1 font-mono text-[11px] text-blue-600">{user.id}</p></div></div></td>
                  <td className="px-5 py-4"><RoleBadge role={user.role} /></td><td className="px-5 py-4"><UserStatusBadge status={user.status} /></td>
                  <td className="px-5 py-4 text-sm text-slate-600">{user.registrationDate}</td><td className="px-5 py-4 text-sm text-slate-600">{user.lastLogin || "—"}</td><td className="px-5 py-4 font-semibold text-slate-700">{user.totalComplaints}</td>
                  <td className="px-5 py-4"><div className="flex justify-end"><ActionButton title="View" onClick={() => { setSelectedUser(user); setModal("view"); }}><Eye size={17} /></ActionButton></div></td>
                </tr>
              ))}
              {filteredUsers.length === 0 && <tr><td colSpan={7} className="px-5 py-16"><EmptyState hasFilters={Boolean(search || statusFilter !== "All" || roleFilter !== "All")} /></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:hidden">
        {filteredUsers.map((user) => (
          <div key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3"><Avatar name={user.name} /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><h3 className="truncate font-semibold text-slate-800">{user.name}</h3><p className="mt-1 truncate text-xs text-slate-500">{user.email}</p></div><UserStatusBadge status={user.status} /></div><div className="mt-3 grid grid-cols-2 gap-3"><InfoBox label="Role" value={user.role} /><InfoBox label="Location" value={user.location || "—"} /><InfoBox label="Complaints" value={String(user.totalComplaints)} /><InfoBox label="Registered" value={user.registrationDate} /></div></div></div>
            <div className="mt-4 flex justify-end border-t border-slate-100 pt-3"><ActionButton title="View details" onClick={() => { setSelectedUser(user); setModal("view"); }}><Eye size={16} /></ActionButton></div>
          </div>
        ))}
        {filteredUsers.length === 0 && <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm"><EmptyState hasFilters={Boolean(search || statusFilter !== "All" || roleFilter !== "All")} /></div>}
      </div>

      {modal === "view" && selectedUser && (
        <Modal title="User Details" subtitle="User account information." onClose={closeModal}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <DetailBox label="Name" value={selectedUser.name} icon={UserRound} /><DetailBox label="Email" value={selectedUser.email} icon={Mail} />
            <DetailBox label="Phone" value={selectedUser.phone || "—"} icon={Phone} /><DetailBox label="Role" value={selectedUser.role} icon={Shield} />
            <DetailBox label="Location" value={selectedUser.location || "—"} icon={MapPin} /><DetailBox label="Registration" value={selectedUser.registrationDate} icon={CalendarDays} />
            <DetailBox label="Last Login" value={selectedUser.lastLogin || "—"} icon={Clock3} /><DetailBox label="Complaints" value={String(selectedUser.totalComplaints)} icon={MessageSquare} />
          </div>
        </Modal>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, description }: { title: string; value: number; icon: React.ElementType; description: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{description}</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21} /></div></div></div>;
}

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{initials}</div>;
}

function UserStatusBadge({ status }: { status: UserStatus }) {
  const style = status === "Active" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : status === "Inactive" ? "border-slate-200 bg-slate-100 text-slate-600" : "border-red-100 bg-red-50 text-red-700";
  const Icon = status === "Active" ? CheckCircle2 : status === "Inactive" ? Clock3 : Ban;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${style}`}><Icon size={12} />{status}</span>;
}

function RoleBadge({ role }: { role: UserRole }) {
  const isAdmin = role !== "Passenger";
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${isAdmin ? "border-purple-100 bg-purple-50 text-purple-700" : "border-blue-100 bg-blue-50 text-blue-700"}`}>{isAdmin ? <Shield size={12} /> : <UserRound size={12} />}{role}</span>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>{options.map((option) => <option key={option} value={option}>{option === "All" ? `All ${label}s` : option}</option>)}</select></div>;
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl bg-slate-50 p-3"><p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">{label}</p><p className="mt-1 break-words text-sm font-medium text-slate-700">{value}</p></div>;
}

function DetailBox({ label, value, icon: Icon }: { label: string; value: string; icon?: React.ElementType }) {
  return <div className="rounded-xl border border-slate-200 p-4"><div className="flex items-center gap-2">{Icon && <Icon size={14} className="text-slate-400" />}<p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</p></div><p className="mt-1.5 break-words text-sm font-semibold text-slate-800">{value}</p></div>;
}

function ActionButton({ title, children, onClick }: { title: string; children: React.ReactNode; onClick: () => void }) {
  return <button type="button" title={title} onClick={onClick} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600">{children}</button>;
}

function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return <div className="flex flex-col items-center justify-center text-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><Users size={22} /></div><h3 className="mt-3 text-sm font-semibold text-slate-800">{hasFilters ? "No matching users" : "No users available yet"}</h3><p className="mt-1 max-w-md text-xs leading-5 text-slate-500">{hasFilters ? "Try changing your search or filters." : "Once the Django User Management API is connected, registered users will appear here."}</p></div>;
}

function Modal({ title, subtitle, children, onClose }: { title: string; subtitle?: string; children: React.ReactNode; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5"><button aria-label="Close modal" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} /><div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"><div className="flex shrink-0 items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="text-lg font-bold text-slate-900">{title}</h2>{subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}</div><button type="button" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"><X size={19} /></button></div><div className="overflow-y-auto p-5 sm:p-6">{children}</div></div></div>;
}
