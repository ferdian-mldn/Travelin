import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- Import Navbar

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "TRAVELIN - Jalanin Liburanmu",
  description: "Platform travel premium untuk pengalaman tak terlupakan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#050505] text-white antialiased selection:bg-orange-500 selection:text-white">
        <Navbar /> {/* <--- PASANG DI SINI */}
        {children}
      </body>
    </html>
  );
}