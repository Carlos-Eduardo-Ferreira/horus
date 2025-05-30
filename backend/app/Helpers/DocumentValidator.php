<?php

namespace App\Helpers;

class DocumentValidator
{
    // Valida um CPF
    public static function validateCpf(string $cpf): bool
    {
        $cpf = preg_replace('/\D/', '', $cpf);

        if (strlen($cpf) !== 11 || preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        for ($t = 9; $t < 11; $t++) {
            $sum = 0;
            for ($c = 0; $c < $t; $c++) {
                $sum += $cpf[$c] * (($t + 1) - $c);
            }

            $digit = ((10 * $sum) % 11) % 10;

            if ((int) $cpf[$t] !== $digit) {
                return false;
            }
        }

        return true;
    }

    // Valida um CNPJ
    public static function validateCnpj(string $cnpj): bool
    {
        $cnpj = preg_replace('/\D/', '', $cnpj);

        if (strlen($cnpj) !== 14 || preg_match('/^(\d)\1{13}$/', $cnpj)) {
            return false;
        }

        // Primeiro dígito
        $sum = 0;
        $weight = 5;
        for ($i = 0; $i < 12; $i++) {
            $sum += $cnpj[$i] * $weight;
            $weight = ($weight === 2) ? 9 : $weight - 1;
        }
        $digit1 = ((11 - ($sum % 11)) > 9) ? 0 : (11 - ($sum % 11));

        // Segundo dígito
        $sum = 0;
        $weight = 6;
        for ($i = 0; $i < 13; $i++) {
            $sum += $cnpj[$i] * $weight;
            $weight = ($weight === 2) ? 9 : $weight - 1;
        }
        $digit2 = ((11 - ($sum % 11)) > 9) ? 0 : (11 - ($sum % 11));

        return ($cnpj[12] == $digit1 && $cnpj[13] == $digit2);
    }
}
