<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LocalUnit extends Model
{
    protected $fillable = [
        'name',
        'email',
        'address',
        'city',
        'state',
        'zip_code',
        'phone'
    ];

    public function userRoles(): HasMany
    {
        return $this->hasMany(UserRole::class);
    }
}
