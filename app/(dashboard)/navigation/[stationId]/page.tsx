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

  const {
    currentStation,
    isLoading,
    error,
    refetch,
  } = useStations(stationId);

  const [selectedPlatform, setSelectedPlatform] =
    React.useState<number | null>(null);

  if (isLoading) {
    return (
      <LoadingState message="Loading station details..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={refetch}
      />
    );
  }

  if (!currentStation) {
    return (
      <EmptyState
        title="Station not found"
        description="The requested station could not be found in the backend database."
        actionLabel="Back to All Stations"
        onAction={() => router.push('/navigation')}
      />
    );
  }

  const station = currentStation;

  const platforms = station.platforms || [];
  const importantPoints = station.importantPoints || [];
  const amenities = station.amenities;

  const accessiblePlatforms = platforms.filter(
    (platform) => platform.isAccessible
  ).length;

  const hasAccessibility =
    accessiblePlatforms > 0 || amenities.wheelchairAccess;

  const totalFacilities =
    amenities.toilets +
    amenities.atms +
    amenities.foodOutlets +
    amenities.waitingRooms +
    amenities.medicalKiosks;

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Station Navigation',
            href: '/navigation',
          },
          {
            label: `${station.name} (${station.code})`,
          },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">

        <div className="flex items-start gap-3">

          <Link href="/navigation">
            <Button
              variant="outline"
              size="icon"
              className="mt-1"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>

            <div className="flex items-center gap-2 flex-wrap">

              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {station.name}
              </h1>

              <Badge
                variant="rail"
                size="sm"
                className="font-mono text-xs"
              >
                {station.code}
              </Badge>

            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {station.city}, {station.state}
              {' • '}
              {station.platformsCount} Platforms
            </p>

            {station.address && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {station.address}
              </p>
            )}

          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">

          <Link href={`/facilities?stationId=${station.id}`}>
            <Button
              variant="secondary"
              size="sm"
              className="gap-1.5 text-xs"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Browse Station Amenities</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Button>
          </Link>

          <div className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs font-mono font-medium text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <PhoneCall className="w-3.5 h-3.5 text-blue-600" />
            <span>Railway Helpline: 139</span>
          </div>

        </div>
      </div>

      {/* Station Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* Platforms */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <p className="text-[10px] uppercase font-semibold text-slate-400">
            Total Platforms
          </p>

          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {station.platformsCount}
          </p>

        </div>

        {/* Waiting Rooms */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <p className="text-[10px] uppercase font-semibold text-slate-400">
            Waiting Rooms
          </p>

          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5">
            {amenities.waitingRooms}
          </p>

        </div>

        {/* ATMs */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <p className="text-[10px] uppercase font-semibold text-slate-400">
            ATM Kiosks
          </p>

          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {amenities.atms}
          </p>

        </div>

        {/* Food Outlets */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <p className="text-[10px] uppercase font-semibold text-slate-400">
            Food Outlets
          </p>

          <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
            {amenities.foodOutlets}
          </p>

        </div>

        {/* Medical */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <p className="text-[10px] uppercase font-semibold text-slate-400">
            Medical Posts
          </p>

          <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
            {amenities.medicalKiosks}
          </p>

        </div>

        {/* Accessibility */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">

          <p className="text-[10px] uppercase font-semibold text-slate-400">
            Accessibility
          </p>

          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">

            <Accessibility className="w-3.5 h-3.5" />

            <span>
              {hasAccessibility
                ? 'Available'
                : 'Not Available'}
            </span>

          </p>

        </div>

      </div>

      {/* Station Layout Map */}
      <StationLayoutMap
        station={station}
        selectedPlatform={selectedPlatform}
        onSelectPlatform={(platform) =>
          setSelectedPlatform(platform)
        }
      />

      {/* Platform Directory & Facilities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Platform Directory */}
        <div className="lg:col-span-2 space-y-3">

          <div className="flex items-center justify-between">

            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">

              <Train className="w-4 h-4 text-blue-600" />

              <span>
                Platform Directory & Accessibility
              </span>

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

            {platforms.length > 0 ? (
              platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  stationCode={station.code}
                  isSelected={
                    selectedPlatform === platform.number
                  }
                  onSelect={() =>
                    setSelectedPlatform(platform.number)
                  }
                />
              ))
            ) : (
              <Card className="p-6 text-center">

                <Train className="w-8 h-8 text-slate-400 mx-auto mb-2" />

                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  No Platforms Available
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Platform records have not been added by the administrator.
                </p>

              </Card>
            )}

          </div>

        </div>

        {/* Important Facilities */}
        <div className="space-y-4">

          <Card className="p-5">

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">

              <Compass className="w-4 h-4 text-[#0B2545] dark:text-blue-400" />

              <span>Station Facilities</span>

            </h3>

            <div className="space-y-3">

              {importantPoints.length > 0 ? (
                importantPoints.map((point) => (
                  <div
                    key={point.id}
                    className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-xs"
                  >

                    <div className="flex items-center justify-between mb-1">

                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        {point.name}
                      </span>

                      <Badge
                        variant="outline"
                        size="sm"
                        className="capitalize text-[10px]"
                      >
                        {point.type.replace('_', ' ')}
                      </Badge>

                    </div>

                    <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-relaxed">
                      {point.locationDescription}
                    </p>

                    {point.platformNear > 0 && (
                      <p className="text-[10px] text-blue-600 dark:text-blue-400 font-medium mt-1">
                        Near Platform {point.platformNear}
                      </p>
                    )}

                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No additional facility location details are available for this station.
                </p>
              )}

            </div>

          </Card>

          {/* Facility Summary */}
          <Card className="p-5">

            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Facility Summary
            </h3>

            <div className="space-y-3 text-xs">

              <div className="flex justify-between">
                <span className="text-slate-500">Toilets</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {amenities.toilets}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">ATMs</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {amenities.atms}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Food Outlets</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {amenities.foodOutlets}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Waiting Rooms</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {amenities.waitingRooms}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-slate-500">Medical Posts</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {amenities.medicalKiosks}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between">
                <span className="text-slate-500">
                  Total Facilities
                </span>

                <span className="font-bold text-blue-600">
                  {totalFacilities}
                </span>
              </div>

            </div>

          </Card>

          {/* Assistant Prompt */}
          <Card className="p-5 bg-blue-50/50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">

            <h4 className="text-xs font-bold text-[#0B2545] dark:text-blue-300 uppercase tracking-wider mb-2">
              Need Direct Guidance?
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
              Ask RailVision Assistant about platforms and available facilities at {station.name}.
            </p>

            <Link
              href={`/assistant?q=${encodeURIComponent(
                `Find platform and facilities at ${station.code}`
              )}`}
            >
              <Button
                size="sm"
                className="w-full text-xs"
              >
                Ask Assistant About {station.code}
              </Button>
            </Link>

          </Card>

        </div>

      </div>

    </div>
  );
}