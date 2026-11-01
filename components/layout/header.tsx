'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useTheme } from '@/hooks/use-theme';
import { isDemoMode } from '@/lib/api/client';
import {
  getCurrentUser,
  getStoredAccessToken,
} from '@/lib/api/auth';

import type { User as AuthUser } from '@/types/auth';

import {
  Search,
  Moon,
  Sun,
  Bell,
  ShieldCheck,
  Menu,
} from 'lucide-react';

import { CommandPalette } from './command-palette';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export function Header({ onOpenMobileMenu }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  const [isCommandOpen, setIsCommandOpen] = React.useState(false);
  const [currentUser, setCurrentUser] =
    React.useState<AuthUser | null>(null);

  const demoActive = isDemoMode();
  const pathname = usePathname();

  // Fetch the currently logged-in user's profile.
  React.useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const token = getStoredAccessToken();

      if (!token) {
        if (isMounted) {
          setCurrentUser(null);
        }
        return;
      }

      try {
        const user = await getCurrentUser(token);

        if (isMounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error('Unable to load header user:', error);

        if (isMounted) {
          setCurrentUser(null);
        }
      }
    }

    void loadUser();

    return () => {
      isMounted = false;
    };
  }, [pathname]);

  // Hide the header on Admin routes.
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const avatarLetter =
    currentUser?.name?.trim()?.charAt(0)?.toUpperCase() || 'U';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/90 dark:border-slate-800 bg-white/85 dark:bg-[#0a0f1d]/85 backdrop-blur-md px-4 sm:px-6 transition-colors">
        {/* Left: Mobile menu and Search */}
        <div className="flex items-center gap-3 w-full max-w-md">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Universal Search */}
          <button
            type="button"
            onClick={() => setIsCommandOpen(true)}
            className="flex items-center justify-between w-full h-9.5 px-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-xs text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-2xs group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />

              <span className="hidden sm:inline">
                Search station, platform, facility or ask anything...
              </span>

              <span className="sm:hidden">
                Search RailVision...
              </span>
            </div>

            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400 bg-white dark:bg-slate-800 rounded border border-slate-200 dark:border-slate-700">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Demo Mode Indicator */}
          {demoActive && (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#0B2545] dark:text-blue-300 border border-blue-200/80 dark:border-blue-900/60 text-[11px] font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400 animate-pulse" />
              <span>Controlled Demo Data</span>
            </div>
          )}

          {/* Admin Shortcut */}
          <Link
            href="/Admin/login"
            className="hidden sm:flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin</span>
          </Link>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications */}
          <Link
            href="/profile#notifications"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />

            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900" />
          </Link>

          {/* Dynamic User Avatar */}
          <Link
            href="/profile"
            aria-label={
              currentUser
                ? `Profile of ${currentUser.name}`
                : 'User profile'
            }
            title={currentUser?.name || 'User profile'}
            className="flex items-center gap-2 pl-2 hover:opacity-90 transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-[#0B2545] dark:bg-blue-600 text-white flex items-center justify-center font-semibold text-xs border border-blue-200 dark:border-blue-900">
              {avatarLetter}
            </div>
          </Link>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
      />
    </>
  );
}