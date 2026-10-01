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
  Navigation,
  Route,
  CheckCircle2,
  Clock3,
  AlertCircle,
  ChevronDown,
  Accessibility,
  Save,
  Footprints,
  ArrowRight,
  MoveRight,
  GitBranch,
} from "lucide-react";

/* =========================================================
   TYPES
========================================================= */

type TabType = "nodes" | "edges";

type AccessibilityStatus =
  | "Accessible"
  | "Partially Accessible"
  | "Not Accessible";

type VerificationStatus =
  | "Verified"
  | "Pending"
  | "Rejected";

type NodeType =
  | "ENTRY"
  | "EXIT"
  | "PLATFORM"
  | "FOB"
  | "STAIRS"
  | "LIFT"
  | "ESCALATOR"
  | "FOOTWAY"
  | "TICKET_COUNTER"
  | "WAITING_ROOM";

type RouteType =
  | "FOOTWAY"
  | "STAIRS"
  | "LIFT"
  | "ESCALATOR"
  | "RAMP"
  | "FOB"
  | "CONCOURSE";

interface NavigationNode {
  id: number;
  nodeId: string;
  station: string;
  stationCode: string;
  nodeType: NodeType;
  nodeName: string;
  platform: string;
  latitude: string;
  longitude: string;
  level: string;
  accessibility: AccessibilityStatus;
  description: string;
  verificationStatus: VerificationStatus;
  lastVerified: string;
}

