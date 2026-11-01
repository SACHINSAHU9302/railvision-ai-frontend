'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
  Compass,
  MapPin,
  Bot,
  ScanLine,
  AlertTriangle,
  ArrowRight,
  Train,
  Clock,
  ChevronRight,
  Sparkles,
  PhoneCall,
  Search,
  CheckCircle2,
  RefreshCw,
  Building2,
  Layers,
  FileText,
  Accessibility,
} from 'lucide-react';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CommandPalette } from '@/components/layout/command-palette';

/* =====================================================
   API CONFIGURATION
===================================================== */

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const API_BASE_URL = RAW_API_URL.endsWith('/api')
  ? RAW_API_URL
  : `${RAW_API_URL.replace(/\/$/, '')}/api`;

const API_ENDPOINTS = {
  stations: `${API_BASE_URL}/stations/`,
  stationDetail: (id: number | string) =>
    `${API_BASE_URL}/stations/${id}/`,
  facilities: `${API_BASE_URL}/facilities/`,
  documents: `${API_BASE_URL}/documents/`,
};

/* =====================================================
   TYPES
===================================================== */

interface Station {
  id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
  address?: string;
  platform_count: number;
}

interface Platform {
  id: number;
  platform_number: number | string;
  name?: string;
  accessibility?: boolean | string;
}

interface Facility {
  id: number;
  facility_type: string;
  facility_name: string;
  description?: string;
  station_id: number;
  station_name: string;
  station_code: string;
  platform_number?: number | string | null;
  accessibility?: boolean | string;
  contact_info?: string;
}

interface RailwayDocument {
  id: string;
  title: string;
  source: string;
  file_type: string;
  category: string;
}

interface ApiResponse<T> {
  success: boolean;
  count?: number;
  results?: T[];
  error?: string;
}

interface StationDetailResponse {
  success: boolean;
  station: Station;
  platforms: Platform[];
  facilities: Facility[];
}

/* =====================================================
   API HELPER
===================================================== */

async function fetchAPI<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

/* =====================================================
   DASHBOARD COMPONENT
===================================================== */

