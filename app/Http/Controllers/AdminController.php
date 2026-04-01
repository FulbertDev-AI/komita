<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeComment;
use App\Models\ChallengeCorrection;
use App\Models\ChallengeCorrectionReply;
use App\Models\ChallengeReport;
use App\Models\EventElement;
use App\Models\Event;
use App\Models\EventSubmission;
use App\Models\User;
use App\Models\AppNotification;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class AdminController extends Controller
{
    public function __invoke(): Response
    {
        $stats = [
            'totalUsers' => User::count(),
            'activeChallenges' => Challenge::query()->where('status', 'active')->count(),
            'activeEvents' => Event::query()->where('deadline', '>', now())->count(),
        ];

        $users = User::query()
            ->latest()
            ->get(['id', 'name', 'email', 'role', 'blocked_at', 'created_at']);

        $activity = [
            'challengeReports' => ChallengeReport::count(),
            'eventSubmissions' => EventSubmission::count(),
        ];

        $events = Event::query()
            ->with('user:id,name,email')
            ->withCount('submissions')
            ->latest()
            ->limit(30)
            ->get(['id', 'user_id', 'title', 'deadline', 'started_at', 'code', 'created_at']);

        $challenges = Challenge::query()
            ->with('user:id,name,email')
            ->withCount('reports')
            ->latest()
            ->limit(30)
            ->get(['id', 'user_id', 'title', 'status', 'duration', 'validated_days', 'start_date', 'created_at']);

        return Inertia::render('Admin/Panel', [
            'stats' => $stats,
            'users' => $users,
            'activity' => $activity,
            'events' => $events,
            'challenges' => $challenges,
        ]);
    }

    public function updateUserRole(User $user, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'role' => ['required', Rule::in(['student', 'professor', 'admin'])],
        ]);

        $user->update(['role' => $validated['role']]);

        return back();
    }

    public function updateUser(User $user, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'role' => ['required', Rule::in(['student', 'professor', 'admin'])],
        ]);

        $user->update($validated);

        return back();
    }

    public function toggleUserBlock(User $user, Request $request): RedirectResponse
    {
        abort_if($user->id === $request->user()->id, 422, 'Action impossible sur votre propre compte.');

        $user->update([
            'blocked_at' => $user->blocked_at ? null : now(),
        ]);

        return back();
    }

    public function destroyUser(User $user, Request $request): RedirectResponse
    {
        abort_if($user->id === $request->user()->id, 422, 'Action impossible sur votre propre compte.');
        $user->delete();

        return back();
    }

    public function destroyEvent(Event $event): RedirectResponse
    {
        $event->delete();

        return back();
    }

    public function destroyChallenge(Challenge $challenge): RedirectResponse
    {
        $challenge->delete();

        return back();
    }

    public function showUser(User $user): Response
    {
        $challenges = Challenge::query()->where('user_id', $user->id)->latest()->get();
        $events = Event::query()->where('user_id', $user->id)->latest()->get();
        $reports = ChallengeReport::query()->where('user_id', $user->id)->latest()->get();
        $submissions = EventSubmission::query()->where('user_id', $user->id)->latest()->get();
        $comments = ChallengeComment::query()->where('user_id', $user->id)->latest()->get();
        $corrections = ChallengeCorrection::query()->where('professor_id', $user->id)->latest()->get();
        $replies = ChallengeCorrectionReply::query()->where('owner_id', $user->id)->latest()->get();
        $eventElements = EventElement::query()->where('author_id', $user->id)->latest()->get();
        $notifications = AppNotification::query()->where('user_id', $user->id)->latest()->limit(100)->get();

        $history = collect()
            ->merge($challenges->map(fn ($x) => ['type' => 'challenge_created', 'label' => 'Challenge cree: '.$x->title, 'at' => $x->created_at]))
            ->merge($events->map(fn ($x) => ['type' => 'event_created', 'label' => 'Evenement cree: '.$x->title, 'at' => $x->created_at]))
            ->merge($reports->map(fn ($x) => ['type' => 'report_posted', 'label' => 'Rapport challenge poste', 'at' => $x->created_at]))
            ->merge($submissions->map(fn ($x) => ['type' => 'event_submission', 'label' => 'Soumission evenement envoyee', 'at' => $x->created_at]))
            ->merge($comments->map(fn ($x) => ['type' => 'comment_posted', 'label' => 'Commentaire challenge poste', 'at' => $x->created_at]))
            ->merge($corrections->map(fn ($x) => ['type' => 'correction_posted', 'label' => 'Correction professeur publiee', 'at' => $x->created_at]))
            ->merge($replies->map(fn ($x) => ['type' => 'correction_reply', 'label' => 'Reponse a correction publiee', 'at' => $x->created_at]))
            ->merge($eventElements->map(fn ($x) => ['type' => 'event_element', 'label' => 'Element d evenement publie', 'at' => $x->created_at]))
            ->sortByDesc('at')
            ->values()
            ->take(200);

        return Inertia::render('Admin/UserShow', [
            'userDetails' => $user,
            'userStats' => [
                'challenges' => $challenges->count(),
                'events' => $events->count(),
                'reports' => $reports->count(),
                'submissions' => $submissions->count(),
                'comments' => $comments->count(),
            ],
            'history' => $history,
            'challenges' => $challenges,
            'events' => $events,
            'notifications' => $notifications,
        ]);
    }
}
