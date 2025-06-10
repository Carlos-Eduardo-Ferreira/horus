<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Role;
use App\Models\UserRole;
use App\Http\Resources\UserResource;
use App\Http\Requests\UserRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query()->with('roles');

        if ($request->name) {
            $query->where('name', 'like', '%' . $request->name . '%');
        }

        if ($request->document) {
            $cleanDocument = preg_replace('/[^0-9]/', '', $request->document);
            $query->where('document', 'like', '%' . $cleanDocument . '%');
        }

        if ($request->role) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('identifier', $request->role);
            });
        }

        $sortOrder = $request->get('sort_order', 'asc');
        $sortOrder = $sortOrder === 'desc' ? 'desc' : 'asc';

        $query->leftJoin('user_roles', 'users.id', '=', 'user_roles.user_id')
              ->leftJoin('roles', 'user_roles.role_id', '=', 'roles.id')
              ->select('users.*')
              ->orderByRaw("
                  CASE roles.identifier 
                      WHEN 'master' THEN 1
                      WHEN 'admin' THEN 2  
                      WHEN 'user' THEN 3
                      WHEN 'consumer' THEN 4
                      WHEN 'company' THEN 5
                      ELSE 6
                  END
              ")
              ->orderBy('users.name', $sortOrder);

        return UserResource::collection($query->paginate(50));
    }

    public function show(User $user)
    {
        $user->load('roles');
        return new UserResource($user);
    }

    public function storeOrUpdate(UserRequest $request, ?User $user = null)
    {
        try {
            DB::beginTransaction();

            $data = $request->validated();
            $data['document'] = preg_replace('/[^0-9]/', '', $data['document']);
            
            // Remove password_confirmation do array de dados
            unset($data['password_confirmation']);

            // Se name ou legal_name vierem como string vazia, transforma em null
            if (array_key_exists('name', $data) && $data['name'] === '') {
                $data['name'] = null;
            }
            if (array_key_exists('legal_name', $data) && $data['legal_name'] === '') {
                $data['legal_name'] = null;
            }

            if ($user) {
                if (empty($data['password'])) {
                    unset($data['password']);
                }

                $user->update($data);
            } else {
                // Criar novo usuário sempre como 'user'
                $user = User::create($data);

                // Associar role 'user'
                $role = Role::where('identifier', 'user')->firstOrFail();
                UserRole::create([
                    'user_id' => $user->id,
                    'role_id' => $role->id,
                    'local_unit_id' => 1
                ]);
            }

            DB::commit();
            return new UserResource($user->load('roles'));
        } catch (\Throwable $e) {
            DB::rollBack();
            
            if ($e instanceof QueryException && $e->errorInfo[1] === 1062) {
                return response()->json([
                    'message' => 'Erro de validação',
                    'errors' => [
                        'document' => ['Este documento já está cadastrado'],
                        'email' => ['Este email já está cadastrado']
                    ]
                ], 422);
            }

            return response()->json([
                'message' => 'Não foi possível salvar o usuário'
            ], 500);
        }
    }

    public function destroy(User $user)
    {
        $user->delete();

        return response()->json(['message' => 'Usuário deletado com sucesso.'], 204);
    }
}
