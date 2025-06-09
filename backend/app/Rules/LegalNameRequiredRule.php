<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

class LegalNameRequiredRule implements ValidationRule
{
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $type = request()->input('type');

        if ($type === 'company' && empty($value)) {
            $fail('A razão social é obrigatória para empresas.');
        }
    }
}
