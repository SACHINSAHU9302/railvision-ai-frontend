"use client";

import { useMemo, useRef, useState, type ChangeEvent, type ElementType, type ReactNode } from "react";
import {
  AlertCircle, CheckCircle2, ChevronDown,
  Clock3, Database, FileText, FileUp, Plus, Search,
  SlidersHorizontal, Upload, X,
} from "lucide-react";

type DocumentStatus = "Approved" | "Pending" | "Rejected";
type DocumentCategory =
  | "Railway Rules"
  | "Refund Rules"
  | "Luggage Rules"
  | "Passenger Charter"
  | "Safety Guidelines"
  | "Station Rules"
  | "Ticket Rules"
  | "FAQ"
  | "Railway Manuals";

type RailwayDocument = {
  id: number;
  title: string;
  description: string;
  category: DocumentCategory;
  original_filename: string;
  file_type: string;
  verification_status: DocumentStatus;
  processing_status: "Pending" | "Processing" | "Completed" | "Failed";
  is_indexed: boolean;
  uploaded_at: string;
};

const categories: DocumentCategory[] = [
  "Railway Rules", "Refund Rules", "Luggage Rules", "Passenger Charter",
  "Safety Guidelines", "Station Rules", "Ticket Rules", "FAQ", "Railway Manuals",
];
const departments = ["Commercial", "Operations", "Safety", "Engineering", "Passenger Services", "Security", "Administration", "IT"];
const languages = ["English", "Hindi", "English + Hindi"];
const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

