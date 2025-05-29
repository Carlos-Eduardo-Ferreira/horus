<?php

namespace Database\Seeders;

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
                'name' => 'Master User',
                'email' => 'user@master.com',
                'password' => Hash::make('vacapreta123'),
                'document' => '39690679015',
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'master',
            ],
            [
                'name' => 'Consumer User',
                'email' => 'user@consumer.com',
                'password' => Hash::make('vacapreta123'),
                'document' => '04097357018',
                'created_at' => $now,
                'updated_at' => $now,
                'role_identifier' => 'consumer',
            ],
            [
                'name' => 'Company User',
                'email' => 'user@company.com',
                'password' => Hash::make('vacapreta123'),
                'document' => '18366615000100',
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
        }
    }
}
