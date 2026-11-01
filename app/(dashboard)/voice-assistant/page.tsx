"use client";

import * as React from "react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mic, MicOff, Volume2, Bot, Radio, Square } from "lucide-react";

const SUPPORTED_LANGUAGES = [
  { value: "en-IN", label: "English (India)" },
  { value: "hi-IN", label: "Hindi (हिंदी)" },
  { value: "bn-IN", label: "Bengali (বাংলা)" },
  { value: "ta-IN", label: "Tamil (தமிழ்)" },
  { value: "te-IN", label: "Telugu (తెలుగు)" },
  { value: "mr-IN", label: "Marathi (मराठी)" },
  { value: "gu-IN", label: "Gujarati (ગુજરાતી)" },
];

type VoiceState = "idle" | "listening" | "processing" | "speaking";

type SpeechRecognitionAlternativeLike = { transcript: string };
type SpeechRecognitionResultLike = {
  isFinal: boolean;
  0: SpeechRecognitionAlternativeLike;
};
type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
};
type SpeechRecognitionErrorLike = { error?: string };
type RecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

declare global {
  interface Window {
    SpeechRecognition?: new () => RecognitionLike;
    webkitSpeechRecognition?: new () => RecognitionLike;
  }
}

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");
const RAG_ENDPOINT = `${API_BASE_URL}/api/rag/query/`;

