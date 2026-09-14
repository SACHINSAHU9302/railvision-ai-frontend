'use client';

import * as React from 'react';
import { useDocuments } from '@/hooks/use-documents';
import { DocumentCard } from '@/components/documents/document-card';
import { SearchBox } from '@/components/ui/search-box';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { BookOpen, ShieldCheck } from 'lucide-react';
import { DocumentCategory } from '@/types/document';

const CATEGORIES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Documents' },
  { id: 'refund', label: 'Refund & Cancellation' },
  { id: 'luggage', label: 'Luggage Policy' },
  { id: 'tatkal', label: 'Tatkal Scheme' },
  { id: 'divyangjan', label: 'Divyangjan & Senior Citizen' },
  { id: 'general', label: 'General Commercial Rules' },
];

export default function DocumentsPage() {
  const { documents, isLoading, error, refetch } = useDocuments();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const filtered = documents.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    if (!matchesCategory) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      doc.title.toLowerCase().includes(q) ||
      doc.summary.toLowerCase().includes(q) ||
      doc.circularNumber.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: 'Railway Rules & Knowledge Base' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-[#0B2545] dark:text-blue-400" />
            <span>Railway Rules &amp; Official Circulars</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Verified Indian Railway commercial circulars, passenger rights, and cancellation guidelines.
          </p>
        </div>

        <div className="w-full sm:w-72">
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search circulars or rule topics..."
          />
        </div>
      </div>

      {/* RAG Verification Banner */}
      <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/60 flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300">
        <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <span>
          These indexed documents power the Multi-Agent RAG Assistant. Every assistant response links directly to these official clauses.
        </span>
      </div>

      {/* Category Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
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

      {/* Grid */}
      {isLoading ? (
        <LoadingState message="Loading railway circulars..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No circulars found"
          description={`No railway documents matched "${searchQuery}". Try selecting "All Documents" or checking your search terms.`}
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery('');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((doc) => (
            <DocumentCard key={doc.id} document={doc} />
          ))}
        </div>
      )}
    </div>
  );
}
