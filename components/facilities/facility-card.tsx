'use client';

import * as React from 'react';
import Link from 'next/link';
import { Facility } from '@/types/facility';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Clock,
  Accessibility,
  ArrowUpRight,
  Phone,
  UtensilsCrossed,
  CreditCard,
  Bath,
  Armchair,
  HeartPulse,
  Ticket,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FacilityCardProps {
  facility: Facility;
}

export function FacilityCard({ facility }: FacilityCardProps) {
  const { toast } = useToast();

  const getIcon = () => {
    switch (facility.type) {
      case 'waiting_room':
        return <Armchair className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'atm':
        return <CreditCard className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'toilet':
        return <Bath className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />;
      case 'food':
        return <UtensilsCrossed className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'medical':
        return <HeartPulse className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'ticket_counter':
        return <Ticket className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <MapPin className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
    }
  };

  const handleNavigate = () => {
    toast({
      title: `Directions to ${facility.name}`,
      description: `Located near Platform ${facility.platformNear} (${facility.exactLocation}). Approx ${facility.distanceMeters} meters away.`,
      type: 'info',
    });
  };

  return (
    <Card className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
              {getIcon()}
            </div>
            <Badge variant="rail" size="sm" className="font-mono text-[10px]">
              {facility.stationCode}
            </Badge>
          </div>

          <Badge
            variant={facility.status === 'available' ? 'success' : 'warning'}
            size="sm"
            className="capitalize text-[11px]"
          >
            {facility.status.replace('_', ' ')}
          </Badge>
        </div>

        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-2">
          {facility.name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
          {facility.description}
        </p>

        {/* Location & Distance specs */}
        <div className="mt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">Near PF {facility.platformNear} • {facility.exactLocation}</span>
          </div>

          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{facility.operatingHours}</span>
          </div>

          {facility.contactNumber && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{facility.contactNumber}</span>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#0B2545] dark:text-blue-400 font-mono">
            ~{facility.distanceMeters}m
          </span>
          {facility.isAccessible && (
            <span className="inline-flex items-center text-[10px] text-emerald-600 dark:text-emerald-400 font-medium gap-0.5">
              <Accessibility className="w-3 h-3" />
              <span>Accessible</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <Link href={`/facilities/${facility.id}`}>
            <Button variant="ghost" size="sm" className="text-xs px-2.5">
              Details
            </Button>
          </Link>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleNavigate}
            className="text-xs gap-1"
          >
            <span>Navigate</span>
            <ArrowUpRight className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
