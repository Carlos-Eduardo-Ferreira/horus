<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Muhammad\CompanyEmailValidator\EmailValidator;

class BusinessEmailRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $type = request()->input('type');

        // Se não veio via input, tenta buscar do usuário da rota (edição)
        if ($type === null && request()->route('user')) {
            $user = request()->route('user');
            $roleObj = $user?->roles()->first()?->identifier;
            $type = $roleObj->value;
        }

        if ($type !== 'company') {
            return;
        }

        if (empty($value)) {
            $fail('O e-mail é obrigatório.');
            return;
        }

        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            $fail('O e-mail informado é inválido.');
            return;
        }

        // Extrai domínio do e-mail
        $domain = strtolower(trim(substr(strrchr($value, '@'), 1)));

        // Verifica se o domínio tem registros MX válidos (DNS)
        if (!checkdnsrr($domain, 'MX')) {
            $fail('O domínio do e-mail informado não é válido.');
            return;
        }

        // Verifica se é e-mail corporativo
        $validator = new EmailValidator();

        if (! $validator->isCompanyEmail($value)) {
            $fail('Utilize um e-mail corporativo.');
        }
    }
}
