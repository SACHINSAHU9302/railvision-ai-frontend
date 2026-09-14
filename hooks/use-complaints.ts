'use client';

import { useState, useEffect, useCallback } from 'react';
import { Complaint, CreateComplaintInput } from '@/types/complaint';
import { getComplaints, getComplaintById, createComplaint as apiCreateComplaint } from '@/lib/api/complaints';

export function useComplaints() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplaints = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComplaints();
      setComplaints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch complaints');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComplaints();
  }, [fetchComplaints]);

  const submitComplaint = async (input: CreateComplaintInput): Promise<Complaint> => {
    setIsSubmitting(true);
    setError(null);
    try {
      const created = await apiCreateComplaint(input);
      setComplaints((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to register grievance';
      setError(msg);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSingleComplaint = async (id: string) => {
    return getComplaintById(id);
  };

  return {
    complaints,
    isLoading,
    isSubmitting,
    error,
    refetch: fetchComplaints,
    submitComplaint,
    getSingleComplaint,
  };
}