export default function DashboardPage() {
  const router = useRouter();

  const [isCommandOpen, setIsCommandOpen] = React.useState(false);

  const [stations, setStations] = React.useState<Station[]>([]);
  const [platforms, setPlatforms] = React.useState<Platform[]>([]);
  const [facilities, setFacilities] = React.useState<Facility[]>([]);
  const [documents, setDocuments] = React.useState<RailwayDocument[]>([]);

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  /* =====================================================
     GREETING
  ===================================================== */

  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon 👋';

    return 'Good Evening 👋';
  };

  /* =====================================================
     LOAD ADMIN-MANAGED DATA
  ===================================================== */

  const loadDashboardData = React.useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      /*
       * Fetch stations, facilities and documents.
       * These are public GET APIs.
       */

      const [
        stationResponse,
        facilityResponse,
        documentResponse,
      ] = await Promise.all([
        fetchAPI<ApiResponse<Station>>(API_ENDPOINTS.stations),
        fetchAPI<ApiResponse<Facility>>(API_ENDPOINTS.facilities),
        fetchAPI<ApiResponse<RailwayDocument>>(API_ENDPOINTS.documents),
      ]);

      if (!stationResponse.success) {
        throw new Error('Unable to load railway stations.');
      }

      if (!facilityResponse.success) {
        throw new Error('Unable to load railway facilities.');
      }

      const stationData = stationResponse.results || [];
      const facilityData = facilityResponse.results || [];
      const documentData = documentResponse.results || [];

      setStations(stationData);
      setFacilities(facilityData);
      setDocuments(documentData);

      /*
       * Fetch platforms from each station detail API.
       *
       * Your backend station detail response contains:
       * {
       *   success: true,
       *   station: {},
       *   platforms: [],
       *   facilities: []
       * }
       */

      const stationDetails = await Promise.all(
        stationData.map(async (station) => {
          try {
            const detail =
              await fetchAPI<StationDetailResponse>(
                API_ENDPOINTS.stationDetail(station.id)
              );

            return detail.success ? detail.platforms || [] : [];
          } catch (err) {
            console.error(
              `Unable to load platforms for station ${station.id}`,
              err
            );

            return [];
          }
        })
      );

      const allPlatforms = stationDetails.flat();

      setPlatforms(allPlatforms);
    } catch (err) {
      console.error('Dashboard API error:', err);

      setError(
        err instanceof Error
          ? err.message
          : 'Unable to load dashboard data.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  /* =====================================================
     INITIAL API CALL
  ===================================================== */

  React.useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  /* =====================================================
     AI SUGGESTIONS
  ===================================================== */

  const suggestedPrompts = [
    {
      id: 1,
      label: 'Refund and Cancellation',
      prompt: 'Explain railway ticket refund and cancellation rules.',
    },
    {
      id: 2,
      label: 'Luggage Rules',
      prompt: 'What is the permitted luggage allowance in Indian Railways?',
    },
    {
      id: 3,
      label: 'Tatkal Booking',
      prompt: 'Explain Tatkal ticket booking rules and timings.',
    },
  ];

  /* =====================================================
     QUICK ACTIONS
  ===================================================== */

  const quickActions = [
    {
      label: 'Find Platform',
      sub: 'Station map & FOB',
      icon: Compass,
      href: '/navigation',
    },
    {
      label: 'Find Facility',
      sub: 'ATM, food & lounge',
      icon: MapPin,
      href: '/facilities',
    },
    {
      label: 'Ask AI Agent',
      sub: 'Rules & queries',
      icon: Bot,
      href: '/assistant',
      highlight: true,
    },
    {
      label: 'Scan Ticket',
      sub: 'OCR PNR extract',
      icon: ScanLine,
      href: '/ticket-scanner',
    },
    {
      label: 'Report Problem',
      sub: 'Station grievance',
      icon: AlertTriangle,
      href: '/complaints/new',
    },
  ];

  /* =====================================================
     ACCESSIBILITY HELPER
  ===================================================== */

  const isAccessible = (value?: boolean | string) => {
    if (typeof value === 'boolean') return value;

    if (typeof value === 'string') {
      return ['yes', 'true', 'accessible'].includes(
        value.toLowerCase()
      );
    }

    return false;
  };

  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">

      {/* =================================================
          1. HEADER
      ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getGreeting()}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            How can RailVision AI help you today?
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />

            <span className="text-slate-600 dark:text-slate-300">
              Helpline:
            </span>

            <span className="font-bold text-[#0B2545] dark:text-blue-300 font-mono">
              139
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={loadDashboardData}
            disabled={loading}
            className="gap-2"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${
                loading ? 'animate-spin' : ''
              }`}
            />

            Refresh
          </Button>
        </div>
      </div>

      {/* =================================================
          2. SEARCH
      ================================================= */}

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsCommandOpen(true)}
          className="w-full flex items-center justify-between h-13 px-4 sm:px-5 rounded-xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400" />

            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Search station, platform, facility or ask anything...
            </span>
          </div>

          <ArrowRight className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* =================================================
          3. ERROR MESSAGE
      ================================================= */}

      {error && (
        <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-950/30 dark:border-red-900">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                Unable to load dashboard data
              </p>

              <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                {error}
              </p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={loadDashboardData}
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* =================================================
          4. QUICK ACTIONS
      ================================================= */}

      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <Link
                key={action.label}
                href={action.href}
                className="group flex flex-col p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-blue-500/50 hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between mb-3">

                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform ${
                      action.highlight
                        ? 'bg-[#0B2545] text-white dark:bg-blue-600'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-600" />
                </div>

                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {action.label}
                </p>

                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                  {action.sub}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* =================================================
          5. ADMIN DATABASE STATISTICS
      ================================================= */}

      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Railway Information
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Live data managed by Railway Administration
            </p>
          </div>

          <Badge variant="success">
            {loading ? 'Syncing...' : 'Connected'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">

          {/* Stations */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>

                <Badge variant="secondary">
                  Stations
                </Badge>
              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                {loading ? '—' : stations.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Available railway stations
              </p>
            </CardContent>
          </Card>

          {/* Platforms */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-950 flex items-center justify-center">
                  <Layers className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>

                <Badge variant="secondary">
                  Platforms
                </Badge>
              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                {loading ? '—' : platforms.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Registered platforms
              </p>
            </CardContent>
          </Card>

          {/* Facilities */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 flex items-center justify-center">
                  <Accessibility className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                </div>

                <Badge variant="secondary">
                  Facilities
                </Badge>
              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                {loading ? '—' : facilities.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Available passenger facilities
              </p>
            </CardContent>
          </Card>

          {/* Documents */}

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-lg bg-orange-50 dark:bg-orange-950 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                </div>

                <Badge variant="secondary">
                  Documents
                </Badge>
              </div>

              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-3">
                {loading ? '—' : documents.length}
              </p>

              <p className="text-xs text-slate-500 mt-1">
                Available railway documents
              </p>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* =================================================
          6. STATIONS AND FACILITIES
      ================================================= */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ADMIN MANAGED STATIONS */}

        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Railway Stations
              </CardTitle>

              <Link
                href="/navigation"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading stations...
              </div>
            ) : stations.length === 0 ? (
              <div className="p-6 text-center">
                <Building2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />

                <p className="text-xs text-slate-500">
                  No stations available.
                </p>
              </div>
            ) : (
              stations.slice(0, 5).map((station) => (
                <div
                  key={station.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {station.station_name}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {station.station_code} • {station.city}, {station.state}
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1">
                      {station.platform_count} platforms
                    </p>
                  </div>

                  <Badge variant="secondary">
                    {station.station_code}
                  </Badge>
                </div>
              ))
            )}

          </CardContent>
        </Card>

        {/* ADMIN MANAGED FACILITIES */}

        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-semibold">
                Available Facilities
              </CardTitle>

              <Link
                href="/facilities"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                View All
              </Link>
            </div>
          </CardHeader>

          <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">

            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">
                Loading facilities...
              </div>
            ) : facilities.length === 0 ? (
              <div className="p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto text-slate-300 mb-2" />

                <p className="text-xs text-slate-500">
                  No facilities available.
                </p>
              </div>
            ) : (
              facilities.slice(0, 5).map((facility) => (
                <div
                  key={facility.id}
                  className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {facility.facility_name}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {facility.station_name} ({facility.station_code})
                    </p>

                    <p className="text-[11px] text-slate-400 mt-1">
                      {facility.facility_type}
                      {facility.platform_number
                        ? ` • Platform ${facility.platform_number}`
                        : ''}
                    </p>
                  </div>

                  {isAccessible(facility.accessibility) && (
                    <Badge variant="success">
                      Accessible
                    </Badge>
                  )}
                </div>
              ))
            )}

          </CardContent>
        </Card>

      </div>

      {/* =================================================
          7. CURRENT JOURNEY
      ================================================= */}

      <Card className="overflow-hidden border-blue-200/60 dark:border-blue-900/60">

        <div className="bg-linear-to-r from-[#0B2545] to-[#134074] text-white p-4 sm:p-5">
          <div className="flex items-center gap-2.5">
            <Train className="w-5 h-5 text-blue-300" />

            <div>
              <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                Current Journey
              </span>

              <h3 className="text-sm font-bold text-white">
                Your Journey Information
              </h3>
            </div>
          </div>
        </div>

        <CardContent className="p-5">

          <div className="text-center py-5">
            <Train className="w-10 h-10 mx-auto text-slate-300 mb-3" />

            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              No active journey found
            </h3>

            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
              Your journey details, train number, PNR, coach and berth
              will appear here when a passenger booking or journey API
              is connected.
            </p>

            <Link href="/ticket-scanner">
              <Button size="sm" className="mt-4 gap-2">
                <ScanLine className="w-4 h-4" />
                Scan Your Ticket
              </Button>
            </Link>
          </div>

        </CardContent>
      </Card>

      {/* =================================================
          8. RAILWAY DOCUMENTS
      ================================================= */}

      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Railway Passenger Documents
            </CardTitle>

            <Link
              href="/documents"
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All
            </Link>
          </div>
        </CardHeader>

        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Loading documents...
            </div>
          ) : documents.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />

              <p className="text-xs text-slate-500">
                No documents available.
              </p>
            </div>
          ) : (
            documents.slice(0, 5).map((document) => (
              <Link
                key={document.id}
                href="/documents"
                className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 truncate">
                      {document.title}
                    </p>

                    <p className="text-[11px] text-slate-500 mt-1">
                      {document.category} • {document.file_type.toUpperCase()}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              </Link>
            ))
          )}

        </CardContent>
      </Card>

      {/* =================================================
          9. AI SUGGESTIONS
      ================================================= */}

      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3 text-[#0B2545] dark:text-blue-400">
          <Sparkles className="w-4 h-4" />

          <h3 className="text-xs font-bold uppercase tracking-wider">
            AI Suggestions
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
          Ask our AI assistant about railway rules and passenger services.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {suggestedPrompts.map((prompt) => (
            <button
              key={prompt.id}
              onClick={() =>
                router.push(
                  `/assistant?q=${encodeURIComponent(prompt.prompt)}`
                )
              }
              className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:border-blue-300 transition-all group cursor-pointer"
            >
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700">
                {prompt.label}
              </p>

              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                {prompt.prompt}
              </p>
            </button>
          ))}

        </div>

        <Link href="/assistant" className="block mt-4">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Bot className="w-4 h-4" />
            Open Full AI Assistant
          </Button>
        </Link>
      </Card>

      {/* =================================================
          10. COMMAND PALETTE
      ================================================= */}

      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />

    </div>
  );
}