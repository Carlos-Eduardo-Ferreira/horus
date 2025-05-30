<?php

namespace App\Models;

use App\Enums\RoleIdentifier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserRole extends Model
{
    protected $fillable = [
        'user_id',
        'role_id',
        'local_unit_id',
    ];

    public function isRestrictedRole(): bool
    {
        return in_array($this->role?->identifier, [
            RoleIdentifier::COMPANY,
            RoleIdentifier::CONSUMER,
        ]);
    }

    public function hasRole(RoleIdentifier $identifier): bool
    {
        return $this->role?->identifier === $identifier;
    }

    public function hasAllAccess(): bool
    {
        return $this->role?->identifier === RoleIdentifier::MASTER;
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    public function localUnit(): BelongsTo
    {
        return $this->belongsTo(LocalUnit::class);
    }

    public function rolePermissions(): HasMany
    {
        return $this->hasMany(RolePermission::class);
    }
}
