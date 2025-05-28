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
            $table->string('email', 255)->nullable();
            $table->string('address', 255);
            $table->string('city', 255);
            $table->string('state', 2);
            $table->string('zip_code', 8);
            $table->string('phone', 10)->nullable();
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
