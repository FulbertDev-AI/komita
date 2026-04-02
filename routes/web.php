<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\DailyReportController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Page d'accueil publique
|--------------------------------------------------------------------------
*/
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

/*
|--------------------------------------------------------------------------
| Événement public — accessible via lien unique (sans auth obligatoire)
|--------------------------------------------------------------------------
*/
Route::get('/e/{code}', [EventController::class, 'show'])->name('events.show');

Route::post('/e/{code}/submit', [EventController::class, 'submit'])
    ->middleware(['auth', 'verified'])
    ->name('events.submit');

/*
|--------------------------------------------------------------------------
| Routes authentifiées
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {

    // Tableau de bord — redirige selon le rôle
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    /*
    |----------------------------------------------------------------------
    | Challenges (Étudiant / Autre)
    |----------------------------------------------------------------------
    */
    Route::get('/challenges', [ChallengeController::class, 'index'])->name('challenges.index');
    Route::get('/challenges/create', [ChallengeController::class, 'create'])->name('challenges.create');
    Route::post('/challenges', [ChallengeController::class, 'store'])->name('challenges.store');
    Route::get('/challenges/{challenge}', [ChallengeController::class, 'show'])->name('challenges.show');
    Route::delete('/challenges/{challenge}', [ChallengeController::class, 'destroy'])->name('challenges.destroy');

    // Rapport quotidien
    Route::get('/challenges/{challenge}/report', [DailyReportController::class, 'create'])->name('reports.create');
    Route::post('/challenges/{challenge}/report', [DailyReportController::class, 'store'])->name('reports.store');

    /*
    |----------------------------------------------------------------------
    | Événements (Professeur uniquement)
    |----------------------------------------------------------------------
    */
    Route::middleware('role:professeur')->group(function () {
        Route::get('/professor/dashboard', [EventController::class, 'index'])->name('professor.dashboard');
        Route::get('/events/create', [EventController::class, 'create'])->name('events.create');
        Route::post('/events', [EventController::class, 'store'])->name('events.store');
        Route::get('/events/{event}/detail', [EventController::class, 'detail'])->name('events.detail');
        Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('events.destroy');
    });

    /*
    |----------------------------------------------------------------------
    | Profil utilisateur
    |----------------------------------------------------------------------
    */
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    /*
    |----------------------------------------------------------------------
    | Administration (Admin uniquement)
    |----------------------------------------------------------------------
    */
    Route::middleware('role:admin')->prefix('admin')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('index');
        Route::get('/users', [AdminController::class, 'users'])->name('users');
    });
});

require __DIR__.'/auth.php';
