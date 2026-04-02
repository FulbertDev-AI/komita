<?php

namespace App\Policies;

use App\Models\Challenge;
use App\Models\User;

class ChallengePolicy
{
    /**
     * Un admin voit tout.
     */
    public function before(User $user): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return null;
    }

    /** Liste : seuls les utilisateurs pouvant faire des challenges */
    public function viewAny(User $user): bool
    {
        return $user->canChallenge();
    }

    /** Voir un challenge : uniquement le propriétaire */
    public function view(User $user, Challenge $challenge): bool
    {
        return $user->id === $challenge->user_id;
    }

    /** Créer : étudiant ou autre uniquement */
    public function create(User $user): bool
    {
        return $user->canChallenge();
    }

    /** Modifier : uniquement le propriétaire */
    public function update(User $user, Challenge $challenge): bool
    {
        return $user->id === $challenge->user_id;
    }

    /** Supprimer : uniquement le propriétaire */
    public function delete(User $user, Challenge $challenge): bool
    {
        return $user->id === $challenge->user_id;
    }
}
