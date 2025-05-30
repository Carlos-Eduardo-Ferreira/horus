<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('name')) {
            $this->merge(['name' => strtoupper($this->name)]);
        }

        if ($this->filled('identifier')) {
            $identifier = preg_replace('/[^a-z_]/', '', strtolower($this->identifier));
            $this->merge(['identifier' => $identifier]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('action')?->id;

        return [
            'name' => ['required', 'string', 'max:255'],
            'identifier' => [
                'required',
                'string',
                'max:255',
                Rule::unique('actions', 'identifier')->ignore($id),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'identifier.required' => 'O identificador é obrigatório',
            'identifier.unique' => 'Este identificador já está cadastrado',
        ];
    }
}
