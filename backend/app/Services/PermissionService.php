<?php

namespace App\Services;

use App\Models\User;
use App\Models\UserRole;
use App\Enums\RoleIdentifier;
use App\Models\Permission;
use Illuminate\Support\Collection;

class PermissionService
{
    public function hasPermission(User $user, string $permission): bool
    {
        $userRole = $user->roles()->first();
        if (!$userRole) {
            return false;
        }

        if (in_array($userRole->identifier, [RoleIdentifier::CONSUMER, RoleIdentifier::COMPANY])) {
            return false;
        }

        if ($userRole->identifier === RoleIdentifier::MASTER) {
            return true;
        }

        return $this->getUserPermissions($user)->contains($permission);
    }

    public function getUserPermissions(User $user): Collection
    {
        $userRole = $user->roles()->first();
        if (!$userRole) {
            return collect([]);
        }

        if ($userRole->identifier === RoleIdentifier::MASTER) {
            return $this->getAllPermissionNames();
        }

        if (in_array($userRole->identifier, [RoleIdentifier::CONSUMER, RoleIdentifier::COMPANY])) {
            return collect([]);
        }

        $userRoles = UserRole::with(['rolePermissions.permission.module', 'rolePermissions.permission.action'])
            ->where('user_id', $user->id)
            ->get();

        $permissions = collect([]);
        
        foreach ($userRoles as $userRole) {
            foreach ($userRole->rolePermissions as $rolePermission) {
                $permission = $rolePermission->permission;
                $permissionName = $permission->module->identifier . '.' . $permission->action->identifier;
                $permissions->push($permissionName);
            }
        }

        return $permissions->unique();
    }

    private function getAllPermissionNames(): Collection
    {
        return Permission::with(['module', 'action'])
            ->get()
            ->map(function ($permission) {
                return $permission->module->identifier . '.' . $permission->action->identifier;
            });
    }

    public function canAccessModule(User $user, string $moduleIdentifier): bool
    {
        $userRole = $user->roles()->first();
        if (!$userRole) {
            return false;
        }

        if ($userRole->identifier === RoleIdentifier::MASTER) {
            return true;
        }

        if (in_array($userRole->identifier, [RoleIdentifier::CONSUMER, RoleIdentifier::COMPANY])) {
            return false;
        }

        $userPermissions = $this->getUserPermissions($user);
        return $userPermissions->contains(function ($permission) use ($moduleIdentifier) {
            return str_starts_with($permission, $moduleIdentifier . '.');
        });
    }
}
