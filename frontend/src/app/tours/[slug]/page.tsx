import Image from "next/image";
import Link from "next/link";
import { MapPin, Clock, Star, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Tour } from "@/types";

// Fungsi untuk mengambil detail data dari Laravel berdasarkan SLUG
async function getTour(slug: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/tours/${slug}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  const json = await res.json();
  return json.data as Tour;
}

// Format Rupiah
const formatRupiah = (price: string) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(price));
};

export default async function TourDetail({ params }: { params: Promise<{ slug: string }> }) {
  
  // 2. Wajib di-await dulu sebelum diambil slug-nya
  const { slug } = await params;

  // 3. Panggil fungsi getTour menggunakan slug yang sudah matang
  const tour = await getTour(slug);

  if (!tour) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-white">
        <h1 className="text-2xl font-bold">404 - Tidak Ditemukan</h1>
        <p>Paket wisata dengan slug "{slug}" tidak ada di database.</p>
        <Link href="/" className="text-orange-500 hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-orange-500 selection:text-white">
      {/* 1. Header Image Fullscreen (Parallax effect simple) */}
      <div className="relative h-[60vh] w-full">
        <Image
          src={tour.thumbnail}
          alt={tour.name}
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
        
        {/* Tombol Kembali */}
        <div className="absolute left-6 top-6 z-10">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-4 py-2 text-sm backdrop-blur-md transition hover:bg-black/50"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali
          </Link>
        </div>

        {/* Judul Besar di Header */}
        <div className="absolute bottom-0 left-0 w-full px-6 pb-12 md:px-20">
          <div className="flex items-center gap-2 text-orange-400">
            <MapPin className="h-5 w-5" />
            <span className="text-lg font-medium tracking-wide">{tour.location}</span>
          </div>
          <h1 className="mt-2 font-serif text-5xl md:text-7xl leading-tight text-white drop-shadow-2xl">
            {tour.name}
          </h1>
        </div>
      </div>

      {/* 2. Konten Utama (2 Kolom) */}
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-20 lg:grid lg:grid-cols-3 lg:gap-16">
        
        {/* Kolom Kiri: Deskripsi & Gallery */}
        <div className="lg:col-span-2">
          {/* Rating & Stats */}
          <div className="mb-8 flex flex-wrap items-center gap-6 border-b border-white/10 pb-8 text-gray-300">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              <span className="text-white font-bold">{tour.rating}</span> (Review Excellent)
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span>{tour.duration_days} Hari Perjalanan</span>
            </div>
          </div>

          {/* Deskripsi */}
          <h2 className="mb-4 font-serif text-3xl">Tentang Perjalanan Ini</h2>
          <p className="leading-relaxed text-gray-300 text-lg mb-8 whitespace-pre-line">
            {tour.description}
          </p>

          {/* Fasilitas (Hardcoded sementara biar cantik) */}
          <h3 className="mb-4 font-serif text-2xl">Fasilitas Premium</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {["Hotel Bintang 4/5", "Transportasi Private AC", "Makan Sesuai Itinerary", "Dokumentasi Drone & Kamera", "Tiket Masuk Wisata", "Guide Profesional"].map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-300">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                {item}
              </div>
            ))}
          </div>

          {/* Gallery Grid (Ambil dari JSON Gallery) */}
           {/* Note: Karena gallery di DB formatnya JSON string, kita perlu parse dulu jika mau ditampilkan. 
               Untuk tahap ini kita tampilkan statis dulu dari data dummy thumbnail biar aman. */}
        </div>

        {/* Kolom Kanan: Sticky Booking Card */}
        <div className="relative mt-12 lg:mt-0">
          <div className="sticky top-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-1">Mulai Dari</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold text-white">{formatRupiah(tour.price)}</span>
              <span className="text-sm text-gray-400">/ orang</span>
            </div>

            <div className="space-y-4">
              <Link 
  href={`/checkout/${tour.slug}`}
  className="block w-full text-center rounded-full bg-orange-600 py-4 font-semibold text-white transition hover:bg-orange-700 shadow-lg shadow-orange-600/20"
>
  Booking Sekarang
</Link>
              <button className="w-full rounded-full border border-white/20 py-4 font-semibold text-white transition hover:bg-white/10">
                Tanya via WhatsApp
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-gray-500">
              *Pembayaran aman & terpercaya via Transfer Bank
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}