"use client";

import { useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  Eye,
  CheckCircle2,
  XCircle,
  Clock3,
  AlertCircle,
  FileText,
  CalendarDays,
  User,
  Building2,
  Languages,
  ExternalLink,
  X,
  Check,
  Ban,
  RefreshCw,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type VerificationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Expired";

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

interface VerificationDocument {
  id: number;
  documentName: string;
  documentType: DocumentType;
  department: string;
  source: string;
  version: string;
  language: string;
  uploadDate: string;
  expiryDate: string;
  fileType: "PDF" | "DOCX";
  fileSize: string;
  status: VerificationStatus;
  verifiedBy: string;
  verifiedDate: string;
  remarks: string;
  documentUrl: string;
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

const departments = [
  "Commercial",
  "Operations",
  "Safety",
  "Engineering",
  "Passenger Services",
  "Security",
  "Administration",
  "IT",
];

/* =========================================================
   DUMMY DATA
========================================================= */

const initialDocuments: VerificationDocument[] = [
  {
    id: 1,
    documentName: "Indian Railway Passenger Rules",
    documentType: "Railway Rules",
    department: "Operations",
    source: "Indian Railways",
    version: "v3.2",
    language: "English",
    uploadDate: "2026-09-28",
    expiryDate: "2027-09-28",
    fileType: "PDF",
    fileSize: "2.4 MB",
    status: "Approved",
    verifiedBy: "Super Admin",
    verifiedDate: "2026-09-28",
    remarks: "Verified against the latest railway circular.",
    documentUrl: "https://example.com/passenger-rules.pdf",
  },
  {
    id: 2,
    documentName: "Passenger Refund Rules 2026",
    documentType: "Refund Rules",
    department: "Commercial",
    source: "Railway Board",
    version: "v2.1",
    language: "English",
    uploadDate: "2026-09-26",
    expiryDate: "2027-03-31",
    fileType: "PDF",
    fileSize: "1.8 MB",
    status: "Pending",
    verifiedBy: "—",
    verifiedDate: "—",
    remarks: "",
    documentUrl: "https://example.com/refund-rules.pdf",
  },
  {
    id: 3,
    documentName: "Passenger Charter of Services",
    documentType: "Passenger Charter",
    department: "Passenger Services",
    source: "Indian Railways",
    version: "v4.0",
    language: "English + Hindi",
    uploadDate: "2026-09-25",
    expiryDate: "2027-09-25",
    fileType: "PDF",
    fileSize: "3.1 MB",
    status: "Approved",
    verifiedBy: "Admin",
    verifiedDate: "2026-09-26",
    remarks: "Document source verified.",
    documentUrl: "https://example.com/passenger-charter.pdf",
  },
  {
    id: 4,
    documentName: "Railway Safety Guidelines",
    documentType: "Safety Guidelines",
    department: "Safety",
    source: "Safety Directorate",
    version: "v5.1",
    language: "English",
    uploadDate: "2026-09-23",
    expiryDate: "2026-12-31",
    fileType: "PDF",
    fileSize: "4.6 MB",
    status: "Pending",
    verifiedBy: "—",
    verifiedDate: "—",
    remarks: "",
    documentUrl: "https://example.com/safety.pdf",
  },
  {
    id: 5,
    documentName: "Station Operating Manual",
    documentType: "Station Rules",
    department: "Operations",
    source: "Operations Directorate",
    version: "v2.4",
    language: "English",
    uploadDate: "2026-09-20",
    expiryDate: "2026-10-15",
    fileType: "PDF",
    fileSize: "5.2 MB",
    status: "Rejected",
    verifiedBy: "Super Admin",
    verifiedDate: "2026-09-21",
    remarks:
      "Document version could not be verified with the supplied source.",
    documentUrl: "https://example.com/station-manual.pdf",
  },
  {
    id: 6,
    documentName: "Luggage and Parcel Rules",
    documentType: "Luggage Rules",
    department: "Commercial",
    source: "Railway Board",
    version: "v3.0",
    language: "English",
    uploadDate: "2026-09-18",
    expiryDate: "2026-09-30",
    fileType: "PDF",
    fileSize: "1.2 MB",
    status: "Expired",
    verifiedBy: "Admin",
    verifiedDate: "2026-09-19",
    remarks: "Document validity period has expired.",
    documentUrl: "https://example.com/luggage-rules.pdf",
  },
  {
    id: 7,
    documentName: "Railway Ticket Booking FAQ",
    documentType: "FAQ",
    department: "Passenger Services",
    source: "Railway Helpdesk",
    version: "v1.8",
    language: "English + Hindi",
    uploadDate: "2026-09-15",
    expiryDate: "2027-09-15",
    fileType: "PDF",
    fileSize: "920 KB",
    status: "Approved",
    verifiedBy: "Admin",
    verifiedDate: "2026-09-16",
    remarks: "FAQ content verified.",
    documentUrl: "https://example.com/ticket-faq.pdf",
  },
];

/* =========================================================
   PAGE
========================================================= */

export default function DocumentVerificationPage() {
  const [documents, setDocuments] =
    useState<VerificationDocument[]>(
      initialDocuments
    );

  const [search, setSearch] = useState("");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showFilters, setShowFilters] =
    useState(false);

  const [selectedDocument, setSelectedDocument] =
    useState<VerificationDocument | null>(null);

  const [modal, setModal] = useState<
    "view" | "approve" | "reject" | null
  >(null);

  const [remarks, setRemarks] = useState("");

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredDocuments = useMemo(() => {
    const query = search.toLowerCase().trim();

    return documents.filter((document) => {
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

  /* =======================================================
     STATS
  ======================================================= */

  const totalDocuments = documents.length;

  const pendingDocuments = documents.filter(
    (document) => document.status === "Pending"
  ).length;

  const approvedDocuments = documents.filter(
    (document) => document.status === "Approved"
  ).length;

  const rejectedDocuments = documents.filter(
    (document) => document.status === "Rejected"
  ).length;

  const expiredDocuments = documents.filter(
    (document) => document.status === "Expired"
  ).length;

  /* =======================================================
     OPEN MODALS
  ======================================================= */

  const openViewModal = (
    document: VerificationDocument
  ) => {
    setSelectedDocument(document);
    setModal("view");
  };

  const openApproveModal = (
    document: VerificationDocument
  ) => {
    setSelectedDocument(document);
    setRemarks("");
    setModal("approve");
  };

  const openRejectModal = (
    document: VerificationDocument
  ) => {
    setSelectedDocument(document);
    setRemarks("");
    setModal("reject");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedDocument(null);
    setRemarks("");
  };

  /* =======================================================
     VERIFY
  ======================================================= */

  const handleVerification = (
    status: "Approved" | "Rejected"
  ) => {
    if (!selectedDocument) return;

    const today = new Date()
      .toISOString()
      .split("T")[0];

    setDocuments((previous) =>
      previous.map((document) =>
        document.id === selectedDocument.id
          ? {
              ...document,
              status,
              verifiedBy: "Admin",
              verifiedDate: today,
              remarks:
                remarks.trim() ||
                (status === "Approved"
                  ? "Document verified and approved."
                  : "Document rejected during verification."),
            }
          : document
      )
    );

    closeModal();
  };

  /* =======================================================
     EXPIRE
  ======================================================= */

  const markExpired = (
    documentId: number
  ) => {
    setDocuments((previous) =>
      previous.map((document) =>
        document.id === documentId
          ? {
              ...document,
              status: "Expired",
            }
          : document
      )
    );
  };

  /* =======================================================
     RESET FILTER
  ======================================================= */

  const resetFilters = () => {
    setSearch("");
    setTypeFilter("All");
    setDepartmentFilter("All");
    setStatusFilter("All");
  };

  return (
    <div className="space-y-6">
      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <ShieldCheck size={16} />

            <span>Admin</span>

            <span>/</span>

            <span className="text-slate-700">
              Document Verification
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Document Verification
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review and verify documents before they
            become trusted Railway AI knowledge sources.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-blue-100 bg-blue-50 px-4 py-2.5">
          <ShieldCheck
            size={18}
            className="text-blue-600"
          />

          <span className="text-sm font-semibold text-blue-700">
            Verification Center
          </span>
        </div>
      </div>

      {/* ===================================================
          SUMMARY
      =================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          title="Total Documents"
          value={totalDocuments}
          icon={FileText}
          description="All submitted documents"
        />

        <SummaryCard
          title="Pending"
          value={pendingDocuments}
          icon={Clock3}
          description="Waiting for review"
        />

        <SummaryCard
          title="Approved"
          value={approvedDocuments}
          icon={CheckCircle2}
          description="Verified documents"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedDocuments}
          icon={XCircle}
          description="Rejected documents"
        />

        <SummaryCard
          title="Expired"
          value={expiredDocuments}
          icon={AlertCircle}
          description="Validity expired"
        />
      </div>

      {/* ===================================================
          SEARCH + FILTER
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
              placeholder="Search document, department, source..."
              className={`${inputClass} pl-10`}
            />
          </div>

          <button
            onClick={() =>
              setShowFilters((value) => !value)
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
            typeFilter !== "All" ||
            departmentFilter !== "All" ||
            statusFilter !== "All") && (
            <button
              onClick={resetFilters}
              className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800"
            >
              Clear
            </button>
          )}
        </div>

        {showFilters && (
          <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-3">
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
                ...departments.map(
                  (department) => ({
                    value: department,
                    label: department,
                  })
                ),
              ]}
            />

            <FilterSelect
              label="Verification Status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                {
                  value: "All",
                  label: "All Status",
                },
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "Approved",
                  label: "Approved",
                },
                {
                  value: "Rejected",
                  label: "Rejected",
                },
                {
                  value: "Expired",
                  label: "Expired",
                },
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
            {filteredDocuments.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {documents.length}
          </span>{" "}
          documents
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
                  Document
                </th>

                <th className={thClass}>
                  Type
                </th>

                <th className={thClass}>
                  Department
                </th>

                <th className={thClass}>
                  Version
                </th>

                <th className={thClass}>
                  Upload Date
                </th>

                <th className={thClass}>
                  Expiry
                </th>

                <th className={thClass}>
                  Status
                </th>

                <th className={thClass}>
                  Verified By
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredDocuments.map(
                (document) => (
                  <tr
                    key={document.id}
                    className="transition hover:bg-slate-50/80"
                  >
                    {/* DOCUMENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <FileIcon
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
                        </div>
                      </div>
                    </td>

                    {/* TYPE */}
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {document.documentType}
                      </span>
                    </td>

                    {/* DEPARTMENT */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Building2
                          size={14}
                          className="text-slate-400"
                        />

                        {document.department}
                      </div>
                    </td>

                    {/* VERSION */}
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                        {document.version}
                      </span>
                    </td>

                    {/* UPLOAD DATE */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-slate-600">
                        <CalendarDays
                          size={14}
                          className="text-slate-400"
                        />

                        {document.uploadDate}
                      </div>
                    </td>

                    {/* EXPIRY */}
                    <td className="px-5 py-4">
                      <span
                        className={
                          isExpiredDate(
                            document.expiryDate
                          )
                            ? "text-sm font-semibold text-red-600"
                            : "text-sm text-slate-600"
                        }
                      >
                        {document.expiryDate}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-5 py-4">
                      <VerificationBadge
                        status={document.status}
                      />
                    </td>

                    {/* VERIFIED BY */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User
                          size={14}
                          className="text-slate-400"
                        />

                        {document.verifiedBy}
                      </div>
                    </td>

                    {/* ACTIONS */}
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton
                          title="View"
                          onClick={() =>
                            openViewModal(
                              document
                            )
                          }
                        >
                          <Eye size={17} />
                        </ActionButton>

                        {document.status ===
                          "Pending" && (
                          <>
                            <ActionButton
                              title="Approve"
                              success
                              onClick={() =>
                                openApproveModal(
                                  document
                                )
                              }
                            >
                              <Check
                                size={17}
                              />
                            </ActionButton>

                            <ActionButton
                              title="Reject"
                              danger
                              onClick={() =>
                                openRejectModal(
                                  document
                                )
                              }
                            >
                              <Ban size={17} />
                            </ActionButton>
                          </>
                        )}

                        {document.status ===
                          "Approved" &&
                          !isExpiredDate(
                            document.expiryDate
                          ) && (
                            <ActionButton
                              title="Mark Expired"
                              danger
                              onClick={() =>
                                markExpired(
                                  document.id
                                )
                              }
                            >
                              <AlertCircle
                                size={17}
                              />
                            </ActionButton>
                          )}
                      </div>
                    </td>
                  </tr>
                )
              )}

              {filteredDocuments.length ===
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
        {filteredDocuments.map(
          (document) => (
            <div
              key={document.id}
              className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <FileIcon
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

                    <VerificationBadge
                      status={document.status}
                    />
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <InfoBox
                      label="Department"
                      value={
                        document.department
                      }
                    />

                    <InfoBox
                      label="Version"
                      value={document.version}
                    />

                    <InfoBox
                      label="Upload"
                      value={
                        document.uploadDate
                      }
                    />

                    <InfoBox
                      label="Expiry"
                      value={
                        document.expiryDate
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                <div className="text-xs text-slate-400">
                  Verified by:{" "}
                  {document.verifiedBy}
                </div>

                <div className="flex gap-1">
                  <ActionButton
                    title="View"
                    onClick={() =>
                      openViewModal(document)
                    }
                  >
                    <Eye size={16} />
                  </ActionButton>

                  {document.status ===
                    "Pending" && (
                    <>
                      <ActionButton
                        title="Approve"
                        success
                        onClick={() =>
                          openApproveModal(
                            document
                          )
                        }
                      >
                        <Check size={16} />
                      </ActionButton>

                      <ActionButton
                        title="Reject"
                        danger
                        onClick={() =>
                          openRejectModal(
                            document
                          )
                        }
                      >
                        <Ban size={16} />
                      </ActionButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        )}

        {filteredDocuments.length ===
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
        selectedDocument && (
          <Modal
            title="Document Verification"
            subtitle="Review complete document information before verification."
            onClose={closeModal}
            size="xl"
          >
            <div className="space-y-6">
              {/* TOP */}
              <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <FileIcon
                    type={
                      selectedDocument.fileType
                    }
                    large
                  />

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {
                        selectedDocument.documentName
                      }
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {
                        selectedDocument.documentType
                      }
                    </p>
                  </div>
                </div>

                <VerificationBadge
                  status={
                    selectedDocument.status
                  }
                />
              </div>

              {/* DETAILS */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <DetailBox
                  label="Department"
                  value={
                    selectedDocument.department
                  }
                />

                <DetailBox
                  label="Source"
                  value={
                    selectedDocument.source
                  }
                />

                <DetailBox
                  label="Version"
                  value={
                    selectedDocument.version
                  }
                />

                <DetailBox
                  label="Language"
                  value={
                    selectedDocument.language
                  }
                />

                <DetailBox
                  label="File Type"
                  value={
                    selectedDocument.fileType
                  }
                />

                <DetailBox
                  label="File Size"
                  value={
                    selectedDocument.fileSize
                  }
                />

                <DetailBox
                  label="Upload Date"
                  value={
                    selectedDocument.uploadDate
                  }
                />

                <DetailBox
                  label="Expiry Date"
                  value={
                    selectedDocument.expiryDate
                  }
                />

                <DetailBox
                  label="Verified By"
                  value={
                    selectedDocument.verifiedBy
                  }
                />

                <DetailBox
                  label="Verified Date"
                  value={
                    selectedDocument.verifiedDate
                  }
                />
              </div>

              {/* URL */}
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Source Document
                </p>

                <div className="flex items-center gap-2">
                  <span className="min-w-0 flex-1 truncate text-sm text-blue-600">
                    {
                      selectedDocument.documentUrl
                    }
                  </span>

                  <button
                    onClick={() =>
                      window.open(
                        selectedDocument.documentUrl,
                        "_blank"
                      )
                    }
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <ExternalLink
                      size={17}
                    />
                  </button>
                </div>
              </div>

              {/* REMARKS */}
              <div className="rounded-xl border border-slate-200 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <MessageSquare
                    size={15}
                    className="text-slate-400"
                  />

                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Verification Remarks
                  </p>
                </div>

                <p className="text-sm leading-6 text-slate-700">
                  {selectedDocument.remarks ||
                    "No verification remarks added."}
                </p>
              </div>

              {/* ACTIONS */}
              {selectedDocument.status ===
                "Pending" && (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                  <button
                    onClick={() =>
                      openRejectModal(
                        selectedDocument
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <XCircle size={17} />
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      openApproveModal(
                        selectedDocument
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    <CheckCircle2
                      size={17}
                    />
                    Approve Document
                  </button>
                </div>
              )}
            </div>
          </Modal>
        )}

      {/* ===================================================
          APPROVE / REJECT MODAL
      =================================================== */}

      {(modal === "approve" ||
        modal === "reject") &&
        selectedDocument && (
          <Modal
            title={
              modal === "approve"
                ? "Approve Document"
                : "Reject Document"
            }
            subtitle={
              modal === "approve"
                ? "Confirm that this document has been verified."
                : "Provide a reason for rejecting this document."
            }
            onClose={closeModal}
            size="sm"
          >
            <div className="space-y-5">
              <div
                className={`rounded-xl border p-4 ${
                  modal === "approve"
                    ? "border-emerald-100 bg-emerald-50"
                    : "border-red-100 bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {modal === "approve" ? (
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                  ) : (
                    <XCircle
                      size={21}
                      className="mt-0.5 shrink-0 text-red-600"
                    />
                  )}

                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {
                        selectedDocument.documentName
                      }
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Version{" "}
                      {
                        selectedDocument.version
                      }{" "}
                      ·{" "}
                      {
                        selectedDocument.documentType
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">
                  Verification Remarks
                  {modal === "reject" && (
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  )}
                </label>

                <textarea
                  value={remarks}
                  onChange={(e) =>
                    setRemarks(e.target.value)
                  }
                  rows={4}
                  placeholder={
                    modal === "approve"
                      ? "Optional verification remarks..."
                      : "Enter the reason for rejection..."
                  }
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
                  onClick={() =>
                    handleVerification(
                      modal === "approve"
                        ? "Approved"
                        : "Rejected"
                    )
                  }
                  disabled={
                    modal === "reject" &&
                    !remarks.trim()
                  }
                  className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 ${
                    modal === "approve"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {modal === "approve" ? (
                    <>
                      <Check size={17} />
                      Approve
                    </>
                  ) : (
                    <>
                      <Ban size={17} />
                      Reject
                    </>
                  )}
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

const thClass =
  "px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500";

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

function FileIcon({
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
        size={large ? 26 : 19}
      />
    </div>
  );
}

function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const styles: Record<
    VerificationStatus,
    string
  > = {
    Pending:
      "border-amber-100 bg-amber-50 text-amber-700",
    Approved:
      "border-emerald-100 bg-emerald-50 text-emerald-700",
    Rejected:
      "border-red-100 bg-red-50 text-red-700",
    Expired:
      "border-slate-200 bg-slate-100 text-slate-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Pending" && (
        <Clock3 size={12} />
      )}

      {status === "Approved" && (
        <CheckCircle2 size={12} />
      )}

      {status === "Rejected" && (
        <XCircle size={12} />
      )}

      {status === "Expired" && (
        <AlertCircle size={12} />
      )}

      {status}
    </span>
  );
}

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
    "text-slate-400 hover:bg-slate-100 hover:text-slate-700";

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

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <FileText size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No documents found
      </h3>

      <p className="mt-1 text-xs text-slate-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

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

function isExpiredDate(
  date: string
) {
  if (!date) return false;

  return (
    new Date(date).getTime() <
    new Date().setHours(0, 0, 0, 0)
  );
}