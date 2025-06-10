<?php

namespace App\Rules;

use Closure;
use App\Helpers\DocumentValidator;
use Illuminate\Contracts\Validation\ValidationRule;

class DocumentRule implements ValidationRule
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

        $document = preg_replace('/[^0-9]/', '', $value);

        if ($type === 'company') {
            if (strlen($document) !== 14) {
                $fail('O CNPJ deve ter exatamente 14 dígitos.');
                return;
            }

            if (!DocumentValidator::validateCnpj($document)) {
                $fail('O CNPJ informado não é válido.');
            }

            return;
        }

        // Para consumer ou outros tipos, valida como CPF
        if (strlen($document) !== 11) {
            $fail('O CPF deve ter exatamente 11 dígitos.');
            return;
        }

        if (!DocumentValidator::validateCpf($document)) {
            $fail('O CPF informado não é válido.');
        }
    }
}
