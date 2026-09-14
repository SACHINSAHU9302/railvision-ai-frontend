export type DocumentCategory =
  | 'reservation'
  | 'refund'
  | 'cancellation'
  | 'passenger_charter'
  | 'baggage'
  | 'general_rules'
  | 'faq';

export interface DocumentSection {
  id: string;
  title: string;
  content: string;
}

export interface RailwayDocument {
  id: string;
  title: string;
  category: DocumentCategory;
  summary: string;
  effectiveDate: string;
  documentNumber: string;
  sections: DocumentSection[];
  tags: string[];
  ragChunkCount?: number;
}

export interface DocumentFilterOptions {
  category?: DocumentCategory | 'all';
  searchQuery?: string;
}
