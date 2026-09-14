'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useComplaints } from '@/hooks/use-complaints';
import { useStations } from '@/hooks/use-stations';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { FileUpload } from '@/components/ui/file-upload';
import { COMPLAINT_CATEGORIES } from '@/lib/constants';
import { ComplaintCategory, ComplaintUrgency, Complaint } from '@/types/complaint';
import { useToast } from '@/hooks/use-toast';
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

export default function NewComplaintPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { stations } = useStations();
  const { submitNewComplaint } = useComplaints();

  const prefilledStation = searchParams.get('station') || 'NDLS';
  const prefilledPlatform = searchParams.get('platform') || '';

  const [stationCode, setStationCode] = React.useState(prefilledStation);
  const [platform, setPlatform] = React.useState(prefilledPlatform);
  const [category, setCategory] = React.useState<ComplaintCategory>('cleanliness');
  const [urgency, setUrgency] = React.useState<ComplaintUrgency>('normal');
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [contactEmail, setContactEmail] = React.useState('passenger@railvision.ai');
  const [contactPhone, setContactPhone] = React.useState('+91 98765 43210');
  const [photo, setPhoto] = React.useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submittedComplaint, setSubmittedComplaint] = React.useState<Complaint | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast({
        title: 'Missing Details',
        description: 'Please provide a brief title and issue description.',
        type: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const created = await submitNewComplaint({
        stationCode,
        platform: platform || undefined,
        category,
        urgency,
        title,
        description,
        contactEmail,
        contactPhone,
        hasPhoto: !!photo,
      });

      setSubmittedComplaint(created);
      toast({
        title: 'Grievance Registered',
        description: `Tracking ID: ${created.trackingId}`,
        type: 'success',
      });
    } catch (err) {
      toast({
        title: 'Submission Failed',
        description: err instanceof Error ? err.message : 'Could not log complaint.',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Grievance Redressal', href: '/complaints' },
          { label: 'File Grievance' },
        ]}
      />

      {/* Success View */}
      {submittedComplaint ? (
        <Card className="p-8 text-center space-y-6 border-emerald-300 dark:border-emerald-900 animate-in fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Grievance Registered Successfully
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Your issue has been routed to the on-duty Station Master and maintenance dispatch team.
            </p>
          </div>

          {/* Tracking ID Badge Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 max-w-sm mx-auto flex items-center justify-between">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400 text-left">Your Tracking ID</p>
              <p className="text-lg font-mono font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                {submittedComplaint.trackingId}
              </p>
            </div>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(submittedComplaint.trackingId);
                toast({ title: 'Copied', description: 'Tracking ID copied to clipboard.', type: 'info' });
              }}
              className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500"
              title="Copy ID"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {/* Expected Resolution SLA */}
          <div className="flex items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-blue-500" />
            <span>Target Resolution Window: <strong>Within 45–60 minutes</strong></span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href={`/complaints/${submittedComplaint.id}`}>
              <Button size="md" className="w-full sm:w-auto gap-2">
                <span>Track Progress Live</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/complaints">
              <Button variant="outline" size="md" className="w-full sm:w-auto">
                Back to All Complaints
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        /* Form View */
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100 dark:border-slate-800">
            <Link href="/complaints">
              <Button variant="outline" size="icon">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Log Station Grievance or Maintenance Request
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Directly alerts platform supervisors and technical staff.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Station & Platform */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Railway Station"
                  value={stationCode}
                  onChange={(e) => setStationCode(e.target.value)}
                  options={[
                    ...stations.map((s) => ({
                      value: s.code,
                      label: `${s.code} - ${s.name}`,
                    })),
                  ]}
                  required
                />
              </div>

              <div>
                <Input
                  label="Platform / Location Area"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="e.g. Platform 2, Near Escalator FOB-1"
                  required
                />
              </div>
            </div>

            {/* Category & Urgency */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Select
                  label="Issue Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                  options={[
                    ...COMPLAINT_CATEGORIES.map((c) => ({
                      value: c.id,
                      label: c.label,
                    })),
                  ]}
                  required
                />
              </div>

              <div>
                <Select
                  label="Urgency Level"
                  value={urgency}
                  onChange={(e) => setUrgency(e.target.value as ComplaintUrgency)}
                  options={[
                    { value: 'normal', label: 'Normal (Routine Maintenance)' },
                    { value: 'urgent', label: 'Urgent (Water / Escalator / Coach defect)' },
                    { value: 'emergency', label: 'Emergency (Medical / Safety Immediate)' },
                  ]}
                  required
                />
              </div>
            </div>

            {/* Title */}
            <Input
              label="Subject / Brief Summary"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Broken water tap causing overflow near Coach B3"
              required
            />

            {/* Description */}
            <Textarea
              label="Detailed Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the exact location, coaches involved, or assistance needed..."
              rows={4}
              required
            />

            {/* Photo upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Attach Photographic Evidence (Optional)
              </label>
              <FileUpload
                onFileSelect={(file) => setPhoto(file)}
                accept="image/*"
                maxSizeMB={5}
              />
              {photo && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  ✓ Photo attached: {photo.name}
                </p>
              )}
            </div>

            {/* Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Contact Phone Number"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
              <Input
                label="Email Address for Status Alerts"
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="passenger@railvision.ai"
                required
              />
            </div>

            <Button
              type="submit"
              size="lg"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              className="w-full gap-2 mt-4"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Submit Grievance to Station Master</span>
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
}
