import { ChatMessage, SuggestedPrompt } from '@/types/assistant';

export const DEMO_SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    id: 'p-1',
    label: 'Find my platform',
    prompt: 'Where is Platform 3 at New Delhi (NDLS) and is there an elevator?',
    category: 'platform',
  },
  {
    id: 'p-2',
    label: 'Where is the nearest ATM?',
    prompt: 'Where is the nearest ATM from Platform 1 at NDLS?',
    category: 'facility',
  },
  {
    id: 'p-3',
    label: 'Explain railway refund rules',
    prompt: 'What are the cancellation charges if I cancel a confirmed 3AC ticket 24 hours before departure?',
    category: 'rules',
  },
  {
    id: 'p-4',
    label: 'How can I report a problem?',
    prompt: 'I want to report an overflowing water cooler at the station platform.',
    category: 'complaint',
  },
];

export const DEMO_CONVERSATION_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'user',
    content: 'Where is Platform 3 at New Delhi Railway Station (NDLS) and does it have elevator access?',
    timestamp: '10:14 AM',
  },
  {
    id: 'msg-2',
    role: 'assistant',
    content: `Platform 3 at **New Delhi Railway Station (NDLS)** is directly accessible from the Paharganj main entrance concourse, or via **Foot-Over-Bridge 2 (Central FOB)**.

• **Accessibility:** Platform 3 is equipped with an escalator from FOB-2. For full wheelchair elevator access, please use the elevator located between FOB-1 and Platform 2/3 landing.
• **Current Service:** It typically handles eastbound services (including Rajdhani and Sampark Kranti Expresses).
• **Nearby Amenities:** Jan Aahar Food Plaza is located at the FOB-2 landing (approx. 90m away).`,
    timestamp: '10:14 AM',
    sources: [
      {
        id: 'src-1',
        title: 'NDLS Station Master Navigation Index',
        category: 'Station Navigation',
        excerpt: 'Platform 3 Island: Connected via FOB-1 (Lift) and FOB-2 (Escalator). Wheelchair ramp connects Paharganj ground entrance.',
        urlOrId: '/navigation/ndls',
      },
    ],
    suggestedActions: [
      {
        label: 'View NDLS Station Map',
        actionType: 'navigate',
        href: '/navigation/ndls',
      },
      {
        label: 'Find Facilities near Platform 3',
        actionType: 'view_facility',
        href: '/facilities?stationId=ndls',
      },
    ],
  },
  {
    id: 'msg-3',
    role: 'user',
    content: 'What is the refund rule if my train is delayed by more than 3 hours?',
    timestamp: '10:16 AM',
  },
  {
    id: 'msg-4',
    role: 'assistant',
    content: `Under official Indian Railways Passenger Refund Rules:

If your train is running **delayed by more than 3 hours** from its scheduled departure time at your boarding station, you are entitled to a **full refund of fare with zero cancellation fee deduction**, provided you decide not to travel.

**Key Requirements:**
1. You must file a Ticket Deposit Receipt (TDR) online or at the PRS counter **prior to the actual departure of the train**.
2. For RAC and waitlisted tickets on the same PNR, full refund is also processed automatically once verified against the charting system.`,
    timestamp: '10:16 AM',
    sources: [
      {
        id: 'src-2',
        title: 'Railway Passengers Refund of Fare Rules (CC-34)',
        category: 'cancellation',
        excerpt: 'Section 3: Train Delayed More Than 3 Hours - Full fare refunded without any clerkage charge upon TDR submission before actual train departure.',
        urlOrId: '/documents/doc-refund-cancellation',
      },
    ],
    suggestedActions: [
      {
        label: 'Read Full Refund Document',
        actionType: 'navigate',
        href: '/documents/doc-refund-cancellation',
      },
    ],
  },
];
