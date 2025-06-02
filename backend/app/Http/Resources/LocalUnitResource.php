<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class LocalUnitResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'identifier' => $this->identifier,
            'email' => $this->email,
            'street' => $this->street,
            'number' => $this->number,
            'complement' => $this->complement,
            'neighborhood' => $this->neighborhood,
            'city' => $this->city,
            'state_id' => $this->state_id,
            'state' => new StateResource($this->whenLoaded('state')),
            'zip_code' => $this->zip_code,
            'phone' => $this->phone,
        ];
    }
}
