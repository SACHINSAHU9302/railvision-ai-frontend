import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({ message = 'Loading railway data...', className }: LoadingStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center',
        className
      )}
    >
      <Loader2 className="w-8 h-8 animate-spin text-[#0B2545] dark:text-blue-400 mb-3" />
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{message}</p>
    </div>
  );
}
