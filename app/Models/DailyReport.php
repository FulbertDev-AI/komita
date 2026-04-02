<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DailyReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'challenge_id',
        'contenu_texte',
        'fichiers_path',
        'jour_numero',
        'est_valide',
        'date_soumission',
    ];

    protected function casts(): array
    {
        return [
            'est_valide'      => 'boolean',
            'date_soumission' => 'datetime',
            'jour_numero'     => 'integer',
        ];
    }

    // --- Relation ---

    public function challenge(): BelongsTo
    {
        return $this->belongsTo(Challenge::class);
    }

    // --- Validation 23h59 BACKEND UNIQUEMENT ---

    public static function soumissionEstValide(): bool
    {
        $maintenant = now();
        $limite     = $maintenant->copy()->setTime(23, 59, 0);

        return $maintenant->lessThanOrEqualTo($limite);
    }

    // --- Accesseur ---

    public function getFichierUrlAttribute(): ?string
    {
        return $this->fichiers_path
            ? asset('storage/' . $this->fichiers_path)
            : null;
    }
}
