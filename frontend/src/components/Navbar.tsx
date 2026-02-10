"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { User, LogOut, Menu, X } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    setUser(null);
    router.push("/login");
    router.refresh();
  };

  const hideNavbar =
    pathname === "/" ||
    pathname.startsWith("/tours/") ||
    pathname.startsWith("/checkout/") ||
    ["/login", "/register"].includes(pathname);

  if (hideNavbar) return null;

  return (
    <>
      {pathname.startsWith("/tours/") && (
        <Link
          href="/"
          className="absolute top-5 left-5 z-50 text-white bg-black/20 p-2 rounded-full"
        >
          ← Kembali
        </Link>
      )}

      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          isScrolled
            ? "bg-black/60 backdrop-blur-md border-b border-white/10 py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="flex w-full items-center justify-between px-6 md:px-12">
          <Link
            href="/"
            className="font-serif text-2xl font-bold text-white tracking-widest"
          >
            TRAVELIN<span className="text-orange-500">.</span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white hover:text-orange-400 transition">
              Beranda
            </Link>
            <Link href="/tours" className="text-sm font-medium text-white hover:text-orange-400 transition">
              Paket Wisata
            </Link>
            <Link href="/about" className="text-sm font-medium text-white hover:text-orange-400 transition">
              Tentang Kami
            </Link>

            {user ? (
              <div className="group relative">
                <button className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md transition hover:bg-white/20">
                  <User className="h-4 w-4" />
                  <span>Hai, {user.name.split(" ")[0]}</span>
                </button>

                <div className="absolute right-0 top-full mt-2 w-48 origin-top-right scale-95 opacity-0 transition-all group-hover:scale-100 group-hover:opacity-100 invisible group-hover:visible">
                  <div className="rounded-xl border border-white/10 bg-[#0a0a0a] p-2 shadow-xl">
                    <Link href="/dashboard" className="block rounded-lg px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">
                      Dashboard Saya
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" /> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-gray-200"
              >
                Masuk
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-b border-white/10 p-6 md:hidden flex flex-col gap-4">
            <Link href="/" className="text-white py-2">Beranda</Link>
            <Link href="/tours" className="text-white py-2">Paket Wisata</Link>

            {user ? (
              <>
                <div className="border-t border-white/10 pt-4 text-gray-400 text-sm">
                  Masuk sebagai: {user.name}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-400 py-2 flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="bg-white text-black text-center py-3 rounded-xl font-bold"
              >
                Masuk Sekarang
              </Link>
            )}
          </div>
        )}
      </nav>
    </>
  );
}
