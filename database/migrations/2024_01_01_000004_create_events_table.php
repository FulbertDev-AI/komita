<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('professeur_id')
                  ->constrained('users')
                  ->cascadeOnDelete();
            $table->string('titre');
            $table->text('consigne');
            $table->dateTime('date_limite');
            $table->string('code_unique', 50)->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
