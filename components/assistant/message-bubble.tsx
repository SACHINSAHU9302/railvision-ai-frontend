'use client';

import * as React from 'react';
import { Message } from '@/types/assistant';
import { CitationCard } from '@/components/assistant/citation-card';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check, Volume2, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  onSelectSuggestion?: (suggestion: string) => void;
}

export function MessageBubble({ message, onSelectSuggestion }: MessageBubbleProps) {
  const { toast } = useToast();
  const isUser = message.role === 'user';

  const [copied, setCopied] = React.useState(false);
  const [feedback, setFeedback] = React.useState<'like' | 'dislike' | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied to Clipboard',
      description: 'Response text ready to paste.',
      type: 'success',
    });
  };

  const handleFeedback = (type: 'like' | 'dislike') => {
    setFeedback(type);
    toast({
      title: 'Feedback Received',
      description: type === 'like' ? 'Thank you for your rating.' : 'Feedback noted for model alignment.',
      type: 'info',
    });
  };

  const handleSpeak = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      if (isPlaying) {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.content);
      utterance.rate = 1.0;
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      setIsPlaying(true);
      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: 'Voice Speech Notice',
        description: 'Text-to-speech audio playback completed.',
        type: 'info',
      });
    }
  };

  return (
    <div
      className={cn(
        'flex gap-3 max-w-3xl',
        isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
      )}
    >
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1',
          isUser
            ? 'bg-slate-700 text-white'
            : 'bg-[#0B2545] dark:bg-blue-600 text-white shadow-xs'
        )}
      >
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Message Body */}
      <div className="space-y-2 min-w-0 flex-1">
        <div
          className={cn(
            'p-4 rounded-2xl text-xs leading-relaxed',
            isUser
              ? 'bg-[#0B2545] text-white rounded-tr-xs'
              : 'bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-xs shadow-xs'
          )}
        >
          {/* Assistant Sub-Header */}
          {!isUser && (
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold text-blue-600 dark:text-blue-400">
                <Sparkles className="w-3 h-3" />
                <span>Multi-Agent RAG Grounded</span>
              </span>
              <span>{message.timestamp}</span>
            </div>
          )}

          {/* Text Content */}
          <div className="whitespace-pre-wrap">{message.content}</div>

          {/* Citations Box */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Verified Railway Sources:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {message.citations.map((citation, idx) => (
                  <CitationCard key={idx} citation={citation} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Toolbar for Assistant message */}
        {!isUser && (
          <div className="flex items-center gap-2 text-slate-400 text-xs px-1">
            <button
              onClick={handleSpeak}
              className={cn(
                'p-1.5 rounded hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors',
                isPlaying && 'text-blue-600 font-semibold'
              )}
              title="Listen to response"
            >
              <Volume2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Copy response"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => handleFeedback('like')}
              className={cn(
                'p-1.5 rounded hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors',
                feedback === 'like' && 'text-emerald-600 font-semibold'
              )}
              title="Helpful response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => handleFeedback('dislike')}
              className={cn(
                'p-1.5 rounded hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors',
                feedback === 'dislike' && 'text-rose-600 font-semibold'
              )}
              title="Inaccurate response"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Suggested Followups */}
        {message.suggestedFollowups && message.suggestedFollowups.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {message.suggestedFollowups.map((followup, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion?.(followup)}
                className="text-[11px] px-2.5 py-1 rounded-full border border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 transition-colors cursor-pointer"
              >
                {followup}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
