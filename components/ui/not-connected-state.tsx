import * as React from 'react';
import { ServerOff, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface NotConnectedStateProps {
  featureName?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

export function NotConnectedState({
  featureName = 'Backend Service',
  description = 'This feature will be available when the RailVision AI backend (Multi-Agent RAG / OCR / Speech service) is connected.',
  onRetry,
  className,
}: NotConnectedStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-xs',
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-[#0B2545] dark:text-blue-400 mb-3.5 border border-blue-100 dark:border-blue-900/50">
        <ServerOff className="w-6 h-6" />
      </div>
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[11px] font-medium border border-amber-200 dark:border-amber-800/60 mb-2">
        <span>Backend Connection Required</span>
      </div>
      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
        {featureName} Offline
      </h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-2">
        {onRetry && (
          <Button variant="outline" size="sm" onClick={onRetry} className="gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Check Connection</span>
          </Button>
        )}
        <a
          href="/dashboard"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1 px-3 py-1.5"
        >
          <span>Return to Dashboard</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
