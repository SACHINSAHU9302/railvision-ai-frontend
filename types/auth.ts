export type UserRole = 'passenger' | 'station_staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: UserRole;
  status?: string;
  location?: string;
  avatarUrl?: string;
  phone?: string;
  preferredLanguage?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface AuthSession {
  user: User | null;
  isAuthenticated: boolean;
  token?: string;
}