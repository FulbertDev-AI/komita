<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class FollowController extends Controller
{
    public function store(User $user, Request $request): RedirectResponse
    {
        $viewer = $request->user();
        abort_if($viewer->role === 'admin', 403);
        abort_if($viewer->id === $user->id, 422);
        abort_if($user->role !== 'student', 422);

        UserFollow::firstOrCreate([
            'follower_id' => $viewer->id,
            'followed_id' => $user->id,
        ]);

        AppNotification::create([
            'user_id' => $user->id,
            'type' => 'student_followed',
            'title' => 'Nouveau suiveur',
            'message' => $viewer->name.' suit vos challenges.',
            'url' => null,
        ]);

        return back();
    }

    public function destroy(User $user, Request $request): RedirectResponse
    {
        $viewer = $request->user();

        UserFollow::query()
            ->where('follower_id', $viewer->id)
            ->where('followed_id', $user->id)
            ->delete();

        return back();
    }
}
