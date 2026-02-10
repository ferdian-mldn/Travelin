"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Cookies from 'js-cookie'; // Pastikan import ini ada

export default function LandingAuthButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false); // Buat hindari error hydration

  useEffect(() => {
    setMounted(true);
    
    // PERBAIKAN: Cek Token dari COOKIES (Sesuai Login Page kamu)
    const token = Cookies.get('token'); 
    
    // Debugging: Cek di Console browser apakah token terbaca
    console.log("Cek Token di Landing:", token); 

    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Jangan render apa-apa sebelum komponen 'siap' di browser
  if (!mounted) return null;

  // Kalau belum login, return null (ngumpet)
  if (!isLoggedIn) {
    return null;
  }

  // Kalau Login, Tampilkan Tombol Dashboard
  return (
    <div className="absolute top-6 right-6 z-50 animate-fade-in">
      <Link href="/dashboard">
        <button className="
          group flex items-center gap-2
          px-6 py-2.5 
          bg-white/10 hover:bg-white/20 
          backdrop-blur-md border border-white/20
          rounded-full text-white font-medium text-sm transition-all duration-300
          shadow-lg hover:shadow-xl hover:-translate-y-0.5
        ">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
          
          Dashboard Saya
          
          <span className="w-0 overflow-hidden group-hover:w-4 transition-all duration-300">
            →
          </span>
        </button>
      </Link>
    </div>
  );
}