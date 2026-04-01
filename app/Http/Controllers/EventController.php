<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventElement;
use App\Models\EventElementFile;
use App\Models\AppNotification;
use App\Models\EventSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;

class EventController extends Controller
{
    public function create(Request $request): Response
    {
        abort_unless(in_array($request->user()->role, ['professor', 'admin'], true), 403);

        return Inertia::render('Events/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        abort_unless(in_array($request->user()->role, ['professor', 'admin'], true), 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'instructions' => ['required', 'string'],
            'deadline' => ['required', 'date', 'after:now'],
            'schedule_type' => ['required', Rule::in(['single_day', 'multi_day'])],
            'event_day' => ['nullable', 'date'],
            'period_start' => ['nullable', 'date'],
            'period_end' => ['nullable', 'date', 'after_or_equal:period_start'],
        ]);

        if ($validated['schedule_type'] === 'single_day' && empty($validated['event_day'])) {
            return back()->withErrors(['event_day' => 'Le jour de l evenement est requis.'])->withInput();
        }
        if ($validated['schedule_type'] === 'multi_day' && (empty($validated['period_start']) || empty($validated['period_end']))) {
            return back()->withErrors(['period_start' => 'La periode du bootcamp est requise.'])->withInput();
        }

        Event::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'code' => $this->generateUniqueCode(),
        ]);

        if ($request->user()->role === 'professor') {
            $adminIds = \App\Models\User::query()->where('role', 'admin')->pluck('id');
            foreach ($adminIds as $adminId) {
                AppNotification::create([
                    'user_id' => $adminId,
                    'type' => 'admin_event_created',
                    'title' => 'Nouveau evenement professeur',
                    'message' => $request->user()->name.' a cree un evenement.',
                    'url' => route('admin.panel'),
                ]);
            }
        }

        return redirect()->route('dashboard');
    }

    public function show(Event $event, Request $request): Response
    {
        $submission = null;
        $canManage = false;
        $submissions = [];
        $elements = [];
        $user = $request->user();

        if ($user) {
            $submission = EventSubmission::query()
                ->where('event_id', $event->id)
                ->where('user_id', $user->id)
                ->first();

            $canManage = $user->role === 'admin'
                || ($user->role === 'professor' && $event->user_id === $user->id);

            if ($canManage) {
                $submissions = EventSubmission::query()
                    ->where('event_id', $event->id)
                    ->with('user:id,name,email')
                    ->latest('submitted_at')
                    ->get()
                    ->map(fn ($item) => [
                        'id' => $item->id,
                        'user' => [
                            'id' => $item->user?->id,
                            'name' => $item->user?->name,
                            'email' => $item->user?->email,
                        ],
                        'content' => $item->content,
                        'file_url' => $item->file_path
                            ? route('events.submissions.file', ['event' => $event->code, 'submission' => $item->id])
                            : null,
                        'status' => $item->status,
                        'submitted_at' => $item->submitted_at?->toIso8601String(),
                    ])
                    ->values();
            }
        }

        $isAcceptedParticipant = $submission && $submission->status === 'accepted';
        $isStarted = (bool) $event->started_at;

        if ($isStarted && ! $canManage && ! $isAcceptedParticipant) {
            abort(403, 'Cet evenement a deja commence.');
        }

        if ($isStarted && ($canManage || $isAcceptedParticipant)) {
            $elements = EventElement::query()
                ->where('event_id', $event->id)
                ->with(['author:id,name', 'files'])
                ->latest()
                ->get()
                ->map(fn ($item) => [
                    'id' => $item->id,
                    'title' => $item->title,
                    'content' => $item->content,
                    'publish_date' => $item->publish_date?->toDateString(),
                    'created_at' => $item->created_at?->toIso8601String(),
                    'author' => $item->author?->name,
                    'file_url' => $item->file_path
                        ? route('events.elements.file', ['event' => $event->code, 'element' => $item->id])
                        : null,
                    'file_mime' => $item->file_mime,
                    'files' => $item->files->map(fn ($file) => [
                        'id' => $file->id,
                        'name' => $file->original_name,
                        'mime' => $file->file_mime,
                        'size' => $file->file_size,
                        'url' => route('events.elements.files.download', [
                            'event' => $event->code,
                            'element' => $item->id,
                            'file' => $file->id,
                        ]),
                    ])->values(),
                ])
                ->values();
        }

        return Inertia::render('Events/Show', [
            'event' => [
                'id' => $event->id,
                'owner_id' => $event->user_id,
                'title' => $event->title,
                'instructions' => $event->instructions,
                'deadline' => $event->deadline?->toIso8601String(),
                'schedule_type' => $event->schedule_type,
                'event_day' => $event->event_day?->toDateString(),
                'period_start' => $event->period_start?->toDateString(),
                'period_end' => $event->period_end?->toDateString(),
                'started_at' => $event->started_at?->toIso8601String(),
                'is_started' => $isStarted,
                'code' => $event->code,
                'can_manage' => $canManage,
                'can_start' => $canManage && ! $isStarted && now()->greaterThanOrEqualTo($event->deadline),
                'submissions' => $submissions,
                'elements' => $elements,
                'my_submission' => $submission ? [
                    'id' => $submission->id,
                    'status' => $submission->status,
                    'submitted_at' => $submission->submitted_at?->toIso8601String(),
                ] : null,
            ],
        ]);
    }

    public function submit(Event $event, Request $request): RedirectResponse
    {
        if (! $request->user()) {
            return redirect()->route('login');
        }

        if ($request->user()->role === 'admin') {
            return back()->withErrors([
                'content' => 'Un administrateur ne peut pas postuler.',
            ]);
        }

        if ($event->started_at) {
            return back()->withErrors([
                'content' => 'Les candidatures sont fermees, l evenement a deja commence.',
            ]);
        }

        if ($event->deadline && now()->greaterThan($event->deadline)) {
            return back()->withErrors([
                'content' => __('event.closed'),
            ]);
        }

        $validated = $request->validate([
            'content' => ['required', 'string'],
            'file' => ['nullable', 'file', 'max:10240', Rule::file()->types(['pdf', 'jpg', 'jpeg', 'png', 'txt'])],
        ]);

        $filePath = isset($validated['file'])
            ? $validated['file']->store('event-submissions', 'public')
            : null;

        $existing = EventSubmission::query()
            ->where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return back()->withErrors([
                'content' => 'Vous avez deja soumis une participation pour cet evenement.',
            ]);
        }

        EventSubmission::create([
            'event_id' => $event->id,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
            'file_path' => $filePath,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);

        AppNotification::create([
            'user_id' => $event->user_id,
            'type' => 'event_new_submission',
            'title' => 'Nouvelle candidature evenement',
            'message' => 'Une nouvelle soumission a ete envoyee.',
            'url' => route('events.show', $event->code),
        ]);

        return back();
    }

    public function cancelSubmission(Event $event, Request $request): RedirectResponse
    {
        $submission = EventSubmission::query()
            ->where('event_id', $event->id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        if ($submission->status !== 'pending') {
            return back()->withErrors([
                'content' => 'Cette soumission ne peut plus etre annulee.',
            ]);
        }

        if ($submission->file_path) {
            Storage::disk('public')->delete($submission->file_path);
        }

        $submission->delete();

        return back();
    }

    public function reviewSubmission(Event $event, EventSubmission $submission, Request $request): RedirectResponse
    {
        $user = $request->user();
        $canManage = $user->role === 'admin'
            || ($user->role === 'professor' && $event->user_id === $user->id);

        abort_unless($canManage, 403);
        abort_unless($submission->event_id === $event->id, 404);

        $validated = $request->validate([
            'decision' => ['required', Rule::in(['accepted', 'declined', 'removed'])],
            'evaluation_note' => ['nullable', 'string', 'max:5000'],
        ]);

        $submission->update([
            'status' => $validated['decision'],
            'evaluation_note' => $validated['evaluation_note'] ?? null,
            'evaluated_by' => $user->id,
            'evaluated_at' => now(),
        ]);

        AppNotification::create([
            'user_id' => $submission->user_id,
            'type' => 'event_submission_review',
            'title' => 'Mise a jour de candidature',
            'message' => match ($validated['decision']) {
                'accepted' => 'Votre candidature a ete acceptee.',
                'declined' => 'Votre candidature a ete declinee.',
                default => 'Votre acces a cet evenement a ete retire.',
            },
            'url' => route('events.show', $event->code),
        ]);

        return back();
    }

    public function downloadSubmissionFile(Event $event, EventSubmission $submission, Request $request): StreamedResponse|BinaryFileResponse
    {
        abort_unless($submission->event_id === $event->id, 404);
        abort_unless($submission->file_path, 404);

        $user = $request->user();
        abort_unless($user, 403);

        $canManage = $user->role === 'admin'
            || ($user->role === 'professor' && $event->user_id === $user->id);
        $isOwner = $submission->user_id === $user->id;

        abort_unless($canManage || $isOwner, 403);

        return Storage::disk('public')->download($submission->file_path);
    }

    public function start(Event $event, Request $request): RedirectResponse
    {
        $user = $request->user();
        $canManage = $user->role === 'admin'
            || ($user->role === 'professor' && $event->user_id === $user->id);
        abort_unless($canManage, 403);

        if (now()->lessThan($event->deadline)) {
            return back()->withErrors(['content' => 'La periode de candidature n est pas terminee.']);
        }

        if (! $event->started_at) {
            $event->update(['started_at' => now()]);
        }

        $adminIds = \App\Models\User::query()->where('role', 'admin')->pluck('id');
        foreach ($adminIds as $adminId) {
            AppNotification::create([
                'user_id' => $adminId,
                'type' => 'admin_event_started',
                'title' => 'Evenement demarre',
                'message' => 'Un professeur a demarre un evenement.',
                'url' => route('admin.panel'),
            ]);
        }

        $acceptedUsers = EventSubmission::query()
            ->where('event_id', $event->id)
            ->where('status', 'accepted')
            ->pluck('user_id');

        foreach ($acceptedUsers as $userId) {
            AppNotification::create([
                'user_id' => $userId,
                'type' => 'event_started',
                'title' => 'Evenement demarre',
                'message' => 'Un evenement auquel vous etes accepte vient de commencer.',
                'url' => route('events.show', $event->code),
            ]);
        }

        return back();
    }

    public function storeElement(Event $event, Request $request): RedirectResponse
    {
        $user = $request->user();
        $canManage = $user->role === 'admin'
            || ($user->role === 'professor' && $event->user_id === $user->id);
        abort_unless($canManage, 403);

        abort_unless((bool) $event->started_at, 403, 'Demarrez l evenement avant de publier des elements.');

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'content' => ['nullable', 'string', 'max:10000', 'required_without:files'],
            'files' => ['nullable', 'array', 'max:10'],
            'files.*' => ['file', 'max:51200', Rule::file()->types([
                'pdf',
                'doc',
                'docx',
                'ppt',
                'pptx',
                'xls',
                'xlsx',
                'zip',
                'txt',
                'jpg',
                'jpeg',
                'png',
                'gif',
                'mp4',
                'mov',
                'avi',
                'webm',
                'mkv',
            ])],
            'publish_date' => ['nullable', 'date'],
        ]);

        $element = EventElement::create([
            'event_id' => $event->id,
            'author_id' => $user->id,
            'title' => $validated['title'],
            'content' => $validated['content'] ?? '',
            'file_path' => null,
            'file_mime' => null,
            'publish_date' => $validated['publish_date'] ?? null,
        ]);

        foreach ($validated['files'] ?? [] as $file) {
            $storedPath = $file->store('event-elements', 'public');
            EventElementFile::create([
                'event_element_id' => $element->id,
                'file_path' => $storedPath,
                'file_mime' => $file->getMimeType(),
                'original_name' => $file->getClientOriginalName(),
                'file_size' => $file->getSize(),
            ]);
        }

        return back();
    }

    public function downloadElementFile(Event $event, EventElement $element, Request $request): StreamedResponse|BinaryFileResponse
    {
        abort_unless($element->event_id === $event->id, 404);
        abort_unless($element->file_path, 404);

        $user = $request->user();
        abort_unless($user, 403);

        $submission = EventSubmission::query()
            ->where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        $canManage = $user->role === 'admin'
            || ($user->role === 'professor' && $event->user_id === $user->id);
        $isAcceptedParticipant = $submission && $submission->status === 'accepted';

        abort_unless($event->started_at && ($canManage || $isAcceptedParticipant), 403);

        return Storage::disk('public')->download($element->file_path);
    }

    public function downloadElementAttachment(Event $event, EventElement $element, EventElementFile $file, Request $request): StreamedResponse|BinaryFileResponse
    {
        abort_unless($element->event_id === $event->id, 404);
        abort_unless($file->event_element_id === $element->id, 404);

        $user = $request->user();
        abort_unless($user, 403);

        $submission = EventSubmission::query()
            ->where('event_id', $event->id)
            ->where('user_id', $user->id)
            ->first();

        $canManage = $user->role === 'admin'
            || ($user->role === 'professor' && $event->user_id === $user->id);
        $isAcceptedParticipant = $submission && $submission->status === 'accepted';

        abort_unless($event->started_at && ($canManage || $isAcceptedParticipant), 403);

        if ($file->original_name) {
            return Storage::disk('public')->download($file->file_path, $file->original_name);
        }

        return Storage::disk('public')->download($file->file_path);
    }

    protected function generateUniqueCode(): string
    {
        do {
            $code = Str::upper(Str::random(8));
        } while (Event::query()->where('code', $code)->exists());

        return $code;
    }
}
