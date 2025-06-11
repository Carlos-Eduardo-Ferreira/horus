import axios from "axios";

export interface ModulePermission {
  module: {
    id: number;
    name: string;
    identifier: string;
  };
  actions: {
    permission_id: number;
    action: {
      id: number;
      name: string;
      identifier: string;
    };
  }[];
}

export interface UserPermissionsResponse {
  module_permissions: ModulePermission[];
  selected_permissions: number[];
}

export const userPermissionsService = {
  async getUserPermissions(userId: number | string, token: string): Promise<UserPermissionsResponse> {
    const { data } = await axios.get<UserPermissionsResponse>(`/api/users/${userId}/permissions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  },

  async updateUserPermissions(userId: number | string, permissionIds: number[], token: string): Promise<void> {
    await axios.put(`/api/users/${userId}/permissions`, {
      permission_ids: permissionIds
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
