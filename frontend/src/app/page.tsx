import Hero from "@/components/Hero";
import TourCard from "@/components/TourCard";
import LandingAuthButton from "@/components/LandingAuthButton";
import { Tour } from "@/types";

async function getTours() {
  const res = await fetch("http://127.0.0.1:8000/api/tours", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil data paket wisata");
  }

  const json = await res.json();
  return json.data as Tour[];
}

export default async function Home() {
  const tours = await getTours();

  return (
    <main className="relative bg-[#050505] min-h-screen">
      
      {/* Tombol Login Floating */}
      <LandingAuthButton />

      {/* Hero Section */}
      <Hero />

      {/* Daftar Paket Wisata */}
      <section className="relative z-10 -mt-20 px-6 pb-20 md:px-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <span className="text-sm font-medium uppercase tracking-widest text-orange-500">
              Destinasi Pilihan
            </span>
            <h2 className="mt-2 font-serif text-4xl text-white">
              Jelajahi Surga Tersembunyi
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>
    </main>
  );
}
