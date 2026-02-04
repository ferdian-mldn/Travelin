"use client";
import { motion } from "framer-motion";
import { MapPin, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image Sinematik */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop")' }} // Ganti dengan foto HD Bali/Raja Ampat
      >
        {/* Overlay Gradient Premium */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#050505]" />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 flex h-full flex-col justify-center px-6 md:px-20">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <MapPin className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-medium tracking-wide text-white">Raja Ampat, Indonesia</span>
          </div>

          <h1 className="font-serif text-6xl md:text-8xl leading-tight text-white drop-shadow-xl">
            Jalanin Liburanmu <br />
            <span className="text-white/80">dengan Cara Terbaik.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg text-gray-200 font-light leading-relaxed">
            Jelajahi keindahan Indonesia dengan pengalaman yang dirancang khusus. 
            Nyaman, aman, dan penuh cerita tak terlupakan.
          </p>

          <div className="mt-10 flex gap-4">
            <button className="group relative overflow-hidden rounded-full bg-white px-8 py-4 text-black transition-all hover:bg-gray-200">
              <span className="relative z-10 flex items-center gap-2 font-semibold">
                Explore Destinations <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>

            <button className="rounded-full border border-white/30 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10">
              Play Video
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}