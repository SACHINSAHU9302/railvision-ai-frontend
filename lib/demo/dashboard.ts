export interface DashboardActivity {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'navigation' | 'assistant' | 'complaint' | 'ticket';
  link: string;
}

export interface CurrentJourneyOverview {
  trainNumber: string;
  trainName: string;
  pnrNumber: string;
  fromStation: string;
  fromStationCode: string;
  toStation: string;
  toStationCode: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  platform: number;
  coach: string;
  berth: string;
  status: 'On Time' | 'Delayed 15m' | 'Boarding Soon';
}

export const DEMO_CURRENT_JOURNEY: CurrentJourneyOverview = {
  trainNumber: '12952',
  trainName: 'New Delhi - Mumbai Central Tejas Rajdhani Express',
  pnrNumber: '284-9182740',
  fromStation: 'New Delhi Railway Station',
  fromStationCode: 'NDLS',
  toStation: 'Mumbai Central Terminus',
  toStationCode: 'MMCT',
  departureTime: '16:55',
  arrivalTime: '08:35 (Next Day)',
  date: 'Today, 13 Sep',
  platform: 2,
  coach: 'B4',
  berth: '32 (Lower)',
  status: 'On Time',
};

export const DEMO_RECENT_ACTIVITIES: DashboardActivity[] = [
  {
    id: 'act-1',
    title: 'Platform 2 Guide - NDLS',
    subtitle: 'Navigated to Escalator & Coach Position B4',
    timestamp: '25 mins ago',
    type: 'navigation',
    link: '/navigation/ndls',
  },
  {
    id: 'act-2',
    title: 'Refund Rules for Delayed Trains',
    subtitle: 'RAG query answered with Document CC-34',
    timestamp: '2 hours ago',
    type: 'assistant',
    link: '/assistant',
  },
  {
    id: 'act-3',
    title: 'Water Leak Grievance #RV-2026-9841',
    subtitle: 'Status updated to In Progress',
    timestamp: 'Yesterday',
    type: 'complaint',
    link: '/complaints/cmp-101',
  },
];
export const DEMO_USER = {
  name: 'Demo User',
  email: 'demo@railvision.ai',
  role: 'Passenger',
};