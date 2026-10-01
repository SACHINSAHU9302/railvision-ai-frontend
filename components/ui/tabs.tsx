'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  items?: TabItem[];
  activeId?: string;
  activeTab?: string;
  onChange: (id: string) => void;
  className?: string;
  variant?: 'underline' | 'pills';
}

export function Tabs({
  items = [],
  activeId,
  activeTab,
  onChange,
  className,
  variant = 'underline',
}: TabsProps) {
  /*
   * Support both prop names:
   *
   * activeId  -> standard Tabs API
   * activeTab -> existing AdminPage API
   *
   * This keeps the component backward compatible.
   */
  const currentActiveId = activeId ?? activeTab ?? '';

  /*
   * Safety fallback.
   *
   * Even if a page accidentally passes undefined/null,
   * the component will not crash on .map().
   */
  const safeItems = Array.isArray(items) ? items : [];

  if (variant === 'pills') {
    return (
      <div
        className={cn(
          'flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg overflow-x-auto',
          className
        )}
      >
        {safeItems.map((tab) => {
          const isActive = tab.id === currentActiveId;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer',
                isActive
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              {tab.icon}

              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={cn(
                    'ml-1 px-1.5 py-0.5 text-[10px] rounded-full font-semibold',
                    isActive
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300'
                      : 'bg-slate-200 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                  )}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={cn(
        'flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto',
        className
      )}
    >
      {safeItems.map((tab) => {
        const isActive = tab.id === currentActiveId;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-medium border-b-2 transition-all whitespace-nowrap cursor-pointer -mb-px',
              isActive
                ? 'border-[#0B2545] text-[#0B2545] dark:border-blue-500 dark:text-blue-400 font-semibold'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:border-slate-300'
            )}
          >
            {tab.icon}

            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}