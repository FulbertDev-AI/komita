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
        // Keep only the latest submission per (event_id, user_id) before adding unique constraint.
        DB::statement('
            DELETE es1
            FROM event_submissions es1
            INNER JOIN event_submissions es2
              ON es1.event_id = es2.event_id
             AND es1.user_id = es2.user_id
             AND es1.id < es2.id
        ');

        Schema::table('event_submissions', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('file_path');
            $table->text('evaluation_note')->nullable()->after('status');
            $table->foreignId('evaluated_by')->nullable()->after('evaluation_note')->constrained('users')->nullOnDelete();
            $table->timestamp('evaluated_at')->nullable()->after('evaluated_by');
            $table->unique(['event_id', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('event_submissions', function (Blueprint $table) {
            $table->dropUnique('event_submissions_event_id_user_id_unique');
            $table->dropConstrainedForeignId('evaluated_by');
            $table->dropColumn(['status', 'evaluation_note', 'evaluated_at']);
        });
    }
};

