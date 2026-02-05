<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;

class WebhookController extends Controller
{
    public function handler(Request $request)
    {
        // 1. Ambil data LANGSUNG dari input JSON (Bypass SDK Midtrans dulu buat testing)
        $transaction = $request->transaction_status;
        $type = $request->payment_type;
        $order_id = $request->order_id;
        $fraud = $request->fraud_status;

        // 2. Logika Order ID (TRX-3-xxxxx -> Ambil angka 3)
        $parts = explode('-', $order_id);
        
        // Cek validitas format order_id
        if (count($parts) < 3) {
             return response()->json(['message' => 'Invalid Order ID format'], 400);
        }
        
        $bookingId = $parts[1]; 

        $booking = Booking::find($bookingId);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // 3. Update Status
        if ($transaction == 'capture') {
            if ($type == 'credit_card') {
                if ($fraud == 'challenge') {
                    $booking->update(['status' => 'pending']);
                } else {
                    $booking->update(['status' => 'paid']);
                }
            }
        } else if ($transaction == 'settlement') {
            $booking->update(['status' => 'paid']);
        } else if ($transaction == 'pending') {
            $booking->update(['status' => 'pending']);
        } else if ($transaction == 'deny' || $transaction == 'expire' || $transaction == 'cancel') {
            $booking->update(['status' => 'cancelled']);
        }

        return response()->json([
            'message' => 'Status updated to ' . $booking->status
        ]);
    }
}