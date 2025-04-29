<?php

namespace App\Helpers;

class StringHelper
{
    /**
     * Remove todos os caracteres que não são números de uma string.
     *
     * @param string|null $value A string que será processada.
     * @return string A string contendo apenas números.
     */
    public static function onlyNumbers(?string $value): string
    {
        // Se o valor for nulo ou vazio, retorna uma string vazia
        if (!$value) {
            return '';
        }
        
        // Remove todos os caracteres que não sejam números
        return preg_replace('/[^0-9]/', '', $value);
    }
}