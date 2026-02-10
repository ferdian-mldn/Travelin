"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Menu, X, Search, User, LogOut, LayoutDashboard, ShoppingBag, Settings } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));

    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  if (
    pathname.startsWith("/checkout") || 
    pathname.startsWith("/login") || 
    pathname.startsWith("/register") || 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/tours/")
  ) {
    return null;
  }

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-[#050505]/95 backdrop-blur-md border-b border-white/10 py-4 shadow-xl" 
          : "bg-transparent py-6"
      }`}
    >
      {/* STRATEGI BARU: 
        Pakai 'flex' biasa, tapi sisi Kiri dan Kanan dikasih 'flex-1'.
        Ini bikin mereka punya "bobot" sama untuk mendorong Menu ke tengah.
      */}
      <div className="w-full px-6 md:px-12 flex items-center">
        
        {/* === [KIRI] LOGO (Flex-1: Dorong ke Kiri) === */}
        <div className="flex-1 flex justify-start items-center">
           {/* LOGO MATI (Bukan Button, Cursor Default) */}
           <div className="text-2xl font-serif font-bold text-white tracking-wide flex items-center gap-1 select-none cursor-default">
             TRAVELIN<span className="text-orange-600">.</span>
           </div>
        </div>

        {/* === [TENGAH] MENU (Flex-None: Diam di Tengah) === */}
        <div className="hidden md:flex items-center gap-8 lg:gap-12">
          <Link href="/" className="text-sm font-medium text-white hover:text-orange-500 transition relative group py-2">
            Beranda
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/tours" className="text-sm font-medium text-gray-300 hover:text-white transition relative group py-2">
            Paket Wisata
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
          </Link>
          <Link href="/about" className="text-sm font-medium text-gray-300 hover:text-white transition relative group py-2">
            Tentang Kami
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-500 transition-all group-hover:w-full"></span>
          </Link>
        </div>

        {/* === [KANAN] SEARCH & AUTH (Flex-1: Dorong ke Kanan) === */}
        <div className="flex-1 flex justify-end items-center gap-6">
          
          {/* SEARCH BAR (Hidden di tablet kecil biar gak sempit, muncul di desktop) */}
          <div className="hidden lg:block relative group">
            <input 
              type="text" 
              placeholder="Cari destinasi..." 
              className="bg-black/50 backdrop-blur-md border border-white/50 rounded-full py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-200 focus:outline-none focus:border-orange-500 focus:bg-black/80 transition-all w-48 xl:w-64 shadow-lg"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-white group-focus-within:text-orange-500 transition" />
          </div>

          <div className="hidden lg:block h-6 w-px bg-white/20"></div>

          {/* BUTTONS */}
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="focus:outline-none flex items-center gap-3">
                 <div className="text-right hidden xl:block">
                    <p className="text-sm font-bold text-white leading-none">{user.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-gray-400">Member</p>
                 </div>
                 <div className="h-10 w-10 rounded-full bg-orange-600 p-[2px] cursor-pointer hover:scale-105 transition shadow-lg shadow-orange-600/20">
                    <div className="h-full w-full rounded-full bg-black flex items-center justify-center overflow-hidden">
                       {user.avatar ? (
                         <Image src={user.avatar} width={40} height={40} alt="Avatar" className="object-cover" />
                       ) : (
                         <span className="font-bold text-white">{user.name?.charAt(0)}</span>
                       )}
                    </div>
                 </div>
              </button>
              
              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-56 rounded-xl bg-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95">
                  <div className="p-4 border-b border-white/10">
                     <p className="text-white font-bold text-sm truncate">{user.name}</p>
                     <Link href="/dashboard" className="text-xs text-orange-500 hover:underline mt-1 block font-bold">
                       Buka Dashboard →
                     </Link>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-white/5 flex items-center gap-2 transition">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-bold text-white hover:text-orange-500 transition">
                Masuk
              </Link>
              <Link href="/register" className="bg-orange-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-orange-700 hover:shadow-lg hover:shadow-orange-600/30 transition-all transform hover:-translate-y-0.5">
                Daftar Gratis
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE TOGGLE (Tetap di kanan) */}
        <div className="md:hidden flex items-center gap-4">
          <Search className="w-5 h-5 text-white" />
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* MOBILE DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-6 shadow-2xl h-screen">
           <Link href="/" className="text-2xl font-serif text-white">Beranda</Link>
           <Link href="/tours" className="text-2xl font-serif text-white">Paket Wisata</Link>
           <Link href="/about" className="text-2xl font-serif text-white">Tentang Kami</Link>
           <div className="h-px bg-white/10 w-full"></div>
           {user ? (
             <Link href="/dashboard" className="text-xl font-bold text-orange-500">Dashboard Saya</Link>
           ) : (
             <Link href="/login" className="w-full bg-orange-600 text-white py-4 rounded-xl text-center font-bold text-lg">Masuk / Daftar</Link>
           )}
        </div>
      )}
    </nav>
  );
}