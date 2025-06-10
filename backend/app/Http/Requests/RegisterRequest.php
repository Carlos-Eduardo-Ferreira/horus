<?php

namespace App\Http\Requests;

use App\Rules\DocumentRule;
use App\Rules\BusinessEmailRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class RegisterRequest extends FormRequest
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

        if ($this->filled('legal_name')) {
            $this->merge(['legal_name' => strtoupper($this->legal_name)]);
        }

        if ($this->filled('email')) {
            $this->merge(['email' => strtolower($this->email)]);
        }

        if ($this->filled('document')) {
            $document = preg_replace('/[^0-9]/', '', $this->document);
            $this->merge(['document' => $document]);
        }
    }

    public function rules(): array
    {
        $userType = $this->input('type', 'consumer');
        $isCompany = $userType === 'company';

        $emailRules = ['required'];
        
        // Para empresas, valida BusinessEmailRule primeiro
        if ($isCompany) {
            $emailRules[] = new BusinessEmailRule();
        }
        
        // Depois adiciona as validações padrão
        $emailRules = array_merge($emailRules, [
            'email',
            'max:255',
            Rule::unique('users', 'email')
        ]);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => $emailRules,
            'password' => ['required', 'string', 'min:8'],
            'password_confirmation' => ['required', 'string', 'same:password'],
            'type' => ['required', 'string', Rule::in(['consumer', 'company'])],
        ];

        if ($isCompany) {
            $rules['legal_name'] = ['required', 'string', 'max:255'];
            $rules['document'] = ['required', 'string', 'size:14', Rule::unique('users', 'document'), new DocumentRule()];
        } else {
            $rules['document'] = ['required', 'string', 'size:11', Rule::unique('users', 'document'), new DocumentRule()];
        }

        return $rules;
    }

    public function messages(): array
    {
        $userType = $this->input('type', 'consumer');
        $isCompany = $userType === 'company';

        return [
            'name.required' => 'O nome é obrigatório',
            'legal_name.required' => 'A razão social é obrigatória',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'Digite um email válido',
            'email.unique' => 'Este email já está cadastrado',
            'document.required' => $isCompany ? 'O CNPJ é obrigatório' : 'O CPF é obrigatório',
            'document.size' => $isCompany 
                ? 'O CNPJ deve ter exatamente 14 dígitos'
                : 'O CPF deve ter exatamente 11 dígitos',
            'document.unique' => $isCompany 
                ? 'Este CNPJ já está cadastrado'
                : 'Este CPF já está cadastrado',
            'password.required' => 'A senha é obrigatória',
            'password.min' => 'A senha deve ter pelo menos 8 caracteres',
            'password_confirmation.required' => 'A confirmação de senha é obrigatória',
            'password_confirmation.same' => 'As senhas não coincidem',
            'type.required' => 'O tipo de usuário é obrigatório',
            'type.in' => 'Tipo de usuário inválido',
        ];
    }
}
