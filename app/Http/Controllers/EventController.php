<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Http\Requests\StoreEventSubmissionRequest;
use App\Models\Event;
use App\Models\EventSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /** Dashboard professeur — liste de ses événements */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Event::class);

        $events = $request->user()->events()
            ->withCount('submissions')
            ->latest()
            ->get()
            ->map(fn($e) => [
                'id'               => $e->id,
                'titre'            => $e->titre,
                'date_limite'      => $e->date_limite->format('Y-m-d H:i'),
                'est_expire'       => $e->estExpire(),
                'lien_partage'     => $e->lien_partage,
                'submissions_count'=> $e->submissions_count,
            ]);

        return Inertia::render('Dashboard/Professor', [
            'events' => $events,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Event::class);

        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        $this->authorize('create', Event::class);

        // Le code_unique est généré automatiquement dans le boot() du Model Event
        $request->user()->events()->create($request->validated());

        return redirect()->route('professor.dashboard')
            ->with('flash', ['type' => 'success', 'message' => 'Evenement créé avec succès.']);
    }

    /** Page publique accessible via le lien unique partagé */
    public function show(Request $request, string $code): Response
    {
        $event = Event::where('code_unique', $code)->firstOrFail();

        $dejasoumis = false;
        if ($request->user()) {
            $dejasoumis = EventSubmission::where('event_id', $event->id)
                ->where('user_id', $request->user()->id)
                ->exists();
        }

        return Inertia::render('Events/Show', [
            'event' => [
                'id'           => $event->id,
                'titre'        => $event->titre,
                'consigne'     => $event->consigne,
                'date_limite'  => $event->date_limite->format('Y-m-d H:i'),
                'est_expire'   => $event->estExpire(),
                'code_unique'  => $event->code_unique,
            ],
            'deja_soumis' => $dejasoumis,
        ]);
    }

    /** Détail d'un événement (vue professeur avec soumissions) */
    public function detail(Request $request, Event $event): Response
    {
        $this->authorize('view', $event);

        $event->load(['submissions.user']);

        return Inertia::render('Events/Detail', [
            'event' => [
                'id'          => $event->id,
                'titre'       => $event->titre,
                'consigne'    => $event->consigne,
                'date_limite' => $event->date_limite->format('Y-m-d H:i'),
                'est_expire'  => $event->estExpire(),
                'lien_partage'=> $event->lien_partage,
                'submissions' => $event->submissions->map(fn($s) => [
                    'id'              => $s->id,
                    'user_name'       => $s->user->name,
                    'user_email'      => $s->user->email,
                    'contenu_texte'   => $s->contenu_texte,
                    'fichier_url'     => $s->fichier_url,
                    'date_soumission' => $s->date_soumission?->format('Y-m-d H:i'),
                ]),
            ],
        ]);
    }

    /** Soumission d'un élève sur l'événement public */
    public function submit(StoreEventSubmissionRequest $request, string $code): RedirectResponse
    {
        $event = Event::where('code_unique', $code)->firstOrFail();

        // Vérification date limite — BACKEND UNIQUEMENT
        if ($event->estExpire()) {
            return back()->with('flash', [
                'type'    => 'error',
                'message' => 'La date limite de soumission est dépassée.',
            ]);
        }

        // Vérifie qu'il n'a pas déjà soumis
        $dejasoumis = EventSubmission::where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if ($dejasoumis) {
            return back()->with('flash', [
                'type'    => 'error',
                'message' => 'Vous avez déjà soumis pour cet événement.',
            ]);
        }

        // Gestion fichier
        $fichierPath = null;
        if ($request->hasFile('fichier')) {
            $fichierPath = $request->file('fichier')->storeAs(
                'submissions/' . $request->user()->id,
                Str::uuid() . '.' . $request->file('fichier')->getClientOriginalExtension(),
                'public'
            );
        }

        EventSubmission::create([
            'event_id'        => $event->id,
            'user_id'         => $request->user()->id,
            'contenu_texte'   => $request->contenu_texte,
            'fichiers_path'   => $fichierPath,
            'date_soumission' => now(),
        ]);

        return back()->with('flash', [
            'type'    => 'success',
            'message' => 'Soumission enregistrée avec succès.',
        ]);
    }

    public function destroy(Event $event): RedirectResponse
    {
        $this->authorize('delete', $event);

        $event->delete();

        return redirect()->route('professor.dashboard')
            ->with('flash', ['type' => 'success', 'message' => 'Evenement supprimé.']);
    }
}
