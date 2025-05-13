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

        // Calcula os dígitos verificadores
        for ($t = 12; $t < 14; $t++) {
            $d = 0;
            $c = $t - 7;
            for ($i = $t; $i >= 0; $i--) {
                $d += $cnpj[$i] * $c;
                $c = ($c < 3) ? 9 : --$c;
            }
            $d = ((10 * $d) % 11) % 10;
            if ($cnpj[$t + 1] != $d) {
                return false;
            }
        }

        return true;
    }
}
