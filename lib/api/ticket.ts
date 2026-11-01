import { isDemoMode } from './client';
import type {
  ExtractedTicket,
  ExtractedTicketResult,
  ExtractedPassenger,
} from '@/types/ticket';

import { DEMO_EXTRACTED_TICKET } from '../demo/ticket';

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '');


// ============================================================
// BACKEND API RESPONSE TYPES
// ============================================================

interface BackendPassenger {
  name?: string;
  age?: number;
  gender?: string;
  coach?: string;
  berthNumber?: string;
  berthType?: string;
  status?: string;
}

interface BackendTicketData {
  filename?: string;
  source?: string;
  text_extracted?: boolean;
  pnr_found?: boolean;

  pnrNumber?: string | null;
  trainNumber?: string;
  trainName?: string;

  fromStation?: string;
  fromStationCode?: string;

  toStation?: string;
  toStationCode?: string;

  boardingStation?: string;

  journeyDate?: string;
  departureTime?: string;
  arrivalTime?: string;

  travelClass?: string;
  quota?: string;

  platform?: number | null;

  passengerName?: string;
  coach?: string;
  berth?: string;
  berthType?: string;

  status?: string;

  passengers?: BackendPassenger[];

  confidenceScore?: number;

  rawTextPreview?: string;
}

interface TicketExtractionResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: BackendTicketData;
}

interface PNRValidationResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: {
    pnrNumber?: string;
    format_valid?: boolean;
    lookup_available?: boolean;
  };
}


// ============================================================
// HELPER: NORMALIZE PASSENGER STATUS
// ============================================================

function normalizePassengerStatus(
  status?: string
): 'CNF' | 'RAC' | 'WL' {
  const value = (status || '').toUpperCase();

  if (value.includes('RAC')) return 'RAC';

  if (
    value.includes('WL') ||
    value.includes('WAIT')
  ) {
    return 'WL';
  }

  return 'CNF';
}


// ============================================================
// HELPER: NORMALIZE GENDER
// ============================================================

function normalizeGender(
  gender?: string
): 'M' | 'F' | 'O' {
  const value = (gender || '').toUpperCase();

  if (value === 'M' || value === 'MALE') return 'M';

  if (value === 'F' || value === 'FEMALE') return 'F';

  return 'O';
}


// ============================================================
// HELPER: MAP BACKEND PASSENGERS
// ============================================================

function mapPassengers(
  passengers?: BackendPassenger[]
): ExtractedPassenger[] {

  if (!Array.isArray(passengers)) {
    return [];
  }

  return passengers.map((passenger) => ({
    name: passenger.name || '',
    age: Number(passenger.age || 0),
    gender: normalizeGender(passenger.gender),
    coach: passenger.coach || '',
    berthNumber: passenger.berthNumber || '',
    berthType: (passenger.berthType || '') as ExtractedPassenger['berthType'],
    status: normalizePassengerStatus(passenger.status),
  }));
}


// ============================================================
// HELPER: MAP BACKEND RESPONSE TO FRONTEND TICKET
// ============================================================

function mapBackendTicket(
  data: BackendTicketData
): ExtractedTicket {

  const passengers = mapPassengers(data.passengers);

  return {
    pnrNumber: data.pnrNumber || '',

    trainNumber: data.trainNumber || '',
    trainName: data.trainName || '',

    fromStation: data.fromStation || '',
    fromStationCode: data.fromStationCode || '',

    toStation: data.toStation || '',
    toStationCode: data.toStationCode || '',

    boardingStation: data.boardingStation || '',

    journeyDate: data.journeyDate || '',

    departureTime: data.departureTime || '',
    arrivalTime: data.arrivalTime || '',

    travelClass: data.travelClass || '',
    quota: data.quota || '',

    platform: data.platform ?? undefined,

    passengerName:
      data.passengerName || passengers[0]?.name || '',

    coach:
      data.coach || passengers[0]?.coach || '',

    berth:
      data.berth || passengers[0]?.berthNumber || '',

    berthType:
      data.berthType || passengers[0]?.berthType || '',

    status:
      data.status || passengers[0]?.status || 'Text Extracted',

    passengers,

    rawTextPreview: data.rawTextPreview || '',

    confidenceScore: data.confidenceScore ?? (
      data.text_extracted ? 1 : 0
    ),
  };
}


// ============================================================
// 1. SCAN TICKET PDF / IMAGE
// ============================================================

export async function scanTicketFile(
  file: File
): Promise<ExtractedTicket> {

  // Demo mode
  if (isDemoMode()) {

    await new Promise((resolve) =>
      setTimeout(resolve, 900)
    );

    return {
      ...DEMO_EXTRACTED_TICKET,
      rawTextPreview:
        `[Demo Scan: ${file.name}]\n${DEMO_EXTRACTED_TICKET.rawTextPreview}`,
    } as ExtractedTicket;
  }

  const formData = new FormData();

  // Must match Django request.FILES.get("ticketFile")
  formData.append('ticketFile', file);

  const response = await fetch(
    `${API_URL}/api/ticket/extract/`,
    {
      method: 'POST',
      body: formData,
    }
  );

  let result: TicketExtractionResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error('Backend returned an invalid response.');
  }

  if (
    !response.ok ||
    !result.success ||
    !result.data
  ) {
    throw new Error(
      result.error ||
      result.message ||
      'Ticket extraction failed.'
    );
  }

  // Convert Django response into frontend format.
  return mapBackendTicket(result.data);
}


// ============================================================
// 2. BACKWARD COMPATIBILITY
// ============================================================

export const uploadAndExtractTicket = scanTicketFile;


// ============================================================
// 3. GET SAMPLE DEMO TICKET
// ============================================================

export async function getSampleDemoTicket():
Promise<ExtractedTicketResult> {

  return DEMO_EXTRACTED_TICKET;
}


// ============================================================
// 4. MANUAL PNR VALIDATION
// ============================================================

export async function fetchTicketDetails(
  pnr: string
): Promise<ExtractedTicket> {

  if (!/^\d{10}$/.test(pnr)) {
    throw new Error(
      'PNR must contain exactly 10 digits.'
    );
  }

  const response = await fetch(
    `${API_URL}/api/ticket/pnr/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify({
        pnr,
      }),
    }
  );

  let result: PNRValidationResponse;

  try {
    result = await response.json();
  } catch {
    throw new Error('Invalid PNR API response.');
  }

  if (!response.ok || !result.success) {
    throw new Error(
      result.error || 'PNR validation failed.'
    );
  }

  return {
    pnrNumber: result.data?.pnrNumber || pnr,

    trainNumber: '',
    trainName: '',

    fromStation: '',
    fromStationCode: '',

    toStation: '',
    toStationCode: '',

    boardingStation: '',

    journeyDate: '',

    departureTime: '',
    arrivalTime: '',

    travelClass: '',
    quota: '',

    platform: undefined,

    passengerName: '',
    coach: '',
    berth: '',
    berthType: '',

    passengers: [],

    confidenceScore: 0,

    status: result.data?.lookup_available
      ? 'Lookup Available'
      : 'PNR Format Validated',
  };
}