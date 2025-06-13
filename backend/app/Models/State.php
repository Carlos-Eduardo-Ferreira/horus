<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class State extends Model
{
    protected $fillable = [
        'ibge_code',
        'uf',
        'name'
    ];

    public function localUnits(): HasMany
    {
        return $this->hasMany(LocalUnit::class);
    }
}
