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
use Illuminate\Database\QueryException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request)
    {
        try {
            DB::beginTransaction();

            $fields = $request->validated();
            $fields['document'] = StringHelper::onlyNumbers($fields['document']);

            $type = $fields['type'];
            unset($fields['type']);

            // Ensure legal_name is set to null if not provided for consumers
            if ($type === 'consumer' && !isset($fields['legal_name'])) {
                $fields['legal_name'] = null;
            }

            $user = User::create($fields);

            $role = Role::where('identifier', $type)->firstOrFail();

            UserRole::create([
                'user_id' => $user->id,
                'role_id' => $role->id,
                'local_unit_id' => 1
            ]);

            $token = $user->createToken($user->document)->plainTextToken;

            DB::commit();

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();

            if ($e instanceof QueryException && $e->errorInfo[1] === 1062) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => [
                        'document' => ['Este documento já está cadastrado no sistema']
                    ]
                ], 422);
            }

            return response()->json([
                'message' => 'Não foi possível completar o cadastro. Tente novamente mais tarde.'
            ], 500);
        }
    }

    public function login(LoginRequest $request)
    {
        $user = User::where('document', $request->document)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Documento ou senha inválidos'
            ], 401);
        }

        $token = $user->createToken($user->document)->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }
}
