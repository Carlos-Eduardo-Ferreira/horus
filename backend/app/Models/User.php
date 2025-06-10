<?php

namespace App\Models;

use App\Enums\CompanyValidationStatus;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens, SoftDeletes;

    protected $fillable = [
        'name',
        'legal_name',
        'email',
        'password',
        'document',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'user_roles');
    }

    public function companyValidation(): HasOne
    {
        return $this->hasOne(CompanyValidation::class);
    }

    public function isVerifiedCompany(): bool
    {
        if (!$this->isCompany()) {
            return false;
        }

        $validation = $this->companyValidation;
        return $validation && $validation->status === CompanyValidationStatus::APPROVED;
    }

    public function isCompany(): bool
    {
        $role = $this->roles()->first();
        return $role && $role->identifier->value === 'company';
    }

    public function getCompanyVerificationStatus(): ?string
    {
        if (!$this->isCompany()) {
            return null;
        }

        $validation = $this->companyValidation;
        return $validation ? $validation->status->value : CompanyValidationStatus::NOT_SUBMITTED->value;
    }
}
