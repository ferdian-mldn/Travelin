import Hero from "@/components/Hero";
import TourCard from "@/components/TourCard";
import { Tour } from "@/types";
// HAPUS BARIS IMPORT LandingAuthButton DISINI

async function getTours() {
  const res = await fetch("http://127.0.0.1:8000/api/tours", {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch tours");
  }

  const json = await res.json();
  return json.data; 
}

export default async function Home() {
  const tours: Tour[] = await getTours();

  return (
    <main>
      {/* HAPUS <LandingAuthButton /> DARI SINI 
         Karena akses dashboard sekarang sudah ada di Navbar (Pojok Kanan Atas)
      */}
      
      <Hero />

      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto" id="tours">
        <div className="mb-12">
          <h3 className="text-orange-500 font-bold uppercase tracking-widest text-sm mb-2">
            Destinasi Pilihan
          </h3>
          <h2 className="text-4xl md:text-5xl font-serif text-white">
            Jelajahi Surga Tersembunyi
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>
    </main>
  );
}