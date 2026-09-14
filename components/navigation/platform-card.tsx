'use client';

import * as React from 'react';
import { Platform } from '@/types/station';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Accessibility, ArrowUpRight, Clock, Train } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PlatformCardProps {
  platform: Platform;
  isSelected?: boolean;
  onSelect?: () => void;
  stationCode: string;
}

export function PlatformCard({
  platform,
  isSelected,
  onSelect,
  stationCode,
}: PlatformCardProps) {
  const { toast } = useToast();

  const handleGuideMe = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast({
      title: `Navigation Route: Platform ${platform.number}`,
      description: `Follow Central FOB signs. ${platform.hasElevator ? 'Elevator available.' : 'Escalator available.'}`,
      type: 'info',
    });
    onSelect?.();
  };

  return (
    <Card
      onClick={onSelect}
      className={`p-4 transition-all cursor-pointer ${
        isSelected
          ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
          : 'hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Platform number badge & direction */}
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-[#0B2545] dark:bg-blue-600 text-white flex flex-col items-center justify-center font-bold text-sm shrink-0">
            <span className="text-[9px] uppercase font-medium leading-none text-blue-200">PF</span>
            <span>{platform.number}</span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Platform {platform.number}
              </h4>
              <Badge
                variant={platform.status === 'active' ? 'success' : 'warning'}
                size="sm"
              >
                {platform.status.toUpperCase()}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              {platform.direction}
            </p>
          </div>
        </div>

        {/* Guide button */}
        <Button
          variant="secondary"
          size="sm"
          onClick={handleGuideMe}
          className="shrink-0 gap-1 text-xs"
        >
          <span>Guide</span>
          <ArrowUpRight className="w-3 h-3" />
        </Button>
      </div>

      {/* Train Info if scheduled */}
      {platform.currentTrain && (
        <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <Train className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 shrink-0" />
            <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
              {platform.currentTrain}
            </span>
          </div>
          {platform.expectedDeparture && (
            <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0 font-medium">
              <Clock className="w-3 h-3" />
              Dep: {platform.expectedDeparture}
            </span>
          )}
        </div>
      )}

      {/* Accessibility Pills */}
      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
        <span className="flex items-center gap-1">
          <Accessibility className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span>{platform.isAccessible ? 'Divyangjan Friendly' : 'Standard Access'}</span>
        </span>
        <span>•</span>
        <span>{platform.hasElevator ? 'Elevator (Lift)' : 'Stairs Only'}</span>
        {platform.hasEscalator && (
          <>
            <span>•</span>
            <span>Escalator</span>
          </>
        )}
      </div>
    </Card>
  );
}
