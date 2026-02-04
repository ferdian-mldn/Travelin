<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tour;

class TourSeeder extends Seeder
{
    public function run(): void
    {
        // Paket 1: Bali
        Tour::create([
            'slug' => 'hidden-paradise-nusa-penida',
            'name' => 'Hidden Paradise Nusa Penida',
            'location' => 'Bali, Indonesia',
            'description' => 'Jelajahi sisi lain Bali yang belum terjamah. Temukan tebing Kelingking yang ikonik, berenang dengan Manta Ray di Crystal Bay, dan nikmati matahari terbenam paling magis dari rumah pohon Molenteng. Ini bukan sekadar liburan, ini adalah pelarian yang Anda butuhkan.',
            'price' => 4500000,
            'thumbnail' => 'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000&auto=format&fit=crop',
            'duration_days' => 3,
            'rating' => 4.9,
            'gallery' => json_encode([
                'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?q=80&w=1000',
                'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=1000'
            ])
        ]);

        // Paket 2: Labuan Bajo
        Tour::create([
            'slug' => 'sailing-komodo-dragon',
            'name' => 'Sailing Komodo Luxury',
            'location' => 'Labuan Bajo, NTT',
            'description' => 'Berlayar di atas Phinisi mewah membelah laut Flores yang biru jernih. Bertemu naga purba Komodo di habitat aslinya, mendaki puncak Padar saat fajar, dan snorkeling di Pink Beach yang surealis. Pengalaman sekali seumur hidup yang wajib Anda rasakan.',
            'price' => 7200000,
            'thumbnail' => 'https://images.unsplash.com/photo-1516690561799-46d8f74f9abf?q=80&w=1000&auto=format&fit=crop',
            'duration_days' => 4,
            'rating' => 5.0,
            'gallery' => json_encode([
                'https://images.unsplash.com/photo-1598422612762-b9134a6cb1b9?q=80&w=1000',
                'https://images.unsplash.com/photo-1596423985392-75d6978411b0?q=80&w=1000'
            ])
        ]);

        // Paket 3: Jepang
        Tour::create([
            'slug' => 'autumn-in-kyoto',
            'name' => 'Autumn in Kyoto',
            'location' => 'Kyoto, Japan',
            'description' => 'Rasakan romantisme musim gugur di kota tua Kyoto. Berjalan di bawah terowongan gerbang Fushimi Inari, menikmati teh matcha otentik di Gion, dan melihat kuil Kinkaku-ji yang berkilau emas dikelilingi daun maple merah menyala.',
            'price' => 18500000,
            'thumbnail' => 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=1000&auto=format&fit=crop',
            'duration_days' => 7,
            'rating' => 4.8,
            'gallery' => json_encode([
                'https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?q=80&w=1000',
                'https://images.unsplash.com/photo-1624253321171-1be53e12f5f4?q=80&w=1000'
            ])
        ]);
    }
}