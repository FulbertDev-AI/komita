<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChallengeCorrection extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id',
        'professor_id',
        'content',
    ];

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professor_id');
    }

    public function replies(): HasMany
    {
        return $this->hasMany(ChallengeCorrectionReply::class);
    }
}
