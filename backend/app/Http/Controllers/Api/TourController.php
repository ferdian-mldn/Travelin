<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Tour;

class TourController extends Controller
{
    // Endpoint untuk mengambil semua data paket (untuk Homepage)
    public function index()
    {
        $tours = Tour::all();

        return response()->json([
            'status' => 'success',
            'message' => 'Data paket wisata berhasil diambil',
            'data' => $tours
        ], 200);
    }

    // Endpoint untuk mengambil detail 1 paket (untuk Halaman Detail)
    public function show($slug)
    {
        $tour = Tour::where('slug', $slug)->first();

        if (!$tour) {
            return response()->json([
                'status' => 'error',
                'message' => 'Paket wisata tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Detail paket wisata ditemukan',
            'data' => $tour
        ], 200);
    }
}