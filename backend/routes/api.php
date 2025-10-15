<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Gerekli tüm Controller'ları import ediyoruz
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DataController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\StaffController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ReviewController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// --- GRUP 1: Herkesin Erişebileceği Rotalar (Kimlik Doğrulama Gerekmez) ---
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

// YENİ: Bir personelin puanını ve yorum sayısını görmek için giriş yapmak gerekmeyebilir.
Route::get('/personnel/{personal_id}/reviews', [ReviewController::class, 'index']);


// --- GRUP 2: Giriş Yapmış TÜM KULLANICILARIN Erişebileceği Rotalar ---
Route::middleware('auth:api')->group(function () {

    // KULLANICI İŞLEMLERİ
    Route::get('/user', function (Request $request) { return $request->user(); });

    // MÜŞTERİ RANDEVU İŞLEMLERİ
    Route::get('/my-appointments', [AppointmentController::class, 'index']);
    Route::post('/appointments', [AppointmentController::class, 'store']);
    Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

    // GENEL VERİ ALMA İŞLEMLERİ
    Route::get('/personnel', [DataController::class, 'getPersonnel']);
    Route::get('/services', [DataController::class, 'getServices']);
    Route::get('/staff/{user}/available-slots', [StaffController::class, 'getAvailableSlots']);

    // YENİ: Değerlendirme (puan) yapmak için giriş yapmak zorunludur.
    Route::post('/reviews', [ReviewController::class, 'store']);
});


// --- GRUP 3: Sadece ADMIN ve PERSONAL'ın Erişebileceği Rotalar ---
Route::middleware(['auth:api', 'role:admin,personal'])->prefix('staff')->group(function () {
    Route::get('/appointments', [StaffController::class, 'getAllAppointments']);
    Route::post('/appointments/{appointment}/status', [StaffController::class, 'updateAppointmentStatus']);
    Route::post('/availability', [StaffController::class, 'updateAvailability']);
});


// --- GRUP 4: Sadece ADMIN'lerin Erişebileceği Rotalar ---
Route::middleware(['auth:api', 'role:admin'])->prefix('admin')->group(function () {
    Route::get('/users', [AdminController::class, 'usersIndex']);
    Route::post('/users/{user}/role', [AdminController::class, 'changeUserRole']);
    Route::get('/services', [AdminController::class, 'servicesIndex']);
    Route::post('/services', [AdminController::class, 'servicesStore']);
    Route::delete('/services/{service}', [AdminController::class, 'servicesDestroy']);
    Route::get('/statistics', [AdminController::class, 'getStatistics']);
});
