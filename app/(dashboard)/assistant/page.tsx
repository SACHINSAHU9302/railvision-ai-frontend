'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useAssistant } from '@/hooks/use-assistant';
import { MessageBubble } from '@/components/assistant/message-bubble';
import { SuggestedPrompts } from '@/components/assistant/suggested-prompts';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Send,
  RotateCcw,
  Download,
  Mic,
  MicOff,
  Sparkles,
  Info,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';

export default function AssistantPage() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');
  const { toast } = useToast();

  const {
    messages,
    isGenerating,
    agentStatus,
    sendMessage,
    resetConversation,
    exportTranscript,
  } = useAssistant();

  const [input, setInput] = React.useState('');
  const [isRecording, setIsRecording] = React.useState(false);
  const [showSystemDetails, setShowSystemDetails] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating, agentStatus]);

  // Handle URL query trigger once
  const initialHandled = React.useRef(false);
  React.useEffect(() => {
    if (initialQuery && !initialHandled.current) {
      initialHandled.current = true;
      sendMessage(initialQuery);
    }
  }, [initialQuery, sendMessage]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const query = input.trim();
    setInput('');
    sendMessage(query);
  };

  const handleMicToggle = () => {
    if (isRecording) {
      setIsRecording(false);
      toast({
        title: 'Voice Input Finished',
        description: 'Captured passenger query.',
        type: 'info',
      });
      return;
    }

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-IN';
        recognition.interimResults = false;
        recognition.onstart = () => setIsRecording(true);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const text = event.results[0][0].transcript;
          setInput((prev) => (prev ? `${prev} ${text}` : text));
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
      } catch {
        setIsRecording(false);
      }
    } else {
      // Fallback simulation for environments without Web Speech
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setInput('Which platform does Mumbai Rajdhani depart from at New Delhi?');
        toast({
          title: 'Simulated Voice Query',
          description: 'Voice speech recognized as text.',
          type: 'info',
        });
      }, 1800);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[560px] max-w-5xl mx-auto">
      <div className="shrink-0 mb-3 space-y-2">
        <Breadcrumb items={[{ label: 'AI Assistant' }]} />

        {/* Header Controls */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B2545] dark:bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  RailVision Assistant
                </h1>
                <Badge variant="rail" size="sm" className="font-mono text-[10px]">
                  RAG Pipeline
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Grounded multi-agent assistance for rules, ticket policies &amp; platform navigation
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportTranscript}
              className="hidden sm:inline-flex text-xs gap-1.5"
              title="Export Conversation"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={resetConversation}
              className="text-xs gap-1.5"
              title="Reset Chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </Button>
          </div>
        </div>

        {/* System Architecture Collapsible Banner */}
        <div className="rounded-lg border border-blue-200/70 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 px-3 py-2 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              <span>Agent Mode: Verified Source Document Grounding</span>
            </div>
            <button
              onClick={() => setShowSystemDetails(!showSystemDetails)}
              className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>{showSystemDetails ? 'Hide details' : 'View grounding details'}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${showSystemDetails ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {showSystemDetails && (
            <div className="mt-2 pt-2 border-t border-blue-200/50 dark:border-blue-900/50 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
              <p>
                <strong>Navigation Agent:</strong> Resolves platform footprints, foot-over-bridge crossings, and lift coordinates.
              </p>
              <p>
                <strong>Document RAG Agent:</strong> Indexes Indian Railway Commercial Circulars (Refund Rules, Tatkal policies, Divyangjan quotas, Baggage norms).
              </p>
              <p>
                <strong>Complaint Triage Agent:</strong> Classifies station cleanliness and electrical defects with platform-level tracking.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4 scroll-smooth">
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onSelectSuggestion={(sug) => sendMessage(sug)}
          />
        ))}

        {/* Generating / Agent Thinking Indicator */}
        {isGenerating && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 max-w-md shadow-xs animate-pulse">
            <div className="w-7 h-7 rounded-lg bg-[#0B2545] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                RailVision Agent Reasoning...
              </p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 truncate mt-0.5">
                {agentStatus || 'Retrieving verified circulars & platform schematics...'}
              </p>
            </div>
          </div>
        )}

        {/* Suggested Queries if conversation is short */}
        {messages.length <= 2 && !isGenerating && (
          <div className="pt-2">
            <SuggestedPrompts onSelect={(prompt) => sendMessage(prompt)} />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Query Input Box (Fixed at Bottom) */}
      <div className="shrink-0 pt-3 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleMicToggle}
            className={`p-2.5 rounded-xl border transition-colors cursor-pointer shrink-0 ${
              isRecording
                ? 'bg-rose-600 text-white border-rose-600 animate-pulse'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600'
            }`}
            title={isRecording ? 'Listening... click to stop' : 'Voice command'}
          >
            {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isRecording
                ? 'Listening to speech...'
                : 'Ask about platform locations, refund rules, tatkal hours, or amenities...'
            }
            disabled={isGenerating}
            className="flex-1 h-12 px-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#0B2545] dark:focus:ring-blue-500 shadow-2xs"
          />

          <Button
            type="submit"
            size="md"
            disabled={!input.trim() || isGenerating}
            className="h-12 px-5 gap-1.5 shrink-0"
          >
            <span className="hidden sm:inline">Ask AI</span>
            <Send className="w-4 h-4" />
          </Button>
        </form>

        <p className="text-[10px] text-center text-slate-400 mt-2">
          RailVision AI verifies answers using Ministry of Railways circulars and indexed station schematics.
        </p>
      </div>
    </div>
  );
}
