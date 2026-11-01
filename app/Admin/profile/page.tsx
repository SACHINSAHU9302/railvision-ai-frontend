'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import {
    ShieldCheck,
    UserRound,
    Mail,
    CalendarDays,
    ArrowLeft,
    LogOut,
    LoaderCircle,
    AlertCircle,
    RefreshCw,
    Clock3,
    CheckCircle2,
} from 'lucide-react';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

import { Button } from '@/components/ui/button';

/* =========================================
   TYPES
========================================= */

interface AdminUser {
    id: number | string;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
    date_joined: string | null;
    last_login: string | null;
}

interface AdminProfileResponse {
    success: boolean;
    user?: AdminUser;
    message?: string;
}

/* =========================================
   PROFILE PAGE
========================================= */

export default function AdminProfilePage() {
    const router = useRouter();

    const [admin, setAdmin] = React.useState<AdminUser | null>(null);
    const [loading, setLoading] = React.useState(true);
    const [refreshing, setRefreshing] = React.useState(false);
    const [error, setError] = React.useState('');

    /* =========================================
       FETCH LIVE ADMIN DATA
    ========================================= */

    const fetchAdminProfile = React.useCallback(
        async (manualRefresh = false) => {
            const token = sessionStorage.getItem('adminAccessToken');

            if (!token) {
                router.replace('/Admin/login');
                return;
            }

            if (manualRefresh) {
                setRefreshing(true);
            } else {
                setLoading(true);
            }

            setError('');

            try {
                const apiBaseUrl = (
                    process.env.NEXT_PUBLIC_API_URL ||
                    'http://127.0.0.1:8000'
                ).replace(/\/$/, '');

                const response = await fetch(
                    `${apiBaseUrl}/api/auth/admin/profile/`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            Accept: 'application/json',
                        },
                        cache: 'no-store',
                    }
                );

                if (response.status === 401) {
                    sessionStorage.removeItem('adminAccessToken');
                    sessionStorage.removeItem('adminRefreshToken');
                    sessionStorage.removeItem('adminUser');

                    router.replace('/Admin/login');
                    return;
                }

                const data =
                    (await response.json()) as AdminProfileResponse;

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        'Unable to retrieve your profile from the server.'
                    );
                }

                if (!data.success || !data.user) {
                    throw new Error(
                        'The server returned an invalid profile response.'
                    );
                }

                setAdmin(data.user);

                // Keep the cached user data synchronized.
                sessionStorage.setItem(
                    'adminUser',
                    JSON.stringify(data.user)
                );
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Something went wrong while loading your profile.'
                );
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [router]
    );

    React.useEffect(() => {
        void fetchAdminProfile();
    }, [fetchAdminProfile]);

    /* =========================================
       LOGOUT
    ========================================= */

    const handleLogout = () => {
        sessionStorage.removeItem('adminAccessToken');
        sessionStorage.removeItem('adminRefreshToken');
        sessionStorage.removeItem('adminUser');

        router.replace('/Admin/login');
    };

    /* =========================================
       FORMAT DATE
    ========================================= */

    const formatDate = (value: string | null) => {
        if (!value) {
            return 'Not available';
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return 'Not available';
        }

        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    /* =========================================
       LOADING STATE
    ========================================= */

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <LoaderCircle className="h-10 w-10 animate-spin text-violet-600" />

                    <p className="text-sm font-medium text-slate-500">
                        Loading admin profile...
                    </p>
                </div>
            </div>
        );
    }

    /* =========================================
       ERROR STATE
    ========================================= */

    if (error || !admin) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center bg-white p-5">
                <Card className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <CardContent className="space-y-5 p-7">
                        <div className="flex items-center gap-4">
                            <AlertCircle className="h-8 w-8 shrink-0 text-red-500" />

                            <div>
                                <h2 className="text-lg font-bold text-slate-900">
                                    Unable to Load Profile
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    We could not retrieve your account details.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-xl border border-red-100 bg-white p-4">
                            <p className="break-words text-sm text-slate-600">
                                {error || 'Admin profile data is unavailable.'}
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <Button
                                onClick={() =>
                                    void fetchAdminProfile(true)
                                }
                                className="gap-2 bg-slate-900 text-white hover:bg-slate-700"
                            >
                                <RefreshCw className="h-4 w-4" />
                                Try Again
                            </Button>

                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                Sign Out
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    /* =========================================
       ADMIN DATA
    ========================================= */

    const fullName =
        `${admin.first_name ?? ''} ${admin.last_name ?? ''}`.trim() ||
        admin.username ||
        'Administrator';

    const accountRole = admin.is_staff
        ? 'Administrator'
        : 'Standard Account';

    /* =========================================
       REUSABLE DETAIL CARD
    ========================================= */

    const details = [
        {
            label: 'Full Name',
            value: fullName,
            Icon: UserRound,
            iconColor: 'text-violet-600',
        },
        {
            label: 'Email Address',
            value: admin.email || 'Not available',
            Icon: Mail,
            iconColor: 'text-blue-600',
        },
        {
            label: 'Account Role',
            value: accountRole,
            Icon: ShieldCheck,
            iconColor: 'text-orange-500',
        },
        {
            label: 'Username',
            value: admin.username || 'Not available',
            Icon: UserRound,
            iconColor: 'text-indigo-600',
        },
        {
            label: 'Member Since',
            value: formatDate(admin.date_joined),
            Icon: CalendarDays,
            iconColor: 'text-emerald-600',
        },
        {
            label: 'Last Login',
            value: formatDate(admin.last_login),
            Icon: Clock3,
            iconColor: 'text-amber-600',
        },
    ];

    /* =========================================
       MAIN UI
    ========================================= */

    return (
        <div className="min-h-screen px-4 py-6 text-slate-900 sm:px-6 lg:px-8 lg:py-8">            <div className="mx-auto max-w-6xl space-y-7">

            {/* PAGE HEADER */}

            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                    <Link
                        href="/admin/dashboard"
                        className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Admin Dashboard
                    </Link>

                    <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        Admin Profile
                    </h1>

                    <p className="mt-2 text-sm text-slate-500 sm:text-base">
                        Manage and view your administrator account information.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">



                </div>
            </div>

            {/* PROFILE CARD */}

<Card className="overflow-visible border-0 bg-transparent shadow-none">
                {/* WHITE PROFILE HEADER */}

                <div className="border-b border-slate-200 bg-white px-5 py-7 sm:px-8 sm:py-9">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

                        {/* Main icon: colored icon, white background */}

                        <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white">
                            <ShieldCheck className="h-11 w-11 text-violet-600" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="break-words text-xl font-bold text-slate-900 sm:text-2xl">
                                    {fullName}
                                </h2>

                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                                    {accountRole}
                                </span>
                            </div>

                            <p className="mt-2 break-all text-sm text-slate-500">
                                {admin.email || 'Email not available'}
                            </p>

                            <div className="mt-4 flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    Backend Connected
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600">
                                    <ShieldCheck className="h-4 w-4 text-violet-600" />
                                    Admin Session
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ACCOUNT INFORMATION — WHITE, NOT NAVY */}

                <div className="bg-white px-5 py-7 sm:px-8 sm:py-8">
                    <div className="mb-6">
                        <h3 className="text-lg font-bold text-slate-900">
                            Account Information
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                            Your account details retrieved from the Django backend.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                        {details.map(
                            ({ label, value, Icon, iconColor }) => (
                                <div
                                    key={label}
                                    className="group flex min-w-0 items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:border-slate-300 hover:shadow-sm"
                                >
                                    {/* White icon background stays white */}

                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white">
                                        <Icon
                                            className={`h-6 w-6 ${iconColor}`}
                                            strokeWidth={2}
                                        />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            {label}
                                        </p>

                                        <p className="mt-2 break-words text-sm font-semibold text-slate-900 sm:text-base">
                                            {value}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}

                    </div>
                </div>
            </Card>

            {/* SECURITY INFORMATION */}

            <div className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5">
                <div className="shrink-0">
                    <ShieldCheck className="h-6 w-6 text-emerald-600" />
                </div>

                <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                        Account Security
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-slate-500">
                        Your profile information is requested from the
                        Django backend using an authenticated API request.
                    </p>
                </div>
            </div>

        </div>
        </div>
    );
}