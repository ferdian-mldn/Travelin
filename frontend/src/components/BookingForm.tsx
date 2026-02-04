"use client";
import { useState, useRef } from "react";
import { Calendar, CreditCard, Loader2 } from "lucide-react"; // Tambah Loader2
import { Tour } from "@/types";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface BookingFormProps {
  tour: Tour;
}

export default function BookingForm({ tour }: BookingFormProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [date, setDate] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State Loading
  
  const dateInputRef = useRef<HTMLInputElement>(null);

  const pricePerPerson = Number(tour.price);
  const subtotal = pricePerPerson * quantity;
  const adminFee = subtotal * 0.05;
  const total = subtotal + adminFee;

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // --- FUNGSI CREATE BOOKING ---
  const handleBooking = async () => {
    // 1. Cek Login dulu
    const token = Cookies.get("token");
    if (!token) {
      alert("Silakan login terlebih dahulu untuk melakukan pemesanan.");
      router.push("/login");
      return;
    }

    setIsLoading(true);

    try {
      // 2. Kirim Data ke Laravel
      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // Kirim Token User
        },
        body: JSON.stringify({
          tour_id: tour.id,
          travel_date: date,
          quantity: quantity,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal booking");

      // 3. Sukses! Redirect ke halaman sukses (nanti kita buat)
      alert("Booking Berhasil! ID Transaksi: " + data.data.id);
      router.push("/dashboard"); // Sementara lempar ke dashboard dulu

    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
      <h3 className="mb-6 font-serif text-2xl text-white">Detail Pemesanan</h3>
      
      {/* Input Tanggal */}
      <div className="mb-6">
        <label className="mb-2 block text-sm text-gray-400">Pilih Tanggal Keberangkatan</label>
        <div 
          onClick={() => dateInputRef.current?.showPicker()} 
          className="relative cursor-pointer group"
        >
          <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500 transition group-hover:text-orange-500" />
          <input
            ref={dateInputRef}
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0"
          />
        </div>
      </div>

      {/* Input Jumlah Peserta */}
      <div className="mb-8">
        <label className="mb-2 block text-sm text-gray-400">Jumlah Peserta</label>
        <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-black/40 p-2">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20">-</button>
          <span className="flex-1 text-center font-semibold text-white">{quantity} Orang</span>
          <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600 text-white hover:bg-orange-700">+</button>
        </div>
      </div>

      {/* Ringkasan Harga */}
      <div className="space-y-3 border-t border-white/10 pt-6 text-sm text-gray-300">
        <div className="flex justify-between"><span>Harga Paket (x{quantity})</span><span>{formatRupiah(subtotal)}</span></div>
        <div className="flex justify-between text-green-400"><span>Biaya Layanan & Admin</span><span>{formatRupiah(adminFee)}</span></div>
        <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-bold text-white"><span>Total Pembayaran</span><span>{formatRupiah(total)}</span></div>
      </div>

      {/* TOMBOL BAYAR UPDATE */}
      <button 
        onClick={handleBooking} // Panggil fungsi di sini
        disabled={!date || isLoading}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-orange-600 py-4 font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-700"
      >
        {isLoading ? (
          <><Loader2 className="animate-spin h-5 w-5" /> Memproses...</>
        ) : (
          <><CreditCard className="h-5 w-5" /> Lanjut Pembayaran</>
        )}
      </button>
    </div>
  );
}