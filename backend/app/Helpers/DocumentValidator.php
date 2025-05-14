<?php

namespace App\Helpers;

class DocumentValidator
{
    /**
     * Valida um número de CPF.
     *
     * @param string $cpf O número do CPF a ser validado
     * @return bool Retorna true se o CPF for válido, false caso contrário
     */
    public static function validateCpf(string $cpf): bool
    {
        // Remove caracteres não numéricos
        $cpf = preg_replace('/[^0-9]/', '', $cpf);

        // Verifica se tem 11 dígitos
        if (strlen($cpf) != 11) {
            return false;
        }

        // Verifica se todos os dígitos são iguais
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        // Calcula os dígitos verificadores
        for ($t = 9; $t < 11; $t++) {
            $d = 0;
            for ($c = 0; $c < $t; $c++) {
                $d += $cpf[$c] * (($t + 1) - $c);
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cpf[$t] != $d) {
                return false;
            }
        }
        
        return true;
    }

    /**
     * Valida um número de CNPJ.
     *
     * @param string $cnpj O número do CNPJ a ser validado
     * @return bool Retorna true se o CNPJ for válido, false caso contrário
     */
    public static function validateCnpj(string $cnpj): bool
    {
        // Remove caracteres não numéricos
        $cnpj = preg_replace('/[^0-9]/', '', $cnpj);

        // Verifica se tem 14 dígitos
        if (strlen($cnpj) != 14) {
            return false;
        }

        // Verifica se todos os dígitos são iguais
        if (preg_match('/^(\d)\1{13}$/', $cnpj)) {
            return false;
        }

        // Calcula primeiro dígito verificador
        $sum = 0;
        $weight = 5;
        
        for ($i = 0; $i < 12; $i++) {
            $sum += $cnpj[$i] * $weight;
            $weight = ($weight == 2) ? 9 : $weight - 1;
        }
        
        $digit1 = ((11 - ($sum % 11)) > 9) ? 0 : (11 - ($sum % 11));
        
        // Calcula segundo dígito verificador
        $sum = 0;
        $weight = 6;
        
        for ($i = 0; $i < 13; $i++) {
            $sum += $cnpj[$i] * $weight;
            $weight = ($weight == 2) ? 9 : $weight - 1;
        }
        
        $digit2 = ((11 - ($sum % 11)) > 9) ? 0 : (11 - ($sum % 11));
        
        // Verifica se os dígitos calculados são iguais aos dígitos informados
        return ($cnpj[12] == $digit1 && $cnpj[13] == $digit2);
    }
}
