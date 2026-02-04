"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Calendar, MapPin, Clock, CreditCard, Loader2, AlertCircle } from "lucide-react";
import { Tour } from "@/types";

// Tipe data Booking (Gabungan Booking + Tour)
interface BookingData {
  id: number;
  travel_date: string;
  status: "pending" | "paid" | "cancelled";
  total_price: string;
  quantity: number;
  tour: Tour; // Data tour nempel di sini
}

export default function Dashboard() {
  const router = useRouter();
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = Cookies.get("token");
    const userData = Cookies.get("user");

    if (!token) {
      router.push("/login");
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }

    fetchBookings(token);
  }, []);

  const fetchBookings = async (token: string) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (res.ok) {
        setBookings(json.data);
      }
    } catch (error) {
      console.error("Gagal ambil data", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Format Rupiah
  const formatRupiah = (val: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(val));
  };

  // Warna Badge Status
  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid": return "bg-green-500/20 text-green-400 border-green-500/50";
      case "pending": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "cancelled": return "bg-red-500/20 text-red-400 border-red-500/50";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  // ... state lain ...
  const [processingId, setProcessingId] = useState<number | null>(null); // Untuk loading per tombol

  // FUNGSI BAYAR
  const handlePayment = async (bookingId: number) => {
    // Konfirmasi dulu
    if (!confirm("Apakah Anda yakin ingin melakukan pembayaran sebesar tagihan ini?")) return;

    setProcessingId(bookingId); // Nyalakan loading di tombol spesifik
    const token = Cookies.get("token");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/bookings/${bookingId}/pay`, {
        method: "POST",
        headers: { 
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Gagal memproses pembayaran");

      alert("🎉 Pembayaran Berhasil! Tiket Anda sudah terbit.");
      
      // Refresh data tanpa reload halaman
      fetchBookings(token!); 

    } catch (error: any) {
      alert(error.message);
    } finally {
      setProcessingId(null); // Matikan loading
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505] text-white">
        <Loader2 className="animate-spin h-8 w-8 text-orange-500" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] pt-24 pb-12 px-6 md:px-20">
      <div className="mx-auto max-w-6xl">
        
        {/* Header Dashboard */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-3xl text-white">Dashboard Saya</h1>
            <p className="text-gray-400">Selamat datang kembali, {user?.name}</p>
          </div>
          <Link href="/tours" className="rounded-full bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition">
            + Pesan Perjalanan Baru
          </Link>
        </div>

        {/* List Booking */}
        <div className="space-y-6">
          {bookings.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Calendar className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-white">Belum ada perjalanan</h3>
              <p className="mt-2 text-gray-400">Anda belum memesan paket wisata apapun.</p>
              <Link href="/tours" className="mt-6 inline-block rounded-full bg-orange-600 px-8 py-3 font-semibold text-white hover:bg-orange-700 transition">
                Jelajahi Paket
              </Link>
            </div>
          ) : (
            bookings.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition hover:bg-white/10">
                <div className="flex flex-col gap-6 md:flex-row md:items-center">
                  
                  {/* Gambar Thumbnail (Kiri) */}
                  <div className="relative h-48 w-full md:h-32 md:w-48 flex-shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={item.tour.thumbnail}
                      alt={item.tour.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                    />
                  </div>

                  {/* Info Detail (Tengah) */}
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-wider ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                      <span className="text-xs text-gray-500">Order ID: #{item.id}</span>
                    </div>
                    
                    <h3 className="font-serif text-xl font-bold text-white mb-2">{item.tour.name}</h3>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" /> {item.travel_date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> {item.tour.duration_days} Hari
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" /> {item.tour.location}
                      </div>
                    </div>
                  </div>

                  {/* Harga & Aksi (Kanan) */}
                  <div className="flex flex-col items-start gap-3 md:items-end md:border-l md:border-white/10 md:pl-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Total Tagihan ({item.quantity} Pax)</p>
                      <p className="text-xl font-bold text-white">{formatRupiah(item.total_price)}</p>
                    </div>

                    {item.status === 'pending' && (
  <button 
    onClick={() => handlePayment(item.id)} // <--- Pasang fungsi di sini
    disabled={processingId === item.id} // Disable kalau lagi loading
    className="flex items-center gap-2 rounded-full bg-orange-600 px-6 py-2 text-sm font-bold text-white shadow-lg shadow-orange-600/20 transition hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
  >
    {processingId === item.id ? (
      <>
        <Loader2 className="animate-spin h-4 w-4" /> Memproses...
      </>
    ) : (
      <>
        <CreditCard className="h-4 w-4" /> Bayar Sekarang
      </>
    )}
  </button>
)}
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
}