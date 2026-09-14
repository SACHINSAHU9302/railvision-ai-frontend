'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Compass,
  MapPin,
  Bot,
  BookOpen,
  AlertTriangle,
  ScanLine,
  Mic,
  Train,
  PhoneCall,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_CONFIG } from '@/lib/constants';

interface SidebarProps {
  onCloseMobile?: () => void;
}

export function Sidebar({ onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/navigation', label: 'Station Navigation', icon: Compass },
    { href: '/facilities', label: 'Facility Finder', icon: MapPin },
    { href: '/assistant', label: 'AI Assistant', icon: Bot, badge: 'RAG' },
    { href: '/documents', label: 'Railway Rules & Docs', icon: BookOpen },
    { href: '/complaints', label: 'Grievance & Help', icon: AlertTriangle },
    { href: '/ticket-scanner', label: 'Ticket Scanner', icon: ScanLine },
    { href: '/voice-assistant', label: 'Voice Assistant', icon: Mic },
  ];

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0a0f1d] transition-colors">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-200/90 dark:border-slate-800 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0B2545] text-white shadow-xs dark:bg-blue-600">
          <Train className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold tracking-tight text-slate-900 dark:text-slate-100 text-sm">
            {APP_CONFIG.name}
          </span>
          <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
            Multi-Agent RAG
          </span>
        </div>
      </div>

      {/* Main Nav Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
          Platform Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              className={cn(
                'flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group',
                isActive
                  ? 'bg-[#0B2545] text-white dark:bg-blue-600 shadow-2xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <Icon
                  className={cn(
                    'w-4 h-4 shrink-0 transition-colors',
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300'
                  )}
                />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    'px-1.5 py-0.2 text-[10px] rounded font-bold uppercase tracking-wider',
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-blue-50 text-[#0B2545] dark:bg-blue-950 dark:text-blue-300'
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Railway Emergency & Support Box */}
      <div className="p-3 border-t border-slate-200/90 dark:border-slate-800 space-y-2">
        <div className="p-3 rounded-lg bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/50">
          <div className="flex items-center gap-2 mb-1 text-[#0B2545] dark:text-blue-400">
            <PhoneCall className="w-3.5 h-3.5" />
            <span className="text-[11px] font-semibold">Indian Railway Helpline</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">General Enquiry:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">139</span>
          </div>
          <div className="flex items-center justify-between text-xs mt-0.5">
            <span className="text-slate-500 dark:text-slate-400">Security Emergency:</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 font-mono">182</span>
          </div>
        </div>

        {/* User profile button */}
        <Link
          href="/profile"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <User className="w-4 h-4 text-slate-400" />
          <span>Profile &amp; Settings</span>
        </Link>
      </div>
    </aside>
  );
}
