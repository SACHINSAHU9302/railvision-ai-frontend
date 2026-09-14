'use client';

import { useState, useEffect, useCallback } from 'react';
import { ChatMessage, SuggestedPrompt } from '@/types/assistant';
import { getConversation, getSuggestedPrompts, sendAssistantMessage } from '@/lib/api/assistant';

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompts, setPrompts] = useState<SuggestedPrompt[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitial = useCallback(async () => {
    try {
      const [history, suggestions] = await Promise.all([
        getConversation(),
        getSuggestedPrompts(),
      ]);
      setMessages(history);
      setPrompts(suggestions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load conversation');
    }
  }, []);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const sendMessage = async (text: string, stationContext?: string) => {
    if (!text.trim() || isSending) return;

    const userMessage: ChatMessage = {
      id: `usr-msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Optimistically update conversation
    setMessages((prev) => [...prev, userMessage]);
    setIsSending(true);
    setError(null);

    try {
      const reply = await sendAssistantMessage(text, stationContext);
      setMessages((prev) => [...prev, reply]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Assistant failed to respond');
    } finally {
      setIsSending(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return {
    messages,
    prompts,
    isSending,
    error,
    sendMessage,
    clearChat,
  };
}
