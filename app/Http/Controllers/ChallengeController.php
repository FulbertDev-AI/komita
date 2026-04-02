<?php

namespace App\Http\Controllers;

use App\Models\AppNotification;
use App\Models\Challenge;
use App\Models\ChallengeComment;
use App\Models\ChallengeCorrection;
use App\Models\ChallengeCorrectionReply;
use App\Models\ChallengeReport;
use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ChallengeController extends Controller
{
    public function show(Challenge $challenge): Response
    {
        $viewer = request()->user();
        $canManage = $viewer
            && ($viewer->role === 'admin' || $challenge->user_id === $viewer->id);

        $isFollowingOwner = false;
        if ($viewer && $challenge->user_id !== $viewer->id) {
            $isFollowingOwner = UserFollow::query()
                ->where('follower_id', $viewer->id)
                ->where('followed_id', $challenge->user_id)
                ->exists();
        }

        $challenge->load(
            'user:id,name,role',
            'reports.user:id,name',
            'corrections.professor:id,name',
            'corrections.replies.owner:id,name',
            'comments.user:id,name,role'
        );

        return Inertia::render('Challenges/Show', [
            'challenge' => [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'description' => $challenge->description,
                'duration' => $challenge->duration,
                'validated_days' => $challenge->validated_days,
                'status' => $challenge->status,
                'start_date' => $challenge->start_date,
                'created_at' => $challenge->created_at,
                'is_started' => now()->toDateString() >= $challenge->start_date->toDateString(),
                'is_following_owner' => $isFollowingOwner,
                'can_manage' => $canManage,
                'owner' => $challenge->user,
                'reports_count' => $challenge->reports->count(),
                'latest_reports' => $challenge->reports
                    ->sortByDesc('submitted_at')
                    ->take(30)
                    ->values()
                    ->map(fn ($report) => [
                        'id' => $report->id,
                        'author_id' => $report->user?->id,
                        'author' => $report->user?->name,
                        'content' => $report->content,
                        'report_date' => $report->report_date?->toDateString(),
                        'file_url' => $report->file_path ? Storage::disk('public')->url($report->file_path) : null,
                        'submitted_at' => $report->submitted_at,
                    ]),
                'corrections' => $challenge->corrections
                    ->sortByDesc('created_at')
                    ->values()
                    ->map(fn ($correction) => [
                        'id' => $correction->id,
                        'professor_id' => $correction->professor_id,
                        'author' => $correction->professor?->name,
                        'content' => $correction->content,
                        'created_at' => $correction->created_at,
                        'replies' => $correction->replies
                            ->sortByDesc('created_at')
                            ->values()
                            ->map(fn ($reply) => [
                                'id' => $reply->id,
                                'author_id' => $reply->owner?->id,
                                'author' => $reply->owner?->name,
                                'content' => $reply->content,
                                'created_at' => $reply->created_at,
                            ]),
                    ]),
                'comments' => $challenge->comments
                    ->sortByDesc('created_at')
                    ->take(30)
                    ->values()
                    ->map(fn ($comment) => [
                        'id' => $comment->id,
                        'author_id' => $comment->user?->id,
                        'author' => $comment->user?->name,
                        'author_role' => $comment->user?->role,
                        'content' => $comment->content,
                        'created_at' => $comment->created_at,
                    ]),
            ],
        ]);
    }

    public function edit(Challenge $challenge, Request $request): Response
    {
        $user = $request->user();
        abort_unless($user && ($user->role === 'admin' || $challenge->user_id === $user->id), 403);
        abort_if($user->role === 'admin', 403);

        return Inertia::render('Challenges/Edit', [
            'challenge' => [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'description' => $challenge->description,
                'duration' => $challenge->duration,
                'start_date' => $challenge->start_date?->toDateString(),
            ],
        ]);
    }

    public function update(Challenge $challenge, Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user && ($user->role === 'admin' || $challenge->user_id === $user->id), 403);
        abort_if($user->role === 'admin', 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration' => ['required', 'integer', 'min:1', 'max:365'],
            'start_date' => ['required', 'date'],
        ]);

        $challenge->update($validated);

        return redirect()->route('challenges.show', $challenge->id);
    }

    public function destroy(Challenge $challenge, Request $request): RedirectResponse
    {
        $user = $request->user();
        abort_unless($user && ($user->role === 'admin' || $challenge->user_id === $user->id), 403);
        abort_if($user->role === 'admin', 403);

        $challenge->delete();

        return redirect()->route('dashboard');
    }

    public function create(): Response
    {
        abort_if(request()->user()?->role === 'admin', 403);

        return Inertia::render('Challenges/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        abort_if($request->user()->role === 'admin', 403);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'duration' => ['required', 'integer', 'min:1', 'max:365'],
            'start_date' => ['required', 'date'],
        ]);

        $challenge = Challenge::create([
            ...$validated,
            'user_id' => $request->user()->id,
            'status' => 'active',
            'validated_days' => 0,
        ]);

        if ($request->user()->role === 'student') {
            $adminIds = User::query()->where('role', 'admin')->pluck('id');
            foreach ($adminIds as $adminId) {
                AppNotification::create([
                    'user_id' => $adminId,
                    'type' => 'admin_challenge_created',
                    'title' => 'Nouveau challenge etudiant',
                    'message' => $request->user()->name.' a cree un challenge.',
                    'url' => route('challenges.show', $challenge->id),
                ]);
            }
        }

        return redirect()->route('dashboard');
    }

    public function report(Challenge $challenge, Request $request): Response
    {
        abort_unless(
            $challenge->user_id === $request->user()->id || ($request->user()->role === 'admin'),
            403
        );
        abort_if($request->user()->role === 'admin', 403);

        $today = now()->toDateString();
        $todayReport = ChallengeReport::query()
            ->where('challenge_id', $challenge->id)
            ->where('user_id', $request->user()->id)
            ->whereDate('report_date', $today)
            ->first();

        return Inertia::render('Challenges/Report', [
            'challenge' => [
                'id' => $challenge->id,
                'title' => $challenge->title,
                'duration' => $challenge->duration,
                'current_day' => min($challenge->validated_days + 1, $challenge->duration),
                'deadline' => now()->endOfDay()->toIso8601String(),
                'start_date' => $challenge->start_date->toDateString(),
                'today' => $today,
                'today_report' => $todayReport ? [
                    'id' => $todayReport->id,
                    'content' => $todayReport->content,
                    'file_url' => $todayReport->file_path ? Storage::disk('public')->url($todayReport->file_path) : null,
                ] : null,
            ],
        ]);
    }

    public function submitReport(Challenge $challenge, Request $request): RedirectResponse
    {
        abort_unless(
            $challenge->user_id === $request->user()->id || ($request->user()->role === 'admin'),
            403
        );
        abort_if($request->user()->role === 'admin', 403);

        if (now()->toDateString() < $challenge->start_date->toDateString()) {
            return back()->withErrors([
                'content' => 'Ce challenge n a pas encore commence.',
            ]);
        }

        $validated = $request->validate([
            'content' => ['required', 'string'],
            'file' => ['nullable', 'file', 'max:10240', Rule::file()->types(['pdf', 'jpg', 'jpeg', 'png', 'txt'])],
        ]);

        $today = now()->toDateString();
        $existingReport = ChallengeReport::query()
            ->where('challenge_id', $challenge->id)
            ->where('user_id', $request->user()->id)
            ->whereDate('report_date', $today)
            ->first();

        $filePath = $existingReport?->file_path;
        if (isset($validated['file'])) {
            if ($existingReport?->file_path) {
                Storage::disk('public')->delete($existingReport->file_path);
            }
            $filePath = $validated['file']->store('challenge-reports', 'public');
        }

        ChallengeReport::updateOrCreate(
            [
                'challenge_id' => $challenge->id,
                'user_id' => $request->user()->id,
                'report_date' => $today,
            ],
            [
                'content' => $validated['content'],
                'file_path' => $filePath,
                'submitted_at' => now(),
            ]
        );

        if (! $existingReport) {
            $challenge->increment('validated_days');

            if ($challenge->validated_days >= $challenge->duration) {
                $challenge->update(['status' => 'completed']);
            }
        }

        if ($request->user()->role === 'student') {
            $adminIds = User::query()->where('role', 'admin')->pluck('id');
            foreach ($adminIds as $adminId) {
                AppNotification::create([
                    'user_id' => $adminId,
                    'type' => 'admin_challenge_report',
                    'title' => 'Nouveau rapport challenge',
                    'message' => $request->user()->name.' a poste un rapport de challenge.',
                    'url' => route('challenges.show', $challenge->id),
                ]);
            }
        }

        $followers = UserFollow::query()
            ->where('followed_id', $request->user()->id)
            ->pluck('follower_id');
        foreach ($followers as $followerId) {
            AppNotification::create([
                'user_id' => $followerId,
                'type' => 'followed_student_report',
                'title' => 'Nouvelle activite challenge',
                'message' => $request->user()->name.' a ajoute un rapport de challenge.',
                'url' => route('challenges.show', $challenge->id),
            ]);
        }

        return redirect()->route('dashboard');
    }

    public function storeCorrection(Challenge $challenge, Request $request): RedirectResponse
    {
        abort_unless(in_array($request->user()->role, ['professor', 'admin'], true), 403);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        ChallengeCorrection::create([
            'challenge_id' => $challenge->id,
            'professor_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        AppNotification::create([
            'user_id' => $challenge->user_id,
            'type' => 'challenge_correction',
            'title' => 'Nouvelle correction',
            'message' => 'Un professeur a ajoute une correction sur votre challenge.',
            'url' => route('challenges.show', $challenge->id),
        ]);

        return back();
    }

    public function storeComment(Challenge $challenge, Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'content' => ['required', 'string', 'max:3000'],
        ]);

        ChallengeComment::create([
            'challenge_id' => $challenge->id,
            'user_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        if ($challenge->user_id !== $request->user()->id) {
            AppNotification::create([
                'user_id' => $challenge->user_id,
                'type' => 'challenge_comment',
                'title' => 'Nouveau commentaire',
                'message' => 'Quelqu un a commente votre challenge.',
                'url' => route('challenges.show', $challenge->id),
            ]);
        }

        return back();
    }

    public function storeCorrectionReply(Challenge $challenge, ChallengeCorrection $correction, Request $request): RedirectResponse
    {
        abort_unless($correction->challenge_id === $challenge->id, 404);
        abort_unless($challenge->user_id === $request->user()->id, 403);

        $validated = $request->validate([
            'content' => ['required', 'string', 'max:5000'],
        ]);

        ChallengeCorrectionReply::create([
            'challenge_correction_id' => $correction->id,
            'owner_id' => $request->user()->id,
            'content' => $validated['content'],
        ]);

        AppNotification::create([
            'user_id' => $correction->professor_id,
            'type' => 'challenge_correction_reply',
            'title' => 'Reponse a votre correction',
            'message' => 'Le proprietaire du challenge a repondu a votre correction.',
            'url' => route('challenges.show', $challenge->id),
        ]);

        return back();
    }
}
