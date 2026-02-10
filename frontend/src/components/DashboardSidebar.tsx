"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { 
  LayoutDashboard, ShoppingBag, CreditCard, FileText, 
  User, Settings, LogOut, HelpCircle, MessageSquare 
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) setUser(JSON.parse(userData));
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/login");
  };

  // Helper untuk cek link aktif
  const isActive = (path: string) => pathname === path;

  // Class helper
  const linkClass = (path: string) => `
    flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-medium
    ${isActive(path) 
      ? "bg-orange-600 text-white shadow-lg shadow-orange-900/20" 
      : "text-gray-400 hover:bg-white/5 hover:text-white"}
  `;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0a0a0a] border-r border-white/10 flex flex-col z-40 hidden md:flex">
      
      {/* 1. HEADER (Logo & User) */}
      <div className="p-6 border-b border-white/5">
        <Link href="/" className="text-2xl font-serif font-bold text-white tracking-wide block mb-6">
          TRAVELIN<span className="text-orange-500">.</span>
        </Link>
        
        <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate">{user?.name || "Loading..."}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* 2. MENU UTAMA (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-2">Main Menu</p>
        
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          <LayoutDashboard className="w-5 h-5" /> Dashboard
        </Link>
        <Link href="/dashboard/bookings" className={linkClass("/dashboard/bookings")}>
          <ShoppingBag className="w-5 h-5" /> Pesanan Saya
        </Link>
        <Link href="/dashboard/payments" className={linkClass("/dashboard/payments")}>
          <CreditCard className="w-5 h-5" /> Pembayaran
        </Link>
        <Link href="/dashboard/invoices" className={linkClass("/dashboard/invoices")}>
          <FileText className="w-5 h-5" /> Invoice / Kwitansi
        </Link>

        <p className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 mt-6">Akun & Lainnya</p>
        
        <Link href="/dashboard/profile" className={linkClass("/dashboard/profile")}>
          <User className="w-5 h-5" /> Profil Saya
        </Link>
        <Link href="/dashboard/settings" className={linkClass("/dashboard/settings")}>
          <Settings className="w-5 h-5" /> Pengaturan
        </Link>
        
        {/* Menu Opsional */}
        <Link href="/dashboard/help" className={linkClass("/dashboard/help")}>
          <HelpCircle className="w-5 h-5" /> Bantuan
        </Link>
        <Link href="/dashboard/support" className={linkClass("/dashboard/support")}>
          <MessageSquare className="w-5 h-5" /> Live Chat Support
        </Link>
      </div>

      {/* 3. FOOTER (Logout) */}
      <div className="p-4 border-t border-white/5">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-medium"
        >
          <LogOut className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
}