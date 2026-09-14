export interface ExtractedPassenger {
  name: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  coach: string;
  berthNumber: string;
  berthType: 'Lower' | 'Middle' | 'Upper' | 'Side Lower' | 'Side Upper' | 'Window Seat';
  status: 'CNF' | 'RAC' | 'WL';
}

export interface ExtractedTicketResult {
  pnrNumber: string;
  trainNumber: string;
  trainName: string;
  fromStation: string;
  fromStationCode: string;
  toStation: string;
  toStationCode: string;
  boardingStation: string;
  boardingPlatformEstimated?: number;
  journeyDate: string;
  departureTime: string;
  arrivalTime: string;
  travelClass: string;
  quota: string;
  passengers: ExtractedPassenger[];
  rawTextPreview?: string;
  confidenceScore: number;
}
