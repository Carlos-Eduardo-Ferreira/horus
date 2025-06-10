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
        Schema::create('company_validations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['not_submitted', 'pending', 'approved', 'rejected'])->default('not_submitted');
            $table->text('rejection_reason')->nullable();
            $table->timestamp('validated_at')->nullable();
            $table->timestamps();

            // Trava para garantir um único registro por usuário
            $table->unique('user_id');

            // Índices úteis
            $table->index(['user_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_validations');
    }
};
