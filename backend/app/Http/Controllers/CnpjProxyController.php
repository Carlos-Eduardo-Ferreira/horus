<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class CnpjProxyController extends Controller
{
    public function fetch($cnpj)
    {
        $cleanCnpj = preg_replace('/\D/', '', $cnpj);

        if (strlen($cleanCnpj) !== 14) {
            return response()->json(['status' => 'ERROR', 'message' => 'CNPJ deve ter 14 dígitos'], 400);
        }

        $url = "https://www.receitaws.com.br/v1/cnpj/{$cleanCnpj}";

        try {
            $response = Http::timeout(10)->get($url);

            if ($response->status() === 404) {
                return response()->json(['status' => 'ERROR', 'message' => 'CNPJ não encontrado'], 404);
            }

            $data = $response->json();

            if (isset($data['status']) && $data['status'] === 'ERROR') {
                return response()->json($data, 404);
            }

            return response()->json($data);
        } catch (\Throwable $e) {
            return response()->json([
                'status' => 'ERROR',
                'message' => 'Erro ao consultar CNPJ: ' . $e->getMessage()
            ], 500);
        }
    }
}
