import { apiClient, isDemoMode } from './client';
import { ChatMessage, SuggestedPrompt } from '@/types/assistant';
import { DEMO_CONVERSATION_MESSAGES, DEMO_SUGGESTED_PROMPTS } from '../demo/conversations';

export async function getConversation(): Promise<ChatMessage[]> {
  if (isDemoMode()) {
    return [...DEMO_CONVERSATION_MESSAGES];
  }
  return apiClient<ChatMessage[]>('/api/assistant/conversation');
}

export async function getSuggestedPrompts(): Promise<SuggestedPrompt[]> {
  return [...DEMO_SUGGESTED_PROMPTS];
}

export async function sendAssistantMessage(
  prompt: string,
  _stationContext?: string
): Promise<ChatMessage> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lower = prompt.toLowerCase();
    if (lower.includes('platform') || lower.includes('train')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `**Platform Guidance System (Demo Response)**:\n\nBased on station indexing for **New Delhi (NDLS)**, high-speed and Rajdhani departures are centered around **Platforms 1 to 3** near Paharganj and **Platform 16** near Ajmeri Gate.\n\n• For accessibility, use Foot-Over-Bridge 2 which provides continuous escalator access to platforms 1 through 16.\n• Coach indicator boards are mounted at overhead display gantries along the platform length.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            id: 'src-plat',
            title: 'Station Platform Master Directory',
            category: 'Navigation',
            excerpt: 'Central FOB connects platforms 1-16 with escalator landings and tactile indicators.',
            urlOrId: '/navigation/ndls',
          },
        ],
        suggestedActions: [
          {
            label: 'View NDLS Platform Schematic',
            actionType: 'navigate',
            href: '/navigation/ndls',
          },
        ],
      };
    }

    if (lower.includes('atm') || lower.includes('cash') || lower.includes('food')) {
      return {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `**Facility Locator (Demo Response)**:\n\n• **ATM:** The State Bank of India (SBI) Multi-ATM Kiosk is located near Exit Gate 2 (Platform 1 Paharganj side), approximately 25 meters from the booking concourse.\n• **Food:** Jan Aahar Affordable Food Plaza is located at the landing of Foot-Over-Bridge 2.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sources: [
          {
            id: 'src-fac',
            title: 'NDLS Station Amenities Directory',
            category: 'Facility',
            excerpt: 'Exit Gate 2: 3 Automated ATM units operational 24/7.',
            urlOrId: '/facilities',
          },
        ],
        suggestedActions: [
          {
            label: 'Browse All Facilities',
            actionType: 'view_facility',
            href: '/facilities',
          },
        ],
      };
    }

    return {
      id: `msg-${Date.now()}`,
      role: 'assistant',
      content: `**RailVision AI Assistant (Demo Mode)**:\n\nI received your query: "*${prompt}*".\n\nIn this frontend preview, answers are powered by demo knowledge references. When connected to the multi-agent RAG backend, your query is routed simultaneously to the Navigation Agent, RAG Document Engine, and Station Service Agent for verified real-time answers.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sources: [
        {
          id: 'src-gen',
          title: 'Passenger Information System Guidelines',
          category: 'General',
          excerpt: 'Multi-Agent RAG architecture provides verified retrieval from official railway documentation.',
          urlOrId: '/documents',
        },
      ],
      suggestedActions: [
        {
          label: 'Explore Knowledge Documents',
          actionType: 'navigate',
          href: '/documents',
        },
      ],
    };
  }

  return apiClient<ChatMessage>('/api/assistant/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt, stationContext: _stationContext }),
  });
}
