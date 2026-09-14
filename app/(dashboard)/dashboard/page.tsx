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
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_CURRENT_JOURNEY, DEMO_RECENT_ACTIVITIES } from '@/lib/demo/dashboard';
import { DEMO_SUGGESTED_PROMPTS } from '@/lib/demo/conversations';
import { CommandPalette } from '@/components/layout/command-palette';

export default function DashboardPage() {
  const router = useRouter();
  const [isCommandOpen, setIsCommandOpen] = React.useState(false);

  // Time-based polite greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning 👋';
    if (hour < 18) return 'Good Afternoon 👋';
    return 'Good Evening 👋';
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* 1. Header & Welcome Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            {getGreeting()}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            How can RailVision AI help you today?
          </p>
        </div>

        {/* Emergency Helpline Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="text-slate-600 dark:text-slate-300">Helpline:</span>
            <span className="font-bold text-[#0B2545] dark:text-blue-300 font-mono">139</span>
          </div>
        </div>
      </div>

      {/* 2. Universal Search Box */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsCommandOpen(true)}
          className="w-full flex items-center justify-between h-13 px-4 sm:px-5 rounded-xl border border-slate-300/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-slate-400 dark:hover:border-slate-700 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
            <span className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-normal">
              Search station, platform, facility or ask anything...
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-block text-[11px] font-medium text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
              Press ⌘K
            </span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* 3. Quick Actions Grid */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
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
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <Link
                key={idx}
                href={action.href}
                className="group flex flex-col p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs hover:border-blue-500/50 hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 ${
                      action.highlight
                        ? 'bg-[#0B2545] text-white dark:bg-blue-600'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5 transition-all" />
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

      {/* 4. Current Journey Card & AI Suggestions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Journey Overview (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="overflow-hidden border-blue-200/60 dark:border-blue-900/60">
            <div className="bg-linear-to-r from-[#0B2545] to-[#134074] text-white p-4 sm:p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Train className="w-5 h-5 text-blue-300" />
                <div>
                  <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                    Current Journey
                  </span>
                  <h3 className="text-sm font-bold text-white">
                    {DEMO_CURRENT_JOURNEY.trainNumber} • {DEMO_CURRENT_JOURNEY.trainName}
                  </h3>
                </div>
              </div>
              <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/40">
                {DEMO_CURRENT_JOURNEY.status}
              </Badge>
            </div>

            <CardContent className="p-5 space-y-5">
              {/* Route line */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">Boarding Station</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {DEMO_CURRENT_JOURNEY.fromStation} ({DEMO_CURRENT_JOURNEY.fromStationCode})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Departure: {DEMO_CURRENT_JOURNEY.departureTime} HRS</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 uppercase font-semibold">Destination</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {DEMO_CURRENT_JOURNEY.toStation} ({DEMO_CURRENT_JOURNEY.toStationCode})
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Arrival: {DEMO_CURRENT_JOURNEY.arrivalTime}</span>
                  </p>
                </div>
              </div>

              {/* Passenger & Platform Details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Platform</p>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                    Platform {DEMO_CURRENT_JOURNEY.platform}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Coach / Berth</p>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {DEMO_CURRENT_JOURNEY.coach} / {DEMO_CURRENT_JOURNEY.berth}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">PNR Number</p>
                  <p className="text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                    {DEMO_CURRENT_JOURNEY.pnrNumber}
                  </p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Status</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Confirmed</span>
                  </p>
                </div>
              </div>

              {/* Navigation Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                <p className="text-xs text-slate-500">
                  Departure from <strong>Paharganj side (Gate 1)</strong> recommended for Platform 2.
                </p>
                <Link href="/navigation/ndls">
                  <Button size="sm" className="w-full sm:w-auto gap-1.5">
                    <Compass className="w-4 h-4" />
                    <span>Navigate Platform 2</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Recent Activity</CardTitle>
                <span className="text-[11px] text-slate-400">Last 24 Hours</span>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
              {DEMO_RECENT_ACTIVITIES.map((activity) => (
                <Link
                  key={activity.id}
                  href={activity.link}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                >
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {activity.subtitle}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] text-slate-400">{activity.timestamp}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-600 transition-colors" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right column: AI Suggestions & Station Shortcuts (1 col) */}
        <div className="space-y-6">
          {/* AI Suggestions Box */}
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3 text-[#0B2545] dark:text-blue-400">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">AI Suggestions</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 leading-relaxed">
              Tap a prompt to consult the multi-agent RAG assistant with verified documents:
            </p>
            <div className="space-y-2">
              {DEMO_SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.id}
                  onClick={() => router.push(`/assistant?q=${encodeURIComponent(prompt.prompt)}`)}
                  className="w-full text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 hover:border-blue-300 dark:hover:border-blue-900 transition-all group cursor-pointer"
                >
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                    {prompt.label}
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    &ldquo;{prompt.prompt}&rdquo;
                  </p>
                </button>
              ))}
            </div>

            <Link href="/assistant" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full gap-1.5 text-xs">
                <Bot className="w-3.5 h-3.5" />
                <span>Open Full AI Assistant</span>
              </Button>
            </Link>
          </Card>

          {/* Quick Railway Guidelines Card */}
          <Card className="p-5 bg-slate-50/70 dark:bg-slate-900/60">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Railway Passenger Charter
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Access verified cancellation refund slabs, baggage limits, and medical booth locations.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/documents/doc-refund-cancellation"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between p-2 rounded-md hover:bg-white dark:hover:bg-slate-800"
              >
                <span>Refund &amp; Cancellation Slabs</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/documents/doc-tatkal-rules"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between p-2 rounded-md hover:bg-white dark:hover:bg-slate-800"
              >
                <span>Tatkal AC &amp; Non-AC Timings</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>
              <Link
                href="/documents/doc-luggage-allowance"
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between p-2 rounded-md hover:bg-white dark:hover:bg-slate-800"
              >
                <span>Permitted Luggage Allowance</span>
                <ChevronRight className="w-3 h-3 text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>
      </div>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </div>
  );
}
