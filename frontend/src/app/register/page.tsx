"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function Register() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  
  // State untuk form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Tembak API Register Laravel
      const res = await fetch("http://127.0.0.1:8000/api/register", {
  method: "POST",
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json" // <--- TAMBAHKAN INI WAJIB!
  },
  body: JSON.stringify(formData),
});

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal mendaftar");
      }

      // Simpan Token & User Data
      Cookies.set("token", data.access_token, { expires: 7 }); // Simpan 7 hari
      Cookies.set("user", JSON.stringify(data.user), { expires: 7 });

      // Redirect ke Homepage
      router.push("/");
      router.refresh(); // Refresh agar navbar update
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050505] bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center">
      {/* Overlay Gelap */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Tombol Balik */}
        <Link href="/" className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition">
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </Link>

        {/* Form Card Glassmorphism */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-3xl text-white">Gabung TRAVELIN</h1>
            <p className="mt-2 text-sm text-gray-400">Mulai petualangan premium Anda hari ini.</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-sm text-red-200 border border-red-500/50 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Nama Lengkap"
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Alamat Email"
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password (Min. 8 karakter)"
                required
                className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white placeholder-gray-500 focus:border-orange-500 focus:outline-none transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-6 w-full rounded-full bg-orange-600 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:bg-gray-700 flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : "Daftar Sekarang"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-white hover:text-orange-400 hover:underline">
              Login di sini
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}