<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreDailyReportRequest;
use App\Models\Challenge;
use App\Models\DailyReport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DailyReportController extends Controller
{
    public function create(Challenge $challenge): Response
    {
        $this->authorize('update', $challenge);

        // Vérifie que le rapport du jour n'a pas encore été soumis
        $jourActuel = $challenge->jour_actuel;

        if ($jourActuel === null) {
            return redirect()->route('challenges.show', $challenge)
                ->with('flash', ['type' => 'error', 'message' => 'Ce challenge n\'a pas encore commencé.']);
        }

        $dejasoumis = $challenge->dailyReports()
            ->where('jour_numero', $jourActuel)
            ->exists();

        return Inertia::render('Challenges/Report', [
            'challenge'  => [
                'id'          => $challenge->id,
                'titre'       => $challenge->titre,
                'jour_actuel' => $jourActuel,
                'duree_jours' => $challenge->duree_jours,
            ],
            'deja_soumis'   => $dejasoumis,
            'delai_depasse' => ! DailyReport::soumissionEstValide(),
        ]);
    }

    public function store(StoreDailyReportRequest $request, Challenge $challenge): RedirectResponse
    {
        $this->authorize('update', $challenge);

        $jourActuel = $challenge->jour_actuel;

        // Empêche la double soumission
        $dejasoumis = $challenge->dailyReports()
            ->where('jour_numero', $jourActuel)
            ->exists();

        if ($dejasoumis) {
            return back()->with('flash', [
                'type'    => 'error',
                'message' => 'Le rapport de ce jour a déjà été soumis.',
            ]);
        }

        // Validation du délai 23h59 — BACKEND UNIQUEMENT
        $estValide = DailyReport::soumissionEstValide();

        // Gestion du fichier uploadé
        $fichierPath = null;
        if ($request->hasFile('fichier')) {
            $fichierPath = $request->file('fichier')->storeAs(
                'submissions/' . $request->user()->id,
                Str::uuid() . '.' . $request->file('fichier')->getClientOriginalExtension(),
                'public'
            );
        }

        $challenge->dailyReports()->create([
            'contenu_texte'   => $request->contenu_texte,
            'fichiers_path'   => $fichierPath,
            'jour_numero'     => $jourActuel,
            'est_valide'      => $estValide,
            'date_soumission' => now(),
        ]);

        // Recalcul du score et vérification de fin de challenge
        $challenge->recalculerScore();
        $challenge->verifierEtTerminer();

        $message = $estValide
            ? 'Rapport soumis avec succès.'
            : 'Rapport enregistré mais soumis après 23h59 — non comptabilisé.';

        return redirect()->route('challenges.show', $challenge)
            ->with('flash', ['type' => $estValide ? 'success' : 'warning', 'message' => $message]);
    }
}
