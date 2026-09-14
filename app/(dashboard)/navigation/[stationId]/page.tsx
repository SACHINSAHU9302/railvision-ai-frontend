'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStations } from '@/hooks/use-stations';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { StationLayoutMap } from '@/components/navigation/station-layout-map';
import { PlatformCard } from '@/components/navigation/platform-card';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import {
  Compass,
  MapPin,
  Train,
  ArrowLeft,
  PhoneCall,
  Accessibility,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function StationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const stationId = params.stationId as string;

  const { currentStation, isLoading, error, refetch } = useStations(stationId);
  const [selectedPlatform, setSelectedPlatform] = React.useState<number | null>(null);

  if (isLoading) {
    return <LoadingState message="Loading station layout schematic..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={refetch} />;
  }

  if (!currentStation) {
    return (
      <EmptyState
        title="Station not found"
        description="The requested station ID was not found in the current index."
        actionLabel="Back to All Stations"
        onAction={() => router.push('/navigation')}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: 'Station Navigation', href: '/navigation' },
          { label: `${currentStation.name} (${currentStation.code})` },
        ]}
      />

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <Link href="/navigation">
            <Button variant="outline" size="icon" className="mt-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {currentStation.name}
              </h1>
              <Badge variant="rail" size="sm" className="font-mono text-xs">
                {currentStation.code}
              </Badge>
              <Badge variant="secondary" size="sm">
                Category {currentStation.category}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {currentStation.city}, {currentStation.state} • {currentStation.zone} • {currentStation.platformsCount} Operational Platforms
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/facilities?stationId=${currentStation.id}`}>
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <MapPin className="w-3.5 h-3.5" />
              <span>Browse Station Amenities</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Button>
          </Link>
          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>139</span>
          </div>
        </div>
      </div>

      {/* Station Overview & Amenities Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Total Platforms</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {currentStation.platformsCount}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Executive Lounges</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {currentStation.amenities.waitingRooms}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-semibold text-slate-400">ATM Kiosks</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {currentStation.amenities.atms}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Food Outlets</p>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {currentStation.amenities.foodOutlets}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Medical Posts</p>
          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {currentStation.amenities.medicalKiosks}
          </p>
        </div>
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <p className="text-[10px] uppercase font-semibold text-slate-400">Accessibility</p>
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <Accessibility className="w-3.5 h-3.5" />
            <span>Divyangjan Ready</span>
          </p>
        </div>
      </div>

      {/* Interactive Schematic Layout */}
      <StationLayoutMap
        station={currentStation}
        selectedPlatform={selectedPlatform}
        onSelectPlatform={(pf) => setSelectedPlatform(pf)}
      />

      {/* Platform Breakdown & Important Concourse Points */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platforms List (2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Train className="w-4 h-4 text-blue-600" />
              <span>Platform Directory &amp; Accessibility</span>
            </h3>
            {selectedPlatform && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedPlatform(null)}
                className="text-xs text-blue-600 hover:text-blue-700"
              >
                Clear Selection
              </Button>
            )}
          </div>

          <div className="space-y-3">
            {currentStation.platforms.map((platform) => (
              <PlatformCard
                key={platform.id}
                platform={platform}
                stationCode={currentStation.code}
                isSelected={selectedPlatform === platform.number}
                onSelect={() => setSelectedPlatform(platform.number)}
              />
            ))}
          </div>
        </div>

        {/* Important Points & Gates (1 col) */}
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-[#0B2545] dark:text-blue-400" />
              <span>Key Concourse Hubs &amp; Gates</span>
            </h3>

            <div className="space-y-3">
              {currentStation.importantPoints.map((pt) => (
                <div
                  key={pt.id}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {pt.name}
                    </span>
                    <Badge variant="outline" size="sm" className="capitalize text-[10px]">
                      {pt.type.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                    {pt.locationDescription}
                  </p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                    Near Platform {pt.platformNear}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          {/* Assistant Prompt card */}
          <Card className="p-5 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
            <h4 className="text-xs font-bold text-[#0B2545] dark:text-blue-300 uppercase tracking-wider mb-2">
              Need Direct Guidance?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Ask RailVision Assistant where your coach or waiting room is located at {currentStation.name}.
            </p>
            <Link href={`/assistant?q=Find%20Platform%20at%20${currentStation.code}`}>
              <Button size="sm" className="w-full text-xs">
                Ask Assistant About {currentStation.code}
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
