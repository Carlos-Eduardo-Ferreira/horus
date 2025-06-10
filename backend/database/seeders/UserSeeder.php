<?php

namespace Database\Seeders;

use App\Enums\CompanyValidationStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $users = [
            [
                'name' => 'MASTER USER',
                'document' => '39690679015',
                'email' => 'user@master.com',
                'password' => Hash::make('vacapreta123'),
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'master',
            ],
            [
                'name' => 'ADMIN USER',
                'document' => '12345678901',
                'email' => 'user@admin.com',
                'password' => Hash::make('vacapreta123'),
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'admin',
            ],
            [
                'name' => 'COMMON USER',
                'document' => '98765432100',
                'email' => 'user@common.com',
                'password' => Hash::make('vacapreta123'),
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'user',
            ],
            [
                'name' => 'CONSUMER USER',
                'document' => '04097357018',
                'email' => 'user@consumer.com',
                'password' => Hash::make('vacapreta123'),
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'consumer',
            ],
            [
                'name' => 'AGENCIA CLIC TECNOLOGIA',
                'legal_name' => 'AGENCIA CLIC TECNOLOGIA LTDA',
                'document' => '14414603000144',
                'email' => 'user@agenciaclic.com.br',
                'password' => Hash::make('vacapreta123'),
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'company',
            ],
        ];

        // Busca os ids dos roles
        $roles = DB::table('roles')->pluck('id', 'identifier');
        
        // Usa o id 1 para a local unit
        $localUnitId = 1;

        foreach ($users as $user) {
            // Cria ou atualiza usuário
            $userData = $user;
            unset($userData['role_identifier']);
            DB::table('users')->updateOrInsert(
                ['document' => $user['document']],
                $userData
            );
            $userId = DB::table('users')->where('document', $user['document'])->value('id');

            // Cria relacionamento em user_roles
            $roleId = $roles[$user['role_identifier']] ?? null;
            if ($userId && $roleId) {
                DB::table('user_roles')->updateOrInsert(
                    [
                        'user_id' => $userId,
                        'local_unit_id' => $localUnitId,
                        'role_id' => $roleId,
                    ],
                    [
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }

            // Cria company_validation para empresas
            if ($user['role_identifier'] === 'company' && $userId) {
                DB::table('company_validations')->updateOrInsert(
                    ['user_id' => $userId],
                    [
                        'status' => CompanyValidationStatus::NOT_SUBMITTED->value,
                        'validated_at' => null,
                        'rejection_reason' => null,
                        'created_at' => $now,
                        'updated_at' => $now,
                    ]
                );
            }
        }
    }
}
