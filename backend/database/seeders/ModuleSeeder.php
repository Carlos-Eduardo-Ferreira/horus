<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class ModuleSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        $modules = [
            [
                'name' => 'USUÁRIOS',
                'identifier' => 'users',
            ],
            [
                'name' => 'UNIDADES LOCAIS',
                'identifier' => 'local_units',
            ],
            [
                'name' => 'AÇÕES DE USUÁRIOS',
                'identifier' => 'actions',
            ],
            [
                'name' => 'MÓDULOS',
                'identifier' => 'modules',
            ],
        ];

        // Inserir ou atualizar módulos
        foreach ($modules as $module) {
            DB::table('modules')->updateOrInsert(
                ['identifier' => $module['identifier']],
                [
                    'name' => $module['name'],
                    'updated_at' => $now,
                    'created_at' => $now,
                ]
            );
        }

        // Buscar IDs dos módulos e ações criados
        $moduleIds = DB::table('modules')->pluck('id', 'identifier');
        $actionIds = DB::table('actions')->pluck('id', 'identifier');

        // Criar todas as combinações de permissões (módulo x ação)
        foreach ($modules as $module) {
            $moduleId = $moduleIds[$module['identifier']];
            
            foreach ($actionIds as $actionIdentifier => $actionId) {
                DB::table('permissions')->updateOrInsert(
                    [
                        'module_id' => $moduleId,
                        'action_id' => $actionId,
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
