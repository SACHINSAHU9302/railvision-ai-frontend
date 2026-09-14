'use client';

import * as React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  Compass,
  ArrowRight,
  ShieldCheck,
  Globe,
  Radio,
} from 'lucide-react';
import { DEMO_ASSISTANT_RESPONSES } from '@/lib/demo/conversations';

const SUPPORTED_LANGUAGES = [
  { value: 'en-IN', label: 'English (India)' },
  { value: 'hi-IN', label: 'Hindi (हिंदी)' },
  { value: 'bn-IN', label: 'Bengali (বাংলা)' },
  { value: 'ta-IN', label: 'Tamil (தமிழ்)' },
  { value: 'te-IN', label: 'Telugu (తెలుగు)' },
  { value: 'mr-IN', label: 'Marathi (मराठी)' },
  { value: 'gu-IN', label: 'Gujarati (ગુજરાતી)' },
];

export default function VoiceAssistantPage() {
  const { toast } = useToast();

  const [language, setLanguage] = React.useState('en-IN');
  const [voiceState, setVoiceState] = React.useState<'idle' | 'listening' | 'processing' | 'speaking'>('idle');
  const [transcript, setTranscript] = React.useState<string>('');
  const [response, setResponse] = React.useState<string>(
    'Hello, passenger. Speak your question about train delays, platform numbers, or station facilities.'
  );
  const [textFallback, setTextFallback] = React.useState('');

  const handleStartListening = () => {
    if (voiceState === 'listening') {
      stopListening();
      return;
    }

    setTranscript('');
    setVoiceState('listening');

    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = language;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
          const text = Array.from(event.results)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((r: any) => r[0].transcript)
            .join('');
          setTranscript(text);
        };

        recognition.onend = () => {
          processVoiceQuery(transcript || 'Where is the executive lounge at New Delhi station?');
        };

        recognition.onerror = () => {
          simulateVoiceResponse();
        };

        recognition.start();
      } catch {
        simulateVoiceResponse();
      }
    } else {
      simulateVoiceResponse();
    }
  };

  const simulateVoiceResponse = () => {
    setTimeout(() => {
      const simulated = 'Where is the executive lounge at New Delhi station?';
      setTranscript(simulated);
      processVoiceQuery(simulated);
    }, 2200);
  };

  const stopListening = () => {
    setVoiceState('processing');
    processVoiceQuery(transcript || 'How do I reach Platform 2?');
  };

  const processVoiceQuery = (query: string) => {
    setVoiceState('processing');
    setTimeout(() => {
      const matched = DEMO_ASSISTANT_RESPONSES.find((r) =>
        r.query.toLowerCase().includes('lounge') || r.query.toLowerCase().includes('platform')
      );
      const answer =
        matched?.response ||
        'The Executive Lounge at New Delhi Station is situated at Concourse Level near Platform 16 (Ajmeri Gate side). It offers recliner seating, refreshments, and high-speed Wi-Fi.';

      setResponse(answer);
      setVoiceState('speaking');

      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(answer);
        utterance.rate = 1.0;
        utterance.onend = () => setVoiceState('idle');
        utterance.onerror = () => setVoiceState('idle');
        window.speechSynthesis.speak(utterance);
      } else {
        setTimeout(() => setVoiceState('idle'), 3500);
      }
    }, 1200);
  };

  const handleFallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textFallback.trim()) return;
    setTranscript(textFallback.trim());
    setTextFallback('');
    processVoiceQuery(textFallback.trim());
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Breadcrumb items={[{ label: 'Voice Assistant' }]} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Radio className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <span>Voice Passenger Assistant</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Hands-free audio inquiry for passengers on the move.
          </p>
        </div>

        {/* Language selector */}
        <div className="w-52">
          <Select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value);
              toast({
                title: 'Language Updated',
                description: `Voice model switched to ${e.target.options[e.target.selectedIndex].text}`,
                type: 'info',
              });
            }}
            options={SUPPORTED_LANGUAGES}
          />
        </div>
      </div>

      {/* Main Interactive Stage */}
      <Card className="p-8 sm:p-12 text-center relative overflow-hidden">
        {/* State Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-8 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300">
          <span
            className={`w-2 h-2 rounded-full ${
              voiceState === 'listening'
                ? 'bg-rose-500 animate-ping'
                : voiceState === 'processing'
                ? 'bg-amber-500 animate-pulse'
                : voiceState === 'speaking'
                ? 'bg-emerald-500 animate-pulse'
                : 'bg-slate-400'
            }`}
          />
          <span className="capitalize">
            {voiceState === 'idle'
              ? 'Ready to Listen'
              : voiceState === 'listening'
              ? 'Listening to Speech...'
              : voiceState === 'processing'
              ? 'Multi-Agent Processing...'
              : 'Speaking Answer...'}
          </span>
        </div>

        {/* Pulsing Mic Center Button */}
        <div className="relative inline-flex items-center justify-center my-4">
          {voiceState === 'listening' && (
            <>
              <span className="absolute w-36 h-36 rounded-full bg-blue-500/20 animate-ping" />
              <span className="absolute w-28 h-28 rounded-full bg-blue-500/30 animate-pulse" />
            </>
          )}

          {voiceState === 'speaking' && (
            <span className="absolute w-32 h-32 rounded-full bg-emerald-500/20 animate-pulse" />
          )}

          <button
            type="button"
            onClick={handleStartListening}
            className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 relative z-10 cursor-pointer ${
              voiceState === 'listening'
                ? 'bg-rose-600 text-white scale-105'
                : voiceState === 'speaking'
                ? 'bg-emerald-600 text-white'
                : 'bg-[#0B2545] dark:bg-blue-600 text-white hover:scale-105'
            }`}
          >
            {voiceState === 'speaking' ? (
              <Volume2 className="w-10 h-10" />
            ) : voiceState === 'listening' ? (
              <MicOff className="w-10 h-10 animate-pulse" />
            ) : (
              <Mic className="w-10 h-10" />
            )}
          </button>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400 mt-6">
          {voiceState === 'idle'
            ? 'Tap the microphone to speak your station or journey query'
            : voiceState === 'listening'
            ? 'Listening... tap again when finished'
            : voiceState === 'processing'
            ? 'Cross-referencing station data...'
            : 'Playing audio response'}
        </p>

        {/* Live Audio Visualizer Bars Simulation */}
        {voiceState === 'listening' && (
          <div className="flex items-center justify-center gap-1.5 mt-4 h-8">
            {[40, 70, 90, 60, 80, 50, 95, 60, 40].map((h, i) => (
              <div
                key={i}
                style={{ height: `${h}%` }}
                className="w-1.5 bg-blue-600 rounded-full animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Transcript Box */}
        {transcript && (
          <div className="mt-8 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 text-left max-w-xl mx-auto">
            <p className="text-[10px] uppercase font-bold text-slate-400">Captured Speech Transcript</p>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mt-1">
              &ldquo;{transcript}&rdquo;
            </p>
          </div>
        )}

        {/* Response Box */}
        <div className="mt-4 p-5 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-left max-w-xl mx-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-blue-100 dark:border-blue-900/60">
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" />
              <span>RailVision Voice Response</span>
            </span>
            <Badge variant="outline" size="sm" className="text-[10px]">
              Grounded Audio
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            {response}
          </p>
        </div>
      </Card>

      {/* Fallback Keyboard Input for Silent / Browser Sandbox */}
      <Card className="p-5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Text Input Fallback
        </h4>
        <form onSubmit={handleFallbackSubmit} className="flex gap-2">
          <input
            type="text"
            value={textFallback}
            onChange={(e) => setTextFallback(e.target.value)}
            placeholder="Type your inquiry if voice input is unavailable..."
            className="flex-1 h-10 px-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:ring-2 focus:ring-[#0B2545]"
          />
          <Button type="submit" size="sm" disabled={!textFallback.trim()}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
