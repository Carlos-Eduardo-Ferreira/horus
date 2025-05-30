import axios from "axios";

export interface Action {
  id: number;
  name: string;
  identifier: string;
}

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

export const actionsService = {
  async list(
    token: string, 
    page: number = 1, 
    filters: FilterParams = {},
    sort?: SortConfig
  ): Promise<PaginatedResponse<Action>> {
    const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        acc[key] = value;
      }
      return acc;
    }, {} as FilterParams);
    
    const params = {
      page,
      ...validFilters,
      ...(sort && { sort_by: sort.sortBy, sort_order: sort.sortOrder })
    };
    
    const { data } = await axios.get<PaginatedResponse<Action>>('/api/actions', {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return data;
  },
  async get(id: number | string, token: string): Promise<Action> {
    const { data } = await axios.get<{ data: Action }>(`/api/actions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  },
  async create(payload: { name: string; identifier: string }, token: string): Promise<Action> {
    const { data } = await axios.post<{ data: Action }>(`/api/actions`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  },
  async update(id: number | string, payload: { name: string; identifier: string }, token: string): Promise<Action> {
    const { data } = await axios.put<{ data: Action }>(`/api/actions/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  },
  async remove(id: number | string, token: string): Promise<void> {
    await axios.delete(`/api/actions/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
