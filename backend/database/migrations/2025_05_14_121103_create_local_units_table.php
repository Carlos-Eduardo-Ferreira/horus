<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('local_units', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('identifier', 255)->unique();
            $table->string('email', 255);
            $table->string('street', 255);
            $table->string('number', 10);
            $table->string('complement', 100)->nullable();
            $table->string('neighborhood', 100);
            $table->string('city', 100);
            $table->foreignId('state_id')->constrained()->onDelete('restrict');
            $table->string('zip_code', 8);
            $table->string('phone', 10);

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('local_units');
    }
};
