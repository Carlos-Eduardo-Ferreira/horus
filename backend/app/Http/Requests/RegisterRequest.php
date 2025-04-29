<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Rules\DocumentRule;
use App\Rules\AuthRequiredRule;

class RegisterRequest extends FormRequest
{
    /**
     * Autoriza o envio da requisição.
     *
     * @return bool
     */
    public function authorize()
    {
        // Permite o processamento da requisição
        return true;
    }

    /**
     * Define as regras de validação para a requisição de registro.
     *
     * @return array
     */
    public function rules()
    {
        return [
            // O campo 'name' é nullable para empresas, obrigatório para consumidores via AuthRequiredRule
            'name' => ['nullable', 'string', 'max:255', new AuthRequiredRule],
            
            // O campo 'email' é nullable para empresas, obrigatório para consumidores via AuthRequiredRule
            'email' => ['nullable', 'string', 'email', 'max:255', 'unique:users', new AuthRequiredRule],
            
            // A senha é obrigatória, mínimo de 8 caracteres e precisa ser confirmada
            'password' => 'required|string|min:8|confirmed',
            
            // O tipo do usuário deve ser 'consumer' ou 'company'
            'type' => 'required|string|in:consumer,company',
            
            // O documento é obrigatório, deve ser único e validado por uma regra customizada
            'document' => ['required', 'string', 'unique:users', new DocumentRule],
        ];
    }

    /**
     * Define as mensagens de erro personalizadas para as validações.
     *
     * @return array
     */
    public function messages()
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
            'document.unique' => 'Este documento já está cadastrado',
            'document.forEach' => 'O documento deve ter exatamente :length dígitos para :type',
        ];
    }
}