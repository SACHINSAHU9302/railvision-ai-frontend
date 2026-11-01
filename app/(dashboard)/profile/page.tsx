'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { useTheme } from '@/hooks/use-theme';
import { useToast } from '@/hooks/use-toast';

import {
  Clock,
  Moon,
  Sun,
  LogOut,
  ChevronRight,
  Bookmark,
  Loader2,
  User,
  RefreshCw,
} from 'lucide-react';

import {
  getCurrentUser,
  getStoredAccessToken,
  logoutUser,
} from '@/lib/api/auth';

import type { User as AuthUser } from '@/types/auth';

export default function ProfilePage() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();

  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState('');

  const loadProfile = React.useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = getStoredAccessToken();

      if (!token) {
        setUser(null);
        setError('Your session has expired. Please sign in again.');
        return;
      }

      const currentUser = await getCurrentUser(token);
      setUser(currentUser);
    } catch (err) {
      setUser(null);

      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load your profile.';

      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const handleSignOut = () => {
    logoutUser();

    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
      type: 'success',
    });

    router.replace('/login');
  };

  const handleClearHistory = () => {
    toast({
      title: 'Query History Cleared',
      description: 'Recent assistant queries removed from local session.',
      type: 'info',
    });
  };

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-IN', {
        month: 'short',
        year: 'numeric',
      })
    : 'Unknown';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <Breadcrumb items={[{ label: 'Passenger Profile & Settings' }]} />

      {/* User Information */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center gap-3 py-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">
              Loading your profile...
            </p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {error}
            </p>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => void loadProfile()}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Button>

              <Button
                size="sm"
                onClick={() => router.push('/login')}
              >
                Sign In
              </Button>
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#0B2545] dark:bg-blue-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
                {user.name?.trim()?.charAt(0)?.toUpperCase() || (
                  <User className="w-7 h-7" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {user.name}
                  </h1>

                  <Badge
                    variant="rail"
                    size="sm"
                    className="text-[10px] capitalize"
                  >
                    {user.role.replace('_', ' ')}
                  </Badge>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {user.email} • Member since {memberSince}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  toast({
                    title: 'Profile Information',
                    description:
                      'Your profile information is loaded from the Django backend.',
                    type: 'info',
                  });
                }}
                className="text-xs"
              >
                Profile Details
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-xs gap-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        ) : null}
      </Card>

      {/* Favorite Stations and Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Saved Favorite Stations</span>
          </h3>

          <div className="space-y-2.5">
            {[
              {
                code: 'NDLS',
                name: 'New Delhi Railway Station',
                pf: 16,
                id: 'ndls',
              },
              {
                code: 'CSMT',
                name: 'Mumbai CSMT',
                pf: 18,
                id: 'csmt',
              },
              {
                code: 'HWH',
                name: 'Howrah Junction',
                pf: 23,
                id: 'hwh',
              },
            ].map((station) => (
              <Link
                key={station.id}
                href={`/navigation/${station.id}`}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-blue-50/50 transition-all group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                      {station.code}
                    </span>

                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {station.name}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {station.pf} Platforms
                  </p>
                </div>

                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            ))}
          </div>
        </Card>

        {/* Application Preferences */}
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

            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="gap-1.5 text-xs"
            >
              {theme === 'dark' ? (
                <Sun className="w-3.5 h-3.5" />
              ) : (
                <Moon className="w-3.5 h-3.5" />
              )}

              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </Button>
          </div>

          <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                Data Mode
              </span>

              <Badge variant="rail" size="sm">
                Backend Connected
              </Badge>
            </div>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Your profile information is requested from the Django backend.
              Railway journey details and favorite stations may still use
              sample data.
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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearHistory}
            className="text-xs text-slate-400 hover:text-slate-600"
          >
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
          ].map((item, index) => (
            <Link
              key={index}
              href={`/assistant?q=${encodeURIComponent(item.q)}`}
              className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-xs"
            >
              <span className="text-slate-800 dark:text-slate-200 font-medium">
                &ldquo;{item.q}&rdquo;
              </span>

              <span className="text-[11px] text-slate-400 shrink-0 ml-3">
                {item.time}
              </span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}