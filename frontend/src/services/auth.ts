import axios from "@/lib/axios";
import { User } from "@/types/auth";

export interface LoginPayload {
  document: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  document: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CurrentUserResponse {
  user: User;
}

function isAxiosError(error: unknown): error is { response: { status: number; data?: { message?: string } } } {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: unknown }).response === "object" &&
    (error as { response?: { status?: unknown } }).response !== null &&
    typeof (error as { response: { status?: unknown } }).response.status === "number"
  );
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    try {
      const { data } = await axios.post<LoginResponse>('/api/login', payload);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || "Local unit inválido.");
        }
      }
      throw error;
    }
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    try {
      const { data } = await axios.post<LoginResponse>('/api/register', payload);
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || "Local unit inválido.");
        }
      }
      throw error;
    }
  },

  async getCurrentUser(token: string): Promise<CurrentUserResponse> {
    try {
      const { data } = await axios.get<CurrentUserResponse>('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return data;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || "Local unit inválido.");
        }
      }
      throw error;
    }
  },

  async logout(token: string): Promise<void> {
    try {
      await axios.post('/api/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        if (error.response.status === 400) {
          throw new Error(error.response.data?.message || "Local unit inválido.");
        }
      }
      throw error;
    }
  }
};