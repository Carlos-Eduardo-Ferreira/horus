<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\DocumentRule;
use App\Rules\LegalNameRequiredRule;
use App\Rules\BusinessEmailRule;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'legal_name' => ['nullable', 'string', 'max:255', new LegalNameRequiredRule],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users', new BusinessEmailRule],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'type' => ['required', 'string', 'in:consumer,company'],
            'document' => ['required', 'string', 'unique:users,document', new DocumentRule],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O e-mail é obrigatório',
            'email.email' => 'Digite um e-mail válido',
            'email.unique' => 'Este e-mail já está cadastrado',
            'password.required' => 'A senha é obrigatória',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres',
            'password.confirmed' => 'As senhas não coincidem',
            'type.required' => 'O type é obrigatório',
            'type.in' => 'O type deve ser consumer ou company',
            'document.required' => 'O número do documento é obrigatório',
            'document.unique' => 'Este documento já está cadastrado no sistema',
        ];
    }
}
