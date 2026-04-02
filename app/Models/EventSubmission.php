<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventSubmission extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id',
        'user_id',
        'contenu_texte',
        'fichiers_path',
        'date_soumission',
    ];

    protected function casts(): array
    {
        return [
            'date_soumission' => 'datetime',
        ];
    }

    // --- Relations ---

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // --- Accesseur ---

    public function getFichierUrlAttribute(): ?string
    {
        return $this->fichiers_path
            ? asset('storage/' . $this->fichiers_path)
            : null;
    }
}
