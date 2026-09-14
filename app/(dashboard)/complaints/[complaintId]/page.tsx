'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useComplaints } from '@/hooks/use-complaints';
import { Complaint } from '@/types/complaint';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ComplaintStatusTimeline } from '@/components/complaints/complaint-status-timeline';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/hooks/use-toast';
import {
  ArrowLeft,
  Clock,
  MapPin,
  PhoneCall,
  Share2,
  CheckCircle2,
  AlertTriangle,
  User,
  Send,
} from 'lucide-react';

export default function ComplaintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const complaintId = params.complaintId as string;

  const { getSingleComplaint } = useComplaints();
  const [complaint, setComplaint] = React.useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [followUpText, setFollowUpText] = React.useState('');
  const [isSendingFollowUp, setIsSendingFollowUp] = React.useState(false);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getSingleComplaint(complaintId);
      setComplaint(res);
      setIsLoading(false);
    }
    load();
  }, [complaintId]);

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!followUpText.trim() || !complaint) return;

    setIsSendingFollowUp(true);
    setTimeout(() => {
      const updated: Complaint = {
        ...complaint,
        timeline: [
          ...complaint.timeline,
          {
            status: complaint.status,
            timestamp: 'Just now',
            message: `Passenger Update: "${followUpText.trim()}"`,
            updatedBy: 'Passenger (You)',
          },
        ],
      };
      setComplaint(updated);
      setFollowUpText('');
      setIsSendingFollowUp(false);
      toast({
        title: 'Follow-Up Added',
        description: 'Your note has been appended to this grievance file.',
        type: 'success',
      });
    }, 600);
  };

  if (isLoading) return <LoadingState message="Loading grievance tracker..." />;

  if (!complaint) {
    return (
      <EmptyState
        title="Grievance Record Not Found"
        description="The tracking ID or complaint record could not be found."
        actionLabel="Back to Complaints"
        onAction={() => router.push('/complaints')}
      />
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Grievance Redressal', href: '/complaints' },
          { label: complaint.trackingId },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <Link href="/complaints">
            <Button variant="outline" size="icon" className="mt-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-base font-bold text-slate-900 dark:text-slate-100">
                {complaint.trackingId}
              </span>
              <Badge variant={complaint.status === 'resolved' ? 'success' : 'rail'} size="sm">
                {complaint.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {complaint.urgency === 'emergency' && (
                <Badge variant="danger" size="sm">EMERGENCY</Badge>
              )}
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1">
              {complaint.title}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {complaint.stationName} ({complaint.stationCode}) • Platform {complaint.platform || 'General concourse'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a href="tel:139" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs font-semibold border border-rose-200 dark:border-rose-900">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Emergency: 139</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Timeline (2 cols) */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
              Action Timeline &amp; Escalation
            </h3>
            <ComplaintStatusTimeline timeline={complaint.timeline} />
          </Card>

          {/* Follow-up / Additional note box */}
          <Card className="p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Add Follow-up Information
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Need to add more details or confirm resolution with the supervisor?
            </p>
            <form onSubmit={handleSendFollowUp} className="space-y-3">
              <Textarea
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                placeholder="Type your message or update for the maintenance squad..."
                rows={3}
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  isLoading={isSendingFollowUp}
                  disabled={!followUpText.trim() || isSendingFollowUp}
                  className="gap-1.5 text-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Update</span>
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar Info (1 col) */}
        <div className="space-y-4">
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Grievance Details
            </h4>
            <div className="text-xs space-y-2">
              <div>
                <span className="text-slate-400 block text-[11px]">Logged At:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{complaint.createdAt}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Category:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">
                  {complaint.category.replace('_', ' ')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Contact Registered:</span>
                <span className="font-medium text-slate-800 dark:text-slate-200">{complaint.contactPhone}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assigned Unit:</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {complaint.assignedTo || 'Station Superintendent Duty Desk'}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-5 bg-slate-50 dark:bg-slate-900/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Need Navigation Back?
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-3">
              Explore the station schematic for {complaint.stationName} to find facilities or staff booths.
            </p>
            <Link href="/navigation/ndls">
              <Button variant="outline" size="sm" className="w-full text-xs">
                View Station Concourse Map
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
