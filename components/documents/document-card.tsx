import * as React from 'react';
import Link from 'next/link';
import { RailwayDocument } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  BookOpen,
  Calendar,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface DocumentCardProps {
  document: RailwayDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  // Safely handle fields that may not exist in backend data.
  const circularNumberValue = (
    document as RailwayDocument & { circularNumber?: unknown }
  ).circularNumber;
  const circularNumber =
    typeof circularNumberValue === 'string' &&
    circularNumberValue.trim()
      ? circularNumberValue
      : 'Railway Document';

  const effectiveDate =
    typeof document.effectiveDate === 'string' &&
    document.effectiveDate.trim()
      ? document.effectiveDate
      : 'Date not available';

  const summary =
    typeof document.summary === 'string' && document.summary.trim()
      ? document.summary
      : 'No summary is available for this document.';

  const authorityValue = (
    document as RailwayDocument & { authority?: unknown }
  ).authority;
  const authority =
    typeof authorityValue === 'string' && authorityValue.trim()
      ? authorityValue
      : 'Railway Knowledge Base';

  const keyTakeawaysValue = (
    document as RailwayDocument & { keyTakeaways?: unknown }
  ).keyTakeaways;
  const keyTakeaways = Array.isArray(keyTakeawaysValue)
    ? keyTakeawaysValue.filter(
        (item): item is string => typeof item === 'string'
      )
    : [];

  return (
    <Card className="p-5 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xs transition-all group">
      <div>
        {/* Document metadata */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="rail" size="sm" className="font-mono text-[10px]">
            {circularNumber}
          </Badge>

          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 shrink-0" />
            <span>{effectiveDate}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1">
          {document.title || 'Untitled Railway Document'}
        </h3>

        {/* Summary */}
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {summary}
        </p>

        {/* Key takeaways */}
        {keyTakeaways.length > 0 && (
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
            {keyTakeaways.slice(0, 2).map((takeaway, idx) => (
              <p
                key={idx}
                className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5"
              >
                <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">
                  •
                </span>

                <span className="truncate">{takeaway}</span>
              </p>
            ))}
          </div>
        )}

        {/* Source information */}
        <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">{authority}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[160px]">
          {document.category || 'general'}
        </span>

        <Link
          href={`/documents/${encodeURIComponent(String(document.id))}`}
          className="inline-flex"
        >
          <Button variant="secondary" size="sm" className="text-xs gap-1">
            <BookOpen className="w-3 h-3" />
            <span>Read Rules</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
