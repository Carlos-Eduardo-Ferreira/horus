<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class LocalUnit extends Model
{
    use SoftDeletes;
    
    protected $fillable = [
        'name',
        'identifier',
        'email',
        'street',
        'number',
        'complement',
        'neighborhood',
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
