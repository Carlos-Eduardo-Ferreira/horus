<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\UserRole;
use App\Models\Permission;
use App\Models\RolePermission;
use App\Http\Resources\ActionResource;
use App\Http\Resources\ModuleResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RolePermissionsController extends Controller
{
    public function getUserRolePermissions(User $user)
    {
        // Busca o UserRole do usuário
        $userRole = UserRole::where('user_id', $user->id)->first();
        
        if (!$userRole) {
            return response()->json([
                'message' => 'Usuário não possui role definida.'
            ], 404);
        }

        // Busca todas as permissões disponíveis (módulos com suas ações)
        $permissions = Permission::with(['module', 'action'])
            ->join('modules', 'permissions.module_id', '=', 'modules.id')
            ->join('actions', 'permissions.action_id', '=', 'actions.id')
            ->orderBy('modules.name')
            ->orderBy('actions.name')
            ->select('permissions.*')
            ->get();

        // Organiza por módulos
        $modulePermissions = [];
        foreach ($permissions as $permission) {
            $moduleId = $permission->module_id;
            if (!isset($modulePermissions[$moduleId])) {
                $modulePermissions[$moduleId] = [
                    'module' => new ModuleResource($permission->module),
                    'actions' => []
                ];
            }
            $modulePermissions[$moduleId]['actions'][] = [
                'permission_id' => $permission->id,
                'action' => new ActionResource($permission->action)
            ];
        }

        // Busca as permissões já associadas ao usuário
        $userPermissionIds = RolePermission::where('user_role_id', $userRole->id)
            ->pluck('permission_id')
            ->toArray();

        return response()->json([
            'module_permissions' => array_values($modulePermissions),
            'selected_permissions' => $userPermissionIds
        ]);
    }

    public function updateUserRolePermissions(Request $request, User $user)
    {
        $request->validate([
            'permission_ids' => 'nullable|array',
            'permission_ids.*' => 'exists:permissions,id'
        ]);

        // Busca o UserRole do usuário
        $userRole = UserRole::where('user_id', $user->id)->first();
        
        if (!$userRole) {
            return response()->json([
                'message' => 'Usuário não possui role definida.'
            ], 404);
        }

        try {
            DB::beginTransaction();

            // Remove todas as permissões existentes do usuário
            RolePermission::where('user_role_id', $userRole->id)->delete();

            // Cria as novas permissões
            $rolePermissions = [];
            foreach ($request->permission_ids as $permissionId) {
                $rolePermissions[] = [
                    'user_role_id' => $userRole->id,
                    'permission_id' => $permissionId,
                    'created_at' => now(),
                    'updated_at' => now()
                ];
            }

            if (!empty($rolePermissions)) {
                RolePermission::insert($rolePermissions);
            }

            DB::commit();

            return response()->json([
                'message' => 'Permissões atualizadas com sucesso.'
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Erro ao atualizar permissões.'
            ], 500);
        }
    }
}
