<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
{
    Schema::create('tours', function (Blueprint $table) {
        $table->id();
        $table->string('slug')->unique(); // Untuk URL SEO friendly
        $table->string('name'); // Nama Paket (ex: Hidden Paradise Bali)
        $table->string('location'); // Lokasi (ex: Nusa Penida, Bali)
        $table->text('description'); // Deskripsi emosional
        $table->decimal('price', 15, 2); // Harga
        $table->string('thumbnail'); // Gambar utama
        $table->json('gallery')->nullable(); // Foto-foto tambahan
        $table->integer('duration_days'); // 3 Hari
        $table->float('rating')->default(5.0); // 4.8
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tours');
    }
};
