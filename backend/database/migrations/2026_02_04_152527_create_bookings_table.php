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
    Schema::create('bookings', function (Blueprint $table) {
        $table->id();
        $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Siapa yg pesan
        $table->foreignId('tour_id')->constrained()->onDelete('cascade'); // Paket apa
        $table->date('travel_date'); // Kapan berangkat
        $table->integer('quantity'); // Berapa orang
        $table->decimal('total_price', 15, 2); // Total duit (Harga x Orang + Fee)
        $table->enum('status', ['pending', 'paid', 'cancelled'])->default('pending'); // Status bayar
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
