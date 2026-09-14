import { apiClient, isDemoMode } from './client';
import { Station, StationSearchResult } from '@/types/station';
import { DEMO_STATIONS } from '../demo/stations';

export async function getStations(): Promise<Station[]> {
  if (isDemoMode()) {
    // Artificial small latency to demonstrate realistic UX loading states
    await new Promise((resolve) => setTimeout(resolve, 200));
    return [...DEMO_STATIONS];
  }
  return apiClient<Station[]>('/api/stations');
}

export async function getStationById(id: string): Promise<Station | null> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const station = DEMO_STATIONS.find(
      (s) => s.id.toLowerCase() === id.toLowerCase() || s.code.toLowerCase() === id.toLowerCase()
    );
    return station || null;
  }
  return apiClient<Station>(`/api/stations/${id}`);
}

export async function searchStations(query: string): Promise<StationSearchResult[]> {
  if (isDemoMode()) {
    const q = query.trim().toLowerCase();
    if (!q) {
      return DEMO_STATIONS.map((s) => ({
        id: s.id,
        name: s.name,
        code: s.code,
        city: s.city,
        platformsCount: s.platformsCount,
      }));
    }
    return DEMO_STATIONS.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q)
    ).map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      city: s.city,
      platformsCount: s.platformsCount,
    }));
  }
  return apiClient<StationSearchResult[]>(`/api/stations/search?q=${encodeURIComponent(query)}`);
}
