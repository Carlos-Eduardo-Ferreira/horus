<?php

namespace App\Http\Resources;

use App\Services\PermissionService;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        // Sempre retorna o identifier da role principal
        $role = $this->roles()->first();

        $data = [
            'id' => $this->id,
            'name' => $this->name ?? '',
            'legal_name' => $this->legal_name ?? '',
            'email' => $this->email ?? '',
            'document' => $this->document,
            'role' => $role->identifier,
        ];

        // Adiciona informações de verificação apenas para empresas
        if ($this->isCompany()) {
            $data['is_verified'] = $this->isVerifiedCompany();
            $data['verification_status'] = $this->getCompanyVerificationStatus();
        }

        // Adiciona permissões para roles administrativas (master, admin, user)
        if ($role && in_array($role->identifier->value, ['master', 'admin', 'user'])) {
            $permissionService = app(PermissionService::class);
            $permissions = $permissionService->getUserPermissions($this->resource);
            $data['permissions'] = $permissions->values()->all();
        }

        return $data;
    }
}
