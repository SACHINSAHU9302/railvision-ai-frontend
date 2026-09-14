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
  FileText,
  CheckCircle2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const documentId = params.documentId as string;

  const { documents, getSingleDocument } = useDocuments();
  const [doc, setDoc] = React.useState<RailwayDocument | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function load() {
      setIsLoading(true);
      const res = await getSingleDocument(documentId);
      setDoc(res);
      setIsLoading(false);
    }
    load();
  }, [documentId]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast({
      title: 'Link Copied',
      description: 'Document link copied to clipboard.',
      type: 'success',
    });
  };

  if (isLoading) return <LoadingState message="Loading document circular..." />;

  if (!doc) {
    return (
      <EmptyState
        title="Document Not Found"
        description="The requested circular is not in the active knowledge index."
        actionLabel="Back to Rules"
        onAction={() => router.push('/documents')}
      />
    );
  }

  const related = documents.filter((d) => d.id !== doc.id && d.category === doc.category);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb
        items={[
          { label: 'Railway Rules', href: '/documents' },
          { label: doc.title },
        ]}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-3">
          <Link href="/documents">
            <Button variant="outline" size="icon" className="mt-1">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="rail" size="sm" className="font-mono text-xs">
                {doc.circularNumber}
              </Badge>
              <Badge variant="secondary" size="sm" className="capitalize">
                {doc.category}
              </Badge>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">
              {doc.title}
            </h1>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Effective: {doc.effectiveDate}</span>
              </span>
              <span>•</span>
              <span>Issuing Authority: {doc.authority}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleShare} className="gap-1.5 text-xs">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </Button>
          <Link href={`/assistant?q=Explain%20clauses%20in%20${encodeURIComponent(doc.title)}`}>
            <Button size="sm" className="gap-1.5 text-xs">
              <Bot className="w-3.5 h-3.5" />
              <span>Ask AI About This</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Key Takeaways Box */}
      <Card className="p-5 bg-blue-50/50 dark:bg-blue-950/20 border-blue-200/80 dark:border-blue-900/60">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B2545] dark:text-blue-300 mb-3 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span>Key Passenger Takeaways</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {doc.keyTakeaways.map((takeaway, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
              <span>{takeaway}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Document Sections / Clauses */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Official Circular Clauses
        </h3>

        {doc.sections.map((section, idx) => (
          <Card key={idx} className="p-5 space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                {section.title}
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Section {idx + 1}</span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {section.content}
            </p>
          </Card>
        ))}
      </div>

      {/* Related Circulars */}
      {related.length > 0 && (
        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Related Railway Guidelines
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {related.map((rel) => (
              <Link
                key={rel.id}
                href={`/documents/${rel.id}`}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-400 transition-colors flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {rel.title}
                  </p>
                  <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                    {rel.circularNumber}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
