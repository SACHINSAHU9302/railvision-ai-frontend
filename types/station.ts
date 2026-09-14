export interface Platform {
  id: string;
  number: number;
  direction: string;
  currentTrain?: string;
  expectedDeparture?: string;
  isAccessible: boolean;
  hasElevator: boolean;
  hasEscalator: boolean;
  status: 'active' | 'maintenance' | 'occupied';
  coordinates: { x: number; y: number }; // Relative position on schematic map
}

export interface StationAmenitySummary {
  toilets: number;
  atms: number;
  foodOutlets: number;
  waitingRooms: number;
  medicalKiosks: number;
  wheelchairAccess: boolean;
}

export interface ImportantPoint {
  id: string;
  name: string;
  type: 'gate' | 'bridge' | 'ticket_counter' | 'enquiry' | 'concourse';
  locationDescription: string;
  platformNear: number;
  coordinates: { x: number; y: number };
}

export interface Station {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  zone: string;
  category: 'A1' | 'A' | 'B';
  platformsCount: number;
  platforms: Platform[];
  amenities: StationAmenitySummary;
  importantPoints: ImportantPoint[];
  layoutDescription: string;
  helplineNumber: string;
}

export interface StationSearchResult {
  id: string;
  name: string;
  code: string;
  city: string;
  platformsCount: number;
}
