<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use Midtrans\Config;
use Midtrans\Snap;

class PaymentController extends Controller
{
    public function __construct()
    {
        // Konfigurasi Midtrans
        Config::$serverKey = env('MIDTRANS_SERVER_KEY');
        Config::$isProduction = env('MIDTRANS_IS_PRODUCTION', false);
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function pay(Request $request, $id)
    {
        $booking = Booking::with(['user', 'tour'])->find($id);

        if (!$booking) return response()->json(['message' => 'Booking tidak ditemukan'], 404);
        if ($booking->user_id !== $request->user()->id) return response()->json(['message' => 'Unauthorized'], 403);
        if ($booking->status === 'paid') return response()->json(['message' => 'Sudah lunas'], 400);

        // Buat Parameter Transaksi untuk Midtrans
        $params = [
            'transaction_details' => [
                'order_id' => 'TRX-' . $booking->id . '-' . time(), // ID Unik (tambah waktu biar gak duplikat)
                'gross_amount' => (int) $booking->total_price,
            ],
            'customer_details' => [
                'first_name' => $booking->user->name,
                'email' => $booking->user->email,
            ],
            'item_details' => [
                [
                    'id' => $booking->tour->id,
                    'price' => (int) $booking->total_price / $booking->quantity, // Harga satuan
                    'quantity' => $booking->quantity,
                    'name' => substr($booking->tour->name, 0, 50), // Midtrans membatasi panjang nama
                ]
            ]
        ];

        try {
            // Minta Snap Token ke Midtrans
            $snapToken = Snap::getSnapToken($params);
            
            return response()->json([
                'snap_token' => $snapToken,
                'client_key' => env('MIDTRANS_CLIENT_KEY') // Kirim Client Key ke Frontend
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }
}