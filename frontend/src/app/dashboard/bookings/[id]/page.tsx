"use client";

import { use } from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"; // Tambah useRouter buat refresh
import { ArrowLeft, Calendar, MapPin, User, Ticket, Loader2, AlertTriangle, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface TransactionDetail {
  id: number;
  status: string;
  total_price: string;
  travel_date: string;
  quantity: number;
  tour: {
    name: string;
    location: string;
    thumbnail: string;
    duration_days: number;
  };
}

export default function BookingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter(); // Init router
  
  const [data, setData] = useState<TransactionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false); // State loading buat tombol cancel

  // Fetch Data
  useEffect(() => {
    const fetchDetail = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
           setIsLoading(false);
           return;
        }

        const json = await res.json();
        setData(json.data);
      } catch (error) {
        console.error("Error network:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  // --- FUNGSI CANCEL DENGAN VALIDASI ---
  const handleCancelBooking = async () => {
    // 1. Validasi Konfirmasi (Browser Alert)
    const isConfirmed = window.confirm(
      "⚠️ PERINGATAN PEMBATALAN\n\nApakah Anda yakin ingin membatalkan pesanan ini?\nTindakan ini tidak dapat dikembalikan."
    );

    // Kalau user klik "Cancel" di popup, stop proses
    if (!isConfirmed) return;

    setIsCancelling(true);
    const token = Cookies.get("token");

    try {
      // 2. Tembak API Cancel ke Laravel
      const res = await fetch(`http://127.0.0.1:8000/api/bookings/${id}/cancel`, {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Gagal membatalkan pesanan");
      }

      // 3. Sukses
      alert("✅ Pesanan berhasil dibatalkan.");
      
      // Update state lokal biar UI langsung berubah jadi 'cancelled' tanpa refresh
      if (data) {
        setData({ ...data, status: 'cancelled' });
      }
      
      router.refresh(); // Refresh data server component kalau ada

    } catch (error: any) {
      alert("❌ " + error.message);
    } finally {
      setIsCancelling(false);
    }
  };

  const formatRupiah = (val: string | number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
    </div>
  );
  
  if (!data) return (
    <div className="min-h-screen bg-[#050505] pt-24 px-10 text-white text-center">
        <h2 className="text-2xl font-bold mb-4">Data tidak ditemukan</h2>
        <Link href="/dashboard" className="text-orange-500 hover:underline">Kembali ke Dashboard</Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-24 pb-10 px-4 md:px-10">
      <div className="max-w-4xl mx-auto">
        
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition">
          <ArrowLeft className="w-5 h-5" /> Kembali ke Dashboard
        </Link>

        <div className="rounded-3xl border border-white/10 bg-white/5 overflow-hidden backdrop-blur-sm">
          
          <div className="relative h-64 w-full">
            <Image src={data.tour.thumbnail} fill className="object-cover" alt={data.tour.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent" />
            
            <div className="absolute bottom-6 left-6 z-10">
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3 inline-block ${
                 data.status === 'pending' ? 'bg-yellow-500 text-black' : 
                 data.status === 'paid' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}>
                {data.status}
              </span>
              <h1 className="text-3xl font-serif text-white shadow-black drop-shadow-lg">{data.tour.name}</h1>
              <p className="flex items-center gap-2 text-gray-200 mt-1 font-medium">
                <MapPin className="w-4 h-4 text-orange-500" /> {data.tour.location}
              </p>
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-2 gap-8">
            
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-white/10 pb-4">Info Perjalanan</h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <Calendar className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Tanggal Keberangkatan</p>
                  <p className="font-semibold text-lg">{data.travel_date}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <User className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Jumlah Peserta</p>
                  <p className="font-semibold text-lg">{data.quantity} Orang</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-white/10">
                  <Ticket className="w-6 h-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Order ID</p>
                  <p className="font-semibold text-lg font-mono">#{data.id}</p>
                </div>
              </div>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/10 h-fit">
              <h3 className="text-gray-400 text-sm mb-2">Total Tagihan</h3>
              <p className="text-3xl font-bold text-white mb-6">
                {formatRupiah(data.total_price)}
              </p>

              {/* LOGIKA TOMBOL BERDASARKAN STATUS */}
              
              {data.status === 'pending' && (
                <div className="space-y-3">
                    <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-xl text-yellow-200 text-sm flex gap-3">
                       <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                       <p>Silakan selesaikan pembayaran melalui Dashboard sebelum jatuh tempo.</p>
                    </div>

                    {/* TOMBOL CANCEL (Hanya muncul kalau status Pending) */}
                    <button 
                        onClick={handleCancelBooking}
                        disabled={isCancelling}
                        className="w-full mt-4 flex items-center justify-center gap-2 border border-red-500/50 text-red-400 font-bold py-3 rounded-xl hover:bg-red-500/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCancelling ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" /> Membatalkan...
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4" /> Batalkan Pesanan
                            </>
                        )}
                    </button>
                </div>
              )}

              {data.status === 'paid' && (
                <button className="w-full bg-green-600/20 text-green-400 font-bold py-4 rounded-xl border border-green-500/50 cursor-default flex justify-center gap-2">
                  ✅ Pembayaran Lunas
                </button>
              )}

              {data.status === 'cancelled' && (
                <div className="w-full bg-red-600/10 text-red-400 font-bold py-4 rounded-xl border border-red-500/30 flex justify-center gap-2 items-center cursor-default">
                  <XCircle className="w-5 h-5" /> Pesanan Dibatalkan
                </div>
              )}
              
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}