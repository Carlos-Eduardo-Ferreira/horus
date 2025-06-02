<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StateResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'ibge_code' => $this->ibge_code,
            'abbreviation' => $this->abbreviation,
            'name' => $this->name,
        ];
    }
}
