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

export const actionsService = {
  async list(token: string, page: number = 1): Promise<PaginatedResponse<Action>> {
    const { data } = await axios.get<PaginatedResponse<Action>>('/api/actions', {
      headers: { Authorization: `Bearer ${token}` },
      params: { page }
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
