<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $notifications = AppNotification::query()
            ->where('user_id', $request->user()->id)
            ->latest()
            ->limit(100)
            ->get();

        $following = User::query()
            ->whereIn('id', UserFollow::query()->where('follower_id', $request->user()->id)->pluck('followed_id'))
            ->where('role', 'student')
            ->orderBy('name')
            ->get(['id', 'name', 'email']);

        return Inertia::render('Notifications/Index', [
            'notifications' => $notifications,
            'following' => $following,
        ]);
    }

    public function markRead(AppNotification $notification, Request $request): RedirectResponse
    {
        abort_unless($notification->user_id === $request->user()->id, 403);
        $notification->update(['read_at' => now()]);

        return back();
    }
}
