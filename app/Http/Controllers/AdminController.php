<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Event;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function index(): Response
    {
        $stats = [
            'total_users'       => User::count(),
            'total_etudiants'   => User::where('role', 'etudiant')->count(),
            'total_professeurs' => User::where('role', 'professeur')->count(),
            'total_autres'      => User::where('role', 'autre')->count(),
            'challenges_cours'  => Challenge::where('statut', 'en_cours')->count(),
            'challenges_fin'    => Challenge::where('statut', 'termine')->count(),
            'events_actifs'     => Event::where('date_limite', '>', now())->count(),
            'events_expires'    => Event::where('date_limite', '<=', now())->count(),
        ];

        return Inertia::render('Admin/Panel', [
            'stats' => $stats,
        ]);
    }

    public function users(): Response
    {
        $users = User::orderBy('created_at', 'desc')
            ->get()
            ->map(fn($u) => [
                'id'         => $u->id,
                'name'       => $u->name,
                'email'      => $u->email,
                'role'       => $u->role,
                'avatar_url' => $u->avatar_url,
                'created_at' => $u->created_at->format('d/m/Y'),
            ]);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }
}
