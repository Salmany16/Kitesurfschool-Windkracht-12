<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\MailSimulatorController;

// Public Front-end view fallback or standard welcome
Route::get('/', function () {
    return response()->json(['message' => 'Kitesurfschool Windkracht-12 API is running.']);
});

// API Routes
Route::prefix('api')->group(function () {
    
    // 1. Public Auth & General routes
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/activate', [AuthController::class, 'activate']);
    Route::post('auth/login', [AuthController::class, 'login']);
    
    Route::get('metadata', [BookingController::class, 'getMetadata']);
    Route::get('locations', [BookingController::class, 'getLocations']);
    Route::get('photos', [BookingController::class, 'getPhotos']);
    Route::get('simulated-emails', [MailSimulatorController::class, 'index']);
    Route::post('simulated-emails/clear', [MailSimulatorController::class, 'clear']);

    // 2. Authenticated Routes (Token Auth)
    Route::middleware('auth.token')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);
        Route::post('auth/change-password', [AuthController::class, 'changePassword']);
        
        Route::put('profile', [ProfileController::class, 'update']);
        
        Route::post('bookings', [BookingController::class, 'store']);
        Route::get('bookings/my', [BookingController::class, 'myBookings']);
        Route::post('bookings/pay/{id}', [BookingController::class, 'markAsPaid']);
        
        Route::post('lessons/cancel/{lessonId}', [BookingController::class, 'cancelLessonCustomer']);
        Route::post('lessons/reschedule/{lessonId}', [BookingController::class, 'rescheduleLesson']);

        // Staff (Instructor / Owner) routes
        Route::post('lessons/staff-cancel/{lessonId}', [BookingController::class, 'cancelLessonStaff']);
        Route::get('lessons/instructor-schedule', [BookingController::class, 'instructorSchedule']);

        // 3. Admin / Owner Routes
        Route::middleware('role:owner')->prefix('admin')->group(function () {
            Route::get('users', [AdminController::class, 'getUsers']);
            Route::post('users', [AdminController::class, 'storeUser']);
            Route::put('users/{id}', [AdminController::class, 'updateUser']);
            Route::delete('users/{id}', [AdminController::class, 'deleteUser']);
            Route::post('users/block/{id}', [AdminController::class, 'toggleBlock']);
            Route::post('users/role/{id}', [AdminController::class, 'changeRole']);
            
            Route::get('unpaid-bookings', [AdminController::class, 'getUnpaidBookings']);
            Route::post('bookings/confirm/{id}', [AdminController::class, 'confirmPayment']);
            Route::get('instructor-lessons/{instructorId}', [AdminController::class, 'getInstructorLessons']);

            // CRUD for Packages
            Route::post('packages', [AdminController::class, 'storePackage']);
            Route::put('packages/{id}', [AdminController::class, 'updatePackage']);
            Route::delete('packages/{id}', [AdminController::class, 'deletePackage']);

            // CRUD for Locations
            Route::post('locations', [AdminController::class, 'storeLocation']);
            Route::put('locations/{id}', [AdminController::class, 'updateLocation']);
            Route::delete('locations/{id}', [AdminController::class, 'deleteLocation']);

            // CRUD for Photos
            Route::post('photos', [AdminController::class, 'storePhoto']);
            Route::put('photos/{id}', [AdminController::class, 'updatePhoto']);
            Route::delete('photos/{id}', [AdminController::class, 'deletePhoto']);
        });
    });
});

// Fallback route for React SPA routing
Route::fallback(function () {
    $indexPath = public_path('index.html');
    if (file_exists($indexPath)) {
        return response()->file($indexPath);
    }
    return response()->json(['message' => 'Frontend not built yet. Please run local deployment.'], 404);
});


