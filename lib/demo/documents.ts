import { RailwayDocument } from '@/types/document';

export const DEMO_DOCUMENTS: RailwayDocument[] = [
  {
    id: 'doc-tatkal-rules',
    title: 'Comprehensive Tatkal & Premium Tatkal Reservation Scheme Rules',
    category: 'reservation',
    documentNumber: 'CC-34/2023-RITES',
    effectiveDate: 'October 15, 2023',
    summary: 'Official regulations governing booking timings, quota allocations, dynamic pricing multipliers, and cancellation limits for Tatkal tickets.',
    ragChunkCount: 14,
    tags: ['Tatkal', 'Reservation', 'AC Quota', 'Refunds'],
    sections: [
      {
        id: 'sec-1',
        title: '1. Booking Window & Timings',
        content: 'Tatkal booking opens at 10:00 hrs IST for AC classes (1A, 2A, 3A, 3E, CC, EC) and at 11:00 hrs IST for Non-AC classes (Sleeper, Second Seating) on the day prior to the date of journey from train originating station.',
      },
      {
        id: 'sec-2',
        title: '2. Identity Verification & Passenger Limits',
        content: 'A maximum of 4 passengers per PNR can be booked under Tatkal scheme. One passenger must present original government-approved photo identity proof during the journey. Failure to produce valid ID renders all passengers on the PNR ticketless.',
      },
      {
        id: 'sec-3',
        title: '3. Cancellation & Refund Policy',
        content: 'No refund of fare is granted on cancellation of confirmed Tatkal tickets. For waitlisted Tatkal tickets, refund rules as applicable to general waitlisted tickets will apply after deduction of clerical charges.',
      },
    ],
  },
  {
    id: 'doc-refund-cancellation',
    title: 'Railway Passengers (Cancellation of Ticket and Refund of Fare) Guidelines',
    category: 'cancellation',
    documentNumber: 'IR-REFUND-ACT-2022',
    effectiveDate: 'March 01, 2022',
    summary: 'Rules detailing refund percentages based on cancellation time slabs before scheduled train departure and TDR filing steps.',
    ragChunkCount: 22,
    tags: ['Refund', 'TDR', 'Cancellation', 'RAC', 'Waitlist'],
    sections: [
      {
        id: 'sec-refund-1',
        title: '1. Cancellation Slabs for Confirmed Tickets',
        content: 'More than 48 hours prior to scheduled departure: flat cancellation charge per passenger (1A/EC: ₹240, 2A/1A: ₹200, 3A/3E: ₹180, SL: ₹120, 2S: ₹60). Between 48 hours and up to 12 hours: 25% of fare subject to minimum flat fee. Between 12 hours and up to 4 hours: 50% of fare.',
      },
      {
        id: 'sec-refund-2',
        title: '2. Waitlisted and RAC Tickets',
        content: 'Full refund minus standard clerkage charge of ₹60 plus GST per passenger is refunded if cancelled up to 30 minutes before scheduled train departure.',
      },
      {
        id: 'sec-refund-3',
        title: '3. Train Delayed More Than 3 Hours',
        content: 'Full refund of fare is granted without any deduction if the train is running delayed by more than three hours and the passenger chooses not to travel, provided TDR is filed prior to actual train departure.',
      },
    ],
  },
  {
    id: 'doc-luggage-allowance',
    title: 'Free Baggage Allowance & Excess Luggage Rates for Passengers',
    category: 'baggage',
    documentNumber: 'COMMERCIAL-CIRCULAR-88',
    effectiveDate: 'January 10, 2024',
    summary: 'Permissible weight and dimensions for luggage carried in personal possession across travel classes, prohibited items, and parcel booking rates.',
    ragChunkCount: 9,
    tags: ['Luggage', 'Allowance', 'Parcel', 'Safety'],
    sections: [
      {
        id: 'sec-bag-1',
        title: '1. Class-wise Permitted Free Allowance',
        content: 'AC First Class: 70 kg free allowance (marginal allowance 15 kg). AC 2-Tier: 50 kg free allowance (marginal 10 kg). AC 3-Tier / AC Chair Car: 40 kg free allowance (marginal 10 kg). Sleeper Class: 40 kg free allowance (marginal 10 kg). Second Class: 35 kg free allowance (marginal 10 kg).',
      },
      {
        id: 'sec-bag-2',
        title: '2. Dimension Restrictions',
        content: 'Trunks, suitcases, and boxes having outside measurements exceeding 100 cm x 60 cm x 25 cm are not allowed to be carried in passenger compartments and must be booked in the brake van.',
      },
    ],
  },
];
