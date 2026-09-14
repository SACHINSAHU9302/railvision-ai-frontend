'use client';

import * as React from 'react';
import { useStations } from '@/hooks/use-stations';
import { SearchBox } from '@/components/ui/search-box';
import { StationCard } from '@/components/navigation/station-card';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Compass, Info } from 'lucide-react';

export default function NavigationPage() {
  const { stations, isLoading, error, refetch } = useStations();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredStations = stations.filter((s) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Station Navigation' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#0B2545] dark:text-blue-400" />
            <span>Station Navigation &amp; Platform Layouts</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose a railway station to explore platforms, accessibility lifts, and concourse maps.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full sm:w-72">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter by station name or code..."
          />
        </div>
      </div>

      {/* Controlled dataset banner */}
      <div className="p-3.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span>
          Currently displaying 3 major hub terminals (New Delhi, Mumbai CSMT, and Howrah Junction) in controlled demo mode. Additional stations will load dynamically when connected to backend API.
        </span>
      </div>

      {/* Main Grid */}
      {isLoading ? (
        <LoadingState message="Loading station directory..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredStations.length === 0 ? (
        <EmptyState
          title="No stations found"
          description={`No railway station matched "${searchQuery}". Try searching for NDLS, CSMT, or HWH.`}
          actionLabel="Clear Search"
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </div>
      )}
    </div>
  );
}
