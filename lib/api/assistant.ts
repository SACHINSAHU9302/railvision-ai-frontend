import { apiClient } from './client';
import { ChatMessage, SuggestedPrompt } from '@/types/assistant';
import { DEMO_SUGGESTED_PROMPTS } from '../demo/conversations';

interface RagApiResponse {
  success?: boolean;
  question?: string;
  answer?: string;
  error?: string;
}

export async function getConversation(): Promise<ChatMessage[]> {
  return [];
}

export async function getSuggestedPrompts(): Promise<SuggestedPrompt[]> {
  return [...DEMO_SUGGESTED_PROMPTS];
}

export async function sendAssistantMessage(
  prompt: string,
  stationContext?: string
): Promise<ChatMessage> {
  const question = stationContext
    ? `Station context: ${stationContext}\n\nQuestion: ${prompt}`
    : prompt;

  const response = await apiClient<RagApiResponse>(
    '/api/rag/query/',
    {
      method: 'POST',
      body: JSON.stringify({ question }),
    }
  );

  if (!response.answer) {
    throw new Error(
      response.error || 'The backend did not return an answer.'
    );
  }

  return {
    id: `assistant-${Date.now()}`,
    role: 'assistant',
    content: response.answer,
    timestamp: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
    sources: [],
    suggestedActions: [],
  };
}