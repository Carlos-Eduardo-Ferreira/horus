<?php

namespace App\Rules;

use Closure;
use App\Helpers\StringHelper;
use Illuminate\Contracts\Validation\ValidationRule;

class DocumentRule implements ValidationRule
{
    /**
     * Valida o tamanho do documento conforme o tipo de usuário (consumer ou company).
     *
     * @param string $attribute Nome do atributo sendo validado
     * @param mixed $value Valor do atributo
     * @param \Closure(string): void $fail Função chamada em caso de falha na validação
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Obtém o tipo de usuário da requisição (consumer ou company)
        $type = request()->input('type');

        // Remove caracteres não numéricos e calcula o comprimento do documento
        $length = strlen(StringHelper::onlyNumbers($value));
        
        // Validação para CNPJ (empresa): deve ter 14 dígitos
        if ($type === 'company' && $length !== 14) {
            $fail('O documento para empresa (CNPJ) deve ter exatamente 14 dígitos.');
        }
        
        // Validação para CPF (consumidor): deve ter 11 dígitos
        if ($type === 'consumer' && $length !== 11) {
            $fail('O documento para consumidor (CPF) deve ter exatamente 11 dígitos.');
        }
    }
}