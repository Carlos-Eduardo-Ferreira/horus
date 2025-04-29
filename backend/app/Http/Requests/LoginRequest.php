<?php

namespace App\Http\Requests;

use App\Helpers\StringHelper;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
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
     * Prepara os dados para validação.
     * Remove todos os caracteres que não sejam números do campo 'document'.
     *
     * @return void
     */
    protected function prepareForValidation()
    {
        // Verifica se o campo 'document' existe na requisição
        if ($this->has('document')) {
            // Limpa o documento deixando apenas números
            $cleanDocument = StringHelper::onlyNumbers($this->document);

            // Atualiza o valor de 'document' na requisição
            $this->merge([
                'document' => $cleanDocument
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
        return [
            'document' => [
                'required',
                'string',
                // Validação customizada para garantir que o documento contenha números
                function($attribute, $value, $fail) {
                    if (!preg_match('/[0-9]/', $value)) {
                        $fail('O documento deve conter números');
                    }
                },
                'exists:users,document'
            ],
            'password' => 'required|string'
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
            'document.required' => 'O documento é obrigatório',
            'document.exists' => 'Usuário não encontrado, confira os dados informados',
            'password.required' => 'A senha é obrigatória'
        ];
    }
}