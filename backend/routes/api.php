<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PaperController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\DashboardController;

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Public papers listing (published only)
Route::get('/publications', [PaperController::class, 'publicIndex']);
Route::get('/publications/{paper}', [PaperController::class, 'show']);

// Protected routes
Route::middleware(['auth:sanctum'])->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // Papers - Author & above
    Route::get('/papers', [PaperController::class, 'index']);
    Route::get('/papers/{paper}', [PaperController::class, 'show']);
    Route::post('/papers', [PaperController::class, 'store'])
        ->middleware('role:author,admin,super_admin');
    Route::post('/papers/{paper}', [PaperController::class, 'update'])
        ->middleware('role:author,admin,super_admin');
    Route::delete('/papers/{paper}', [PaperController::class, 'destroy'])
        ->middleware('role:admin,super_admin');

    // Assign reviewer (Admin only)
    Route::post('/papers/{paper}/assign-reviewer', [PaperController::class, 'assignReviewer'])
        ->middleware('role:admin,super_admin');

    // Reviews
    Route::get('/papers/{paper}/reviews', [ReviewController::class, 'index']);
    Route::post('/reviews', [ReviewController::class, 'store'])
        ->middleware('role:reviewer,admin,super_admin');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])
        ->middleware('role:reviewer,admin,super_admin');
    Route::get('/my-review-queue', [ReviewController::class, 'myQueue'])
        ->middleware('role:reviewer');

    // User Management (Admin only)
    Route::middleware('role:admin,super_admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
        Route::patch('/users/{user}/toggle-active', [UserController::class, 'toggleActive']);
    });

    // Get available reviewers (Admin only)
    Route::get('/reviewers', [UserController::class, 'reviewers'])
        ->middleware('role:admin,super_admin');
});
