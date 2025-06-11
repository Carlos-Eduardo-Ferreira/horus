import axios from "axios";

export interface Action {
  id: number;
  name: string;
  identifier: string;
}

export interface ModuleActionsResponse {
  all_actions: Action[];
  selected_actions: number[];
}

export const permissionsService = {
  async getModuleActions(moduleId: number | string, token: string): Promise<ModuleActionsResponse> {
    const { data } = await axios.get<ModuleActionsResponse>(`/api/modules/${moduleId}/actions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  async updateModuleActions(moduleId: number | string, actionIds: number[], token: string): Promise<void> {
    await axios.put(`/api/modules/${moduleId}/actions`, {
      action_ids: actionIds
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
