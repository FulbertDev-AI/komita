<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'instructions',
        'deadline',
        'schedule_type',
        'event_day',
        'period_start',
        'period_end',
        'started_at',
        'code',
    ];

    protected function casts(): array
    {
        return [
            'deadline' => 'datetime',
            'event_day' => 'date',
            'period_start' => 'date',
            'period_end' => 'date',
            'started_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'code';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(EventSubmission::class);
    }

    public function elements(): HasMany
    {
        return $this->hasMany(EventElement::class);
    }
}
