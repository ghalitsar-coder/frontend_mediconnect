// components/LogoutButton.tsx
"use client";

import { useRouter } from "next/navigation";
import { api, clearAuthSessionMarkers } from "@/lib/api-client";
import { LogOut } from "lucide-react";

export function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Panggil API logout backend (credentials: 'include' otomatis)
      await api.auth.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Hapus penanda session di client (localStorage / non-HttpOnly cookie)
      clearAuthSessionMarkers();
      
      // Redirect ke halaman utama dan refresh data client
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLogout}
      className={`w-full text-destructive cursor-pointer flex items-center ${className}`}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </button>
  );
}