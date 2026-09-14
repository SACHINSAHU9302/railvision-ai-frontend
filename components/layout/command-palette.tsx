'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Compass, MapPin, BookOpen, Bot, ArrowRight, CornerDownLeft } from 'lucide-react';
import { DEMO_STATIONS } from '@/lib/demo/stations';
import { DEMO_FACILITIES } from '@/lib/demo/facilities';
import { DEMO_DOCUMENTS } from '@/lib/demo/documents';
import { cn } from '@/lib/utils';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClose = () => {
    setQuery('');
    onClose();
  };

  React.useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by layout listener
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  // Filter results
  const matchedStations = DEMO_STATIONS.filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q) || s.city.toLowerCase().includes(q)
  ).slice(0, 2);

  const matchedFacilities = DEMO_FACILITIES.filter(
    (f) => !q || f.name.toLowerCase().includes(q) || f.type.toLowerCase().includes(q) || f.exactLocation.toLowerCase().includes(q)
  ).slice(0, 3);

  const matchedDocs = DEMO_DOCUMENTS.filter(
    (d) => !q || d.title.toLowerCase().includes(q) || d.summary.toLowerCase().includes(q)
  ).slice(0, 2);

  const hasAnyResults = matchedStations.length > 0 || matchedFacilities.length > 0 || matchedDocs.length > 0;

  const handleSelect = (href: string) => {
    handleClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4">
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-xl rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800 gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stations, platforms, facilities, or ask AI..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-4">
          {/* Ask AI prompt action */}
          {query && (
            <button
              onClick={() => handleSelect(`/assistant?q=${encodeURIComponent(query)}`)}
              className="w-full flex items-center justify-between p-2.5 rounded-lg bg-blue-50/70 dark:bg-blue-950/40 text-[#0B2545] dark:text-blue-300 hover:bg-blue-100/70 dark:hover:bg-blue-900/60 transition-colors text-left"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Bot className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span className="text-xs font-medium truncate">
                  Ask RailVision Assistant: &ldquo;{query}&rdquo;
                </span>
              </div>
              <CornerDownLeft className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>
          )}

          {/* Stations Category */}
          {matchedStations.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>Stations</span>
              </p>
              <div className="space-y-1">
                {matchedStations.map((station) => (
                  <button
                    key={station.id}
                    onClick={() => handleSelect(`/navigation/${station.id}`)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 flex items-center gap-2">
                        <span>{station.name}</span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-mono">
                          {station.code}
                        </span>
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {station.city} • {station.platformsCount} Platforms
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Facilities Category */}
          {matchedFacilities.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                <span>Amenities & Facilities</span>
              </p>
              <div className="space-y-1">
                {matchedFacilities.map((facility) => (
                  <button
                    key={facility.id}
                    onClick={() => handleSelect(`/facilities?stationId=${facility.stationId}`)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {facility.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {facility.stationCode} • Near Platform {facility.platformNear} ({facility.distanceMeters}m)
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Documents Category */}
          {matchedDocs.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2.5 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Railway Documents (RAG)</span>
              </p>
              <div className="space-y-1">
                {matchedDocs.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelect(`/documents/${doc.id}`)}
                    className="w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors group"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-900 dark:text-slate-100 truncate">
                        {doc.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        {doc.category.toUpperCase()} • {doc.ragChunkCount} indexed sections
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {!hasAnyResults && (
            <div className="py-8 text-center">
              <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                No matching results found
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Try searching for &quot;NDLS&quot;, &quot;Platform 3&quot;, &quot;ATM&quot;, or ask AI
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span>Search RailVision Navigation &amp; Assistance Index</span>
          <div className="flex items-center gap-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 font-mono text-[10px]">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
}
