<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ActionRequest extends FormRequest
{
    /**
     * Autoriza o envio da requisição.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Prepara os dados para validação.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        if ($this->has('name')) {
            $this->merge([
                'name' => strtoupper($this->name),
            ]);
        }
        if ($this->has('identifier')) {
            $identifier = strtolower($this->identifier);
            $identifier = preg_replace('/[^a-z_]/', '', $identifier);
            $this->merge([
                'identifier' => $identifier,
            ]);
        }
    }

    /**
     * Define as regras de validação para a requisição.
     *
     * @return array
     */
    public function rules()
    {
        $id = $this->route('action')?->id ?? null;
        return [
            'name' => ['required', 'string', 'max:255'],
            'identifier' => [
                'required',
                'string',
                'max:255',
                // Corrigido para usar Rule::unique
                Rule::unique('actions', 'identifier')->ignore($id),
            ],
        ];
    }

    /**
     * Define as mensagens de erro personalizadas.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'identifier.required' => 'O identificador é obrigatório',
            'identifier.unique' => 'Este identificador já está cadastrado',   
        ];
    }
}

