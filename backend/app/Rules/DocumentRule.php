<?php

namespace App\Rules;

use Closure;
use App\Helpers\StringHelper;
use App\Helpers\DocumentValidator;
use Illuminate\Contracts\Validation\ValidationRule;

class DocumentRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $type = request()->input('type');
        $document = StringHelper::onlyNumbers($value);

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

        if (in_array($type, ['consumer', 'user'], true)) {
            if (strlen($document) !== 11) {
                $fail('O CPF deve ter exatamente 11 dígitos.');
                return;
            }

            if (!DocumentValidator::validateCpf($document)) {
                $fail('O CPF informado não é válido.');
            }

            return;
        }

        $fail('Tipo de usuário inválido para validação de documento.');
    }
}
