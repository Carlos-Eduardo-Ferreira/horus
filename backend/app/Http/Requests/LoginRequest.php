<?php

namespace App\Http\Requests;

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
            $document = preg_replace('/[^0-9]/', '', $this->document);
            $this->merge(['document' => $document]);
        }
    }

    public function rules(): array
    {
        return [
            'document' => ['required', 'string'],
            'password' => ['required', 'string'],
        ];
    }

    public function messages(): array
    {
        return [
            'document.required' => 'O documento é obrigatório',
            'password.required' => 'A senha é obrigatória',
        ];
    }
}
