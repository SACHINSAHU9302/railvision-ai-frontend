import * as React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center text-xs text-slate-500 dark:text-slate-400', className)}>
      <ol className="flex items-center gap-1.5 flex-wrap">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="font-medium text-slate-900 dark:text-slate-200 truncate max-w-[200px]">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
