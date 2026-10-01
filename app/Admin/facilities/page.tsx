"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  MapPin,
  Building2,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ChevronDown,
  Navigation,
  Accessibility,
  Save,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type Availability = "Available" | "Unavailable" | "Temporarily Closed";

type AccessibilityStatus = "Accessible" | "Partially Accessible" | "Not Accessible";

type VerificationStatus = "Verified" | "Pending" | "Rejected";

interface Facility {
  id: number;
  station: string;
  stationCode: string;
  facilityType: string;
  facilityName: string;
  platform: string;
  location: string;
  latitude: string;
  longitude: string;
  availability: Availability;
  accessibility: AccessibilityStatus;
  openingTime: string;
  closingTime: string;
  description: string;
  source: string;
  verificationStatus: VerificationStatus;
  lastVerified: string;
}

/* =========================================================
   CONSTANTS
========================================================= */

const stationOptions = [
  { name: "Bhopal Junction", code: "BPL" },
  { name: "Rani Kamlapati", code: "RKMP" },
  { name: "Indore Junction", code: "INDB" },
  { name: "Ujjain Junction", code: "UJN" },
  { name: "Jabalpur Junction", code: "JBP" },
  { name: "Itarsi Junction", code: "ET" },
  { name: "Katni Junction", code: "KTE" },
  { name: "Satna Junction", code: "STA" },
  { name: "Saugor Railway Station", code: "SGO" },
  { name: "Khandwa Junction", code: "KNW" },
  { name: "Burhanpur Railway Station", code: "BAU" },
  { name: "Nagda Junction", code: "NAD" },
  { name: "Rewa Railway Station", code: "REWA" },
];

const facilityTypes = [
  "Toilet",
  "Accessible Toilet",
  "Drinking Water",
  "Waiting Room",
  "AC Waiting Room",
  "Ticket Counter",
  "Reservation Counter",
  "Food",
  "Restaurant",
  "ATM",
  "Parking",
  "Medical",
  "First Aid",
  "RPF",
  "GRP",
  "Help Desk",
  "Wheelchair",
  "Lift",
  "Escalator",
  "FOB",
  "Stairs",
  "Ramp",
  "Footway",
  "Entry",
  "Exit",
  "Wi-Fi",
  "Charging Point",
];

/* =========================================================
   DUMMY DATA
========================================================= */

