<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ActionSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $actions = [
            [
                'name' => 'ACESSAR',
                'identifier' => 'access',
            ],
            [
                'name' => 'CRIAR',
                'identifier' => 'create',
            ],
            [
                'name' => 'EDITAR',
                'identifier' => 'edit',
            ],
            [
                'name' => 'EXCLUIR',
                'identifier' => 'delete',
            ],
        ];

        foreach ($actions as $action) {
            DB::table('actions')->updateOrInsert(
                ['identifier' => $action['identifier']],
                [
                    'name' => $action['name'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }
    }
}
