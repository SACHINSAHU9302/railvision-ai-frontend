import * as React from 'react';
import Link from 'next/link';
import { RailwayDocument } from '@/types/document';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface DocumentCardProps {
  document: RailwayDocument;
}

export function DocumentCard({ document }: DocumentCardProps) {
  return (
    <Card className="p-5 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xs transition-all group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="rail" size="sm" className="font-mono text-[10px]">
            {document.circularNumber}
          </Badge>
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{document.effectiveDate}</span>
          </span>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mt-1">
          {document.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {document.summary}
        </p>

        {/* Key Takeaways Preview */}
        <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1">
          {document.keyTakeaways.slice(0, 2).map((takeaway, idx) => (
            <p key={idx} className="text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
              <span className="text-blue-600 dark:text-blue-400 font-bold shrink-0">•</span>
              <span className="truncate">{takeaway}</span>
            </p>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium truncate max-w-[160px]">
          Auth: {document.authority}
        </span>

        <Link href={`/documents/${document.id}`}>
          <Button variant="secondary" size="sm" className="text-xs gap-1">
            <span>Read Rules</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
