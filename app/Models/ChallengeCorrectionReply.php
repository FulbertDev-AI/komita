<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChallengeCorrectionReply extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_correction_id',
        'owner_id',
        'content',
    ];

    public function correction(): BelongsTo
    {
        return $this->belongsTo(ChallengeCorrection::class, 'challenge_correction_id');
    }

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }
}

