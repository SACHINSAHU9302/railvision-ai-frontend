import { apiClient } from './client';
import { Station, StationSearchResult } from '@/types/station';

interface BackendStation {
  id: number;
  station_code: string;
  station_name: string;
  city: string;
  state: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  platform_count: number;
}

interface BackendPlatform {
  id: number;
  platform_number: number;
  name: string;
  accessibility: boolean;
}

interface BackendFacility {
  id: number;
  facility_type: string;
  facility_name: string;
  description: string;
  platform_id: number | null;
  platform_number: number | null;
  latitude: number | null;
  longitude: number | null;
  accessibility: boolean;
  contact_info: string;
  additional_notes: string;
}

interface BackendStationDetailResponse {
  success: boolean;
  station: BackendStation;
  platforms: BackendPlatform[];
  facilities: BackendFacility[];
}

interface StationListResponse {
  success: boolean;
  count: number;
  results: BackendStation[];
}

function mapStation(
  item: BackendStation,
  backendPlatforms: BackendPlatform[] = [],
  backendFacilities: BackendFacility[] = []
): Station {
  const countByType = (types: string[]) =>
    backendFacilities.filter((facility) =>
      types.includes(facility.facility_type.toLowerCase())
    ).length;

  return {
    id: String(item.id),
    code: item.station_code,
    name: item.station_name,
    city: item.city,
    state: item.state,
    address: item.address || '',
    latitude: item.latitude ?? undefined,
    longitude: item.longitude ?? undefined,

    zone: '',
    category: 'B',

    platformsCount: item.platform_count,

    platforms: backendPlatforms.map((platform) => ({
      id: String(platform.id),
      number: platform.platform_number,
      direction: platform.name || '',
      isAccessible: platform.accessibility,
      hasElevator: false,
      hasEscalator: false,
      status: 'active' as const,
      coordinates: {
        x: 0,
        y: 0,
      },
    })),

    amenities: {
      toilets: countByType(['restroom', 'toilet', 'washroom']),
      atms: countByType(['atm']),
      foodOutlets: countByType(['food_court', 'food_outlet']),
      waitingRooms: countByType(['waiting_room']),
      medicalKiosks: countByType(['medical']),
      wheelchairAccess: backendFacilities.some(
        (facility) => facility.accessibility
      ),
    },

    importantPoints: backendFacilities
      .filter((facility) =>
        ['ticket_counter', 'foot_over_bridge'].includes(
          facility.facility_type.toLowerCase()
        )
      )
      .map((facility) => ({
        id: String(facility.id),
        name: facility.facility_name,
        type:
          facility.facility_type.toLowerCase() === 'foot_over_bridge'
            ? 'bridge'
            : 'ticket_counter',
        locationDescription: facility.description || '',
        platformNear: facility.platform_number ?? 0,
        coordinates: {
          x: 0,
          y: 0,
        },
      })),

    layoutDescription: item.address || `${item.city}, ${item.state}`,
    helplineNumber: '',
  };
}

// Get all stations
export async function getStations(): Promise<Station[]> {
  const response = await apiClient<StationListResponse>(
    '/api/stations/'
  );

  if (!response || !Array.isArray(response.results)) {
    throw new Error('Invalid stations response from backend');
  }

  return response.results.map((station) => mapStation(station));
}

// Get station details
export async function getStationById(
  id: string
): Promise<Station | null> {
  const response = await apiClient<BackendStationDetailResponse>(
    `/api/stations/${encodeURIComponent(id)}/`
  );

  if (!response?.station) {
    return null;
  }

  return mapStation(
    response.station,
    response.platforms || [],
    response.facilities || []
  );
}

// Search stations
export async function searchStations(
  query: string
): Promise<StationSearchResult[]> {
  const stations = await getStations();
  const q = query.trim().toLowerCase();

  return stations
    .filter(
      (station) =>
        !q ||
        station.name.toLowerCase().includes(q) ||
        station.code.toLowerCase().includes(q) ||
        station.city.toLowerCase().includes(q)
    )
    .map((station) => ({
      id: station.id,
      name: station.name,
      code: station.code,
      city: station.city,
      platformsCount: station.platformsCount,
    }));
}