export default function RagDocumentsPage() {
  // This page intentionally starts empty. Documents must come from the Django API.
  const [documents] = useState<RailwayDocument[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<DocumentCategory>("Railway Rules");
  const [department, setDepartment] = useState("Operations");
  const [language, setLanguage] = useState("English");
  const [fileError, setFileError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const filteredDocuments = useMemo(() => documents.filter((doc) => {
    const q = search.trim().toLowerCase();
    const matchesSearch = !q || [doc.title, doc.description, doc.category, doc.original_filename]
      .some((value) => value.toLowerCase().includes(q));
    return matchesSearch && (statusFilter === "All" || doc.verification_status === statusFilter)
      && (categoryFilter === "All" || doc.category === categoryFilter);
  }), [documents, search, statusFilter, categoryFilter]);

  const indexedCount = documents.filter((doc) => doc.is_indexed).length;
  const pendingCount = documents.filter((doc) => doc.verification_status === "Pending").length;
  const rejectedCount = documents.filter((doc) => doc.verification_status === "Rejected").length;

  const resetUploadForm = () => {
    setSelectedFile(null); setTitle(""); setDescription("");
    setCategory("Railway Rules"); setDepartment("Operations");
    setLanguage("English"); setFileError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError("");
    if (!file) return;
    const isAllowed = /\.(pdf|txt)$/i.test(file.name);
    if (!isAllowed) {
      setFileError("Only PDF and TXT files are supported.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setFileError("File size must be 10 MB or less.");
      event.target.value = "";
      setSelectedFile(null);
      return;
    }
    setSelectedFile(file);
    if (!title.trim()) setTitle(file.name.replace(/\.(pdf|txt)$/i, ""));
  };

  const closeUpload = () => { setShowUpload(false); resetUploadForm(); };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Database size={16} /><span>Admin</span><span>/</span><span className="text-slate-700">RAG Documents</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">RAG Documents</h1>
          <p className="mt-1 text-sm text-slate-500">Manage documents used by the Railway AI knowledge and RAG system.</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
          <Plus size={18} /> Upload Document
        </button>
      </div>

      <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        <AlertCircle size={19} className="mt-0.5 shrink-0" />
        <div><p className="font-semibold">Backend connection is not enabled on this page yet.</p><p className="mt-1 text-amber-700">The list is intentionally empty. No sample documents, fake chunk counts, or simulated indexing are shown.</p></div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard title="Total Documents" value={documents.length} icon={FileText} description="Saved in database" />
        <SummaryCard title="Indexed" value={indexedCount} icon={CheckCircle2} description="Available for RAG" />
        <SummaryCard title="Pending" value={pendingCount} icon={Clock3} description="Awaiting verification" />
        <SummaryCard title="Rejected" value={rejectedCount} icon={AlertCircle} description="Not approved" />
        <SummaryCard title="Indexed Chunks" value="—" icon={Database} description="Provided by RAG pipeline" />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1"><Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search document, category, or file name..." className={`${inputClass} pl-10`} />
          </div>
          <button onClick={() => setShowFilters((v) => !v)} className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${showFilters ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}>
            <SlidersHorizontal size={17} /> Filters <ChevronDown size={16} className={showFilters ? "rotate-180" : ""} />
          </button>
          {(search || statusFilter !== "All" || categoryFilter !== "All") && <button onClick={() => { setSearch(""); setStatusFilter("All"); setCategoryFilter("All"); }} className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100">Clear</button>}
        </div>
        {showFilters && <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
          <FilterSelect label="Category" value={categoryFilter} onChange={setCategoryFilter} options={["All", ...categories]} />
          <FilterSelect label="Verification Status" value={statusFilter} onChange={setStatusFilter} options={["All", "Pending", "Approved", "Rejected"]} />
        </div>}
      </div>

      <div className="flex items-center justify-between"><p className="text-sm text-slate-500">Showing <span className="font-semibold text-slate-800">{filteredDocuments.length}</span> of <span className="font-semibold text-slate-800">{documents.length}</span> documents</p></div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto"><table className="w-full min-w-[900px]">
          <thead><tr className="border-b border-slate-200 bg-slate-50">
            { ["Document", "Category", "File", "Verification", "Processing", "Uploaded", "Actions"].map((heading) => <th key={heading} className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">{heading}</th>) }
          </tr></thead>
          <tbody>{filteredDocuments.length === 0 ? <tr><td colSpan={7} className="px-5 py-16 text-center"><EmptyState hasFilters={Boolean(search || statusFilter !== "All" || categoryFilter !== "All")} onUpload={() => setShowUpload(true)} /></td></tr> : filteredDocuments.map((doc) => <tr key={doc.id} className="border-b border-slate-100 last:border-0">
            <td className="px-5 py-4"><div className="flex items-center gap-3"><FileText className="text-blue-600" /><div><p className="font-semibold text-slate-800">{doc.title}</p><p className="mt-1 text-xs text-slate-400">{doc.original_filename}</p></div></div></td>
            <td className="px-5 py-4 text-sm text-slate-600">{doc.category}</td><td className="px-5 py-4 text-sm uppercase text-slate-600">{doc.file_type}</td>
            <td className="px-5 py-4"><StatusBadge status={doc.verification_status} /></td><td className="px-5 py-4 text-sm text-slate-600">{doc.processing_status}</td>
            <td className="px-5 py-4 text-sm text-slate-600">{new Date(doc.uploaded_at).toLocaleDateString()}</td><td className="px-5 py-4 text-sm text-slate-400">—</td>
          </tr>)}</tbody>
        </table></div>
      </div>

      {showUpload && <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5">
        <button aria-label="Close upload dialog" className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={closeUpload} />
        <div className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4 sm:px-6"><div><h2 className="text-lg font-bold text-slate-900">Upload RAG Document</h2><p className="mt-1 text-xs text-slate-500">Select a file and enter its document details.</p></div><button onClick={closeUpload} className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"><X size={19} /></button></div>
          <div className="space-y-5 overflow-y-auto p-5 sm:p-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4"><div className="flex flex-col gap-3 sm:flex-row sm:items-center"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-blue-600"><Upload size={22} /></div><div className="min-w-0 flex-1"><p className="text-sm font-semibold text-slate-800">{selectedFile?.name || "No file selected"}</p><p className="mt-1 text-xs text-slate-500">{selectedFile ? `${(selectedFile.size / (1024 * 1024)).toFixed(2)} MB` : "PDF or TXT · Maximum 10 MB"}</p></div><button type="button" onClick={() => fileRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"><FileUp size={17} /> Choose File</button></div><input ref={fileRef} type="file" accept=".pdf,.txt,application/pdf,text/plain" onChange={handleFileChange} className="hidden" />{fileError && <p className="mt-3 text-sm text-red-600">{fileError}</p>}</div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <FormField label="Document Title"><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Railway Passenger Rules" className={inputClass} /></FormField>
              <FormField label="Category"><select value={category} onChange={(e) => setCategory(e.target.value as DocumentCategory)} className={inputClass}>{categories.map((item) => <option key={item}>{item}</option>)}</select></FormField>
              <FormField label="Department"><select value={department} onChange={(e) => setDepartment(e.target.value)} className={inputClass}>{departments.map((item) => <option key={item}>{item}</option>)}</select></FormField>
              <FormField label="Language"><select value={language} onChange={(e) => setLanguage(e.target.value)} className={inputClass}>{languages.map((item) => <option key={item}>{item}</option>)}</select></FormField>
            </div>
            <FormField label="Description"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Briefly describe this document..." className={`${inputClass} resize-none`} /></FormField>
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800"><p className="font-semibold">Upload is not connected yet</p><p className="mt-1 text-amber-700">File selection and validation are ready. Saving to PostgreSQL will be enabled after connecting this page to the Django document API.</p></div>
            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end"><button onClick={closeUpload} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Close</button><button disabled className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-xl bg-slate-300 px-5 py-2.5 text-sm font-semibold text-white" title="Connect Django API to enable upload"><Upload size={17} /> Upload Document</button></div>
          </div>
        </div>
      </div>}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, description }: { title: string; value: string | number; icon: ElementType; description: string }) {
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-400">{description}</p></div><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Icon size={21} /></div></div></div>;
}
function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <div><label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className={inputClass}>{options.map((item) => <option key={item} value={item}>{item === "All" ? `All ${label}` : item}</option>)}</select></div>;
}
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="mb-1.5 block text-sm font-semibold text-slate-700">{label}</label>{children}</div>;
}
function StatusBadge({ status }: { status: DocumentStatus }) {
  const styles: Record<DocumentStatus, string> = { Approved: "bg-emerald-50 text-emerald-700 border-emerald-100", Pending: "bg-amber-50 text-amber-700 border-amber-100", Rejected: "bg-red-50 text-red-700 border-red-100" };
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}>{status}</span>;
}
function EmptyState({ hasFilters, onUpload }: { hasFilters: boolean; onUpload: () => void }) {
  return <div className="flex flex-col items-center justify-center"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400"><FileText size={22} /></div><h3 className="mt-3 text-sm font-semibold text-slate-800">{hasFilters ? "No matching documents" : "No documents uploaded yet"}</h3><p className="mt-1 max-w-sm text-xs text-slate-500">{hasFilters ? "Try changing your search or filters." : "Your real database documents will appear here after API integration."}</p>{!hasFilters && <button onClick={onUpload} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"><Plus size={15} /> Add Document</button>}</div>;
}
