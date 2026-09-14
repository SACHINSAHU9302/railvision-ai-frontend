import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/hooks/use-theme';
import { ToastProvider } from '@/hooks/use-toast';
import { ToastContainer } from '@/components/ui/toast-container';

export const metadata: Metadata = {
  title: 'RailVision AI - AI Railway Navigation & Assistance System',
  description: 'AI Railway Navigation & Assistance System using Multi-Agent RAG. Navigate stations, discover facilities, understand railway rules and get intelligent assistance.',
  openGraph: {
    title: 'RailVision AI - AI Railway Navigation & Assistance System',
    description: 'AI Railway Navigation & Assistance System using Multi-Agent RAG.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RailVision AI - AI Railway Navigation & Assistance System',
    description: 'AI Railway Navigation & Assistance System using Multi-Agent RAG.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0f1d] dark:text-slate-100 antialiased selection:bg-blue-600 selection:text-white">
        <ThemeProvider>
          <ToastProvider>
            {children}
            <ToastContainer />
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