const initialFacilities: Facility[] = [
  {
    id: 1,
    station: "Bhopal Junction",
    stationCode: "BPL",
    facilityType: "Drinking Water",
    facilityName: "Platform 1 Drinking Water",
    platform: "Platform 1",
    location: "Near Waiting Area",
    latitude: "23.2699",
    longitude: "77.4126",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "00:00",
    closingTime: "23:59",
    description: "Drinking water facility near the main waiting area.",
    source: "Station Survey",
    verificationStatus: "Verified",
    lastVerified: "2026-09-28",
  },
  {
    id: 2,
    station: "Bhopal Junction",
    stationCode: "BPL",
    facilityType: "Toilet",
    facilityName: "Platform 1 General Toilet",
    platform: "Platform 1",
    location: "Near FOB",
    latitude: "23.2702",
    longitude: "77.4131",
    availability: "Available",
    accessibility: "Partially Accessible",
    openingTime: "00:00",
    closingTime: "23:59",
    description: "General passenger toilet facility.",
    source: "Station Survey",
    verificationStatus: "Verified",
    lastVerified: "2026-09-27",
  },
  {
    id: 3,
    station: "Bhopal Junction",
    stationCode: "BPL",
    facilityType: "Lift",
    facilityName: "Main FOB Lift",
    platform: "Platform 2",
    location: "FOB Entrance",
    latitude: "23.2705",
    longitude: "77.4137",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "05:00",
    closingTime: "23:00",
    description: "Passenger lift connecting platform with foot over bridge.",
    source: "Railway Inspection",
    verificationStatus: "Verified",
    lastVerified: "2026-09-25",
  },
  {
    id: 4,
    station: "Rani Kamlapati",
    stationCode: "RKMP",
    facilityType: "Waiting Room",
    facilityName: "General Waiting Hall",
    platform: "Concourse",
    location: "Main Concourse",
    latitude: "23.2266",
    longitude: "77.4330",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "05:00",
    closingTime: "23:30",
    description: "General passenger waiting facility.",
    source: "Station Survey",
    verificationStatus: "Verified",
    lastVerified: "2026-09-26",
  },
  {
    id: 5,
    station: "Rani Kamlapati",
    stationCode: "RKMP",
    facilityType: "Wi-Fi",
    facilityName: "Station Free Wi-Fi",
    platform: "All Platforms",
    location: "Station Wide",
    latitude: "23.2268",
    longitude: "77.4335",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "00:00",
    closingTime: "23:59",
    description: "Free passenger Wi-Fi service.",
    source: "Station Survey",
    verificationStatus: "Pending",
    lastVerified: "2026-09-20",
  },
  {
    id: 6,
    station: "Indore Junction",
    stationCode: "INDB",
    facilityType: "Food",
    facilityName: "Passenger Food Counter",
    platform: "Platform 1",
    location: "Near Main Entrance",
    latitude: "22.7177",
    longitude: "75.8681",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "06:00",
    closingTime: "22:00",
    description: "Food and refreshments counter for passengers.",
    source: "Station Survey",
    verificationStatus: "Verified",
    lastVerified: "2026-09-24",
  },
  {
    id: 7,
    station: "Indore Junction",
    stationCode: "INDB",
    facilityType: "ATM",
    facilityName: "Passenger ATM",
    platform: "Concourse",
    location: "Main Concourse",
    latitude: "22.7179",
    longitude: "75.8685",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "00:00",
    closingTime: "23:59",
    description: "ATM facility available inside the station.",
    source: "Station Survey",
    verificationStatus: "Pending",
    lastVerified: "2026-09-21",
  },
  {
    id: 8,
    station: "Ujjain Junction",
    stationCode: "UJN",
    facilityType: "Help Desk",
    facilityName: "Passenger Help Desk",
    platform: "Concourse",
    location: "Main Entrance",
    latitude: "23.1765",
    longitude: "75.7885",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "06:00",
    closingTime: "22:00",
    description: "Passenger assistance and information desk.",
    source: "Railway Inspection",
    verificationStatus: "Verified",
    lastVerified: "2026-09-23",
  },
  {
    id: 9,
    station: "Jabalpur Junction",
    stationCode: "JBP",
    facilityType: "Wheelchair",
    facilityName: "Passenger Wheelchair Service",
    platform: "Platform 1",
    location: "Help Desk",
    latitude: "23.1670",
    longitude: "79.9500",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "06:00",
    closingTime: "22:00",
    description: "Wheelchair assistance for passengers requiring mobility support.",
    source: "Station Survey",
    verificationStatus: "Pending",
    lastVerified: "2026-09-18",
  },
  {
    id: 10,
    station: "Itarsi Junction",
    stationCode: "ET",
    facilityType: "Escalator",
    facilityName: "Platform Escalator",
    platform: "Platform 3",
    location: "FOB Access",
    latitude: "22.6120",
    longitude: "77.7620",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "05:00",
    closingTime: "23:00",
    description: "Escalator providing access between platform and FOB.",
    source: "Railway Inspection",
    verificationStatus: "Verified",
    lastVerified: "2026-09-22",
  },
  {
    id: 11,
    station: "Satna Junction",
    stationCode: "STA",
    facilityType: "Parking",
    facilityName: "Main Passenger Parking",
    platform: "Station Area",
    location: "Main Entrance",
    latitude: "24.5761",
    longitude: "80.8270",
    availability: "Available",
    accessibility: "Partially Accessible",
    openingTime: "05:00",
    closingTime: "23:00",
    description: "Passenger vehicle parking facility.",
    source: "Station Survey",
    verificationStatus: "Pending",
    lastVerified: "2026-09-17",
  },
  {
    id: 12,
    station: "Khandwa Junction",
    stationCode: "KNW",
    facilityType: "Charging Point",
    facilityName: "Passenger Mobile Charging",
    platform: "Platform 2",
    location: "Waiting Area",
    latitude: "21.8240",
    longitude: "76.3500",
    availability: "Available",
    accessibility: "Accessible",
    openingTime: "00:00",
    closingTime: "23:59",
    description: "Mobile charging points for passengers.",
    source: "Station Survey",
    verificationStatus: "Verified",
    lastVerified: "2026-09-19",
  },
];

/* =========================================================
   EMPTY FORM
========================================================= */

