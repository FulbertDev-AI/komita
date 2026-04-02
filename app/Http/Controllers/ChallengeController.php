<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChallengeRequest;
use App\Models\Challenge;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ChallengeController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Challenge::class);

        $challenges = $request->user()->challenges()->latest()->get();

        return Inertia::render('Challenges/Index', [
            'challenges' => $challenges,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Challenge::class);

        return Inertia::render('Challenges/Create');
    }

    public function store(StoreChallengeRequest $request): RedirectResponse
    {
        $this->authorize('create', Challenge::class);

        $request->user()->challenges()->create($request->validated());

        return redirect()->route('dashboard')
            ->with('flash', ['type' => 'success', 'message' => 'Challenge créé avec succès.']);
    }

    public function show(Request $request, Challenge $challenge): Response
    {
        $this->authorize('view', $challenge);

        $challenge->load('dailyReports');

        return Inertia::render('Challenges/Show', [
            'challenge' => [
                'id'             => $challenge->id,
                'titre'          => $challenge->titre,
                'description'    => $challenge->description,
                'duree_jours'    => $challenge->duree_jours,
                'date_debut'     => $challenge->date_debut->format('Y-m-d'),
                'statut'         => $challenge->statut,
                'score_final'    => $challenge->score_final,
                'taux_reussite'  => $challenge->taux_reussite,
                'jours_valides'  => $challenge->jours_valides,
                'jour_actuel'    => $challenge->jour_actuel,
                'rapport_soumis' => $challenge->rapport_aujourd_hui_soumis,
                'rapports'       => $challenge->dailyReports->map(fn($r) => [
                    'id'              => $r->id,
                    'jour_numero'     => $r->jour_numero,
                    'est_valide'      => $r->est_valide,
                    'date_soumission' => $r->date_soumission?->format('Y-m-d H:i'),
                    'fichier_url'     => $r->fichier_url,
                ]),
            ],
        ]);
    }

    public function destroy(Challenge $challenge): RedirectResponse
    {
        $this->authorize('delete', $challenge);

        $challenge->delete();

        return redirect()->route('dashboard')
            ->with('flash', ['type' => 'success', 'message' => 'Challenge supprimé.']);
    }
}
