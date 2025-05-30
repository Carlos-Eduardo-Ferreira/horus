<?php

namespace App\Http\Requests;

use App\Helpers\StringHelper;
use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('document')) {
            $this->merge([
                'document' => StringHelper::onlyNumbers($this->document)
            ]);
        }
    }

    public function rules(): array
    {
        return [
            'document' => [
                'required',
                'string',
                'exists:users,document',
                function ($attribute, $value, $fail) {
                    if (!preg_match('/[0-9]/', $value)) {
                        $fail('O documento deve conter números');
                    }
                },
            ],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'document.required' => 'O documento é obrigatório',
            'document.exists' => 'Usuário não encontrado, confira os dados informados',
            'password.required' => 'A senha é obrigatória',
        ];
    }
}