interface NavigationEdge {
  id: number;
  edgeId: string;
  station: string;
  stationCode: string;
  fromNode: string;
  toNode: string;
  distance: string;
  walkingTime: string;
  routeType: RouteType;
  accessible: boolean;
  stairsRequired: boolean;
  wheelchairRoute: boolean;
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

const nodeTypes: NodeType[] = [
  "ENTRY",
  "EXIT",
  "PLATFORM",
  "FOB",
  "STAIRS",
  "LIFT",
  "ESCALATOR",
  "FOOTWAY",
  "TICKET_COUNTER",
  "WAITING_ROOM",
];

const routeTypes: RouteType[] = [
  "FOOTWAY",
  "STAIRS",
  "LIFT",
  "ESCALATOR",
  "RAMP",
  "FOB",
  "CONCOURSE",
];

/* =========================================================
   DUMMY NODES
========================================================= */

const initialNodes: NavigationNode[] = [
  {
    id: 1,
    nodeId: "BPL-N001",
    station: "Bhopal Junction",
    stationCode: "BPL",
    nodeType: "ENTRY",
    nodeName: "Main Station Entry",
    platform: "Concourse",
    latitude: "23.2697",
    longitude: "77.4122",
    level: "Ground",
    accessibility: "Accessible",
    description: "Main passenger entry point.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-28",
  },
  {
    id: 2,
    nodeId: "BPL-N002",
    station: "Bhopal Junction",
    stationCode: "BPL",
    nodeType: "TICKET_COUNTER",
    nodeName: "Main Ticket Counter",
    platform: "Concourse",
    latitude: "23.2699",
    longitude: "77.4125",
    level: "Ground",
    accessibility: "Accessible",
    description: "Main ticket booking area.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-27",
  },
  {
    id: 3,
    nodeId: "BPL-N003",
    station: "Bhopal Junction",
    stationCode: "BPL",
    nodeType: "FOB",
    nodeName: "Main Foot Over Bridge",
    platform: "Platform 1",
    latitude: "23.2702",
    longitude: "77.4130",
    level: "Level 1",
    accessibility: "Partially Accessible",
    description: "Main FOB connecting multiple platforms.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-26",
  },
  {
    id: 4,
    nodeId: "BPL-N004",
    station: "Bhopal Junction",
    stationCode: "BPL",
    nodeType: "PLATFORM",
    nodeName: "Platform 1",
    platform: "Platform 1",
    latitude: "23.2704",
    longitude: "77.4133",
    level: "Ground",
    accessibility: "Accessible",
    description: "Passenger platform 1.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-28",
  },
  {
    id: 5,
    nodeId: "BPL-N005",
    station: "Bhopal Junction",
    stationCode: "BPL",
    nodeType: "LIFT",
    nodeName: "FOB Passenger Lift",
    platform: "Platform 2",
    latitude: "23.2706",
    longitude: "77.4137",
    level: "Ground",
    accessibility: "Accessible",
    description: "Lift connecting platform and FOB.",
    verificationStatus: "Pending",
    lastVerified: "2026-09-20",
  },
  {
    id: 6,
    nodeId: "INDB-N001",
    station: "Indore Junction",
    stationCode: "INDB",
    nodeType: "ENTRY",
    nodeName: "Main Entry",
    platform: "Concourse",
    latitude: "22.7175",
    longitude: "75.8678",
    level: "Ground",
    accessibility: "Accessible",
    description: "Main station entrance.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-25",
  },
  {
    id: 7,
    nodeId: "INDB-N002",
    station: "Indore Junction",
    stationCode: "INDB",
    nodeType: "WAITING_ROOM",
    nodeName: "General Waiting Hall",
    platform: "Concourse",
    latitude: "22.7177",
    longitude: "75.8681",
    level: "Ground",
    accessibility: "Accessible",
    description: "General passenger waiting hall.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-24",
  },
  {
    id: 8,
    nodeId: "INDB-N003",
    station: "Indore Junction",
    stationCode: "INDB",
    nodeType: "PLATFORM",
    nodeName: "Platform 1",
    platform: "Platform 1",
    latitude: "22.7180",
    longitude: "75.8684",
    level: "Ground",
    accessibility: "Accessible",
    description: "Passenger platform 1.",
    verificationStatus: "Pending",
    lastVerified: "2026-09-18",
  },
  {
    id: 9,
    nodeId: "UJN-N001",
    station: "Ujjain Junction",
    stationCode: "UJN",
    nodeType: "ENTRY",
    nodeName: "Main Entry Gate",
    platform: "Concourse",
    latitude: "23.1762",
    longitude: "75.7881",
    level: "Ground",
    accessibility: "Accessible",
    description: "Main passenger entry gate.",
    verificationStatus: "Verified",
    lastVerified: "2026-09-23",
  },
  {
    id: 10,
    nodeId: "UJN-N002",
    station: "Ujjain Junction",
    stationCode: "UJN",
    nodeType: "STAIRS",
    nodeName: "Platform 2 Stairs",
    platform: "Platform 2",
    latitude: "23.1765",
    longitude: "75.7885",
    level: "Level 1",
    accessibility: "Not Accessible",
    description: "Stairway connecting platform to FOB.",
    verificationStatus: "Pending",
    lastVerified: "2026-09-16",
  },
];

/* =========================================================
   DUMMY EDGES
========================================================= */

const initialEdges: NavigationEdge[] = [
  {
    id: 1,
    edgeId: "BPL-E001",
    station: "Bhopal Junction",
    stationCode: "BPL",
    fromNode: "BPL-N001",
    toNode: "BPL-N002",
    distance: "35 m",
    walkingTime: "1 min",
    routeType: "FOOTWAY",
    accessible: true,
    stairsRequired: false,
    wheelchairRoute: true,
    verificationStatus: "Verified",
    lastVerified: "2026-09-28",
  },
  {
    id: 2,
    edgeId: "BPL-E002",
    station: "Bhopal Junction",
    stationCode: "BPL",
    fromNode: "BPL-N002",
    toNode: "BPL-N003",
    distance: "65 m",
    walkingTime: "2 min",
    routeType: "FOOTWAY",
    accessible: true,
    stairsRequired: false,
    wheelchairRoute: true,
    verificationStatus: "Verified",
    lastVerified: "2026-09-27",
  },
  {
    id: 3,
    edgeId: "BPL-E003",
    station: "Bhopal Junction",
    stationCode: "BPL",
    fromNode: "BPL-N003",
    toNode: "BPL-N004",
    distance: "45 m",
    walkingTime: "2 min",
    routeType: "FOB",
    accessible: false,
    stairsRequired: true,
    wheelchairRoute: false,
    verificationStatus: "Verified",
    lastVerified: "2026-09-26",
  },
  {
    id: 4,
    edgeId: "BPL-E004",
    station: "Bhopal Junction",
    stationCode: "BPL",
    fromNode: "BPL-N003",
    toNode: "BPL-N005",
    distance: "30 m",
    walkingTime: "1 min",
    routeType: "LIFT",
    accessible: true,
    stairsRequired: false,
    wheelchairRoute: true,
    verificationStatus: "Pending",
    lastVerified: "2026-09-20",
  },
  {
    id: 5,
    edgeId: "INDB-E001",
    station: "Indore Junction",
    stationCode: "INDB",
    fromNode: "INDB-N001",
    toNode: "INDB-N002",
    distance: "40 m",
    walkingTime: "1 min",
    routeType: "CONCOURSE",
    accessible: true,
    stairsRequired: false,
    wheelchairRoute: true,
    verificationStatus: "Verified",
    lastVerified: "2026-09-24",
  },
  {
    id: 6,
    edgeId: "INDB-E002",
    station: "Indore Junction",
    stationCode: "INDB",
    fromNode: "INDB-N002",
    toNode: "INDB-N003",
    distance: "70 m",
    walkingTime: "2 min",
    routeType: "FOOTWAY",
    accessible: true,
    stairsRequired: false,
    wheelchairRoute: true,
    verificationStatus: "Pending",
    lastVerified: "2026-09-18",
  },
  {
    id: 7,
    edgeId: "UJN-E001",
    station: "Ujjain Junction",
    stationCode: "UJN",
    fromNode: "UJN-N001",
    toNode: "UJN-N002",
    distance: "55 m",
    walkingTime: "2 min",
    routeType: "STAIRS",
    accessible: false,
    stairsRequired: true,
    wheelchairRoute: false,
    verificationStatus: "Pending",
    lastVerified: "2026-09-16",
  },
];

/* =========================================================
   EMPTY NODE
========================================================= */

const emptyNode: NavigationNode = {
  id: 0,
  nodeId: "",
  station: "Bhopal Junction",
  stationCode: "BPL",
  nodeType: "ENTRY",
  nodeName: "",
  platform: "",
  latitude: "",
  longitude: "",
  level: "Ground",
  accessibility: "Accessible",
  description: "",
  verificationStatus: "Pending",
  lastVerified: new Date().toISOString().split("T")[0],
};

/* =========================================================
   EMPTY EDGE
========================================================= */

const emptyEdge: NavigationEdge = {
  id: 0,
  edgeId: "",
  station: "Bhopal Junction",
  stationCode: "BPL",
  fromNode: "",
  toNode: "",
  distance: "",
  walkingTime: "",
  routeType: "FOOTWAY",
  accessible: true,
  stairsRequired: false,
  wheelchairRoute: true,
  verificationStatus: "Pending",
  lastVerified: new Date().toISOString().split("T")[0],
};

/* =========================================================
   PAGE
========================================================= */

export default function NavigationManagementPage() {
  const [activeTab, setActiveTab] =
    useState<TabType>("nodes");

  const [nodes, setNodes] =
    useState<NavigationNode[]>(initialNodes);

  const [edges, setEdges] =
    useState<NavigationEdge[]>(initialEdges);

  const [search, setSearch] = useState("");
  const [stationFilter, setStationFilter] =
    useState("All");

  const [typeFilter, setTypeFilter] =
    useState("All");

  const [verificationFilter, setVerificationFilter] =
    useState("All");

  const [showFilters, setShowFilters] = useState(false);

  const [modal, setModal] = useState<
    "addNode" |
      "editNode" |
      "viewNode" |
      "deleteNode" |
      "addEdge" |
      "editEdge" |
      "viewEdge" |
      "deleteEdge" |
      null
  >(null);

  const [selectedNode, setSelectedNode] =
    useState<NavigationNode | null>(null);

  const [selectedEdge, setSelectedEdge] =
    useState<NavigationEdge | null>(null);

  const [nodeForm, setNodeForm] =
    useState<NavigationNode>(emptyNode);

  const [edgeForm, setEdgeForm] =
    useState<NavigationEdge>(emptyEdge);

  /* =========================================================
     FILTERED NODES
  ========================================================= */

  const filteredNodes = useMemo(() => {
    return nodes.filter((node) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        node.nodeId.toLowerCase().includes(query) ||
        node.nodeName.toLowerCase().includes(query) ||
        node.station.toLowerCase().includes(query) ||
        node.stationCode.toLowerCase().includes(query) ||
        node.nodeType.toLowerCase().includes(query) ||
        node.platform.toLowerCase().includes(query);

      const matchesStation =
        stationFilter === "All" ||
        node.stationCode === stationFilter;

      const matchesType =
        typeFilter === "All" ||
        node.nodeType === typeFilter;

      const matchesVerification =
        verificationFilter === "All" ||
        node.verificationStatus === verificationFilter;

      return (
        matchesSearch &&
        matchesStation &&
        matchesType &&
        matchesVerification
      );
    });
  }, [
    nodes,
    search,
    stationFilter,
    typeFilter,
    verificationFilter,
  ]);

