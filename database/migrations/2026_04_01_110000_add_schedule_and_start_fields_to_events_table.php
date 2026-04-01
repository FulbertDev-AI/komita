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
        Schema::table('events', function (Blueprint $table) {
            $table->string('schedule_type')->default('single_day')->after('deadline');
            $table->date('event_day')->nullable()->after('schedule_type');
            $table->date('period_start')->nullable()->after('event_day');
            $table->date('period_end')->nullable()->after('period_start');
            $table->timestamp('started_at')->nullable()->after('period_end');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['schedule_type', 'event_day', 'period_start', 'period_end', 'started_at']);
        });
    }
};

