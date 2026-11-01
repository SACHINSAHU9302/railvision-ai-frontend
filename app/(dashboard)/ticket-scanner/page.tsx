'use client';

import * as React from 'react';
import Link from 'next/link';

import { FileUpload } from '@/components/ui/file-upload';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import {
  scanTicketFile,
  fetchTicketDetails,
} from '@/lib/api/ticket';

import type { ExtractedTicket } from '@/types/ticket';

import { useToast } from '@/hooks/use-toast';

import {
  ScanLine,
  Clock,
  Compass,
  Bot,
  AlertCircle,
  FileText,
  Search,
  RefreshCw,
  Train,
  CheckCircle2,
  User,
  Ticket,
} from 'lucide-react';

export default function TicketScannerPage() {
  const { toast } = useToast();

  const [selectedFile, setSelectedFile] =
    React.useState<File | null>(null);

  const [manualPnr, setManualPnr] = React.useState('');

  const [isProcessing, setIsProcessing] =
    React.useState(false);

  const [processingStep, setProcessingStep] =
    React.useState('');

  const [extractedTicket, setExtractedTicket] =
    React.useState<ExtractedTicket | null>(null);

  const [error, setError] =
    React.useState<string | null>(null);

  // ==========================================
  // 1. TICKET PDF / IMAGE UPLOAD
  // ==========================================

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    setSelectedFile(file);
    setError(null);
    setExtractedTicket(null);
    setIsProcessing(true);

    try {
      setProcessingStep('Validating ticket file...');

      const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/webp',
      ];

      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          'Please upload a PDF, JPG, PNG or WEBP file.'
        );
      }

      if (file.size === 0) {
        throw new Error('Selected file is empty.');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size must be less than 10 MB.');
      }

      setProcessingStep('Uploading ticket to Django backend...');

      const ticket = await scanTicketFile(file);

      setProcessingStep('Processing extracted ticket information...');

      setExtractedTicket(ticket);

      toast({
        title: 'Ticket Uploaded Successfully',
        description: ticket.pnrNumber
          ? `PNR detected: ${ticket.pnrNumber}`
          : 'PDF uploaded and text extraction completed.',
        type: 'success',
      });

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to process ticket.';

      setError(message);

      toast({
        title: 'Ticket Upload Failed',
        description: message,
        type: 'error',
      });

    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // ==========================================
  // 2. MANUAL PNR VALIDATION
  // ==========================================

  const handleManualLookup = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const pnr = manualPnr.trim();

    if (!/^\d{10}$/.test(pnr)) {
      setError('Please enter a valid 10-digit PNR number.');
      return;
    }

    setError(null);
    setExtractedTicket(null);
    setIsProcessing(true);

    try {
      setProcessingStep('Validating PNR number...');

      const ticket = await fetchTicketDetails(pnr);

      setExtractedTicket(ticket);

      toast({
        title: 'PNR Format Validated',
        description: `PNR: ${pnr}`,
        type: 'success',
      });

    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'PNR validation failed.';

      setError(message);

      toast({
        title: 'PNR Validation Failed',
        description: message,
        type: 'error',
      });

    } finally {
      setIsProcessing(false);
      setProcessingStep('');
    }
  };

  // ==========================================
  // 3. RESET SCANNER
  // ==========================================

  const handleReset = () => {
    setSelectedFile(null);
    setManualPnr('');
    setExtractedTicket(null);
    setError(null);
    setProcessingStep('');
  };

  // ==========================================
  // 4. RESULT DISPLAY
  // ==========================================

  const ticket = extractedTicket;

  const hasTrainDetails = Boolean(
    ticket?.trainName || ticket?.trainNumber
  );

  const hasPlatform = Boolean(ticket?.platform);

  const hasCoach = Boolean(ticket?.coach);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">

      {/* Breadcrumb */}

      <Breadcrumb
        items={[
          { label: 'Ticket Scanner & PNR OCR' },
        ]}
      />

      {/* Page Header */}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b">

        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">

            <ScanLine className="w-6 h-6 text-blue-600" />

            Ticket Scanner & Journey Navigator

          </h1>

          <p className="text-sm text-slate-500 mt-2">
            Upload your railway ticket PDF or image to extract
            ticket information.
          </p>
        </div>

        {ticket && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Scan Another Ticket
          </Button>
        )}

      </div>

      {/* Error Message */}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-sm text-rose-700 dark:text-rose-300 flex items-center gap-3">

          <AlertCircle className="w-5 h-5 shrink-0" />

          <span>{error}</span>

        </div>
      )}

      {/* Processing */}

      {isProcessing && (
        <Card className="p-8 text-center space-y-4">

          <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-950 flex items-center justify-center mx-auto animate-spin">

            <RefreshCw className="w-7 h-7 text-blue-600" />

          </div>

          <h3 className="font-semibold text-slate-900 dark:text-white">
            Processing Ticket
          </h3>

          <p className="text-sm text-blue-600">
            {processingStep}
          </p>

          <div className="w-64 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto overflow-hidden">

            <div className="w-2/3 h-full bg-blue-600 animate-pulse" />

          </div>

        </Card>
      )}

      {/* ==========================================
          UPLOAD SECTION
      ========================================== */}

      {!isProcessing && !ticket && (
        <div className="space-y-6">

          <Card className="p-6">

            <h3 className="font-bold flex items-center gap-2 mb-2">

              <FileText className="w-5 h-5 text-blue-600" />

              Option 1: Upload Railway Ticket

            </h3>

            <p className="text-sm text-slate-500 mb-5">
              Supported formats: PDF, JPG, PNG and WEBP.
              Maximum file size: 10 MB.
            </p>

            <FileUpload
              selectedFile={selectedFile}
              onFileSelect={handleFileUpload}
              accept=".pdf,image/png,image/jpeg,image/webp"
              maxSizeMB={10}
            />

            {selectedFile && (
              <div className="mt-3 text-xs text-slate-500">
                Selected file: {selectedFile.name}
              </div>
            )}

          </Card>

          {/* Manual PNR */}

          <Card className="p-6">

            <h3 className="font-bold flex items-center gap-2 mb-2">

              <Search className="w-5 h-5 text-blue-600" />

              Option 2: Manual PNR Validation

            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Enter your 10-digit railway PNR number.
            </p>

            <form
              onSubmit={handleManualLookup}
              className="flex flex-col sm:flex-row gap-3"
            >

              <div className="flex-1">

                <Input
                  value={manualPnr}
                  onChange={(e) => {
                    setManualPnr(
                      e.target.value.replace(/\D/g, '').slice(0, 10)
                    );
                  }}
                  placeholder="Enter 10-digit PNR"
                  maxLength={10}
                  inputMode="numeric"
                  className="font-mono tracking-widest"
                />

              </div>

              <Button
                type="submit"
                disabled={
                  manualPnr.length !== 10 || isProcessing
                }
                className="gap-2"
              >

                <Search className="w-4 h-4" />

                Validate PNR

              </Button>

            </form>

            <p className="text-xs text-amber-600 mt-3">
              Note: This currently validates PNR format only.
              It does not retrieve live railway reservation details.
            </p>

          </Card>

        </div>
      )}

      {/* ==========================================
          EXTRACTED TICKET RESULT
      ========================================== */}

      {!isProcessing && ticket && (

        <div className="space-y-6">

          {/* Main Ticket Card */}

          <Card className="overflow-hidden border-blue-200 dark:border-blue-900">

            {/* Header */}

            <div className="bg-[#0B2545] text-white p-5">

              <div className="flex flex-col sm:flex-row justify-between gap-3">

                <div>

                  <p className="text-xs text-blue-200 uppercase font-semibold tracking-wider">

                    Recognized E-Ticket Details

                  </p>

                  <h2 className="text-lg font-bold mt-2">

                    {ticket.trainName || 'Train Details Not Extracted'}

                  </h2>

                  {ticket.trainNumber && (
                    <p className="text-sm text-blue-200">
                      Train Number: {ticket.trainNumber}
                    </p>
                  )}

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  <Badge
                    variant="success"
                    size="sm"
                  >
                    {ticket.status || 'Text Extracted'}
                  </Badge>

                  <span className="text-xs font-mono bg-blue-900 px-3 py-2 rounded">

                    PNR: {ticket.pnrNumber || 'Not Found'}

                  </span>

                </div>

              </div>

            </div>

            <CardContent className="p-6 space-y-6">

              {/* Extraction Status */}

              <div className="flex items-center gap-2 text-sm text-emerald-600">

                <CheckCircle2 className="w-5 h-5" />

                PDF text extraction completed.

              </div>

              {/* Route Information */}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pb-5 border-b">

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-400">
                    Boarding Origin
                  </p>

                  <p className="text-base font-bold mt-1">

                    {ticket.fromStation || 'Not extracted yet'}

                    {ticket.fromStationCode
                      ? ` (${ticket.fromStationCode})`
                      : ''}

                  </p>

                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">

                    <Clock className="w-4 h-4" />

                    Departure: {ticket.departureTime || 'Not available'}

                  </p>

                </div>

                <div>

                  <p className="text-xs uppercase font-semibold text-slate-400">
                    Destination
                  </p>

                  <p className="text-base font-bold mt-1">

                    {ticket.toStation || 'Not extracted yet'}

                    {ticket.toStationCode
                      ? ` (${ticket.toStationCode})`
                      : ''}

                  </p>

                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">

                    <Clock className="w-4 h-4" />

                    Arrival: {ticket.arrivalTime || 'Not available'}

                  </p>

                </div>

              </div>

              {/* Journey Information */}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">

                  <p className="text-xs text-slate-500">
                    Journey Date
                  </p>

                  <p className="font-bold mt-2 text-sm">
                    {ticket.journeyDate || ticket.date || 'Not available'}
                  </p>

                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">

                  <p className="text-xs text-slate-500">
                    Platform
                  </p>

                  <p className="font-bold mt-2">
                    {ticket.platform || 'Pending'}
                  </p>

                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">

                  <p className="text-xs text-slate-500">
                    Coach / Berth
                  </p>

                  <p className="font-bold mt-2">
                    {ticket.coach || 'Pending'}
                    {' / '}
                    {ticket.berth || 'Pending'}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {ticket.berthType || 'Not available'}
                  </p>

                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border">

                  <p className="text-xs text-slate-500">
                    Travel Class
                  </p>

                  <p className="font-bold mt-2">
                    {ticket.travelClass || 'Not available'}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Quota: {ticket.quota || 'Not available'}
                  </p>

                </div>

              </div>

              {/* Passenger Information */}

              <div className="border rounded-xl p-4">

                <h3 className="font-bold text-sm flex items-center gap-2 mb-3">

                  <User className="w-4 h-4 text-blue-600" />

                  Passenger Information

                </h3>

                {ticket.passengers && ticket.passengers.length > 0 ? (

                  <div className="overflow-x-auto">

                    <table className="w-full text-sm">

                      <thead>
                        <tr className="text-left border-b text-slate-500">

                          <th className="p-2">Name</th>
                          <th className="p-2">Age</th>
                          <th className="p-2">Coach</th>
                          <th className="p-2">Berth</th>
                          <th className="p-2">Status</th>

                        </tr>
                      </thead>

                      <tbody>

                        {ticket.passengers.map((passenger, index) => (

                          <tr key={index} className="border-b last:border-0">

                            <td className="p-2">
                              {passenger.name}
                            </td>

                            <td className="p-2">
                              {passenger.age}
                            </td>

                            <td className="p-2">
                              {passenger.coach || 'N/A'}
                            </td>

                            <td className="p-2">
                              {passenger.berthNumber || 'N/A'}
                            </td>

                            <td className="p-2">
                              {passenger.status}
                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                ) : (

                  <p className="text-sm text-slate-500">
                    Passenger information has not been extracted yet.
                  </p>

                )}

              </div>

              {/* Raw Extracted Text */}

              {ticket.rawTextPreview && (

                <div className="border rounded-xl p-4">

                  <h3 className="font-bold text-sm flex items-center gap-2 mb-3">

                    <FileText className="w-4 h-4 text-blue-600" />

                    Extracted Ticket Text

                  </h3>

                  <pre className="text-xs whitespace-pre-wrap break-words text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 rounded-lg p-4 max-h-72 overflow-y-auto">

                    {ticket.rawTextPreview}

                  </pre>

                </div>

              )}

              {/* Navigation Actions */}

              <div className="pt-4 border-t grid grid-cols-1 sm:grid-cols-2 gap-3">

                {hasPlatform ? (

                  <Link
                    href="/navigation/ndls"
                    className="w-full"
                  >

                    <Button className="w-full gap-2">

                      <Compass className="w-4 h-4" />

                      Navigate Platform {ticket.platform}

                    </Button>

                  </Link>

                ) : (

                  <Button disabled className="w-full">

                    Platform Details Pending

                  </Button>

                )}

                {hasCoach ? (

                  <Link
                    href={`/assistant?q=${encodeURIComponent(
                      `Find Coach ${ticket.coach} position for train ${ticket.trainNumber}`
                    )}`}
                    className="w-full"
                  >

                    <Button
                      variant="secondary"
                      className="w-full gap-2"
                    >

                      <Bot className="w-4 h-4" />

                      Coach Position & Rules

                    </Button>

                  </Link>

                ) : (

                  <Button
                    variant="secondary"
                    disabled
                    className="w-full"
                  >

                    Coach Details Pending

                  </Button>

                )}

              </div>

            </CardContent>

          </Card>

        </div>

      )}

    </div>
  );
}