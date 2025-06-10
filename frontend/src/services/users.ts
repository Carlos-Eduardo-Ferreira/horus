import axios from "axios";

export interface User {
  id: number;
  name: string;
  legal_name?: string;
  email: string;
  document: string;
  role: string | null;
}

export type UserWithIndex = User & {
  [key: string]: string | number | boolean | null | undefined;
};

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  }
}

export interface FilterParams {
  [key: string]: string | number | null;
}

export interface SortConfig {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export const usersService = {
  async list(
    token: string, 
    page: number = 1, 
    filters: FilterParams = {},
    sort?: SortConfig
  ): Promise<PaginatedResponse<User>> {
    const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as FilterParams);
    
    const params = {
      page,
      ...validFilters,
      ...(sort && sort.sortBy === 'name' && { sort_by: sort.sortBy, sort_order: sort.sortOrder })
    };
    
    const { data } = await axios.get<PaginatedResponse<User>>('/api/users', {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return data;
  },
  async get(id: number | string, token: string): Promise<UserWithIndex> {
    const { data } = await axios.get<{ data: User }>(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data as UserWithIndex;
  },
  async create(payload: Partial<UserWithIndex>, token: string): Promise<UserWithIndex> {
    const { data } = await axios.post<{ data: User }>(`/api/users`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data as UserWithIndex;
  },
  async update(id: number | string, payload: Partial<UserWithIndex>, token: string): Promise<UserWithIndex> {
    const { data } = await axios.put<{ data: User }>(`/api/users/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data as UserWithIndex;
  },
  async remove(id: number | string, token: string): Promise<void> {
    await axios.delete(`/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
