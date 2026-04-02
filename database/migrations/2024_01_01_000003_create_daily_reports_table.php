<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('challenge_id')
                  ->constrained()
                  ->cascadeOnDelete();
            $table->text('contenu_texte')->nullable();
            $table->string('fichiers_path')->nullable();
            $table->unsignedInteger('jour_numero');
            $table->boolean('est_valide')->default(false);
            $table->timestamp('date_soumission')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
