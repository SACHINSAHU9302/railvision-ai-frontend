'use client';

import * as React from 'react';
import { useStations } from '@/hooks/use-stations';
import { SearchBox } from '@/components/ui/search-box';
import { StationCard } from '@/components/navigation/station-card';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Compass } from 'lucide-react';

export default function NavigationPage() {
  const { stations, isLoading, error, refetch } = useStations();

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredStations = stations.filter((s) => {
    const q = searchQuery.toLowerCase().trim();

    return (
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">

      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Station Navigation' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Compass className="w-6 h-6 text-[#0B2545] dark:text-blue-400" />

            <span>
              Station Navigation &amp; Platform Layouts
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Choose a railway station to explore platforms, accessibility lifts, and concourse maps.
          </p>
        </div>

        {/* Search */}
        <div className="w-full sm:w-72">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Filter by station name or code..."
          />
        </div>

      </div>

      {/* Station Directory */}
      {isLoading ? (
        <LoadingState message="Loading station directory..." />
      ) : error ? (
        <ErrorState
          message={error}
          onRetry={refetch}
        />
      ) : filteredStations.length === 0 ? (
        <EmptyState
          title="No stations found"
          description={
            searchQuery
              ? `No railway station matched "${searchQuery}". Try another station name or code.`
              : 'No railway stations are currently available.'
          }
          actionLabel={searchQuery ? 'Clear Search' : undefined}
          onAction={() => setSearchQuery('')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {filteredStations.map((station) => (
            <StationCard
              key={station.id}
              station={station}
            />
          ))}

        </div>
      )}

    </div>
  );
}