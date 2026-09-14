import { apiClient, isDemoMode } from './client';
import { Facility, FacilityFilterOptions } from '@/types/facility';
import { DEMO_FACILITIES } from '../demo/facilities';

export async function getFacilities(filters?: FacilityFilterOptions): Promise<Facility[]> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let results = [...DEMO_FACILITIES];

    if (filters?.stationId) {
      results = results.filter(
        (f) => f.stationId.toLowerCase() === filters.stationId?.toLowerCase()
      );
    }
    if (filters?.category && filters.category !== 'all') {
      results = results.filter((f) => f.type === filters.category);
    }
    if (filters?.accessibleOnly) {
      results = results.filter((f) => f.isAccessible);
    }
    if (filters?.openOnly) {
      results = results.filter((f) => f.isOpen24Hours || f.status === 'available');
    }
    if (filters?.sortBy === 'distance') {
      results.sort((a, b) => a.distanceMeters - b.distanceMeters);
    } else if (filters?.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters?.sortBy === 'platform') {
      results.sort((a, b) => a.platformNear - b.platformNear);
    }

    return results;
  }

  const queryParams = new URLSearchParams();
  if (filters?.stationId) queryParams.set('stationId', filters.stationId);
  if (filters?.category) queryParams.set('category', filters.category);
  return apiClient<Facility[]>(`/api/facilities?${queryParams.toString()}`);
}

export async function getFacilityById(id: string): Promise<Facility | null> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 150));
    return DEMO_FACILITIES.find((f) => f.id === id) || null;
  }
  return apiClient<Facility>(`/api/facilities/${id}`);
}
