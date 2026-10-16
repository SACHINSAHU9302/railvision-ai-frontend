'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { useDocuments } from '@/hooks/use-documents';
import { RailwayDocument } from '@/types/document';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';

import {
  ArrowLeft,
  Calendar,
  ShieldCheck,
  Bot,
  ArrowRight,
  Share2,
  CheckCircle2,
  FileText,
  ExternalLink,
} from 'lucide-react';

import { useToast } from '@/hooks/use-toast';

type DocumentSection = NonNullable<
  RailwayDocument['sections']
>[number];

type ExtendedRailwayDocument = RailwayDocument & {
  circularNumber?: string;
  effectiveDate?: string;
  authority?: string;
  keyTakeaways?: string[];
  sections?: DocumentSection[];
  sourceUrl?: string;
  source_url?: string;
  source?: string;
};

export default function DocumentDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { toast } = useToast();

  const rawId = params.id;

  // Read the dynamic route parameter safely.
  const documentId = React.useMemo(() => {
    try {
      return decodeURIComponent(rawId);
    } catch {
      return rawId;
    }
  }, [rawId]);

  const { documents, getSingleDocument } = useDocuments();

  const [doc, setDoc] =
    React.useState<RailwayDocument | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);
  const [loadError, setLoadError] = React.useState<string | null>(
    null
  );

  // Load the selected document.
  React.useEffect(() => {
    let cancelled = false;

    async function loadDocument() {
      setIsLoading(true);
      setLoadError(null);

      try {
        const result = await getSingleDocument(documentId);

        if (!cancelled) {
          setDoc(result);
        }
      } catch (error) {
        console.error(
          'Failed to load railway document:',
          error
        );

        if (!cancelled) {
          setDoc(null);
          setLoadError(
            error instanceof Error
              ? error.message
              : 'Unable to load this railway document.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (documentId) {
      loadDocument();
    } else {
      setDoc(null);
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [documentId, getSingleDocument]);

  // Share document URL.
  const handleShare = async () => {
    try {
      if (!navigator.clipboard) {
        throw new Error('Clipboard is not available.');
      }

      await navigator.clipboard.writeText(window.location.href);

      toast({
        title: 'Link Copied',
        description: 'Document link copied to clipboard.',
        type: 'success',
      });
    } catch {
      toast({
        title: 'Unable to copy link',
        description: 'Please copy the page URL manually.',
        type: 'error',
      });
    }
  };

  // Loading state.
  if (isLoading) {
    return (
      <LoadingState message="Loading railway document..." />
    );
  }

  // API error state.
  if (loadError) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Unable to Load Document"
          description={loadError}
          actionLabel="Back to Rules"
          onAction={() => router.push('/documents')}
        />
      </div>
    );
  }

  // Document not found.
  if (!doc) {
    return (
      <EmptyState
        title="Document Not Found"
        description="This document ID was not found in the backend document list."
        actionLabel="Back to Rules"
        onAction={() => router.push('/documents')}
      />
    );
  }

  const extendedDoc = doc as ExtendedRailwayDocument;

  const circularNumber =
    extendedDoc.circularNumber || 'Railway Document';

  const effectiveDate =
    extendedDoc.effectiveDate || 'Date not available';

  const authority =
    extendedDoc.authority || 'Railway Knowledge Base';

  const keyTakeaways = Array.isArray(extendedDoc.keyTakeaways)
    ? extendedDoc.keyTakeaways.filter(
        (item): item is string => typeof item === 'string'
      )
    : [];

  const sections = Array.isArray(extendedDoc.sections)
    ? extendedDoc.sections.filter(
        (section): section is DocumentSection =>
          Boolean(
            section &&
              typeof section.title === 'string' &&
              typeof section.content === 'string'
          )
      )
    : [];

  const sourceUrl =
    extendedDoc.sourceUrl || extendedDoc.source_url || '';

  // Related documents in the same category.
  const related = documents.filter(
    (item) =>
      String(item.id) !== String(doc.id) &&
      item.category === doc.category
  );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Breadcrumb */}
      <Breadcrumb
        items={[
          {
            label: 'Railway Rules',
            href: '/documents',
          },
          {
            label: doc.title || 'Railway Document',
          },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center">
        <div className="flex min-w-0 items-start gap-3">
          <Link href="/documents">
            <Button
              variant="outline"
              size="icon"
              className="mt-1"
              aria-label="Back to railway documents"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="rail"
                size="sm"
                className="font-mono text-xs"
              >
                {circularNumber}
              </Badge>

              <Badge
                variant="secondary"
                size="sm"
                className="capitalize"
              >
                {doc.category || 'general'}
              </Badge>
            </div>

            <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100 sm:text-2xl">
              {doc.title || 'Untitled Railway Document'}
            </h1>

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Effective: {effectiveDate}
              </span>

              <span className="flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                {authority}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="gap-1.5 text-xs"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>Share</span>
          </Button>

          <Link
            href={`/assistant?q=${encodeURIComponent(
              `Explain railway rules about ${doc.title}`
            )}`}
          >
            <Button size="sm" className="gap-1.5 text-xs">
              <Bot className="h-3.5 w-3.5" />
              <span>Ask AI About This</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Document Information */}
      <Card className="space-y-3 p-5">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />

          <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Document Information
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {doc.summary ||
            'No additional summary is available for this document.'}
        </p>

        <div className="break-all text-xs text-slate-500 dark:text-slate-400">
          Document ID: {doc.id}
        </div>

        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline dark:text-blue-400"
          >
            View Official Source
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </Card>

      {/* Key Passenger Takeaways */}
      {keyTakeaways.length > 0 && (
        <Card className="border-blue-200/80 bg-blue-50/50 p-5 dark:border-blue-900/60 dark:bg-blue-950/20">
          <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#0B2545] dark:text-blue-300">
            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            Key Passenger Takeaways
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {keyTakeaways.map((takeaway, index) => (
              <div
                key={`${index}-${takeaway}`}
                className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Official Clauses */}
      <div className="space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Official Circular Clauses
        </h2>

        {sections.length > 0 ? (
          sections.map((section, index) => (
            <Card
              key={`${index}-${section.title}`}
              className="space-y-2 p-5"
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  {section.title}
                </h3>

                <span className="shrink-0 font-mono text-[10px] text-slate-400">
                  Section {index + 1}
                </span>
              </div>

              <p className="whitespace-pre-line text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {section.content}
              </p>
            </Card>
          ))
        ) : (
          <Card className="space-y-3 p-5">
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              The backend currently provides document metadata,
              but the full document clauses are not included in
              its response.
            </p>

            <Link
              href={`/assistant?q=${encodeURIComponent(
                `Explain the railway rules in ${doc.title} using the indexed knowledge base. Include sources and do not invent missing information.`
              )}`}
            >
              <Button size="sm" className="gap-2">
                <Bot className="h-4 w-4" />
                Ask AI About This Document
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Related Documents */}
      {related.length > 0 && (
        <div className="space-y-3 border-t border-slate-200 pt-5 dark:border-slate-800">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Related Railway Guidelines
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/documents/${encodeURIComponent(
                  String(item.id)
                )}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3.5 transition-colors hover:border-blue-400 dark:border-slate-800 dark:bg-slate-900"
              >
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {item.title}
                  </p>

                  <p className="mt-1 break-all font-mono text-[10px] text-slate-500">
                    {item.id}
                  </p>
                </div>

                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}