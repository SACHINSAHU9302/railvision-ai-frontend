import { apiClient, isDemoMode } from './client';
import { RailwayDocument, DocumentFilterOptions } from '@/types/document';
import { DEMO_DOCUMENTS } from '../demo/documents';

export async function getDocuments(filters?: DocumentFilterOptions): Promise<RailwayDocument[]> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let docs = [...DEMO_DOCUMENTS];

    if (filters?.category && filters.category !== 'all') {
      docs = docs.filter((d) => d.category === filters.category);
    }
    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.summary.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return docs;
  }

  const queryParams = new URLSearchParams();
  if (filters?.category) queryParams.set('category', filters.category);
  if (filters?.searchQuery) queryParams.set('q', filters.searchQuery);
  return apiClient<RailwayDocument[]>(`/api/documents?${queryParams.toString()}`);
}

export async function getDocumentById(id: string): Promise<RailwayDocument | null> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return DEMO_DOCUMENTS.find((d) => d.id === id) || null;
  }
  return apiClient<RailwayDocument>(`/api/documents/${id}`);
}
