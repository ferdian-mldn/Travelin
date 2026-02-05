import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // <--- Import Navbar
import Script from "next/script";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  title: "TRAVELIN - Jalanin Liburanmu",
  description: "Platform travel premium untuk pengalaman tak terlupakan.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <head>
    {/* Script Midtrans Snap (Sandbox) */}
    <Script
      src="https://app.sandbox.midtrans.com/snap/snap.js"
      data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
      strategy="lazyOnload" // Load santai biar gak berat
    />
  </head>
      <body className="bg-[#050505] text-white antialiased selection:bg-orange-500 selection:text-white">
        <Navbar /> {/* <--- PASANG DI SINI */}
        {children}
      </body>
    </html>
  );
}