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
        'titre',
        'description',
        'duree_jours',
        'date_debut',
        'statut',
        'score_final',
    ];

    protected function casts(): array
    {
        return [
            'date_debut'  => 'date',
            'score_final' => 'decimal:2',
            'duree_jours' => 'integer',
        ];
    }

    // --- Relations ---

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function dailyReports(): HasMany
    {
        return $this->hasMany(DailyReport::class);
    }

    // --- Accesseurs calculés ---

    public function getJoursValidesAttribute(): int
    {
        return $this->dailyReports()->where('est_valide', true)->count();
    }

    public function getTauxReussiteAttribute(): float
    {
        if ($this->duree_jours === 0) {
            return 0.0;
        }
        return round(($this->jours_valides / $this->duree_jours) * 100, 2);
    }

    public function getJourActuelAttribute(): ?int
    {
        $debut = $this->date_debut;
        $today = now()->startOfDay();

        if ($today->lt($debut)) {
            return null;
        }

        $jour = $debut->diffInDays($today) + 1;
        return min($jour, $this->duree_jours);
    }

    public function getRapportAujourdhuiSoumisAttribute(): bool
    {
        $jourActuel = $this->jour_actuel;

        if ($jourActuel === null) {
            return false;
        }

        return $this->dailyReports()
                    ->where('jour_numero', $jourActuel)
                    ->exists();
    }

    // --- Méthodes métier ---

    public function recalculerScore(): void
    {
        $score = $this->duree_jours > 0
            ? ($this->jours_valides / $this->duree_jours) * 100
            : 0.0;

        $this->update(['score_final' => round($score, 2)]);
    }

    public function verifierEtTerminer(): void
    {
        if ($this->jour_actuel >= $this->duree_jours) {
            $this->recalculerScore();
            $this->update(['statut' => 'termine']);
        }
    }
}
