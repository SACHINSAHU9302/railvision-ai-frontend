'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useFacilities } from '@/hooks/use-facilities';
import { Facility } from '@/types/facility';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Accessibility,
  Phone,
  ArrowUpRight,
  Share2,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

export default function FacilityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const facilityId = params.facilityId as string;

  const { getSingleFacility } = useFacilities();
  const [facility, setFacility] = React.useState<Facility | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getSingleFacility(facilityId);
      setFacility(res);
      setIsLoading(false);
    }
    load();
  }, [facilityId]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({
      title: 'Link Copied',
      description: 'Facility location copied to clipboard.',
      type: 'success',
    });
  };

  const handleNavigate = () => {
    toast({
      title: `Guiding to ${facility?.name}`,
      description: `Follow overhead signage toward Platform ${facility?.platformNear}. Approx ${facility?.distanceMeters}m walk.`,
      type: 'info',
    });
  };

  if (isLoading) return <LoadingState message="Loading facility details..." />;

  if (!facility) {
    return (
      <EmptyState
        title="Facility Not Found"
        description="The amenity or service requested is not currently listed."
        actionLabel="Back to Facilities"
        onAction={() => router.push('/facilities')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Facility Finder', href: '/facilities' },
          { label: facility.name },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <Link href="/facilities">
            <Button variant="outline" size="icon" className="mt-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
                {facility.name}
              </h1>
              <Badge variant="rail" size="sm" className="font-mono text-xs">
                {facility.stationCode}
              </Badge>
              <Badge
                variant={facility.status === 'available' ? 'success' : 'warning'}
                size="sm"
                className="capitalize"
              >
                {facility.status.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {facility.exactLocation} • Near Platform {facility.platformNear}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </Button>
          <Button size="sm" onClick={handleNavigate} className="gap-1.5 text-xs">
            <span>Guide Me Now</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>

      {/* Detail Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 md:col-span-2 space-y-6">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Facility Description &amp; Services
            </h3>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {facility.description}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Exact Location</p>
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>{facility.exactLocation}</span>
              </p>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Proximity</p>
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-1 font-mono">
                Approx. {facility.distanceMeters} meters from central concourse
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <p className="text-[11px] font-semibold text-slate-400 uppercase">Operating Timings</p>
              <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{facility.operatingHours}</span>
              </p>
            </div>
            {facility.contactNumber && (
              <div>
                <p className="text-[11px] font-semibold text-slate-400 uppercase">Contact / Intercom</p>
                <p className="text-xs font-medium text-slate-900 dark:text-slate-100 mt-1 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{facility.contactNumber}</span>
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* Right side info / Report problem */}
        <div className="space-y-4">
          <Card className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Accessibility Support
            </h4>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
              <Accessibility className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{facility.isAccessible ? 'Wheelchair & Barrier Free' : 'Standard Physical Access'}</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Step-free access is supported through Central Foot-Over-Bridge Lift 2 landing.
            </p>
          </Card>

          <Card className="p-5 bg-slate-50 dark:bg-slate-900/60">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              <span>Facility Issue?</span>
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
              If this facility is closed, unhygienic, or malfunctioning, report it directly to station maintenance.
            </p>
            <Link href={`/complaints/new?station=${facility.stationCode}&platform=${facility.platformNear}`}>
              <Button variant="outline" size="sm" className="w-full text-xs">
                Log Grievance for this Facility
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
