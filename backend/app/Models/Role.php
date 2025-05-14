<?php

namespace App\Models;

use App\Enums\RoleIdentifier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable = [
        'name', 
        'identifier'
    ];

    protected $casts = [
        'identifier' => RoleIdentifier::class,
    ];

    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }
}
