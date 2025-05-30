<?php

namespace App\Helpers;

class StringHelper
{
    // Retorna apenas os números de uma string
    public static function onlyNumbers(?string $value): string
    {
        return $value ? preg_replace('/\D/', '', $value) : '';
    }
}
