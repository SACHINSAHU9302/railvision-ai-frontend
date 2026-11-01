'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { Sidebar } from '@/components/layout/sidebar';
import { Header } from '@/components/layout/header';
import { MobileNav } from '@/components/layout/mobile-nav';
import { Drawer } from '@/components/ui/drawer';

import {
  getStoredAccessToken,
  getCurrentUser,
  logoutUser,
} from '@/lib/api/auth';

import { isDemoMode } from '@/lib/api/client';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;

    const checkAuthentication = async () => {
      // Demo mode uses the existing demo experience.
      if (isDemoMode()) {
        if (isMounted) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
        }
        return;
      }

      const token = getStoredAccessToken();

      if (!token) {
        logoutUser();
        router.replace('/login');
        return;
      }

      try {
        // Verify the token by fetching the authenticated user's profile.
        await getCurrentUser(token);

        if (isMounted) {
          setIsAuthenticated(true);
          setIsCheckingAuth(false);
        }
      } catch {
        if (isMounted) {
          logoutUser();
          router.replace('/login');
        }
      }
    };

    setIsCheckingAuth(true);
    setIsAuthenticated(false);

    void checkAuthentication();

    return () => {
      isMounted = false;
    };
  }, [pathname, router]);

  if (isCheckingAuth || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0a0f1d]">
        <div className="text-center">
          <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-[#0a0f1d] dark:text-slate-100">
      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 z-30 hidden w-64 flex-col md:flex">
        <Sidebar />
      </div>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        side="right"
        title="RailVision AI"
      >
        <div className="-mx-6 -my-5">
          <Sidebar onCloseMobile={() => setMobileMenuOpen(false)} />
        </div>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col md:pl-64">
        <Header
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="mx-auto w-full max-w-7xl flex-1 p-4 pb-20 sm:p-6 md:pb-10 lg:p-8">
          {children}
        </main>

        {/* Mobile Bottom Navigation */}
        <MobileNav />
      </div>
    </div>
  );
}