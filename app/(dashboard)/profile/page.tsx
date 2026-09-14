'use client';

import * as React from 'react';
import Link from 'next/link';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';
import {
  User,
  Train,
  Clock,
  Compass,
  MapPin,
  Moon,
  Sun,
  ShieldCheck,
  Bot,
  LogOut,
  ChevronRight,
  Bookmark,
} from 'lucide-react';
import { DEMO_USER } from '@/lib/demo/dashboard';

export default function ProfilePage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [language, setLanguage] = React.useState('en-IN');

  const handleClearHistory = () => {
    toast({
      title: 'Query History Cleared',
      description: 'Recent assistant queries removed from local session.',
      type: 'info',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Passenger Profile & Settings' }]} />

      {/* User Information Card */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0B2545] dark:bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {DEMO_USER.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  {DEMO_USER.name}
                </h1>
                <Badge variant="rail" size="sm" className="text-[10px] capitalize">
                  {DEMO_USER.role}
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {DEMO_USER.email} • Passenger Member since {DEMO_USER.memberSince}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                toast({
                  title: 'Demo Session Active',
                  description: 'Profile is operating in frontend-isolated demo mode.',
                });
              }}
              className="text-xs"
            >
              Edit Profile
            </Button>
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30">
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      {/* Saved Journeys & Favorite Stations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Saved Stations */}
        <Card className="p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Saved Favorite Stations</span>
          </h3>

          <div className="space-y-2.5">
            {[
              { code: 'NDLS', name: 'New Delhi Railway Station', pf: 16, id: 'ndls' },
              { code: 'CSMT', name: 'Mumbai CSMT', pf: 18, id: 'csmt' },
              { code: 'HWH', name: 'Howrah Junction', pf: 23, id: 'hwh' },
            ].map((stn) => (
              <Link
                key={stn.id}
                href={`/navigation/${stn.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/50 transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {stn.code}
                    </span>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {stn.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{stn.pf} Platforms</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Preferences & Theme Toggle */}
        <Card className="p-5 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Application Preferences
          </h3>

          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
            <div>
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Interface Appearance
              </p>
              <p className="text-[11px] text-slate-500">
                Currently using {theme === 'dark' ? 'Dark' : 'Light'} theme
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={toggleTheme} className="gap-1.5 text-xs">
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </Button>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Data Mode
              </span>
              <Badge variant="rail" size="sm">
                Controlled Demo Mode
              </Badge>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Running with sample Indian Railways timetable and circulars. To connect live backends, toggle `NEXT_PUBLIC_USE_DEMO_DATA=false`.
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Queries History */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>Recent AI Assistant Queries</span>
          </h3>
          <Button variant="ghost" size="sm" onClick={handleClearHistory} className="text-xs text-slate-400 hover:text-slate-600">
            Clear History
          </Button>
        </div>

        <div className="space-y-2">
          {[
            {
              q: 'Where is the executive lounge at New Delhi Station?',
              time: 'Today, 08:30 AM',
            },
            {
              q: 'What is the refund rule for train delayed by 3 hours?',
              time: 'Yesterday, 04:15 PM',
            },
            {
              q: 'How to reach platform 2 from Paharganj Gate?',
              time: 'Sep 11, 10:20 AM',
            },
          ].map((item, idx) => (
            <Link
              key={idx}
              href={`/assistant?q=${encodeURIComponent(item.q)}`}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs"
            >
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                &ldquo;{item.q}&rdquo;
              </span>
              <span className="text-[11px] text-slate-400 shrink-0 ml-3">{item.time}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
