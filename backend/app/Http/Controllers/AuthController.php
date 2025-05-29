<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Helpers\StringHelper;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Http\Resources\UserResource;

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
        try {
            DB::beginTransaction();
            
            // Valida os dados da requisição
            $fields = $request->validated();
            
            // Remove caracteres não numéricos do documento
            $fields['document'] = StringHelper::onlyNumbers($fields['document']);
            
            // Remove o type do array para não salvar no usuário
            $type = $fields['type'];
            unset($fields['type']);
            
            // Cria o novo usuário
            $user = User::create($fields);
            
            // Busca o role baseado no type recebido (consumer ou company)
            $role = Role::where('identifier', $type)->firstOrFail();
            
            // Cria o relacionamento do usuário com o role e a unidade local
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => $role->id,
                'local_unit_id' => 1 // ID fixo conforme solicitado
            ]);
            
            // Gera um token de acesso para o usuário
            $token = $user->createToken($user->document)->plainTextToken;

            DB::commit();

            // Use UserResource para serializar o usuário
            return response()->json([
                'user' => new UserResource($user),
                'token' => $token
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Se for erro de duplicidade
            if ($e instanceof \Illuminate\Database\QueryException && $e->errorInfo[1] === 1062) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => [
                        'document' => ['Este documento já está cadastrado no sistema']
                    ]
                ], 422);
            }
            
            // Retorna uma mensagem genérica para o usuário
            return response()->json([
                'message' => 'Não foi possível completar o cadastro. Por favor, tente novamente mais tarde ou entre em contato com o suporte.'
            ], 500);
        }
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

        // Use UserResource para serializar o usuário
        return response()->json([
            'user' => new UserResource($user),
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
        // Revoga apenas o token atual
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }
}