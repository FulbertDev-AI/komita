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
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('id');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('specialty')->nullable()->after('role');
            $table->string('contact_phone')->nullable()->after('specialty');
            $table->string('social_linkedin')->nullable()->after('contact_phone');
            $table->string('social_github')->nullable()->after('social_linkedin');
            $table->string('social_instagram')->nullable()->after('social_github');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'first_name',
                'last_name',
                'specialty',
                'contact_phone',
                'social_linkedin',
                'social_github',
                'social_instagram',
            ]);
        });
    }
};

