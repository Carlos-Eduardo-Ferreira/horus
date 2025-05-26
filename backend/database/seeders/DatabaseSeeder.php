<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RoleSeeder::class,
            ActionSeeder::class,
        ]);

        // Gambiarra temporária pra criar uma local unit fake
        DB::table('local_units')->insert([
            'name' => 'Unidade Central',
            'email' => 'contato@exemplo.com',
            'address' => 'Rua Exemplo, 123',
            'city' => 'Cidade X',
            'state' => 'SP',
            'zip_code' => '12345678',
            'phone' => '1199999999',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
