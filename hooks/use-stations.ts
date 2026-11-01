'use client';

import { useState, useEffect, useCallback } from 'react';
import { Station, StationSearchResult } from '@/types/station';
import {
  getStations,
  getStationById,
  searchStations,
} from '@/lib/api/stations';

export function useStations(stationId?: string) {
  const [stations, setStations] = useState<Station[]>([]);
  const [currentStation, setCurrentStation] = useState<Station | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch station list and complete station details
  const fetchStations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await getStations();
      setStations(data);

      if (stationId) {
        // First find station in the list using ID or station code
        const found = data.find(
          (station) =>
            station.id.toLowerCase() === stationId.toLowerCase() ||
            station.code.toLowerCase() === stationId.toLowerCase()
        );

        if (found) {
          // Fetch complete station details from backend
          const detailedStation = await getStationById(found.id);

          setCurrentStation(detailedStation);
        } else {
          // Try fetching directly using the provided station ID
          const detailedStation = await getStationById(stationId);

          setCurrentStation(detailedStation);
        }
      } else {
        setCurrentStation(null);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to fetch railway stations'
      );
    } finally {
      setIsLoading(false);
    }
  }, [stationId]);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  // Select station and fetch complete details
  const selectStation = async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const found = await getStationById(id);

      if (!found) {
        setCurrentStation(null);
        setError('Station not found');
        return;
      }

      setCurrentStation(found);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load station details'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Search stations
  const executeSearch = async (
    query: string
  ): Promise<StationSearchResult[]> => {
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