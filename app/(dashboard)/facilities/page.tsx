'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useFacilities } from '@/hooks/use-facilities';
import { useStations } from '@/hooks/use-stations';
import { FacilityCard } from '@/components/facilities/facility-card';
import { SearchBox } from '@/components/ui/search-box';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { FACILITY_CATEGORIES } from '@/lib/constants';
import { FacilityType } from '@/types/facility';
import { MapPin, SlidersHorizontal, Accessibility } from 'lucide-react';

export default function FacilitiesPage() {
  const searchParams = useSearchParams();
  const initialStation = searchParams.get('stationId') || '';

  const { stations } = useStations();
  const { facilities, filters, updateFilters, isLoading, error, refetch } = useFacilities({
    stationId: initialStation || undefined,
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedStation, setSelectedStation] = React.useState<string>(initialStation);
  const [sortBy, setSortBy] = React.useState<'distance' | 'name' | 'platform'>('distance');
  const [accessibleOnly, setAccessibleOnly] = React.useState<boolean>(false);

  // Sync state with custom hook filters
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    updateFilters({ category: catId === 'all' ? undefined : (catId as FacilityType) });
  };

  const handleStationChange = (stnId: string) => {
    setSelectedStation(stnId);
    updateFilters({ stationId: stnId || undefined });
  };

  const handleSortChange = (sort: 'distance' | 'name' | 'platform') => {
    setSortBy(sort);
    updateFilters({ sortBy: sort });
  };

  const handleAccessibleToggle = () => {
    const next = !accessibleOnly;
    setAccessibleOnly(next);
    updateFilters({ accessibleOnly: next });
  };

  // Client text filter
  const filteredList = facilities.filter((f) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.exactLocation.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Facility Finder' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-[#0B2545] dark:text-blue-400" />
            <span>Station Amenities &amp; Facilities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Locate IRCTC lounges, ATMs, accessible restrooms, medical posts, and ticket counters.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search amenities or services..."
          />
        </div>
      </div>

      {/* Category Filter Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {FACILITY_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B2545] text-white dark:bg-blue-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter Controls Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3">
          {/* Station selector */}
          <div className="w-48">
            <Select
              value={selectedStation}
              onChange={(e) => handleStationChange(e.target.value)}
              options={[
                { value: '', label: 'All Stations' },
                ...stations.map((s) => ({
                  value: s.id,
                  label: `${s.code} - ${s.name}`,
                })),
              ]}
            />
          </div>

          {/* Sort selector */}
          <div className="w-44">
            <Select
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value as 'distance' | 'name' | 'platform')}
              options={[
                { value: 'distance', label: 'Nearest First' },
                { value: 'platform', label: 'By Platform' },
                { value: 'name', label: 'Alphabetical' },
              ]}
            />
          </div>

          {/* Accessibility filter toggle */}
          <button
            type="button"
            onClick={handleAccessibleToggle}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
              accessibleOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800'
                : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            <Accessibility className="w-3.5 h-3.5" />
            <span>Divyangjan Friendly</span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredList.length} amenities
        </span>
      </div>

      {/* Facilities Cards Grid */}
      {isLoading ? (
        <LoadingState message="Finding facilities near platforms..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filteredList.length === 0 ? (
        <EmptyState
          title="No facilities found"
          description="No amenities match your current station or filter criteria. Try clearing the filters."
          actionLabel="Reset Filters"
          onAction={() => {
            setSelectedCategory('all');
            setSelectedStation('');
            setSearchQuery('');
            setAccessibleOnly(false);
            updateFilters({ category: undefined, stationId: undefined, accessibleOnly: false });
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((facility) => (
            <FacilityCard key={facility.id} facility={facility} />
          ))}
        </div>
      )}
    </div>
  );
}
