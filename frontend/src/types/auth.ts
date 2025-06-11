export type UserRole = 'master' | 'admin' | 'user' | 'consumer' | 'company';

export interface User {
  id: number;
  name: string;
  legal_name?: string;
  email: string;
  document: string;
  role: UserRole;
  is_verified?: boolean;
  verification_status?: 'not_submitted' | 'pending' | 'approved' | 'rejected';
  permissions?: string[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: string[];
}

export interface LoginCredentials {
  document: string;
  password: string;
}

export interface RegisterData {
  name: string;
  legal_name?: string;
  email: string;
  document: string;
  password: string;
  password_confirmation: string;
  type: 'consumer' | 'company';
}

export interface AuthResponse {
  user: User;
  token: string;
}
