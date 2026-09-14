import { LoginCredentials, RegisterCredentials, User, AuthSession } from '@/types/auth';
import { isDemoMode } from './client';

const DEMO_USER: User = {
  id: 'usr-default',
  name: 'Passenger Adarsh',
  email: 'passenger@railvision.ai',
  role: 'passenger',
  phone: '+91 98765 43210',
  preferredLanguage: 'English',
  createdAt: '2026-09-01T00:00:00Z',
};

export async function loginUser(credentials: LoginCredentials): Promise<AuthSession> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      user: {
        ...DEMO_USER,
        email: credentials.email,
        name: credentials.email.split('@')[0] || 'Passenger',
      },
      isAuthenticated: true,
      token: 'demo-jwt-session-token',
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Authentication failed');
  return res.json();
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthSession> {
  if (isDemoMode()) {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return {
      user: {
        id: `usr-${Date.now()}`,
        name: credentials.name,
        email: credentials.email,
        role: 'passenger',
        createdAt: new Date().toISOString(),
      },
      isAuthenticated: true,
      token: 'demo-jwt-session-token',
    };
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!res.ok) throw new Error('Registration failed');
  return res.json();
}

export function getInitialDemoSession(): AuthSession {
  return {
    user: DEMO_USER,
    isAuthenticated: true,
    token: 'demo-token',
  };
}
