import { apiClient, isDemoMode } from './client';
import { Facility, FacilityFilterOptions } from '@/types/facility';
import { DEMO_FACILITIES } from '../demo/facilities';

interface BackendFacility {
  id: number;
  facility_type: string;
  facility_name: string;
  description: string;
  station_id: number;
  station_name: string;
  station_code: string;
  platform_id: number | null;
  platform_number: number | null;
  latitude: number | null;
  longitude: number | null;
  accessibility: boolean;
  contact_info: string;
  additional_notes: string;
}

interface BackendFacilityResponse {
  success: boolean;
  count: number;
  results: BackendFacility[];
}

function mapFacility(item: BackendFacility): Facility {
  return {
    id: String(item.id),
    name: item.facility_name || item.facility_type,
    type: item.facility_type,
    description: item.description || '',
    stationId: String(item.station_id),
    stationName: item.station_name || '',
    stationCode: item.station_code || '',
    platformNear: item.platform_number ?? 0,
    exactLocation: item.platform_number
      ? `Platform ${item.platform_number}`
      : item.station_name || 'Station',
    isAccessible: item.accessibility,
    contactInfo: item.contact_info || '',
    additionalNotes: item.additional_notes || '',
    latitude: item.latitude,
    longitude: item.longitude,
    distanceMeters: 0,
    isOpen24Hours: false,
    status: 'available',
  } as unknown as Facility;
}

export async function getFacilities(
  filters?: FacilityFilterOptions
): Promise<Facility[]> {
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

    if (filters?.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters?.sortBy === 'platform') {
      results.sort((a, b) => a.platformNear - b.platformNear);
    } else if (filters?.sortBy === 'distance') {
      results.sort((a, b) => a.distanceMeters - b.distanceMeters);
    }

    return results;
  }

  const queryParams = new URLSearchParams();

  if (filters?.stationId) {
    queryParams.set('station_id', filters.stationId);
  }

  if (filters?.category) {
    queryParams.set('type', filters.category);
  }

  const query = queryParams.toString();
  const endpoint = query
    ? `/api/facilities/?${query}`
    : '/api/facilities/';

  const response = await apiClient<BackendFacilityResponse>(endpoint);

  if (!response || !Array.isArray(response.results)) {
    console.error('Unexpected facilities API response:', response);
    return [];
  }

  let results = response.results.map(mapFacility);

  if (filters?.accessibleOnly) {
    results = results.filter((f) => f.isAccessible);
  }

  if (filters?.sortBy === 'name') {
    results.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters?.sortBy === 'platform') {
    results.sort((a, b) => a.platformNear - b.platformNear);
  }

  return results;
}

export async function getFacilityById(
  id: string
): Promise<Facility | null> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 150));

    return DEMO_FACILITIES.find((f) => f.id === id) || null;
  }

  const facilities = await getFacilities();

  return facilities.find((facility) => facility.id === id) || null;
}