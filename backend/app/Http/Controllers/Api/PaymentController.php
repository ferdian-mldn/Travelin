<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class PaymentController extends Controller
{
    public function pay(Request $request, $id)
    {
        // 1. Cari Booking berdasarkan ID
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        }

        // 2. Pastikan yang bayar adalah pemilik booking (Security Check)
        if ($booking->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Anda tidak berhak membayar ini'], 403);
        }

        // 3. Cek apakah sudah lunas duluan
        if ($booking->status === 'paid') {
            return response()->json(['message' => 'Booking ini sudah lunas'], 400);
        }

        // 4. Update Status jadi PAID
        $booking->update([
            'status' => 'paid'
        ]);

        return response()->json([
            'message' => 'Pembayaran berhasil! Terima kasih.',
            'data' => $booking
        ]);
    }
}