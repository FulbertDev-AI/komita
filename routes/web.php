<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\FollowController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', DashboardController::class)
    ->middleware(['auth', 'verified', 'not_blocked'])
    ->name('dashboard');

Route::middleware(['auth', 'not_blocked'])->group(function () {
    Route::get('/home', HomeController::class)->name('home');

    Route::get('/challenges/create', [ChallengeController::class, 'create'])->name('challenges.create');
    Route::post('/challenges', [ChallengeController::class, 'store'])->name('challenges.store');
    Route::get('/challenges/{challenge}/edit', [ChallengeController::class, 'edit'])->name('challenges.edit');
    Route::patch('/challenges/{challenge}', [ChallengeController::class, 'update'])->name('challenges.update');
    Route::delete('/challenges/{challenge}', [ChallengeController::class, 'destroy'])->name('challenges.destroy');
    Route::get('/challenges/{challenge}/report', [ChallengeController::class, 'report'])->name('challenges.report');
    Route::post('/challenges/{challenge}/report', [ChallengeController::class, 'submitReport'])->name('challenges.report.submit');
    Route::get('/challenges/{challenge}', [ChallengeController::class, 'show'])->name('challenges.show');
    Route::post('/challenges/{challenge}/corrections', [ChallengeController::class, 'storeCorrection'])->name('challenges.corrections.store');
    Route::post('/challenges/{challenge}/corrections/{correction}/reply', [ChallengeController::class, 'storeCorrectionReply'])->name('challenges.corrections.reply');
    Route::post('/challenges/{challenge}/comments', [ChallengeController::class, 'storeComment'])->name('challenges.comments.store');
    Route::post('/users/{user}/follow', [FollowController::class, 'store'])->name('users.follow');
    Route::delete('/users/{user}/follow', [FollowController::class, 'destroy'])->name('users.unfollow');
    Route::get('/users/{user}', [UserProfileController::class, 'show'])->name('users.show');

    Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
    Route::post('/events', [EventController::class, 'store'])->name('events.store');
    Route::get('/events/{event:code}/edit', [EventController::class, 'edit'])->name('events.edit');
    Route::patch('/events/{event:code}', [EventController::class, 'update'])->name('events.update');
    Route::delete('/events/{event:code}', [EventController::class, 'destroy'])->name('events.destroy');
    Route::post('/events/{event:code}/submit', [EventController::class, 'submit'])->name('events.submit');
    Route::delete('/events/{event:code}/submission', [EventController::class, 'cancelSubmission'])->name('events.submission.cancel');
    Route::patch('/events/{event:code}/submissions/{submission}', [EventController::class, 'reviewSubmission'])->name('events.submissions.review');
    Route::get('/events/{event:code}/submissions/{submission}/file', [EventController::class, 'downloadSubmissionFile'])->name('events.submissions.file');
    Route::patch('/events/{event:code}/start', [EventController::class, 'start'])->name('events.start');
    Route::post('/events/{event:code}/elements', [EventController::class, 'storeElement'])->name('events.elements.store');
    Route::patch('/events/{event:code}/elements/{element}', [EventController::class, 'updateElement'])->name('events.elements.update');
    Route::delete('/events/{event:code}/elements/{element}', [EventController::class, 'destroyElement'])->name('events.elements.destroy');
    Route::get('/events/{event:code}/elements/{element}/file', [EventController::class, 'downloadElementFile'])->name('events.elements.file');
    Route::get('/events/{event:code}/elements/{element}/files/{file}', [EventController::class, 'downloadElementAttachment'])->name('events.elements.files.download');

    Route::middleware('admin')->group(function () {
        Route::get('/admin', AdminController::class)->name('admin.panel');
        Route::patch('/admin/users/{user}/role', [AdminController::class, 'updateUserRole'])->name('admin.users.role');
        Route::patch('/admin/users/{user}', [AdminController::class, 'updateUser'])->name('admin.users.update');
        Route::patch('/admin/users/{user}/block', [AdminController::class, 'toggleUserBlock'])->name('admin.users.block');
        Route::get('/admin/users/{user}', [AdminController::class, 'showUser'])->name('admin.users.show');
        Route::delete('/admin/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.delete');
        Route::delete('/admin/events/{event}', [AdminController::class, 'destroyEvent'])->name('admin.events.delete');
        Route::delete('/admin/challenges/{challenge}', [AdminController::class, 'destroyChallenge'])->name('admin.challenges.delete');
    });

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/notifications', [NotificationController::class, 'index'])->name('notifications.index');
    Route::patch('/notifications/{notification}/read', [NotificationController::class, 'markRead'])->name('notifications.read');
});

Route::get('/events/{event:code}', [EventController::class, 'show'])
    ->where('event', '[A-Za-z0-9]{8}')
    ->name('events.show');

require __DIR__.'/auth.php';
