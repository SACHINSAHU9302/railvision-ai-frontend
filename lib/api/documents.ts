import { apiClient, isDemoMode } from './client';
import {
  RailwayDocument,
  DocumentFilterOptions,
} from '@/types/document';
import { DEMO_DOCUMENTS } from '../demo/documents';

/* =========================================================
   Backend document types
========================================================= */

interface BackendDocument {
  id: string | number;
  title?: string;
  source?: string;
  file_type?: string;
  category?: string;
  source_url?: string;
  effective_date?: string;
  last_verified?: string;
}

interface BackendDocumentsResponse {
  success?: boolean;
  count?: number;
  results?: BackendDocument[];
}

/* =========================================================
   Safe string helper
========================================================= */

function safeString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

/* =========================================================
   Category mapping
========================================================= */

function mapCategory(
  doc: BackendDocument
): RailwayDocument['category'] {
  const text = [
    doc.category,
    doc.title,
    doc.source,
    doc.file_type,
  ]
    .map((value) => safeString(value))
    .join(' ')
    .toLowerCase()
    .replace(/[_-]+/g, ' ');

  if (
    text.includes('refund') ||
    text.includes('cancellation') ||
    text.includes('irctc terms')
  ) {
    return 'refund';
  }

  if (text.includes('luggage') || text.includes('baggage')) {
    return 'luggage' as RailwayDocument['category'];
  }

  if (text.includes('tatkal')) {
    return 'tatkal' as RailwayDocument['category'];
  }

  if (
    text.includes('divyangjan') ||
    text.includes('senior citizen') ||
    text.includes('senior citizens')
  ) {
    return 'divyangjan' as RailwayDocument['category'];
  }

  return 'general' as RailwayDocument['category'];
}

/* =========================================================
   Map backend document to frontend RailwayDocument
========================================================= */

function mapBackendDocument(
  doc: BackendDocument
): RailwayDocument {
  const id = String(doc.id);

  const title =
    safeString(doc.title).trim() ||
    safeString(doc.source).split(/[\\/]/).pop() ||
    'Untitled Railway Document';

  const source = safeString(doc.source);
  const category = mapCategory(doc);

  const sourceUrl = safeString(doc.source_url);
  const effectiveDate = safeString(
    doc.effective_date,
    'Date not available'
  );

  return {
    id,
    title,

    summary: source
      ? `Railway document: ${title}. Source file: ${source}`
      : `Railway document: ${title}`,

    category,

    tags: [
      safeString(doc.file_type, 'document'),
      category,
    ],

    documentNumber: id,
    circularNumber: 'Railway Document',
    effectiveDate,
    authority: 'Railway Knowledge Base',

    keyTakeaways: [],
    sections: [],

    // Additional metadata for interfaces that support it.
    source,
    source_url: sourceUrl,
    effective_date: effectiveDate,
    last_verified: safeString(doc.last_verified),
  } as RailwayDocument;
}

/* =========================================================
   Client-side search and category filters
========================================================= */

function applyFilters(
  documents: RailwayDocument[],
  filters?: DocumentFilterOptions
): RailwayDocument[] {
  let result = [...documents];

  if (filters?.category && filters.category !== 'all') {
    result = result.filter(
      (doc) => doc.category === filters.category
    );
  }

  if (filters?.searchQuery?.trim()) {
    const query = filters.searchQuery.trim().toLowerCase();

    result = result.filter((doc) => {
      const title = safeString(doc.title).toLowerCase();
      const summary = safeString(doc.summary).toLowerCase();

      const tags = Array.isArray(doc.tags) ? doc.tags : [];

      const documentNumber = safeString(
        doc.documentNumber
      ).toLowerCase();

      return (
        title.includes(query) ||
        summary.includes(query) ||
        documentNumber.includes(query) ||
        tags.some((tag) =>
          safeString(tag).toLowerCase().includes(query)
        )
      );
    });
  }

  return result;
}

/* =========================================================
   GET documents
   Endpoint: GET /api/documents/
========================================================= */

export async function getDocuments(
  filters?: DocumentFilterOptions
): Promise<RailwayDocument[]> {
  // Demo mode
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));

    return applyFilters(
      DEMO_DOCUMENTS as RailwayDocument[],
      filters
    );
  }

  // Build query parameters
  const queryParams = new URLSearchParams();

  if (filters?.category && filters.category !== 'all') {
    queryParams.set('category', filters.category);
  }

  if (filters?.searchQuery?.trim()) {
    queryParams.set('q', filters.searchQuery.trim());
  }

  const query = queryParams.toString();

  /*
   * client.ts base URL remains:
   * NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
   *
   * Only this documents endpoint adds /api.
   * Other agents remain unchanged.
   */
  const endpoint = `/api/documents/${query ? `?${query}` : ''}`;

  const response = await apiClient<
    BackendDocumentsResponse | BackendDocument[]
  >(endpoint);

  let backendDocuments: BackendDocument[];

  if (Array.isArray(response)) {
    backendDocuments = response;
  } else {
    if (response.success === false) {
      throw new Error('The backend could not load railway documents.');
    }

    backendDocuments = response.results ?? [];
  }

  if (!Array.isArray(backendDocuments)) {
    throw new Error(
      'Invalid documents response from the backend.'
    );
  }

  const documents = backendDocuments.map(mapBackendDocument);

  /*
   * Apply filters on the frontend as well.
   * This supports backends that return all documents
   * without applying query parameters.
   */
  return applyFilters(documents, filters);
}

/* =========================================================
   GET document by ID
========================================================= */
export async function getDocumentById(
  id: string
): Promise<RailwayDocument | null> {
  // Decode the ID safely.
  let decodedId = id;

  try {
    decodedId = decodeURIComponent(id);
  } catch {
    // Keep the original ID if decoding fails.
  }

  // Demo mode lookup.
  if (isDemoMode()) {
    return (
      DEMO_DOCUMENTS.find((doc) => {
        const currentId = String(doc.id);

        return (
          currentId === id ||
          currentId === decodedId ||
          encodeURIComponent(currentId) === id
        );
      }) ?? null
    );
  }

  // Fetch documents from the backend.
  const documents = await getDocuments();

  // Match encoded and decoded document IDs.
  const found = documents.find((doc) => {
    const currentId = String(doc.id);

    return (
      currentId === id ||
      currentId === decodedId ||
      encodeURIComponent(currentId) === id
    );
  });

  return found ?? null;
}