<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Challenge extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'duration',
        'start_date',
        'status',
        'validated_days',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function reports(): HasMany
    {
        return $this->hasMany(ChallengeReport::class);
    }

    public function corrections(): HasMany
    {
        return $this->hasMany(ChallengeCorrection::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(ChallengeComment::class);
    }
}
