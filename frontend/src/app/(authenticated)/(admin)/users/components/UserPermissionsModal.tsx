'use client';

import { useState, useEffect, useCallback } from "react";
import { Modal } from '@/components/Modal';
import Button from '@/components/Button';
import { GoGear } from "react-icons/go";
import { userPermissionsService, ModulePermission, UserPermissionsResponse } from '@/services/userPermissions';
import { useNotificationToast } from '@/hooks/useNotificationToast';
import { User } from "@/services/users";

interface UserPermissionsModalProps {
  show: boolean;
  onClose: () => void;
  user: User | null;
}

export function UserPermissionsModal({ show, onClose, user }: UserPermissionsModalProps) {
  const [modulePermissions, setModulePermissions] = useState<ModulePermission[]>([]);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success, error } = useNotificationToast();

  const loadUserPermissions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data: UserPermissionsResponse = await userPermissionsService.getUserPermissions(user.id, token);
      setModulePermissions(data.module_permissions);
      setSelectedPermissionIds(data.selected_permissions);
    } catch (err) {
      console.error('Erro ao carregar permissões:', err);
      error('Erro ao carregar as permissões disponíveis.');
    } finally {
      setLoading(false);
    }
  }, [user, error]);

  useEffect(() => {
    if (show && user) {
      loadUserPermissions();
    }
  }, [show, user, loadUserPermissions]);

  const handlePermissionToggle = (permissionId: number) => {
    setSelectedPermissionIds(prev => {
      if (prev.includes(permissionId)) {
        return prev.filter(id => id !== permissionId);
      } else {
        return [...prev, permissionId];
      }
    });
  };

  const handleModuleToggle = (moduleId: number) => {
    const modulePermission = modulePermissions.find(mp => mp.module.id === moduleId);
    if (!modulePermission) return;

    const modulePermissionIds = modulePermission.actions.map(action => action.permission_id);
    const allSelected = modulePermissionIds.every(id => selectedPermissionIds.includes(id));

    if (allSelected) {
      // Remove todas as permissões do módulo
      setSelectedPermissionIds(prev => prev.filter(id => !modulePermissionIds.includes(id)));
    } else {
      // Adiciona todas as permissões do módulo
      setSelectedPermissionIds(prev => {
        const newIds = [...prev];
        modulePermissionIds.forEach(id => {
          if (!newIds.includes(id)) {
            newIds.push(id);
          }
        });
        return newIds;
      });
    }
  };

  const isModuleFullySelected = (moduleId: number) => {
    const modulePermission = modulePermissions.find(mp => mp.module.id === moduleId);
    if (!modulePermission) return false;
    
    const modulePermissionIds = modulePermission.actions.map(action => action.permission_id);
    return modulePermissionIds.every(id => selectedPermissionIds.includes(id));
  };

  const isModulePartiallySelected = (moduleId: number) => {
    const modulePermission = modulePermissions.find(mp => mp.module.id === moduleId);
    if (!modulePermission) return false;
    
    const modulePermissionIds = modulePermission.actions.map(action => action.permission_id);
    return modulePermissionIds.some(id => selectedPermissionIds.includes(id)) && 
           !modulePermissionIds.every(id => selectedPermissionIds.includes(id));
  };

  const handleSave = async () => {
    if (!user) return;
    
    setSaving(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setSaving(false);
      return;
    }

    try {
      await userPermissionsService.updateUserPermissions(user.id, selectedPermissionIds, token);
      success('Permissões atualizadas com sucesso!');
      onClose();
    } catch (err) {
      console.error('Erro ao salvar permissões:', err);
      error('Erro ao salvar as permissões. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // User role permissions modal content
  const modalContent = (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="max-h-[60dvh] overflow-y-auto pr-2">
          {modulePermissions.length === 0 ? (
            <div className="text-center text-color py-4">
              Nenhuma permissão disponível
            </div>
          ) : (
            <div>
              {modulePermissions.map((modulePermission) => (
                <div key={modulePermission.module.id} className="py-2">
                  {/* Cabeçalho do módulo */}
                  <div className="flex items-center p-3 mb-3 border-b border-gray-200 bg-gray-50">
                    <input
                      type="checkbox"
                      checked={isModuleFullySelected(modulePermission.module.id)}
                      ref={input => {
                        if (input) {
                          input.indeterminate = isModulePartiallySelected(modulePermission.module.id);
                        }
                      }}
                      onChange={() => handleModuleToggle(modulePermission.module.id)}
                      className="h-5 w-5 border-gray-300 rounded mr-3 cursor-pointer"
                      disabled={saving}
                    />
                    <h3 className="text-md font-bold color-text">
                      {modulePermission.module.name}
                    </h3>
                  </div>

                  {/* Ações do módulo */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-3 gap-y-2 pl-1">
                    {modulePermission.actions.map((actionItem) => (
                      <label
                        key={actionItem.permission_id}
                        className="flex items-center space-x-2 px-3 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={selectedPermissionIds.includes(actionItem.permission_id)}
                          onChange={() => handlePermissionToggle(actionItem.permission_id)}
                          className="h-4 w-4 border-gray-300 rounded cursor-pointer"
                          disabled={saving}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm color-text truncate">
                            {actionItem.action.name}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );

  const modalButtons = (
    <div className="flex justify-center gap-3">
      <Button
        onClick={onClose}
        variant="light"
        className="h-10 px-6 rounded-xl"
        disabled={saving}
      >
        Cancelar
      </Button>
      
      <Button 
        onClick={handleSave} 
        variant="primary"
        className="h-10 px-6 rounded-xl"
        disabled={loading || saving}
      >
        {saving ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Salvando...
          </>
        ) : (
          "Salvar"
        )}
      </Button>
    </div>
  );

  const modalTitle = user ? `Definir permissões para: ${user.name}` : "Definir permissões";

  return (
    <Modal
      show={show}
      onClose={onClose}
      icon={<GoGear className="text-yellow-500 text-2xl mr-2" />}
      title={modalTitle}
      size="md"
      buttons={modalButtons}
    >
      {modalContent}
    </Modal>
  );
}
