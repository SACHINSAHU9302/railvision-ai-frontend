'use client';

import * as React from 'react';
import Link from 'next/link';
import { useComplaints } from '@/hooks/use-complaints';
import { ComplaintCard } from '@/components/complaints/complaint-card';
import { SearchBox } from '@/components/ui/search-box';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertTriangle, Plus, ShieldCheck } from 'lucide-react';
import { COMPLAINT_CATEGORIES } from '@/lib/constants';

export default function ComplaintsPage() {
  const { complaints, isLoading, error, refetch } = useComplaints();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filtered = complaints.filter((c) => {
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.trackingId.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.stationName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Passenger Grievance Redressal' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-[#0B2545] dark:text-blue-400" />
            <span>Passenger Grievance &amp; Issue Tracking</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time tracking of station cleanliness, escalator faults, and passenger assistance complaints.
          </p>
        </div>

        <Link href="/complaints/new">
          <Button size="md" className="gap-2 shrink-0">
            <Plus className="w-4 h-4" />
            <span>File New Grievance</span>
          </Button>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          <div className="w-full sm:w-64">
            <SearchBox
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search by Tracking ID or station..."
            />
          </div>

          <div className="w-40">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'resolved', label: 'Resolved' },
              ]}
            />
          </div>

          <div className="w-44">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: 'all', label: 'All Categories' },
                ...COMPLAINT_CATEGORIES.map((cat) => ({
                  value: cat.id,
                  label: cat.label,
                })),
              ]}
            />
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filtered.length} complaints
        </span>
      </div>

      {/* Complaints Grid */}
      {isLoading ? (
        <LoadingState message="Fetching grievance logs..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No grievances match criteria"
          description="There are currently no active complaints matching your search query or filters."
          actionLabel="File a Grievance"
          onAction={() => (window.location.href = '/complaints/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((complaint) => (
            <ComplaintCard key={complaint.id} complaint={complaint} />
          ))}
        </div>
      )}
    </div>
  );
}
