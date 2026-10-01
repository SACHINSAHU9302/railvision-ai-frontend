"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock3,
  Building2,
  Layers3,
  X,
  Save,
  Navigation,
  Droplets,
  Armchair,
  Accessibility,
  DoorOpen,
  ArrowUpDown,
  ShieldCheck,
} from "lucide-react";

type VerificationStatus = "Verified" | "Pending" | "Rejected";

interface Platform {
  id: number;
  platformId: string;
  stationCode: string;
  platformNumber: number;
  latitude: string;
  longitude: string;

  shelter: boolean;
  bench: boolean;
  drinkingWater: boolean;
  toilet: boolean;
  fobAccess: boolean;
  liftAccess: boolean;
  escalatorAccess: boolean;
  wheelchairAccess: boolean;

  verificationStatus: VerificationStatus;
}

const initialPlatforms: Platform[] = [
  {
    id: 1,
    platformId: "BPL-P01",
    stationCode: "BPL",
    platformNumber: 1,
    latitude: "23.2599",
    longitude: "77.4126",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: true,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 2,
    platformId: "BPL-P02",
    stationCode: "BPL",
    platformNumber: 2,
    latitude: "23.2602",
    longitude: "77.4129",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: false,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 3,
    platformId: "BPL-P03",
    stationCode: "BPL",
    platformNumber: 3,
    latitude: "23.2605",
    longitude: "77.4132",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: false,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: false,
    wheelchairAccess: true,
    verificationStatus: "Pending",
  },
  {
    id: 4,
    platformId: "RKMP-P01",
    stationCode: "RKMP",
    platformNumber: 1,
    latitude: "23.2350",
    longitude: "77.4340",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: true,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 5,
    platformId: "RKMP-P02",
    stationCode: "RKMP",
    platformNumber: 2,
    latitude: "23.2353",
    longitude: "77.4343",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: true,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 6,
    platformId: "INDB-P01",
    stationCode: "INDB",
    platformNumber: 1,
    latitude: "22.7196",
    longitude: "75.8577",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: true,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 7,
    platformId: "INDB-P02",
    stationCode: "INDB",
    platformNumber: 2,
    latitude: "22.7200",
    longitude: "75.8580",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: false,
    wheelchairAccess: true,
    verificationStatus: "Pending",
  },
  {
    id: 8,
    platformId: "UJN-P01",
    stationCode: "UJN",
    platformNumber: 1,
    latitude: "23.1765",
    longitude: "75.7885",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: false,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 9,
    platformId: "UJN-P02",
    stationCode: "UJN",
    platformNumber: 2,
    latitude: "23.1768",
    longitude: "75.7889",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: false,
    fobAccess: true,
    liftAccess: false,
    escalatorAccess: false,
    wheelchairAccess: false,
    verificationStatus: "Rejected",
  },
  {
    id: 10,
    platformId: "JBP-P01",
    stationCode: "JBP",
    platformNumber: 1,
    latitude: "23.1600",
    longitude: "79.9495",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: true,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 11,
    platformId: "JBP-P02",
    stationCode: "JBP",
    platformNumber: 2,
    latitude: "23.1604",
    longitude: "79.9499",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: true,
    escalatorAccess: false,
    wheelchairAccess: true,
    verificationStatus: "Verified",
  },
  {
    id: 12,
    platformId: "ET-P01",
    stationCode: "ET",
    platformNumber: 1,
    latitude: "22.6140",
    longitude: "77.7620",
    shelter: true,
    bench: true,
    drinkingWater: true,
    toilet: true,
    fobAccess: true,
    liftAccess: false,
    escalatorAccess: false,
    wheelchairAccess: true,
    verificationStatus: "Pending",
  },
];

const emptyPlatform: Omit<Platform, "id"> = {
  platformId: "",
  stationCode: "",
  platformNumber: 1,
  latitude: "",
  longitude: "",
  shelter: false,
  bench: false,
  drinkingWater: false,
  toilet: false,
  fobAccess: false,
  liftAccess: false,
  escalatorAccess: false,
  wheelchairAccess: false,
  verificationStatus: "Pending",
};

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100";

