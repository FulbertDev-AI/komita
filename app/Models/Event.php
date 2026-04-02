<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Str;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'professeur_id',
        'titre',
        'consigne',
        'date_limite',
        'code_unique',
    ];

    protected function casts(): array
    {
        return [
            'date_limite' => 'datetime',
        ];
    }

    // --- Génération automatique du code unique ---

    protected static function booted(): void
    {
        static::creating(function (Event $event) {
            do {
                $code = strtoupper(Str::random(10));
            } while (static::where('code_unique', $code)->exists());

            $event->code_unique = $code;
        });
    }

    // --- Relations ---

    public function professeur(): BelongsTo
    {
        return $this->belongsTo(User::class, 'professeur_id');
    }

    public function submissions(): HasMany
    {
        return $this->hasMany(EventSubmission::class);
    }

    // --- Logique métier BACKEND UNIQUEMENT ---

    public function estExpire(): bool
    {
        return now()->greaterThan($this->date_limite);
    }

    public function getLienPartageAttribute(): string
    {
        return route('events.show', ['code' => $this->code_unique]);
    }
}
