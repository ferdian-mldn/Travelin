"use client";

import { use } from "react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";
import { Tour } from "@/types";
import BookingForm from "@/components/BookingForm";

async function getTour(slug: string) {
  const res = await fetch(`http://127.0.0.1:8000/api/tours/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data as Tour;
}

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [tour, setTour] = useState<Tour | null>(null);

  useEffect(() => {
    getTour(slug).then(setTour);
  }, [slug]);

  if (!tour) return <div className="p-10 text-white">Loading...</div>;

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="mx-auto max-w-6xl px-6 py-10 md:px-20">
        
        <Link
          href={`/tours/${slug}`}
          className="mb-8 inline-flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <ArrowLeft className="h-5 w-5" /> Batalkan Booking
        </Link>

        <h1 className="mb-2 font-serif text-4xl">Checkout Perjalanan</h1>
        <p className="mb-10 text-gray-400">
          Lengkapi data perjalanan Anda untuk melanjutkan.
        </p>

        <div className="grid gap-12 lg:grid-cols-2">
          
          <div>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <div className="relative h-64 w-full">
                <Image
                  src={tour.thumbnail}
                  alt={tour.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <div className="mb-2 flex items-center gap-2 text-sm text-orange-400">
                  <MapPin className="h-4 w-4" /> {tour.location}
                </div>
                <h2 className="mb-4 font-serif text-2xl">{tour.name}</h2>
                <p className="text-sm leading-relaxed text-gray-400 line-clamp-3">
                  {tour.description}
                </p>
              </div>
            </div>
          </div>

          <div>
            <BookingForm tour={tour} />
          </div>

        </div>
      </div>
    </main>
  );
}
