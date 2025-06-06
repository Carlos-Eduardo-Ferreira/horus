<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Rules\DocumentRule;

class UserRequest extends FormRequest
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

        if ($this->filled('email')) {
            $this->merge(['email' => strtolower($this->email)]);
        }

        if ($this->filled('document')) {
            $document = preg_replace('/[^0-9]/', '', $this->document);
            $this->merge(['document' => $document]);
        }

        // Define o tipo como 'user' para validação do documento
        $this->merge(['type' => 'user']);
    }

    public function rules(): array
    {
        $id = $this->route('user')?->id;
        $isUpdate = !is_null($id);

        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'nullable',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($id),
            ],
            'document' => [
                'required',
                'string',
                'size:11', // Exatamente 11 dígitos para CPF
                Rule::unique('users', 'document')->ignore($id),
                new DocumentRule(),
            ],
        ];

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

        return [
            'name.required' => 'O nome é obrigatório',
            'email.email' => 'Digite um email válido',
            'email.unique' => 'Este email já está cadastrado',
            'document.required' => 'O CPF é obrigatório',
            'document.size' => 'O CPF deve ter exatamente 11 dígitos',
            'document.unique' => 'Este CPF já está cadastrado',
            'password.required' => 'A senha é obrigatória',
            'password.min' => $isUpdate ? 'A nova senha deve ter pelo menos 8 caracteres' : 'A senha deve ter pelo menos 8 caracteres',
            'password_confirmation.required' => $isUpdate ? 'A confirmação da nova senha é obrigatória' : 'A confirmação de senha é obrigatória',
            'password_confirmation.same' => 'As senhas não coincidem',
        ];
    }
}
