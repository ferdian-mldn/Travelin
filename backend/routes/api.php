<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\TourController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\WebhookController;

// Route Wajib Laravel 11 (biar user terdeteksi)
Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// --- RUTE API TRAVELIN KITA ---
Route::get('/tours', [TourController::class, 'index']); // Ambil semua data
Route::get('/tours/{slug}', [TourController::class, 'show']); // Ambil detail satu paket

// --- AUTHENTICATION ROUTES ---
// Public (Bisa diakses siapa saja)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Private (Harus punya token/login dulu)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Route cek user sedang login siapa
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// ... route login/register di atas ...

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) { return $request->user(); });
    
    // --- ROUTE BOOKING BARU ---
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::post('/bookings', [BookingController::class, 'store']); // Create
    Route::get('/bookings', [BookingController::class, 'index']);  // <--- TAMBAHKAN INI (List)
    Route::get('/bookings/{id}', [BookingController::class, 'show']);
    Route::post('/bookings/{id}/pay', [PaymentController::class, 'pay']); // <--- Rute Bayar
    Route::get('/bookings/{id}/invoice', [App\Http\Controllers\Api\BookingController::class, 'downloadInvoice']);
    Route::post('/bookings/{id}/cancel', [BookingController::class, 'cancel']);
});

Route::post('/midtrans-callback', [WebhookController::class, 'handler']);