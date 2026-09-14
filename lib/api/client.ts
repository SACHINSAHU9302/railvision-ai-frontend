import { ApiError } from '@/types/common';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';
const USE_DEMO_DATA = process.env.NEXT_PUBLIC_USE_DEMO_DATA !== 'false';

export const isDemoMode = (): boolean => {
  return USE_DEMO_DATA || !API_BASE_URL;
};

export class BackendConnectionError extends Error {
  code: string;
  constructor(message = 'RailVision AI backend service is not connected yet.') {
    super(message);
    this.name = 'BackendConnectionError';
    this.code = 'BACKEND_NOT_CONNECTED';
  }
}

export async function apiClient<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  if (isDemoMode()) {
    throw new BackendConnectionError();
  }

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    if (!res.ok) {
      const errorData: ApiError = await res.json().catch(() => ({
        message: `HTTP Error ${res.status}: ${res.statusText}`,
      }));
      throw new Error(errorData.message || 'API request failed');
    }

    return await res.json();
  } catch (error) {
    if (error instanceof Error && error.name === 'BackendConnectionError') {
      throw error;
    }
    throw new BackendConnectionError(
      error instanceof Error ? error.message : 'Failed to reach RailVision AI server'
    );
  }
}
