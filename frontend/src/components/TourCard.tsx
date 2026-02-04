import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Clock } from "lucide-react";
import { Tour } from "@/types";

interface TourCardProps {
  tour: Tour;
}

export default function TourCard({ tour }: TourCardProps) {
  // Format harga jadi Rupiah (IDR)
  const formatRupiah = (price: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(Number(price));
  };

  return (
    <Link href={`/tours/${tour.slug}`} className="group relative block w-full">
      {/* Container Glassmorphism */}
      <div className="relative h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-3 backdrop-blur-md transition-all duration-500 hover:border-white/20 hover:bg-white/10 hover:shadow-2xl hover:shadow-orange-500/10">
        
        {/* Gambar Thumbnail */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl">
          <Image
            src={tour.thumbnail}
            alt={tour.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Badge Rating (Pojok Kanan Atas) */}
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-md">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {tour.rating}
          </div>
        </div>

        {/* Konten Text */}
        <div className="mt-4 px-2 pb-2">
          {/* Lokasi */}
          <div className="mb-2 flex items-center gap-1 text-xs font-medium text-gray-400">
            <MapPin className="h-3 w-3" />
            {tour.location}
          </div>

          {/* Judul */}
          <h3 className="mb-1 font-serif text-xl text-white transition-colors group-hover:text-orange-400">
            {tour.name}
          </h3>

          {/* Harga & Durasi */}
          <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
            <div>
              <p className="text-xs text-gray-400">Mulai dari</p>
              <p className="font-semibold text-white">{formatRupiah(tour.price)}</p>
            </div>
            
            <div className="flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 text-xs text-gray-300">
              <Clock className="h-3 w-3" />
              {tour.duration_days} Hari
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}