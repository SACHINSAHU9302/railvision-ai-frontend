import * as React from 'react';
import Link from 'next/link';
import { Complaint } from '@/types/complaint';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, MapPin, AlertTriangle } from 'lucide-react';

interface ComplaintCardProps {
  complaint: Complaint;
}

export function ComplaintCard({ complaint }: ComplaintCardProps) {
  const getStatusBadge = () => {
    switch (complaint.status) {
      case 'resolved':
        return <Badge variant="success" size="sm">RESOLVED</Badge>;
      case 'in_progress':
        return <Badge variant="rail" size="sm">IN PROGRESS</Badge>;
      case 'assigned':
        return <Badge variant="secondary" size="sm">ASSIGNED</Badge>;
      case 'acknowledged':
        return <Badge variant="outline" size="sm">ACKNOWLEDGED</Badge>;
      default:
        return <Badge variant="warning" size="sm">SUBMITTED</Badge>;
    }
  };

  const getUrgencyBadge = () => {
    if (complaint.urgency === 'emergency') {
      return <Badge variant="danger" size="sm">EMERGENCY</Badge>;
    }
    if (complaint.urgency === 'urgent') {
      return <Badge variant="warning" size="sm">URGENT</Badge>;
    }
    return null;
  };

  return (
    <Card className="p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-slate-700 transition-all">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
              {complaint.trackingId}
            </span>
            {getUrgencyBadge()}
          </div>
          {getStatusBadge()}
        </div>

        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1">
          {complaint.title}
        </h3>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
          {complaint.description}
        </p>

        <div className="mt-3 space-y-1 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {complaint.stationName} ({complaint.stationCode}) • Platform {complaint.platform || 'General'}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Logged {complaint.createdAt}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium capitalize">
          Cat: {complaint.category.replace('_', ' ')}
        </span>

        <Link href={`/complaints/${complaint.id}`}>
          <Button variant="secondary" size="sm" className="text-xs gap-1">
            <span>Track Progress</span>
            <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
