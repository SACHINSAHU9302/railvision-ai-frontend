import * as React from 'react';
import { ComplaintUpdate } from '@/types/complaint';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface ComplaintStatusTimelineProps {
  timeline: ComplaintUpdate[];
}

export function ComplaintStatusTimeline({ timeline }: ComplaintStatusTimelineProps) {
  return (
    <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
      {timeline.map((event, idx) => {
        const isLatest = idx === timeline.length - 1;

        return (
          <div key={idx} className="relative flex items-start gap-4">
            {/* Dot marker */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                isLatest
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border border-slate-300 dark:border-slate-700'
              }`}
            >
              {isLatest ? <CheckCircle2 className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
            </div>

            {/* Content card */}
            <div className="flex-1 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 capitalize">
                  {event.status.replace('_', ' ')}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {event.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                {event.message}
              </p>

              {event.updatedBy && (
                <p className="text-[10px] text-slate-400 font-mono mt-2">
                  Action Taken By: {event.updatedBy}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