export default function PlatformsPage() {
  const [platforms, setPlatforms] =
    useState<Platform[]>(initialPlatforms);

  const [search, setSearch] = useState("");
  const [stationFilter, setStationFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [editingPlatform, setEditingPlatform] =
    useState<Platform | null>(null);

  const [viewingPlatform, setViewingPlatform] =
    useState<Platform | null>(null);

  const [deletingPlatform, setDeletingPlatform] =
    useState<Platform | null>(null);

  const [formData, setFormData] =
    useState<Omit<Platform, "id">>(emptyPlatform);

  const stationCodes = useMemo(() => {
    return Array.from(
      new Set(platforms.map((platform) => platform.stationCode))
    ).sort();
  }, [platforms]);

  const filteredPlatforms = useMemo(() => {
    const query = search.trim().toLowerCase();

    return platforms.filter((platform) => {
      const matchesSearch =
        !query ||
        platform.platformId.toLowerCase().includes(query) ||
        platform.stationCode.toLowerCase().includes(query) ||
        String(platform.platformNumber).includes(query);

      const matchesStation =
        stationFilter === "All" ||
        platform.stationCode === stationFilter;

      const matchesStatus =
        statusFilter === "All" ||
        platform.verificationStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStation &&
        matchesStatus
      );
    });
  }, [
    platforms,
    search,
    stationFilter,
    statusFilter,
  ]);

  const totalPlatforms = platforms.length;

  const verifiedPlatforms = platforms.filter(
    (platform) =>
      platform.verificationStatus === "Verified"
  ).length;

  const pendingPlatforms = platforms.filter(
    (platform) =>
      platform.verificationStatus === "Pending"
  ).length;

  const rejectedPlatforms = platforms.filter(
    (platform) =>
      platform.verificationStatus === "Rejected"
  ).length;

  const openAddModal = () => {
    setEditingPlatform(null);
    setFormData({ ...emptyPlatform });
    setShowModal(true);
  };

  const openEditModal = (platform: Platform) => {
    setEditingPlatform(platform);

    const { id, ...rest } = platform;

    setFormData(rest);
    setShowModal(true);
  };

  const openViewModal = (platform: Platform) => {
    setViewingPlatform(platform);
    setShowViewModal(true);
  };

  const openDeleteModal = (platform: Platform) => {
    setDeletingPlatform(platform);
    setShowDeleteModal(true);
  };

  const handleSave = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (
      !formData.platformId.trim() ||
      !formData.stationCode.trim()
    ) {
      return;
    }

    if (editingPlatform) {
      setPlatforms((current) =>
        current.map((platform) =>
          platform.id === editingPlatform.id
            ? {
                ...formData,
                id: editingPlatform.id,
              }
            : platform
        )
      );
    } else {
      const newPlatform: Platform = {
        ...formData,
        id: Date.now(),
      };

      setPlatforms((current) => [
        newPlatform,
        ...current,
      ]);
    }

    setShowModal(false);
    setEditingPlatform(null);
    setFormData({ ...emptyPlatform });
  };

  const handleDelete = () => {
    if (!deletingPlatform) return;

    setPlatforms((current) =>
      current.filter(
        (platform) =>
          platform.id !== deletingPlatform.id
      )
    );

    setDeletingPlatform(null);
    setShowDeleteModal(false);
  };

  const updateFormField = <
    K extends keyof Omit<Platform, "id">
  >(
    field: K,
    value: Omit<Platform, "id">[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const getStatusStyle = (
    status: VerificationStatus
  ) => {
    if (status === "Verified") {
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    }

    if (status === "Pending") {
      return "border-amber-200 bg-amber-50 text-amber-700";
    }

    return "border-red-200 bg-red-50 text-red-700";
  };

  const getStatusIcon = (
    status: VerificationStatus
  ) => {
    if (status === "Verified") {
      return <CheckCircle2 size={14} />;
    }

    if (status === "Pending") {
      return <Clock3 size={14} />;
    }

    return <XCircle size={14} />;
  };

  const facilityItems = [
    {
      key: "shelter",
      label: "Shelter",
      icon: Building2,
    },
    {
      key: "bench",
      label: "Bench",
      icon: Armchair,
    },
    {
      key: "drinkingWater",
      label: "Drinking Water",
      icon: Droplets,
    },
    {
      key: "toilet",
      label: "Toilet",
      icon: DoorOpen,
    },
    {
      key: "fobAccess",
      label: "FOB Access",
      icon: ArrowUpDown,
    },
    {
      key: "liftAccess",
      label: "Lift Access",
      icon: Accessibility,
    },
    {
      key: "escalatorAccess",
      label: "Escalator Access",
      icon: ArrowUpDown,
    },
    {
      key: "wheelchairAccess",
      label: "Wheelchair Access",
      icon: Accessibility,
    },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Layers3
              size={24}
              className="text-blue-600"
            />

            <h1 className="text-2xl font-bold text-slate-900">
              Platform Management
            </h1>
          </div>

          <p className="mt-1 text-sm text-slate-500">
            Manage station-wise platforms, coordinates,
            facilities and verification.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Add Platform
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Platforms"
          value={totalPlatforms}
          icon={Layers3}
          iconClass="bg-blue-50 text-blue-600"
        />

        <SummaryCard
          title="Verified"
          value={verifiedPlatforms}
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-600"
        />

        <SummaryCard
          title="Pending"
          value={pendingPlatforms}
          icon={Clock3}
          iconClass="bg-amber-50 text-amber-600"
        />

        <SummaryCard
          title="Rejected"
          value={rejectedPlatforms}
          icon={XCircle}
          iconClass="bg-red-50 text-red-600"
        />
      </div>

      {/* Search & Filters */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row">
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search platform ID, station code or platform number..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className={`${inputClass} pl-10`}
            />
          </div>

          <select
            value={stationFilter}
            onChange={(e) =>
              setStationFilter(e.target.value)
            }
            className={`${inputClass} lg:w-48`}
          >
            <option value="All">All Stations</option>

            {stationCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className={`${inputClass} lg:w-44`}
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Platform
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Station
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Coordinates
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Facilities
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Verification
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredPlatforms.map((platform) => (
                <tr
                  key={platform.id}
                  className="transition hover:bg-slate-50/70"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Layers3 size={19} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {platform.platformId}
                        </p>

                        <p className="text-xs text-slate-500">
                          Platform{" "}
                          {platform.platformNumber}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                      {platform.stationCode}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin
                        size={15}
                        className="text-blue-500"
                      />

                      <div>
                        <p>{platform.latitude}</p>
                        <p>{platform.longitude}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {platform.shelter && (
                        <FacilityBadge text="Shelter" />
                      )}

                      {platform.bench && (
                        <FacilityBadge text="Bench" />
                      )}

                      {platform.drinkingWater && (
                        <FacilityBadge text="Water" />
                      )}

                      {platform.toilet && (
                        <FacilityBadge text="Toilet" />
                      )}

                      {platform.fobAccess && (
                        <FacilityBadge text="FOB" />
                      )}

                      {platform.liftAccess && (
                        <FacilityBadge text="Lift" />
                      )}

                      {platform.escalatorAccess && (
                        <FacilityBadge text="Escalator" />
                      )}

                      {platform.wheelchairAccess && (
                        <FacilityBadge text="Wheelchair" />
                      )}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStatusStyle(
                        platform.verificationStatus
                      )}`}
                    >
                      {getStatusIcon(
                        platform.verificationStatus
                      )}

                      {platform.verificationStatus}
                    </span>
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="View"
                        onClick={() =>
                          openViewModal(platform)
                        }
                      >
                        <Eye size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Edit"
                        onClick={() =>
                          openEditModal(platform)
                        }
                      >
                        <Pencil size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Delete"
                        danger
                        onClick={() =>
                          openDeleteModal(platform)
                        }
                      >
                        <Trash2 size={17} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredPlatforms.length === 0 && (
                <EmptyTable />
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="grid gap-4 lg:hidden">
        {filteredPlatforms.map((platform) => (
          <div
            key={platform.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Layers3 size={18} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {platform.platformId}
                  </p>

                  <p className="text-xs text-slate-500">
                    Station {platform.stationCode} ·
                    Platform {platform.platformNumber}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${getStatusStyle(
                  platform.verificationStatus
                )}`}
              >
                {getStatusIcon(
                  platform.verificationStatus
                )}

                {platform.verificationStatus}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoItem
                label="Latitude"
                value={platform.latitude}
              />

              <InfoItem
                label="Longitude"
                value={platform.longitude}
              />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Facilities
              </p>

              <div className="flex flex-wrap gap-1.5">
                {platform.shelter && (
                  <FacilityBadge text="Shelter" />
                )}

                {platform.bench && (
                  <FacilityBadge text="Bench" />
                )}

                {platform.drinkingWater && (
                  <FacilityBadge text="Water" />
                )}

                {platform.toilet && (
                  <FacilityBadge text="Toilet" />
                )}

                {platform.fobAccess && (
                  <FacilityBadge text="FOB" />
                )}

                {platform.liftAccess && (
                  <FacilityBadge text="Lift" />
                )}

                {platform.escalatorAccess && (
                  <FacilityBadge text="Escalator" />
                )}

                {platform.wheelchairAccess && (
                  <FacilityBadge text="Wheelchair" />
                )}
              </div>
            </div>

            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
              <button
                onClick={() =>
                  openViewModal(platform)
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <Eye size={16} />
                View
              </button>

              <button
                onClick={() =>
                  openEditModal(platform)
                }
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                onClick={() =>
                  openDeleteModal(platform)
                }
                className="flex items-center justify-center rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-red-600 hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}

        {filteredPlatforms.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center">
            <Layers3
              size={32}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 font-medium text-slate-700">
              No platforms found
            </p>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {showModal && (
        <Modal
          title={
            editingPlatform
              ? "Edit Platform"
              : "Add New Platform"
          }
          subtitle={
            editingPlatform
              ? "Update platform information and facilities."
              : "Add station-wise platform information."
          }
          onClose={() => setShowModal(false)}
          size="large"
        >
          <form
            onSubmit={handleSave}
            className="space-y-6"
          >
            {/* Platform Details */}
            <div>
              <SectionTitle
                icon={<Layers3 size={17} />}
                title="Platform Details"
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <FormField
                  label="Platform ID"
                  required
                >
                  <input
                    value={formData.platformId}
                    onChange={(e) =>
                      updateFormField(
                        "platformId",
                        e.target.value
                      )
                    }
                    placeholder="e.g. BPL-P01"
                    className={inputClass}
                    required
                  />
                </FormField>

                <FormField
                  label="Station Code"
                  required
                >
                  <select
                    value={formData.stationCode}
                    onChange={(e) =>
                      updateFormField(
                        "stationCode",
                        e.target.value
                      )
                    }
                    className={inputClass}
                    required
                  >
                    <option value="">
                      Select station
                    </option>

                    {stationCodes.map((code) => (
                      <option
                        key={code}
                        value={code}
                      >
                        {code}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Platform Number"
                  required
                >
                  <input
                    type="number"
                    min={1}
                    value={formData.platformNumber}
                    onChange={(e) =>
                      updateFormField(
                        "platformNumber",
                        Number(e.target.value)
                      )
                    }
                    className={inputClass}
                    required
                  />
                </FormField>
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <SectionTitle
                icon={<MapPin size={17} />}
                title="Coordinates"
              />

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <FormField label="Latitude">
                  <input
                    value={formData.latitude}
                    onChange={(e) =>
                      updateFormField(
                        "latitude",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 23.2599"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Longitude">
                  <input
                    value={formData.longitude}
                    onChange={(e) =>
                      updateFormField(
                        "longitude",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 77.4126"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <button
                type="button"
                onClick={() =>
                  alert(
                    "Map coordinate picker will be connected later."
                  )
                }
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
              >
                <Navigation size={15} />
                Update Coordinates
              </button>
            </div>

            {/* Facilities */}
            <div>
              <SectionTitle
                icon={<Building2 size={17} />}
                title="Platform Facilities"
              />

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {facilityItems.map((facility) => {
                  const Icon = facility.icon;

                  const checked = Boolean(
                    formData[facility.key]
                  );

                  return (
                    <label
                      key={facility.key}
                      className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                        checked
                          ? "border-blue-200 bg-blue-50"
                          : "border-slate-200 bg-white hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                          updateFormField(
                            facility.key,
                            e.target.checked
                          )
                        }
                        className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />

                      <Icon
                        size={17}
                        className={
                          checked
                            ? "text-blue-600"
                            : "text-slate-400"
                        }
                      />

                      <span className="text-sm font-medium text-slate-700">
                        {facility.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Verification */}
            <div>
              <SectionTitle
                icon={<ShieldCheck size={17} />}
                title="Verification"
              />

              <div className="mt-4 max-w-sm">
                <FormField label="Verification Status">
                  <select
                    value={
                      formData.verificationStatus
                    }
                    onChange={(e) =>
                      updateFormField(
                        "verificationStatus",
                        e.target
                          .value as VerificationStatus
                      )
                    }
                    className={inputClass}
                  >
                    <option value="Pending">
                      Pending
                    </option>

                    <option value="Verified">
                      Verified
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </FormField>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Save size={17} />

                {editingPlatform
                  ? "Update Platform"
                  : "Save Platform"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {showViewModal && viewingPlatform && (
        <Modal
          title={viewingPlatform.platformId}
          subtitle={`Station ${viewingPlatform.stationCode} · Platform ${viewingPlatform.platformNumber}`}
          onClose={() =>
            setShowViewModal(false)
          }
        >
          <div className="space-y-6">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailBox
                label="Platform ID"
                value={viewingPlatform.platformId}
              />

              <DetailBox
                label="Station Code"
                value={viewingPlatform.stationCode}
              />

              <DetailBox
                label="Platform Number"
                value={String(
                  viewingPlatform.platformNumber
                )}
              />

              <DetailBox
                label="Verification"
                value={
                  viewingPlatform.verificationStatus
                }
              />

              <DetailBox
                label="Latitude"
                value={viewingPlatform.latitude}
              />

              <DetailBox
                label="Longitude"
                value={viewingPlatform.longitude}
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-900">
                Platform Facilities
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {facilityItems.map((facility) => {
                  const enabled =
                    viewingPlatform[
                      facility.key
                    ];

                  return (
                    <div
                      key={facility.key}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 ${
                        enabled
                          ? "border-emerald-200 bg-emerald-50"
                          : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-700">
                        {facility.label}
                      </span>

                      {enabled ? (
                        <CheckCircle2
                          size={17}
                          className="text-emerald-600"
                        />
                      ) : (
                        <XCircle
                          size={17}
                          className="text-slate-400"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 pt-5">
              <button
                onClick={() =>
                  setShowViewModal(false)
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingPlatform && (
        <Modal
          title="Delete Platform"
          subtitle="This action cannot be undone."
          onClose={() =>
            setShowDeleteModal(false)
          }
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Delete {deletingPlatform.platformId}?
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              This platform record will be removed from
              the current admin panel data.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() =>
                  setShowDeleteModal(false)
                }
                className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={handleDelete}
                className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete Platform
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Reusable Components                                                        */
/* -------------------------------------------------------------------------- */

function SummaryCard({
  title,
  value,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function FacilityBadge({
  text,
}: {
  text: string;
}) {
  return (
    <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-600">
      {text}
    </span>
  );
}

function ActionButton({
  children,
  title,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  title: string;
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
          ? "text-red-500 hover:bg-red-50 hover:text-red-600"
          : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-700">
        {value || "—"}
      </p>
    </div>
  );
}

function FormField({
  label,
  required = false,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}

        {required && (
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

function SectionTitle({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
      <div className="text-blue-600">{icon}</div>

      <h3 className="text-sm font-bold text-slate-900">
        {title}
      </h3>
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
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1.5 text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

function EmptyTable() {
  return (
    <tr>
      <td
        colSpan={6}
        className="px-5 py-14 text-center"
      >
        <div className="flex flex-col items-center">
          <Layers3
            size={32}
            className="text-slate-300"
          />

          <p className="mt-3 font-medium text-slate-700">
            No platforms found
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or filters.
          </p>
        </div>
      </td>
    </tr>
  );
}

function Modal({
  title,
  subtitle,
  children,
  onClose,
  size = "medium",
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?: "medium" | "large";
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className={`flex max-h-[92vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ${
          size === "large"
            ? "max-w-4xl"
            : "max-w-lg"
        }`}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            {subtitle && (
              <p className="mt-1 text-sm text-slate-500">
                {subtitle}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          {children}
        </div>
      </div>
    </div>
  );
}