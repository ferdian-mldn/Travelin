<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Tour;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class BookingController extends Controller
{
    public function downloadInvoice($id)
    {
        // 1. Cari Booking
        $booking = Booking::with(['user', 'tour'])->find($id);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found'], 404);
        }

        // 2. Cek apakah user yang request adalah pemilik booking (Security)
        if ($booking->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // 3. Cek Status (Hanya boleh download kalau sudah Lunas)
        if ($booking->status !== 'paid') {
            return response()->json(['message' => 'Pembayaran belum lunas'], 400);
        }

        // 4. Generate PDF
        $pdf = Pdf::loadView('pdf.invoice', compact('booking'));

        // 5. Download file (stream)
        return $pdf->download('invoice-travelin-' . $booking->id . '.pdf');
    }

    public function store(Request $request)
    {
        // 1. Validasi Input
        $request->validate([
            'tour_id' => 'required|exists:tours,id',
            'travel_date' => 'required|date|after:today', // Tanggal wajib masa depan
            'quantity' => 'required|integer|min:1',
        ]);

        // 2. Ambil Data Paket Wisata
        $tour = Tour::find($request->tour_id);

        // 3. Hitung Ulang Total Harga (Biar Aman)
        $subtotal = $tour->price * $request->quantity;
        $adminFee = $subtotal * 0.05; // Fee 5%
        $grandTotal = $subtotal + $adminFee;

        // 4. Simpan ke Database
        $booking = Booking::create([
            'user_id' => $request->user()->id, // Ambil ID user dari Token Login
            'tour_id' => $tour->id,
            'travel_date' => $request->travel_date,
            'quantity' => $request->quantity,
            'total_price' => $grandTotal,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Booking berhasil dibuat!',
            'data' => $booking
        ], 201);
    }
    public function index(Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with('tour') // Ikut sertakan data Tour biar bisa ambil Nama & Gambar
            ->latest() // Urutkan dari yang terbaru
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $bookings
        ]);
    }
}