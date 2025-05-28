<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LocalUnitSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('local_units')->updateOrInsert(
            ['id' => 1],
            [
                'name' => 'Unidade Central',
                'identifier' => 'central-001',
                'email' => 'contato@exemplo.com',
                'address' => 'Rua Exemplo, 123',
                'city' => 'Cidade X',
                'state' => 'SP',
                'zip_code' => '12345678',
                'phone' => '1199999999',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );
    }
}
