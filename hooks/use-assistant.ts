'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  ChatMessage,
  SuggestedPrompt,
} from '@/types/assistant';

import {
  getConversation,
  getSuggestedPrompts,
  sendAssistantMessage,
} from '@/lib/api/assistant';

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [prompts, setPrompts] = useState<SuggestedPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [agentStatus, setAgentStatus] = useState('');
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
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load assistant.'
      );
    }
  }, []);

  useEffect(() => {
    void loadInitial();
  }, [loadInitial]);

  const sendMessage = useCallback(
    async (text: string, stationContext?: string) => {
      if (!text.trim() || isGenerating) return;

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text.trim(),
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages((previous) => [...previous, userMessage]);
      setIsGenerating(true);
      setAgentStatus('Connecting to Railway AI...');
      setError(null);

      try {
        setAgentStatus('Searching railway knowledge base...');

        const reply = await sendAssistantMessage(
          text.trim(),
          stationContext
        );

        setMessages((previous) => [...previous, reply]);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : 'Failed to get an answer from the backend.';

        setError(message);

        setMessages((previous) => [
          ...previous,
          {
            id: `error-${Date.now()}`,
            role: 'assistant',
            content: `Sorry, I could not process your question.\n\nError: ${message}`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          },
        ]);
      } finally {
        setIsGenerating(false);
        setAgentStatus('');
      }
    },
    [isGenerating]
  );

  const resetConversation = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const exportTranscript = useCallback(() => {
    const transcript = messages
      .map(
        (message) =>
          `[${message.timestamp}] ${message.role.toUpperCase()}: ${message.content}`
      )
      .join('\n\n');

    const blob = new Blob([transcript], {
      type: 'text/plain;charset=utf-8',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'railvision-chat.txt';
    link.click();

    URL.revokeObjectURL(url);
  }, [messages]);

  return {
    messages,
    prompts,
    isGenerating,
    agentStatus,
    error,
    sendMessage,
    resetConversation,
    exportTranscript,
  };
}