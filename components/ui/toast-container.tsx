'use client';

import * as React from 'react';
import { useToast } from '@/hooks/use-toast';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />,
          info: <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />,
        };

        const borderMap = {
          success: 'border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-slate-900',
          warning: 'border-amber-200 dark:border-amber-800/80 bg-white dark:bg-slate-900',
          error: 'border-rose-200 dark:border-rose-800/80 bg-white dark:bg-slate-900',
          info: 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900',
        };

        return (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 rounded-lg border p-3.5 shadow-lg transition-all animate-in slide-in-from-bottom-2 duration-150',
              borderMap[toast.type || 'info']
            )}
          >
            {iconMap[toast.type || 'info']}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-none">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer -mr-1 -mt-1 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
