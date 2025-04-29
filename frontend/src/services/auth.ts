import axios from 'axios';

interface LoginCredentials { document: string; password: string }
interface User { id: number; name: string; email: string; type: string; document: string }
interface LoginResponse { user: User; token: string }

interface RegisterCredentials {
  name?: string;
  email?: string;
  document: string;
  password: string;
  password_confirmation: string;
  type: 'consumer' | 'company';
}

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>('/api/login', credentials);
    return data;
  },
  
  async register(credentials: RegisterCredentials): Promise<LoginResponse> {
    const { data } = await axios.post<LoginResponse>('/api/register', credentials);
    return data;
  }
};