<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    public function before(User $user): ?bool
    {
        if ($user->isAdmin()) {
            return true;
        }
        return null;
    }

    /** Liste des événements : uniquement les professeurs */
    public function viewAny(User $user): bool
    {
        return $user->isProfesseur();
    }

    /** Voir un événement (dashboard prof) : uniquement le créateur */
    public function view(User $user, Event $event): bool
    {
        return $user->id === $event->professeur_id;
    }

    /** Créer : professeur uniquement */
    public function create(User $user): bool
    {
        return $user->isProfesseur();
    }

    /** Modifier : uniquement le créateur */
    public function update(User $user, Event $event): bool
    {
        return $user->id === $event->professeur_id;
    }

    /** Supprimer : uniquement le créateur */
    public function delete(User $user, Event $event): bool
    {
        return $user->id === $event->professeur_id;
    }
}
