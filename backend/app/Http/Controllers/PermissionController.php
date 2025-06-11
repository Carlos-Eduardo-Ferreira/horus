<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use App\Models\Module;
use App\Models\Action;
use App\Http\Resources\ActionResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PermissionController extends Controller
{
    public function getModuleActions(Module $module)
    {
        // Busca todas as ações disponíveis
        $allActions = Action::orderBy('name')->get();
        
        // Busca as ações já associadas ao Módulo
        $moduleActionIds = $module->permissions()->pluck('action_id')->toArray();
        
        return response()->json([
            'all_actions' => ActionResource::collection($allActions),
            'selected_actions' => $moduleActionIds
        ]);
    }

    public function updateModuleActions(Request $request, Module $module)
    {
        $request->validate([
            'action_ids' => 'nullable|array',
            'action_ids.*' => 'exists:actions,id'
        ]);

        try {
            DB::beginTransaction();

            // Remove todas as permissões existentes do Módulo
            $module->permissions()->delete();

            // Cria as novas permissões
            $permissions = [];
            foreach ($request->action_ids as $actionId) {
                $permissions[] = [
                    'module_id' => $module->id,
                    'action_id' => $actionId,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            if (!empty($permissions)) {
                Permission::insert($permissions);
            }

            DB::commit();

            return response()->json([
                'message' => 'Ações definidas corretamente para o Módulo.'
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erro ao definir as permissões.'
            ], 500);
        }
    }
}
