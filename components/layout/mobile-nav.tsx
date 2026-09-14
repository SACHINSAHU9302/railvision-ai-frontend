'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bot, AlertTriangle, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: '/dashboard', label: 'Home', icon: Home },
    { href: '/navigation', label: 'Navigate', icon: Compass },
    { href: '/assistant', label: 'AI Chat', icon: Bot, isCenter: true },
    { href: '/complaints', label: 'Grievance', icon: AlertTriangle },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 bg-white/95 dark:bg-[#0a0f1d]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-2 pb- safe">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);

        if (item.isCenter) {
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center -mt-5 group"
            >
              <div className="w-12 h-12 rounded-full bg-[#0B2545] dark:bg-blue-600 text-white shadow-lg flex items-center justify-center border-2 border-white dark:border-slate-900 group-active:scale-95 transition-transform">
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-semibold mt-1 text-[#0B2545] dark:text-blue-400">
                {item.label}
              </span>
            </Link>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center min-w-[56px] h-full py-1 text-[10px] font-medium transition-colors',
              isActive
                ? 'text-[#0B2545] dark:text-blue-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            )}
          >
            <Icon className={cn('w-5 h-5 mb-0.5', isActive ? 'stroke-[2.5]' : 'stroke-[1.75]')} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
