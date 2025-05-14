<?php

namespace App\Models;

use App\Enums\RoleIdentifier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRole extends Model
{
    /**
     * Atributos que podem ser atribuídos em massa.
     */
    protected $fillable = [
        'user_id',
        'role_id',
        'local_unit_id',
    ];

    /**
     * Verifica se o user role atual corresponde a um identificador específico.
     *
     * Exemplo: $userRole->hasRole(RoleIdentifier::ADMIN)
     */
    public function hasRole(RoleIdentifier $identifier): bool
    {
        return $this->role?->identifier === $identifier;
    }

    /**
     * Verifica se o papel atual é considerado restrito (sem permissões personalizadas).
     * Usado para ignorar verificações de permissão em 'company' e 'consumer'.
     */
    public function isRestrictedRole(): bool
    {
        return in_array($this->role?->identifier, [
            RoleIdentifier::COMPANY,
            RoleIdentifier::CONSUMER,
        ]);
    }

    /**
     * Verifica se o papel atual tem acesso total ao sistema.
     * Útil para pular verificações de permissão quando for 'master'.
     */
    public function hasAllAccess(): bool
    {
        return $this->role?->identifier === RoleIdentifier::MASTER;
    }

    /**
     * Relacionamento com o usuário (User).
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Relacionamento com o papel (Role).
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Relacionamento com a unidade local (LocalUnit).
     */
    public function localUnit(): BelongsTo
    {
        return $this->belongsTo(LocalUnit::class);
    }

    /**
     * Relacionamento com as permissões do papel atribuídas ao usuário.
     * Cada registro em role_permissions conecta essa role a uma permission específica.
     */
    public function rolePermissions(): HasMany
    {
        return $this->hasMany(RolePermission::class);
    }
}