export default function VoiceAssistantPage() {
  const { toast } = useToast();
  const [language, setLanguage] = React.useState("hi-IN");
  const [voiceState, setVoiceState] = React.useState<VoiceState>("idle");
  const [transcript, setTranscript] = React.useState("");
  const [response, setResponse] = React.useState(
    "नमस्ते! रेलवे स्टेशन, प्लेटफॉर्म और सुविधाओं के बारे में अपना सवाल पूछें।"
  );
  const [textFallback, setTextFallback] = React.useState("");
  const [error, setError] = React.useState("");

  const recognitionRef = React.useRef<RecognitionLike | null>(null);
  const transcriptRef = React.useRef("");
  const shouldSubmitOnEndRef = React.useRef(false);
  const requestInProgressRef = React.useRef(false);

  const stopSpeaking = React.useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setVoiceState((current) => (current === "speaking" ? "idle" : current));
  }, []);

  const speakAnswer = React.useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !("speechSynthesis" in window)) {
        setVoiceState("idle");
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.92;
      utterance.pitch = 1;

      const chooseVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const exact = voices.find((voice) => voice.lang.toLowerCase() === language.toLowerCase());
        const regional = voices.find((voice) =>
          voice.lang.toLowerCase().startsWith(language.split("-")[0].toLowerCase())
        );
        const selected = exact || regional;
        if (selected) utterance.voice = selected;
      };

      chooseVoice();
      utterance.onstart = () => setVoiceState("speaking");
      utterance.onend = () => setVoiceState("idle");
      utterance.onerror = () => setVoiceState("idle");

      // Some browsers load available voices asynchronously.
      window.speechSynthesis.onvoiceschanged = chooseVoice;
      window.speechSynthesis.speak(utterance);
    },
    [language]
  );

  const processVoiceQuery = React.useCallback(
    async (rawQuery: string) => {
      const query = rawQuery.trim();
      if (!query || requestInProgressRef.current) return;

      requestInProgressRef.current = true;
      setError("");
      setVoiceState("processing");
      setTranscript(query);

      try {
        const controller = new AbortController();
        const timeout = window.setTimeout(() => controller.abort(), 45000);

        let apiResponse: Response;
        try {
          apiResponse = await fetch(RAG_ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify({
              question: query,
              query,
              language,
            }),
            signal: controller.signal,
          });
        } finally {
          window.clearTimeout(timeout);
        }

        const data = await apiResponse.json().catch(() => ({}));

        if (!apiResponse.ok) {
          const message =
            data?.error || data?.detail || data?.message ||
            `Backend request failed (${apiResponse.status}).`;
          throw new Error(message);
        }

        const answer =
          data?.answer ||
          data?.response ||
          data?.result?.answer ||
          data?.data?.answer;

        if (typeof answer !== "string" || !answer.trim()) {
          throw new Error(
            "Backend response mein answer nahi mila. rag_query API ka JSON format { answer: '...' } hona chahiye."
          );
        }

        setResponse(answer.trim());
        speakAnswer(answer.trim());
      } catch (err) {
        const message =
          err instanceof Error
            ? err.name === "AbortError"
              ? "Backend response mein 45 seconds se zyada lag rahe hain. Django server aur RAG service check karein."
              : err.message
            : "Voice query process nahi ho saki.";

        setError(message);
        setResponse("Maaf kijiye, abhi aapka jawab nahi mil saka. Backend connection check karke dobara try karein.");
        setVoiceState("idle");
        toast({
          title: "Voice Assistant Error",
          description: message,
          type: "error",
        });
      } finally {
        requestInProgressRef.current = false;
      }
    },
    [language, speakAnswer, toast]
  );

  const startListening = React.useCallback(() => {
    if (typeof window === "undefined") return;

    stopSpeaking();
    setError("");
    setTranscript("");
    transcriptRef.current = "";
    shouldSubmitOnEndRef.current = true;

    const SpeechRecognitionConstructor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionConstructor) {
      shouldSubmitOnEndRef.current = false;
      setVoiceState("idle");
      toast({
        title: "Speech recognition not supported",
        description: "Chrome ya Edge browser use karein, ya neeche text input se question bhejein.",
        type: "error",
      });
      return;
    }

    try {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = language;
      recognition.continuous = false;
      recognition.interimResults = true;
      recognitionRef.current = recognition;

      recognition.onresult = (event) => {
        let combined = "";
        for (let index = 0; index < event.results.length; index += 1) {
          combined += event.results[index][0].transcript;
        }
        transcriptRef.current = combined.trim();
        setTranscript(combined.trim());
      };

      recognition.onerror = (event) => {
        shouldSubmitOnEndRef.current = false;
        setVoiceState("idle");
        const message =
          event.error === "not-allowed"
            ? "Microphone permission blocked hai. Browser address bar se microphone allow karein."
            : event.error === "no-speech"
              ? "Koi speech detect nahi hui. Microphone ke paas clearly bolkar dobara try karein."
              : `Speech recognition error: ${event.error || "unknown"}`;
        setError(message);
        toast({ title: "Microphone Error", description: message, type: "error" });
      };

      recognition.onend = () => {
        recognitionRef.current = null;
        setVoiceState("idle");

        if (!shouldSubmitOnEndRef.current) return;
        shouldSubmitOnEndRef.current = false;

        const finalQuery = transcriptRef.current.trim();
        if (finalQuery) {
          void processVoiceQuery(finalQuery);
        } else {
          setError("Aapki awaaz samajh nahi aayi. Dobara bolkar try karein.");
        }
      };

      setVoiceState("listening");
      recognition.start();
    } catch (err) {
      shouldSubmitOnEndRef.current = false;
      setVoiceState("idle");
      const message = err instanceof Error ? err.message : "Microphone start nahi ho saka.";
      setError(message);
      toast({ title: "Microphone Error", description: message, type: "error" });
    }
  }, [language, processVoiceQuery, stopSpeaking, toast]);

  const stopListening = React.useCallback(() => {
    if (!recognitionRef.current) return;
    // onend submits the latest transcript captured in transcriptRef.
    recognitionRef.current.stop();
  }, []);

  const handleMicClick = () => {
    if (voiceState === "listening") {
      stopListening();
    } else if (voiceState === "speaking") {
      stopSpeaking();
    } else if (voiceState !== "processing") {
      startListening();
    }
  };

  const handleFallbackSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = textFallback.trim();
    if (!query) return;
    setTextFallback("");
    void processVoiceQuery(query);
  };

  React.useEffect(() => {
    return () => {
      shouldSubmitOnEndRef.current = false;
      recognitionRef.current?.abort();
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb items={[{ label: "Voice Assistant" }]} />

      <div className="flex flex-col justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800 sm:flex-row sm:items-center">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 sm:text-2xl">
            <Radio className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span>Voice Passenger Assistant</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Ask questions about railway stations, platforms and facilities.
          </p>
        </div>

        <div className="w-52">
          <Select
            value={language}
            onChange={(event) => {
              setLanguage(event.target.value);
              toast({
                title: "Language Updated",
                description: `Speech language set to ${event.target.options[event.target.selectedIndex].text}`,
                type: "info",
              });
            }}
            options={SUPPORTED_LANGUAGES}
          />
        </div>
      </div>

      <Card className="relative overflow-hidden p-8 text-center sm:p-12">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300">
          <span
            className={`h-2 w-2 rounded-full ${
              voiceState === "listening"
                ? "animate-ping bg-rose-500"
                : voiceState === "processing"
                  ? "animate-pulse bg-amber-500"
                  : voiceState === "speaking"
                    ? "animate-pulse bg-emerald-500"
                    : "bg-slate-400"
            }`}
          />
          <span>
            {voiceState === "idle"
              ? "Ready to Listen"
              : voiceState === "listening"
                ? "Listening..."
                : voiceState === "processing"
                  ? "Connecting to Railway Knowledge Base..."
                  : "Speaking Answer..."}
          </span>
        </div>

        <div className="my-4 inline-flex items-center justify-center">
          <button
            type="button"
            onClick={handleMicClick}
            disabled={voiceState === "processing"}
            aria-label={
              voiceState === "listening"
                ? "Stop listening"
                : voiceState === "speaking"
                  ? "Stop speaking"
                  : "Start listening"
            }
            className={`relative z-10 flex h-24 w-24 items-center justify-center rounded-full text-white shadow-xl transition-all duration-300 disabled:cursor-wait disabled:opacity-60 ${
              voiceState === "listening"
                ? "scale-105 bg-rose-600"
                : voiceState === "speaking"
                  ? "bg-emerald-600"
                  : "bg-[#0B2545] hover:scale-105 dark:bg-blue-600"
            }`}
          >
            {voiceState === "listening" ? (
              <MicOff className="h-10 w-10" />
            ) : voiceState === "speaking" ? (
              <Volume2 className="h-10 w-10" />
            ) : (
              <Mic className="h-10 w-10" />
            )}
          </button>
        </div>

        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400">
          {voiceState === "idle"
            ? "Tap the microphone and ask your question"
            : voiceState === "listening"
              ? "Listening... tap the microphone again to finish"
              : voiceState === "processing"
                ? "Searching station database and RAG documents..."
                : "Playing audio response. Tap to stop."}
        </p>

        {voiceState === "listening" && (
          <div className="mt-4 flex h-8 items-center justify-center gap-1.5">
            {[40, 70, 90, 60, 80, 50, 95, 60, 40].map((height, index) => (
              <div
                key={index}
                style={{ height: `${height}%` }}
                className="w-1.5 animate-pulse rounded-full bg-blue-600"
              />
            ))}
          </div>
        )}

        {transcript && (
          <div className="mx-auto mt-8 max-w-xl rounded-xl border border-slate-200 bg-slate-50 p-4 text-left dark:border-slate-800 dark:bg-slate-800/60">
            <p className="text-[10px] font-bold uppercase text-slate-400">Captured Speech Transcript</p>
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
              “{transcript}”
            </p>
          </div>
        )}

        <div className="mx-auto mt-4 max-w-xl rounded-xl border border-blue-100 bg-blue-50/60 p-5 text-left dark:border-blue-900/60 dark:bg-blue-950/40">
          <div className="mb-2 flex items-center justify-between border-b border-blue-100 pb-2 dark:border-blue-900/60">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
              <Bot className="h-3.5 w-3.5" />
              RailVision Voice Response
            </span>
            <Badge variant="outline" size="sm" className="text-[10px]">
              Django RAG
            </Badge>
          </div>
          <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-sm">
            {response}
          </p>
        </div>

        {error && (
          <div className="mx-auto mt-4 max-w-xl rounded-lg border border-red-200 bg-red-50 p-3 text-left text-xs text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-300">
            {error}
          </div>
        )}
      </Card>

      <Card className="p-5">
        <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          Text Input Fallback
        </h4>
        <form onSubmit={handleFallbackSubmit} className="flex gap-2">
          <input
            type="text"
            value={textFallback}
            onChange={(event) => setTextFallback(event.target.value)}
            placeholder="Type your railway question..."
            className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-xs focus:ring-2 focus:ring-[#0B2545] dark:border-slate-700 dark:bg-slate-900"
          />
          <Button type="submit" size="sm" disabled={!textFallback.trim() || voiceState === "processing"}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
