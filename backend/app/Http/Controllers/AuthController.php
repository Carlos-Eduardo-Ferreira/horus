<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use App\Models\UserRole;
use App\Models\CompanyValidation;
use App\Enums\CompanyValidationStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('document', $request->document)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Documento ou senha inválidos'
            ], 401);
        }

        $user->load('roles');
        $token = $user->createToken($user->document)->plainTextToken;

        return response()->json([
            'user' => new UserResource($user),
            'token' => $token
        ]);
    }

    public function register(RegisterRequest $request)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            
            // Pega o tipo de usuário
            $userType = $data['type'] ?? 'consumer';
            
            // Remove campos que não são do modelo User
            unset($data['password_confirmation']);
            unset($data['type']);

            $user = User::create($data);

            // Determina a role baseada no tipo de usuário
            $roleIdentifier = match($userType) {
                'company' => 'company',
                'consumer' => 'consumer',
                default => 'consumer'
            };

            // Associar role baseada no tipo
            $role = Role::where('identifier', $roleIdentifier)->firstOrFail();
            UserRole::create([
                'user_id' => $user->id,
                'role_id' => $role->id,
                'local_unit_id' => 1
            ]);

            // Se for empresa, cria registro em company_validations
            if ($userType === 'company') {
                CompanyValidation::create([
                    'user_id' => $user->id,
                    'status' => CompanyValidationStatus::NOT_SUBMITTED,
                ]);
            }

            $user->load('roles');
            $token = $user->createToken($user->document)->plainTextToken;

            DB::commit();

            return response()->json([
                'user' => new UserResource($user),
                'token' => $token
            ], 201);
        } catch (\Throwable $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Não foi possível criar a conta'
            ], 500);
        }
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logout realizado com sucesso'
        ]);
    }
}
