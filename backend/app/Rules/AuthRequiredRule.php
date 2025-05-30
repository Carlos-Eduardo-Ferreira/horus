<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class AuthRequiredRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $type = request()->input('type');

        if ($type === 'consumer' && empty($value)) {
            $fail("O campo {$attribute} é obrigatório para o tipo consumer.");
        }
    }
}