  /* =========================================================
     FILTERED EDGES
  ========================================================= */

  const filteredEdges = useMemo(() => {
    return edges.filter((edge) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        !query ||
        edge.edgeId.toLowerCase().includes(query) ||
        edge.fromNode.toLowerCase().includes(query) ||
        edge.toNode.toLowerCase().includes(query) ||
        edge.station.toLowerCase().includes(query) ||
        edge.stationCode.toLowerCase().includes(query) ||
        edge.routeType.toLowerCase().includes(query);

      const matchesStation =
        stationFilter === "All" ||
        edge.stationCode === stationFilter;

      const matchesType =
        typeFilter === "All" ||
        edge.routeType === typeFilter;

      const matchesVerification =
        verificationFilter === "All" ||
        edge.verificationStatus === verificationFilter;

      return (
        matchesSearch &&
        matchesStation &&
        matchesType &&
        matchesVerification
      );
    });
  }, [
    edges,
    search,
    stationFilter,
    typeFilter,
    verificationFilter,
  ]);

  /* =========================================================
     STATS
  ========================================================= */

  const verifiedNodes = nodes.filter(
    (node) => node.verificationStatus === "Verified"
  ).length;

  const pendingNodes = nodes.filter(
    (node) => node.verificationStatus === "Pending"
  ).length;

  const accessibleRoutes = edges.filter(
    (edge) => edge.accessible
  ).length;

  const wheelchairRoutes = edges.filter(
    (edge) => edge.wheelchairRoute
  ).length;

  /* =========================================================
     MODAL HELPERS
  ========================================================= */

  const closeModal = () => {
    setModal(null);
    setSelectedNode(null);
    setSelectedEdge(null);
  };

  const openAddNode = () => {
    setNodeForm({
      ...emptyNode,
      id: 0,
      nodeId: `${stationFilter !== "All" ? stationFilter : "BPL"}-N${String(
        nodes.length + 1
      ).padStart(3, "0")}`,
      lastVerified: new Date()
        .toISOString()
        .split("T")[0],
    });

    setModal("addNode");
  };

  const openEditNode = (node: NavigationNode) => {
    setSelectedNode(node);
    setNodeForm(node);
    setModal("editNode");
  };

  const openViewNode = (node: NavigationNode) => {
    setSelectedNode(node);
    setModal("viewNode");
  };

  const openDeleteNode = (node: NavigationNode) => {
    setSelectedNode(node);
    setModal("deleteNode");
  };

  const openAddEdge = () => {
    setEdgeForm({
      ...emptyEdge,
      id: 0,
      edgeId: `${stationFilter !== "All" ? stationFilter : "BPL"}-E${String(
        edges.length + 1
      ).padStart(3, "0")}`,
      lastVerified: new Date()
        .toISOString()
        .split("T")[0],
    });

    setModal("addEdge");
  };

  const openEditEdge = (edge: NavigationEdge) => {
    setSelectedEdge(edge);
    setEdgeForm(edge);
    setModal("editEdge");
  };

  const openViewEdge = (edge: NavigationEdge) => {
    setSelectedEdge(edge);
    setModal("viewEdge");
  };

  const openDeleteEdge = (edge: NavigationEdge) => {
    setSelectedEdge(edge);
    setModal("deleteEdge");
  };

  /* =========================================================
     NODE FORM
  ========================================================= */

  const updateNodeField = <K extends keyof NavigationNode>(
    key: K,
    value: NavigationNode[K]
  ) => {
    setNodeForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleNodeStationChange = (value: string) => {
    const station = stationOptions.find(
      (item) => item.name === value
    );

    setNodeForm((prev) => ({
      ...prev,
      station: value,
      stationCode: station?.code || "",
      nodeId: `${station?.code || "NODE"}-N${String(
        nodes.length + 1
      ).padStart(3, "0")}`,
    }));
  };

  /* =========================================================
     EDGE FORM
  ========================================================= */

  const updateEdgeField = <K extends keyof NavigationEdge>(
    key: K,
    value: NavigationEdge[K]
  ) => {
    setEdgeForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleEdgeStationChange = (value: string) => {
    const station = stationOptions.find(
      (item) => item.name === value
    );

    setEdgeForm((prev) => ({
      ...prev,
      station: value,
      stationCode: station?.code || "",
      fromNode: "",
      toNode: "",
    }));
  };

  /* =========================================================
     SAVE NODE
  ========================================================= */

  const saveNode = () => {
    if (
      !nodeForm.nodeId.trim() ||
      !nodeForm.station ||
      !nodeForm.nodeName.trim() ||
      !nodeForm.nodeType
    ) {
      alert("Please fill all required node fields.");
      return;
    }

    if (modal === "addNode") {
      setNodes((prev) => [
        {
          ...nodeForm,
          id: Date.now(),
        },
        ...prev,
      ]);
    }

    if (modal === "editNode") {
      setNodes((prev) =>
        prev.map((node) =>
          node.id === nodeForm.id
            ? nodeForm
            : node
        )
      );
    }

    closeModal();
  };

  /* =========================================================
     SAVE EDGE
  ========================================================= */

  const saveEdge = () => {
    if (
      !edgeForm.edgeId.trim() ||
      !edgeForm.station ||
      !edgeForm.fromNode ||
      !edgeForm.toNode ||
      !edgeForm.distance.trim() ||
      !edgeForm.walkingTime.trim()
    ) {
      alert("Please fill all required route fields.");
      return;
    }

    if (edgeForm.fromNode === edgeForm.toNode) {
      alert("From Node and To Node cannot be the same.");
      return;
    }

    if (modal === "addEdge") {
      setEdges((prev) => [
        {
          ...edgeForm,
          id: Date.now(),
        },
        ...prev,
      ]);
    }

    if (modal === "editEdge") {
      setEdges((prev) =>
        prev.map((edge) =>
          edge.id === edgeForm.id
            ? edgeForm
            : edge
        )
      );
    }

    closeModal();
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const deleteNode = () => {
    if (!selectedNode) return;

    setNodes((prev) =>
      prev.filter(
        (node) => node.id !== selectedNode.id
      )
    );

    closeModal();
  };

  const deleteEdge = () => {
    if (!selectedEdge) return;

    setEdges((prev) =>
      prev.filter(
        (edge) => edge.id !== selectedEdge.id
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
    setVerificationFilter("All");
  };

  /* =========================================================
     NODES FOR EDGE FORM
  ========================================================= */

  const edgeAvailableNodes = nodes.filter(
    (node) =>
      node.stationCode === edgeForm.stationCode
  );

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <div className="space-y-6">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Navigation size={16} />
            <span>Admin</span>
            <span>/</span>
            <span className="text-slate-700">
              Navigation Management
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Navigation Management
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage navigation nodes, routes and accessible
            paths inside railway stations.
          </p>
        </div>

        <button
          onClick={
            activeTab === "nodes"
              ? openAddNode
              : openAddEdge
          }
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 active:scale-[0.98]"
        >
          <Plus size={18} />

          {activeTab === "nodes"
            ? "Add Node"
            : "Add Route"}
        </button>
      </div>

      {/* =====================================================
          SUMMARY
      ===================================================== */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard
          title="Total Nodes"
          value={nodes.length}
          icon={MapPin}
          description="Navigation points"
        />

        <SummaryCard
          title="Total Routes"
          value={edges.length}
          icon={Route}
          description="Connected paths"
        />

        <SummaryCard
          title="Accessible Routes"
          value={accessibleRoutes}
          icon={Accessibility}
          description="Accessible paths"
        />

        <SummaryCard
          title="Wheelchair Routes"
          value={wheelchairRoutes}
          icon={Footprints}
          description="Wheelchair-friendly"
        />
      </div>

      {/* =====================================================
          TABS
      ===================================================== */}

      <div className="rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm">
        <div className="grid grid-cols-2 gap-1">
          <button
            onClick={() => {
              setActiveTab("nodes");
              setSearch("");
              setTypeFilter("All");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "nodes"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <MapPin size={17} />
            Navigation Nodes
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "nodes"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {nodes.length}
            </span>
          </button>

          <button
            onClick={() => {
              setActiveTab("edges");
              setSearch("");
              setTypeFilter("All");
            }}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
              activeTab === "edges"
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <Route size={17} />
            Routes / Edges
            <span
              className={`rounded-full px-2 py-0.5 text-xs ${
                activeTab === "edges"
                  ? "bg-white/20 text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {edges.length}
            </span>
          </button>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTER
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
              placeholder={
                activeTab === "nodes"
                  ? "Search node ID, node name, station, type..."
                  : "Search route ID, from node, to node, station..."
              }
              className={inputClass + " pl-10"}
            />
          </div>

          <button
            onClick={() =>
              setShowFilters((prev) => !prev)
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
            stationFilter !== "All" ||
            typeFilter !== "All" ||
            verificationFilter !== "All") && (
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
                {
                  value: "All",
                  label: "All Stations",
                },
                ...stationOptions.map((station) => ({
                  value: station.code,
                  label: `${station.name} (${station.code})`,
                })),
              ]}
            />

            <FilterSelect
              label={
                activeTab === "nodes"
                  ? "Node Type"
                  : "Route Type"
              }
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                {
                  value: "All",
                  label:
                    activeTab === "nodes"
                      ? "All Node Types"
                      : "All Route Types",
                },
                ...(activeTab === "nodes"
                  ? nodeTypes
                  : routeTypes
                ).map((type) => ({
                  value: type,
                  label: type,
                })),
              ]}
            />

            <FilterSelect
              label="Verification"
              value={verificationFilter}
              onChange={setVerificationFilter}
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
          NODE CONTENT
      ===================================================== */}

      {activeTab === "nodes" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredNodes.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {nodes.length}
              </span>{" "}
              nodes
            </p>

            <p className="hidden text-xs text-slate-400 sm:block">
              Verified: {verifiedNodes} · Pending:{" "}
              {pendingNodes}
            </p>
          </div>

          {/* DESKTOP NODE TABLE */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1200px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Node
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Station
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Platform
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Level
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
                  {filteredNodes.map((node) => (
                    <tr
                      key={node.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <MapPin size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {node.nodeName}
                            </p>

                            <p className="mt-1 font-mono text-xs text-slate-400">
                              {node.nodeId}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-medium text-slate-800">
                          {node.station}
                        </p>

                        <span className="mt-1 inline-flex rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                          {node.stationCode}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <NodeTypeBadge
                          type={node.nodeType}
                        />
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {node.platform || "—"}
                      </td>

                      <td className="px-5 py-4 text-sm text-slate-600">
                        {node.level}
                      </td>

                      <td className="px-5 py-4">
                        <AccessibilityBadge
                          status={node.accessibility}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <VerificationBadge
                          status={
                            node.verificationStatus
                          }
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            title="View"
                            onClick={() =>
                              openViewNode(node)
                            }
                          >
                            <Eye size={17} />
                          </ActionButton>

                          <ActionButton
                            title="Edit"
                            onClick={() =>
                              openEditNode(node)
                            }
                          >
                            <Pencil size={17} />
                          </ActionButton>

                          <ActionButton
                            title="Delete"
                            danger
                            onClick={() =>
                              openDeleteNode(node)
                            }
                          >
                            <Trash2 size={17} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredNodes.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center"
                      >
                        <EmptyState type="node" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE NODE CARDS */}

          <div className="grid gap-4 lg:hidden">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <MapPin size={18} />
                    </div>

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-slate-800">
                        {node.nodeName}
                      </h3>

                      <p className="mt-1 font-mono text-xs text-slate-400">
                        {node.nodeId}
                      </p>
                    </div>
                  </div>

                  <NodeTypeBadge
                    type={node.nodeType}
                  />
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Station"
                    value={`${node.stationCode} · ${node.station}`}
                  />

                  <InfoBox
                    label="Platform"
                    value={node.platform || "—"}
                  />

                  <InfoBox
                    label="Level"
                    value={node.level}
                  />

                  <InfoBox
                    label="Accessibility"
                    value={
                      <AccessibilityBadge
                        status={node.accessibility}
                      />
                    }
                  />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <VerificationBadge
                    status={node.verificationStatus}
                  />

                  <div className="flex gap-1">
                    <ActionButton
                      title="View"
                      onClick={() =>
                        openViewNode(node)
                      }
                    >
                      <Eye size={16} />
                    </ActionButton>

                    <ActionButton
                      title="Edit"
                      onClick={() =>
                        openEditNode(node)
                      }
                    >
                      <Pencil size={16} />
                    </ActionButton>

                    <ActionButton
                      title="Delete"
                      danger
                      onClick={() =>
                        openDeleteNode(node)
                      }
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}

            {filteredNodes.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
                <EmptyState type="node" />
              </div>
            )}
          </div>
        </>
      )}

      {/* =====================================================
          EDGE CONTENT
      ===================================================== */}

      {activeTab === "edges" && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-800">
                {filteredEdges.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-800">
                {edges.length}
              </span>{" "}
              routes
            </p>

            <p className="hidden text-xs text-slate-400 sm:block">
              Accessible: {accessibleRoutes} · Wheelchair:{" "}
              {wheelchairRoutes}
            </p>
          </div>

          {/* DESKTOP EDGE TABLE */}

          <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1250px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Route
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      From
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      To
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Distance
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Time
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Route Type
                    </th>

                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Accessibility
                    </th>

                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredEdges.map((edge) => (
                    <tr
                      key={edge.id}
                      className="transition hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                            <Route size={19} />
                          </div>

                          <div>
                            <p className="font-semibold text-slate-800">
                              {edge.edgeId}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {edge.stationCode}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                            {edge.fromNode}
                          </span>

                          <ArrowRight
                            size={14}
                            className="text-slate-400"
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                          {edge.toNode}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-sm font-medium text-slate-700">
                        {edge.distance}
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Clock3 size={14} />
                          {edge.walkingTime}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <RouteTypeBadge
                          type={edge.routeType}
                        />
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {edge.accessible && (
                            <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                              Accessible
                            </span>
                          )}

                          {edge.wheelchairRoute && (
                            <span className="rounded-full bg-blue-50 px-2 py-1 text-[11px] font-semibold text-blue-700">
                              Wheelchair
                            </span>
                          )}

                          {edge.stairsRequired && (
                            <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                              Stairs
                            </span>
                          )}

                          {!edge.accessible &&
                            !edge.wheelchairRoute && (
                              <span className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-500">
                                Standard
                              </span>
                            )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <ActionButton
                            title="View"
                            onClick={() =>
                              openViewEdge(edge)
                            }
                          >
                            <Eye size={17} />
                          </ActionButton>

                          <ActionButton
                            title="Edit"
                            onClick={() =>
                              openEditEdge(edge)
                            }
                          >
                            <Pencil size={17} />
                          </ActionButton>

                          <ActionButton
                            title="Delete"
                            danger
                            onClick={() =>
                              openDeleteEdge(edge)
                            }
                          >
                            <Trash2 size={17} />
                          </ActionButton>
                        </div>
                      </td>
                    </tr>
                  ))}

                  {filteredEdges.length === 0 && (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-5 py-16 text-center"
                      >
                        <EmptyState type="edge" />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE EDGE CARDS */}

          <div className="grid gap-4 lg:hidden">
            {filteredEdges.map((edge) => (
              <div
                key={edge.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                      <Route size={18} />
                    </div>

                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {edge.edgeId}
                      </h3>

                      <p className="mt-1 text-xs text-slate-400">
                        {edge.stationCode} ·{" "}
                        {edge.routeType}
                      </p>
                    </div>
                  </div>

                  <VerificationBadge
                    status={edge.verificationStatus}
                  />
                </div>

                <div className="mt-4 rounded-xl bg-slate-50 p-3">
                  <div className="flex items-center gap-2">
                    <span className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-700">
                      {edge.fromNode}
                    </span>

                    <MoveRight
                      size={18}
                      className="shrink-0 text-slate-400"
                    />

                    <span className="min-w-0 flex-1 truncate rounded-lg bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-700">
                      {edge.toNode}
                    </span>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <InfoBox
                    label="Distance"
                    value={edge.distance}
                  />

                  <InfoBox
                    label="Walking Time"
                    value={edge.walkingTime}
                  />

                  <InfoBox
                    label="Route Type"
                    value={edge.routeType}
                  />

                  <InfoBox
                    label="Wheelchair"
                    value={
                      edge.wheelchairRoute
                        ? "Yes"
                        : "No"
                    }
                  />
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex flex-wrap gap-1.5">
                    {edge.accessible && (
                      <span className="rounded-full bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">
                        Accessible
                      </span>
                    )}

                    {edge.stairsRequired && (
                      <span className="rounded-full bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                        Stairs
                      </span>
                    )}
                  </div>

                  <div className="flex gap-1">
                    <ActionButton
                      title="View"
                      onClick={() =>
                        openViewEdge(edge)
                      }
                    >
                      <Eye size={16} />
                    </ActionButton>

                    <ActionButton
                      title="Edit"
                      onClick={() =>
                        openEditEdge(edge)
                      }
                    >
                      <Pencil size={16} />
                    </ActionButton>

                    <ActionButton
                      title="Delete"
                      danger
                      onClick={() =>
                        openDeleteEdge(edge)
                      }
                    >
                      <Trash2 size={16} />
                    </ActionButton>
                  </div>
                </div>
              </div>
            ))}

            {filteredEdges.length === 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white px-5 py-16 text-center shadow-sm">
                <EmptyState type="edge" />
              </div>
            )}
          </div>
        </>
      )}

      {/* =====================================================
          ADD / EDIT NODE
      ===================================================== */}

      {(modal === "addNode" ||
        modal === "editNode") && (
        <Modal
          title={
            modal === "addNode"
              ? "Add Navigation Node"
              : "Edit Navigation Node"
          }
          subtitle="Configure a navigation point inside the station."
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            <FormSection
              title="Node Information"
              description="Define the navigation node and its station location."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Station" required>
                  <select
                    value={nodeForm.station}
                    onChange={(e) =>
                      handleNodeStationChange(
                        e.target.value
                      )
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

                <FormField label="Node ID" required>
                  <input
                    value={nodeForm.nodeId}
                    onChange={(e) =>
                      updateNodeField(
                        "nodeId",
                        e.target.value
                      )
                    }
                    placeholder="BPL-N011"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Node Type" required>
                  <select
                    value={nodeForm.nodeType}
                    onChange={(e) =>
                      updateNodeField(
                        "nodeType",
                        e.target.value as NodeType
                      )
                    }
                    className={inputClass}
                  >
                    {nodeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Node Name" required>
                  <input
                    value={nodeForm.nodeName}
                    onChange={(e) =>
                      updateNodeField(
                        "nodeName",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Platform 3"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Platform">
                  <input
                    value={nodeForm.platform}
                    onChange={(e) =>
                      updateNodeField(
                        "platform",
                        e.target.value
                      )
                    }
                    placeholder="e.g. Platform 3"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Level">
                  <input
                    value={nodeForm.level}
                    onChange={(e) =>
                      updateNodeField(
                        "level",
                        e.target.value
                      )
                    }
                    placeholder="Ground / Level 1 / Basement"
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              title="Coordinates"
              description="Coordinates used by the station map and navigation engine."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Latitude">
                  <input
                    value={nodeForm.latitude}
                    onChange={(e) =>
                      updateNodeField(
                        "latitude",
                        e.target.value
                      )
                    }
                    placeholder="23.2699"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Longitude">
                  <input
                    value={nodeForm.longitude}
                    onChange={(e) =>
                      updateNodeField(
                        "longitude",
                        e.target.value
                      )
                    }
                    placeholder="77.4126"
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            <FormSection
              title="Accessibility"
              description="Define whether passengers with accessibility requirements can use this node."
            >
              <FormField label="Accessibility">
                <select
                  value={nodeForm.accessibility}
                  onChange={(e) =>
                    updateNodeField(
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
            </FormSection>

            <FormSection
              title="Description"
              description="Add additional information about this navigation node."
            >
              <textarea
                value={nodeForm.description}
                onChange={(e) =>
                  updateNodeField(
                    "description",
                    e.target.value
                  )
                }
                rows={4}
                placeholder="Enter node description..."
                className={`${inputClass} resize-none`}
              />
            </FormSection>

            <FormSection
              title="Verification"
              description="Set the current verification state."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Verification Status">
                  <select
                    value={nodeForm.verificationStatus}
                    onChange={(e) =>
                      updateNodeField(
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
                    value={nodeForm.lastVerified}
                    onChange={(e) =>
                      updateNodeField(
                        "lastVerified",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            <ModalFooter
              onCancel={closeModal}
              onSave={saveNode}
              saveText={
                modal === "addNode"
                  ? "Add Node"
                  : "Save Changes"
              }
            />
          </div>
        </Modal>
      )}

      {/* =====================================================
          ADD / EDIT EDGE
      ===================================================== */}

      {(modal === "addEdge" ||
        modal === "editEdge") && (
        <Modal
          title={
            modal === "addEdge"
              ? "Add Navigation Route"
              : "Edit Navigation Route"
          }
          subtitle="Connect two navigation nodes and define route properties."
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            <FormSection
              title="Route Information"
              description="Define the start and destination nodes."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Station" required>
                  <select
                    value={edgeForm.station}
                    onChange={(e) =>
                      handleEdgeStationChange(
                        e.target.value
                      )
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

                <FormField label="Route ID" required>
                  <input
                    value={edgeForm.edgeId}
                    onChange={(e) =>
                      updateEdgeField(
                        "edgeId",
                        e.target.value
                      )
                    }
                    placeholder="BPL-E008"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="From Node" required>
                  <select
                    value={edgeForm.fromNode}
                    onChange={(e) =>
                      updateEdgeField(
                        "fromNode",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select starting node
                    </option>

                    {edgeAvailableNodes.map((node) => (
                      <option
                        key={node.nodeId}
                        value={node.nodeId}
                      >
                        {node.nodeId} — {node.nodeName}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="To Node" required>
                  <select
                    value={edgeForm.toNode}
                    onChange={(e) =>
                      updateEdgeField(
                        "toNode",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  >
                    <option value="">
                      Select destination node
                    </option>

                    {edgeAvailableNodes.map((node) => (
                      <option
                        key={node.nodeId}
                        value={node.nodeId}
                      >
                        {node.nodeId} — {node.nodeName}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormSection>

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
                  <Route size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                    Route Preview
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-800">
                    <span>
                      {edgeForm.fromNode || "From Node"}
                    </span>

                    <ArrowRight
                      size={16}
                      className="text-blue-500"
                    />

                    <span>
                      {edgeForm.toNode || "To Node"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <FormSection
              title="Route Details"
              description="Define distance, walking time and route type."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FormField label="Distance" required>
                  <input
                    value={edgeForm.distance}
                    onChange={(e) =>
                      updateEdgeField(
                        "distance",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 50 m"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Walking Time" required>
                  <input
                    value={edgeForm.walkingTime}
                    onChange={(e) =>
                      updateEdgeField(
                        "walkingTime",
                        e.target.value
                      )
                    }
                    placeholder="e.g. 2 min"
                    className={inputClass}
                  />
                </FormField>

                <FormField label="Route Type">
                  <select
                    value={edgeForm.routeType}
                    onChange={(e) =>
                      updateEdgeField(
                        "routeType",
                        e.target.value as RouteType
                      )
                    }
                    className={inputClass}
                  >
                    {routeTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </FormField>
              </div>
            </FormSection>

            <FormSection
              title="Accessibility Rules"
              description="Configure route accessibility for passengers."
            >
              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <ToggleField
                  label="Accessible Route"
                  description="Route can be used by accessible navigation."
                  checked={edgeForm.accessible}
                  onChange={(value) =>
                    updateEdgeField(
                      "accessible",
                      value
                    )
                  }
                />

                <ToggleField
                  label="Stairs Required"
                  description="Passenger must use stairs."
                  checked={edgeForm.stairsRequired}
                  onChange={(value) =>
                    updateEdgeField(
                      "stairsRequired",
                      value
                    )
                  }
                />

                <ToggleField
                  label="Wheelchair Route"
                  description="Suitable for wheelchair navigation."
                  checked={edgeForm.wheelchairRoute}
                  onChange={(value) =>
                    updateEdgeField(
                      "wheelchairRoute",
                      value
                    )
                  }
                />
              </div>
            </FormSection>

            <FormSection
              title="Verification"
              description="Set the current verification state."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FormField label="Verification Status">
                  <select
                    value={edgeForm.verificationStatus}
                    onChange={(e) =>
                      updateEdgeField(
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
                    value={edgeForm.lastVerified}
                    onChange={(e) =>
                      updateEdgeField(
                        "lastVerified",
                        e.target.value
                      )
                    }
                    className={inputClass}
                  />
                </FormField>
              </div>
            </FormSection>

            <ModalFooter
              onCancel={closeModal}
              onSave={saveEdge}
              saveText={
                modal === "addEdge"
                  ? "Add Route"
                  : "Save Changes"
              }
            />
          </div>
        </Modal>
      )}

      {/* =====================================================
          VIEW NODE
      ===================================================== */}

      {modal === "viewNode" && selectedNode && (
        <Modal
          title="Navigation Node Details"
          subtitle="Complete information about this navigation node."
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-blue-600 shadow-sm">
                  <MapPin size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {selectedNode.nodeName}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-slate-500">
                    {selectedNode.nodeId}
                  </p>
                </div>
              </div>

              <VerificationBadge
                status={
                  selectedNode.verificationStatus
                }
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <DetailBox
                label="Station"
                value={`${selectedNode.station} (${selectedNode.stationCode})`}
              />

              <DetailBox
                label="Node Type"
                value={selectedNode.nodeType}
              />

              <DetailBox
                label="Platform"
                value={
                  selectedNode.platform || "—"
                }
              />

              <DetailBox
                label="Level"
                value={selectedNode.level}
              />

              <DetailBox
                label="Latitude"
                value={
                  selectedNode.latitude || "—"
                }
              />

              <DetailBox
                label="Longitude"
                value={
                  selectedNode.longitude || "—"
                }
              />

              <DetailBox
                label="Last Verified"
                value={selectedNode.lastVerified}
              />
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Accessibility
              </p>

              <AccessibilityBadge
                status={selectedNode.accessibility}
              />
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Description
              </p>

              <p className="text-sm leading-6 text-slate-700">
                {selectedNode.description ||
                  "No description available."}
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                onClick={() =>
                  openEditNode(selectedNode)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Pencil size={17} />
                Edit Node
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          VIEW EDGE
      ===================================================== */}

      {modal === "viewEdge" && selectedEdge && (
        <Modal
          title="Navigation Route Details"
          subtitle="Complete information about this route."
          onClose={closeModal}
          size="xl"
        >
          <div className="space-y-6">
            <div className="rounded-2xl border border-violet-100 bg-violet-50 p-5">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                  <Route size={22} />
                </div>

                <div>
                  <h3 className="font-bold text-slate-900">
                    {selectedEdge.edgeId}
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    {selectedEdge.station}
                  </p>
                </div>

                <div className="ml-auto">
                  <VerificationBadge
                    status={
                      selectedEdge.verificationStatus
                    }
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
                Navigation Path
              </p>

              <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <div className="flex-1 rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-400">
                    From
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold text-slate-800">
                    {selectedEdge.fromNode}
                  </p>
                </div>

                <ArrowRight
                  size={20}
                  className="mx-auto hidden text-violet-500 sm:block"
                />

                <div className="flex-1 rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs text-slate-400">
                    To
                  </p>

                  <p className="mt-1 font-mono text-sm font-bold text-slate-800">
                    {selectedEdge.toNode}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <DetailBox
                label="Distance"
                value={selectedEdge.distance}
              />

              <DetailBox
                label="Walking Time"
                value={selectedEdge.walkingTime}
              />

              <DetailBox
                label="Route Type"
                value={selectedEdge.routeType}
              />

              <DetailBox
                label="Accessible"
                value={
                  selectedEdge.accessible
                    ? "Yes"
                    : "No"
                }
              />

              <DetailBox
                label="Stairs Required"
                value={
                  selectedEdge.stairsRequired
                    ? "Yes"
                    : "No"
                }
              />

              <DetailBox
                label="Wheelchair Route"
                value={
                  selectedEdge.wheelchairRoute
                    ? "Yes"
                    : "No"
                }
              />

              <DetailBox
                label="Last Verified"
                value={selectedEdge.lastVerified}
              />
            </div>

            <div className="flex justify-end border-t border-slate-100 pt-5">
              <button
                onClick={() =>
                  openEditEdge(selectedEdge)
                }
                className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Pencil size={17} />
                Edit Route
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* =====================================================
          DELETE NODE
      ===================================================== */}

      {modal === "deleteNode" && selectedNode && (
        <DeleteModal
          title="Delete Navigation Node?"
          name={selectedNode.nodeName}
          onClose={closeModal}
          onDelete={deleteNode}
        />
      )}

      {/* =====================================================
          DELETE EDGE
      ===================================================== */}

      {modal === "deleteEdge" && selectedEdge && (
        <DeleteModal
          title="Delete Navigation Route?"
          name={selectedEdge.edgeId}
          onClose={closeModal}
          onDelete={deleteEdge}
        />
      )}
    </div>
  );
}

/* =========================================================
   INPUT CLASS
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
   TOGGLE FIELD
========================================================= */

function ToggleField({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
        checked
          ? "border-blue-200 bg-blue-50"
          : "border-slate-200 bg-white hover:bg-slate-50"
      }`}
    >
      <div
        className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
          checked
            ? "bg-blue-600"
            : "bg-slate-300"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </div>

      <div>
        <p className="text-sm font-semibold text-slate-800">
          {label}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-500">
          {description}
        </p>
      </div>
    </button>
  );
}

/* =========================================================
   NODE TYPE BADGE
========================================================= */

function NodeTypeBadge({
  type,
}: {
  type: NodeType;
}) {
  const colors: Record<NodeType, string> = {
    ENTRY: "bg-emerald-50 text-emerald-700",
    EXIT: "bg-red-50 text-red-700",
    PLATFORM: "bg-blue-50 text-blue-700",
    FOB: "bg-violet-50 text-violet-700",
    STAIRS: "bg-amber-50 text-amber-700",
    LIFT: "bg-cyan-50 text-cyan-700",
    ESCALATOR: "bg-indigo-50 text-indigo-700",
    FOOTWAY: "bg-slate-100 text-slate-700",
    TICKET_COUNTER: "bg-orange-50 text-orange-700",
    WAITING_ROOM: "bg-pink-50 text-pink-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${colors[type]}`}
    >
      {type}
    </span>
  );
}

/* =========================================================
   ROUTE TYPE BADGE
========================================================= */

function RouteTypeBadge({
  type,
}: {
  type: RouteType;
}) {
  return (
    <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[11px] font-bold text-violet-700">
      {type}
    </span>
  );
}

/* =========================================================
   ACCESSIBILITY BADGE
========================================================= */

function AccessibilityBadge({
  status,
}: {
  status: AccessibilityStatus;
}) {
  const styles: Record<
    AccessibilityStatus,
    string
  > = {
    Accessible:
      "bg-emerald-50 text-emerald-700 border-emerald-100",
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

/* =========================================================
   VERIFICATION BADGE
========================================================= */

function VerificationBadge({
  status,
}: {
  status: VerificationStatus;
}) {
  const styles: Record<
    VerificationStatus,
    string
  > = {
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

function EmptyState({
  type,
}: {
  type: "node" | "edge";
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {type === "node" ? (
          <MapPin size={22} />
        ) : (
          <Route size={22} />
        )}
      </div>

      <h3 className="mt-3 text-sm font-semibold text-slate-800">
        No {type === "node" ? "nodes" : "routes"} found
      </h3>

      <p className="mt-1 max-w-sm text-xs text-slate-500">
        Try changing your search or filters.
      </p>
    </div>
  );
}

/* =========================================================
   MODAL FOOTER
========================================================= */

function ModalFooter({
  onCancel,
  onSave,
  saveText,
}: {
  onCancel: () => void;
  onSave: () => void;
  saveText: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={onSave}
        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        <Save size={17} />
        {saveText}
      </button>
    </div>
  );
}

/* =========================================================
   DELETE MODAL
========================================================= */

function DeleteModal({
  title,
  name,
  onClose,
  onDelete,
}: {
  title: string;
  name: string;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Modal
      title={title}
      subtitle="This action cannot be undone."
      onClose={onClose}
      size="sm"
    >
      <div className="text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <Trash2 size={24} />
        </div>

        <h3 className="mt-4 text-lg font-bold text-slate-900">
          Are you sure?
        </h3>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          You are about to delete{" "}
          <span className="font-semibold text-slate-700">
            {name}
          </span>
          . The record will be removed from the current
          admin view.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onDelete}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
          >
            <Trash2 size={17} />
            Delete
          </button>
        </div>
      </div>
    </Modal>
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