export type FacilityType =
  | 'toilet'
  | 'atm'
  | 'food'
  | 'parking'
  | 'waiting_room'
  | 'ticket_counter'
  | 'medical'
  | 'help_desk';

export interface Facility {
  id: string;
  stationId: string;
  stationCode: string;
  name: string;
  type: FacilityType;
  platformNear: number;
  exactLocation: string;
  distanceMeters: number;
  isOpen24Hours: boolean;
  operatingHours: string;
  isAccessible: boolean;
  status: 'available' | 'busy' | 'under_maintenance';
  description: string;
  contactNumber?: string;
  coordinates: { x: number; y: number };
}

export interface FacilityFilterOptions {
  category?: FacilityType | 'all';
  stationId?: string;
  accessibleOnly?: boolean;
  openOnly?: boolean;
  sortBy?: 'distance' | 'name' | 'platform';
}
