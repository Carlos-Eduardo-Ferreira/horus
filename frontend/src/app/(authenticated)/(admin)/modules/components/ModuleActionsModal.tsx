'use client';

import { useState, useEffect, useCallback } from "react";
import { Modal } from '@/components/Modal';
import Button from '@/components/Button';
import { GoGear } from "react-icons/go";
import { permissionsService, Action, ModuleActionsResponse } from '@/services/permissions';
import { useNotificationToast } from '@/hooks/useNotificationToast';
import { Module } from "@/services/modules";

interface ModuleActionsModalProps {
  show: boolean;
  onClose: () => void;
  module: Module | null;
}

export function ModuleActionsModal({ show, onClose, module }: ModuleActionsModalProps) {
  const [allActions, setAllActions] = useState<Action[]>([]);
  const [selectedActionIds, setSelectedActionIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { success, error } = useNotificationToast();

  const loadModuleActions = useCallback(async () => {
    if (!module) return;
    
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data: ModuleActionsResponse = await permissionsService.getModuleActions(module.id, token);
      setAllActions(data.all_actions);
      setSelectedActionIds(data.selected_actions);
    } catch (err) {
      console.error('Erro ao carregar ações:', err);
      error('Erro ao carregar as ações disponíveis.');
    } finally {
      setLoading(false);
    }
  }, [module, error]);

  useEffect(() => {
    if (show && module) {
      loadModuleActions();
    }
  }, [show, module, loadModuleActions]);

  const handleActionToggle = (actionId: number) => {
    setSelectedActionIds(prev => {
      if (prev.includes(actionId)) {
        return prev.filter(id => id !== actionId);
      } else {
        return [...prev, actionId];
      }
    });
  };

  const handleSave = async () => {
    if (!module) return;
    
    setSaving(true);
    const token = localStorage.getItem("token");
    if (!token) {
      setSaving(false);
      return;
    }

    try {
      await permissionsService.updateModuleActions(module.id, selectedActionIds, token);
      success('Ações definidas corretamente para o Módulo!');
      onClose();
    } catch (err) {
      console.error('Erro ao definir as permissões:', err);
      error('Erro ao definir as permissões');
    } finally {
      setSaving(false);
    }
  };

  const modalContent = (
    <>
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <div className="max-h-[60dvh] overflow-y-auto">
          {allActions.length === 0 ? (
            <div className="text-center text-gray-500 py-4">
              Nenhuma ação disponível
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {allActions.map((action) => (
                <label
                  key={action.id}
                  className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedActionIds.includes(action.id)}
                    onChange={() => handleActionToggle(action.id)}
                    className="h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500 cursor-pointer"
                    disabled={saving}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {action.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {action.identifier}
                    </div>
                  </div>
                </label>
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

  const modalTitle = module ? `Definir ações para: ${module.name}` : "Definir ações";

  return (
    <Modal
      show={show}
      onClose={onClose}
      icon={<GoGear className="text-yellow-500 text-2xl mr-2" />}
      title={modalTitle}
      size="sm"
      buttons={modalButtons}
    >
      {modalContent}
    </Modal>
  );
}
