"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Edit3,
  Eye,
  MapPin,
  Plus,
  Search,
  Trash2,
  X,
  TrainFront,
  Map,
  Hash,
  Globe2,
  Navigation,
  Layers3,
} from "lucide-react";

type StationStatus = "Active" | "Inactive" | "Under Maintenance";

interface Station {
  id: number;
  code: string;
  name: string;
  district: string;
  city: string;
  state: string;
  latitude: string;
  longitude: string;
  railwayZone: string;
  division: string;
  platforms: number;
  address: string;
  status: StationStatus;
}

/* ============================================================
   DUMMY DATA
============================================================ */

const initialStations: Station[] = [
  {
    id: 1,
    code: "BPL",
    name: "Bhopal Junction",
    district: "Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    latitude: "23.2599",
    longitude: "77.4126",
    railwayZone: "WCR",
    division: "Bhopal",
    platforms: 6,
    address: "Bhopal Railway Station, Bhopal, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 2,
    code: "RKMP",
    name: "Rani Kamlapati",
    district: "Bhopal",
    city: "Bhopal",
    state: "Madhya Pradesh",
    latitude: "23.2149",
    longitude: "77.4328",
    railwayZone: "WCR",
    division: "Bhopal",
    platforms: 6,
    address: "Habibganj, Bhopal, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 3,
    code: "INDB",
    name: "Indore Junction",
    district: "Indore",
    city: "Indore",
    state: "Madhya Pradesh",
    latitude: "22.7196",
    longitude: "75.8577",
    railwayZone: "WR",
    division: "Ratlam",
    platforms: 6,
    address: "Indore Railway Station, Indore, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 4,
    code: "UJN",
    name: "Ujjain Junction",
    district: "Ujjain",
    city: "Ujjain",
    state: "Madhya Pradesh",
    latitude: "23.1765",
    longitude: "75.7885",
    railwayZone: "WR",
    division: "Ratlam",
    platforms: 8,
    address: "Ujjain Junction, Ujjain, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 5,
    code: "JBP",
    name: "Jabalpur Junction",
    district: "Jabalpur",
    city: "Jabalpur",
    state: "Madhya Pradesh",
    latitude: "23.1685",
    longitude: "79.9339",
    railwayZone: "WCR",
    division: "Jabalpur",
    platforms: 7,
    address: "Jabalpur Railway Station, Jabalpur, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 6,
    code: "ET",
    name: "Itarsi Junction",
    district: "Narmadapuram",
    city: "Itarsi",
    state: "Madhya Pradesh",
    latitude: "22.6123",
    longitude: "77.7627",
    railwayZone: "WCR",
    division: "Bhopal",
    platforms: 8,
    address: "Itarsi Junction, Narmadapuram, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 7,
    code: "KTE",
    name: "Katni Junction",
    district: "Katni",
    city: "Katni",
    state: "Madhya Pradesh",
    latitude: "23.8346",
    longitude: "80.3944",
    railwayZone: "WCR",
    division: "Jabalpur",
    platforms: 6,
    address: "Katni Junction, Katni, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 8,
    code: "STA",
    name: "Satna Junction",
    district: "Satna",
    city: "Satna",
    state: "Madhya Pradesh",
    latitude: "24.5827",
    longitude: "80.8320",
    railwayZone: "WCR",
    division: "Jabalpur",
    platforms: 5,
    address: "Satna Junction, Satna, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 9,
    code: "SGO",
    name: "Saugor Railway Station",
    district: "Sagar",
    city: "Sagar",
    state: "Madhya Pradesh",
    latitude: "23.8388",
    longitude: "78.7378",
    railwayZone: "WCR",
    division: "Jabalpur",
    platforms: 3,
    address: "Sagar Railway Station, Sagar, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 10,
    code: "KNW",
    name: "Khandwa Junction",
    district: "Khandwa",
    city: "Khandwa",
    state: "Madhya Pradesh",
    latitude: "21.8245",
    longitude: "76.3509",
    railwayZone: "CR",
    division: "Bhusawal",
    platforms: 5,
    address: "Khandwa Junction, Khandwa, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 11,
    code: "BAU",
    name: "Burhanpur Railway Station",
    district: "Burhanpur",
    city: "Burhanpur",
    state: "Madhya Pradesh",
    latitude: "21.3097",
    longitude: "76.2307",
    railwayZone: "CR",
    division: "Bhusawal",
    platforms: 3,
    address: "Burhanpur Railway Station, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 12,
    code: "NAD",
    name: "Nagda Junction",
    district: "Ujjain",
    city: "Nagda",
    state: "Madhya Pradesh",
    latitude: "23.4562",
    longitude: "75.4170",
    railwayZone: "WR",
    division: "Ratlam",
    platforms: 5,
    address: "Nagda Junction, Ujjain, Madhya Pradesh",
    status: "Active",
  },
  {
    id: 13,
    code: "REWA",
    name: "Rewa Railway Station",
    district: "Rewa",
    city: "Rewa",
    state: "Madhya Pradesh",
    latitude: "24.5362",
    longitude: "81.3037",
    railwayZone: "WCR",
    division: "Jabalpur",
    platforms: 3,
    address: "Rewa Railway Station, Rewa, Madhya Pradesh",
    status: "Active",
  },
];

