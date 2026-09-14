'use client';

import { useState, useEffect, useCallback } from 'react';
import { RailwayDocument, DocumentFilterOptions } from '@/types/document';
import { getDocuments, getDocumentById } from '@/lib/api/documents';

export function useDocuments(initialFilters?: DocumentFilterOptions) {
  const [documents, setDocuments] = useState<RailwayDocument[]>([]);
  const [filters, setFilters] = useState<DocumentFilterOptions>(initialFilters || {});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocs = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getDocuments(filters);
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const updateFilters = (newFilters: Partial<DocumentFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const getSingleDocument = async (id: string) => {
    return getDocumentById(id);
  };

  return {
    documents,
    filters,
    isLoading,
    error,
    updateFilters,
    refetch: fetchDocs,
    getSingleDocument,
  };
}
