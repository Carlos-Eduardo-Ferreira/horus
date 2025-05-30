<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class LocalUnitSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('local_units')->updateOrInsert(
            ['id' => 1],
            [
                'name' => 'Unidade Central',
                'identifier' => 'central',
                'email' => 'contato@exemplo.com',
                'street' => 'Rua Exemplo',
                'number' => '123',
                'complement' => 'Bloco A',
                'neighborhood' => 'Centro',
                'city' => 'Cidade X',
                'state' => 'SP',
                'zip_code' => '12345678',
                'phone' => '1199999999',
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now(),
            ]
        );
    }
}