/* ============================================================
   PAGE
============================================================ */

export default function StationsPage() {
  const [stations, setStations] =
    useState<Station[]>(initialStations);

  const [search, setSearch] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] =
    useState(false);

  const [isViewModalOpen, setIsViewModalOpen] =
    useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] =
    useState(false);

  const [selectedStation, setSelectedStation] =
    useState<Station | null>(null);

  const [editingStation, setEditingStation] =
    useState<Station | null>(null);

  const filteredStations = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) return stations;

    return stations.filter(
      (station) =>
        station.code.toLowerCase().includes(query) ||
        station.name.toLowerCase().includes(query) ||
        station.city.toLowerCase().includes(query) ||
        station.district.toLowerCase().includes(query) ||
        station.state.toLowerCase().includes(query) ||
        station.railwayZone.toLowerCase().includes(query) ||
        station.division.toLowerCase().includes(query)
    );
  }, [stations, search]);

  /* ==========================================================
     ADD / EDIT
  ========================================================== */

  const handleSaveStation = (station: Station) => {
    if (editingStation) {
      setStations((current) =>
        current.map((item) =>
          item.id === station.id ? station : item
        )
      );
    } else {
      setStations((current) => [
        ...current,
        {
          ...station,
          id: Date.now(),
        },
      ]);
    }

    setIsAddModalOpen(false);
    setEditingStation(null);
  };

  /* ==========================================================
     DELETE
  ========================================================== */

  const handleDelete = () => {
    if (!selectedStation) return;

    setStations((current) =>
      current.filter(
        (station) => station.id !== selectedStation.id
      )
    );

    setSelectedStation(null);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* ======================================================
          PAGE HEADER
      ======================================================= */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Building2 className="h-4 w-4" />
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-700">
              Stations
            </span>
          </div>

          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Station Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage railway stations and their information.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingStation(null);
            setIsAddModalOpen(true);
          }}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#071a33] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          Add Station
        </button>
      </div>

      {/* ======================================================
          SUMMARY
      ======================================================= */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
        <StatCard
          icon={<Building2 className="h-5 w-5" />}
          label="Total Stations"
          value={stations.length}
        />

        <StatCard
          icon={<Layers3 className="h-5 w-5" />}
          label="Total Platforms"
          value={stations.reduce(
            (total, station) =>
              total + station.platforms,
            0
          )}
        />

        <StatCard
          icon={<CheckCircle2 className="h-5 w-5" />}
          label="Active"
          value={
            stations.filter(
              (station) => station.status === "Active"
            ).length
          }
        />

        <StatCard
          icon={<MapPin className="h-5 w-5" />}
          label="Cities"
          value={
            new Set(
              stations.map((station) => station.city)
            ).size
          }
        />
      </div>

      {/* ======================================================
          SEARCH + FILTER
      ======================================================= */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search station code, name, city, district..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing{" "}
            <strong className="text-slate-700">
              {filteredStations.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {stations.length}
            </strong>{" "}
            stations
          </span>
        </div>
      </div>

      {/* ======================================================
          DESKTOP TABLE
      ======================================================= */}
      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Station
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Location
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Zone / Division
                </th>

                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Platforms
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStations.map((station) => (
                <tr
                  key={station.id}
                  className="transition hover:bg-slate-50"
                >
                  {/* Station */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        <TrainFront className="h-5 w-5" />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-900">
                          {station.name}
                        </p>

                        <p className="mt-0.5 text-xs font-medium text-blue-600">
                          {station.code}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {station.city}
                    </p>

                    <p className="text-xs text-slate-500">
                      {station.district},{" "}
                      {station.state}
                    </p>
                  </td>

                  {/* Zone */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-slate-700">
                      {station.railwayZone}
                    </p>

                    <p className="text-xs text-slate-500">
                      {station.division} Division
                    </p>
                  </td>

                  {/* Platforms */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {station.platforms}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={station.status} />
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="View"
                        onClick={() => {
                          setSelectedStation(station);
                          setIsViewModalOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </ActionButton>

                      <ActionButton
                        title="Edit"
                        onClick={() => {
                          setEditingStation(station);
                          setIsAddModalOpen(true);
                        }}
                      >
                        <Edit3 className="h-4 w-4" />
                      </ActionButton>

                      <ActionButton
                        title="Delete"
                        danger
                        onClick={() => {
                          setSelectedStation(station);
                          setIsDeleteModalOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStations.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* ======================================================
          MOBILE / TABLET CARDS
      ======================================================= */}
      <div className="grid gap-3 lg:hidden">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <TrainFront className="h-5 w-5" />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {station.name}
                  </h3>

                  <p className="text-xs font-semibold text-blue-600">
                    {station.code}
                  </p>
                </div>
              </div>

              <StatusBadge status={station.status} />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
              <InfoItem
                label="City"
                value={station.city}
              />

              <InfoItem
                label="District"
                value={station.district}
              />

              <InfoItem
                label="Zone"
                value={station.railwayZone}
              />

              <InfoItem
                label="Division"
                value={station.division}
              />

              <InfoItem
                label="Platforms"
                value={String(station.platforms)}
              />

              <InfoItem
                label="Coordinates"
                value={`${station.latitude}, ${station.longitude}`}
              />
            </div>

            <div className="mt-4 flex gap-2 border-t border-slate-100 pt-3">
              <MobileAction
                onClick={() => {
                  setSelectedStation(station);
                  setIsViewModalOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
                View
              </MobileAction>

              <MobileAction
                onClick={() => {
                  setEditingStation(station);
                  setIsAddModalOpen(true);
                }}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </MobileAction>

              <MobileAction
                danger
                onClick={() => {
                  setSelectedStation(station);
                  setIsDeleteModalOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </MobileAction>
            </div>
          </div>
        ))}

        {filteredStations.length === 0 && (
          <EmptyState />
        )}
      </div>

      {/* ======================================================
          ADD / EDIT MODAL
      ======================================================= */}
      {isAddModalOpen && (
        <StationFormModal
          station={editingStation}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingStation(null);
          }}
          onSave={handleSaveStation}
        />
      )}

      {/* ======================================================
          VIEW MODAL
      ======================================================= */}
      {isViewModalOpen && selectedStation && (
        <ViewStationModal
          station={selectedStation}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedStation(null);
          }}
        />
      )}

      {/* ======================================================
          DELETE MODAL
      ======================================================= */}
      {isDeleteModalOpen && selectedStation && (
        <DeleteModal
          station={selectedStation}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedStation(null);
          }}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

/* ============================================================
   STAT CARD
============================================================ */

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-xs font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   STATUS BADGE
============================================================ */

function StatusBadge({
  status,
}: {
  status: StationStatus;
}) {
  const styles = {
    Active: "bg-green-50 text-green-700 border-green-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
    "Under Maintenance":
      "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full border px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ============================================================
   ACTION BUTTON
============================================================ */

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
      className={`flex h-8 w-8 items-center justify-center rounded-md transition ${
        danger
          ? "text-slate-400 hover:bg-red-50 hover:text-red-600"
          : "text-slate-400 hover:bg-blue-50 hover:text-blue-600"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   MOBILE ACTION
============================================================ */

function MobileAction({
  children,
  onClick,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg border text-xs font-medium transition ${
        danger
          ? "border-red-100 text-red-600 hover:bg-red-50"
          : "border-slate-200 text-slate-600 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

/* ============================================================
   INFO ITEM
============================================================ */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-sm font-medium text-slate-700">
        {value}
      </p>
    </div>
  );
}

/* ============================================================
   EMPTY STATE
============================================================ */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <Search className="h-5 w-5 text-slate-400" />
      </div>

      <h3 className="mt-4 text-sm font-semibold text-slate-900">
        No stations found
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        Try changing your search query.
      </p>
    </div>
  );
}

/* ============================================================
   STATION FORM MODAL
============================================================ */

function StationFormModal({
  station,
  onClose,
  onSave,
}: {
  station: Station | null;
  onClose: () => void;
  onSave: (station: Station) => void;
}) {
  const [form, setForm] = useState<Station>(
    station ?? {
      id: 0,
      code: "",
      name: "",
      district: "",
      city: "",
      state: "Madhya Pradesh",
      latitude: "",
      longitude: "",
      railwayZone: "",
      division: "",
      platforms: 0,
      address: "",
      status: "Active",
    }
  );

  const [error, setError] = useState("");

  const updateField = <K extends keyof Station>(
    field: K,
    value: Station[K]
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.code.trim()) {
      setError("Station code is required.");
      return;
    }

    if (!form.name.trim()) {
      setError("Station name is required.");
      return;
    }

    if (!form.city.trim()) {
      setError("City is required.");
      return;
    }

    if (!form.latitude.trim()) {
      setError("Latitude is required.");
      return;
    }

    if (!form.longitude.trim()) {
      setError("Longitude is required.");
      return;
    }

    onSave({
      ...form,
      code: form.code.trim().toUpperCase(),
      name: form.name.trim(),
      district: form.district.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      railwayZone: form.railwayZone.trim(),
      division: form.division.trim(),
      address: form.address.trim(),
      platforms: Number(form.platforms),
    });
  };

  return (
    <ModalShell
      title={station ? "Edit Station" : "Add Station"}
      subtitle={
        station
          ? "Update station information."
          : "Add a new railway station."
      }
      onClose={onClose}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <FormInput
            label="Station Code"
            value={form.code}
            onChange={(value) =>
              updateField("code", value)
            }
            placeholder="e.g. BPL"
            icon={<Hash className="h-4 w-4" />}
          />

          <FormInput
            label="Station Name"
            value={form.name}
            onChange={(value) =>
              updateField("name", value)
            }
            placeholder="e.g. Bhopal Junction"
            icon={<TrainFront className="h-4 w-4" />}
          />

          <FormInput
            label="District"
            value={form.district}
            onChange={(value) =>
              updateField("district", value)
            }
            placeholder="District"
            icon={<MapPin className="h-4 w-4" />}
          />

          <FormInput
            label="City"
            value={form.city}
            onChange={(value) =>
              updateField("city", value)
            }
            placeholder="City"
            icon={<Building2 className="h-4 w-4" />}
          />

          <FormInput
            label="State"
            value={form.state}
            onChange={(value) =>
              updateField("state", value)
            }
            placeholder="State"
            icon={<Globe2 className="h-4 w-4" />}
          />

          <FormInput
            label="Railway Zone"
            value={form.railwayZone}
            onChange={(value) =>
              updateField("railwayZone", value)
            }
            placeholder="e.g. WCR"
            icon={<TrainFront className="h-4 w-4" />}
          />

          <FormInput
            label="Division"
            value={form.division}
            onChange={(value) =>
              updateField("division", value)
            }
            placeholder="e.g. Bhopal"
            icon={<Layers3 className="h-4 w-4" />}
          />

          <FormInput
            label="Number of Platforms"
            type="number"
            value={String(form.platforms)}
            onChange={(value) =>
              updateField("platforms", Number(value))
            }
            placeholder="e.g. 6"
            icon={<Layers3 className="h-4 w-4" />}
          />

          <FormInput
            label="Latitude"
            value={form.latitude}
            onChange={(value) =>
              updateField("latitude", value)
            }
            placeholder="e.g. 23.2599"
            icon={<Navigation className="h-4 w-4" />}
          />

          <FormInput
            label="Longitude"
            value={form.longitude}
            onChange={(value) =>
              updateField("longitude", value)
            }
            placeholder="e.g. 77.4126"
            icon={<Navigation className="h-4 w-4" />}
          />

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Station Status
            </label>

            <select
              value={form.status}
              onChange={(e) =>
                updateField(
                  "status",
                  e.target.value as StationStatus
                )
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Under Maintenance">
                Under Maintenance
              </option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Address
            </label>

            <textarea
              value={form.address}
              onChange={(e) =>
                updateField("address", e.target.value)
              }
              rows={3}
              placeholder="Enter complete station address"
              className="w-full resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg border border-slate-200 px-5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            className="h-10 rounded-lg bg-[#071a33] px-5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            {station ? "Update Station" : "Add Station"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

/* ============================================================
   FORM INPUT
============================================================ */

function FormInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
        />
      </div>
    </div>
  );
}

/* ============================================================
   VIEW MODAL
============================================================ */

function ViewStationModal({
  station,
  onClose,
}: {
  station: Station;
  onClose: () => void;
}) {
  return (
    <ModalShell
      title="Station Details"
      subtitle={`${station.name} (${station.code})`}
      onClose={onClose}
    >
      <div className="space-y-5">
        {/* Station header */}
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <TrainFront className="h-6 w-6" />
          </div>

          <div>
            <h3 className="font-bold text-slate-900">
              {station.name}
            </h3>

            <p className="text-sm font-semibold text-blue-600">
              {station.code}
            </p>
          </div>

          <div className="ml-auto">
            <StatusBadge status={station.status} />
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-4 sm:grid-cols-2">
          <DetailItem
            label="District"
            value={station.district}
          />

          <DetailItem
            label="City"
            value={station.city}
          />

          <DetailItem
            label="State"
            value={station.state}
          />

          <DetailItem
            label="Railway Zone"
            value={station.railwayZone}
          />

          <DetailItem
            label="Division"
            value={station.division}
          />

          <DetailItem
            label="Number of Platforms"
            value={String(station.platforms)}
          />

          <DetailItem
            label="Latitude"
            value={station.latitude}
          />

          <DetailItem
            label="Longitude"
            value={station.longitude}
          />

          <div className="sm:col-span-2">
            <DetailItem
              label="Address"
              value={station.address}
            />
          </div>
        </div>

        {/* Coordinates */}
        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex items-center gap-2">
            <Map className="h-4 w-4 text-blue-600" />

            <p className="text-sm font-semibold text-slate-800">
              Map Coordinates
            </p>
          </div>

          <p className="mt-2 text-sm text-slate-600">
            {station.latitude}, {station.longitude}
          </p>
        </div>

        <button
          onClick={onClose}
          className="h-10 w-full rounded-lg bg-[#071a33] text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          Close
        </button>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   DETAIL ITEM
============================================================ */

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-medium text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}

/* ============================================================
   DELETE MODAL
============================================================ */

function DeleteModal({
  station,
  onClose,
  onDelete,
}: {
  station: Station;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <ModalShell
      title="Delete Station"
      subtitle="This action cannot be undone."
      onClose={onClose}
      small
    >
      <div className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <Trash2 className="h-5 w-5 text-red-600" />
        </div>

        <p className="mt-4 text-sm text-slate-600">
          Are you sure you want to delete
          <strong className="text-slate-900">
            {" "}
            {station.name}
          </strong>
          ?
        </p>

        <div className="mt-5 flex gap-2">
          <button
            onClick={onClose}
            className="h-10 flex-1 rounded-lg border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="h-10 flex-1 rounded-lg bg-red-600 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ============================================================
   MODAL SHELL
============================================================ */

function ModalShell({
  children,
  title,
  subtitle,
  onClose,
  small = false,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  onClose: () => void;
  small?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
      <div
        className={`max-h-[92vh] w-full overflow-y-auto rounded-2xl bg-white shadow-2xl ${
          small ? "max-w-md" : "max-w-3xl"
        }`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {title}
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}