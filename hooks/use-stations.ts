'use client';

import { useState, useEffect, useCallback } from 'react';
import { Station, StationSearchResult } from '@/types/station';
import { getStations, getStationById, searchStations } from '@/lib/api/stations';

export function useStations(stationId?: string) {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getStations();
      setStations(data);
      if (stationId) {
        const found = data.find(
          (s) => s.id.toLowerCase() === stationId.toLowerCase() || s.code.toLowerCase() === stationId.toLowerCase()
        );
        setCurrentStation(found || null);
      } else if (data.length > 0) {
        setCurrentStation(data[0]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch railway stations');
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  const selectStation = async (id: string) => {
    setIsLoading(true);
    try {
      const found = await getStationById(id);
      setCurrentStation(found);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load station');
    } finally {
      setIsLoading(false);
    }
  };

  const executeSearch = async (query: string): Promise<StationSearchResult[]> => {
    try {
      return await searchStations(query);
    } catch {
      return [];
    }
  };

  return {
    stations,
    currentStation,
    isLoading,
    error,
    refetch: fetchStations,
    selectStation,
    executeSearch,
  };
}
