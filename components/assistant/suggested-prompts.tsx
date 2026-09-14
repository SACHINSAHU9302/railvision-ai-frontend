import * as React from 'react';
import { DEMO_SUGGESTED_PROMPTS } from '@/lib/demo/conversations';
import { Sparkles } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelect: (promptText: string) => void;
}

export function SuggestedPrompts({ onSelect }: SuggestedPromptsProps) {
  return (
    <div className="space-y-3 p-4 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 shadow-2xs">
      <div className="flex items-center gap-2 text-[#0B2545] dark:text-blue-400">
        <Sparkles className="w-4 h-4" />
        <h4 className="text-xs font-bold uppercase tracking-wider">Suggested Queries</h4>
      </div>
      <p className="text-xs text-slate-500 dark:text-slate-400">
        Select a query to test the grounded multi-agent railway reasoning engine:
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {DEMO_SUGGESTED_PROMPTS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.prompt)}
            className="text-left p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-700 bg-slate-50/70 dark:bg-slate-800/40 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all cursor-pointer group"
          >
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400">
              {item.label}
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
              &ldquo;{item.prompt}&rdquo;
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
