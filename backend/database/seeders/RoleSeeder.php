<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $roles = [
            [
                'name' => 'MASTER',
                'identifier' => 'master',
            ],
            [
                'name' => 'ADMINISTRADOR',
                'identifier' => 'admin',
            ],
            [
                'name' => 'USUÁRIO',
                'identifier' => 'user',
            ],
            [
                'name' => 'CONSUMIDOR',
                'identifier' => 'consumer',
            ],
            [
                'name' => 'EMPRESA',
                'identifier' => 'company',
            ],
        ];

        foreach ($roles as $role) {
            DB::table('roles')->updateOrInsert(
                ['identifier' => $role['identifier']],
                [
                    'name' => $role['name'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }
}
