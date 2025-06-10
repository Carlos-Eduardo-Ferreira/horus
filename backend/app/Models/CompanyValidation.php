<?php

namespace App\Models;

use App\Enums\CompanyValidationStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CompanyValidation extends Model
{
    protected $fillable = [
        'user_id',
        'status',
        'rejection_reason',
        'validated_at',
    ];

    protected $casts = [
        'status' => CompanyValidationStatus::class,
        'validated_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
