'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileUpload } from '@/components/ui/file-upload';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { scanTicketFile, fetchTicketDetails } from '@/lib/api/ticket';
import { ExtractedTicket } from '@/types/ticket';
import { useToast } from '@/hooks/use-toast';
import {
  ScanLine,
  Train,
  Clock,
  Compass,
  Bot,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

export default function TicketScannerPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [manualPnr, setManualPnr] = React.useState('');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [processingStep, setProcessingStep] = React.useState<string>('');
  const [extractedTicket, setExtractedTicket] = React.useState<ExtractedTicket | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFileUpload = async (file: File) => {
    setSelectedFile(file);
    setError(null);
    setIsProcessing(true);

    try {
      setProcessingStep('Validating and uploading ticket image...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStep('Scanning document boundaries & optical text recognition (OCR)...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStep('Extracting PNR, train schedule, and coach allocation...');
      const ticket = await scanTicketFile(file);

      setProcessingStep('Cross-referencing station concourse & platform schematics...');
      await new Promise((r) => setTimeout(r, 500));

      setExtractedTicket(ticket);
      toast({
        title: 'Ticket OCR Complete',
        description: `Recognized PNR: ${ticket.pnrNumber} (${ticket.trainName})`,
        type: 'success',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to parse ticket. Please try manual entry.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleManualLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualPnr.trim()) return;
    setError(null);
    setIsProcessing(true);

    try {
      setProcessingStep('Querying PNR reservation system...');
      const ticket = await fetchTicketDetails(manualPnr.trim());
      setExtractedTicket(ticket);
      toast({
        title: 'PNR Retrieved',
        description: `Train: ${ticket.trainNumber} • Platform ${ticket.platform}`,
        type: 'success',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'PNR query failed.');
    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setManualPnr('');
    setExtractedTicket(null);
    setError(null);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Ticket Scanner & PNR OCR' }]} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ScanLine className="w-6 h-6 text-[#0B2545] dark:text-blue-400" />
            <span>Ticket Scanner &amp; Journey Navigator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Upload e-Ticket PDF or image (IRCTC UTS/PRS) for instant platform and coach navigation.
          </p>
        </div>

        {extractedTicket && (
          <Button variant="outline" size="sm" onClick={handleReset} className="gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Scan Another Ticket</span>
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-800 dark:text-rose-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Processing State with Simulated Realistic Steps */}
      {isProcessing && (
        <Card className="p-8 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mx-auto animate-spin">
            <RefreshCw className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Processing Ticket Document
          </h3>
          <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">
            {processingStep || 'Analyzing ticket data...'}
          </p>
          <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">
            <div className="w-2/3 h-full bg-blue-600 rounded-full animate-pulse" />
          </div>
        </Card>
      )}

      {/* Result Display if Extracted */}
      {!isProcessing && extractedTicket && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <Card className="overflow-hidden border-blue-200/80 dark:border-blue-900">
            {/* Header Banner */}
            <div className="bg-[#0B2545] text-white p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-semibold text-blue-200 uppercase tracking-wider">
                  Recognized e-Ticket Details
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {extractedTicket.trainNumber} • {extractedTicket.trainName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success" size="sm" className="bg-emerald-500/20 text-emerald-100 border-emerald-400/40">
                  {extractedTicket.status}
                </Badge>
                <span className="text-xs font-mono text-blue-200 bg-blue-900/60 px-2 py-1 rounded">
                  PNR: {extractedTicket.pnrNumber}
                </span>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Origin -> Destination Route */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <p className="text-[11px] uppercase font-semibold text-slate-400">Boarding Origin</p>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {extractedTicket.fromStation} ({extractedTicket.fromStationCode})
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Departure: {extractedTicket.departureTime} • {extractedTicket.date}</span>
                  </p>
                </div>
                <div>
                  <p className="text-[11px] uppercase font-semibold text-slate-400">Destination</p>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {extractedTicket.toStation} ({extractedTicket.toStationCode})
                  </p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Arrival: {extractedTicket.arrivalTime}</span>
                  </p>
                </div>
              </div>

              {/* Passenger Berth & Platform Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60">
                  <p className="text-[10px] uppercase font-semibold text-blue-600 dark:text-blue-300">
                    Departure Platform
                  </p>
                  <p className="text-xl font-extrabold text-[#0B2545] dark:text-blue-400 mt-0.5">
                    Platform {extractedTicket.platform}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">At {extractedTicket.fromStationCode}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Coach / Berth</p>
                  <p className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {extractedTicket.coach} / {extractedTicket.berth}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Berth Type: {extractedTicket.berthType}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Travel Class</p>
                  <p className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                    {extractedTicket.travelClass}
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Quota: {extractedTicket.quota}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
                  <p className="text-[10px] uppercase font-semibold text-slate-400">Passenger</p>
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100 mt-1 truncate">
                    {extractedTicket.passengerName}
                  </p>
                  <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                    {extractedTicket.status}
                  </p>
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                <Link href={`/navigation/ndls`} className="flex-1 min-w-[200px]">
                  <Button size="md" className="w-full gap-2">
                    <Compass className="w-4 h-4" />
                    <span>Navigate Platform {extractedTicket.platform} Layout</span>
                  </Button>
                </Link>

                <Link
                  href={`/assistant?q=Find%20Coach%20${extractedTicket.coach}%20position%20for%20train%20${extractedTicket.trainNumber}`}
                  className="flex-1 min-w-[200px]"
                >
                  <Button variant="secondary" size="md" className="w-full gap-2">
                    <Bot className="w-4 h-4" />
                    <span>Coach {extractedTicket.coach} Position &amp; Rules</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Upload Zone & Manual PNR Input (Shown when not extracted yet) */}
      {!isProcessing && !extractedTicket && (
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Option 1: Upload Ticket Image or PDF</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Supported formats: JPG, PNG, PDF (IRCTC e-Ticket screenshot, UTS mobile QR, or printed reservation slip).
            </p>

            <FileUpload
              onFileSelect={handleFileUpload}
              accept=".pdf,image/png,image/jpeg,image/webp"
              maxSizeMB={10}
            />

            {/* Demo Sample Ticket Button */}
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
              <span>Need a test file?</span>
              <button
                type="button"
                onClick={() => {
                  const demoFile = new File(['fake-ticket-blob'], 'irctc_eticket_2847193021.pdf', {
                    type: 'application/pdf',
                  });
                  handleFileUpload(demoFile);
                }}
                className="text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Test with Sample Rajdhani e-Ticket</span>
              </button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              <span>Option 2: Enter 10-Digit PNR Number</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              If you don&apos;t have a ticket image file handy, enter your reservation PNR number directly.
            </p>

            <form onSubmit={handleManualLookup} className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Input
                  value={manualPnr}
                  onChange={(e) => setManualPnr(e.target.value)}
                  placeholder="e.g. 2847193021"
                  maxLength={10}
                  className="font-mono text-sm tracking-widest"
                />
              </div>
              <Button type="submit" size="md" disabled={!manualPnr.trim()} className="gap-2">
                <span>Fetch PNR Details</span>
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
