import axios from "axios";

export interface State {
  id: number;
  ibge_code: string;
  abbreviation: string;
  name: string;
}

export const statesService = {
  async list(token: string): Promise<State[]> {
    const { data } = await axios.get<{ data: State[] }>('/api/states', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data.data;
  }
};
