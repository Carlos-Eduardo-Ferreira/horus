import axios from "axios";
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

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>('/api/login', payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>('/api/register', payload);
    return data;
  },

  async getCurrentUser(token: string): Promise<CurrentUserResponse> {
    const { data } = await axios.get<CurrentUserResponse>('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  async logout(token: string): Promise<void> {
    await axios.post('/api/logout', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};