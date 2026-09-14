import * as React from 'react';
import Link from 'next/link';
import { Citation } from '@/types/assistant';
import { BookOpen, ExternalLink } from 'lucide-react';

interface CitationCardProps {
  citation: Citation;
}

export function CitationCard({ citation }: CitationCardProps) {
  return (
    <Link
      href={`/documents/${citation.documentId}`}
      className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 dark:hover:border-blue-800 transition-colors text-xs text-slate-700 dark:text-slate-300 group"
    >
      <BookOpen className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
      <span className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 truncate max-w-[200px]">
        {citation.documentTitle}
      </span>
      <span className="text-[10px] text-slate-400">§ {citation.section}</span>
      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500 shrink-0" />
    </Link>
  );
}
