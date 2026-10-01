"use client";

import { useMemo, useRef, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  FileText,
  Upload,
  RefreshCw,
  Download,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ChevronDown,
  Database,
  Languages,
  CalendarDays,
  Building2,
  ExternalLink,
  Save,
  FileUp,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type DocumentStatus =
  | "Indexed"
  | "Pending"
  | "Processing"
  | "Failed"
  | "Archived";

type DocumentType =
  | "Railway Rules"
  | "Refund Rules"
  | "Luggage Rules"
  | "Passenger Charter"
  | "Safety Guidelines"
  | "Station Rules"
  | "Ticket Rules"
  | "FAQ"
  | "Railway Manuals";

interface RagDocument {
  id: number;
  documentName: string;
  documentType: DocumentType;
  department: string;
  source: string;
  documentUrl: string;
  uploadDate: string;
  language: string;
  version: string;
  status: DocumentStatus;
  fileType: "PDF" | "DOCX";
  fileSize: string;
  chunks: number;
  lastIndexed: string;
  description: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const documentTypes: DocumentType[] = [
  "Railway Rules",
  "Refund Rules",
  "Luggage Rules",
  "Passenger Charter",
  "Safety Guidelines",
  "Station Rules",
  "Ticket Rules",
  "FAQ",
  "Railway Manuals",
];

const departmentOptions = [
  "Commercial",
  "Operations",
  "Safety",
  "Engineering",
  "Passenger Services",
  "Security",
  "Administration",
  "IT",
];

const languageOptions = [
  "English",
  "Hindi",
  "English + Hindi",
];

/* =========================================================
   DUMMY DATA
========================================================= */

const initialDocuments: RagDocument[] = [
  {
    id: 1,
    documentName: "Indian Railway Passenger Rules",
    documentType: "Railway Rules",
    department: "Operations",
    source: "Indian Railways",
    documentUrl: "https://example.com/passenger-rules.pdf",
    uploadDate: "2026-09-28",
    language: "English",
    version: "v3.2",
    status: "Indexed",
    fileType: "PDF",
    fileSize: "2.4 MB",
    chunks: 184,
    lastIndexed: "2026-09-28 14:30",
    description:
      "General rules and regulations applicable to railway passengers.",
  },
  {
    id: 2,
    documentName: "Passenger Refund Rules 2026",
    documentType: "Refund Rules",
    department: "Commercial",
    source: "Railway Board",
    documentUrl: "https://example.com/refund-rules.pdf",
    uploadDate: "2026-09-26",
    language: "English",
    version: "v2.1",
    status: "Indexed",
    fileType: "PDF",
    fileSize: "1.8 MB",
    chunks: 126,
    lastIndexed: "2026-09-26 11:45",
    description:
      "Refund rules for cancelled and partially used railway tickets.",
  },
  {
    id: 3,
    documentName: "Passenger Charter of Services",
    documentType: "Passenger Charter",
    department: "Passenger Services",
    source: "Indian Railways",
    documentUrl: "https://example.com/passenger-charter.pdf",
    uploadDate: "2026-09-25",
    language: "English + Hindi",
    version: "v4.0",
    status: "Indexed",
    fileType: "PDF",
    fileSize: "3.1 MB",
    chunks: 242,
    lastIndexed: "2026-09-25 16:20",
    description:
      "Passenger rights, services and railway service standards.",
  },
  {
    id: 4,
    documentName: "Railway Safety Guidelines",
    documentType: "Safety Guidelines",
    department: "Safety",
    source: "Safety Directorate",
    documentUrl: "https://example.com/safety.pdf",
    uploadDate: "2026-09-23",
    language: "English",
    version: "v5.1",
    status: "Indexed",
    fileType: "PDF",
    fileSize: "4.6 MB",
    chunks: 318,
    lastIndexed: "2026-09-23 10:15",
    description:
      "Safety guidelines and passenger safety instructions.",
  },
  {
    id: 5,
    documentName: "Station Operating Manual",
    documentType: "Station Rules",
    department: "Operations",
    source: "Operations Directorate",
    documentUrl: "https://example.com/station-manual.pdf",
    uploadDate: "2026-09-20",
    language: "English",
    version: "v2.4",
    status: "Processing",
    fileType: "PDF",
    fileSize: "5.2 MB",
    chunks: 0,
    lastIndexed: "Not indexed",
    description:
      "Station operations, procedures and facility management instructions.",
  },
  {
    id: 6,
    documentName: "Luggage and Parcel Rules",
    documentType: "Luggage Rules",
    department: "Commercial",
    source: "Railway Board",
    documentUrl: "https://example.com/luggage-rules.pdf",
    uploadDate: "2026-09-18",
    language: "English",
    version: "v3.0",
    status: "Pending",
    fileType: "PDF",
    fileSize: "1.2 MB",
    chunks: 0,
    lastIndexed: "Not indexed",
    description:
      "Rules for passenger luggage, parcels and prohibited items.",
  },
  {
    id: 7,
    documentName: "Railway Ticket Booking FAQ",
    documentType: "FAQ",
    department: "Passenger Services",
    source: "Railway Helpdesk",
    documentUrl: "https://example.com/ticket-faq.pdf",
    uploadDate: "2026-09-15",
    language: "English + Hindi",
    version: "v1.8",
    status: "Indexed",
    fileType: "PDF",
    fileSize: "920 KB",
    chunks: 96,
    lastIndexed: "2026-09-15 09:40",
    description:
      "Frequently asked questions related to railway ticket booking.",
  },
  {
    id: 8,
    documentName: "Railway Ticket Rules",
    documentType: "Ticket Rules",
    department: "Commercial",
    source: "Railway Board",
    documentUrl: "https://example.com/ticket-rules.pdf",
    uploadDate: "2026-09-12",
    language: "English",
    version: "v2.7",
    status: "Failed",
    fileType: "PDF",
    fileSize: "2.1 MB",
    chunks: 0,
    lastIndexed: "Index failed",
    description:
      "Ticket booking, cancellation and ticket validity rules.",
  },
];

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyDocument: RagDocument = {
  id: 0,
  documentName: "",
  documentType: "Railway Rules",
  department: "Operations",
  source: "",
  documentUrl: "",
  uploadDate: new Date().toISOString().split("T")[0],
  language: "English",
  version: "v1.0",
  status: "Pending",
  fileType: "PDF",
  fileSize: "0 KB",
  chunks: 0,
  lastIndexed: "Not indexed",
  description: "",
};

/* =========================================================
   PAGE
========================================================= */

export default function RagDocumentsPage() {
  const [documents, setDocuments] =
    useState<RagDocument[]>(initialDocuments);

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [modal, setModal] = useState<
    "add" |
      "edit" |
      "view" |
      "delete" |
      "replace" |
      null
  >(null);

  const [selectedDocument, setSelectedDocument] =
    useState<RagDocument | null>(null);

  const [formData, setFormData] =
    useState<RagDocument>(emptyDocument);

  const [isUploading, setIsUploading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredDocuments = useMemo(() => {
    return documents.filter((document) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        document.documentName
          .toLowerCase()
          .includes(query) ||
        document.documentType
          .toLowerCase()
          .includes(query) ||
        document.department
          .toLowerCase()
          .includes(query) ||
        document.source
          .toLowerCase()
          .includes(query) ||
        document.version
          .toLowerCase()
          .includes(query);

      const matchesType =
        typeFilter === "All" ||
        document.documentType === typeFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        document.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        document.status === statusFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [
    documents,
    search,
    typeFilter,
    departmentFilter,
    statusFilter,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const totalDocuments = documents.length;

  const indexedDocuments = documents.filter(
    (document) => document.status === "Indexed"
  ).length;

  const pendingDocuments = documents.filter(
    (document) =>
      document.status === "Pending" ||
      document.status === "Processing"
  ).length;

  const failedDocuments = documents.filter(
    (document) => document.status === "Failed"
  ).length;

  const totalChunks = documents.reduce(
    (total, document) => total + document.chunks,
    0
  );

  /* =========================================================
     MODALS
  ========================================================= */

  const closeModal = () => {
    setModal(null);
    setSelectedDocument(null);
  };

  const openAddModal = () => {
    setFormData({
      ...emptyDocument,
      uploadDate: new Date()
        .toISOString()
        .split("T")[0],
    });

    setModal("add");
  };

  const openEditModal = (
    document: RagDocument
  ) => {
    setSelectedDocument(document);
    setFormData(document);
    setModal("edit");
  };

  const openViewModal = (
    document: RagDocument
  ) => {
    setSelectedDocument(document);
    setModal("view");
  };

  const openDeleteModal = (
    document: RagDocument
  ) => {
    setSelectedDocument(document);
    setModal("delete");
  };

  const openReplaceModal = (
    document: RagDocument
  ) => {
    setSelectedDocument(document);
    setModal("replace");
  };

  /* =========================================================
     FORM
  ========================================================= */

  const updateField = <K extends keyof RagDocument>(
    key: K,
    value: RagDocument[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  /* =========================================================
     SAVE DOCUMENT
  ========================================================= */

  const handleSave = () => {
    if (
      !formData.documentName.trim() ||
      !formData.source.trim()
    ) {
      alert(
        "Please enter Document Name and Source."
      );
      return;
    }

    if (modal === "add") {
      const newDocument: RagDocument = {
        ...formData,
        id: Date.now(),
        status: "Pending",
        chunks: 0,
        lastIndexed: "Not indexed",
      };

      setDocuments((previous) => [
        newDocument,
        ...previous,
      ]);
    }

    if (modal === "edit") {
      setDocuments((previous) =>
        previous.map((document) =>
          document.id === formData.id
            ? formData
            : document
        )
      );
    }

    closeModal();
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = () => {
    if (!selectedDocument) return;

    setDocuments((previous) =>
      previous.filter(
        (document) =>
          document.id !== selectedDocument.id
      )
    );

    closeModal();
  };

  /* =========================================================
     RE-INDEX
  ========================================================= */

  const handleReindex = (
    documentId: number
  ) => {
    setDocuments((previous) =>
      previous.map((document) =>
        document.id === documentId
          ? {
              ...document,
              status: "Processing",
            }
          : document
      )
    );

    setTimeout(() => {
      setDocuments((previous) =>
        previous.map((document) =>
          document.id === documentId
            ? {
                ...document,
                status: "Indexed",
                chunks:
                  document.chunks ||
                  Math.floor(
                    Math.random() * 180
                  ) + 60,
                lastIndexed:
                  new Date().toLocaleString(
                    "en-IN"
                  ),
              }
            : document
        )
      );
    }, 1200);
  };

  /* =========================================================
     FILE SELECT
  ========================================================= */

  const handleFileSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const extension =
      file.name.toLowerCase().endsWith(".docx")
        ? "DOCX"
        : "PDF";

    const sizeInMb = (
      file.size /
      (1024 * 1024)
    ).toFixed(2);

    setFormData((previous) => ({
      ...previous,
      documentName: file.name.replace(
        /\.(pdf|docx)$/i,
        ""
      ),
      fileType: extension,
      fileSize: `${sizeInMb} MB`,
    }));
  };

  /* =========================================================
     REPLACE FILE
  ========================================================= */

  const handleReplaceFile = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file || !selectedDocument) return;

    setIsUploading(true);

    setTimeout(() => {
      const extension =
        file.name
          .toLowerCase()
          .endsWith(".docx")
          ? "DOCX"
          : "PDF";

      const sizeInMb = (
        file.size /
        (1024 * 1024)
      ).toFixed(2);

      setDocuments((previous) =>
        previous.map((document) =>
          document.id === selectedDocument.id
            ? {
                ...document,
                documentName:
                  file.name.replace(
                    /\.(pdf|docx)$/i,
                    ""
                  ),
                fileType: extension,
                fileSize: `${sizeInMb} MB`,
                version: incrementVersion(
                  document.version
                ),
                status: "Pending",
                chunks: 0,
                lastIndexed: "Not indexed",
                uploadDate:
                  new Date()
                    .toISOString()
                    .split("T")[0],
              }
            : document
        )
      );

      setIsUploading(false);
      closeModal();
    }, 1000);
  };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setDepartmentFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Database size={16} />
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-700">
              RAG Documents
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            RAG Documents
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage documents used by the Railway AI
            knowledge and RAG system.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={18} />
          Upload Document
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Documents"
          value={totalDocuments}
          icon={FileText}
          description="All documents"
        />

        <SummaryCard
          title="Indexed"
          value={indexedDocuments}
          icon={CheckCircle2}
          description="Ready for RAG"
        />

        <SummaryCard
          title="Pending"
          value={pendingDocuments}
          icon={Clock3}
          description="Processing / pending"
        />

        <SummaryCard
          title="Failed"
          value={failedDocuments}
          icon={AlertCircle}
          description="Indexing failed"
        />

        <SummaryCard
          title="Total Chunks"
          value={totalChunks}
          icon={Database}
          description="RAG text chunks"
        />
      </div>

      {/* =====================================================
          SEARCH
      ===================================================== */}

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
              placeholder="Search document, type, department, source..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <button
            onClick={() =>
              setShowFilters((previous) => !previous)
            }
            className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition ${
              showFilters
                ? "border-blue-200 bg-blue-50 text-blue-700"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            <SlidersHorizontal size={17} />
            Filters
            <ChevronDown
              size={16}
              className={`transition ${
                showFilters ? "rotate-180" : ""
              }`}
            />
          </button>

          {(search ||
            typeFilter !== "All" ||
            departmentFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={resetFilters}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-3">
            <FilterSelect
              label="Document Type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                {
                  value: "All",
                  label: "All Document Types",
                },
                ...documentTypes.map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
            />

            <FilterSelect
              label="Department"
              value={departmentFilter}
              onChange={setDepartmentFilter}
              options={[
                {
                  value: "All",
                  label: "All Departments",
                },
                ...departmentOptions.map(
                  (department) => ({
                    value: department,
                    label: department,
                  })
                ),
              ]}
            />

            <FilterSelect
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                {
                  value: "All",
                  label: "All Status",
                },
                {
                  value: "Indexed",
                  label: "Indexed",
                },
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "Processing",
                  label: "Processing",
                },
                {
                  value: "Failed",
                  label: "Failed",
                },
                {
                  value: "Archived",
                  label: "Archived",
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* =====================================================
          COUNT
      ===================================================== */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredDocuments.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {documents.length}
          </span>{" "}
          documents
        </p>
      </div>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1250px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Document
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Type
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Version
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Language
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  RAG Status
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Chunks
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map((document) => (
                <tr
                  key={document.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <FileTypeIcon
                        type={document.fileType}
                      />

                      <div className="min-w-0">
                        <p className="font-semibold text-slate-800">
                          {document.documentName}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {document.fileType} ·{" "}
                          {document.fileSize}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <CalendarDays size={12} />
                          {document.uploadDate}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {document.documentType}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Building2
                        size={14}
                        className="text-slate-400"
                      />
                      {document.department}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                      {document.version}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Languages
                        size={14}
                        className="text-slate-400"
                      />
                      {document.language}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <DocumentStatusBadge
                      status={document.status}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-700">
                      {document.chunks || "—"}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="Preview"
                        onClick={() =>
                          openViewModal(document)
                        }
                      >
                        <Eye size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Edit"
                        onClick={() =>
                          openEditModal(document)
                        }
                      >
                        <Pencil size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Re-index"
                        onClick={() =>
                          handleReindex(document.id)
                        }
                      >
                        <RefreshCw size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Replace"
                        onClick={() =>
                          openReplaceModal(document)
                        }
                      >
                        <Upload size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Delete"
                        danger
                        onClick={() =>
                          openDeleteModal(document)
                        }
                      >
                        <Trash2 size={17} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredDocuments.length === 0 && (
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

      {/* =====================================================
          MOBILE CARDS
      ===================================================== */}

      <div className="grid gap-4 lg:hidden">
        {filteredDocuments.map((document) => (
          <div
            key={document.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <FileTypeIcon
                type={document.fileType}
              />

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold text-slate-800">
                      {document.documentName}
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      {document.documentType}
                    </p>
                  </div>

                  <DocumentStatusBadge
                    status={document.status}
                  />
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Department"
                    value={document.department}
                  />

                  <InfoBox
                    label="Version"
                    value={document.version}
                  />

                  <InfoBox
                    label="Language"
                    value={document.language}
                  />

                  <InfoBox
                    label="Chunks"
                    value={
                      document.chunks || "Not indexed"
                    }
                  />
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <div className="text-xs text-slate-400">
                {document.fileType} ·{" "}
                {document.fileSize}
              </div>

              <div className="flex gap-1">
                <ActionButton
                  title="Preview"
                  onClick={() =>
                    openViewModal(document)
                  }
                >
                  <Eye size={16} />
                </ActionButton>

                <ActionButton
                  title="Edit"
                  onClick={() =>
                    openEditModal(document)
                  }
                >
                  <Pencil size={16} />
                </ActionButton>

                <ActionButton
                  title="Re-index"
                  onClick={() =>
                    handleReindex(document.id)
                  }
                >
                  <RefreshCw size={16} />
                </ActionButton>

                <ActionButton
                  title="Replace"
                  onClick={() =>
                    openReplaceModal(document)
                  }
                >
                  <Upload size={16} />
                </ActionButton>

                <ActionButton
                  title="Delete"
                  danger
                  onClick={() =>
                    openDeleteModal(document)
                  }
                >
                  <Trash2 size={16} />
                </ActionButton>
              </div>
            </div>
          </div>
        ))}

        {filteredDocuments.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
            <EmptyState />
          </div>
        )}
      </div>

      {/* =====================================================
          ADD / EDIT MODAL
      ===================================================== */}

      {(modal === "add" || modal === "edit") && (
        <Modal
          title={
            modal === "add"
              ? "Upload RAG Document"
              : "Edit Document"
          }
          subtitle={
            modal === "add"
              ? "Add a document to the Railway AI knowledge base."
              : "Update document metadata."
          }
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            {modal === "add" && (
              <FileUploadBox
                fileType={formData.fileType}
                fileSize={formData.fileSize}
                fileName={
                  formData.documentName
                    ? `${formData.documentName}.${formData.fileType.toLowerCase()}`
                    : ""
                }
                onClick={() =>
                  fileInputRef.current?.click()
                }
              />
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />

            <FormSection
              title="Document Information"
              description="Enter the metadata required for the RAG knowledge base."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField
                  label="Document Name"
                  required
                >
                  <input
                    value={formData.documentName}
                    onChange={(e) =>
                      updateField(
                        "documentName",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Railway Passenger Rules"
                    className={inputClass}
                  />
                </FormField>

                <FormField
                  label="Document Type"
                  required
                >
                  <select
                    value={formData.documentType}
                    onChange={(e) =>
                      updateField(
                        "documentType",
                        e.target
                          .value as DocumentType
                      )
                    }
                    className={inputClass}
                  >
                    {documentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Department">
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      updateField(
                        "department",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    {departmentOptions.map(
                      (department) => (
                        <option
                          key={department}
                          value={department}
                        >
                          {department}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField label="Source" required>
                  <input
                    value={formData.source}
                    onChange={(e) =>
                      updateField(
                        "source",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Railway Board"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Document URL">
                  <input
                    value={formData.documentUrl}
                    onChange={(e) =>
                      updateField(
                        "documentUrl",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Language">
                  <select
                    value={formData.language}
                    onChange={(e) =>
                      updateField(
                        "language",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    {languageOptions.map(
                      (language) => (
                        <option
                          key={language}
                          value={language}
                        >
                          {language}
                        </option>
                      )
                    )}
                  </select>
                </FormField>

                <FormField label="Version">
                  <input
                    value={formData.version}
                    onChange={(e) =>
                      updateField(
                        "version",
                        e.target.value
                      )
                    }
                    placeholder="v1.0"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Upload Date">
                  <input
                    type="date"
                    value={formData.uploadDate}
                    onChange={(e) =>
                      updateField(
                        "uploadDate",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              title="Description"
              description="Briefly describe what this document contains."
            >
              <textarea
                value={formData.description}
                onChange={(e) =>
                  updateField(
                    "description",
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Enter document description..."
                className={`${inputClass} resize-none`}
              />
            </FormSection>

            {modal === "edit" && (
              <FormSection
                title="RAG Information"
                description="Current indexing information."
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <InfoBox
                    label="Status"
                    value={
                      <DocumentStatusBadge
                        status={formData.status}
                      />
                    }
                  />

                  <InfoBox
                    label="Chunks"
                    value={formData.chunks}
                  />

                  <InfoBox
                    label="Last Indexed"
                    value={formData.lastIndexed}
                  />
                </div>
              </FormSection>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                onClick={closeModal}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Save size={17} />

                {modal === "add"
                  ? "Upload Document"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {modal === "view" &&
        selectedDocument && (
          <Modal
            title="Document Details"
            subtitle="Complete RAG document information."
            onClose={closeModal}
            size="xl"
          >
            <div className="space-y-6">
              <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <FileTypeIcon
                    type={selectedDocument.fileType}
                    large
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {selectedDocument.documentName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {selectedDocument.documentType}
                    </p>
                  </div>
                </div>

                <DocumentStatusBadge
                  status={selectedDocument.status}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailBox
                  label="Department"
                  value={
                    selectedDocument.department
                  }
                />

                <DetailBox
                  label="Source"
                  value={selectedDocument.source}
                />

                <DetailBox
                  label="Version"
                  value={selectedDocument.version}
                />

                <DetailBox
                  label="Language"
                  value={selectedDocument.language}
                />

                <DetailBox
                  label="File Type"
                  value={selectedDocument.fileType}
                />

                <DetailBox
                  label="File Size"
                  value={selectedDocument.fileSize}
                />

                <DetailBox
                  label="Upload Date"
                  value={selectedDocument.uploadDate}
                />

                <DetailBox
                  label="RAG Chunks"
                  value={
                    selectedDocument.chunks
                      ? String(
                          selectedDocument.chunks
                        )
                      : "Not indexed"
                  }
                />

                <DetailBox
                  label="Last Indexed"
                  value={
                    selectedDocument.lastIndexed
                  }
                />
              </div>

              {selectedDocument.documentUrl && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Document URL
                  </p>

                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-blue-600">
                      {selectedDocument.documentUrl}
                    </span>

                    <button
                      onClick={() =>
                        window.open(
                          selectedDocument.documentUrl,
                          "_blank"
                        )
                      }
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <ExternalLink size={17} />
                    </button>
                  </div>
                </div>
              )}

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Description
                </p>

                <p className="text-sm leading-6 text-slate-700">
                  {selectedDocument.description ||
                    "No description available."}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                    <Database size={19} />
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800">
                      RAG Pipeline
                    </h4>

                    <p className="mt-1 text-xs text-slate-500">
                      Document processing status
                    </p>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-4">
                  <PipelineStep
                    number="1"
                    title="Extract Text"
                    active
                  />

                  <PipelineStep
                    number="2"
                    title="Chunking"
                    active={
                      selectedDocument.chunks > 0
                    }
                  />

                  <PipelineStep
                    number="3"
                    title="Embedding"
                    active={
                      selectedDocument.status ===
                      "Indexed"
                    }
                  />

                  <PipelineStep
                    number="4"
                    title="RAG Database"
                    active={
                      selectedDocument.status ===
                      "Indexed"
                    }
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-5">
                <button
                  onClick={() =>
                    handleReindex(
                      selectedDocument.id
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <RefreshCw size={17} />
                  Re-index
                </button>

                <button
                  onClick={() =>
                    openReplaceModal(
                      selectedDocument
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Upload size={17} />
                  Replace
                </button>

                <button
                  onClick={() =>
                    openEditModal(
                      selectedDocument
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  <Pencil size={17} />
                  Edit Document
                </button>
              </div>
            </div>
          </Modal>
        )}

      {/* =====================================================
          REPLACE MODAL
      ===================================================== */}

      {modal === "replace" &&
        selectedDocument && (
          <Modal
            title="Replace Document"
            subtitle="Upload a new version of this document."
            onClose={closeModal}
            size="lg"
          >
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Current Document
                </p>

                <p className="mt-1 font-semibold text-slate-800">
                  {selectedDocument.documentName}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Current version:{" "}
                  {selectedDocument.version}
                </p>
              </div>

              <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-300 hover:bg-blue-50/50">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <FileUp size={26} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-800">
                  Choose replacement document
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  PDF or DOCX · Maximum size will be
                  controlled by the backend
                </p>

                <span className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white">
                  Select File
                </span>

                <input
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleReplaceFile}
                  className="hidden"
                />
              </label>

              {isUploading && (
                <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                  <RefreshCw
                    size={18}
                    className="animate-spin text-blue-600"
                  />

                  <div>
                    <p className="text-sm font-semibold text-blue-800">
                      Uploading replacement...
                    </p>

                    <p className="mt-1 text-xs text-blue-600">
                      Preparing the new document for
                      indexing.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Modal>
        )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {modal === "delete" &&
        selectedDocument && (
          <Modal
            title="Delete Document"
            subtitle="This action cannot be undone."
            onClose={closeModal}
            size="sm"
          >
            <div className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                <Trash2 size={24} />
              </div>

              <h3 className="mt-4 text-lg font-bold text-slate-900">
                Delete this document?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-700">
                  {selectedDocument.documentName}
                </span>
                ?
              </p>

              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
                <button
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  onClick={handleDelete}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                >
                  <Trash2 size={17} />
                  Delete Document
                </button>
              </div>
            </div>
          </Modal>
        )}
    </div>
  );
}

/* =========================================================
   INPUT
========================================================= */

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

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
   FILE ICON
========================================================= */

function FileTypeIcon({
  type,
  large = false,
}: {
  type: "PDF" | "DOCX";
  large?: boolean;
}) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl ${
        large
          ? "h-14 w-14 rounded-2xl"
          : "h-10 w-10"
      } ${
        type === "PDF"
          ? "bg-red-50 text-red-600"
          : "bg-blue-50 text-blue-600"
      }`}
    >
      <FileText
        size={large ? 25 : 19}
      />
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function DocumentStatusBadge({
  status,
}: {
  status: DocumentStatus;
}) {
  const styles: Record<DocumentStatus, string> = {
    Indexed:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-100",
    Processing:
      "bg-blue-50 text-blue-700 border-blue-100",
    Failed:
      "bg-red-50 text-red-700 border-red-100",
    Archived:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Indexed" && (
        <CheckCircle2 size={12} />
      )}

      {status === "Pending" && (
        <Clock3 size={12} />
      )}

      {status === "Processing" && (
        <RefreshCw
          size={12}
          className="animate-spin"
        />
      )}

      {status === "Failed" && (
        <AlertCircle size={12} />
      )}

      {status}
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
   FILE UPLOAD BOX
========================================================= */

function FileUploadBox({
  fileName,
  fileType,
  fileSize,
  onClick,
}: {
  fileName: string;
  fileType: "PDF" | "DOCX";
  fileSize: string;
  onClick: () => void;
}) {
  return (
    <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
          <Upload size={22} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-slate-800">
            {fileName
              ? fileName
              : "No document selected"}
          </p>

          <p className="mt-1 text-xs text-slate-500">
            {fileName
              ? `${fileType} · ${fileSize}`
              : "Select a PDF or DOCX document to upload."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClick}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <FileUp size={17} />
          Choose File
        </button>
      </div>
    </div>
  );
}

/* =========================================================
   FORM SECTION
========================================================= */

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-bold text-slate-900">
          {title}
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

/* =========================================================
   FORM FIELD
========================================================= */

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      {children}
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
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <div className="mt-1 text-sm font-medium text-slate-700">
        {value}
      </div>
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
   PIPELINE STEP
========================================================= */

function PipelineStep({
  number,
  title,
  active,
}: {
  number: string;
  title: string;
  active: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-3 ${
        active
          ? "border-emerald-100 bg-emerald-50"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-2">
        <div
          className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
            active
              ? "bg-emerald-600 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {active ? (
            <CheckCircle2 size={15} />
          ) : (
            number
          )}
        </div>

        <p
          className={`text-xs font-semibold ${
            active
              ? "text-emerald-700"
              : "text-slate-500"
          }`}
        >
          {title}
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
}: {
  title: string;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"
      }`}
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
        <FileText size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No documents found
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-500">
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

/* =========================================================
   HELPER
========================================================= */

function incrementVersion(
  version: string
) {
  const match = version.match(/v(\d+)\.(\d+)/);

  if (!match) return "v1.0";

  const major = Number(match[1]);
  const minor = Number(match[2]) + 1;

  return `v${major}.${minor}`;
}