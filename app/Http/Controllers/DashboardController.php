<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Redirige vers le bon tableau de bord selon le rôle.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        if ($user->isProfesseur()) {
            return redirect()->route('professor.dashboard');
        }

        if ($user->isAdmin()) {
            return redirect()->route('admin.index');
        }

        // Étudiant ou Autre — tableau de bord challenges
        $challenges = $user->challenges()
            ->withCount(['dailyReports', 'dailyReports as rapports_valides_count' => function ($q) {
                $q->where('est_valide', true);
            }])
            ->latest()
            ->get()
            ->map(fn($c) => [
                'id'               => $c->id,
                'titre'            => $c->titre,
                'duree_jours'      => $c->duree_jours,
                'date_debut'       => $c->date_debut->format('Y-m-d'),
                'statut'           => $c->statut,
                'score_final'      => $c->score_final,
                'taux_reussite'    => $c->taux_reussite,
                'jours_valides'    => $c->jours_valides,
                'jour_actuel'      => $c->jour_actuel,
                'rapport_soumis'   => $c->rapport_aujourd_hui_soumis,
            ]);

        $stats = [
            'total'            => $challenges->count(),
            'en_cours'         => $challenges->where('statut', 'en_cours')->count(),
            'termines'         => $challenges->where('statut', 'termine')->count(),
            'taux_moyen'       => round($challenges->avg('taux_reussite') ?? 0, 1),
        ];

        return Inertia::render('Dashboard/Student', [
            'challenges' => $challenges,
            'stats'      => $stats,
        ]);
    }
}
