export type MessageRole = 'user' | 'assistant' | 'system';

export interface SourceDocumentReference {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  urlOrId: string;
  confidenceScore?: number;
}

export interface AssistantAction {
  label: string;
  href?: string;
  actionType: 'navigate' | 'view_facility' | 'file_complaint' | 'check_platform';
  targetId?: string;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  sources?: SourceDocumentReference[];
  suggestedActions?: AssistantAction[];
  isGenerating?: boolean;
}

export interface SuggestedPrompt {
  id: string;
  label: string;
  prompt: string;
  category: 'platform' | 'facility' | 'rules' | 'complaint';
}
