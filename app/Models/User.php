<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password'          => 'hashed',
        ];
    }

    // --- Helpers de rôle ---

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isProfesseur(): bool
    {
        return $this->role === 'professeur';
    }

    public function isEtudiant(): bool
    {
        return $this->role === 'etudiant';
    }

    public function isAutre(): bool
    {
        return $this->role === 'autre';
    }

    public function canChallenge(): bool
    {
        return in_array($this->role, ['etudiant', 'autre']);
    }

    // --- Relations Eloquent ---

    public function challenges(): HasMany
    {
        return $this->hasMany(Challenge::class);
    }

    public function events(): HasMany
    {
        return $this->hasMany(Event::class, 'professeur_id');
    }

    public function eventSubmissions(): HasMany
    {
        return $this->hasMany(EventSubmission::class);
    }

    // --- Avatar URL ---

    public function getAvatarUrlAttribute(): string
    {
        if ($this->avatar) {
            return asset('storage/' . $this->avatar);
        }

        $name = urlencode($this->name);
        return "https://ui-avatars.com/api/?name={$name}&background=4F46E5&color=ffffff&size=128";
    }
}
