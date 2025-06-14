<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\State;

class StateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $states = [
            ['ibge_code' => '12', 'uf' => 'AC', 'name' => 'Acre'],
            ['ibge_code' => '17', 'uf' => 'AL', 'name' => 'Alagoas'],
            ['ibge_code' => '16', 'uf' => 'AP', 'name' => 'Amapá'],
            ['ibge_code' => '13', 'uf' => 'AM', 'name' => 'Amazonas'],
            ['ibge_code' => '29', 'uf' => 'BA', 'name' => 'Bahia'],
            ['ibge_code' => '23', 'uf' => 'CE', 'name' => 'Ceará'],
            ['ibge_code' => '53', 'uf' => 'DF', 'name' => 'Distrito Federal'],
            ['ibge_code' => '32', 'uf' => 'ES', 'name' => 'Espírito Santo'],
            ['ibge_code' => '52', 'uf' => 'GO', 'name' => 'Goiás'],
            ['ibge_code' => '21', 'uf' => 'MA', 'name' => 'Maranhão'],
            ['ibge_code' => '51', 'uf' => 'MT', 'name' => 'Mato Grosso'],
            ['ibge_code' => '50', 'uf' => 'MS', 'name' => 'Mato Grosso do Sul'],
            ['ibge_code' => '31', 'uf' => 'MG', 'name' => 'Minas Gerais'],
            ['ibge_code' => '15', 'uf' => 'PA', 'name' => 'Pará'],
            ['ibge_code' => '25', 'uf' => 'PB', 'name' => 'Paraíba'],
            ['ibge_code' => '41', 'uf' => 'PR', 'name' => 'Paraná'],
            ['ibge_code' => '26', 'uf' => 'PE', 'name' => 'Pernambuco'],
            ['ibge_code' => '22', 'uf' => 'PI', 'name' => 'Piauí'],
            ['ibge_code' => '33', 'uf' => 'RJ', 'name' => 'Rio de Janeiro'],
            ['ibge_code' => '24', 'uf' => 'RN', 'name' => 'Rio Grande do Norte'],
            ['ibge_code' => '43', 'uf' => 'RS', 'name' => 'Rio Grande do Sul'],
            ['ibge_code' => '11', 'uf' => 'RO', 'name' => 'Rondônia'],
            ['ibge_code' => '14', 'uf' => 'RR', 'name' => 'Roraima'],
            ['ibge_code' => '42', 'uf' => 'SC', 'name' => 'Santa Catarina'],
            ['ibge_code' => '35', 'uf' => 'SP', 'name' => 'São Paulo'],
            ['ibge_code' => '28', 'uf' => 'SE', 'name' => 'Sergipe'],
            ['ibge_code' => '27', 'uf' => 'TO', 'name' => 'Tocantins'],
        ];

        foreach ($states as $state) {
            State::firstOrCreate(['ibge_code' => $state['ibge_code']], $state);
        }
    }
}
