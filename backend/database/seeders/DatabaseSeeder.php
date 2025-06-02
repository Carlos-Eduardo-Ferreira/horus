<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            StateSeeder::class,
            LocalUnitSeeder::class,
            RoleSeeder::class,
            UserSeeder::class,
            ActionSeeder::class,
        ]);
    }
}
