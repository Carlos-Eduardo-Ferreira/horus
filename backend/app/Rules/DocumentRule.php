<?php

namespace App\Rules;

use Closure;
use App\Helpers\StringHelper;
use App\Helpers\DocumentValidator;
use Illuminate\Contracts\Validation\ValidationRule;

class DocumentRule implements ValidationRule
{
    /**
     * Valida o documento (CPF/CNPJ) de acordo com o tipo de usuário.
     *
     * @param string $attribute Nome do atributo sendo validado
     * @param mixed $value Valor do documento
     * @param \Closure(string): void $fail Função chamada em caso de falha na validação
     * @return void
     */
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
        }
        
        if ($type === 'consumer') {
            if (strlen($document) !== 11) {
                $fail('O CPF deve ter exatamente 11 dígitos.');
                return;
            }
            
            if (!DocumentValidator::validateCpf($document)) {
                $fail('O CPF informado não é válido.');
            }
        }
    }
}