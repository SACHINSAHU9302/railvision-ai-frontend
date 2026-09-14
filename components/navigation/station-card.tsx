import * as React from 'react';
import Link from 'next/link';
import { Station } from '@/types/station';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Compass, PhoneCall } from 'lucide-react';

interface StationCardProps {
  station: Station;
}

export function StationCard({ station }: StationCardProps) {
  return (
    <Card className="p-5 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-sm transition-all group">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <Badge variant="rail" size="sm" className="font-mono text-xs px-2 py-0.5">
            {station.code}
          </Badge>
          <span className="text-xs text-slate-500 font-medium">
            Category {station.category} • {station.platformsCount} Platforms
          </span>
        </div>

        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {station.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {station.city}, {station.state} • {station.zone}
        </p>

        <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
          {station.layoutDescription}
        </p>

        {/* Amenity summary tags */}
        <div className="mt-4 flex flex-wrap gap-1.5 text-[10px] text-slate-500">
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            {station.amenities.waitingRooms} Waiting Lounges
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            {station.amenities.atms} ATMs
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
            {station.amenities.foodOutlets} Food Plazas
          </span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-400 flex items-center gap-1">
          <PhoneCall className="w-3 h-3" />
          <span>Helpline: {station.helplineNumber}</span>
        </span>

        <Link href={`/navigation/${station.id}`}>
          <Button size="sm" className="gap-1.5 text-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Open Layout</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
