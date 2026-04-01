<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('challenge_reports', function (Blueprint $table) {
            $table->date('report_date')->nullable()->after('file_path');
        });

        DB::table('challenge_reports')
            ->select('id', 'submitted_at')
            ->orderBy('id')
            ->chunkById(200, function ($rows) {
                foreach ($rows as $row) {
                    DB::table('challenge_reports')
                        ->where('id', $row->id)
                        ->update([
                            'report_date' => substr((string) $row->submitted_at, 0, 10),
                        ]);
                }
            });

        Schema::table('challenge_reports', function (Blueprint $table) {
            $table->date('report_date')->nullable(false)->change();
            $table->unique(['challenge_id', 'user_id', 'report_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('challenge_reports', function (Blueprint $table) {
            $table->dropUnique('challenge_reports_challenge_id_user_id_report_date_unique');
            $table->dropColumn('report_date');
        });
    }
};

