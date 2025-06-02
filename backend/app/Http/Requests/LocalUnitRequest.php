<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class LocalUnitRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    protected function prepareForValidation()
    {
        if ($this->filled('name')) {
            $this->merge(['name' => strtoupper($this->name)]);
        }

        if ($this->filled('identifier')) {
            $identifier = preg_replace('/[^a-z_]/', '', strtolower($this->identifier));
            $this->merge(['identifier' => $identifier]);
        }

        if ($this->filled('zip_code')) {
            $zipCode = preg_replace('/[^0-9]/', '', $this->zip_code);
            $this->merge(['zip_code' => $zipCode]);
        }

        if ($this->filled('phone')) {
            $phone = preg_replace('/[^0-9]/', '', $this->phone);
            $this->merge(['phone' => $phone]);
        }

        if ($this->filled('state')) {
            $this->merge(['state' => strtoupper($this->state)]);
        }

        if ($this->filled('city')) {
            $this->merge(['city' => strtoupper($this->city)]);
        }

        if ($this->filled('neighborhood')) {
            $this->merge(['neighborhood' => strtoupper($this->neighborhood)]);
        }

        if ($this->filled('street')) {
            $this->merge(['street' => strtoupper($this->street)]);
        }
    }

    public function rules()
    {
        $id = $this->route('localUnit')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'identifier' => [
                'required',
                'string',
                'max:255',
                Rule::unique('local_units', 'identifier')->ignore($id),
            ],
            'email' => ['required', 'email', 'max:255'],
            'street' => ['required', 'string', 'max:255'],
            'number' => ['required', 'string', 'max:10'],
            'complement' => ['nullable', 'string', 'max:100'],
            'neighborhood' => ['required', 'string', 'max:100'],
            'city' => ['required', 'string', 'max:100'],
            'state_id' => ['required', 'exists:states,id'],
            'zip_code' => ['required', 'string', 'size:8'],
            'phone' => ['required', 'string', 'size:10'],
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'identifier.required' => 'O identificador é obrigatório',
            'identifier.unique' => 'Este identificador já está cadastrado',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ter um formato válido',
            'street.required' => 'A rua é obrigatória',
            'number.required' => 'O número é obrigatório',
            'neighborhood.required' => 'O bairro é obrigatório',
            'city.required' => 'A cidade é obrigatória',
            'state_id.required' => 'O estado é obrigatório',
            'state_id.exists' => 'O estado selecionado é inválido',
            'zip_code.required' => 'O CEP é obrigatório',
            'zip_code.size' => 'O CEP deve ter exatamente 8 dígitos',
            'phone.required' => 'O telefone é obrigatório',
            'phone.size' => 'O telefone deve ter exatamente 10 dígitos',
        ];
    }
}