const emptyFacility: Facility = {
  id: 0,
  station: "Bhopal Junction",
  stationCode: "BPL",
  facilityType: "Toilet",
  facilityName: "",
  platform: "",
  location: "",
  latitude: "",
  longitude: "",
  availability: "Available",
  accessibility: "Accessible",
  openingTime: "06:00",
  closingTime: "22:00",
  description: "",
  source: "",
  verificationStatus: "Pending",
  lastVerified: new Date().toISOString().split("T")[0],
};

/* =========================================================
   PAGE
========================================================= */

export default function FacilityManagementPage() {
  const [facilities, setFacilities] =
    useState<Facility[]>(initialFacilities);

  const [search, setSearch] = useState("");
  const [stationFilter, setStationFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showFilters, setShowFilters] = useState(false);

  const [modal, setModal] = useState<
    "add" | "edit" | "view" | "delete" | null
  >(null);

  const [selectedFacility, setSelectedFacility] =
    useState<Facility | null>(null);

  const [formData, setFormData] =
    useState<Facility>(emptyFacility);

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredFacilities = useMemo(() => {
    return facilities.filter((facility) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        facility.facilityName.toLowerCase().includes(query) ||
        facility.facilityType.toLowerCase().includes(query) ||
        facility.station.toLowerCase().includes(query) ||
        facility.stationCode.toLowerCase().includes(query) ||
        facility.location.toLowerCase().includes(query);

      const matchesStation =
        stationFilter === "All" ||
        facility.stationCode === stationFilter;

      const matchesType =
        typeFilter === "All" ||
        facility.facilityType === typeFilter;

      const matchesStatus =
        statusFilter === "All" ||
        facility.verificationStatus === statusFilter;

      return (
        matchesSearch &&
        matchesStation &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    facilities,
    search,
    stationFilter,
    typeFilter,
    statusFilter,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const totalFacilities = facilities.length;

  const availableFacilities = facilities.filter(
    (item) => item.availability === "Available"
  ).length;

  const pendingFacilities = facilities.filter(
    (item) => item.verificationStatus === "Pending"
  ).length;

  const verifiedFacilities = facilities.filter(
    (item) => item.verificationStatus === "Verified"
  ).length;

  /* =========================================================
     OPEN MODALS
  ========================================================= */

  const openAddModal = () => {
    setFormData({
      ...emptyFacility,
      lastVerified: new Date().toISOString().split("T")[0],
    });

    setSelectedFacility(null);
    setModal("add");
  };

  const openEditModal = (facility: Facility) => {
    setSelectedFacility(facility);
    setFormData(facility);
    setModal("edit");
  };

  const openViewModal = (facility: Facility) => {
    setSelectedFacility(facility);
    setModal("view");
  };

  const openDeleteModal = (facility: Facility) => {
    setSelectedFacility(facility);
    setModal("delete");
  };

  const closeModal = () => {
    setModal(null);
    setSelectedFacility(null);
  };

  /* =========================================================
     FORM CHANGE
  ========================================================= */

  const updateField = <K extends keyof Facility>(
    key: K,
    value: Facility[K]
  ) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleStationChange = (value: string) => {
    const selected = stationOptions.find(
      (station) => station.name === value
    );

    setFormData((prev) => ({
      ...prev,
      station: value,
      stationCode: selected?.code || "",
    }));
  };

  /* =========================================================
     ADD / EDIT
  ========================================================= */

  const handleSave = () => {
    if (
      !formData.station ||
      !formData.facilityName.trim() ||
      !formData.facilityType ||
      !formData.location.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (modal === "add") {
      const newFacility: Facility = {
        ...formData,
        id: Date.now(),
      };

      setFacilities((prev) => [newFacility, ...prev]);
    }

    if (modal === "edit") {
      setFacilities((prev) =>
        prev.map((facility) =>
          facility.id === formData.id
            ? formData
            : facility
        )
      );
    }

    closeModal();
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = () => {
    if (!selectedFacility) return;

    setFacilities((prev) =>
      prev.filter(
        (facility) =>
          facility.id !== selectedFacility.id
      )
    );

    closeModal();
  };

  /* =========================================================
     RESET FILTERS
  ========================================================= */

  const resetFilters = () => {
    setSearch("");
    setStationFilter("All");
    setTypeFilter("All");
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
            <Building2 size={16} />
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-700">
              Facility Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Facility Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage station facilities, accessibility and
            verification records.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={18} />
          Add Facility
        </button>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Facilities"
          value={totalFacilities}
          icon={Building2}
          description="All facility records"
        />

        <SummaryCard
          title="Available"
          value={availableFacilities}
          icon={CheckCircle2}
          description="Currently available"
        />

        <SummaryCard
          title="Pending Verification"
          value={pendingFacilities}
          icon={Clock3}
          description="Awaiting verification"
        />

        <SummaryCard
          title="Verified"
          value={verifiedFacilities}
          icon={CheckCircle2}
          description="Verified records"
        />
      </div>

      {/* =====================================================
          SEARCH + FILTERS
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
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search facility, station, type, location..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <button
            onClick={() => setShowFilters((prev) => !prev)}
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
            stationFilter !== "All" ||
            typeFilter !== "All" ||
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
              label="Station"
              value={stationFilter}
              onChange={setStationFilter}
              options={[
                { value: "All", label: "All Stations" },
                ...stationOptions.map((station) => ({
                  value: station.code,
                  label: `${station.name} (${station.code})`,
                })),
              ]}
            />

            <FilterSelect
              label="Facility Type"
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { value: "All", label: "All Facility Types" },
                ...facilityTypes.map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
            />

            <FilterSelect
              label="Verification"
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                {
                  value: "All",
                  label: "All Verification Status",
                },
                {
                  value: "Verified",
                  label: "Verified",
                },
                {
                  value: "Pending",
                  label: "Pending",
                },
                {
                  value: "Rejected",
                  label: "Rejected",
                },
              ]}
            />
          </div>
        )}
      </div>

      {/* =====================================================
          RESULT COUNT
      ===================================================== */}

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Showing{" "}
          <span className="font-semibold text-slate-800">
            {filteredFacilities.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-slate-800">
            {facilities.length}
          </span>{" "}
          facilities
        </p>
      </div>

      {/* =====================================================
          DESKTOP TABLE
      ===================================================== */}

      <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Facility
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Station
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Platform
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Availability
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Accessibility
                </th>

                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Verification
                </th>

                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredFacilities.map((facility) => (
                <tr
                  key={facility.id}
                  className="transition hover:bg-slate-50/80"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Building2 size={19} />
                      </div>

                      <div>
                        <p className="font-semibold text-slate-800">
                          {facility.facilityName}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-500">
                          {facility.facilityType}
                        </p>

                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                          <MapPin size={12} />
                          {facility.location}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-800">
                      {facility.station}
                    </p>

                    <p className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                      {facility.stationCode}
                    </p>
                  </td>

                  <td className="px-5 py-4 text-sm text-slate-600">
                    {facility.platform || "—"}
                  </td>

                  <td className="px-5 py-4">
                    <AvailabilityBadge
                      status={facility.availability}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <AccessibilityBadge
                      status={facility.accessibility}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <VerificationBadge
                      status={facility.verificationStatus}
                    />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-1">
                      <ActionButton
                        title="View"
                        onClick={() =>
                          openViewModal(facility)
                        }
                      >
                        <Eye size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Edit"
                        onClick={() =>
                          openEditModal(facility)
                        }
                      >
                        <Pencil size={17} />
                      </ActionButton>

                      <ActionButton
                        title="Delete"
                        danger
                        onClick={() =>
                          openDeleteModal(facility)
                        }
                      >
                        <Trash2 size={17} />
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredFacilities.length === 0 && (
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

      {/* =====================================================
          MOBILE / TABLET CARDS
      ===================================================== */}

      <div className="grid gap-4 lg:hidden">
        {filteredFacilities.map((facility) => (
          <div
            key={facility.id}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Building2 size={19} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-800">
                    {facility.facilityName}
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {facility.facilityType}
                  </p>

                  <div className="mt-2 flex items-center gap-1 text-xs text-slate-400">
                    <MapPin size={12} />
                    <span>{facility.location}</span>
                  </div>
                </div>
              </div>

              <span className="shrink-0 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                {facility.stationCode}
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <InfoBox
                label="Station"
                value={facility.station}
              />

              <InfoBox
                label="Platform"
                value={facility.platform || "—"}
              />

              <InfoBox
                label="Availability"
                value={
                  <AvailabilityBadge
                    status={facility.availability}
                  />
                }
              />

              <InfoBox
                label="Accessibility"
                value={
                  <AccessibilityBadge
                    status={facility.accessibility}
                  />
                }
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <VerificationBadge
                status={facility.verificationStatus}
              />

              <div className="flex gap-1">
                <ActionButton
                  title="View"
                  onClick={() =>
                    openViewModal(facility)
                  }
                >
                  <Eye size={16} />
                </ActionButton>

                <ActionButton
                  title="Edit"
                  onClick={() =>
                    openEditModal(facility)
                  }
                >
                  <Pencil size={16} />
                </ActionButton>

                <ActionButton
                  title="Delete"
                  danger
                  onClick={() =>
                    openDeleteModal(facility)
                  }
                >
                  <Trash2 size={16} />
                </ActionButton>
              </div>
            </div>
          </div>
        ))}

        {filteredFacilities.length === 0 && (
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
              ? "Add Facility"
              : "Edit Facility"
          }
          subtitle={
            modal === "add"
              ? "Create a new station facility record."
              : "Update facility information and verification."
          }
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            {/* BASIC INFORMATION */}

            <FormSection
              title="Basic Information"
              description="Enter the basic facility details."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Station" required>
                  <select
                    value={formData.station}
                    onChange={(e) =>
                      handleStationChange(e.target.value)
                    }
                    className={inputClass}
                  >
                    {stationOptions.map((station) => (
                      <option
                        key={station.code}
                        value={station.name}
                      >
                        {station.name} ({station.code})
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Facility Type"
                  required
                >
                  <select
                    value={formData.facilityType}
                    onChange={(e) =>
                      updateField(
                        "facilityType",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    {facilityTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField
                  label="Facility Name"
                  required
                >
                  <input
                    value={formData.facilityName}
                    onChange={(e) =>
                      updateField(
                        "facilityName",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Platform 1 Drinking Water"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Platform">
                  <input
                    value={formData.platform}
                    onChange={(e) =>
                      updateField(
                        "platform",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Platform 1"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Location" required>
                  <input
                    value={formData.location}
                    onChange={(e) =>
                      updateField(
                        "location",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Near Main Entrance"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Source">
                  <input
                    value={formData.source}
                    onChange={(e) =>
                      updateField(
                        "source",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Station Survey"
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* COORDINATES */}

            <FormSection
              title="Location Coordinates"
              description="Coordinates used for map and navigation services."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Latitude">
                  <input
                    value={formData.latitude}
                    onChange={(e) =>
                      updateField(
                        "latitude",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 23.2699"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Longitude">
                  <input
                    value={formData.longitude}
                    onChange={(e) =>
                      updateField(
                        "longitude",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 77.4126"
                    className={inputClass}
                  />
                </FormField>
              </div>

              <div className="mt-4 flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <Navigation
                  size={18}
                  className="mt-0.5 shrink-0 text-blue-600"
                />

                <div>
                  <p className="text-sm font-semibold text-blue-900">
                    Map coordinates
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    These coordinates will later be used by
                    Map Management and the Navigation Agent.
                  </p>
                </div>
              </div>
            </FormSection>

            {/* AVAILABILITY */}

            <FormSection
              title="Availability & Accessibility"
              description="Configure operating hours and passenger accessibility."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Availability">
                  <select
                    value={formData.availability}
                    onChange={(e) =>
                      updateField(
                        "availability",
                        e.target.value as Availability
                      )
                    }
                    className={inputClass}
                  >
                    <option value="Available">
                      Available
                    </option>
                    <option value="Unavailable">
                      Unavailable
                    </option>
                    <option value="Temporarily Closed">
                      Temporarily Closed
                    </option>
                  </select>
                </FormField>

                <FormField label="Accessibility">
                  <select
                    value={formData.accessibility}
                    onChange={(e) =>
                      updateField(
                        "accessibility",
                        e.target
                          .value as AccessibilityStatus
                      )
                    }
                    className={inputClass}
                  >
                    <option value="Accessible">
                      Accessible
                    </option>
                    <option value="Partially Accessible">
                      Partially Accessible
                    </option>
                    <option value="Not Accessible">
                      Not Accessible
                    </option>
                  </select>
                </FormField>

                <FormField label="Opening Time">
                  <input
                    type="time"
                    value={formData.openingTime}
                    onChange={(e) =>
                      updateField(
                        "openingTime",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Closing Time">
                  <input
                    type="time"
                    value={formData.closingTime}
                    onChange={(e) =>
                      updateField(
                        "closingTime",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* DESCRIPTION */}

            <FormSection
              title="Description"
              description="Add additional information about this facility."
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
                placeholder="Enter facility description..."
                className={`${inputClass} resize-none`}
              />
            </FormSection>

            {/* VERIFICATION */}

            <FormSection
              title="Verification"
              description="Manage verification status of this facility."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Verification Status">
                  <select
                    value={formData.verificationStatus}
                    onChange={(e) =>
                      updateField(
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

                <FormField label="Last Verified">
                  <input
                    type="date"
                    value={formData.lastVerified}
                    onChange={(e) =>
                      updateField(
                        "lastVerified",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            {/* FOOTER */}

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
                  ? "Add Facility"
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          VIEW MODAL
      ===================================================== */}

      {modal === "view" && selectedFacility && (
        <Modal
          title="Facility Details"
          subtitle="Complete information about this facility."
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            {/* HEADER */}

            <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <Building2 size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {selectedFacility.facilityName}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedFacility.facilityType}
                  </p>
                </div>
              </div>

              <VerificationBadge
                status={
                  selectedFacility.verificationStatus
                }
              />
            </div>

            {/* INFO GRID */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox
                label="Station"
                value={`${selectedFacility.station} (${selectedFacility.stationCode})`}
              />

              <DetailBox
                label="Platform"
                value={
                  selectedFacility.platform || "—"
                }
              />

              <DetailBox
                label="Location"
                value={selectedFacility.location}
              />

              <DetailBox
                label="Source"
                value={selectedFacility.source || "—"}
              />

              <DetailBox
                label="Latitude"
                value={
                  selectedFacility.latitude || "—"
                }
              />

              <DetailBox
                label="Longitude"
                value={
                  selectedFacility.longitude || "—"
                }
              />

              <DetailBox
                label="Opening Time"
                value={selectedFacility.openingTime}
              />

              <DetailBox
                label="Closing Time"
                value={selectedFacility.closingTime}
              />

              <DetailBox
                label="Last Verified"
                value={selectedFacility.lastVerified}
              />
            </div>

            {/* STATUS */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Availability
                </p>

                <AvailabilityBadge
                  status={selectedFacility.availability}
                />
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Accessibility
                </p>

                <AccessibilityBadge
                  status={selectedFacility.accessibility}
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Description
              </p>

              <p className="text-sm leading-6 text-slate-700">
                {selectedFacility.description ||
                  "No description available."}
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                onClick={() => {
                  openEditModal(selectedFacility);
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Pencil size={17} />
                Edit Facility
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      {modal === "delete" && selectedFacility && (
        <Modal
          title="Delete Facility"
          subtitle="This action cannot be undone."
          onClose={closeModal}
          size="sm"
        >
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <Trash2 size={24} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
              Delete this facility?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-slate-700">
                {selectedFacility.facilityName}
              </span>
              ? This facility record will be removed from
              the current admin view.
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
                Delete Facility
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/* =========================================================
   REUSABLE COMPONENTS
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
        onChange={(e) => onChange(e.target.value)}
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
          <span className="ml-1 text-red-500">*</span>
        )}
      </label>

      {children}
    </div>
  );
}

/* =========================================================
   BADGES
========================================================= */

function AvailabilityBadge({
  status,
}: {
  status: Availability;
}) {
  const styles: Record<Availability, string> = {
    Available:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    Unavailable:
      "bg-red-50 text-red-700 border-red-100",
    "Temporarily Closed":
      "bg-amber-50 text-amber-700 border-amber-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function AccessibilityBadge({
  status,
}: {
  status: AccessibilityStatus;
}) {
  const styles: Record<AccessibilityStatus, string> = {
    Accessible:
      "bg-blue-50 text-blue-700 border-blue-100",
    "Partially Accessible":
      "bg-amber-50 text-amber-700 border-amber-100",
    "Not Accessible":
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      <Accessibility size={12} />
      {status}
    </span>
  );
}

function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const styles: Record<VerificationStatus, string> = {
    Verified:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-100",
    Rejected:
      "bg-red-50 text-red-700 border-red-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {status === "Verified" && (
        <CheckCircle2 size={12} />
      )}

      {status === "Pending" && (
        <Clock3 size={12} />
      )}

      {status === "Rejected" && (
        <AlertCircle size={12} />
      )}

      {status}
    </span>
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
   EMPTY STATE
========================================================= */

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Building2 size={22} />
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No facilities found
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-500">
        Try changing your search or filters to find
        facility records.
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
        {/* MODAL HEADER */}

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
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={19} />
          </button>
        </div>

        {/* MODAL BODY */}

        <div className="overflow-y-auto p-5 sm:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}