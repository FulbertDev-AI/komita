<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Event;
use App\Models\EventSubmission;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $role = $user->role ?? 'student';

        if ($role === 'admin') {
            return redirect()->route('admin.panel');
        }

        if ($role === 'professor') {
            $events = Event::query()
                ->where('user_id', $user->id)
                ->withCount('submissions')
                ->latest()
                ->get(['id', 'title', 'deadline', 'code']);

            $stats = [
                'activeEvents' => Event::query()
                    ->where('user_id', $user->id)
                    ->where('deadline', '>', now())
                    ->count(),
                'totalSubmissions' => EventSubmission::query()
                    ->whereHas('event', fn ($q) => $q->where('user_id', $user->id))
                    ->count(),
            ];

            return Inertia::render('Dashboard', [
                'events' => $events,
                'stats' => $stats,
            ]);
        }

        $challenges = Challenge::query()
            ->where('user_id', $user->id)
            ->latest()
            ->get(['id', 'title', 'status', 'duration', 'validated_days']);

        $startedAcceptedEvents = EventSubmission::query()
            ->where('user_id', $user->id)
            ->where('status', 'accepted')
            ->whereHas('event', fn ($q) => $q->whereNotNull('started_at'))
            ->with('event:id,title,code,deadline,started_at')
            ->latest()
            ->get()
            ->map(fn ($s) => $s->event)
            ->filter()
            ->values();

        $total = $challenges->count();
        $completed = $challenges->where('status', 'completed')->count();

        $stats = [
            'activeChallenges' => $challenges->where('status', 'active')->count(),
            'validatedDays' => (int) $challenges->sum('validated_days'),
            'successRate' => $total > 0 ? (int) round(($completed / $total) * 100) : 0,
        ];

        return Inertia::render('Dashboard', [
            'challenges' => $challenges,
            'joinedEvents' => $startedAcceptedEvents,
            'stats' => $stats,
        ]);
    }
}
