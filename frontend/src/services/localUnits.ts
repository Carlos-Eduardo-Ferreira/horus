import axios from "axios";

interface StateInfo {
  id: number;
  ibge_code: string;
  uf: string;
  name: string;
}

export interface LocalUnit {
  id: number;
  name: string;
  identifier: string;
  email: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state_id: number;
  zip_code: string;
  phone: string;
  state?: StateInfo;
}

export type LocalUnitWithIndex = LocalUnit & {
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

export const localUnitsService = {
  async list(
    token: string, 
    page: number = 1, 
    filters: FilterParams = {},
    sort?: SortConfig
  ): Promise<PaginatedResponse<LocalUnit>> {
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
    
    const { data } = await axios.get<PaginatedResponse<LocalUnit>>('/api/local-units', {
      headers: { Authorization: `Bearer ${token}` },
      params
    });
    return data;
  },
  async get(id: number | string, token: string): Promise<LocalUnitWithIndex> {
    const { data } = await axios.get<{ data: LocalUnit }>(`/api/local-units/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data as LocalUnitWithIndex;
  },
  async create(payload: Partial<LocalUnitWithIndex>, token: string): Promise<LocalUnitWithIndex> {
    const { data } = await axios.post<{ data: LocalUnit }>(`/api/local-units`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data as LocalUnitWithIndex;
  },
  async update(id: number | string, payload: Partial<LocalUnitWithIndex>, token: string): Promise<LocalUnitWithIndex> {
    const { data } = await axios.put<{ data: LocalUnit }>(`/api/local-units/${id}`, payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data as LocalUnitWithIndex;
  },
  async remove(id: number | string, token: string): Promise<void> {
    await axios.delete(`/api/local-units/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
