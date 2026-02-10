import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* 1. Sidebar (Fixed di kiri) */}
      <DashboardSidebar />

      {/* 2. Konten Utama (Geser ke kanan sebesar lebar sidebar) */}
      <div className="md:ml-64 min-h-screen transition-all duration-300">
        {/* Kita bisa tambah Topbar Dashboard disini kalau mau (opsional) */}
        
        {children}
      </div>
    </div>
  );
}