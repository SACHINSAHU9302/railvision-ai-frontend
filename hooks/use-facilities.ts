'use client';

import { useState, useEffect, useCallback } from 'react';
import { Facility, FacilityFilterOptions } from '@/types/facility';
import { getFacilities, getFacilityById } from '@/lib/api/facilities';

export function useFacilities(initialFilters?: FacilityFilterOptions) {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [filters, setFilters] = useState<FacilityFilterOptions>(initialFilters || {});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFacilities = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFacilities(filters);
      setFacilities(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch facilities');
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchFacilities();
  }, [fetchFacilities]);

  const updateFilters = (newFilters: Partial<FacilityFilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const getSingleFacility = async (id: string) => {
    return getFacilityById(id);
  };

  return {
    facilities,
    filters,
    isLoading,
    error,
    updateFilters,
    refetch: fetchFacilities,
    getSingleFacility,
  };
}
