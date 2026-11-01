import {
  LoginCredentials,
  RegisterCredentials,
  User,
  AuthSession,
} from '@/types/auth';

import { isDemoMode } from './client';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const DEMO_USER: User = {
  id: 'usr-default',
  name: 'Passenger',
  email: 'passenger@railvision.ai',
  role: 'passenger',
  phone: '',
  preferredLanguage: 'English',
  createdAt: '2026-09-01T00:00:00Z',
};

interface AuthTokenResponse {
  access: string;
  refresh: string;
}

interface BackendUser {
  id: number;
  username: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  date_joined?: string;
  is_staff?: boolean;
}

interface BackendProfile {
  phone?: string;
  role?: string;
  status?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
}

interface BackendProfileResponse {
  success: boolean;
  user: BackendUser;
  profile: BackendProfile;
}

// Fetch the logged-in user's Django profile.
export async function getCurrentUser(
  accessToken: string,
): Promise<User> {
  if (!API_URL) {
    throw new Error(
      'API URL is not configured. Check NEXT_PUBLIC_API_URL.',
    );
  }

  const response = await fetch(`${API_URL}/api/auth/profile/`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  });

  const data = await parseResponse<BackendProfileResponse>(response);

  if (!data.user) {
    throw new Error('User information was not returned by the backend.');
  }

  const backendUser = data.user;
  const profile = data.profile ?? {};

  const fullName =
    backendUser.name ||
    `${backendUser.first_name ?? ''} ${backendUser.last_name ?? ''}`.trim() ||
    backendUser.username ||
    backendUser.email;

  const backendRole = (profile.role || 'Passenger').toLowerCase();

  let role: User['role'] = 'passenger';

  if (backendRole === 'admin' || backendUser.is_staff) {
    role = 'admin';
  } else if (
    backendRole === 'station manager' ||
    backendRole === 'station_manager' ||
    backendRole === 'support agent'
  ) {
    role = 'station_staff';
  }

  return {
    id: String(backendUser.id),
    name: fullName,
    username: backendUser.username,
    email: backendUser.email,
    role,
    phone: profile.phone ?? '',
    status: profile.status ?? 'Active',
    location: profile.location ?? '',
    createdAt:
      profile.created_at ||
      backendUser.date_joined ||
      new Date().toISOString(),
    updatedAt: profile.updated_at,
  };
}

async function parseResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    let message = 'Something went wrong. Please try again.';

    if (data && typeof data === 'object') {
      if (typeof data.detail === 'string') {
        message = data.detail;
      } else if (typeof data.message === 'string') {
        message = data.message;
      } else {
        const errors = Object.values(data)
          .flat()
          .filter(
            (value): value is string => typeof value === 'string',
          );

        if (errors.length > 0) {
          message = errors.join(' ');
        }
      }
    }

    throw new Error(message);
  }

  return data as T;
}

// Save JWT tokens after successful registration or login.
function saveTokens(
  accessToken: string,
  refreshToken: string,
  rememberMe = true,
): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');

  const storage = rememberMe ? localStorage : sessionStorage;

  storage.setItem('accessToken', accessToken);
  storage.setItem('refreshToken', refreshToken);
}

// Get the stored access token.
export function getStoredAccessToken(): string | null {
  if (typeof window === 'undefined') return null;

  return (
    sessionStorage.getItem('accessToken') ||
    localStorage.getItem('accessToken')
  );
}

// Clear authentication tokens.
export function logoutUser(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');

  sessionStorage.removeItem('accessToken');
  sessionStorage.removeItem('refreshToken');
}

// Register passenger and automatically establish an authenticated session.
export async function registerUser(
  credentials: RegisterCredentials,
): Promise<AuthSession> {
  if (isDemoMode()) {
    throw new Error(
      'Demo Mode is active. Please configure the Django backend connection.',
    );
  }

  if (!API_URL) {
    throw new Error(
      'API URL is not configured. Check NEXT_PUBLIC_API_URL.',
    );
  }

  const username = credentials.email
    .trim()
    .toLowerCase()
    .split('@')[0];

  const response = await fetch(`${API_URL}/api/auth/register/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: credentials.name.trim(),
      username,
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
      password2: credentials.confirmPassword,
    }),
  });

  const data = await parseResponse<AuthTokenResponse>(response);

  if (!data.access || !data.refresh) {
    throw new Error(
      'Account created, but authentication tokens were not returned. Please log in.',
    );
  }

  // Save the tokens returned by Django.
  saveTokens(data.access, data.refresh, true);

  try {
    // Fetch the actual profile of the newly registered user.
    const user = await getCurrentUser(data.access);

    return {
      user,
      isAuthenticated: true,
      token: data.access,
    };
  } catch (error) {
    // Avoid leaving an invalid session behind.
    logoutUser();
    throw error;
  }
}

// Login using Django Simple JWT.
export async function loginUser(
  credentials: LoginCredentials,
): Promise<AuthSession> {
  if (isDemoMode()) {
    throw new Error(
      'Demo Mode is active. Please configure the Django backend connection.',
    );
  }

  if (!API_URL) {
    throw new Error(
      'API URL is not configured. Check NEXT_PUBLIC_API_URL.',
    );
  }

  const response = await fetch(`${API_URL}/api/auth/token/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials.email.trim().toLowerCase(),
      password: credentials.password,
    }),
  });

  const data = await parseResponse<AuthTokenResponse>(response);

  saveTokens(
    data.access,
    data.refresh,
    credentials.rememberMe ?? true,
  );

  try {
    const user = await getCurrentUser(data.access);

    return {
      user,
      isAuthenticated: true,
      token: data.access,
    };
  } catch (error) {
    logoutUser();
    throw error;
  }
}

// Demo session helper.
export function getInitialDemoSession(): AuthSession {
  return {
    user: DEMO_USER,
    isAuthenticated: true,
    token: 'demo-token',
  };
}