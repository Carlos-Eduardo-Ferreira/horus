<?php

namespace App\Http\Requests;

use App\Models\User;
use App\Rules\DocumentRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if ($this->filled('name') && $this->name !== null && $this->name !== '') {
            $this->merge(['name' => strtoupper($this->name)]);
        } elseif ($this->has('name') && ($this->name === '' || $this->name === null)) {
            $this->merge(['name' => null]);
        }

        if ($this->filled('email')) {
            $this->merge(['email' => strtolower($this->email)]);
        }

        if ($this->filled('document')) {
            $document = preg_replace('/[^0-9]/', '', $this->document);
            $this->merge(['document' => $document]);
        }

        if ($this->filled('legal_name') && $this->legal_name !== null && $this->legal_name !== '') {
            $this->merge(['legal_name' => strtoupper($this->legal_name)]);
        } elseif ($this->has('legal_name') && ($this->legal_name === '' || $this->legal_name === null)) {
            $this->merge(['legal_name' => null]);
        }
    }

    public function rules(): array
    {
        $id = $this->route('user')?->id;
        $isUpdate = !is_null($id);

        // Descobre a role do usuário em edição
        $role = null;
        if ($isUpdate) {
            $user = User::find($id);
            $roleObj = $user?->roles()->first()?->identifier;
            $role = $roleObj->value;
        }

        $rules = [
            'name' => ($isUpdate && $role === 'company')
                ? ['nullable', 'string', 'max:255']
                : ['required', 'string', 'max:255'],
            'legal_name' => ($isUpdate && $role === 'company')
                ? ['nullable', 'string', 'max:255']
                : ['nullable', 'string', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
        ];

        if ($isUpdate && $role === 'company') {
            $rules['document'] = [
                'required',
                'string',
                'size:14', // CNPJ
                Rule::unique('users', 'document')->ignore($id),
                new DocumentRule(),
            ];
        } else {
            $rules['document'] = [
                'required',
                'string',
                'size:11', // CPF
                Rule::unique('users', 'document')->ignore($id),
                new DocumentRule(),
            ];
        }

        if ($isUpdate) {
            // No modo de edição, senha é opcional, mas se informada deve ser válida
            $rules['password'] = ['nullable', 'string', 'min:8'];
            $rules['password_confirmation'] = ['nullable', 'string', 'same:password'];
        } else {
            // No modo de inserção, senha é obrigatória
            $rules['password'] = ['required', 'string', 'min:8'];
            $rules['password_confirmation'] = ['required', 'string', 'same:password'];
        }

        return $rules;
    }

    public function messages(): array
    {
        $id = $this->route('user')?->id;
        $isUpdate = !is_null($id);

        // Descobre a role do usuário em edição
        $role = null;
        if ($isUpdate) {
            $user = User::find($id);
            $roleObj = $user?->roles()->first()?->identifier;
            $role = $roleObj->value;
        }

        return [
            'name.required' => ($isUpdate && $role === 'company') ? '' : 'O nome é obrigatório',
            'email.email' => 'Digite um email válido',
            'email.unique' => 'Este email já está cadastrado',
            'document.required' => $isUpdate && $role === 'company' ? 'O CNPJ é obrigatório' : 'O CPF é obrigatório',
            'document.size' => $isUpdate && $role === 'company'
                ? 'O CNPJ deve ter exatamente 14 dígitos'
                : 'O CPF deve ter exatamente 11 dígitos',
            'document.unique' => $isUpdate && $role === 'company'
                ? 'Este CNPJ já está cadastrado'
                : 'Este CPF já está cadastrado',
            'password.required' => 'A senha é obrigatória',
            'password.min' => $isUpdate ? 'A nova senha deve ter pelo menos 8 caracteres' : 'A senha deve ter pelo menos 8 caracteres',
            'password_confirmation.required' => $isUpdate ? 'A confirmação da nova senha é obrigatória' : 'A confirmação de senha é obrigatória',
            'password_confirmation.same' => 'As senhas não coincidem',
        ];
    }
}
