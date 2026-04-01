<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\Event;
use App\Models\User;
use Inertia\Inertia;
use Inertia\Response;

class UserProfileController extends Controller
{
    public function show(User $user): Response
    {
        $challenges = Challenge::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(12)
            ->get(['id', 'title', 'status', 'validated_days', 'duration']);

        $events = Event::query()
            ->where('user_id', $user->id)
            ->latest()
            ->limit(12)
            ->get(['id', 'title', 'code', 'deadline', 'started_at']);

        return Inertia::render('Users/Show', [
            'profileUser' => [
                'id' => $user->id,
                'name' => $user->name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'role' => $user->role,
                'specialty' => $user->specialty,
                'contact_phone' => $user->contact_phone,
                'email' => $user->email,
                'social_linkedin' => $user->social_linkedin,
                'social_github' => $user->social_github,
                'social_instagram' => $user->social_instagram,
            ],
            'challenges' => $challenges,
            'events' => $events,
        ]);
    }
}

