<?php

namespace App\Models;

use App\Enums\ActionIdentifier;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Action extends Model
{
    protected $fillable = [
        'name',
        'identifier'
    ];

    protected $casts = [
        'identifier' => ActionIdentifier::class,
    ];

    public function permissions(): HasMany
    {
        return $this->hasMany(Permission::class);
    }
}
