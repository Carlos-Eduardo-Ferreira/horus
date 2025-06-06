<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        // Sempre retorna o identifier da role principal
        $role = $this->roles()->first();

        return [
            'id' => $this->id,
            'name' => $this->name ?? '',
            'email' => $this->email ?? '',
            'document' => $this->document,
            'role' => $role->identifier,
        ];
    }
}
