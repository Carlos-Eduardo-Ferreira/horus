<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AuthRequiredRule implements ValidationRule
{
    /**
     * Valida o campo dependendo do tipo de usuário (consumer ou company).
     *
     * @param string $attribute Nome do atributo sendo validado
     * @param mixed $value Valor do atributo
     * @param \Closure(string): void $fail Função de falha de validação
     * @return void
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Obtém o tipo de usuário da requisição
        $type = request()->input('type');
        
        // Se o tipo for 'consumer' e o valor estiver vazio, gera um erro
        if ($type === 'consumer' && empty($value)) {
            $fail("O campo {$attribute} é obrigatório para o type consumer.");
        }
    }
}