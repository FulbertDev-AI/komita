<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Event;
use App\Models\EventSubmission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();
        $search = trim((string) $request->query('q', ''));

        $challenges = Challenge::query()
            ->with('user:id,name')
            ->withCount('reports')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%'.$search.'%')
                        ->orWhere('description', 'like', '%'.$search.'%');
                });
            })
            ->latest()
            ->limit(12)
            ->get([
                'id',
                'user_id',
                'title',
                'description',
                'duration',
                'validated_days',
                'status',
                'start_date',
                'created_at',
            ]);

        $acceptedEventIds = EventSubmission::query()
            ->where('user_id', $user->id)
            ->where('status', 'accepted')
            ->pluck('event_id');

        $events = Event::query()
            ->with('user:id,name')
            ->withCount('submissions')
            ->when($search !== '', function ($query) use ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', '%'.$search.'%')
                        ->orWhere('instructions', 'like', '%'.$search.'%');
                });
            })
            ->when($user->role !== 'admin', function ($query) use ($user, $acceptedEventIds) {
                $query->where(function ($q) use ($user, $acceptedEventIds) {
                    $q->whereNull('started_at')
                        ->orWhere('user_id', $user->id)
                        ->orWhereIn('id', $acceptedEventIds);
                });
            })
            ->latest()
            ->limit(12)
            ->get([
                'id',
                'user_id',
                'title',
                'instructions',
                'deadline',
                'started_at',
                'code',
                'created_at',
            ]);

        return Inertia::render('Home', [
            'filters' => [
                'q' => $search,
            ],
            'feed' => [
                'challenges' => $challenges,
                'events' => $events,
            ],
        ]);
    }
}
