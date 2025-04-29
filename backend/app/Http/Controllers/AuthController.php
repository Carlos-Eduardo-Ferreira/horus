<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Helpers\StringHelper;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Realiza o registro de um novo usuário.
     *
     * @param RegisterRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(RegisterRequest $request)
    {
        // Valida os dados da requisição
        $fields = $request->validated();
        
        // Remove caracteres não numéricos do documento
        $fields['document'] = StringHelper::onlyNumbers($fields['document']);
        
        // Cria o novo usuário
        $user = User::create($fields);
        
        // Gera um token de acesso para o usuário
        $token = $user->createToken($user->document)->plainTextToken;

        // Retorna o usuário e o token
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Realiza o login do usuário.
     *
     * @param LoginRequest $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(LoginRequest $request)
    {
        // Busca o usuário pelo documento
        $user = User::where('document', $request->document)->first();

        // Verifica se o usuário existe e se a senha está correta
        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Documento ou senha inválidos'
            ], 401);
        }

        // Gera um novo token para o usuário
        $token = $user->createToken($user->document)->plainTextToken;

        // Retorna o usuário e o token
        return response()->json([
            'user' => $user,
            'token' => $token
        ]);
    }

    /**
     * Realiza o logout do usuário autenticado.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout(Request $request)
    {
        // Revoga todos os tokens do usuário
        $request->user()->tokens()->delete();

        // Retorna mensagem de sucesso
        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }
}